import initNewRelicBrowser from '../init-nr-browser'

describe('initNewRelicBrowser', () => {
  beforeAll(() => {
    global.process.browser = true
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.process.browser = false
  })

  function mockNewRelic() {
    window.newrelic = {
      setCustomAttribute: jest.fn(),
    }
  }

  it('does nothing if new relic will never be available', () => {
    window.NREUM = null
    mockNewRelic()

    initNewRelicBrowser(window)

    expect(window.newrelic.setCustomAttribute).not.toHaveBeenCalled()
  })

  it('waits until `window.newrelic` is available', () => {
    jest.useFakeTimers()
    window.NREUM = {}
    window.newrelic = null

    initNewRelicBrowser(window)

    jest.advanceTimersByTime(50)

    mockNewRelic()
    jest.advanceTimersByTime(10)
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalled()
  })

  it('adds all available parameters', () => {
    const oldCookie = window.document.cookie
    Object.defineProperty(window.document, 'cookie', {
      value: 'jsessionid=foobar',
      writable: true,
    })

    window.NREUM = {}

    mockNewRelic()
    const win = {
      location: {
        host: 'www.topshop.com',
      },
      screen: {
        orientation: 'landscape-primary',
        height: 500,
        width: 320,
        pixelDepth: 24,
        colorDepth: 24,
      },
      navigator: {
        connection: {
          type: 'wifi',
          effectiveType: '3g',
          rtt: 150,
        },
      },
    }

    initNewRelicBrowser(win)

    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'requestDomain',
      'www.topshop.com'
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'screenOrientation',
      'landscape-primary'
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'screenHeight',
      500
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'screenWidth',
      320
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'pixelDepth',
      24
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'colorDepth',
      24
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'connection.type',
      'wifi'
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'sessionKey',
      'foobar'
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'connection.effectiveType',
      '3g'
    )
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'connection.rtt',
      150
    )

    Object.defineProperty(window.document, 'cookie', {
      value: oldCookie,
      writable: true,
    })
  })

  it('does not add unavilable parameters', () => {
    initNewRelicBrowser({
      location: {
        host: 'www.topshop.com',
      },
    })

    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledTimes(1)
    expect(window.newrelic.setCustomAttribute).toHaveBeenCalledWith(
      'requestDomain',
      'www.topshop.com'
    )
  })
})
