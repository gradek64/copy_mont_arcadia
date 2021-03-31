import './polyfill'
import 'colors'

import google from '../mocks/google'
import { setServerSideDictionaries } from '../../src/shared/lib/localisation'
import dictionaries from '../../src/shared/constants/dictionaries'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
})

setServerSideDictionaries(dictionaries)
global.process.env.BV_SHAREDKEY = 'asdf'
global.process.env.JWT_SECRET = 'test123'
global.process.env.REDIS_URL = 'http://my-redis-url'
global.process.env.API_URL = 'http://local.m.topshop.com'
global.process.browser = false
global.process.env.COOKIE_MESSAGE = 'true'

Object.defineProperty(window.navigator, 'onLine', { value: () => true })
Object.defineProperty(window, 'google', {
  value: () => google,
  writable: true,
})
Object.defineProperty(window, 'dataLayer', { value: [] })
Object.defineProperty(window, 'performance', {
  value: {
    timing: {
      navigationStart: 1000,
    },
  },
})

// TODO investigate why jest still mocks this module locally after all mocking code has been removed
// TODO clearing jest cache doesn't help
// The following is necessary in order to avoid using the manual mock of 'superagent' created for
// other unit tests. These tests have been written before the implementation of the manual mocking
// and there is no need here of the usage of it.
jest.unmock('superagent')

jest.mock('cache-service-redis', () => {
  const MockedCsRedis = jest.requireActual('cache-service-redis')
  return function RedisCache() {
    return new MockedCsRedis({
      redisMock: require('redis-mock').createClient(),
    })
  }
})

require('jasmine-check').install()

const getType = (x) => Object.prototype.toString.call(x).slice(8, -1)

expect.extend({
  toBeInArray: (received, argument) => {
    if (!Array.isArray(argument))
      throw new Error(
        `\`toBeInArray\` expects array, found ${getType(
          argument
        )}: ${JSON.stringify(argument)}`
      )

    return argument.includes(received)
      ? {
          pass: true,
          message: () =>
            `expected ${JSON.stringify(
              received
            )} not to be in array ${JSON.stringify(argument)}`,
        }
      : {
          pass: false,
          message: () =>
            `expected ${JSON.stringify(
              received
            )} to be in array ${JSON.stringify(argument)}`,
        }
  },
})
