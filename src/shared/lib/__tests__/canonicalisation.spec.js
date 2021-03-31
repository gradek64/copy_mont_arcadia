import {
  getCanonicalHostname,
  prefixWithHttpsProtocol,
} from '../canonicalisation'

describe('canonicalisation', () => {
  describe('#getCanonicalHostname', () => {
    it('returns empty string for empty arguments', () => {
      expect(getCanonicalHostname('')).toEqual('')
    })

    it('returns the parameter value for unrecognized URLs', () => {
      expect(getCanonicalHostname('www.google.it')).toEqual('www.google.it')
    })

    it('returns "http://www.topshop.com" for argument "m.topshop.com"', () => {
      expect(getCanonicalHostname('m.topshop.com')).toEqual(
        'http://www.topshop.com'
      )
    })

    it('returns "http://www.topshop.com" for argument "local.m.topshop.com"', () => {
      expect(getCanonicalHostname('m.topshop.com')).toEqual(
        'http://www.topshop.com'
      )
    })

    it('returns "http://fr.topshop.com" for argument "m.fr.topshop.com"', () => {
      expect(getCanonicalHostname('m.fr.topshop.com')).toEqual(
        'http://fr.topshop.com'
      )
    })

    it('returns "http://www.dorothyperkins.com" for argument "m.dorothyperkins.com"', () => {
      expect(getCanonicalHostname('m.dorothyperkins.com')).toEqual(
        'http://www.dorothyperkins.com'
      )
    })

    it('prefixes hostname with "https" protocol if "url" does not have a match in the map and "httpsCanonicalEnabled" is true', () => {
      expect(getCanonicalHostname('www.topshop.com', true)).toEqual(
        'https://www.topshop.com'
      )
    })
  })
})

describe('#prefixWithHttpsProtocol', () => {
  describe('no arguments provided', () => {
    it('returns undefined', () => {
      expect(prefixWithHttpsProtocol()).toBe(undefined)
    })
  })
  describe('"url" falsy', () => {
    it('returns empty string', () => {
      expect(prefixWithHttpsProtocol(false, true)).toBe(false)
      expect(prefixWithHttpsProtocol(undefined, true)).toBe(undefined)
      expect(prefixWithHttpsProtocol(null, true)).toBe(null)
      expect(prefixWithHttpsProtocol(0, true)).toBe(0)
      expect(prefixWithHttpsProtocol('', true)).toBe('')
    })
  })
  describe('"httpsCanonicalEnabled" falsy', () => {
    it('http://whatever => http://whatever', () => {
      expect(prefixWithHttpsProtocol('http://whatever', false)).toBe(
        'http://whatever'
      )
      expect(prefixWithHttpsProtocol('http://whatever')).toBe('http://whatever')
      expect(prefixWithHttpsProtocol('http://whatever', null)).toBe(
        'http://whatever'
      )
      expect(prefixWithHttpsProtocol('http://whatever', 0)).toBe(
        'http://whatever'
      )
      expect(prefixWithHttpsProtocol('http://whatever', '')).toBe(
        'http://whatever'
      )
    })
  })
  describe('"httpsCanonicalEnabled" true', () => {
    it('http://whatever => https://whatever', () => {
      expect(prefixWithHttpsProtocol('http://whatever', true)).toBe(
        'https://whatever'
      )
    })
    it('https://whatever => https://whatever', () => {
      expect(prefixWithHttpsProtocol('https://whatever', true)).toBe(
        'https://whatever'
      )
    })
    it('whatever => https://whatever', () => {
      expect(prefixWithHttpsProtocol('whatever', true)).toBe('https://whatever')
    })
    it('//whatever => https://whatever', () => {
      expect(prefixWithHttpsProtocol('//whatever', true)).toBe(
        'https://whatever'
      )
    })
  })
})
