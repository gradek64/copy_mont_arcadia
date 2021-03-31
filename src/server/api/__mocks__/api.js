let mockedResponse = Promise.resolve({ bodyProp: 'bodyProp' })

export function __setMockResponse(responseBodyOrError, rejects) {
  mockedResponse = rejects
    ? Promise.reject(responseBodyOrError)
    : Promise.resolve(responseBodyOrError)
}

let calls = []
let currentCount = 0
export function __setMockResponseNth(resp, n) {
  calls[n] = Promise.resolve(resp)
}

beforeEach(() => {
  calls = []
  currentCount = 0
})

export const sendRequestToApi = jest.fn(() => {
  if (calls.length) return calls[currentCount++]
  return mockedResponse
})

export default jest.fn(() => sendRequestToApi)
