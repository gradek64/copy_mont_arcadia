import { cookieOptionsUnset } from '../../../server/lib/auth'
import createFetch from '../api'
import WcsCookieCapture from '../../lib/wcs-cookie-capture'
import { BACKEND_JWT } from '../constants/cookies'

const mockExecute = jest.fn(() => Promise.resolve())
const mockCreateMapper = jest.fn(() => ({
  execute: mockExecute,
}))

jest.mock('../mapping/map', () => {
  return [
    {
      re: /^\/api\/site-options$/,
      method: 'get',
      handler: jest.fn(() => {
        return {
          execute: mockExecute,
        }
      }),
    },
    {
      re: /^\/api\/checkout\/order_summary$/,
      method: 'put',
      handler: {
        createMapper: () => mockCreateMapper(),
      },
    },
  ]
})

jest.mock('../api')

import routeHandler from '../handler'
import Boom from 'boom'

/**
 * Returns an object resembling a hapi `req` object
 * @param {*} [options]
 * @property {String} pathname
 * @property {String} method Lowercase HTTP method
 * @return {Object}
 */
const createReq = ({
  pathname = '/api/site-options',
  method = 'get',
} = {}) => ({
  url: {
    pathname,
  },
  method,
  headers: { 'brand-code': 'tsuk' },
})

const cookieCapture = new WcsCookieCapture()

describe('CoreAPI handler', () => {
  const mockState = jest.fn()
  const mockHeader = jest.fn()
  const mockCode = jest.fn()
  const reply = jest.fn(() => ({
    state: mockState,
    header: mockHeader,
    code: mockCode,
  }))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // TODO this doesn't seem useful. Requesting a missing endpoint should respond with 404
  it('no mapped endpoint', async () => {
    await routeHandler(createReq({ pathname: '/api/foo' }), reply)

    expect(reply).toHaveBeenCalledWith(undefined)
    expect(mockCode).toHaveBeenCalledWith(200)
  })

  it('no mapped method for endpoint', async () => {
    await routeHandler(createReq({ method: 'post' }), reply)

    expect(reply).toHaveBeenCalledWith(undefined)
    expect(mockCode).toHaveBeenCalledWith(200)
  })

  it('matches a mapped route', async () => {
    const res = {
      status: 302,
      body: { success: true },
      jsessionid: '123',
      setCookies: [
        {
          name: 'foo',
          value: 'bar',
          options: {
            path: '/',
          },
        },
      ],
      setHeaders: [
        {
          name: 'baz',
          value: 'quux',
        },
      ],
    }
    mockExecute.mockReturnValueOnce(Promise.resolve(res))

    await routeHandler(createReq(), reply)

    expect(mockExecute).toHaveBeenCalledTimes(1)
    expect(reply).toHaveBeenCalledWith(res.body)
    expect(mockState).toHaveBeenCalledWith('jsessionid', '123', {
      ttl: 1000 * 60 * 60 * 24 * 5,
      path: '/',
      encoding: 'none',
      isSecure: false,
      isHttpOnly: true,
      clearInvalid: false,
      strictHeader: false,
    })
    expect(mockState).toHaveBeenCalledWith(
      BACKEND_JWT,
      'eyJhbGciOiJIUzI1NiJ9.W10.biQRVFAFLbuKT6CrtkQz_aDfvByBAltvckVLgneKWbw',
      {
        ttl: 1000 * 60 * 60 * 24 * 5,
        path: '/',
        encoding: 'none',
        isSecure: false,
        isHttpOnly: true,
        clearInvalid: false,
        strictHeader: false,
      }
    )
    expect(mockHeader).toHaveBeenCalledWith('baz', 'quux')
    expect(mockCode).toHaveBeenCalledWith(302)
  })

  it('matches a route with alternate mappers', async () => {
    await routeHandler(
      createReq({
        pathname: '/api/checkout/order_summary',
        method: 'put',
      }),
      reply
    )

    expect(mockExecute).toHaveBeenCalledTimes(1)
  })

  it('does not set the jsessionid cookie if one is not provided in the response', async () => {
    const res = {
      body: { success: true },
    }
    mockExecute.mockReturnValueOnce(Promise.resolve(res))

    await routeHandler(createReq(), reply)

    expect(reply).toHaveBeenCalledWith(res.body)
    expect(mockState).not.toHaveBeenCalledWith(
      'jsessionid',
      expect.anything(),
      expect.anything()
    )
  })

  it('handles error responses', async () => {
    const err = Boom.notFound()
    mockExecute.mockReturnValueOnce(Promise.reject(err))

    await routeHandler(createReq(), reply)

    expect(reply).toHaveBeenCalledWith(err)
    expect(mockState).not.toHaveBeenCalled()
    expect(mockHeader).not.toHaveBeenCalled()
  })

  it('removes jsessionid on session timeout and process.env.CLEAR_SESSION_KEY_ON_TIMEOUT set to true', async () => {
    const clearSessionKeyOnTimeout =
      global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = 'true'

    const err = {
      message: 'wcsSessionTimeout',
    }
    mockExecute.mockReturnValueOnce(Promise.reject(err))

    await routeHandler(createReq(), reply)

    expect(mockState).toHaveBeenCalledWith(
      'jsessionid',
      null,
      cookieOptionsUnset
    )

    expect(mockCode).toHaveBeenCalledWith(440)

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = clearSessionKeyOnTimeout
  })

  it('does not remove jsessionid on session timeout and process.env.CLEAR_SESSION_KEY_ON_TIMEOUT not set to true', async () => {
    const clearSessionKeyOnTimeout =
      global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = 'false'

    const err = {
      message: 'wcsSessionTimeout',
    }
    mockExecute.mockReturnValueOnce(Promise.reject(err))

    await routeHandler(createReq(), reply)

    expect(mockState).not.toHaveBeenCalledWith(
      'jsessionid',
      null,
      expect.anything()
    )

    expect(mockCode).toHaveBeenCalledWith(440)

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = clearSessionKeyOnTimeout
  })

  it('does not remove jsessionid if no session timeout', async () => {
    const clearSessionKeyOnTimeout =
      global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = 'true'

    const res = {
      body: { success: true },
    }
    mockExecute.mockReturnValueOnce(Promise.resolve(res))

    await routeHandler(createReq(), reply)

    expect(mockState).not.toHaveBeenCalledWith(
      'jsessionid',
      null,
      cookieOptionsUnset
    )

    expect(mockCode).toHaveBeenCalledWith(200)

    global.process.env.CLEAR_SESSION_KEY_ON_TIMEOUT = clearSessionKeyOnTimeout
  })

  it('DEBUG_UPSTREAM_ERRORS=* passes debug param to request layer', async () => {
    process.env.DEBUG_UPSTREAM_ERRORS = '*'

    await routeHandler(createReq(), reply)

    expect(createFetch).toHaveBeenCalledWith({
      debugErrors: true,
      cookieCapture,
    })

    delete process.env.DEBUG_UPSTREAM_ERRORS
  })

  it('DEBUG_UPSTREAM_ERRORS for specific endpoint matching', async () => {
    process.env.DEBUG_UPSTREAM_ERRORS = '/api/site-options'

    await routeHandler(createReq(), reply)

    expect(createFetch).toHaveBeenCalledWith({
      debugErrors: true,
      cookieCapture,
    })

    delete process.env.DEBUG_UPSTREAM_ERRORS
  })

  it('DEBUG_UPSTREAM_ERRORS for specific endpoint NOT matching', async () => {
    process.env.DEBUG_UPSTREAM_ERRORS = '/api/site-options-nope'

    await routeHandler(createReq(), reply)

    expect(createFetch).toHaveBeenCalledWith({
      debugErrors: false,
      cookieCapture,
    })

    delete process.env.DEBUG_UPSTREAM_ERRORS
  })

  it('DEBUG_UPSTREAM_ERRORS for multiple endpoints matching', async () => {
    process.env.DEBUG_UPSTREAM_ERRORS =
      '/api/navigation/categories,/api/site-options'

    await routeHandler(createReq(), reply)

    expect(createFetch).toHaveBeenCalledWith({
      debugErrors: true,
      cookieCapture,
    })

    delete process.env.DEBUG_UPSTREAM_ERRORS
  })

  it('DEBUG_UPSTREAM_ERRORS for multiple endpoints NOT matching', async () => {
    process.env.DEBUG_UPSTREAM_ERRORS =
      '/api/navigation/categories,/api/some-other-endpoint'

    await routeHandler(createReq(), reply)

    expect(createFetch).toHaveBeenCalledWith({
      debugErrors: false,
      cookieCapture,
    })

    delete process.env.DEBUG_UPSTREAM_ERRORS
  })
})
