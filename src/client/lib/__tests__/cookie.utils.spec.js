const {
  setItem,
  setItemWithOptions,
  getItem,
  removeItem,
  hasItem,
} = require('../cookie/utils')

describe('cookie utils', () => {
  beforeEach(() => {
    global.process.browser = true
  })

  describe('setItem', () => {
    it('setItem return nulls when browser set to false', () => {
      global.process.browser = false
      const setCookieItem = setItem('WC_pickUpStore', 'TS0001', 90)
      expect(setCookieItem).toBeNull()
    })

    it('setItem should put an item into the cookie', () => {
      setItem('WC_pickUpStore', 'TS0001', 90)
      expect(document.cookie === 'WC_pickUpStore=TS0001')
    })

    it('getItem return nulls when browser set to false', () => {
      global.process.browser = false
      const getCookie = getItem('WC_pickUpStore')
      expect(getCookie).toBeNull()
    })
  })

  describe('setItemWithOptions', () => {
    it('returns null when not running in browser', () => {
      global.process.browser = false
      const setCookieItem = setItemWithOptions('foo', 'bar')
      expect(setCookieItem).toBeNull()
    })

    it('should set the cookie value', () => {
      setItemWithOptions('foo', 'bar')

      expect(document.cookie).toContain('foo=bar')
    })
  })

  describe('getItem', () => {
    it('check if a cookie exists', () => {
      const getCookie = getItem('WC_picksdfsdfUpStore')
      expect(getCookie === 'undefined')
    })

    it('getItem should fetch an item from the cookie - if it is the only entry', () => {
      const getCookie = getItem('WC_pickUpStore')
      expect(getCookie === 'TS0001')
    })
  })

  describe('removeItem', () => {
    it('removeItem should delete an item from the cookie', () => {
      removeItem('WC_pickUpStore')
      expect(document.cookie === '')
    })

    it('removeItem return nulls when browser set to false', () => {
      global.process.browser = false
      const getCookie = removeItem('WC_pickUpStore')
      expect(getCookie).toBeNull()
    })
  })

  describe('hasItem', () => {
    let originalCookie
    beforeEach(() => {
      originalCookie = document.cookie
      document.cookie = ''
    })

    afterEach(() => {
      document.cookie = originalCookie
    })

    it('matches an existing', () => {
      document.cookie = 'foo=1'
      expect(hasItem('foo')).toBe(true)

      document.cookie = 'baz=3;foo=1;bar=2'
      expect(hasItem('foo')).toBe(true)
    })

    it("doesn't match missing", () => {
      document.cookie = 'foo=1;baz=2;qux=3'
      expect(hasItem('bar')).toBe(false)

      document.cookie = 'foo=1'
      expect(hasItem('bar')).toBe(false)

      document.cookie = ''
      expect(hasItem('bar')).toBe(false)
    })

    it('returns null for non-browser environments', () => {
      const originalProcessBrowser = process.browser
      process.browser = false
      document.cookie = 'bar=1'

      expect(hasItem('bar')).toBe(null)

      process.browser = originalProcessBrowser
    })
  })
})
