jest.mock('../../api')
jest.mock('@ag-digital/pantry')

import mockCreateFetch, * as api from '../../api'
import pantry from '@ag-digital/pantry'
import { createGetSession } from '../utils/sessionUtils'
import WcsCookieCaptureMock from '../../__mocks__/cookie-capture.mock'

/**
 * Sets the response expected to recieve back from WCS
 *
 * @param resp {Mixed} The response from WCS
 * @param options {Object} Options for the response, such as the call it should be the response for (n)
 */
export function setWCSResponse(resp, { n = 0 } = { n: 0 }) {
  if (!(resp instanceof Promise) && !resp.body) resp = { body: resp }

  api.__setMockResponseNth(resp, n)
}

/**
 * Sets the user session stored in redis, accessed by pantry
 *
 * @param [session] {Object} The session object returned by pantry
 */
export function setUserSession(session = {}) {
  pantry.mockReset()
  pantry.mockReturnValueOnce({
    retrieveSession: () => Promise.resolve(session),
  })
}

/**
 * Executes a mapper with some input
 *
 * @param Klass {Function} Mapper constructor function
 * @param input {Object} Object of input arguments to construct mapper
 * @return {Function} executor function
 */
export function buildExecutor(Klass, input = {}) {
  const cookieCapture = new WcsCookieCaptureMock({
    hasWcsCookies: jest.fn(() => false),
  })
  return (overrideInput = {}) => {
    return new Klass(
      overrideInput.endpoint || input.endpoint,
      overrideInput.query || input.query,
      overrideInput.payload || input.payload,
      overrideInput.method || input.method,
      overrideInput.headers || input.headers,
      overrideInput.params || input.params,
      overrideInput.cookies || input.cookies,
      overrideInput.sendRequestToApi ||
        input.sendRequestToApi ||
        mockCreateFetch(),
      overrideInput.getOrderId || input.getOrderId || jest.fn(),
      overrideInput.getCookieFromStore || input.getCookieFromStore || jest.fn(),
      overrideInput.getSession ||
        input.getSession ||
        createGetSession(cookieCapture),
      cookieCapture
    ).execute()
  }
}

/**
 * Checks that the request to WCS was made correctly
 *
 * @param requestData {Object} Object of args to sendRequestToApi
 * @param [callNum] {Number} Defaults to 0, the first call
 * @return {undefined}
 */
export function expectRequestMadeWith(requestData, callNum = 0) {
  const args = []
  args.push(requestData.hostname)
  args.push(requestData.endpoint)
  args.push(requestData.query)
  args.push(requestData.payload)
  args.push(requestData.method)
  args.push(requestData.headers)
  if ('sessionKey' in requestData) args.push(requestData.sessionKey)
  if ('noPath' in requestData) args.push(requestData.noPath)

  expect(api.sendRequestToApi.mock.calls[callNum]).toEqual(
    expect.arrayContaining(args)
  )
}

export function expectRequestMadeWithPartial(requestData, callNum = 0) {
  if (requestData.hostname)
    expect(api.sendRequestToApi.mock.calls[callNum][0]).toEqual(
      requestData.hostname
    )
  if (requestData.endpoint)
    expect(api.sendRequestToApi.mock.calls[callNum][1]).toEqual(
      requestData.endpoint
    )
  if (requestData.query)
    expect(api.sendRequestToApi.mock.calls[callNum][2]).toEqual(
      requestData.query
    )
  if (requestData.payload)
    expect(api.sendRequestToApi.mock.calls[callNum][3]).toEqual(
      requestData.payload
    )
  if (requestData.method)
    expect(api.sendRequestToApi.mock.calls[callNum][4]).toEqual(
      requestData.method
    )
  if (requestData.headers)
    expect(api.sendRequestToApi.mock.calls[callNum][5]).toEqual(
      requestData.headers
    )
  if (requestData.sessionKey)
    expect(api.sendRequestToApi.mock.calls[callNum][6]).toEqual(
      requestData.sessionKey
    )
  if (requestData.noPath)
    expect(api.sendRequestToApi.mock.calls[callNum][7]).toEqual(
      requestData.noPath
    )
}

/**
 * Returns an array containing all the request calls
 *
 * @return {Array}
 */
export function getRequests() {
  return api.sendRequestToApi.mock.calls
}

/**
 * Returns an object describing the arguments in the request
 *
 * @param [callNum] {Number} Defaults to first call
 * @return {Object}
 */
export function getRequestArgs(callNum = 0) {
  const args = api.sendRequestToApi.mock.calls[callNum]

  return {
    hostname: args[0],
    endpoint: args[1],
    query: args[2],
    payload: args[3],
    method: args[4],
    headers: args[5],
    jsessionid: args[6],
    nopath: args[7],
  }
}

export { getConfigByStoreCode } from '../../../config'

export function createJSessionIdCookie(id) {
  return `jsessionid=${id}; `
}

export function createCartIdCookie(orderId) {
  return `cartId=${orderId}; `
}

/**
 * @param type {String} enum('string', 'array')
 * @return {Function} Takes 0..* cookies and returns cookies as `type`
 */
export function createCookies(type = 'string') {
  return (...cookies) => {
    return type === 'string' ? cookies.join('') : cookies
  }
}

/**
 * @example
 *
 * it('foo', () => {
 *   return expectFailedWith(execute(), { statusCode: 404 })
 * })
 */
export function expectFailedWith(
  promise,
  { statusCode, message, wcsErrorCode } = {}
) {
  return promise.then(
    () => {
      throw new Error("Promise didn't reject as expected")
    },
    (err) => {
      if (statusCode) expect(err.output.payload.statusCode).toBe(statusCode)
      if (message) expect(err.output.payload.message).toBe(message)
      if (wcsErrorCode) expect(err.data.wcsErrorCode).toBe(wcsErrorCode)
    }
  )
}

/**
 * @example
 *
 * it('foo', () => {
 *   return expectFailedSynchronouslyWith(execute, { statusCode: 404 })
 * })
 */
export function expectFailedSynchronouslyWith(
  f,
  { statusCode, message, wcsErrorCode } = {}
) {
  try {
    f()
    throw new Error('Function did not throw as expected')
  } catch (err) {
    if (statusCode) expect(err.output.payload.statusCode).toBe(statusCode)
    if (message) expect(err.output.payload.message).toBe(message)
    if (wcsErrorCode) expect(err.data.wcsErrorCode).toBe(wcsErrorCode)
  }
}
