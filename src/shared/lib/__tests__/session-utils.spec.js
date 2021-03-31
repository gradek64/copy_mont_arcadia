import { getRedirectUrl, routeMatchesLocation } from '../session-utils'

describe('session-utils', () => {
  describe('getRedirectUrl()', () => {
    it('should return "/login" if state is empty', () => {
      const state = {}
      const expected = '/login'
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return "/login" as default option', () => {
      const state = {
        routing: {
          location: {
            pathname: '/my-account',
            search: '',
          },
        },
      }
      const expected = '/login'
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return empty string if user is viewing the homepage', () => {
      const state = {
        routing: {
          location: {
            pathname: '/',
            search: '',
          },
        },
      }
      const expected = ''
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return empty string if user is viewing a category list', () => {
      const state = {
        routing: {
          location: {
            pathname: '/en/tsuk/category/clothing-427/dresses-442',
            search: '',
          },
        },
      }
      const expected = ''
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return empty string if user is viewing a product', () => {
      const state = {
        routing: {
          location: {
            pathname:
              '/en/tsuk/product/clothing-427/dresses-442/stripe-belted-midi-dress-8288361',
            search: '',
          },
        },
      }
      const expected = ''
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return empty string if user is viewing a searched list', () => {
      const state = {
        routing: {
          location: {
            pathname: '/search/',
            search: '?q=blue',
          },
        },
      }
      const expected = ''
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return empty string if user is viewing a filtered list', () => {
      const state = {
        routing: {
          location: {
            pathname: '/filter/N-qn9Zdgl',
            search: '?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556',
          },
        },
      }
      const expected = ''
      expect(getRedirectUrl(state)).toEqual(expected)
    })

    it('should return "/login" if user is viewing checkout', () => {
      const state = {
        routing: {
          location: {
            pathname: '/checkout/delivery',
            search: '',
          },
        },
      }
      const expected = '/checkout/login'
      expect(getRedirectUrl(state)).toEqual(expected)
    })
  })
})

describe('routeMatchesLocation', () => {
  it('should return true if the route matches the current pathname', () => {
    const state = {
      routing: {
        location: {
          pathname: '/checkout/login',
        },
      },
    }
    expect(routeMatchesLocation('/checkout/login', state)).toBeTruthy()
  })

  it('should return false if the route does not match the current pathname', () => {
    const state = {
      routing: {
        location: {
          pathname: '/checkout/delivery',
        },
      },
    }
    expect(routeMatchesLocation('/checkout/not-delivery', state)).toBeFalsy()
  })
})
