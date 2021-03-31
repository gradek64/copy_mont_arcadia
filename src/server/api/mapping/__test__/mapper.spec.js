import Mapper from '../Mapper'
import * as configFunctions from '../../../config'
import * as utils from '../../utils'
import errorDictionary from '../../dictionaries/errorMessages.json'
import * as newrelic from '../../../lib/newrelic'
import { setWCSResponse, buildExecutor, expectFailedWith } from './utils'

jest.mock('../../api')
jest.mock('../../../config')
jest.mock('../../utils')
jest.mock('../../../lib/newrelic')

function checkInstanceProperties(mapper) {
  expect(mapper).toBeInstanceOf(Mapper)
  expect(mapper.destinationEndpoint).toBe('originEndpoint')
  expect(mapper.query).toBe('query')
  expect(mapper.payload).toBe('payload')
  expect(mapper.method).toBe('method')
  expect(mapper.headers).toEqual({ 'brand-code': 'tsuk' })
  expect(typeof mapper.sendRequestToApi).toBe('function')
  expect(typeof mapper.getOrderId).toBe('function')
  expect(typeof mapper.getCookieFromStore).toBe('function')
  expect(typeof mapper.getSession).toBe('function')
}

describe('# Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('# constructor', () => {
    describe('destinationHostname property', () => {
      it('is set up as expected', () => {
        global.process.env.WCS_ENVIRONMENT = 'env'
        expect(utils.getDestinationHostFromStoreCode).not.toHaveBeenCalled()

        utils.getDestinationHostFromStoreCode.mockReturnValue('www.topshop.com')

        const mapper = new Mapper(
          'originEndpoint',
          'query',
          'payload',
          'method',
          { 'brand-code': 'tsuk' }
        )

        expect(utils.getDestinationHostFromStoreCode).toHaveBeenCalledTimes(1)
        expect(utils.getDestinationHostFromStoreCode).toHaveBeenCalledWith(
          'env',
          'tsuk'
        )
        expect(mapper.destinationHostname).toBe('www.topshop.com')
        global.process.env.WCS_ENVIRONMENT = undefined
      })
    })

    it('sets properly the properties associated with store configuration deduced from existing brand-code', () => {
      expect(configFunctions.getConfigByStoreCode).not.toHaveBeenCalled()

      configFunctions.getConfigByStoreCode.mockReturnValue({
        siteId: 12556,
        catalogId: '33057',
        langId: '-1',
      })

      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' }
      )

      expect(configFunctions.getConfigByStoreCode).toHaveBeenCalledTimes(1)
      expect(configFunctions.getConfigByStoreCode).toHaveBeenCalledWith('tsuk')
      expect(mapper.storeConfig.catalogId).toBe('33057')
      expect(mapper.storeConfig.siteId).toBe(12556)
      expect(mapper.storeConfig.langId).toBe('-1')
    })

    it('sets properly the properties associated with undefined store configuration', () => {
      expect(configFunctions.getConfigByStoreCode).not.toHaveBeenCalled()

      configFunctions.getConfigByStoreCode.mockReturnValue(undefined)

      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' }
      )

      expect(configFunctions.getConfigByStoreCode).toHaveBeenCalledTimes(1)
      expect(configFunctions.getConfigByStoreCode).toHaveBeenCalledWith('tsuk')
      expect(mapper.catalogId).toBe(undefined)
      expect(mapper.siteId).toBe(undefined)
      expect(mapper.langId).toBe(undefined)
    })

    it('sets the instance properties as expected', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        {},
        [],
        () => {},
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
    })
  })

  describe('# mapEndpoint', () => {
    it('does not do anything', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(() => Promise.resolve()),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      expect(mapper.mapEndpoint()).toBe(undefined)
      checkInstanceProperties(mapper)
    })
  })

  describe('# mapRequestParameters', () => {
    it('does not do anything', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(() => Promise.resolve()),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      expect(mapper.mapRequestParameters()).toBe(undefined)
      checkInstanceProperties(mapper)
    })
  })

  describe('# mapResponseBody', () => {
    it('returns exactly the same object received as argument', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(() => Promise.resolve()),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      expect(mapper.mapResponseBody('body')).toBe('body')
      checkInstanceProperties(mapper)
    })
  })

  describe('# mapResponseError', () => {
    it('throws object received as argument', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      expect(() => {
        mapper.mapResponseError('error')
      }).toThrowError('error')
      checkInstanceProperties(mapper)
    })

    it('does not translate if no error message property', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' }
      )
      expect(utils.translate).toHaveBeenCalledTimes(0)
      expect(() => mapper.mapResponseError('error')).toThrow()
      expect(utils.translate).toHaveBeenCalledTimes(0)
    })

    it('does translate the error message', () => {
      configFunctions.getConfigByStoreCode.mockReturnValue({
        siteId: 12556,
        catalogId: '33057',
        langId: '-1',
        lang: 'en',
      })

      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' }
      )

      expect(utils.translate).toHaveBeenCalledTimes(0)
      expect(() =>
        mapper.mapResponseError({ message: 'error message' })
      ).toThrow()
      expect(utils.translate).toHaveBeenCalledTimes(1)
      expect(utils.translate).toHaveBeenCalledWith(
        errorDictionary,
        'en',
        'error message'
      )
    })
  })

  describe('# mapErrorCode', () => {
    class ExampleMapper extends Mapper {
      mapWCSErrorCodes = {
        NO_SOMETHING: 401,
      }
    }
    const execute = buildExecutor(ExampleMapper, {
      endpoint: 'originEndpoint',
      query: 'query',
      payload: 'payload',
      method: 'METHOD',
      headers: {
        'brand-code': 'tsuk',
      },
    })

    beforeEach(() => {
      configFunctions.getConfigByStoreCode.mockReturnValue({
        siteId: 12556,
        catalogId: '33057',
        langId: '-1',
      })
    })

    it('should not throw an error if the wcs response doesnt have an errorCode on it', async () => {
      const noErrorCodeRes = { foo: 'bar' }
      setWCSResponse(noErrorCodeRes)
      await expect(execute()).resolves.toHaveProperty('body', noErrorCodeRes)
    })

    it('should return the res if this.mapWCSErrorCodes does not include the errorCode returned by wcs', async () => {
      const unrecognisedErrorCodeRes = {
        errorCode: 'NO_SOMETHING_ELSE',
        message: 'you forgot something but we dont care about that dw',
      }
      setWCSResponse(unrecognisedErrorCodeRes)
      await expect(execute()).resolves.toHaveProperty(
        'body',
        unrecognisedErrorCodeRes
      )
    })

    const recognisedErrorCodeRes = {
      errorCode: 'NO_SOMETHING',
      message: 'you forgot something and this time its real bad',
    }

    it('should throw the appropriate error if this.mapWCSErrorCodes includes the errorCode returned by wcs', () => {
      setWCSResponse(Promise.resolve({ body: recognisedErrorCodeRes }))
      return expectFailedWith(execute(), {
        statusCode: 401,
        message: recognisedErrorCodeRes.message,
        wcsErrorCode: recognisedErrorCodeRes.errorCode,
      })
    })

    it('should attach an NR custom parameter if it throws', () => {
      setWCSResponse(Promise.resolve({ body: recognisedErrorCodeRes }))
      return execute().then(
        () => {
          throw new Error("Promise didn't reject as expected")
        },
        () => {
          expect(newrelic.addCustomAttribute).toHaveBeenCalled()
          expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
            'wcsErrorCode',
            'NO_SOMETHING'
          )
        }
      )
    })
  })

  describe('# mapResponse', () => {
    it('returns a mapped response containing a jsessionid and body property', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(() => Promise.resolve()),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      mapper.mapResponseBody = jest.fn(() => 'transformed')
      expect(mapper.mapResponse({ body: 'body', jsessionid: '123' })).toEqual({
        body: 'transformed',
        jsessionid: '123',
      })
      checkInstanceProperties(mapper)
    })

    it('calls mapResponseBody with the body of the response', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        { 'brand-code': 'tsuk' },
        'params',
        'cookies',
        jest.fn(() => Promise.resolve()),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
      checkInstanceProperties(mapper)
      mapper.mapResponseBody = jest.fn(() => 'transformed')
      mapper.mapResponse({ body: 'body', jsessionid: '123' })
      expect(mapper.mapResponseBody).toHaveBeenCalledTimes(1)
      expect(mapper.mapResponseBody).toHaveBeenCalledWith('body')
      checkInstanceProperties(mapper)
    })
  })

  describe('# execute', () => {
    it('calls mapRequestParameters and mapEndpoint', () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        'headers',
        'params',
        'cookies',
        jest.fn(() => Promise.resolve())
      )
      mapper.mapRequestParameters = jest.fn()
      mapper.mapEndpoint = jest.fn()
      expect(mapper.mapRequestParameters).not.toHaveBeenCalled()
      expect(mapper.mapEndpoint).not.toHaveBeenCalled()
      mapper.execute()
      expect(mapper.mapRequestParameters).toHaveBeenCalledTimes(1)
      expect(mapper.mapEndpoint).toHaveBeenCalledTimes(1)
    })

    it('calls mapErrorCode & mapResponse in case of promise resolved by sendRequestToApi', async () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        'headers',
        'params',
        'cookies',
        jest.fn(() => Promise.resolve({ a: 'a' }))
      )
      mapper.mapErrorCode = jest.fn((res) => res)
      mapper.mapResponse = jest.fn()
      mapper.mapResponseError = jest.fn()
      expect(mapper.mapErrorCode).not.toHaveBeenCalled()
      expect(mapper.mapResponse).not.toHaveBeenCalled()
      expect(mapper.mapResponseError).not.toHaveBeenCalled()
      await mapper.execute()
      expect(mapper.mapResponseError).not.toHaveBeenCalled()
      expect(mapper.mapErrorCode).toHaveBeenCalled()
      expect(mapper.mapErrorCode).toHaveBeenCalledWith({ a: 'a' })
      expect(mapper.mapResponse).toHaveBeenCalledTimes(1)
      expect(mapper.mapResponse).toHaveBeenCalledWith({ a: 'a' })
    })

    it('calls mapResponseError in case of promise rejected by sendRequestToApi', async () => {
      const mapper = new Mapper(
        'originEndpoint',
        'query',
        'payload',
        'method',
        'headers',
        'params',
        'cookies',
        jest.fn(() => Promise.reject({ error: 'error' }))
      )
      mapper.mapResponseError = jest.fn()
      mapper.mapResponse = jest.fn()
      expect(mapper.mapResponseError).not.toHaveBeenCalled()
      expect(mapper.mapResponse).not.toHaveBeenCalled()
      await mapper.execute()
      expect(mapper.mapResponse).not.toHaveBeenCalled()
      expect(mapper.mapResponseError).toHaveBeenCalledTimes(1)
      expect(mapper.mapResponseError).toHaveBeenCalledWith({ error: 'error' })
    })
  })
})
