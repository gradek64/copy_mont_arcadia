jest.mock('../../lib/logger')
import * as logger from '../../lib/logger'

import { mockPantry } from 'src/__mocks__/@ag-digital/pantry'
import WcsCookieCaptureMock from '../__mocks__/cookie-capture.mock'

jest.mock('../requests/wcs')
import recursivelyFollowRedirectsAndCollectCookies from '../requests/wcs'

jest.mock('uuid/v4')
import uuidv4 from 'uuid/v4'

jest.mock('../../../server/lib/auth')
import { verifyJwtSync, signJwtSync } from '../../../server/lib/auth'

import createFetch from '../api'
import Boom from 'boom'

const {
  USE_MOCK_API,
  REDIS_HOST_FOR_SESSION_STORE,
  REDIS_PORT_FOR_SESSION_STORE,
  NODE_ENV,
} = global.process.env

const mockJWT = (
  { invalid = false, generatedKey } = {
    invalid: false,
    generatedKey: undefined,
  }
) => {
  if (invalid) {
    verifyJwtSync.mockImplementation(() => {
      throw new Error('verification failure')
    })
  }
  uuidv4.mockReturnValue('uuidv4')
  const newJsessionid = 'signedJWTWithUUID'
  signJwtSync.mockReturnValue(generatedKey || newJsessionid)

  return {
    verifyJWT: () => {
      expect(uuidv4).toHaveBeenCalledTimes(1)
      expect(signJwtSync).toHaveBeenCalledTimes(1)
      expect(signJwtSync).toHaveBeenCalledWith('uuidv4')
    },
  }
}

function callSendRequestToApi({ cookieCapture, args }) {
  return createFetch({ cookieCapture })(...args)
}

describe('sendRequestToApi', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    recursivelyFollowRedirectsAndCollectCookies.mockImplementation(() =>
      Promise.resolve('wcs response')
    )
  })

  afterEach(() => {
    global.process.env.USE_MOCK_API = USE_MOCK_API
    global.process.env.REDIS_HOST_FOR_SESSION_STORE = REDIS_HOST_FOR_SESSION_STORE
    global.process.env.REDIS_PORT_FOR_SESSION_STORE = REDIS_PORT_FOR_SESSION_STORE
    global.process.env.NODE_ENV = NODE_ENV
  })

  describe('Pantry error handling', () => {
    it('handles boom pantry errors', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const pantry = mockPantry()
      const transactionId = 'testId'
      const method = 'post'
      const sessionKey = 'testSession'
      const deviceType = 'desktop'
      const isMobileHostname = 'true'
      const statusCode = 500

      const boomError = Boom.create(statusCode, 'Pantry fell over')
      const cookie = 'some=test;'
      boomError.output.headers = {
        cookie,
      }

      logger.generateTransactionId.mockReturnValueOnce(transactionId)
      pantry.saveSessionMock.mockReturnValueOnce(Promise.reject(boomError))

      try {
        await callSendRequestToApi({
          cookieCapture: cookieCaptureMock,
          args: [
            'hostname',
            '/some-restricted-action',
            {},
            {},
            method,
            {
              'brand-code': 'tsuk',
              'monty-client-device-type': deviceType,
              'monty-mobile-hostname': isMobileHostname,
            },
            sessionKey,
          ],
        })

        global.fail('Expected sendRequestToApi to throw.')
      } catch (error) {
        expect(logger.info).toHaveBeenCalledWith('wcs:api', {
          loggerMessage: 'response',
          transactionId,
          method: method.toUpperCase(),
          url: 'hostname/some-restricted-action',
          sessionKey,
          cookies: cookie,
          deviceType,
          isMobileHostname,
          statusCode,
        })
      }
    })

    it('handles plain pantry errors', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const pantry = mockPantry()
      const transactionId = 'testId'
      const method = 'post'
      const sessionKey = 'testSession'
      const deviceType = 'desktop'
      const isMobileHostname = 'true'

      logger.generateTransactionId.mockReturnValueOnce(transactionId)
      pantry.saveSessionMock.mockReturnValueOnce(
        Promise.reject(new Error('Something went wrong'))
      )

      try {
        await callSendRequestToApi({
          cookieCapture: cookieCaptureMock,
          args: [
            'hostname',
            '/some-restricted-action',
            {},
            {},
            method,
            {
              'brand-code': 'tsuk',
              'monty-client-device-type': deviceType,
              'monty-mobile-hostname': isMobileHostname,
            },
            sessionKey,
          ],
        })

        global.fail('Expected sendRequestToApi to throw.')
      } catch (error) {
        expect(logger.info).toHaveBeenCalledWith('wcs:api', {
          loggerMessage: 'response',
          transactionId,
          method: method.toUpperCase(),
          url: 'hostname/some-restricted-action',
          sessionKey,
          cookies: undefined,
          deviceType,
          isMobileHostname,
          statusCode: undefined,
        })
      }
    })
  })

  it('returns a rejected promise in case of missing parameter "hostname"', async () => {
    await callSendRequestToApi({
      args: ['', 'path', 'query', 'payload'],
    }).catch((e) => {
      expect(e).toBe('Missing mandatory parameter "hostname"')
    })
  })

  it('returns a rejected promise in case of missing parameter "path"', async () => {
    await callSendRequestToApi({
      args: ['hostname', '', 'query', 'payload', 'method', {}],
    }).catch((e) => {
      expect(e).toBe('Missing mandatory parameter "path"')
    })
  })

  it('returns a rejected promise in case of "query" is non-object', async () => {
    await callSendRequestToApi({
      args: [
        'hostname',
        'path',
        'query',
        'payload',
        'method',
        {
          'brand-code': 'tsuk',
        },
      ],
    }).catch((e) => {
      expect(e).toBe('"query" and "payload" should be objects')
    })
  })

  it('returns a rejected promise in case of "payload" is non-object', async () => {
    try {
      await callSendRequestToApi({
        args: [
          'hostname',
          'path',
          {},
          'payload',
          'method',
          {
            'brand-code': 'tsuk',
          },
        ],
      })
    } catch (e) {
      expect(e).toEqual('"query" and "payload" should be objects')
    }
  })

  it('returns a rejected promise if the "brand-code" header is missing', async () => {
    await callSendRequestToApi({
      args: ['hostname', 'path', {}, 'payload', 'method', {}],
    }).catch((e) => {
      expect(e).toBe('Missing mandatory header "brand-code"')
    })
  })

  describe('Session Retrieval', () => {
    it('retreives session from pantry if there are no wcs cookies on request', async () => {
      const hasCookieSpy = jest.fn(() => false)
      const cookieCaptureMock = new WcsCookieCaptureMock({
        hasWcsCookies: hasCookieSpy,
      })
      const response = 'res'
      const jsessionid = '123'
      const { verify } = mockPantry({ res: response, key: jsessionid })

      const res = await callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          'path',
          { query: 'query' },
          { payload: 'payload' },
          'get',
          {
            'brand-code': 'tsuk',
            cookie: `jsessionid=${jsessionid}`,
          },
        ],
      })

      expect(res).toEqual(expect.objectContaining({ body: response }))
      expect(hasCookieSpy).toHaveBeenCalledTimes(2)
      verify()
    })
    it('retreives session from cookie capture if there are wcs cookies on request', async () => {
      const hasCookieSpy = jest.fn(() => true)
      const readForServerSpy = jest.fn(() => [
        'JSESSIONID=0000j8jcsGi8afWpwDg_hJmvvdm:wcsaws01; Path=/',
      ])
      const cookieCaptureMock = new WcsCookieCaptureMock({
        hasWcsCookies: hasCookieSpy,
        readForServer: readForServerSpy,
      })
      const response = 'res'
      const jsessionid = '123'
      const { verify } = mockPantry({ res: response, key: jsessionid })

      const res = await callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          'path',
          { query: 'query' },
          { payload: 'payload' },
          'get',
          {
            'brand-code': 'tsuk',
            cookie: `jsessionid=${jsessionid}`,
          },
        ],
      })

      expect(res).toEqual(expect.objectContaining({ body: response }))
      expect(hasCookieSpy).toHaveBeenCalledTimes(2)
      expect(readForServerSpy).toHaveBeenCalledTimes(1)
      verify(0, false)
    })
  })

  it('generates a new session key if client session key does not satisfy jwttoken verification', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const newJsessionid = 'signedJWTWithUUID'
    const { verifyJWT } = mockJWT({
      invalid: true,
      generatedKey: newJsessionid,
    })
    const { verify } = mockPantry({ key: newJsessionid })

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        'path',
        { query: 'query' },
        { payload: 'payload' },
        'get',
        {
          'brand-code': 'tsuk',
          cookie: 'jsessionid=badId',
        },
      ],
    })

    verifyJWT()
    verify()
  })

  it('generates a new session key if the Client does not provide one', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const newJsessionid = 'signedJWTWithUUID'
    const { verifyJWT } = mockJWT({ generatedKey: newJsessionid })
    const { verify } = mockPantry({
      key: newJsessionid,
      res: {
        key: newJsessionid,
        body: {},
      },
    })

    const res = await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        'path',
        {},
        {},
        'get',
        {
          'brand-code': 'tsuk',
          cookie: '',
        },
      ],
    })

    expect(res.jsessionid).toBe(newJsessionid)
    verifyJWT()
    verify()
  })

  it('throws if generated key is already used as key in Redis', () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const newJsessionid = 'signedJWTWithUUID'
    const { verifyJWT } = mockJWT({ generatedKey: newJsessionid })
    mockPantry({ cookieJar: ['JSESSIONID=123'], key: newJsessionid })

    expect(() =>
      callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          'path',
          { query: 'query' },
          { payload: 'payload' },
          'get',
          {
            'brand-code': 'tsuk',
          },
        ],
      })
    ).toThrow('Error while retrieving User Session')
    verifyJWT()
  })

  it('logs error when sessions clash', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    mockPantry({
      res: {
        body: 'body',
        cookies: ['WC_USERACTIVITY_456=123', 'WC_AUTHENTICATION_456=456'],
      },
      cookieJar: ['WC_USERACTIVITY_123=123', 'WC_AUTHENTICATION_123=123'],
    })

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        'path',
        {},
        {},
        'get',
        {
          'brand-code': 'tsuk',
          cookie: 'jsessionid=123',
        },
      ],
    })

    expect(logger.error).toHaveBeenCalledWith(
      'wcs:err',
      expect.objectContaining({
        loggerMessage: 'Invalid transition of WC_USERACTIVITY_ID',
      })
    )
  })

  it('should use URLs with encoded special characters on first request', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    mockPantry()

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/api/fr/tsfr/catégorie/vêtements-415222/jupes-415244',
        {},
        {},
        'get',
        { 'brand-code': 'tsuk' },
      ],
    })

    expect(recursivelyFollowRedirectsAndCollectCookies).toHaveBeenCalledWith(
      expect.objectContaining({
        destination:
          'hostname/api/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements-415222/jupes-415244',
      }),
      expect.anything(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock
    )
  })

  it('reject if cannot form valid destination url', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    mockPantry()

    await expect(
      callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          '/%E0/foo',
          {},
          {},
          'get',
          {
            'brand-code': 'tsuk',
          },
        ],
      })
    ).rejects.toThrow(/URI malformed/)
  })

  it('adds request and response payloads to logs when trace logging is enabled', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const requestPayload = { myRequestPayload: true }
    const responsePayload = { myResponsePayload: true }
    mockPantry({
      res: responsePayload,
    })
    logger.isTraceLoggingEnabled.mockReturnValue(true)

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/api/fr/tsfr/catégorie/vêtements-415222/jupes-415244',
        {},
        requestPayload,
        'get',
        { 'brand-code': 'tsuk' },
      ],
    })

    expect(logger.info).toHaveBeenCalledWith(
      'wcs:api',
      expect.objectContaining({
        payload: requestPayload,
      })
    )
    expect(logger.info).toHaveBeenCalledWith(
      'wcs:api',
      expect.objectContaining({
        body: responsePayload,
      })
    )
  })

  it('defaults response body in logs to empty object if body missing', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    mockPantry({
      res: false,
    })
    logger.isTraceLoggingEnabled.mockReturnValue(true)

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/api/path',
        {},
        {},
        'get',
        {
          'brand-code': 'tsuk',
        },
      ],
    })

    expect(logger.info).toHaveBeenCalledWith(
      'wcs:api',
      expect.objectContaining({
        body: {},
      })
    )
  })

  it('sends device type along to WCS', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const deviceType = 'desktop'
    mockPantry()

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/whatever',
        {},
        {},
        'get',
        {
          'monty-client-device-type': deviceType,
          'brand-code': 'tsuk',
        },
      ],
    })

    expect(recursivelyFollowRedirectsAndCollectCookies).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'hostname/whatever',
      }),
      expect.anything(),
      deviceType,
      undefined,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock
    )
  })

  describe('passes along traceId to WCS', () => {
    it('should prefer traceId from cookie `traceId2`', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const traceId = '1234'
      mockPantry()

      await callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          '/whatever',
          {},
          {},
          'get',
          {
            'brand-code': 'tsuk',
            'monty-client-device-type': 'desktop',
            'monty-mobile-hostname': 'true',
            'x-trace-id': '4321',
            cookie: `key=Value; traceId2=${traceId};`,
          },
        ],
      })

      expect(recursivelyFollowRedirectsAndCollectCookies).toHaveBeenCalledWith(
        expect.objectContaining({
          destination: 'hostname/whatever',
        }),
        expect.anything(),
        'desktop',
        'true',
        undefined,
        traceId,
        undefined,
        cookieCaptureMock
      )
    })

    it('should fallback to x-trace-id', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const traceId = '4321'
      mockPantry()
      await callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          '/whatever',
          {},
          {},
          'get',
          {
            'brand-code': 'tsuk',
            'monty-client-device-type': 'desktop',
            'monty-mobile-hostname': 'true',
            'x-trace-id': traceId,
            cookie: 'key=Value;',
          },
        ],
      })

      expect(recursivelyFollowRedirectsAndCollectCookies).toHaveBeenCalledWith(
        expect.objectContaining({
          destination: 'hostname/whatever',
        }),
        expect.anything(),
        'desktop',
        'true',
        undefined,
        traceId,
        undefined,
        cookieCaptureMock
      )
    })
  })

  it('passes along `monty-mobile-hostname` to WCS for `monty` header', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const isMobileHostname = 'true'
    mockPantry()

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/whatever',
        {},
        {},
        'get',
        {
          'brand-code': 'tsuk',
          'monty-mobile-hostname': isMobileHostname,
        },
      ],
    })

    expect(recursivelyFollowRedirectsAndCollectCookies).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'hostname/whatever',
      }),
      expect.anything(),
      undefined,
      isMobileHostname,
      undefined,
      undefined,
      undefined,
      cookieCaptureMock
    )
  })

  describe('throwForRestrictedUserResponse', () => {
    it('returns a rejected promise when handling a partially authenticated user attempting to perform a restricted action', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const mockBasket = {
        products: {
          Product: [
            {
              partNumber: '592018000309908',
              quantity: 6,
            },
            {
              partNumber: '592018000309909',
              quantity: 10,
            },
          ],
        },
      }

      const mockResponse = {
        success: false,
        isLoggedIn: true,
        rememberMeLogonForm: {
          loginForm: {
            logonId: 'test@testing.com',
            rememberMe: true,
          },
        },
        personal_details: {
          registerType: 'R',
          profileType: 'C',
        },
        MiniBagForm: {
          Basket: mockBasket,
        },
      }

      mockPantry({
        res: mockResponse,
      })

      try {
        await callSendRequestToApi({
          cookieCapture: cookieCaptureMock,
          args: [
            'hostname',
            '/some-restricted-action',
            {},
            {},
            'post',
            {
              'brand-code': 'tsuk',
              'monty-client-device-type': 'desktop',
              'monty-mobile-hostname': 'true',
            },
          ],
        })

        global.fail('Expected sendRequestToApi to throw')
      } catch (error) {
        expect(error.output.headers['set-cookie']).toContain(
          'authenticated=partial'
        )
        expect(error.data).toMatchObject({
          success: false,
          isLoggedIn: true,
          account: {
            basketItemCount: 16,
            email: 'test@testing.com',
            registerType: 'R',
            profileType: 'C',
          },
        })

        const { basket } = error.data

        expect(typeof basket).toBe('object')
        expect(Array.isArray(basket.products)).toBe(true)
        expect(error.output.statusCode).toBe(401)
        expect(error.message).toBe('Restricted action')
      }
    })

    it('does not call throwForRestrictedUserResponse if !success && rememberMeLogonForm but rememberMe = false', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const mockBasket = {
        products: {
          Product: [
            {
              partNumber: '592018000309908',
              quantity: 6,
            },
            {
              partNumber: '592018000309909',
              quantity: 10,
            },
          ],
        },
      }

      const mockResponse = {
        success: false,
        MiniBagForm: {
          Basket: mockBasket,
        },
        rememberMeLogonForm: {},
      }

      mockPantry({
        res: mockResponse,
      })

      try {
        await callSendRequestToApi({
          cookieCapture: cookieCaptureMock,
          args: [
            'hostname',
            '/some-restricted-action',
            {},
            {},
            'post',
            {
              'brand-code': 'tsuk',
              'monty-client-device-type': 'desktop',
              'monty-mobile-hostname': 'true',
            },
          ],
        })
      } catch (err) {
        global.fail('Should not have failed')
      }
    })

    it('calls throwForRestrictedUserResponse if !success && rememberMeLogonForm but rememberMe = true', async () => {
      const cookieCaptureMock = new WcsCookieCaptureMock()
      const mockBasket = {
        products: {
          Product: [
            {
              partNumber: '592018000309908',
              quantity: 6,
            },
            {
              partNumber: '592018000309909',
              quantity: 10,
            },
          ],
        },
      }

      const mockResponse = {
        success: false,
        MiniBagForm: {
          Basket: mockBasket,
        },
        rememberMeLogonForm: {
          loginForm: true,
        },
      }

      mockPantry({
        res: mockResponse,
      })

      try {
        await callSendRequestToApi({
          cookieCapture: cookieCaptureMock,
          args: [
            'hostname',
            '/some-restricted-action',
            {},
            {},
            'post',
            {
              'brand-code': 'tsuk',
              'monty-client-device-type': 'desktop',
              'monty-mobile-hostname': 'true',
            },
          ],
        })
      } catch (err) {
        global.fail('Should not have failed')
      }
    })
  })

  it('handles session timeout', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const mockResponse = {
      timeout: true,
    }

    mockPantry({
      res: mockResponse,
    })

    try {
      await callSendRequestToApi({
        cookieCapture: cookieCaptureMock,
        args: [
          'hostname',
          '/some-restricted-action',
          {},
          {},
          'post',
          {
            'brand-code': 'tsuk',
            'monty-client-device-type': 'desktop',
            'monty-mobile-hostname': 'true',
          },
        ],
      })

      global.fail('Expected a timeout error to be thrown')
    } catch (err) {
      expect(err).toEqual(new Error('wcsSessionTimeout'))
    }
  })

  it('cookie capture should capture any returned cookies from wcs', async () => {
    const cookieCaptureMock = new WcsCookieCaptureMock()
    const mockCookie = ['mock=cookie']
    mockPantry({
      res: {
        body: 'body',
        cookies: mockCookie,
      },
    })

    await callSendRequestToApi({
      cookieCapture: cookieCaptureMock,
      args: [
        'hostname',
        '/some-restricted-action',
        {},
        {},
        'post',
        {
          'brand-code': 'tsuk',
          'monty-client-device-type': 'desktop',
          'monty-mobile-hostname': 'true',
        },
      ],
    })

    expect(cookieCaptureMock.capture).toHaveBeenCalledTimes(1)
    expect(cookieCaptureMock.capture).toHaveBeenCalledWith(mockCookie)
  })

  it('logs debug info for an error', async () => {
    const send = createFetch({
      debugErrors: true,
      cookieCapture: new WcsCookieCaptureMock(),
    })

    mockPantry({
      res: Promise.reject({
        data: {
          response: {
            req: {
              _header: 'some request header string',
            },
            headers: {
              some: 'response headers',
            },
            status: '500',
            text: '<this>went</badly>',
          },
        },
      }),
    })

    try {
      await send('hostname', '/foo-bar', {}, {}, 'get', {
        'brand-code': 'tsuk',
        'monty-client-device-type': 'desktop',
        'monty-mobile-hostname': 'true',
      })
      global.fail('Expected request to fail')
    } catch (e) {
      expect(logger.info).toHaveBeenCalledWith(
        'wcs:api',
        expect.objectContaining({
          errorResponseDebug: {
            request: 'some request header string',
            response: {
              headers: '{\n  "some": "response headers"\n}',
              status: '500',
              text: '<this>went</badly>',
            },
          },
        })
      )
    }
  })
})
