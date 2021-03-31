/* eslint no-console: 0 */
require('@babel/register')
const r = require('ramda')
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const routes = require('../src/server/routes').default
const { getSiteConfigs } = require('../src/server/config')

const storeCodes = r
  .uniq(getSiteConfigs().map((conf) => conf.storeCode))
  .filter((x) => x)

const schemas = require('../docs/schemas')

const swaggerSpec = {
  swagger: '2.0',
  info: {
    title: 'CoreAPI',
    version: pkg.version,
  },
  basePath: '/',
  paths: {},
  definitions: {
    '24HrTimeString': {
      type: 'string',
      pattern: '^([01][0-9]|2[0-3])[0-5][0-9]$',
      title: '24 hour time string',
      description: '24 hour time, hours and minutes',
    },
    ISODate: {
      type: 'string',
      pattern: '^\\d\\d\\d\\d-\\d\\d-\\d\\d$',
      title: 'ISO Date',
      description: 'Date in the format YYYY-MM-DD',
    },
    ...schemas,
  },
}

console.log(`Found ${routes.length} routes`)

const excludeFromDocs = r.path(['meta', 'excludeFromDocs'])
const notAPIRoute = (endpoint) => !/^\/api\//.test(endpoint)

routes.forEach((route) => {
  const endpoint = route.path
  const method = route.method.toLowerCase()
  const meta = r.path(['meta', 'swagger'], route) || {}

  // don't process routes that don't provide basic info
  // only process JSON API endpoints
  if (!endpoint || !method || notAPIRoute(endpoint) || excludeFromDocs(route)) {
    console.log(`Ignoring ${method.toUpperCase()} ${endpoint}`)
    return
  }

  console.log(`Specing ${method.toUpperCase()} ${endpoint}`)
  swaggerSpec.paths[endpoint] = swaggerSpec.paths[endpoint] || {}
  swaggerSpec.paths[endpoint][method] =
    swaggerSpec.paths[endpoint][method] || {}

  const opSpec = swaggerSpec.paths[endpoint][method]
  opSpec.operationId = `${method}#${endpoint}`
  opSpec.produces = ['application/json']
  opSpec.parameters = [
    {
      name: 'BRAND-CODE',
      in: 'header',
      required: true,
      type: 'string',
      enum: storeCodes,
    },
    {
      name: 'Cookie',
      in: 'header',
      type: 'string',
      description: 'For native apps should be: deviceType=apps',
      pattern: 'deviceType=(mobile|tablet|laptop|desktop|apps)',
    },
  ]

  swaggerSpec.paths[endpoint][method] = r.mergeDeepWith(
    (a, b) => (Array.isArray(a) ? r.concat(a, b) : b),
    opSpec,
    meta
  )

  swaggerSpec.paths[endpoint][method].responses = meta.responses || {
    200: {
      description: 'Success!',
    },
  }

  Object.values(swaggerSpec.paths[endpoint][method].responses).forEach(
    (response) => {
      response.headers = response.headers || {}
      response.headers = {
        'set-cookie': {
          type: 'string',
          description:
            "1. source=<source> - Denotes the upstream service used, 2. `jessionid` cookie for tracking the user's session",
          enum: ['source=CoreAPI; Path=/', 'source=ScrAPI; Path=/'],
        },
        ...response.headers,
      }
    }
  )
})

fs.writeFileSync(
  path.join(__dirname, '../swagger-ui/swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
)

console.log('Complete!')
process.exit(0)
