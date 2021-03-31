require('@babel/register')
require('core-js/stable')
require('regenerator-runtime/runtime')

if (process.env.NEWRELIC_KEY) require('newrelic')

const AWS = require('aws-sdk')

AWS.config.update({
  region: 'eu-west-1',
})

const path = require('path')
const logger = require('./src/server/lib/logger')
const bootstrapEnvVarsFromDynamoDB = require('./src/server/lib/bootstrap-env-vars-from-dynamodb')
  .default

const envPath = path.join(__dirname, '/.env')

// will be reassigned on server restart
let server

function initialiseSNS() {
  const snsServer = require('./src/server/sns-server').default

  snsServer.start(() => {
    logger.info('sns-server', {
      loggerMessage: 'Sns Server is running',
      port: snsServer.info.port,
    })
  })
}

async function startMonty({ isRestarting = false, callback } = {}) {
  const createServer = require('./src/server/create-server').default

  try {
    server = await createServer()

    await server.start()

    if (typeof callback === 'function') {
      callback()
    }

    logger.info('server', {
      loggerMessage: `Server ${isRestarting ? 'restart' : 'start'}ed`,
      port: server.info.port,
      environment: process.env,
    })
  } catch (error) {
    logger.error('server', {
      loggerMessage: `Error ${isRestarting ? 'restart' : 'start'}ing server`,
      ...(error instanceof Error ? { stack: error.stack } : error),
    })
  }
}

// Please set CI env var to true if running tests locally while Monty is in production mode!
if (!process.env.CI && process.env.NODE_ENV === 'production') {
  bootstrapEnvVarsFromDynamoDB(() =>
    startMonty({ isRestarting: false, callback: initialiseSNS })
  )
} else {
  startMonty()
}

const serverDelete = () => {
  require('child_process').execSync('./scripts/write_version_info_file.sh', {
    encoding: 'utf8',
  })
  Object.keys(require.cache).map((id) => {
    if (id.includes('/server/') || id.includes('/shared/')) {
      delete require.cache[id]
    }
    return id
  })

  server.stop((err) => {
    if (err) logger.error('server', { loggerMessage: 'Server stop', ...err })

    process.env = {}

    require('dotenv').config({ path: envPath })

    startMonty({ isRestarting: true })
  })
}

if (process.env.NODE_ENV !== 'production') {
  const chokidar = require('chokidar')
  const watcher = chokidar.watch([path.join(__dirname, '/src/'), envPath])

  watcher.on('ready', () => {
    watcher.on('change', serverDelete)
  })
}
