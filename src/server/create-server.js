import { Server } from 'hapi'
import Inert from 'inert'
import vision from 'vision'
import handlebars from 'handlebars'
import basicAuth from 'hapi-auth-basic'
import { omit } from 'ramda'
import { basicAuthVerification } from './lib/auth'
import dictionaries from '../shared/constants/dictionaries'
import { setServerSideDictionaries } from '../shared/lib/localisation'
import routes from './routes'
import {
  onRequest,
  onPreResponse,
  cacheHeaders as cacheHeadersMiddleware,
  session as sessionMiddleware,
  decodeJwt,
  debug as debugMiddleware,
} from './lib/middleware'
import { validate } from './lib/request-validation'
import applyLogging from './lib/lifecycle-logging'
import { updateFeatures } from './lib/features-service'
import { buildConfigs } from './config'
import { error } from './lib/logger'
import { setUpCriticalCssFiles } from './lib/critical-css-utils'

const { JWT_SECRET } = process.env

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET key has not been set')
}

const configureServerTimeouts = (server) => {
  if (server.listener) {
    // We need to configure our server timeouts to avoid the load balancer
    // throwing 504s errors. See issues:
    // https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
    // https://www.timcosta.io/how-we-found-a-tcp-hangup-issue-between-aws-elbs-and-node-js/
    // https://github.com/nodejs/node/issues/27363#issuecomment-487404927

    const defaultKeepAliveTimeout = 61 * 1000 // 61s
    server.listener.keepAliveTimeout =
      parseInt(process.env.KEEP_ALIVE_TIMEOUT_OVERRIDE, 10) ||
      defaultKeepAliveTimeout

    const defaultHeadersTimeout = 120 * 1000 // 120s
    server.listener.headersTimeout =
      parseInt(process.env.HEADERS_TIMEOUT_OVERRIDE, 10) ||
      defaultHeadersTimeout
  }
}

export const prepareRoutes = (routes) =>
  routes
    // in production, remove routes flagged as devOnly
    .filter(
      (route) =>
        process.env.NODE_ENV !== 'production' ||
        process.env.WCS_ENVIRONMENT !== 'prod' ||
        (process.env.NODE_ENV === 'production' && !route.devOnly)
    )
    // omit additional properties as hapi doesn't like them
    .map(omit(['meta', 'devOnly']))

const server = new Server({
  connections: {
    routes: { security: { hsts: false } },
  },
})

setServerSideDictionaries(dictionaries)

export default async function createServer() {
  await server.register(vision)
  server.connection({
    port: process.env.PORT || 3000,
    state: { strictHeader: false },
  })

  configureServerTimeouts(server)

  server.views({
    engines: { html: handlebars },
    relativeTo: __dirname,
    path: 'templates',
  })

  server.register(require('h2o2'))

  await server.register([basicAuth, Inert])

  server.auth.strategy('simple', 'basic', {
    validateFunc: basicAuthVerification,
  })

  server.route(prepareRoutes(routes))

  server.ext('onRequest', onRequest)
  server.ext('onPreAuth', decodeJwt)
  server.ext('onPreHandler', validate)
  server.ext('onPreHandler', debugMiddleware)
  server.ext('onPreResponse', onPreResponse)
  server.ext('onPreResponse', cacheHeadersMiddleware)
  server.ext('onPreResponse', sessionMiddleware)

  applyLogging(server)

  updateFeatures()

  if (process.env.FETCH_WCS_CONFIGS === 'true') {
    try {
      await buildConfigs()
    } catch (err) {
      error('site-config-service', {
        loggerMessage: err.message,
      })
      process.exit(1)
    }
  }

  await setUpCriticalCssFiles()

  return server
}
