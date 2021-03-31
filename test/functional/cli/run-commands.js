const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const ora = require('ora')

const appDirectory = fs.realpathSync(process.cwd())
function resolvePath(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

function createProcessArgs(environmentVars = {}) {
  const env = {
    ...environmentVars,
    PATH: process.env.PATH,
  }

  return {
    env,
    cwd: appDirectory,
  }
}

function monitorMontyBuild(buildProcess) {
  return new Promise((resolve, reject) => {
    const buildingSpinner = ora('Building monty...')
    buildingSpinner.color = 'magenta'
    buildingSpinner.start()

    buildProcess.on('exit', () => {
      buildingSpinner.stopAndPersist({
        symbol: '✅ ',
        text: 'Monty is built',
      })
      resolve(buildProcess)
    })

    buildProcess.on('error', (error) => {
      buildingSpinner.stopAndPersist({
        symbol: '❌ ',
        text: 'Failed to build monty',
      })
      reject(`Failed to build monty: ${error}`)
    })
  })
}

function runServer(environment) {
  global.console.log('Running server...')

  return spawn(`npm`, ['run', 'server'], environment)
}

async function runMonty({ buildOrRun }) {
  const environment = createProcessArgs({
    CORE_API_PORT: 4000,
    FUNCTIONAL_TESTS: 'true',
    QUBIT_DISABLED: true,
    COOKIE_MESSAGE: true,
  })

  try {
    const buildProcess = spawn(`npm`, ['run', buildOrRun], environment)

    if (buildOrRun === 'build') {
      await monitorMontyBuild(buildProcess)

      return runServer(environment)
    } else if (buildOrRun === 'dev') {
      buildProcess.stdout.on('data', (data) => {
        global.console.log('monty: ', data.toString())
      })
    }

    return buildProcess
  } catch (error) {
    global.console.error(`Failed to build monty. Error: ${error}`)
  }
}

function runCypress({
  runOrOpen,
  breakpoint,
  platform,
  runPattern,
  buildOrRun,
  retries,
}) {
  global.console.log('Starting cypress...')
  let environmentVars = {
    BREAKPOINT: breakpoint,
    MONTY_PORT: buildOrRun === 'build' ? 3000 : 8080,
  }
  if (retries === 'no') {
    environmentVars = {
      ...environmentVars,
      FUNCTIONAL_RETRIES: 0,
    }
  }
  const environment = createProcessArgs(environmentVars)
  const browser = !platform ? [] : ['--browser', platform]
  const pattern =
    !runPattern || runPattern.trim() === '*'
      ? []
      : ['--spec', `test/functional/cypress/integration/${runPattern}`]

  try {
    const cypressProcess = spawn(
      'cypress',
      [runOrOpen, '--project', 'test/functional', ...browser, ...pattern],
      environment
    )

    cypressProcess.stdout.on('data', (data) => {
      global.console.log(data.toString())
    })

    return cypressProcess
  } catch (error) {
    global.console.error(`Failed to start cypress: ${error}`)
  }
}

function runMockServer() {
  global.console.log('Starting mock server...')
  const mockServerPath = resolvePath('test/functional/mock-server/index.js')
  try {
    const mockServer = spawn('node', [mockServerPath], createProcessArgs())

    mockServer.stdout.on('data', (data) => {
      global.console.log(`mock-server: ${data}`)
    })

    return mockServer
  } catch (error) {
    global.console.error(`Failed to start mock server: ${error}`)
  }
}

async function runCommands(options) {
  global.console.log('Running setup 🎉')

  let buildProcess
  if (options.buildOrRun !== 'skip') {
    buildProcess = await runMonty(options)
  }

  const mockServerProcess = runMockServer(options)
  const cypressProcess = runCypress(options)
  const processes = [buildProcess, mockServerProcess, cypressProcess].filter(
    Boolean
  )

  processes.forEach((proc) => {
    proc.on('error', (error) => {
      global.console.log(error)
    })
  })

  cypressProcess.on('exit', () => {
    process.exit(0)
  })

  process.on('exit', () => {
    processes.forEach((childProcess) => {
      childProcess.kill('SIGINT')
    })

    global.console.log('Functional tests stopped 👋')
  })

  process.on('SIGINT', () => {
    process.exit(2)
  })
}

module.exports = runCommands
