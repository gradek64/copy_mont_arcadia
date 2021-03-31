import { mergeDeepRight } from 'ramda'
import {
  onRequest,
  session,
  onPreResponse,
  reportCompletedOrder,
  cacheHeaders,
  validateQuery,
  debug,
  decodeJwt,
} from '../middleware'
import { addCustomAttribute, recordCustomEvent } from '../newrelic'

jest.mock('../logger', () => ({
  info: jest.fn(),
  isTraceLoggingEnabled: () => true,
}))
import * as logger from '../logger'

jest.mock('../auth', () =>
  Object.assign(jest.requireActual('../auth'), {
    signJwt: jest.fn((params, callback) => callback(null, 'arcadiaSessionKey')),
    verifyJwt: jest.fn((token, callback) => callback(null, 'payload')),
  })
)

import * as auth from '../auth'

jest.mock('../../../shared/lib/cacheable-urls')

import { getCacheControl } from '../../../shared/lib/cacheable-urls'

const mockState = jest.fn()

jest.mock('../newrelic')

describe('Middleware', () => {
  let req

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      info: {
        hostname: 'www',
      },
      method: 'GET',
      path: 'AAAAAAAA',
      url: {
        path: 'Hello',
        search: 'XXXX',
      },
      headers: {
        cookie: 'AAAAAAA',
        'BRAND-CODE': 'BBBBB',
        'true-client-ip': '5555.6666.3333',
      },
      response: {
        header: () => {},
      },
    }
  })

  describe('onRequest', () => {
    it("should log correctly to info, if it's an api call", () => {
      const reply = {
        continue: () => {
          expect(logger.info.mock.calls[0][0]).toBe('hapi-server')
          expect(logger.info.mock.calls[0][1]).toEqual({
            brandCode: 'BBBBB',
            dretValue: undefined,
            headers: {
              'BRAND-CODE': 'BBBBB',
              cookie: 'AAAAAAA',
              'monty-client-device-type': 'desktop',
              'true-client-ip': '5555.6666.3333',
            },
            hostname: 'www',
            loggerMessage: 'request',
            method: 'GET',
            path: '/api',
            payload: undefined,
            query: undefined,
            sessionKey: '',
            source: 'ScrAPI',
            traceId: undefined,
          })
        },
      }

      onRequest(
        {
          ...req,
          path: '/api',
        },
        reply
      )
    })

    it('Handle not defined cookies', (done) => {
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledTimes(9)
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'requestDomain',
            'www'
          )
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'requestPath',
            'Hello'
          )
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'requestQuery',
            'XXXX'
          )
          expect(addCustomAttribute).toHaveBeenCalledWith('traceId', undefined)
          expect(addCustomAttribute).toHaveBeenCalledWith('source', 'ScrAPI')
          expect(addCustomAttribute).toHaveBeenCalledWith('brandCode', 'BBBBB')
          done()
        },
      }
      onRequest(req, reply)
    })

    it('Handle when monty-devicetype on headers is undefined, but stored into a cookie', (done) => {
      const req2 = Object.assign({}, req)
      req2.headers = {
        cookie: 'viewport=tablet;',
        'BRAND-CODE': 'BBBBB',
      }
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith('viewport', 'tablet')
          done()
        },
      }
      onRequest(req2, reply)
    })

    it('Handle when viewport is undefined and NOT stored into a cookie', (done) => {
      const req2 = Object.assign({}, req)
      req2.headers = {
        cookie: 'someothercookie=test;',
        'BRAND-CODE': 'BBBBB',
      }
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith('viewport', 'unknown')
          done()
        },
      }
      onRequest(req2, reply)
    })

    it('adds custom new relic parameter "deviceType" and adds request header "monty-client-device-type" giving precedence to the cookie over the user agent', () => {
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'deviceType',
            'mobile'
          )
        },
      }
      req.headers.cookie = 'deviceType=mobile'
      // The following is a desktop user agent
      req.headers['user-agent'] =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'

      onRequest(req, reply)
      expect(req.headers['monty-client-device-type']).toBe('mobile')
    })
    it('adds custom new relic parameter "deviceType" and adds request header "monty-client-device-type" from the user agent if no device type cookie received', () => {
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'deviceType',
            'mobile'
          )
        },
      }
      req.headers['user-agent'] =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'

      onRequest(req, reply)
      expect(req.headers['monty-client-device-type']).toBe('mobile')
    })
    it('defaults custom new relic parameter "deviceType" and request header "monty-client-device-type" to desktop', () => {
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'deviceType',
            'desktop'
          )
        },
      }
      onRequest(req, reply)
      expect(req.headers['monty-client-device-type']).toBe('desktop')
    })
    it('sends deviceType to new relic when the request comes from the monty server (loopback) and a deviceType cookie is available', () => {
      // This test covers the scenario where the request is a loopback request from the monty server to itself like those done to resolve the needs
      // and the request contains a deviceType cookie (e.g.: all the endpoints for which api-service->httpRequest runs)
      const reply = {
        continue: () => {
          expect(addCustomAttribute).toHaveBeenCalledWith(
            'deviceType',
            'mobile'
          )
        },
      }
      req.headers['user-agent'] = 'node-superagent/2.0.0'
      req.headers.cookie = 'deviceType=mobile'

      onRequest(req, reply)
    })
    it('does not send deviceType to new relic when the request comes from the monty server (loopback) and no deviceType cookie is available', () => {
      // This test covers the scenario where the request is a loopback request from the monty server to itself like those done to resolve the needs
      // but the request doesn't contain a deviceType cookie (e.g.: /cmscontent which does not run api-service which is responsible for settin the cookie
      // during server side rendering needs resolution)
      const reply = {
        continue: () => {
          expect(addCustomAttribute).not.toHaveBeenCalledWith(
            'deviceType',
            'desktop'
          )
        },
      }
      req.headers['user-agent'] = 'node-superagent/2.0.0'

      onRequest(req, reply)
    })

    describe('onPreResponse', () => {
      let req
      let newRelicOrderObject
      beforeEach(() => {
        req = {
          info: {
            hostname: 'm.topshop.com',
          },
          path: '/api/order',
          method: 'post',
          url: {},
          headers: {
            'brand-code': 'tsuk',
            'x-trace-id': '123456',
          },
          response: {
            statusCode: 200,
            source: {
              completedOrder: {
                orderId: 1,
                totalOrderPrice: '10.00',
                orderLines: [
                  {
                    quantity: 1,
                  },
                  {
                    quantity: 1,
                  },
                  {
                    quantity: 1,
                  },
                ],
                currencyConversion: {
                  currencyRate: 'GBP',
                },
              },
            },
          },
        }
        newRelicOrderObject = {
          orderId: 1,
          hostname: req.info.hostname,
          brandCode: req.headers['brand-code'],
          orderValue: 10,
          orderItemCount: 3,
          orderValuePerItem: 3.33,
          source: 'ScrAPI',
          traceId: req.headers['x-trace-id'],
          currency:
            req.response.source.completedOrder.currencyConversion.currencyRate,
        }
      })

      it('logs a completed order response', (done) => {
        const reply = {
          continue: () => {
            expect(recordCustomEvent).toHaveBeenCalledWith(
              'orders',
              newRelicOrderObject,
              true
            )
            done()
          },
        }
        onPreResponse(req, reply)
      })

      it('merges response.data into response.output.payload', (done) => {
        const data = { prop1: 1 }
        const modReq = {
          ...req,
          response: {
            isBoom: true,
            output: {
              payload: { prop2: 2 },
            },
            ...req.response,
            data,
          },
        }
        const reply = {
          continue: () => {
            expect(modReq.response.output.payload).toEqual({
              prop1: 1,
              prop2: 2,
            })
            done()
          },
        }
        onPreResponse(modReq, reply)
      })
    })

    describe('reportCompletedOrder', () => {
      let newRelicOrderObject
      let req
      beforeEach(() => {
        req = {
          response: {
            statusCode: 200,
            source: {
              completedOrder: {
                orderId: 1,
                totalOrderPrice: 10.2,
                orderLines: [
                  {
                    quantity: 1,
                  },
                ],
                currencyConversion: {
                  currencyRate: 'GBP',
                },
              },
            },
          },
          headers: {
            'brand-code': 'tsuk',
            'x-trace-id': '123456',
          },
          info: {
            hostname: 'm.topshop.com',
          },
        }
        newRelicOrderObject = {
          orderId: 1,
          hostname: req.info.hostname,
          brandCode: req.headers['brand-code'],
          orderValue: 10.2,
          orderItemCount: 1,
          orderValuePerItem: 10.2,
          source: 'ScrAPI',
          traceId: req.headers['x-trace-id'],
          currency:
            req.response.source.completedOrder.currencyConversion.currencyRate,
        }
      })

      it('calls recordCustomEvent with newrelic order event object', () => {
        reportCompletedOrder(req)
        expect(recordCustomEvent).toHaveBeenCalledWith(
          'orders',
          newRelicOrderObject,
          true
        )
      })

      it('converts string order amount to number', () => {
        const modifiedRequest = mergeDeepRight(req, {
          response: {
            source: { completedOrder: { totalOrderPrice: '10.20' } },
          },
        })

        reportCompletedOrder(modifiedRequest)
        expect(recordCustomEvent).toHaveBeenCalledWith(
          'orders',
          newRelicOrderObject,
          true
        )
      })
    })
  })

  describe('Session', () => {
    const defaultReq = {
      ...req,
      path: '/api/order',
      url: {
        query: {
          ARCPROMO_CODE: 'promoCode',
        },
      },
      arcadiaSessionKey: 'arcadiaSessionKey',
      state: {
        bagCount: 1,
      },
      response: {
        header: jest.fn(),
      },
    }

    it('sets the web token for the session', () => {
      const reply = {
        continue: () => {
          expect(mockState).toHaveBeenCalledWith('token', 'arcadiaSessionKey', {
            clearInvalid: false,
            encoding: 'none',
            isHttpOnly: true,
            isSecure: false,
            path: '/',
            strictHeader: false,
            ttl: 1800000,
          })
          expect(mockState).toHaveBeenCalledWith('bagCount', '0', {
            clearInvalid: false,
            encoding: 'none',
            isHttpOnly: false,
            isSecure: false,
            path: '/',
            strictHeader: false,
          })
        },
        state: mockState,
      }
      global.process.env.USE_NEW_HANDLER = true
      session(defaultReq, reply)
    })

    it('set temp session, if unauthenticated', () => {
      const reply = {
        continue: () => {
          expect(mockState).toHaveBeenCalledWith('tempsession', 'true', {
            clearInvalid: false,
            encoding: 'none',
            isHttpOnly: true,
            isSecure: false,
            path: '/',
            strictHeader: false,
            ttl: 1800000,
          })
        },
        state: mockState,
      }
      global.process.env.USE_NEW_HANDLER = true
      session(
        {
          ...defaultReq,
          arcadiaSessionKey: null,
          jwtPayload: null,
        },
        reply
      )
    })

    it("Doesn't set the header is request is cachable ", () => {
      const reply = {
        continue: () => {
          expect(mockState).toHaveBeenCalledWith('source', 'CoreAPI', {
            clearInvalid: false,
            encoding: 'none',
            isHttpOnly: false,
            isSecure: false,
            path: '/',
            strictHeader: false,
          })
        },
        state: mockState,
      }
      global.process.env.USE_NEW_HANDLER = true
      session(
        {
          ...defaultReq,
          isCacheable: true,
        },
        reply
      )
    })

    it('Responds with Bad implmentation error on jwt signature failure', () => {
      const reply = jest.fn(() => {
        expect(reply).toBeCalledWith(new Error('jwt signing failed'))
      })
      reply.state = jest.fn()

      auth.signJwt.mockImplementationOnce((token, callback) =>
        callback(
          {
            message: 'Test error',
          },
          null
        )
      )
      session(defaultReq, reply)
    })
    it('sets the header, on error', () => {
      const errorReq = {
        ...defaultReq,
        response: {
          isBoom: true,
          output: {
            headers: {},
          },
        },
      }
      const reply = {
        continue: () => {
          expect(errorReq.response.output.headers).toHaveProperty(
            'session-expired',
            'true'
          )
        },
        state: mockState,
      }
      global.process.env.USE_NEW_HANDLER = true
      session(errorReq, reply)
    })
    describe('Handle Core/Scrapi', () => {
      const useHandler = global.process.env.USE_NEW_HANDLER

      afterEach(() => {
        global.process.env.USE_NEW_HANDLER = useHandler
      })

      it('Handle ScrApi', (done) => {
        const reply = {
          continue: () => {
            expect(mockState).toHaveBeenCalledTimes(1)
            expect(mockState).toHaveBeenCalledWith('source', 'ScrAPI', {
              clearInvalid: false,
              encoding: 'none',
              isHttpOnly: false,
              isSecure: false,
              path: '/',
              strictHeader: false,
            })
            done()
          },
          state: mockState,
        }
        global.process.env.USE_NEW_HANDLER = 'false'
        session(req, reply)
      })

      it('Handle CoreApi', (done) => {
        const reply = {
          continue: () => {
            expect(mockState).toHaveBeenCalledTimes(1)
            expect(mockState).toHaveBeenCalledWith('source', 'CoreAPI', {
              clearInvalid: false,
              encoding: 'none',
              isHttpOnly: false,
              isSecure: false,
              path: '/',
              strictHeader: false,
            })
            done()
          },
          state: mockState,
        }
        global.process.env.USE_NEW_HANDLER = true
        session(req, reply)
      })
    })
  })

  describe('cacheHeaders', () => {
    const defaultReq = {
      ...req,
      url: {
        path: '/api/features',
      },
      arcadiaSessionKey: 'arcadiaSessionKey',
      response: {
        statusCode: 200,
        headers: {
          'cache-control': 'test',
        },
        ttl: jest.fn(),
        header: jest.fn(),
      },
    }

    it('sets the request to be cacheable, and sets the ttl', () => {
      const defaultCacheControl = 'max-age=600, public, must-revalidate'
      getCacheControl.mockReturnValueOnce(defaultCacheControl)
      const reply = {
        continue: jest.fn(),
        state: mockState,
      }

      cacheHeaders(defaultReq, reply)

      expect(reply.continue).toHaveBeenCalled()
      expect(defaultReq.isCacheable).toBeTruthy()
      expect(defaultReq.arcadiaSessionKey).toBe(undefined)
      expect(defaultReq.response.header).toBeCalledWith(
        'Cache-Control',
        defaultCacheControl
      )
    })

    it('sets cache-control strategy on checkout pages for checkout Server Side Renders', () => {
      const cacheControl = 'no-cache, no-store, must-revalidate'
      getCacheControl.mockReturnValueOnce(cacheControl)
      const req = {
        ...defaultReq,
        url: { path: '/checkout/delivery-payment' },
      }

      const reply = {
        continue: () => {
          expect(defaultReq.response.ttl).not.toHaveBeenCalled()
          expect(req.response.header).toHaveBeenCalledWith(
            'Cache-Control',
            cacheControl
          )
        },
      }
      cacheHeaders(req, reply)
    })
  })

  describe('decodeJwt', () => {
    it('set the jwtPayload', () => {
      const defaultReq = {
        ...req,
        url: {
          path: '/api/order',
        },
        arcadiaSessionKey: 'arcadiaSessionKey',
        response: {
          statusCode: 200,
          headers: {
            'cache-control': 'test',
          },
          ttl: jest.fn(),
        },
        state: {
          token: 'token1234',
        },
      }
      const reply = {
        continue: () => {
          expect(defaultReq.jwtPayload).toEqual('payload')
        },
        unstate: mockState,
      }
      decodeJwt(defaultReq, reply)
    })
    it('continues with the request, if the token format invalid', () => {
      const defaultReq = {
        ...req,
        state: {
          token: {},
        },
      }
      const reply = {
        continue: () => {
          expect(defaultReq.jwtPayload).toBeUndefined()
          expect(reply.unstate).toHaveBeenCalledTimes(0)
        },
        unstate: mockState,
      }
      decodeJwt(defaultReq, reply)
    })

    it('set as unauthorized, on error', () => {
      const defaultReq = {
        ...req,
        url: {
          path: '/api/order',
        },
        arcadiaSessionKey: 'arcadiaSessionKey',
        response: {
          statusCode: 200,
          headers: {
            'cache-control': 'test',
          },
          ttl: jest.fn(),
        },
        state: {
          token: 'token1234',
        },
      }
      const reply = jest.fn(() => {
        expect(reply).toHaveBeenCalledWith(new Error('Invalid JWT'))
      })
      reply.unstate = mockState

      auth.verifyJwt.mockImplementationOnce((token, callback) =>
        callback(
          {
            message: 'Test error',
          },
          null
        )
      )
      decodeJwt(defaultReq, reply)
    })
  })

  describe('validateQuery', () => {
    it('should call next, if the query is valid', () => {
      const query = {
        one:
          'https%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab',
      }
      const next = jest.fn()
      validateQuery(query, {}, next)
      expect(next).toHaveBeenCalledWith(null, query)
    })
    it("should be a bad request, if the query's invalid", () => {
      const query = {
        one: '%E0%A4%A',
      }
      const next = jest.fn()
      validateQuery(query, {}, next)
      expect(next).toHaveBeenCalledWith(new Error('Bad Request'))
    })
  })

  describe('debug', () => {
    it('enabled monty debug', () => {
      const reply = {
        continue: () => {
          expect(reply.state).toBeCalledWith('montydebug', 'enabled', {
            clearInvalid: false,
            encoding: 'none',
            isHttpOnly: true,
            isSecure: false,
            path: '/',
            strictHeader: false,
            ttl: 86400000,
          })
        },
        state: mockState,
      }
      const defaultReq = {
        url: {
          query: {
            montydebug: true,
          },
        },
      }
      debug(defaultReq, reply)
    })
  })
})
