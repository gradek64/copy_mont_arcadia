export const createReplyMocks = () => {
  // mocks required for successful response:
  const mockCode = jest.fn()
  const deviceTypeCookieSetterMock = jest.fn().mockReturnValue({
    code: mockCode,
  })
  const jsessionidCookieSetterMock = jest.fn().mockReturnValue({
    state: deviceTypeCookieSetterMock,
  })
  const mockView = jest.fn().mockReturnValue({
    state: jsessionidCookieSetterMock,
  })

  // mocks required for redirect:
  const mockRewritable = jest.fn()
  const mockPermanent = jest.fn()
  const mockRedirect = jest.fn().mockReturnValue({
    rewritable: mockRewritable,
    permanent: mockPermanent,
  })

  // mocks required for all cases:
  const mockState = jest.fn()

  // put it all together:
  const mockReply = jest.fn()
  mockReply.view = mockView
  mockReply.redirect = mockRedirect
  mockReply.state = mockState

  return {
    mockReply,
    mockView,
    mockCode,
    mockRedirect,
    mockRewritable,
    mockPermanent,
  }
}
