import {
  isAbsoluteUrl,
  normaliseRelativeUrl,
  appendQueryParameter,
  isValidSeoUrl,
} from '../url-utils'

describe('URL utils', () => {
  describe('isAbsoluteUrl', () => {
    const absoluteUrls = [
      'http://www.topshop.com',
      'https://www.topshop.com',
      'http://m.topshop.com',
      '//m.topshop.de',
      'http://m.topshop.com/en/clothes',
      'http://m.topshop.com?hello=true',
    ]

    const relativeUrls = [
      '/en/clothes',
      null,
      undefined,
      'some-string',
      '/en/clothes?a=b&c=d',
      '/images/Banner_Small_DorothyPerkins.png',
    ]

    test.each(absoluteUrls)('returns true for %s', (url) => {
      expect(isAbsoluteUrl(url)).toBe(true)
    })

    test.each(relativeUrls)('returns false for %s', (url) => {
      expect(isAbsoluteUrl(url)).toBe(false)
    })
  })

  describe('normaliseRelativeUrl', () => {
    const testUrls = [
      'http://www.topshop.com',
      'https://www.topshop.com',
      'http://m.topshop.com',
      '//m.topshop.de',
      'http://m.topshop.com/en/clothes',
      'http://m.topshop.com?hello=true',
      '/en/category/clothing',
      null,
      undefined,
    ]

    it('returns an amended url if the parameter is not well formed', () => {
      const url = 'en/category/clothes'
      expect(normaliseRelativeUrl(url)).toBe(`/${url}`)
    })

    test.each(testUrls)('returns %p as no change is needed', (url) => {
      expect(normaliseRelativeUrl(url)).toBe(url)
    })
  })

  describe('appendQueryParameter', () => {
    it('should append nothing to a missing string', () => {
      expect(appendQueryParameter()).toEqual('')
      expect(appendQueryParameter(undefined, { testing: true })).toEqual('')
    })

    it('should append nothing to an empty string', () => {
      expect(appendQueryParameter('')).toEqual('')
      expect(appendQueryParameter('', { testing: true })).toEqual('')
    })

    it('should append to a url with no existing parameters correctly', () =>
      expect(
        appendQueryParameter('http://www.topshop.com', { testing: true })
      ).toBe('http://www.topshop.com?testing=true'))

    it('should append to a url with existing parameters correctly', () =>
      expect(
        appendQueryParameter('http://www.topshop.com?testing=true', {
          foo: 'bar',
        })
      ).toBe('http://www.topshop.com?testing=true&foo=bar'))

    it('should handle multiple new parameters', () => {
      const params = {
        first: {
          testing: true,
          foo: 'bar',
        },
        second: {
          ping: 'pong',
          bang: 'bosh',
        },
      }

      const first = appendQueryParameter('http://www.topshop.com', params.first)
      const second = appendQueryParameter(first, params.second)
      expect(first).toBe('http://www.topshop.com?testing=true&foo=bar')
      expect(second).toBe(
        'http://www.topshop.com?testing=true&foo=bar&ping=pong&bang=bosh'
      )
    })

    it('should append correctly if only passed a partial url', () =>
      expect(
        appendQueryParameter('/en/category/foo?testing=true', { foo: 'bar' })
      ).toBe('/en/category/foo?testing=true&foo=bar'))
  })

  describe('isValidSeoUrl', () => {
    const validPathNames = [
      '/en/tsuk/category/jeans-6877054/',
      '/en/tsuk/category/jeans-6877054',
      'en/tsuk/category/jeans-6877054',
      'en/tsuk/category/jeans-6877054/',
      '/en/tsuk/category/',
      'en/tsuk/category/',
      'en/tsuk/category',
    ]
    const invalidPathNames = [
      '/12/tsuk/category/jeans-6877054',
      '/en/1234/category/jeans-6877054',
      '/en/tsuk/bategory/jeans-6877054',
      '/en/tsuk/category/jeans[]',
    ]
    test.each(validPathNames)('%p is a valid SEO URL pathname', (pathname) => {
      expect(isValidSeoUrl(pathname)).toBe(true)
    })
    test.each(invalidPathNames)(
      '%p is an invalid SEO URL pathname',
      (pathname) => {
        expect(isValidSeoUrl(pathname)).toBe(false)
      }
    )
  })
})
