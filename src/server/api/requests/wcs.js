import request from 'superagent'
import extendWithProxy from 'superagent-proxy' // eslint-disable-line import/no-unresolved
import {
  mergeCookiesResponse,
  getNewDestination,
  canRequestHaveBody,
  getMontyHeaderDeviceType,
  getCookiesOnWcsResponse,
} from './utils'
import { getBodyOnWcsResponse } from '../utils'
import Boom from 'boom'
import qs from 'qs'

import { simulateTimeout, isTimeoutArmed } from '../../handlers/force-timeout'
import {
  isRememberMeTimeoutArmed,
  simulateRememberMeTimeout,
} from '../../handlers/force-remember-me-timeout'
import { deviceTypes } from './constants'

const {
  WCS_REQUESTS_THROUGH_PROXY: useProxy,
  WCS_PROXY_PROTOCOL: proxyProtocol,
  WCS_PROXY_USERNAME: proxyUsername,
  WCS_PROXY_PASSWORD: proxyPassword,
  WCS_PROXY_URL: proxyUrl,
  WCS_PROXY_PORT: proxyPort,
} = process.env

/**
 * During dev, it's often useful to simulate a WCS response
 * which causes some special behaviour e.g. a session timeout.
 * Each simulation is armed using a URL and will execute on the next
 * api request.
 *
 * The simulations which currently exist are:
 * > Session timeout
 * > Remember me logout response
 *
 * Please see the individual handler files for more specific details.
 */
function getForcedSimulation(clientSessionKey) {
  if (process.env.WCS_ENVIRONMENT === 'prod' || !clientSessionKey) {
    return null
  }

  if (isTimeoutArmed(clientSessionKey)) {
    return simulateTimeout(clientSessionKey)
  }

  if (isRememberMeTimeoutArmed(clientSessionKey)) {
    return simulateRememberMeTimeout(clientSessionKey)
  }

  return null
}

const recursivelyFollowRedirectsAndCollectCookies = (
  destination,
  method,
  query,
  payload,
  cookies = [],
  totalRedirections = 0,
  devicetype = '',
  isMobileHostname,
  clientSessionKey = '',
  traceId = '',
  timeout = 0,
  originalDestination,
  cookieCapture
) => {
  // The "monty" header is necessary on WCS in order to be able to differentiate the orders for
  // mobile hostname from mobile device (monty header = 'mtrue')
  // mobile hostname from dekstop device (monty header = 'mdesktop')
  // mobile hostname from tablet device (monty header = 'mtablet')
  // destkop hostname from mobile device (monty header = 'true')
  // desktop hostname from dekstop device (monty header = 'desktop')
  // desktop hostname from table device (monty header = 'tablet')
  let montyHeader = getMontyHeaderDeviceType(devicetype)

  if (isMobileHostname === 'true' && devicetype !== deviceTypes.apps) {
    montyHeader = `m${montyHeader}`
  }

  request.serialize['application/x-www-form-urlencoded'] = (obj) =>
    qs.stringify(obj, { indices: false })

  if (useProxy === 'true') extendWithProxy(request)

  const requestToSend = canRequestHaveBody(method)
    ? request[method](destination).send(payload)
    : request[method](destination)

  if (useProxy === 'true')
    requestToSend.proxy(
      `${proxyProtocol}://${proxyUsername}:${proxyPassword}@${proxyUrl}:${proxyPort}`
    )

  // Check for any forced simulated responses (dev only)
  const simulation = getForcedSimulation(clientSessionKey)

  const makeRequest =
    simulation ||
    requestToSend
      .query(query)
      .set('Cookie', cookies)
      .set('monty', montyHeader)
      .set('traceId', traceId)
      .set('sessionKey', clientSessionKey)
      .set('montyDeviceType', devicetype)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .timeout(timeout)
      .redirects(0)

  return makeRequest
    .then((res) => {
      const returnCookies = mergeCookiesResponse(res, cookies)

      const body = getBodyOnWcsResponse(res)

      return { cookies: returnCookies, body, status: res.status }
    })
    .catch((err) => {
      if (err.status !== 302 && err.status !== 307 && err.status !== 301) {
        const errorCookies = getCookiesOnWcsResponse(err.response)
        cookieCapture.capture(errorCookies)
        if (err.name === 'SyntaxError') {
          throw Boom.badGateway('Error parsing upstream data', err)
        }

        throw err.status && err.status >= 400
          ? Boom.create(err.status, err.message, err)
          : err
      } else {
        const newCookies = mergeCookiesResponse(err.response, cookies)
        // The threshold was set to 4 (5 redirects) but after checking on WCS side (Karthi) it is clear that in some
        // legitimate scenarios there could be 10 redirects. Setting the threshold to 15 just to be comfortable.
        if (totalRedirections > 15) {
          throw Boom.badGateway(
            'Maximum number of WCS response redirections exceeded'
          )
        }

        const redirectDestination = getNewDestination(err.response)

        return recursivelyFollowRedirectsAndCollectCookies(
          redirectDestination,
          method,
          {},
          payload,
          newCookies,
          totalRedirections + 1,
          devicetype,
          isMobileHostname,
          clientSessionKey,
          traceId,
          timeout,
          originalDestination || destination,
          cookieCapture
        )
      }
    })
}

const wcs = (
  { destination, method, query, payload },
  cookies,
  devicetype,
  isMobileHostname,
  clientSessionKey,
  traceId,
  timeout,
  cookieCapture
) => {
  return recursivelyFollowRedirectsAndCollectCookies(
    destination,
    method,
    query,
    payload,
    cookies,
    0,
    devicetype,
    isMobileHostname,
    clientSessionKey,
    traceId,
    timeout,
    destination,
    cookieCapture
  )
}

export default wcs
