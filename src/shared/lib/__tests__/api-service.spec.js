import { get, post, put, del } from '../api-service'
import configureStore from '../configure-store'
import { setItem, getItem, hasItem } from '../../../client/lib/cookie/utils'
import superagent from '../superagent'
import { sendAnalyticsApiResponseEvent } from '../../analytics'
import * as logger from '../../../client/lib/logger'
import { addToCookiesString } from '../cookie'
import * as hostnameModule from '../hostname'
import { sessionExpired } from '../../actions/common/sessionActions'
import {
  setJsessionid,
  setSessionJwt,
} from '../../actions/common/sessionTokenActions'

jest.mock('../../actions/common/rememberMeActions', () => ({
  handleRestrictedActionResponse: jest.fn(() => () => {}),
}))

import { handleRestrictedActionResponse } from '../../actions/common/rememberMeActions'

jest.mock('../superagent', () => jest.fn())
jest.mock('../../../client/lib/cookie/utils')
jest.mock('../../../client/lib/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  generateTransactionId: () => 1000000,
}))
jest.mock('../cacheable-urls', () => ({
  getCacheExpiration: () => 'date',
}))
jest.mock('../cookie', () => ({
  extractCookie: () => 'cookie',
  addToCookiesString: jest.fn(),
}))
jest.mock('../../actions/common/sessionTokenActions', () => ({
  setJsessionid: jest.fn(),
  setSessionJwt: jest.fn(),
}))
jest.mock('../../actions/common/errorMessageActions', () => ({
  setApiError: () => 'SET_API_ERROR',
  setCmsError: () => 'SET_CMS_ERROR',
}))
jest.mock('../../analytics')
jest.mock('../../actions/common/sessionActions', () => ({
  sessionExpired: jest.fn(),
}))
jest.mock('../../selectors/featureSelectors', () => ({
  isFeatureDDPEnabled: jest.fn(() => false),
  isFeatureDDPActiveBannerEnabled: jest.fn(() => false),
  isFeatureRememberMeEnabled: jest.fn(),
  isFeatureDDPPromoEnabled: jest.fn(() => false),
  isFeatureDDPRenewable: () => false,
  isFeatureApplePayEnabled: () => false,
  isFeatureClearPayEnabled: () => false,
}))

import { isFeatureRememberMeEnabled } from '../../selectors/featureSelectors'
import { BACKEND_JWT } from '../../../server/api/constants/cookies'

describe('api-service', () => {
  let dispatchMock
  let dispatchParameterMock
  let requestMock
  const state = {
    config: {
      brandCode: 'abc',
      region: 'def',
    },
    viewport: {
      media: 'desktop',
    },
    auth: {
      token: 'token',
    },
    hostname: {
      isMobile: false,
    },
    shippingDestination: {
      destination: 'United Kingdom',
    },
    sessionTokens: {
      jsessionid: 'jsessionid',
      sessionJwt: 'sessionJwt',
    },
    routing: {
      location: {
        pathname: 'samir/red-shirts',
        search: '?test&arcadia&desktop',
      },
    },
  }
  const setRequestMock = (
    body = {},
    response = {},
    headers = {},
    statusCode = 200,
    url = '',
    method
  ) => {
    if (statusCode !== 200) {
      requestMock = Promise.reject({
        body,
        response,
        headers,
        statusCode,
        status: statusCode,
        method,
      })
    } else {
      requestMock = Promise.resolve({
        body,
        response,
        headers,
        statusCode,
        status: statusCode,
        method,
      })
    }
    requestMock.headers = []
    requestMock.set = jest.fn((name, value) => {
      requestMock.headers.push(name, value)
    })
    requestMock.cache = jest.fn()
    requestMock.timeout = jest.fn()
    requestMock.url = url
    requestMock.send = () => requestMock
    requestMock.method = method

    superagent.mockImplementation(() => requestMock)
  }

  beforeAll(() => {
    jest.resetAllMocks()

    dispatchParameterMock = jest.fn()
    dispatchMock = jest.fn((func) => {
      return func(dispatchParameterMock, () => state)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('#get', () => {
    afterAll(() => {
      global.process.env.USE_NEW_HANDLER = null
      global.process.browser = false
    })

    describe('superagent', () => {
      let getStateMock

      beforeAll(() => {
        setRequestMock()

        getStateMock = jest.fn(() => ({
          ...state,
        }))
        global.process.browser = false
        global.process.env.USE_NEW_HANDLER = 'true'
      })

      it('should be called with the method GET and a composed url', () => {
        const httpRequest = get('/whatever')

        httpRequest(dispatchMock, getStateMock, {})

        expect(superagent).toHaveBeenCalledWith('GET', ':3000/api/whatever')
      })
    })

    describe('headers', () => {
      describe('not in browser', () => {
        let getStateMock

        beforeAll(() => {
          setRequestMock()
          addToCookiesString.mockImplementation((newValue, exitingValue) => {
            return `${exitingValue};${newValue}`
          })
        })

        beforeEach(() => {
          getStateMock = jest.fn(() => ({
            ...state,
          }))
          global.process.browser = false
          global.process.env.USE_NEW_HANDLER = 'true'
        })

        it('BRAND-CODE header should be set', () => {
          const httpRequest = get('/whatever')

          httpRequest(dispatchMock, getStateMock, {})

          expect(requestMock.set).toHaveBeenCalledWith(
            'BRAND-CODE',
            state.config.brandCode + state.config.region
          )
        })

        describe('routing referer header', () => {
          it('should be set from the state', () => {
            const httpRequest = get('/whatever')

            httpRequest(dispatchMock, getStateMock, {})

            expect(requestMock.set).toHaveBeenCalledWith(
              'referer',
              `${state.routing.location.pathname}${encodeURIComponent(
                state.routing.location.search
              )}`
            )
          })
        })

        describe('monty-mobile-hostname header', () => {
          it('should be set with the value of the state property hostname.isMobile', () => {
            const httpRequest = get('/whatever')

            httpRequest(dispatchMock, getStateMock, {})

            expect(requestMock.set).toHaveBeenCalledWith(
              'monty-mobile-hostname',
              state.hostname.isMobile
            )
          })
        })

        describe('deviceType header', () => {
          it('should be set', () => {
            const httpRequest = get('/whatever')

            httpRequest(dispatchMock, getStateMock, {})

            expect(addToCookiesString).toHaveBeenCalledWith(
              'deviceType=desktop',
              `token=token;jsessionid=jsessionid;${BACKEND_JWT}=sessionJwt`
            )
            expect(requestMock.set).toHaveBeenCalledWith(
              'Cookie',
              `token=token;jsessionid=jsessionid;${BACKEND_JWT}=sessionJwt;deviceType=desktop`
            )
          })
        })

        describe('Cookie', () => {
          describe('"jsessionid" has a value', () => {
            describe('Env variable USE_NEW_HANDLER is "true"', () => {
              it('sets the Cookie', () => {
                const httpRequest = get('/whatever')

                httpRequest(dispatchMock, getStateMock, {})

                expect(addToCookiesString).toHaveBeenCalledWith(
                  'jsessionid=jsessionid',
                  'token=token'
                )
                expect(requestMock.set).toHaveBeenCalledWith(
                  'Cookie',
                  `token=token;jsessionid=jsessionid;${BACKEND_JWT}=sessionJwt;deviceType=desktop`
                )
              })
            })

            describe('Env variable USE_NEW_HANDLER is "false"', () => {
              it('does not set the jsessionid in the Cookie', () => {
                global.process.env.USE_NEW_HANDLER = 'false'
                const httpRequest = get('/whatever')

                httpRequest(dispatchMock, getStateMock, {})

                expect(addToCookiesString).not.toHaveBeenCalledWith(
                  'jsessionid=jsessionid',
                  'token=token'
                )
                expect(requestMock.set).toHaveBeenCalledWith(
                  'Cookie',
                  'token=token;deviceType=desktop'
                )
              })
            })

            describe('Auth token is not set', () => {
              it('does not set the token in the Cookie', () => {
                getStateMock.mockReturnValueOnce({
                  ...state,
                  auth: {},
                })
                const httpRequest = get('/whatever')

                httpRequest(dispatchMock, getStateMock, {})

                expect(requestMock.set).toHaveBeenCalledWith(
                  'Cookie',
                  `;jsessionid=jsessionid;${BACKEND_JWT}=sessionJwt;deviceType=desktop`
                )
              })
            })
          })

          describe('No "jsessionid"', () => {
            describe('Env variable USE_NEW_HANDLER is "true"', () => {
              it('does not set the jsessionid in the Cookie', () => {
                getStateMock.mockReturnValueOnce({
                  ...state,
                  sessionTokens: {
                    sessionJwt: 'sessionjwtisset',
                    jsessionid: '',
                  },
                })
                const httpRequest = get('/whatever')

                httpRequest(dispatchMock, getStateMock, {})

                expect(addToCookiesString).not.toHaveBeenCalledWith(
                  'jsessionid=jsessionid',
                  'token=token'
                )
                expect(addToCookiesString).toHaveBeenCalledWith(
                  `${BACKEND_JWT}=sessionjwtisset`,
                  'token=token'
                )
                expect(requestMock.set).toHaveBeenCalledWith(
                  'Cookie',
                  `token=token;${BACKEND_JWT}=sessionjwtisset;deviceType=desktop`
                )
              })
            })
          })
          describe('No "sessionJwt"', () => {
            describe('Env variable USE_NEW_HANDLER is "true"', () => {
              it('does not set the sessionJwt in the Cookie', () => {
                getStateMock.mockReturnValueOnce({
                  ...state,
                  sessionTokens: {
                    jsessionid: 'jsessionidisset',
                    sessionJwt: '',
                  },
                })
                const httpRequest = get('/whatever')

                httpRequest(dispatchMock, getStateMock, {})
                expect(addToCookiesString).not.toHaveBeenCalledWith(
                  `${BACKEND_JWT}=sessionjwtisset`,
                  'token=token;jsessionid=jsessionid;'
                )
                expect(requestMock.set).toHaveBeenCalledWith(
                  'Cookie',
                  'token=token;jsessionid=jsessionidisset;deviceType=desktop'
                )
              })
            })
          })
        })
      })

      describe('in browser', () => {
        let getStateMock

        beforeAll(() => {
          setRequestMock()

          getStateMock = jest.fn(() => ({
            ...state,
            jsessionid: { value: 'jsessionid' },
          }))
          global.process.browser = true
          global.process.env.USE_NEW_HANDLER = 'true'
        })

        it('should not cache', () => {
          const httpRequest = get('/whatever')

          httpRequest(dispatchMock, getStateMock, {})

          expect(requestMock.cache).not.toHaveBeenCalled()
        })

        describe('monty-mobile-hostname header', () => {
          it('should be set with the value returned by the function "isMobileHostname"', () => {
            hostnameModule.isMobileHostname = jest.fn(() => true)
            const httpRequest = get('/whatever')

            httpRequest(dispatchMock, getStateMock, {})

            expect(requestMock.set).toHaveBeenCalledWith(
              'monty-mobile-hostname',
              true
            )
          })
        })
      })

      describe('X-TRACE-ID', () => {
        beforeAll(() => {
          setRequestMock()
        })

        it('uses `traceId2` from client cookies', async () => {
          global.process.browser = true
          hasItem.mockImplementationOnce((key) => key === 'traceId2')
          getItem.mockImplementationOnce(
            (key) => (key === 'traceId2' ? '456R789' : '')
          )

          const store = configureStore({})

          await store.dispatch(get('/foo'))

          expect(requestMock.set).toHaveBeenCalledWith('X-TRACE-ID', '456R789')
          expect(setItem).toHaveBeenCalledWith('traceId2', '456R789')
        })

        it('uses `traceId` from the reduxContext for SSR', async () => {
          setJsessionid.mockImplementation(() => ({ type: 'SET_JSESSION_ID' }))
          setSessionJwt.mockImplementation(() => ({ type: 'SET_SESSION_JWT' }))
          global.process.browser = false
          const store = configureStore({}, { traceId: '123R456' })

          await store.dispatch(get('/foo'))

          expect(requestMock.set).toHaveBeenCalledWith('X-TRACE-ID', '123R456')
          expect(setItem).toHaveBeenCalledWith('traceId2', '123R456')
        })

        it('fallback to generating a new `traceId` and sets cookie client side', async () => {
          global.process.browser = true
          hasItem.mockImplementationOnce(() => false)
          jest.spyOn(Date, 'now').mockImplementation(() => 98765)
          jest.spyOn(Math, 'random').mockImplementation(() => 0.123456)
          const store = configureStore({})

          await store.dispatch(get('/foo'))

          expect(requestMock.set).toHaveBeenCalledWith(
            'X-TRACE-ID',
            '98765R123456'
          )
          expect(setItem).toHaveBeenCalledWith('traceId2', '98765R123456')
        })

        it('fallback to generating a new `traceId` on the server', async () => {
          setJsessionid.mockImplementation(() => ({ type: 'SET_JSESSION_ID' }))

          global.process.browser = false
          jest.spyOn(Date, 'now').mockImplementation(() => 98765)
          jest.spyOn(Math, 'random').mockImplementation(() => 0.123456)
          const store = configureStore({}, { traceId: '' })

          await store.dispatch(get('/foo'))

          expect(requestMock.set).toHaveBeenCalledWith(
            'X-TRACE-ID',
            '98765R123456'
          )
        })
      })

      describe('X-PREF-SHIP', () => {
        beforeAll(() => {
          setRequestMock()
        })

        afterAll(() => {
          global.process.browser = false
        })

        it('uses `x-pref-ship` from redux store, if it exists', async () => {
          global.process.browser = true

          const store = configureStore(state, {})

          await store.dispatch(get('/foo'))

          expect(requestMock.set).toHaveBeenCalledWith(
            'X-PREF-SHIP',
            'United Kingdom'
          )
        })

        it('X-PREF-SHIP not set, if shipping destination has not been set', async () => {
          global.process.browser = true

          const store = configureStore(
            {
              ...state,
              shippingDestination: {
                destination: '',
              },
            },
            {}
          )

          await store.dispatch(get('/foo'))

          expect(requestMock.set).not.toHaveBeenCalledWith('X-PREF-SHIP', '')
        })
      })
    })

    describe('response handler', () => {
      let getStateMock

      beforeEach(() => {
        getStateMock = jest.fn(() => ({
          ...state,
          jsessionid: { value: 'jsessionid' },
        }))
        global.process.env.USE_NEW_HANDLER = 'true'
      })
      describe('rememberMe', () => {
        it('updates remember me state if restricted action response', async () => {
          const resp = {
            status: 401,
            headers: {},
            body: {
              isRestrictedActionResponse: true,
              account: {
                rememberMe: true,
              },
            },
          }

          setRequestMock({}, resp, {}, 401)

          const httpRequest = get('/whatever')
          isFeatureRememberMeEnabled.mockReturnValueOnce(true)

          try {
            await httpRequest(dispatchMock, getStateMock)
            global.fail('Expected httpRequest to throw')
          } catch (error) {
            expect(handleRestrictedActionResponse).toHaveBeenCalledWith(resp)
          }
        })

        it('does not update remember me state if not restricted action response', async () => {
          const resp = {
            status: 401,
            headers: {},
            body: {
              isRestrictedActionResponse: false,
              account: {
                rememberMe: false,
              },
            },
          }

          setRequestMock({}, resp, {}, 401)

          const httpRequest = get('/whatever')
          isFeatureRememberMeEnabled.mockReturnValueOnce(true)

          try {
            await httpRequest(dispatchMock, getStateMock)
            global.fail('Expected httpRequest to throw')
          } catch (error) {
            expect(handleRestrictedActionResponse).not.toHaveBeenCalled()
          }
        })
      })

      describe('not in browser', () => {
        beforeAll(() => {
          global.process.browser = false
        })

        describe('the API returns a 504 error code', () => {
          describe('the url contains "/api/cms/"', () => {
            beforeAll(() => {
              setRequestMock(
                {},
                {
                  headers: {
                    'set-cookie': 'cookie',
                  },
                },
                {},
                504,
                '/api/cms/'
              )
            })

            it('should dispatch a CMS Error', async () => {
              setJsessionid.mockImplementation(() => ({
                type: 'SET_JSESSION_ID',
              }))
              const httpRequest = get('/whatever')

              try {
                await httpRequest(dispatchMock, getStateMock)
              } catch (e) {
                expect(dispatchParameterMock).toHaveBeenCalledWith({
                  type: 'SET_JSESSION_ID',
                })
                expect(dispatchParameterMock).toHaveBeenCalledWith(
                  'SET_CMS_ERROR'
                )
              }

              expect.assertions(2)
            })
          })

          describe('the url does not contain "/api/cms/" and the error response status code is 500', () => {
            beforeAll(() => {
              setRequestMock(
                {},
                {
                  statusCode: 500,
                  headers: {
                    'set-cookie': 'cookie',
                  },
                },
                {},
                504,
                ''
              )
            })

            it('should dispatch an API Error', async () => {
              const httpRequest = get('/whatever')

              try {
                await httpRequest(dispatchMock, getStateMock)
              } catch (e) {
                expect(dispatchParameterMock).toHaveBeenCalledWith({
                  type: 'SET_JSESSION_ID',
                })
                expect(dispatchParameterMock).toHaveBeenCalledWith(
                  'SET_API_ERROR'
                )
              }

              expect.assertions(2)
            })
          })

          describe('the url does not contain "/api/cms/" and the error response status code is 404', () => {
            beforeAll(() => {
              setRequestMock(
                {},
                {
                  statusCode: 404,
                  headers: {
                    'set-cookie': 'cookie',
                  },
                },
                {},
                504,
                ''
              )
            })

            it('should dispatch an API Error', async () => {
              const httpRequest = get('/whatever')

              try {
                await httpRequest(dispatchMock, getStateMock)
              } catch (e) {
                expect(dispatchParameterMock).toHaveBeenCalledWith({
                  type: 'SET_JSESSION_ID',
                })
                expect(dispatchParameterMock).toHaveBeenCalledWith(
                  'SET_API_ERROR'
                )
              }

              expect.assertions(2)
            })
          })

          describe('the error body contains validation errors', () => {
            beforeAll(() => {
              setRequestMock(
                {},
                {
                  headers: {
                    'set-cookie': 'cookie',
                  },
                  body: {
                    originalMessage: 'Validation error',
                    validationErrors: [
                      { message: 'error1' },
                      { message: 'error2' },
                    ],
                  },
                },
                {},
                504,
                ''
              )
            })

            it('should set the first validation message in the error body', async () => {
              const httpRequest = get('/whatever')

              try {
                await httpRequest(dispatchMock, getStateMock)
              } catch (e) {
                expect(e.response.body.message).toEqual('error1')
              }

              expect.assertions(1)
            })
          })
        })
      })

      describe('in browser', () => {
        beforeAll(() => {
          global.process.browser = true
        })

        afterAll(() => {
          global.process.browser = false
        })

        describe('the session has expired', () => {
          beforeAll(() => {
            setRequestMock(
              {},
              {
                headers: {
                  'session-expired': 'true',
                },
              },
              {},
              504
            )
          })

          it('should dispatch Session Expired', async () => {
            const httpRequest = get('/whatever')
            sessionExpired.mockImplementation(() => 'SESSION_EXPIRED')
            try {
              await httpRequest(dispatchMock, getStateMock)
            } catch (e) {
              expect(dispatchParameterMock).toHaveBeenCalledWith(
                'SESSION_EXPIRED'
              )
              expect(logger.info).toHaveBeenCalledWith('api-service', {
                transactionId: 1000000,
                loggerMessage: 'session-expired',
              })
            }

            expect.assertions(2)
          })
        })
      })
    })
  })

  describe('#post', () => {
    let getStateMock

    beforeAll(() => {
      setRequestMock()

      getStateMock = jest.fn(() => ({
        ...state,
        jsessionid: { value: 'jsessionid' },
      }))
      global.process.browser = false
      global.process.env.USE_NEW_HANDLER = 'true'
    })

    describe('superagent', () => {
      it('should be called with the method POST and a composed url if the path does not contain https', () => {
        const httpRequest = post('/whatever')

        httpRequest(dispatchMock, getStateMock, {})

        expect(superagent).toHaveBeenCalledWith('POST', ':3000/api/whatever')
      })
    })

    describe('response handler', () => {
      describe('the API returns a 504 error code', () => {
        describe('the url contains "/api/cms/"', () => {
          beforeAll(() => {
            setRequestMock(
              {},
              {
                headers: {
                  'set-cookie': 'cookie',
                },
              },
              {},
              504,
              '/api/cms/'
            )

            global.process.browser = false
          })

          it('should not dispatch a CMS Error when the handlerError flag is not set', async () => {
            const httpRequest = post('/whatever')

            try {
              await httpRequest(dispatchMock, getStateMock)
            } catch (e) {
              expect(dispatchParameterMock).toHaveBeenCalledWith({
                type: 'SET_JSESSION_ID',
              })
              expect(dispatchParameterMock).not.toHaveBeenCalledWith(
                'SET_CMS_ERROR'
              )
            }

            expect.assertions(2)
          })

          it('should dispatch a CMS Error when the handlerError flag is set to true', async () => {
            const httpRequest = post('/whatever', {}, true)

            try {
              await httpRequest(dispatchMock, getStateMock)
            } catch (e) {
              expect(dispatchParameterMock).toHaveBeenCalledWith({
                type: 'SET_JSESSION_ID',
              })
              expect(dispatchParameterMock).toHaveBeenCalledWith(
                'SET_CMS_ERROR'
              )
            }

            expect.assertions(2)
          })
        })
      })
    })
  })

  describe('#put', () => {
    let getStateMock

    beforeAll(() => {
      setRequestMock()

      getStateMock = jest.fn(() => ({
        ...state,
        jsessionid: { value: 'jsessionid' },
      }))
      global.process.browser = false
      global.process.env.USE_NEW_HANDLER = 'true'
    })

    describe('superagent', () => {
      it('should be called with the method PUT and a composed url if the path does not contain https', () => {
        const httpRequest = put('/whatever')

        httpRequest(dispatchMock, getStateMock, {})

        expect(superagent).toHaveBeenCalledWith('PUT', ':3000/api/whatever')
      })
    })
  })

  describe('#deleted', () => {
    let getStateMock

    beforeAll(() => {
      setRequestMock()

      getStateMock = jest.fn(() => ({
        ...state,
        jsessionid: { value: 'jsessionid' },
      }))
      global.process.browser = false
      global.process.env.USE_NEW_HANDLER = 'true'
    })

    describe('superagent', () => {
      it('should be called with the method DELETE and a composed url if the path does not contain https', () => {
        const httpRequest = del('/whatever')

        httpRequest(dispatchMock, getStateMock, {})

        expect(superagent).toHaveBeenCalledWith('DELETE', ':3000/api/whatever')
      })
    })
  })

  describe('on Checkout page', () => {
    let getStateMock
    let oldWindowLocation

    beforeEach(() => {
      getStateMock = jest.fn(() => ({
        ...state,
        jsessionid: { value: 'jsessionid' },
      }))
    })

    beforeAll(() => {
      global.process.browser = true
      global.process.env.USE_NEW_HANDLER = 'true'
      oldWindowLocation = window.location
      delete window.location
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/checkout/login',
        },
      })
    })

    afterAll(() => {
      window.location = oldWindowLocation
      global.process.browser = false
      global.process.env.USE_NEW_HANDLER = null
    })

    describe('on successful status', () => {
      it('should dispatch analytics event, on success', async () => {
        setRequestMock(
          {},
          {
            headers: {
              'set-cookie': 'cookie',
            },
            body: {},
          },
          {},
          200,
          'http://m.topshop.com/api/getAccount',
          'GET'
        )
        const httpRequest = get('/whatever')

        try {
          await httpRequest(dispatchMock, getStateMock)
        } catch (e) {} // eslint-disable-line no-empty
        expect(sendAnalyticsApiResponseEvent).toHaveBeenCalledWith({
          apiEndpoint: 'api/getAccount',
          apiMethod: 'GET',
          responseCode: 200,
        })
      })
      it('should dispatch analytics event, on error', async () => {
        setRequestMock(
          {},
          {
            headers: {
              'set-cookie': 'cookie',
            },
            body: {},
          },
          {},
          518,
          'http://m.topshop.com/api/getAccount',
          'GET'
        )
        const httpRequest = get('/whatever')

        try {
          await httpRequest(dispatchMock, getStateMock)
        } catch (e) {
          expect(sendAnalyticsApiResponseEvent).toHaveBeenCalledWith({
            apiEndpoint: 'api/getAccount',
            apiMethod: 'GET',
            responseCode: 518,
          })
        }
      })
    })
  })

  describe('session timeout', () => {
    describe('server side', () => {
      it('removes the jsessionid from the Store', async () => {
        global.process.browser = false

        sessionExpired.mockImplementation(() => Promise.resolve())

        setRequestMock(
          {},
          {
            headers: {
              'session-expired': true,
            },
            body: {},
          },
          {},
          422,
          'http://m.topshop.com/api/getAccount',
          'GET'
        )

        const httpRequest = get('http://www.test.com/test')

        try {
          await httpRequest(dispatchMock, () => state)
        } catch (error) {
          expect(setJsessionid).toHaveBeenCalledTimes(1)
          expect(setJsessionid).toHaveBeenCalledWith(null)
        }
      })
    })

    it('removes sessionJwt from the store', async () => {
      global.process.browser = false

      sessionExpired.mockImplementation(() => Promise.resolve())

      setRequestMock(
        {},
        {
          headers: {
            'session-expired': true,
          },
          body: {},
        },
        {},
        422,
        'http://m.topshop.com/api/getAccount',
        'GET'
      )

      const httpRequest = get('http://www.test.com/test')

      try {
        await httpRequest(dispatchMock, () => state)
      } catch (error) {
        expect(setSessionJwt).toHaveBeenCalledTimes(1)
        expect(setSessionJwt).toHaveBeenCalledWith(null)
      }
    })

    it('should throw original error on successful logout request', async () => {
      sessionExpired.mockImplementation(() => Promise.resolve())

      setRequestMock(
        {},
        {
          headers: {
            'session-expired': true,
          },
          body: {},
        },
        {},
        422,
        'http://m.topshop.com/api/getAccount',
        'GET'
      )

      const httpRequest = get('http://www.test.com/test')

      try {
        await httpRequest(dispatchMock, () => state)
      } catch (error) {
        expect(error.statusCode).toBe(422)
        expect(error.response.headers['session-expired']).toBe(true)
      }
    })

    it('should throw original error on failed logout request', async () => {
      sessionExpired.mockImplementation(() => Promise.reject())

      setRequestMock(
        {},
        {
          headers: {
            'session-expired': true,
          },
          body: {},
        },
        {},
        422,
        'http://m.topshop.com/api/getAccount',
        'GET'
      )

      const httpRequest = get('http://www.test.com/test')

      try {
        await httpRequest(dispatchMock, () => state)
      } catch (error) {
        expect(error.statusCode).toBe(422)
        expect(error.response.headers['session-expired']).toBe(true)
      }
    })
  })
})
