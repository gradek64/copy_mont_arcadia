const mockedResponses = {}

export function __setMockResponse__(url, response) {
  const newMockResponse = Object.assign(
    {
      status: 200,
      responseText: '',
    },
    response
  )
  mockedResponses[url] = newMockResponse
}

/*
 * TL;DR: superagent will use this mock instead of the superagent npm library
 * so we need to have a fake `Request.prototype.cache` for it.
 *
 * When a manual mock exists for a given module, Jest's module system will use
 * that module when explicitly calling jest.mock('moduleName')
 * See more at: https://facebook.github.io/jest/docs/manual-mocks.html
 */
export const Request = {
  prototype: {
    cache: jest.fn(),
  },
}

const superagentMock = {
  then(resolve, reject) {
    const response = mockedResponses[this.url]
    if (!response) {
      throw new Error(`There is no mocked response for the url "${this.url}".`)
    }
    if (response.status >= 200 && response.status < 300) {
      resolve(response)
    } else {
      reject(Object.assign(new Error(), { status: response.status, response }))
    }
  },
  set() {
    return this
  },
  send() {
    return this
  },
  redirects() {
    return this
  },
  get(url) {
    /*
     * Usage: You can mock `superagent.get(url)` with
     *  `superagent.__setMockResponse__(url, response)`
     *
     * Note: if you forgot to mock the url or mocked the wrong url, you'll get
     * an error message about the mocked urls to help to debug. For eg.:
     *  unmocked url: https://mockUrl?brand=3
     *  mocked urls:
     *   - https://mockUrl?brand=4
     *   - https://mockUrl?brand=5&country=UK
     *   - https://mockUrl?brand=1
     */
    return new Promise((resolve, reject) =>
      process.nextTick(
        () =>
          mockedResponses[url]
            ? resolve(mockedResponses[url])
            : reject(
                `unmocked url: ${url}\nmocked urls: \n  - ${Object.keys(
                  mockedResponses
                ).reduce((acc, val) => `${acc}\n  - ${val}`)}`
              )
      )
    )
  },
  post(url) {
    this.setUrl(url)
    return this
  },
  setUrl(url) {
    const newUrl = url.split('?')[0]
    this.url = newUrl
  },
}

export default superagentMock
