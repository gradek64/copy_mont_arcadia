import { initialise, userIsIdle, onUserActiveFromIdle } from '../user-idle'

describe('user-idle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('starts as not idle', () => {
    expect(userIsIdle()).toBe(false)
    initialise()
    expect(userIsIdle()).toBe(false)
  })

  it('after idle timeout, user is idle', () => {
    initialise()
    expect(userIsIdle()).toBe(false)

    jest.advanceTimersByTime(29999)
    expect(userIsIdle()).toBe(false)

    jest.advanceTimersByTime(1)
    expect(userIsIdle()).toBe(true)
  })

  it('if user clicks idle timeout is reset', () => {
    initialise()
    jest.advanceTimersByTime(15000)
    document.dispatchEvent(new Event('click'))

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(false)

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(true)
  })

  it('if user touches idle timeout is reset', () => {
    initialise()
    jest.advanceTimersByTime(15000)
    document.dispatchEvent(new Event('touchstart'))

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(false)

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(true)
  })

  it('if user scrolls idle timeout is reset', () => {
    initialise()
    jest.advanceTimersByTime(15000)
    document.dispatchEvent(new Event('scroll'))

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(false)

    jest.advanceTimersByTime(15000)
    expect(userIsIdle()).toBe(true)
  })

  it('calls registered fn when user becomes active after being idle', () => {
    initialise()
    const fn = jest.fn()
    onUserActiveFromIdle(fn)

    jest.advanceTimersByTime(30000)
    expect(fn).toHaveBeenCalledTimes(0)

    document.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1000)
    document.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
