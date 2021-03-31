/*
  The responsability of this is to provide the default Mapper.
  The default mapper does not modify the request query/payload, calls the API just once (no 1:N mapping), does not
  modify the response body and finally returns the promise.

  The default Mapper will be extended by the specific mappers which will override the default methods.
 */

import Boom from 'boom'

import { getConfigByStoreCode } from '../../config'
import { getDestinationHostFromStoreCode, translate } from '../utils'
import errorDictionary from '../dictionaries/errorMessages.json'
import { addCustomAttribute } from '../../lib/newrelic'

export default class Mapper {
  /**
   * Constructor sets instance attributes associated with the current request
   *
   * @param  {String} originEndpoint         hapi endpoint hit by the current request
   * @param  {Object} query                  query parameters of the current request
   * @param  {Object} payload                payload object of the current request
   * @param  {String} method                 current request's method
   * @param  {Object} headers                headers passed in the current request
   * @param  {Object} params                 contains the request parameters passed through the path (e.g.: /api/products/{identifier} => params = { identifier: '123' })
   * @param  {Object} cookies                cookies passed in the current request
   * @param  {Function} sendRequestToApi     Fetch function
   * @param  {Function} getOrderId           Gets the order Id from WCS cookies
   * @param  {Function} getCookieFromStore   if jsessionid is undefined returns null, else
   * @param  {Function} getSession           Fetches session cookies from store if they don't exist on current request
   * @param  {Function} cookieCapture        Provides access to cookies that were provided on the request, or have been returned by WCS.
   */
  constructor(
    originEndpoint,
    query,
    payload,
    method,
    headers,
    params,
    cookies,
    sendRequestToApi,
    getOrderId,
    getCookieFromStore,
    getSession,
    cookieCapture
  ) {
    const storeCode = (headers && headers['brand-code']) || 'tsuk'
    this.storeConfig = getConfigByStoreCode(storeCode)
    this.destinationHostname = getDestinationHostFromStoreCode(
      process.env.WCS_ENVIRONMENT,
      storeCode
    )
    this.destinationEndpoint = originEndpoint
    this.query = query
    this.payload = payload
    this.method = method
    this.headers = headers
    this.params = params
    this.timeout = 0
    this.cookies = cookies
    this.sendRequestToApi = sendRequestToApi
    this.getOrderId = getOrderId
    this.getCookieFromStore = getCookieFromStore
    this.getSession = getSession
    this.cookieCapture = cookieCapture
  }

  mapEndpoint() {}

  mapRequestParameters() {}

  mapResponseBody(body) {
    return body
  }

  mapResponseError(error) {
    if (error.message) {
      if (error.message === 'wcsSessionTimeout') {
        throw error
      }

      error.message = translate(
        errorDictionary,
        this.storeConfig.lang,
        error.message
      )
    }
    throw error
  }

  mapErrorCode(res) {
    const { body } = res

    if (!body) {
      return res
    }

    const { action, errorCode, message, errorMessage } = body

    if (this.mapWCSErrorToSuccessResponse) {
      const shouldMapToSuccess = this.mapWCSErrorToSuccessResponse.includes(
        errorCode
      )

      if (shouldMapToSuccess) {
        return {
          body: {
            action,
            errorCode: null,
            message,
            success: true,
          },
        }
      }
    }

    if (this.mapWCSErrorCodes) {
      const statusFromCode = this.mapWCSErrorCodes[errorCode]
      if (statusFromCode && (message || errorMessage)) {
        addCustomAttribute('wcsErrorCode', errorCode)
        throw Boom.create(statusFromCode, message || errorMessage, {
          wcsErrorCode: errorCode,
        })
      }
    }

    return res
  }

  mapResponse(res) {
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
    }
  }

  execute() {
    this.mapRequestParameters()
    this.mapEndpoint()
    return this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      this.query,
      this.payload,
      this.method.toLowerCase(),
      this.headers,
      null,
      false,
      this.timeout
    )
      .then((res) => {
        const response = this.mapErrorCode(res)

        return this.mapResponse(response)
      })
      .catch((apiResponseError) => {
        return this.mapResponseError(apiResponseError)
      })
  }
}
