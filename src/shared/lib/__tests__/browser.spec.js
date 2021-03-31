import { isIE11, isFF } from '../browser'

const setUserAgent = (userAgentName) =>
  Object.defineProperty(global.navigator, 'userAgent', {
    get: () => userAgentName,
    configurable: true,
  })

describe('browser utilities', () => {
  const { browser: isBrowser } = process

  afterAll(() => {
    process.browser = isBrowser
  })

  describe('is Interner Explorer 11', () => {
    it('should return true for user agents containting Trident', () => {
      setUserAgent('Trident')
      process.browser = true
      expect(isIE11()).toBe(true)
    })
    it('should return false for user agents not containting Trident', () => {
      setUserAgent('Firefox')
      process.browser = true
      expect(isIE11()).toBe(false)
    })
    it('should return false on the server', () => {
      setUserAgent('Trident')
      process.browser = false
      expect(isIE11()).toBe(false)
    })
  })
  describe('is Firefox', () => {
    it('should return true for user agents containting Firefox', () => {
      setUserAgent('Firefox')
      process.browser = true
      expect(isFF()).toBe(true)
    })
    it('should return false for user agents not containting Firefox', () => {
      setUserAgent('Trident')
      process.browser = true
      expect(isFF()).toBe(false)
    })
    it('should return false on the server', () => {
      setUserAgent('Firefox')
      process.browser = false
      expect(isFF()).toBe(false)
    })
  })
})
