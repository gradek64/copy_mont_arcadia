import deepFreeze from 'deep-freeze'
import forceRememberMeTimeout, {
  simulateRememberMeTimeout,
  isRememberMeTimeoutArmed,
} from '../force-remember-me-timeout'

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

describe('simulateRememberMeTimeout', () => {
  it('resets the timeout trigger to false', () => {
    forceRememberMeTimeout(normalRequest(), () => {})
    return simulateRememberMeTimeout(TEST_JSESSION_ID).then(() => {
      expect(isRememberMeTimeoutArmed()).toBe(false)
    })
  })

  it('returns a resolved promise', () => {
    const result = simulateRememberMeTimeout(TEST_JSESSION_ID)

    expect(result instanceof Promise).toBe(true)

    return result
      .then(() => expect(true).toBe(true))
      .catch(() => global.fail('Promise was expected to be resolved'))
  })

  it('the promise has the correct data to signify a remember me timeout', async () => {
    let response

    try {
      response = await simulateRememberMeTimeout(TEST_JSESSION_ID)
    } catch (error) {
      global.fail('Promise was expected to resolve')
    }

    const expected = expect.objectContaining({
      success: false,
      isLoggedIn: true,
      rememberMeLogonForm: expect.objectContaining({
        loginForm: expect.objectContaining({
          logonId: expect.any(String),
          rememberMe: true,
        }),
      }),
      personal_details: expect.objectContaining({
        registerType: expect.any(String),
        profileType: expect.any(String),
      }),
      MiniBagForm: expect.objectContaining({
        products: expect.objectContaining({
          Product: expect.any(Array),
        }),
      }),
    })

    expect(response).toBeTruthy()
    expect(response.body).toBeTruthy()
    expect(response.body).toMatchObject(expected)
  })
})

describe('forceTimeout', () => {
  it('returns feedback to acknowledge successful request', () => {
    const mockReply = jest.fn()
    forceRememberMeTimeout(normalRequest(), mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body instanceof Error).toBe(false)

    expect(body.success).toBe(true)
    expect(body).toMatchSnapshot()
  })

  it('returns feedback to notify of a bad request', () => {
    const mockReply = jest.fn()
    forceRememberMeTimeout(badRequest, mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body.output.statusCode).toBe(400)
    expect(body.output.payload).toMatchSnapshot()
  })

  it('sets flag to force timeout', () => {
    const mockReply = jest.fn()
    forceRememberMeTimeout(normalRequest(), mockReply)

    expect(isRememberMeTimeoutArmed(TEST_JSESSION_ID)).toBe(true)
  })

  it('scopes to jsessionid', () => {
    const mockReply = jest.fn()
    forceRememberMeTimeout(normalRequest(), mockReply)

    expect(isRememberMeTimeoutArmed('someOtherId')).toBe(false)
  })

  it('allows setting of jsessionid via cookie header', () => {
    const mockReply = jest.fn()
    forceRememberMeTimeout(requestUsingCookies, mockReply)

    const body = mockReply.mock.calls[0][0]

    expect(body instanceof Error).toBe(false)
    expect(body.success).toBe(true)
  })

  it('removes an armed jsessionid after 1 minute if not used', () => {
    jest.useFakeTimers()
    const jsessionid = '123'

    expect(isRememberMeTimeoutArmed(jsessionid)).toBe(false)

    const mockReply = jest.fn()
    forceRememberMeTimeout(normalRequest(jsessionid), mockReply)

    expect(isRememberMeTimeoutArmed(jsessionid)).toBe(true)

    jest.advanceTimersByTime(60000)

    expect(isRememberMeTimeoutArmed(jsessionid)).toBe(false)
  })
})
