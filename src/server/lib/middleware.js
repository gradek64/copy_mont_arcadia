import Boom from 'boom'
import {
  cookieOptions,
  cookieOptionsUnset,
  cookieOptionsDay,
  cookieOptionsBag,
  cookieOptionsApi,
  verifyJwt,
  signJwt,
} from './auth'
import { getCookieValue, getDRETValue } from '../../shared/lib/cookie'
import { getCacheControl } from '../../shared/lib/cacheable-urls'
import { deviceTypeFromUserAgent } from './device-type'
import { path, pathOr } from 'ramda'
import * as logger from './logger'
import { addCustomAttribute, recordCustomEvent } from './newrelic'

const isAPIRequest = (request) => {
  return request.path.indexOf('api') > -1
}

const getAPISource = () =>
  process.env.USE_NEW_HANDLER === true || process.env.USE_NEW_HANDLER === 'true'
    ? 'CoreAPI'
    : 'ScrAPI'

const getTraceId = (req) =>
  req.headers
    ? getCookieValue(req.headers.cookie, 'traceId2') ||
      req.headers['x-trace-id']
    : ''

const getTrueClientIp = (req) => {
  if (!req.headers['true-client-ip']) {
    return 'NOT-SET'
  }
  return path(['headers', 'true-client-ip'], req)
}

const getBrandCode = (req) =>
  path(['headers', 'BRAND-CODE'], req) || path(['headers', 'brand-code'], req)

const formatRequestForLogger = (request) => {
  return {
    hostname: path(['info', 'hostname'], request),
    method: pathOr('', ['method'], request).toUpperCase(),
    path: request.path,
    headers: request.headers,
    sessionKey: getCookieValue(request.headers.cookie, 'jsessionid') || '',
    dretValue: getDRETValue({ cookies: request.headers.cookie }),
    query: request.query,
    source: getAPISource(),
    traceId: getTraceId(request),
    brandCode: getBrandCode(request),
  }
}

const onRequest = (req, reply) => {
  if (isAPIRequest(req)) {
    const requestObject = formatRequestForLogger(req)
    requestObject.loggerMessage = 'request'
    if (logger.isTraceLoggingEnabled()) {
      requestObject.payload = req.payload
    }
    logger.info('hapi-server', requestObject)
  }

  const deviceTypeCookie = getCookieValue(req.headers.cookie, 'deviceType')
  const userAgentHeader = req.headers['user-agent']
  const deviceType =
    deviceTypeCookie || deviceTypeFromUserAgent(userAgentHeader)

  // We use the following header to send to  server side renderer the device type
  req.headers['monty-client-device-type'] = deviceType

  addCustomAttribute('requestDomain', req.info.hostname)
  addCustomAttribute('true-client-ip', getTrueClientIp(req))
  addCustomAttribute('requestPath', req.url.path)
  addCustomAttribute('requestQuery', req.url.search)
  addCustomAttribute('traceId', getTraceId(req))
  addCustomAttribute('source', getAPISource())
  addCustomAttribute('brandCode', getBrandCode(req))

  const sessionKey = getCookieValue(req.headers.cookie, 'jsessionid')
  if (sessionKey) {
    addCustomAttribute('sessionKey', sessionKey)
  }

  const isRequestFromMontyServer =
    typeof userAgentHeader === 'string' &&
    userAgentHeader.startsWith('node-superagent')
  if (deviceTypeCookie || !isRequestFromMontyServer) {
    addCustomAttribute('deviceType', deviceType)
  }

  addCustomAttribute(
    'viewport',
    getCookieValue(req.headers.cookie, 'viewport') || 'unknown'
  )

  reply.continue()
}

const setRespHeader = (resp, name, value) => {
  if (resp.isBoom) {
    resp.output.headers[name] = value
  } else {
    resp.header(name, value)
  }
}

const setWebToken = (req, reply, cb) => {
  signJwt({ 'arcadia-session-key': req.arcadiaSessionKey }, (err, token) => {
    if (err) {
      return cb(err)
    }

    reply.state('token', token, cookieOptions)
    if (req.state.bagCount) reply.state('bagCount', '0', cookieOptionsBag)

    /*
     * By adding the `session-expired` header to the response to the client the
     * client can know if the Session between it and scrAPI has become expired.
     * See `src/shared/lib/api-service.js` to understand what action(s) the
     * client takes once their Session has expired.
     *
     * The `session-expired` header should be set on the response to the client
     * if, and only if;
     *
     *    1. The Session of the inbound request does not match the Session on
     *    the scrAPI response.
     *    2. This particular request is not the first request from the client.
     *
     * The presence of the `tempsession` cookie on the inbound request signifies
     * that this particular request is not the first request the client has made
     * to the `hapi` API.
     */
    if (req.state.tempsession) {
      reply.state('tempsession', 'false', cookieOptionsUnset)
    } else {
      setRespHeader(req.response, 'session-expired', 'true')
      reply.state('authenticated', null, cookieOptionsUnset)
    }

    return cb()
  })
}

const session = (req, reply) => {
  setRespHeader(req.response, 'x-frame-options', 'SAMEORIGIN')

  reply.state('source', getAPISource(), cookieOptionsApi)

  if (req.path.startsWith('/api/') && !req.disablePreResponse) {
    const { arcadiaSessionKey, jwtPayload } = req

    if (!arcadiaSessionKey && !jwtPayload) {
      reply.state('tempsession', 'true', cookieOptions)

      return reply.continue()
    }

    // Cache-Control header has been set with non zero timeout so continue
    // without setting token. 'session-expired' header causes problems if cached
    // on CDN.
    if (req.isCacheable) {
      return reply.continue()
    }

    const requestSessionKey = jwtPayload && jwtPayload['arcadia-session-key']
    if (arcadiaSessionKey && arcadiaSessionKey !== requestSessionKey) {
      return setWebToken(req, reply, (err) => {
        if (err) {
          // todo: reword this error as it's meaningless when rendered in UI
          return reply(Boom.badImplementation('jwt signing failed', err))
        }

        return reply.continue()
      })
    }
  }

  return reply.continue()
}

const cacheHeaders = (req, reply) => {
  const cacheControl = getCacheControl('hapi', req.url.path)

  if (req.response.statusCode === 200 && cacheControl && req.response.header) {
    req.response.header('Cache-Control', cacheControl)
    req.isCacheable = true
    delete req.arcadiaSessionKey
  }

  return reply.continue()
}

const decodeJwt = (req, reply) => {
  const {
    state: { token },
  } = req
  if (token && typeof token === 'string') {
    verifyJwt(token, (error, payload) => {
      if (error) {
        reply.unstate('token')
        reply(Boom.unauthorized('Invalid JWT', error.message))
      } else {
        req.jwtPayload = payload
        reply.continue()
      }
    })
  } else {
    reply.continue()
  }
}

const reportCompletedOrder = (req) => {
  // @NOTE Between a POST (when the order is created) and a PUT (when order is
  // confirmed after redirect) the response from Scrapi is different
  const completedOrder =
    path(['response', 'source', 'completedOrder'], req) ||
    path(['response', 'source'], req)
  const orderValue = Number(
    (
      parseFloat(pathOr(0, ['totalOrderPrice'], completedOrder)) -
      parseFloat(pathOr(0, ['deliveryPrice'], completedOrder))
    ).toFixed(2)
  )
  const orderItemCount = pathOr([], ['orderLines'], completedOrder).reduce(
    (total, order) => total + pathOr(0, ['quantity'], order),
    0
  )

  const orderObject = {
    orderId: completedOrder.orderId,
    hostname: path(['info', 'hostname'], req),
    brandCode: getBrandCode(req),
    orderValue,
    orderItemCount,
    orderValuePerItem: parseFloat((orderValue / orderItemCount).toFixed(2)),
    source: getAPISource(),
    traceId: getTraceId(req),
    currency: path(['currencyConversion', 'currencyRate'], completedOrder),
  }
  recordCustomEvent('orders', orderObject, true)
  logger.info('hapi-server:order', orderObject)
}

const isOrderCompletedResponse = (endpoint, statusCode, payload) => {
  const isOrderCompleted =
    path(['source', 'completedOrder', 'orderId'], payload) ||
    path(['source', 'orderId'], payload)

  return endpoint === '/api/order' && statusCode === 200 && isOrderCompleted
}

const onPreResponse = (req, reply) => {
  const response = pathOr({}, ['response'], req)
  const statusCode = response.isBoom
    ? path(['output', 'statusCode'], response)
    : path(['statusCode'], response)
  if (isAPIRequest(req)) {
    const payload = response.isBoom
      ? path(['output', 'payload'], response)
      : path(['source'], response)
    const responseObject = {
      loggerMessage: 'response',
      ...formatRequestForLogger(req),
      // response jsessionid
      bsessionKey: path(['_states', 'jsessionid', 'value'], req) || '',
      statusCode,
    }
    if (logger.isTraceLoggingEnabled()) {
      responseObject.payload = payload
    }
    if (response.isBoom && response.data) {
      response.output.payload = {
        ...response.output.payload,
        ...response.data,
      }
    }
    logger.info('hapi-server', responseObject)
  }

  // report newrelic order event
  if (isOrderCompletedResponse(req.path, statusCode, response))
    reportCompletedOrder(req)

  reply.continue()
}

const debug = (req, reply) => {
  if (path(['url', 'query', 'montydebug'], req))
    reply.state('montydebug', 'enabled', cookieOptionsDay)
  reply.continue()
}

const validateQuery = (query, options, next) => {
  try {
    Object.keys(query).forEach((key) => {
      decodeURIComponent(query[key])
    })
    next(null, query)
  } catch (e) {
    next(Boom.badRequest())
  }
}

export {
  onRequest,
  session,
  cacheHeaders,
  decodeJwt,
  onPreResponse,
  debug,
  validateQuery,
  reportCompletedOrder,
}
