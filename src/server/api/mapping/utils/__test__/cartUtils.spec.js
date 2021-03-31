import {
  extractCartId,
  createGetOrderId,
  extractNominatedDeliveryDate,
} from '../cartUtils'
import WcsCookieCaptureMock from '../../../__mocks__/cookie-capture.mock'

jest.mock('../sessionUtils', () => ({
  createGetSession: jest.fn(),
  getCookies: jest.fn(),
}))
import { createGetSession, getCookies } from '../sessionUtils'

const cookies = [
  'cookie1=foobar;',
  'cartId=123456;',
  'anotherCookie=batbaz;',
  'nominatedDeliveryDate=2017-09-26;',
]

describe('extractCartId', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return a rejected promise if the cookies array does not contain a cartId cookie', async () => {
    await expect(extractCartId(['cookie1=foobar'])).rejects.toBe(
      'No cartId found in session cookies'
    )
  })

  it('should correctly parse the cartId cookie from an array of cookie strings', async () => {
    await expect(extractCartId(cookies)).resolves.toBe('123456')
  })
})

describe('getOrderId', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Cookies retrieved from Redis', () => {
    const getOrderId = createGetOrderId()

    it('should return a rejected promise if the jsessionid cannot be determined', async () => {
      createGetSession.mockImplementation(() => () =>
        Promise.reject('No jsessionid')
      )
      await expect(getOrderId()).rejects.toBe('No jsessionid')
    })

    it('should return a rejected promise if the session cookies cannot be obtained', async () => {
      createGetSession.mockImplementation(() => () => Promise.resolve())
      getCookies.mockImplementation(() => Promise.reject('Cookies not found'))
      await expect(getOrderId()).rejects.toBe('Cookies not found')
    })

    it('should call extractCartId with a session if it obtains one successfully', async () => {
      createGetSession.mockImplementation(() => () => Promise.resolve())
      getCookies.mockImplementation(() => Promise.resolve(['cartId=67890;']))
      await expect(getOrderId({ cookie: 'jessionId=12345' })).resolves.toBe(
        '67890'
      )
    })
  })

  describe('Cookies used from client', () => {
    it("should use cookies from cookieCapture if cookies aren't returned from session", async () => {
      const cookieCapture = new WcsCookieCaptureMock({
        readForServer: jest.fn(() => ['cartId=90210;']),
      })
      const getOrderId = createGetOrderId(cookieCapture)
      createGetSession.mockImplementation(() => () => Promise.resolve())
      getCookies.mockImplementation(() => Promise.resolve(null))
      await expect(getOrderId({ cookie: 'jessionId=12345' })).resolves.toBe(
        '90210'
      )
    })
  })
})

describe('extractNominatedDeliveryDate', () => {
  it("returns false if doesn't exist", () => {
    expect(extractNominatedDeliveryDate([])).toBe(false)
  })

  it('throws if passed invalid cookies', () => {
    expect(() => extractNominatedDeliveryDate()).toThrow()
  })

  it('returns the date', () => {
    expect(extractNominatedDeliveryDate(cookies)).toBe('2017-09-26')
  })
})
