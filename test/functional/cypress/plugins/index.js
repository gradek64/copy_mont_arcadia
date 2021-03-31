// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { setMockRoute, cleanUpMocks } = require('./mockServerClient')
const breakpoints = require('./../constants/breakpoints')

module.exports = (on, config) => {
  require('dotenv').config({ path: '../../' })

  const PORT = process.env.MONTY_PORT || '8080'
  config.env.PORT = PORT

  config.env.BREAKPOINT = process.env.BREAKPOINT

  // The mock server is used to mock CoreAPI response to Monty SSR
  // See test/functional/mock-server/* for more info
  config.env.MOCK_SERVER_URL = process.env.MOCK_SERVER_URL || 'localhost'
  config.env.MOCK_SERVER_PORT = process.env.MOCK_SERVER_PORT || '4000'

  // Retries a failed test up to twice. This is to avoid flakiness in the cypress
  // test runner
  config.env.RETRIES = process.env.FUNCTIONAL_RETRIES || 2

  // This var is to prevent the Cypress test runner from running out of memory
  // when running all of the tests in open mode.
  // `numTestsKeptInMemory` defaults to 0 in run mode
  if (process.env.LOW_MEMORY === 'true') config.numTestsKeptInMemory = 0

  config.baseUrl = `http://local.m.topshop.com:${PORT}`
  config.chromeWebSecurity = false
  config.testFiles = '**/*.js'

  if (process.env.BREAKPOINT === 'mobile') {
    config.viewportWidth = breakpoints.mobile.width
    config.viewportHeight = breakpoints.mobile.height
  } else {
    config.viewportWidth = breakpoints.desktop.width
    config.viewportHeight = breakpoints.desktop.height
  }

  on('task', {
    'mock-server-setup': (routes) => {
      const promises = routes.map((route) => setMockRoute(route, config))

      return Promise.all(promises)
    },
    'mock-server-cleanup': () => {
      return cleanUpMocks(config)
    },
  })

  return config
}
