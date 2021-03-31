const mockResponse = {}

export function __setMockResponse__(url, method, response) {
  const methodType = method.toLowerCase()
  if (!mockResponse[methodType]) {
    mockResponse[methodType] = {}
  }
  mockResponse[methodType][url] = response
}
/*
 * api-service will be mocked if you use jest.mock('path/to/../api-service')
 *
 * When a manual mock exists for a given module, Jest's module system will use
 * that module when explicitly calling jest.mock('moduleName')
 * See more at: https://facebook.github.io/jest/docs/manual-mocks.html
 */

export const get = jest.fn((url) => {
  /*
   * Usage: To use you need to first set the mock response using
   * __setMockResponse__(url, 'GET', response)
   * then calling get(url) will return response
   */
  return new Promise((resolve, reject) => {
    return process.nextTick(() => {
      return mockResponse.get && mockResponse.get[url]
        ? resolve(mockResponse.get[url])
        : reject('unmocked url')
    })
  })
})
