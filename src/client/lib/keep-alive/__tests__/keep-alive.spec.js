import initKeepAlivePolling, { stopKeepAlivePolling } from '../index'

jest.mock('../../../../shared/lib/api-service')
import { get, __setMockResponse__ } from '../../../../shared/lib/api-service'

jest.mock('../user-idle')
import { userIsIdle, onUserActiveFromIdle } from '../user-idle'

let store
const time = 1000 * 60 * 5

const expectKeepAlivePolled = (times = null) => {
  if (times !== 0) expect(get).toHaveBeenCalledWith('/keep-alive')
  if (times !== null) expect(get).toHaveBeenCalledTimes(times)
}

let calls = 0
const advanceTime = () => {
  Date.now.mockReturnValue(time * ++calls)
  jest.advanceTimersByTime(time)
}
const reset = () => {
  calls = 0
  stopKeepAlivePolling()
  Date.now.mockRestore()
}
let userActivityCallback
const startContinualUserActivity = () => {
  userActivityCallback()
  userIsIdle.mockReturnValue(false)
}

const expectOtherBrowserTabsNotified = (t) =>
  expect(window.localStorage.getItem('monty-keep-alive')).toBe(`${t}`)

jest.useFakeTimers()
describe('keep-alive', () => {
  beforeEach(() => {
    store = {
      dispatch: jest.fn((result) => result),
      getState: () => ({
        auth: {
          authentication: 'full',
        },
      }),
    }
    __setMockResponse__('/keep-alive', 'get', Promise.resolve({}))
    jest.spyOn(Date, 'now').mockReturnValue(0)
    window.localStorage.removeItem('monty-keep-alive')
    jest.clearAllMocks()
    onUserActiveFromIdle.mockImplementation((fn) => {
      userActivityCallback = fn
    })
    initKeepAlivePolling(store, time)
  })

  afterEach(() => {
    reset()
  })

  it('if not authenticated does not poll', () => {
    jest.clearAllMocks()
    stopKeepAlivePolling()
    store.getState = () => ({ auth: { authentication: false } })

    initKeepAlivePolling(store, time)
    expectKeepAlivePolled(0)

    advanceTime()
    expectKeepAlivePolled(0)

    advanceTime()
    expectKeepAlivePolled(0)
  })

  it('if partially authenticated does not poll', () => {
    jest.clearAllMocks()
    stopKeepAlivePolling()
    store.getState = () => ({ auth: { authentication: 'partial' } })

    initKeepAlivePolling(store, time)
    expectKeepAlivePolled(0)

    advanceTime()
    expectKeepAlivePolled(0)

    advanceTime()
    expectKeepAlivePolled(0)
  })

  describe('if authenticated', () => {
    it('first time use polls immediately', () => {
      expectKeepAlivePolled(1)

      advanceTime()
      expectKeepAlivePolled(2)
      expectOtherBrowserTabsNotified(time)
    })

    it('polls at regular intervals', () => {
      expectKeepAlivePolled(1)

      advanceTime()
      expectKeepAlivePolled(2)

      advanceTime()
      expectKeepAlivePolled(3)
    })

    it('if user becomes idle: do last poll, then stop polling', () => {
      expectKeepAlivePolled(1)

      userIsIdle.mockReturnValue(true)
      advanceTime()
      expectKeepAlivePolled(2)

      advanceTime()
      expectKeepAlivePolled(2)
    })

    it('if user becomes active after being idle, polling starts again', () => {
      expectKeepAlivePolled(1)
      userIsIdle.mockReturnValue(true)

      advanceTime()
      expectKeepAlivePolled(2)

      advanceTime()
      expectKeepAlivePolled(2)

      startContinualUserActivity()
      expectKeepAlivePolled(3)

      advanceTime()
      expectKeepAlivePolled(4)

      advanceTime()
      expectKeepAlivePolled(5)
    })

    it("if another browser tab polls, don't poll until after timeout", () => {
      jest.clearAllMocks()
      stopKeepAlivePolling()
      window.localStorage.setItem('monty-keep-alive', Date.now())
      initKeepAlivePolling(store, time)

      expectKeepAlivePolled(0)

      advanceTime()
      expectKeepAlivePolled(1)

      window.localStorage.setItem('monty-keep-alive', time * 2)
      advanceTime()
      expectKeepAlivePolled(1)

      advanceTime()
      expectKeepAlivePolled(2)
      expectOtherBrowserTabsNotified(time * 3)
    })
  })

  describe('Error handling', () => {
    it('catches errors', async () => {
      const fakePromise = {
        catch: jest.fn(),
      }
      get.mockReturnValue(fakePromise)

      advanceTime()

      expect(fakePromise.catch).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
