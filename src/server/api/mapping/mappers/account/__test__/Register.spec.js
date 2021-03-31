import {
  buildExecutor,
  expectFailedWith,
  setWCSResponse,
  getRequests,
  getRequestArgs,
} from '../../../__test__/utils'
import Register from '../Register'

jest.mock('../../../transforms/logon')
jest.mock('../../../../../lib/bazaarvoice-utils', () => ({
  encodeUserId: jest.fn(),
}))

import transform from '../../../transforms/logon'
import { encodeUserId } from '../../../../../lib/bazaarvoice-utils'

jest.mock('../cookies', () => ({
  registerCookies: jest.fn(),
  logonHeaders: jest.fn(),
}))
import { registerCookies, logonHeaders } from '../cookies'

const wcsPayload = {
  storeId: 12556,
  catalogId: '33057',
  create_logonId: 'bob@mvrht.net',
  logonPassword: 'test123',
  logonPasswordVerify: 'test123',
  subscribe: 'NO',
  source: 'MYACCOUNT',
  preferredLanguage: '-1',
  preferredCurrency: 'GBP',
  profileType: 'C',
  registerType: 'G',
  challengeAnswer: '-',
  challengeQuestion: '-',
  page: 'account',
  redirectURL:
    'UserRegistrationForm?langId=-1&storeId=12556&catalogId=33057&new=Y&returnPage=',
  URL: 'UserRegistrationAjaxView',
  personalizedCatalog: 'false',
  new: 'Y',
  checkUserAccountUrl:
    'UserIdExists?storeId=12556&catalogId=33057&URL=UserRegistrationAjaxView&ErrorViewName=UserRegistrationAjaxView&action=check',
  errorViewName: 'UserRegistrationAjaxView',
  defaultServiceId: 8,
  rememberMe: true,
  appId: undefined,
  mergeGuestOrder: false,
}

const montyPayload = {
  email: 'bob@mvrht.net',
  password: 'test123',
  passwordConfirm: 'test123',
  subscribe: false,
  rememberMe: true,
  mergeGuestOrder: false,
}

const responseBody = { success: true, userTrackingId: 1848001 }

const transformedBody = { body: 'monty', userTrackingId: 1848001 }
const resultBody = { body: 'monty', userTrackingId: 1848001 }

const logonFormQuery = {
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  new: 'Y',
  returnPage: '',
  personalizedCatalog: false,
  reLogonURL: 'LogonForm',
}

const jsessionid = '123'

const firstApiResponse = {
  body: {
    success: true,
  },
  jsessionid,
}

const secondApiResponse = {
  body: {
    success: true,
    userTrackingId: '12345678',
  },
}
const headers = {
  'brand-code': 'tsuk',
  cookies: 'Some cookies',
}

const expectedSetCookies = ['cookie1', 'cookie2']
const expectedSetHeaders = [
  {
    name: 'bvtoken',
    value: '1234',
  },
]

const response = {
  jsessionid,
  body: responseBody,
}

const resultResponse = {
  jsessionid,
  body: transformedBody,
  setCookies: expectedSetCookies,
  setHeaders: expectedSetHeaders,
}

const getCookieFromStore = jest.fn()
const execute = buildExecutor(Register, {
  endpoint: 'originEndpoint',
  query: 'query',
  payload: montyPayload,
  method: 'post',
  headers,
  getCookieFromStore,
})

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('mapEndpoint', () => {
    it('sets destinationEndpoint to UserRegistrationAdd', async () => {
      setWCSResponse({ body: { success: true } })
      setWCSResponse({ body: { success: true } }, { n: 1 })
      getCookieFromStore.mockReturnValueOnce(Promise.resolve('N'))

      await execute({
        headers: { cookie: 'cookie' },
      })

      expect(getRequestArgs()).toEqual(
        expect.objectContaining({
          endpoint: '/webapp/wcs/stores/servlet/UserRegistrationAdd',
        })
      )
    })
    it('sets the destination endpoint to UserRegistrationUpdate', async () => {
      setWCSResponse({ body: { success: true } })
      setWCSResponse({ body: { success: true } }, { n: 1 })
      getCookieFromStore.mockReturnValueOnce(Promise.resolve('Y'))

      await execute({
        headers: { cookie: 'cookie' },
      })

      expect(getRequestArgs()).toEqual(
        expect.objectContaining({
          endpoint: '/webapp/wcs/stores/servlet/UserRegistrationUpdate',
        })
      )
    })
    it('sets logonFormEndpoint to LogonForm', async () => {
      setWCSResponse({ body: { success: true } })
      setWCSResponse({ body: { success: true } }, { n: 1 })
      getCookieFromStore.mockReturnValueOnce(Promise.resolve('Y'))

      await execute()

      expect(getRequestArgs(1)).toEqual(
        expect.objectContaining({
          endpoint: '/webapp/wcs/stores/servlet/LogonForm',
        })
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('sets the payload', () => {
      const register = new Register()

      expect(register.payload).toBeUndefined()
      register.payload = montyPayload

      register.mapRequestParameters()

      expect(register.payload).toEqual(wcsPayload)
    })

    it('sets logonFormQuery', () => {
      const register = new Register()

      expect(register.logonFormQuery).toBeUndefined()

      register.payload = montyPayload
      register.mapRequestParameters()

      expect(register.logonFormQuery).toEqual(logonFormQuery)
    })

    it('sets the appId in the payload', () => {
      const appId = '12345'
      const register = new Register()

      register.payload = {
        ...montyPayload,
        appId,
      }

      register.mapRequestParameters()

      expect(register.payload).toEqual({
        ...wcsPayload,
        appId,
      })
    })

    it('sets source in the payload', () => {
      const register = new Register()

      register.payload = {
        ...montyPayload,
        source: 'testing',
      }

      register.mapRequestParameters()

      expect(register.payload).toEqual({
        ...wcsPayload,
        source: 'testing',
      })
    })

    it('sets rememberMe to false if it is not sent from the front end', () => {
      const register = new Register()

      const { rememberMe, ...payload } = montyPayload

      register.payload = payload

      expect(register.payload.rememberMe).toBeUndefined()

      register.mapRequestParameters()

      expect(register.payload).toEqual({
        ...wcsPayload,
        rememberMe: false,
      })
    })

    it('sets rememberMe to false if it is received as false', () => {
      const register = new Register()

      register.payload = {
        ...montyPayload,
        rememberMe: false,
      }

      register.mapRequestParameters()

      expect(register.payload).toEqual({
        ...wcsPayload,
        rememberMe: false,
      })
    })
  })

  describe('mapResponseBody', () => {
    it('calls transform with the body passed in', () => {
      transform.mockReturnValue(transformedBody)

      const register = new Register()

      expect(register.mapResponseBody(responseBody)).toEqual(resultBody)
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(responseBody, true)
    })
  })

  describe('mapResponse', () => {
    it('returns a mapped response containing a setCookies property', () => {
      const register = new Register()
      register.mapResponseBody = jest.fn(() => transformedBody)
      registerCookies.mockReturnValue(expectedSetCookies)
      encodeUserId.mockReturnValue('bv')
      expect(register.mapResponse(response).setCookies).toEqual(
        resultResponse.setCookies
      )
    })
    it('returns a mapped response containing a setHeaders property', () => {
      const register = new Register()

      register.mapResponseBody = jest.fn(() => transformedBody)
      logonHeaders.mockReturnValue(expectedSetHeaders)
      encodeUserId.mockReturnValue('bv')

      expect(register.mapResponse(response).setHeaders).toEqual(
        resultResponse.setHeaders
      )
    })
    it('calls mapResponseBody', () => {
      const register = new Register()
      register.mapResponseBody = jest.fn(() => transformedBody)
      registerCookies.mockReturnValue(expectedSetCookies)
      register.mapResponse(response)
      expect(register.mapResponseBody).toHaveBeenCalledTimes(1)
      expect(register.mapResponseBody).toHaveBeenCalledWith(responseBody)
    })
    it('calls getCookiesToSet', () => {
      const register = new Register()
      register.mapResponseBody = jest.fn(() => transformedBody)
      registerCookies.mockReturnValue(expectedSetCookies)
      encodeUserId.mockReturnValue('bv')
      register.mapResponse(response)
      expect(registerCookies).toHaveBeenCalledTimes(1)
      expect(registerCookies).toHaveBeenCalledWith('bv')
    })
  })

  describe('execute', () => {
    it('calls mapRequestParameters', () => {
      setWCSResponse(Promise.resolve({}))
      const register = new Register()
      register.mapRequestParameters = jest.fn()
      expect(register.mapRequestParameters).not.toHaveBeenCalled()
      register.execute()
      expect(register.mapRequestParameters).toHaveBeenCalledTimes(1)
      expect(register.mapRequestParameters).toHaveBeenCalledWith()
    })
    it('calls mapEndpoint', () => {
      setWCSResponse(Promise.resolve({}))
      const register = new Register()
      register.mapRequestParameters = jest.fn()
      register.mapEndpoint = jest.fn()
      expect(register.mapEndpoint).not.toHaveBeenCalled()
      register.execute()
      expect(register.mapEndpoint).toHaveBeenCalledTimes(1)
      expect(register.mapEndpoint).toHaveBeenCalledWith()
    })
    it('calls sendRequestToApi two times', async () => {
      setWCSResponse(Promise.resolve(firstApiResponse), { n: 0 })
      setWCSResponse(Promise.resolve(secondApiResponse), { n: 1 })
      transform.mockReturnValue(transformedBody)
      expect(getRequests().length).toBe(0)
      await execute()
      expect(getRequests().length).toBe(2)
    })
    it('calls sendRequestToApi for the UserRegistrationAdd endpoint', async () => {
      getCookieFromStore.mockReturnValueOnce('N')
      setWCSResponse(Promise.resolve(firstApiResponse), { n: 0 })
      setWCSResponse(Promise.resolve(secondApiResponse), { n: 1 })
      transform.mockReturnValue(transformedBody)

      expect(getRequests().length).toBe(0)

      await execute()

      expect(getRequests().length).toBe(2)
      expect(getRequests()[0]).toEqual([
        false,
        '/webapp/wcs/stores/servlet/UserRegistrationAdd',
        {},
        wcsPayload,
        'post',
        headers,
      ])
    })
    it('calls sendRequestToApi for the logonForm endpoint', async () => {
      getCookieFromStore.mockReturnValueOnce('Y')
      setWCSResponse(Promise.resolve(firstApiResponse), { n: 0 })
      setWCSResponse(Promise.resolve(secondApiResponse), { n: 1 })
      transform.mockReturnValue(transformedBody)

      expect(getRequests().length).toBe(0)

      await execute()

      expect(getRequests().length).toBe(2)
      expect(getRequests()[1]).toEqual([
        false,
        '/webapp/wcs/stores/servlet/LogonForm',
        logonFormQuery,
        {},
        'get',
        headers,
        jsessionid,
      ])
    })

    describe('errorCodes', () => {
      it('should throw a mapped statusCode if wcs returns an error code', async () => {
        const res = {
          body: {
            errorCode: 2030,
            message: 'emergency!',
          },
        }
        setWCSResponse(Promise.resolve(res))

        return expectFailedWith(execute(), {
          message: 'emergency!',
          statusCode: 409,
          wcsErrorCode: 2030,
        })
      })
    })
  })
})
