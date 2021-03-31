import Verify from '../Verify'

jest.mock('../../../Mapper')

jest.mock('../cookies', () => ({
  authenticatedCookies: jest.fn(),
}))
import { authenticatedCookies } from '../cookies'

const montyQuery = {
  email: 'k274794@mvrht.net',
}

const expectedPayload = {
  storeId: 12556,
  catalogId: 33057,
  URL: 'UserRegistrationAjaxView',
  ErrorViewName: 'UserRegistrationAjaxView',
  action: 'check',
  errorViewName: 'UserRegistrationAjaxView',
  checkUserAccountUrl:
    'UserIdExists?storeId=12556&catalogId=33057&URL=UserRegistrationAjaxView&ErrorViewName=UserRegistrationAjaxView&action=check',
  new: 'Y',
  personalizedCatalog: false,
  page: 'account',
  registerType: 'G',
  profileType: 'C',
  challengeQuestion: '-',
  challengeAnswer: '-',
  create_logonId: 'k274794@mvrht.net',
  logonPassword: '',
  logonPasswordVerify: '',
  subscribe: 'YES',
  default_service_id: 8,
  source: 'MYACCOUNT',
  preferredLanguage: '-1',
  preferredCurrency: 'GBP',
}

const storeConfig = {
  catalogId: 33057,
  langId: '-1',
  siteId: 12556,
  currencyCode: 'GBP',
}

import responseBody from '../../../../../../../test/apiResponses/verify-account/wcs.json'
import expectedBody from '../../../../../../../test/apiResponses/verify-account/hapiMonty.json'

const expectedSetCookies = [
  {
    name: 'authenticated',
    options: {
      clearInvalid: false,
      encoding: 'none',
      isHttpOnly: false,
      isSecure: false,
      path: '/',
      strictHeader: false,
      ttl: 1800000,
    },
    value: 'yes',
  },
]

const response = {
  jsessionid: '123',
  body: responseBody,
}

const resultResponse = {
  jsessionid: '123',
  body: expectedBody,
  setCookies: expectedSetCookies,
}

describe('Verify', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('sets the destinationEndpoint', () => {
      const verify = new Verify()
      expect(verify.destinationEndpoint).toBeUndefined()
      verify.mapEndpoint()
      expect(verify.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/UserIdExists'
      )
    })
  })
  describe('mapRequestParameters', () => {
    it('sets the payload property to the correct value', () => {
      const verify = new Verify()
      verify.query = montyQuery
      verify.storeConfig = storeConfig
      expect(verify.payload).toBeUndefined()
      verify.mapRequestParameters()
      expect(verify.payload).toEqual(expectedPayload)
    })
    it('sets the query property to an empty object', () => {
      const verify = new Verify()
      verify.query = montyQuery
      verify.storeConfig = storeConfig
      verify.mapRequestParameters()
      expect(verify.query).toEqual({})
    })
    describe('store is burton uk', () => {
      it('should set the default_service_id to 5', () => {
        const verify = new Verify()
        verify.query = montyQuery
        verify.storeConfig = { storeCode: 'bruk' }
        verify.mapRequestParameters()
        expect(verify.payload.default_service_id).toBe(5)
      })
    })
  })
  describe('mapResponseBody', () => {
    it('calls transform with the body passed in', () => {
      const verify = new Verify()
      verify.payload = {
        create_logonId: 'monty@desktop.com',
      }
      expect(verify.mapResponseBody(responseBody)).toEqual(expectedBody)
    })
  })
  describe('mapResponse', () => {
    it('returns a mapped response containing a setCookies property', () => {
      const verify = new Verify()
      verify.mapResponseBody = jest.fn(() => expectedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      expect(verify.mapResponse(response)).toEqual(resultResponse)
    })
    it('calls mapResponseBody', () => {
      const verify = new Verify()
      verify.mapResponseBody = jest.fn(() => expectedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      verify.mapResponse(response)
      expect(verify.mapResponseBody).toHaveBeenCalledTimes(1)
      expect(verify.mapResponseBody).toHaveBeenCalledWith(responseBody)
    })
    it('calls getCookiesToSet', () => {
      const verify = new Verify()
      verify.mapResponseBody = jest.fn(() => expectedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      verify.mapResponse(response)
      expect(authenticatedCookies).toHaveBeenCalledTimes(1)
      expect(authenticatedCookies).toHaveBeenCalledWith()
    })
  })
})
