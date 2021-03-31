export default function WcsCookieCaptureMock(spys) {
  const defaults = {
    hasWcsCookies: jest.fn(),
    capture: jest.fn(),
    readForServer: jest.fn(),
    removeCookieByName: jest.fn(),
  }
  return {
    ...defaults,
    ...spys,
  }
}
