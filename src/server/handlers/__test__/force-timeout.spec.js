import deepFreeze from 'deep-freeze'
import forceTimeout, { simulateTimeout, isTimeoutArmed } from '../force-timeout'

const TEST_JSESSION_ID = 'abc123'

const normalRequest = (jsessionid = TEST_JSESSION_ID) =>
  deepFreeze({
    query: {
      jsessionid,
    },
    state: {},
  })

const badRequest = deepFreeze({
  query: {},
  state: {},
})

const requestUsingCookies = deepFreeze({
  query: {},
  state: {
    jsessionid: 'def456',
  },
})

describe('simulateTimeout', () => {
  it('resets the timeout trigger to false', () => {
    forceTimeout(normalRequest(), () => {})
    return simulateTimeout(TEST_JSESSION_ID).then(() => {
      expect(isTimeoutArmed()).toBe(false)
    })
  })

  it('returns a resolved promise', () => {
    const result = simulateTimeout()

    expect(result instanceof Promise).toBe(true)

    return (
      result
        .then(() => expect(true).toBe(true))
        // eslint-disable-next-line
        .catch(() => fail('Promise was expected to be resolved'))
    )
  })

  it('the promise has the correct data to signify a timeout', async () => {
    try {
      const response = await simulateTimeout(TEST_JSESSION_ID)
      expect(response).toEqual({
        body: {
          timeout: true,
        },
        status: 200,
      })
    } catch (error) {
      // eslint-disable-next-line
      fail('Promise was expected to resolve')
    }
  })
})

describe('forceTimeout', () => {
  it('returns feedback to acknowledge successful request', () => {
    const mockReply = jest.fn()
    forceTimeout(normalRequest(), mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body instanceof Error).toBe(false)

    expect(body.success).toBe(true)
    expect(body).toMatchSnapshot()
  })

  it('returns feedback to notify of a bad request', () => {
    const mockReply = jest.fn()
    forceTimeout(badRequest, mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body.output.statusCode).toBe(400)
    expect(body.output.payload).toMatchSnapshot()
  })

  it('sets global flag to force timeout', () => {
    const mockReply = jest.fn()
    forceTimeout(normalRequest(), mockReply)

    expect(isTimeoutArmed(TEST_JSESSION_ID)).toBe(true)
  })

  it('scopes to jsessionid', () => {
    const mockReply = jest.fn()
    forceTimeout(normalRequest(), mockReply)

    expect(isTimeoutArmed('someOtherId')).toBe(false)
  })

  it('allows setting of jsessionid via cookie header', () => {
    const mockReply = jest.fn()
    forceTimeout(requestUsingCookies, mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body instanceof Error).toBe(false)
    expect(body.success).toBe(true)
  })

  it('removes an armed jsessionid after 1 minute if not used', () => {
    jest.useFakeTimers()
    const jsessionid = '123'

    expect(isTimeoutArmed(jsessionid)).toBe(false)

    const mockReply = jest.fn()
    forceTimeout(normalRequest(jsessionid), mockReply)

    expect(isTimeoutArmed(jsessionid)).toBe(true)

    jest.advanceTimersByTime(60000)

    expect(isTimeoutArmed(jsessionid)).toBe(false)
  })
})
