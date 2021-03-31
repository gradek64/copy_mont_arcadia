/**
 * This module is responsible for sending requests to the WCS API.
 *
 * This module does not have any knowledge of our 'hapi' server or the mapping
 * activities necessary for the request and the response.
 *
 * All the details of the destination API are here:
 *    - destination url,
 *    - redirection following logic and cookies collection,
 *    - calling the session manager to store the cookies
 *
 * This is the only place with knowledge about JSESSIONID since it is WCS specific.
 */

import pantry from '@ag-digital/pantry'
import recursivelyFollowRedirectsAndCollectCookies from './requests/wcs'
import { extractCookieValue, sessionsClash } from './utils'
import { combineCookies, getGeoCookies } from './requests/utils'
import * as logger from '../lib/logger'
import uuidv4 from 'uuid/v4'
import { verifyJwtSync, signJwtSync } from '../../server/lib/auth'
import { partialAuthenticatedCookies } from './mapping/mappers/account/cookies'
import { getTotalQuantityFromProducts } from '../../shared/lib/product-utilities'
import Boom from 'boom'
import { getTraceIdFromCookie } from '../../shared/lib/cookie'
import { doNotGenerateSession } from '../api/mapping/utils/sessionUtils'
import { getConfigByStoreCode } from '../config'
import basketTransform from './mapping/transforms/basket'
import { path as ramdaPath } from 'ramda'

const bodyAndJsessionIdAndCookies = (res) => {
  return {
    body: res.body,
    jsessionid: res.key,
    cookies: res.cookies,
    status: res.status,
  }
}

export const generateNewSessionKey = (userAgents) => {
  if (doNotGenerateSession(userAgents)) return

  return signJwtSync(uuidv4())
}

function throwForRestrictedUserResponse(body, requestHeaders) {
  const {
    success,
    isLoggedIn,
    rememberMeLogonForm: { loginForm: { logonId, rememberMe } = {} },
    personal_details: { registerType, profileType } = {},
    MiniBagForm: {
      Basket,
      Basket: { products: { Product = [] } = {} } = {},
    } = {},
  } = body

  const basketItemCount = getTotalQuantityFromProducts(Product)
  const headers = {
    'set-cookie': partialAuthenticatedCookies,
  }

  const config = getConfigByStoreCode(requestHeaders['brand-code'])

  const error = Boom.create(401, 'Restricted action', {
    isRestrictedActionResponse: true,
    success,
    isLoggedIn,
    account: {
      basketItemCount,
      email: logonId,
      rememberMe,
      registerType,
      profileType,
    },
    basket: basketTransform(Basket, config.currencySymbol),
  })

  error.output.headers = headers

  throw error
}

const handleRestrictedAction = (body, headers) => {
  if (
    !body.success &&
    body.rememberMeLogonForm &&
    body.rememberMeLogonForm.loginForm &&
    body.rememberMeLogonForm.loginForm.rememberMe === true
  ) {
    throwForRestrictedUserResponse(body, headers)
  }
}

const handleSessionTimeout = (body, argsToLog) => {
  if (body.timeout === true) {
    logger.info('wcs:sessiontimeout', argsToLog)

    throw new Error('wcsSessionTimeout')
  }
}

const handleRedisKeyConflict = (
  isNewUser,
  isUserWithInvalidSessionKey,
  cookies
) => {
  if ((isNewUser || isUserWithInvalidSessionKey) && cookies.length) {
    // We generate a brand new session key if the User is a new one or one with invalid jsessionid (e.g.: User of the coreApi which was using the WCS jsessionid as session key).
    // In both cases there shouldn't be any Redis entry and hence we throw here.

    logger.error('wcs:err', {
      isNewUser,
      isUserWithInvalidSessionKey,
      cookiesLength: cookies.length,
      message: 'generated key already used in Redis',
    })

    throw Boom.badImplementation('Error while retrieving User Session')
  }
}

const getTraceId = (headers) =>
  getTraceIdFromCookie(headers.cookie) || headers['x-trace-id']

const unpackHeaders = (sessionKey, headers) => {
  const clientSessionKey =
    sessionKey || extractCookieValue('jsessionid', headers.cookie)

  // This is the session key that we will pass back to the Client as a cookie and its value will be used as Redis key
  // to collect the collection of WCS cookies represeting the User Session on WCS.
  let key
  let isNewUser
  let isUserWithInvalidSessionKey

  const userAgents = {
    userAgentCallingApi: headers['user-agent'],
    userAgentCallingSsr: headers['monty-original-user-agent'],
  }

  if (clientSessionKey) {
    // Using the client session key to retrieve WCS cookies from Redis
    key = clientSessionKey

    // Verifying that the session key provided by the client has been signed by us.
    try {
      verifyJwtSync(clientSessionKey)
    } catch (err) {
      // e.g.: User that used coreApi before when we were passing back to the Client as session key the WCS jsessionid
      isUserWithInvalidSessionKey = true
      key = generateNewSessionKey(userAgents)
    }
  } else {
    // If the User doesn't have a session key then we generate a new one.
    isNewUser = true

    key = generateNewSessionKey(userAgents)
  }

  return {
    key,
    isNewUser,
    isUserWithInvalidSessionKey,
    deviceType: headers['monty-client-device-type'],
    isMobileHostname: headers['monty-mobile-hostname'],
  }
}

//
// The decoding/encoding is necessary in order to handle both requests, coming from the Client and from the Server (server side rendering).
// e.g.:
// PDP request from the Client:
//      path = /fr/msfr/produit/robes-3457985/afficher-tout-854522/robe-corolle-vert-chartreuse-à-liseré-et-encolure-années-90-6653256
// Refreshing the PDP above (server side rendering of PDP)
//      path = /fr/msfr/produit/robes-3457985/afficher-tout-854522/robe-corolle-vert-chartreuse-%C3%A0-liser%C3%A9-et-encolure-ann%C3%A9es-90-6653256
//
// In both cases we need to produce the destination as:
//      https://msfr.stage.arcadiagroup.ltd.uk/fr/msfr/produit/robes-3457985/afficher-tout-854522/robe-corolle-vert-chartreuse-%C3%A0-liser%C3%A9-et-encolure-ann%C3%A9es-90-6653256
//
const sanitizePath = (path) => {
  try {
    return { path: encodeURI(decodeURI(path)) }
  } catch (err) {
    return { err }
  }
}

const getParamError = ({ hostname, path, noPath, headers, query, payload }) => {
  if (!hostname) return 'Missing mandatory parameter "hostname"'
  if (!path && !noPath) return 'Missing mandatory parameter "path"'
  if (!headers['brand-code']) return 'Missing mandatory header "brand-code"'
  if (typeof query !== 'object' || typeof payload !== 'object')
    return '"query" and "payload" should be objects'
}

const retrieveCookies = (cookieCapture, key) => {
  const pantryParams = {
    host: process.env.REDIS_HOST_FOR_SESSION_STORE,
    port: process.env.REDIS_PORT_FOR_SESSION_STORE,
  }

  return cookieCapture.hasWcsCookies()
    ? pantry(pantryParams)
    : pantry(pantryParams).retrieveSession(key)
}

/**
 * A higher order function that returns a function that handles requests between
 * CoreAPI → WCS. createFetch can enhance the fetch function with the ability to
 * circumvent custom mapper logic i.e. add generic behaviour across all mappers.
 *
 * @return {Function} The fetch function
 */
const createFetch = ({ debugErrors = false, cookieCapture } = {}) => (
  hostname,
  path,
  query,
  payload,
  method = 'get',
  headers = {},
  sessionKey,
  noPath = false,
  timeout
) => {
  const error = getParamError({
    hostname,
    path,
    noPath,
    headers,
    query,
    payload,
  })
  if (error) return Promise.reject(error)

  const result = sanitizePath(path)

  if (result.err) return Promise.reject(result.err)
  path = result.path

  const destination = `${hostname}${path}`

  const {
    key,
    isNewUser,
    isUserWithInvalidSessionKey,
    deviceType,
    isMobileHostname,
  } = unpackHeaders(sessionKey, headers)

  const transactionId = logger.generateTransactionId()
  let redisCookies

  return retrieveCookies(cookieCapture, key)
    .request((cookies) => {
      if (cookieCapture.hasWcsCookies()) {
        cookies = cookieCapture.readForServer()
      }
      const combinedCookies = combineCookies(getGeoCookies(headers), cookies)
      const traceId = getTraceId(headers)

      logger.info('wcs:api', {
        loggerMessage: 'request',
        transactionId,
        method: method.toUpperCase(),
        url: destination,
        sessionKey: key,
        combinedCookies,
        query,
        deviceType,
        isMobileHostname,
        payload: logger.isTraceLoggingEnabled() ? payload : undefined,
      })

      redisCookies = cookies

      handleRedisKeyConflict(isNewUser, isUserWithInvalidSessionKey, cookies)

      return recursivelyFollowRedirectsAndCollectCookies(
        { destination, method, query, payload },
        combinedCookies,
        deviceType,
        isMobileHostname,
        key, // [MJI-1123] adding this just for logging to Google Cloud Big Query purposes (Dual Run analysis)
        traceId,
        timeout,
        cookieCapture
      ).then((wcsResponse) => {
        return { ...wcsResponse, key }
      })
    })
    .saveSession()
    .then(bodyAndJsessionIdAndCookies)
    .then((res) => {
      const body = res && res.body ? res.body : {}

      logger.info('wcs:api', {
        loggerMessage: 'response',
        transactionId,
        method: method.toUpperCase(),
        url: destination,
        sessionKey: key,
        cookies: res.cookies,
        deviceType,
        isMobileHostname,
        statusCode: res.status,
        body: logger.isTraceLoggingEnabled() ? body : undefined,
      })

      const wcsCookies = res.cookies || []
      cookieCapture.capture(wcsCookies)

      handleSessionTimeout(body, {
        method,
        destination,
        sessionKey: key,
        body,
        wcsCookies,
        redisCookies,
        hostname,
        path,
        query,
        status: res.status,
        requestHeaders: headers,
      })

      handleRestrictedAction(body, headers)

      if (sessionsClash(redisCookies, wcsCookies, path)) {
        logger.error('wcs:err', {
          loggerMessage: 'Invalid transition of WC_USERACTIVITY_ID',
          wcsCookies,
          redisCookies,
        })
      }

      return res
    })
    .catch((err) => {
      const errorInfo = {
        loggerMessage: 'response',
        transactionId,
        method: method.toUpperCase(),
        url: destination,
        sessionKey: key,
        cookies: ramdaPath(['output', 'headers', 'cookie'], err),
        deviceType,
        isMobileHostname,
        statusCode: ramdaPath(['output', 'statusCode'], err),
      }
      if (debugErrors) {
        errorInfo.errorResponseDebug = {
          request: err.data.response.req._header,
          response: {
            headers: JSON.stringify(err.data.response.headers, null, 2),
            status: err.data.response.status,
            text: err.data.response.text,
          },
        }
      }
      logger.info('wcs:api', errorInfo)

      // Add the session key, useful for querying by facet in New Relic
      err.sessionKey = key
      throw err
    })
}

export default createFetch
