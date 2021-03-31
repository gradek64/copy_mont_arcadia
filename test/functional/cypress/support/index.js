// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import { commonMocks } from '../mock-helpers/commonMocks'

require('cypress-plugin-retries')
require('./commands')

const { setFeatureFlag, setNewCookieExpiry } = require('../lib/helpers')

beforeEach(() => {
  setFeatureFlag('FEATURE_COOKIE_MANAGER', false)
  setFeatureFlag('FEATURE_MARKETING_SLIDER', false)
  const cookieExpiry = setNewCookieExpiry(3600)
  cy.setCookie('topshop-cookie-message', cookieExpiry)
  commonMocks(global.commonMockOverrides)
})
