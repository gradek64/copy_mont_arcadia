import Account from '../Account'

jest.mock('../../../Mapper')

jest.mock('../../../transforms/logon')
jest.mock('../Verify')
jest.mock('../cookies', () => ({
  authenticatedCookies: jest.fn(),
}))
import transform from '../../../transforms/logon'
import Verify from '../Verify'
import Mapper from '../../../Mapper'
import { authenticatedCookies } from '../cookies'

const wcs = '/webapp/wcs/stores/servlet/'
const storeCodes = {
  siteId: 12556,
  catalogId: '33057',
  langId: '-1',
}

const logonFormQuery = {
  storeId: 12556,
  catalogId: '33057',
  langId: '-1',
  new: 'Y',
  returnPage: '',
  personalizedCatalog: false,
  reLogonURL: 'LogonForm',
}

const body = {
  message: 'hello',
  isLoggedIn: true,
}

const headers = { cookies: 'Some cookies' }

const expectedSetCookies = [
  {
    name: 'authenticated',
    options: {
      path: '/',
      encoding: 'none',
      isSecure: false,
      isHttpOnly: false,
      clearInvalid: false,
      strictHeader: false,
      ttl: 1800000,
    },
    value: 'yes',
  },
]

const responseBody = { body: 'wcs', userTrackingId: 1848001 }
const transformedBody = { body: 'monty', userTrackingId: 1848001 }

const response = {
  jsessionid: '123',
  body: responseBody,
}

const resultResponse = {
  jsessionid: '123',
  body: transformedBody,
  setCookies: expectedSetCookies,
}

const verifyQuery = { email: 'email' }

describe('Account', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('expects to set "destinationEndpoint" property to the expected value', () => {
      const account = new Account()
      expect(account.destinationEndpoint).toBeUndefined()
      account.mapEndpoint()
      expect(account.destinationEndpoint).toBe(`${wcs}LogonForm`)
    })
  })
  describe('mapRequestParameters', () => {
    it('expects to set "query" property to the expected value', () => {
      const account = new Account()
      account.storeConfig = storeCodes
      expect(account.query).toBeUndefined()
      account.mapRequestParameters()
      expect(account.query).toEqual(logonFormQuery)
    })
  })
  describe('mapResponseBody', () => {
    it('calls transform with the body passed in', () => {
      transform.mockReturnValue(transformedBody)
      const account = new Account()
      expect(account.mapResponseBody(body)).toBe(transformedBody)
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(body)
    })
  })
  describe('mapResponse', () => {
    it('returns a mapped response containing a setCookies property', () => {
      const account = new Account()
      account.mapResponseBody = jest.fn(() => transformedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      expect(account.mapResponse(response)).toEqual(resultResponse)
    })
    it('calls mapResponseBody', () => {
      const account = new Account()
      account.mapResponseBody = jest.fn(() => transformedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      account.mapResponse(response)
      expect(account.mapResponseBody).toHaveBeenCalledTimes(1)
      expect(account.mapResponseBody).toHaveBeenCalledWith(responseBody)
    })
    it('calls getCookiesToSet', () => {
      const account = new Account()
      account.mapResponseBody = jest.fn(() => transformedBody)
      authenticatedCookies.mockReturnValue(expectedSetCookies)
      account.mapResponse(response)
      expect(authenticatedCookies).toHaveBeenCalledTimes(1)
    })
  })
  describe('execute', () => {
    it('calls super.execute()', () => {
      Mapper.prototype.execute = jest.fn()
      Mapper.prototype.execute.mockReturnValue('super')
      const account = new Account()
      account.query = {}
      expect(Mapper.prototype.execute).not.toHaveBeenCalled()
      expect(account.execute()).toBe('super')
      expect(Mapper.prototype.execute).toHaveBeenCalledTimes(1)
      expect(Mapper.prototype.execute).toHaveBeenCalledWith()
    })
    describe('if an email property exists in the query', () => {
      it('calls the Verify constructor', async () => {
        const account = new Account()
        account.destinationEndpoint = 'destinationEndpoint'
        account.query = verifyQuery
        account.payload = {}
        account.headers = headers
        account.method = 'get'
        await account.execute()
        expect(Verify).toHaveBeenCalledTimes(1)
        expect(Verify).toHaveBeenCalledWith(
          'destinationEndpoint',
          verifyQuery,
          {},
          'get',
          headers
        )
        expect(Verify.mock.instances.length).toBe(1)
      })
      it('calls execute on the Verify instance', async () => {
        const account = new Account()
        account.destinationEndpoint = 'destinationEndpoint'
        account.query = verifyQuery
        account.payload = {}
        account.headers = headers
        account.method = 'get'
        await account.execute()
        const instance = Verify.mock.instances[0]
        expect(instance.execute).toHaveBeenCalledTimes(1)
        expect(instance.execute).toHaveBeenCalledWith()
      })
      it('returns the result of Verify execute', () => {
        const verifyReturn = { value: 'value' }
        Verify.prototype.execute.mockReturnValue(verifyReturn)
        const account = new Account()
        account.destinationEndpoint = 'destinationEndpoint'
        account.query = verifyQuery
        account.payload = {}
        account.headers = headers
        account.method = 'get'
        return expect(account.execute()).toBe(verifyReturn)
      })
    })
  })
})
