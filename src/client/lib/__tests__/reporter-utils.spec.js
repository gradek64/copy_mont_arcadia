import { postToServer } from '../reporter-utils'

describe('reporter-utils', () => {
  const xml = global.XMLHttpRequest
  const mockOpen = jest.fn()
  const mockRequest = jest.fn()
  const mockSend = jest.fn()
  const beforeProcess = global.process.browser

  beforeEach(() => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(100)
    global.XMLHttpRequest = xml
  })

  afterEach(() => {
    Date.prototype.getTime.mockRestore()
  })

  it('postToServer', () => {
    global.XMLHttpRequest = jest.fn(() => ({
      open: mockOpen,
      setRequestHeader: mockRequest,
      send: mockSend,
    }))

    document.cookie = 'akaas_Checkout_AB=asdasdasd=v2'
    global.document.cookie = 'traceId2=1111'
    global.document.cookie = 'akaas_DRET=kajhsgdfj=NEW'
    global.process.browser = true

    postToServer('url', 'title', { body: 'body' })

    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledWith('POST', '/api/url', true)
    expect(mockRequest).toHaveBeenCalledTimes(2)
    expect(mockRequest.mock.calls[0]).toEqual([
      'Content-type',
      'application/json',
    ])
    expect(mockRequest.mock.calls[1]).toEqual(['X-TRACE-ID', '1111'])
    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(JSON.parse(mockSend.mock.calls[0])).toEqual({
      body: 'body',
      dretValue: 'NEW',
      namespace: 'title',
      timestamp: 100,
      traceId: '1111',
      url: window.location.href,
      userAgent: window.navigator.userAgent,
    })
    global.process.browser = beforeProcess
  })
})
