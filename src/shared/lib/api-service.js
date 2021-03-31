import { path as ramdaPath, pathOr } from 'ramda'
import { getItem, hasItem, setItem } from '../../client/lib/cookie/utils'
import * as logger from '../../client/lib/logger'
import { setApiError, setCmsError } from '../actions/common/errorMessageActions'
import {
  setJsessionid,
  setSessionJwt,
} from '../actions/common/sessionTokenActions'
import {
  getJsessionid,
  getSessionJwt,
} from '../selectors/sessionTokenSelectors'
import { sessionExpired } from '../actions/common/sessionActions'
import { handleRestrictedActionResponse } from '../actions/common/rememberMeActions'
import { isRestrictedActionResponse } from './restricted-actions'
import { sendAnalyticsApiResponseEvent } from '../analytics'
import { getShippingDestination } from '../selectors/shippingDestinationSelectors'
import {
  getRoutePath,
  getRouteSearch,
  selectHostname,
} from '../selectors/routingSelectors'
import { extractCookie, addToCookiesString } from './cookie'
import { isMobileHostname } from './hostname'
import superagent from './superagent'
import { BACKEND_JWT } from '../../server/api/constants/cookies'
// mocks
import { mapMockResponse } from './mockService_mapper'

const __MOCKS__ = true

const prefix = process.browser
  ? `${window.location.protocol}//${window.location.host}`
  : `${process.env.CORE_API_HOST || ''}:${process.env.CORE_API_PORT || 3000}`

export function getCodeFromState(state) {
  const {
    config: { brandCode, region },
  } = state
  return brandCode + region
}

const analyticsHandler = (dispatch, { url, method }, res) => {
  if (process.browser && /\/checkout\//.test(window.location.pathname)) {
    dispatch(
      sendAnalyticsApiResponseEvent({
        apiEndpoint: url
          .split('/')
          .slice(3)
          .join('/')
          .split('?')[0],
        apiMethod: method,
        responseCode: res.statusCode,
      })
    )
  }
  return res
}

const requestWithInspection = (
  dispatch,
  getState,
  context,
  request,
  transactionId
) => {
  const inspectSession = (resp) => {
    console.log('response', resp)
    let response = resp
    const sessionExpiredHeader =
      resp && !resp.cached && resp.headers['session-expired']

    if (!process.browser) {
      const responseCookies = pathOr([], ['headers', 'set-cookie'], resp)
      const responseJsessionId = extractCookie('jsessionid', responseCookies)
      const responseSessionJwt = extractCookie(BACKEND_JWT, responseCookies)

      if (sessionExpiredHeader) {
        // We want to make sure that also on server side rendering if one of the requests sent to WCS to resolve the needs
        // resolves in timeout then we clear the sessionkey from the Redux Store and as a consequence we make sure that we don't keep
        // sending the same on the subsequent requests because that would cause WCS to always reply with timeout and the
        // monty server would get stuck in a loop of logout requests (by design in reaction to a session timeout, monty
        // calls the logout endpoint and then redirects the User to the login page).
        dispatch(setJsessionid(null))
        dispatch(setSessionJwt(null))
      } else {
        if (responseJsessionId) {
          dispatch(setJsessionid(responseJsessionId))
        }
        if (responseSessionJwt) {
          dispatch(setSessionJwt(responseSessionJwt))
        }
      }
    }

    // Attempting a request that is Unauthorised updates the client state so
    // that the 'Remember Me' feature can restrict user actions accordingly.
    if (resp && !resp.cached && isRestrictedActionResponse(resp)) {
      dispatch(handleRestrictedActionResponse(resp))
    }

    if (sessionExpiredHeader) {
      logger.info('api-service', {
        transactionId,
        loggerMessage: 'session-expired',
      })
      response = dispatch(sessionExpired())
    }

    return response
  }

  return request.then(inspectSession, (err) => {
    const result = inspectSession(err.response)

    if (result instanceof Promise) {
      return result.then(
        () => {
          throw err
        },
        () => {
          throw err
        }
      )
    }

    throw err
  })
}

function handleResponse(request, handleError = true, transactionId) {
  return (dispatch, getState, reduxContext = {}) => {
    const requestPromise = (retried) => {
      return requestWithInspection(
        dispatch,
        getState,
        reduxContext,
        request,
        transactionId
      ).catch((error) => {
        return (error.status === 504 || error.statusCode === 504) && !retried
          ? requestPromise(true)
          : Promise.reject(error)
      })
    }

    const requestWithAnalytics = requestPromise()
      .then((res) => analyticsHandler(dispatch, request, res))
      .catch((error) => {
        throw analyticsHandler(dispatch, request, error)
      })

    return handleError
      ? requestWithAnalytics.catch((error) => {
          if (request.url.includes('/api/cms/')) {
            dispatch(setCmsError(error))
          } else if (
            error.response &&
            (error.response.statusCode === 500 ||
              error.response.statusCode === 404)
          ) {
            dispatch(setApiError(error))
          }

          // todo: refactor once UI components support array of server-side validation messages
          const originalError = ramdaPath(
            ['response', 'body', 'originalMessage'],
            error
          )
          const validationError = ramdaPath(
            ['response', 'body', 'validationErrors', 0],
            error
          )
          if (
            originalError === 'Validation error' &&
            validationError !== undefined
          ) {
            error.response.body.message = validationError.message
          }

          throw error
        })
      : requestWithAnalytics
  }
}

const generateTraceId = () =>
  `${Date.now()}R${Math.floor(Math.random() * 1000000, 0)}`

const getTraceId = (reduxContext) => {
  if (hasItem('traceId2')) return getItem('traceId2')

  if (!process.browser && reduxContext.traceId) return reduxContext.traceId

  return generateTraceId()
}

const setTraceId = (request, traceId) => {
  setItem('traceId2', traceId)
  request.set('X-TRACE-ID', traceId)
}

const setPrefShipCtry = (request, country) => {
  if (country) request.set('X-PREF-SHIP', country)
}

const setUserGeo = (request, { xUserGeo }) => {
  if (xUserGeo) request.set('X-USER-GEO', xUserGeo)
}

const httpRequest = (path, data = {}, handleError = true, method = 'GET') => {
  const transactionId = logger.generateTransactionId()
  return (dispatch, getState, reduxContext = {}) => {
    const state = getState()
    const url = `${prefix}/api${path}`
    const request = superagent(method, url)

    request.set('BRAND-CODE', getCodeFromState(state))

    const token = ramdaPath(['auth', 'token'], state)
    const jsessionid = getJsessionid(state)
    const sessionJwt = getSessionJwt(state)
    const traceId = getTraceId(reduxContext)

    logger.info('api-service', {
      loggerMessage: 'HTTP PARAMS',
      transactionId,
      url,
      token,
      jsessionid,
      sessionJwt,
      traceId,
    })

    let hostnameIsMobile

    if (!process.browser) {
      let cookies = ''
      const pathname = getRoutePath(state)
      const search = getRouteSearch(state)
      const hostname = selectHostname(state)
      const referer = `${hostname}${pathname}${encodeURIComponent(search)}`

      if (token) {
        // if request happens as result of dispatching 'needs' in a component, there's no cookie set
        cookies = `token=${token}`
      }

      if (process.env.USE_NEW_HANDLER === 'true') {
        // WCS Api: in this case a server side rendering is happening and the browser sent a jsessionid cookie,
        // and or a BACKEND_JWT cookie,
        // in server-side-renderer the jsessionid value cookie value is saved in the Store and here we are
        // taking that value from the Store and setting a cookie to the request that will be sent to monty hapi API (e.g.: /site-options).
        if (jsessionid) {
          cookies = addToCookiesString(`jsessionid=${jsessionid}`, cookies)
        }
        if (sessionJwt) {
          cookies = addToCookiesString(`${BACKEND_JWT}=${sessionJwt}`, cookies)
        }
      }

      // Retrieving from the state the device type set by server-side-renderer and setting a cookie that
      // will be used in coreApi to send to WCS data about the device making the request.
      const deviceType = ramdaPath(['viewport', 'media'], state)
      cookies = addToCookiesString(`deviceType=${deviceType}`, cookies)

      request.set('Cookie', cookies)

      // Retrieving the referer pathname for requests made by the monty backend from the state and setting
      // it to send to the calls made by the backend to itself.
      request.set('referer', referer)

      // This is needed to make sure in coreApi we have knowledge about the
      // user agent even though the api calls are made from the server side
      // rendering.
      request.set(
        'monty-original-user-agent',
        reduxContext.originalUserAgent || ''
      )

      hostnameIsMobile = ramdaPath(['hostname', 'isMobile'], state)
      setUserGeo(request, reduxContext)
    } else {
      hostnameIsMobile = isMobileHostname(window.location.host)
    }

    // [MJI-1084] This is needed to be able to mark the WCS orders as orders coming from www. or m.
    request.set('monty-mobile-hostname', hostnameIsMobile)

    setTraceId(request, traceId)
    setPrefShipCtry(request, getShippingDestination(state))
    /*eslint-disable*/
    switch (method.toUpperCase()) {
      case 'GET':
        if (__MOCKS__) return mapMockResponse(path, method)
        return dispatch(handleResponse(request, handleError, transactionId))
      case 'POST':
      case 'PUT':
      case 'DELETE':
        if (__MOCKS__) return mapMockResponse(path, method)
        return dispatch(
          handleResponse(request.send(data), handleError),
          transactionId
        )
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }
}

export function get(url, handleError = true) {
  return httpRequest(url, null, handleError)
}

export function post(url, data, handleError = false) {
  return httpRequest(url, data, handleError, 'POST')
}

export function put(url, data, handleError = true) {
  return httpRequest(url, data, handleError, 'PUT')
}

export function del(url, data) {
  return httpRequest(url, data, false, 'DELETE')
}
