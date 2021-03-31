/*
  This module has the knowledge about "hapi" in the architecture that permits the communication with the destination API (WCS).
  Knows the "request" object structure and hence is capable to extract "query" and "payload" and to pass these
  to the "mapper" which doesn't know anything about monty server technology.
  Once the mapper is executed it returns a promise with the "body" of the API response and the handler can
  reply using the hapi "reply" object.

  Let's say that we want to change our server library from "hapi" to "Express": with this architecture only
  the current module will change. It will change the process of extracting from the request object the "query"
  and the "payload" and it will change the way it replies.
  The "mapper" will remain untouched by the library change.
*/

import map from './mapping/map'
import Mapper from './mapping/Mapper'
import { getJsessionidCookieOptions } from './constants/jsessionid-cookie-opts'
import { sessionTimeoutError } from './constants/errors'
import { cookieOptionsUnset } from '../../server/lib/auth'
import createFetch from './api'
import { createGetOrderId } from './mapping/utils/cartUtils'
import {
  createGetCookieFromStore,
  createGetSession,
  doNotGenerateSession,
} from './mapping/utils/sessionUtils'
import WcsCookieCapture from '../lib/wcs-cookie-capture'
import { path } from 'ramda'
import { BACKEND_JWT } from './constants/cookies'

/**
 * [getMapper provides a specific Mapper which may or may not override the Mapper functions]
 * @param {*} args [pathname, query, payload, method, headers, params]
 *                    {String} pathname [hapi endpoint hit by the current request]
 *                    {String} query          [query parameters of the current hapi request]
 *                    {Object} payload        [payload object of the current request]
 *                    {String} method         [current request's method]
 *                    {Object} headers        [headers passed in the current request]
 *                    {Object} params         [contains the request parameters passed throgh the path (e.g.: /api/products/{identifier} => params = { identifier: '123' })]
 *                    {Object} cookies        [cookies passed in the current request]
 * @return {Object} [An instance of a specific mapper associated with the hapi endpoint (inherits Mapper and overrides) or Mapper]
 */
export function getMapper(...args) {
  // selects 1st and 4th argument passed
  const [originEndpoint, , , method] = args

  // matches route based on defined regex and
  // passes defined map mapping function exists
  const handlerData = map.find((el) => {
    return (
      el.re &&
      typeof el.re.test === 'function' &&
      el.re.test(originEndpoint) &&
      el.method === method
    )
  })

  // if specific mapper is defined then use, otherwise fallback to default Mapper
  const SpecificMapper =
    handlerData && handlerData.handler ? handlerData.handler : Mapper

  // e.g.: DeliverySelectorFactory
  const specificMapperIsFactory =
    typeof SpecificMapper.createMapper === 'function'

  // if createMapper is implemented, maps to specific Selector which is
  // already instantiated and returned, or uses Specific
  return specificMapperIsFactory
    ? SpecificMapper.createMapper(...args)
    : new SpecificMapper(...args)
}

/**
 * Returns boolean if API errors from WCS for this endpoint should be debugged
 * @param {*} pathname
 * @return {Boolean}
 */
const shouldDebugErrors = (pathname) => {
  const { DEBUG_UPSTREAM_ERRORS } = process.env
  if (!DEBUG_UPSTREAM_ERRORS) return false

  if (DEBUG_UPSTREAM_ERRORS === '*') return true

  return DEBUG_UPSTREAM_ERRORS.split(',').some((path) => path === pathname)
}

export default function routeHandler(req, reply) {
  const {
    url: { pathname },
    query,
    payload,
    method,
    headers = {},
    params,
    state: cookies,
  } = req

  const userAgent = path(['user-agent'], headers)
  const userAgentCallingSsr = path(['monty-original-user-agent'], headers)
  const shouldNotGenerateSession = doNotGenerateSession({
    userAgentCallingApi: userAgent,
    userAgentCallingSsr,
  })

  const cookieCapture = new WcsCookieCapture(cookies, shouldNotGenerateSession)

  const mapper = exports.getMapper(
    pathname,
    query,
    payload,
    method,
    headers,
    params,
    cookies,
    createFetch({
      debugErrors: shouldDebugErrors(pathname),
      cookieCapture,
    }),
    createGetOrderId(cookieCapture),
    createGetCookieFromStore(cookieCapture),
    createGetSession(cookieCapture),
    cookieCapture
  )

  return mapper
    .execute()
    .then((res) => {
      const response = reply(res.body)

      // We return the jsessionId (for both SSR and CSR). This allows the client/SSR to get the latest jsessionId.
      const responseJsessionId = res.jsessionid
      const secureCookieOptions = getJsessionidCookieOptions(userAgent)
      if (responseJsessionId) {
        response.state('jsessionid', responseJsessionId, secureCookieOptions)
      }

      const capturedCookies = cookieCapture.readForClient()
      const cookiesToSet = res.setCookies
        ? res.setCookies.concat(capturedCookies)
        : capturedCookies

      cookiesToSet.forEach(({ name, value, options }) =>
        response.state(name, value, options || secureCookieOptions)
      )

      if (res.setHeaders) {
        res.setHeaders.forEach(({ name, value }) =>
          response.header(name, value)
        )
      }

      return response.code(res.status || 200)
    })
    .catch((err) => {
      if (err.message === 'wcsSessionTimeout') {
        const response = reply(sessionTimeoutError)
        response.header('session-expired', true)
        response.state(BACKEND_JWT, null, cookieOptionsUnset)

        if (process.env.CLEAR_SESSION_KEY_ON_TIMEOUT === 'true') {
          response.state('jsessionid', null, cookieOptionsUnset)
        }

        return response.code(sessionTimeoutError.errorStatusCode)
      }

      return reply(err)
    })
}
