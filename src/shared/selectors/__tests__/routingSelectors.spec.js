import {
  getLocation,
  getLocationQuery,
  getRoutePath,
  getRouteSearch,
  getRoutePathWithParams,
  getVisitedPaths,
  getPrevPath,
  isInCheckout,
  isHomePage,
  isLoginPage,
  isMyAccount,
  isRestrictedPath,
  selectInDeliveryAndPayment,
  getRedirect,
  selectHostname,
  getPageStatusCode,
  getCurrentCountry,
  isNotFound,
  isOrderComplete,
  isOrderSuccess,
  getCurrentPageFromRouting,
} from '../routingSelectors'

describe('Routing Selectors', () => {
  describe('getLocation', () => {
    it('should return the location', () => {
      expect(
        getLocation({
          routing: {
            location: {
              propA: 'prop1',
            },
          },
        })
      ).toEqual({ propA: 'prop1' })
    })
    it('should return empty object if location is not defined', () => {
      expect(getLocation({})).toEqual({})
    })
  })
  describe('getLocationQuery', () => {
    it('should return query if exists', () => {
      expect(
        getLocationQuery({
          routing: {
            location: {
              query: {
                paramA: 'param1',
              },
            },
          },
        })
      ).toEqual({ paramA: 'param1' })
    })
    it('should return empty object there is no query', () => {
      expect(getLocationQuery({})).toEqual({})
    })
  })
  describe('getRoutePath', () => {
    it('should return pathname if any', () => {
      expect(
        getRoutePath({
          routing: {
            location: {
              pathname: '/random',
            },
          },
        })
      ).toEqual('/random')
    })
    it('should return empty string if the orderId is not defined', () => {
      expect(getRoutePath({})).toEqual('')
    })
  })
  describe('getRouteSearch', () => {
    const getStateWithSearch = (search) => ({
      routing: { location: { search } },
    })
    it('should return empty string if search is empty or invalid', () => {
      expect(getRouteSearch(getStateWithSearch())).toBe('')
      expect(getRouteSearch(getStateWithSearch(null))).toBe('')
      expect(getRouteSearch(getStateWithSearch(''))).toBe('')
    })
    it('should return routing search prop', () => {
      expect(getRouteSearch(getStateWithSearch('?q=red'))).toBe('?q=red')
    })
  })
  describe('getRoutePathWithParams', () => {
    const getStateWithPathAndParams = (pathname, search) => ({
      routing: { location: { pathname, search } },
    })
    it('should return empty string if both arguments are empty or invalid', () => {
      expect(getRoutePathWithParams(getStateWithPathAndParams())).toBe('')
      expect(
        getRoutePathWithParams(getStateWithPathAndParams(null, null))
      ).toBe('')
      expect(getRoutePathWithParams(getStateWithPathAndParams('', ''))).toBe('')
    })
    it('should return routing search prop', () => {
      expect(
        getRoutePathWithParams(
          getStateWithPathAndParams('/en/tsuk/product/red-bulls', '')
        )
      ).toBe('/en/tsuk/product/red-bulls')
      expect(
        getRoutePathWithParams(getStateWithPathAndParams('/search/', '?q=red'))
      ).toBe('/search/?q=red')
    })
  })

  describe('getVisitedPaths', () => {
    it('should return a list of visited paths', () => {
      expect(
        getVisitedPaths({
          routing: {
            visited: ['/some-path', '/another-path'],
          },
        })
      ).toEqual(['/some-path', '/another-path'])
    })
    it('should return empty array if no routes are defined', () => {
      expect(getVisitedPaths({})).toEqual([])
    })
  })

  describe('getPrevPath', () => {
    it('should return the pathname from where the current page was accessed', () => {
      const mockState = {
        routing: {
          location: { pathname: '/some-path' },
          visited: ['/', '/some-path'],
        },
      }
      expect(getPrevPath(mockState)).toBe('/')
    })
    it('should return the pathname from where the current page was most recently accessed', () => {
      const mockState = {
        routing: {
          location: { pathname: '/some-path' },
          visited: ['/', '/some-path', '/another-path', '/some-path'],
        },
      }
      expect(getPrevPath(mockState)).toBe('/another-path')
    })
    it('should return `direct link` if the current page was accessed from an external link or email', () => {
      const mockState = {
        routing: {
          location: { pathname: '/some-path' },
          visited: ['/some-path'],
        },
      }
      expect(getPrevPath(mockState)).toBe('direct link')
    })
  })

  describe('isInCheckout', () => {
    const getStateWithRoute = (route) => ({
      routing: { location: { pathname: route } },
    })
    it('should return false if is not a checkout route', () => {
      expect(isInCheckout(getStateWithRoute())).toBe(false)
      expect(isInCheckout(getStateWithRoute(null))).toBe(false)
      expect(isInCheckout(getStateWithRoute({}))).toBe(false)
      expect(isInCheckout(getStateWithRoute('/login'))).toBe(false)
    })
    it('should return true if is a checkout route', () => {
      expect(isInCheckout(getStateWithRoute('/checkout/delivery'))).toBe(true)
    })
  })
  describe('isHomePage', () => {
    it('should return true', () => {
      expect(
        isHomePage({
          routing: {
            location: {
              pathname: '/',
            },
          },
        })
      ).toEqual(true)
    })
    it('should return false', () => {
      expect(
        isHomePage({
          routing: {
            location: {
              pathname: '/not-home-page',
            },
          },
        })
      ).toEqual(false)
    })
  })

  describe('isMyAccount', () => {
    it('should return true for my account paths', () => {
      const paths = [
        '/my-account',
        '/my-account',
        '/my-account/my-details',
        '/my-account/some_future_route',
      ]

      paths.forEach((path) => {
        expect(
          isMyAccount({
            routing: {
              location: {
                pathname: path,
              },
            },
          })
        ).toBe(true)
      })
    })

    it('should return false for any other path', () => {
      const paths = ['/my-acount', '/', '/checkout', '/some/other/path']

      paths.forEach((path) => {
        expect(
          isMyAccount({
            routing: {
              location: {
                pathname: path,
              },
            },
          })
        ).toBe(false)
      })
    })
  })

  describe('isRestrictedPath', () => {
    it('should return true for restricted paths', () => {
      const paths = [
        '/my-account',
        '/login',
        '/my-account/my-details',
        '/checkout/login',
        '/checkout/delivery',
      ]

      paths.forEach((path) => {
        expect(
          isRestrictedPath({
            routing: {
              location: {
                pathname: path,
              },
            },
          })
        ).toBe(true)
      })
    })

    it('should return false for any other path', () => {
      const paths = [
        '/',
        '/some-path',
        '/en/tsuk/category/new-in-this-week-2169932/new-in-fashion-6367514',
      ]

      paths.forEach((path) => {
        expect(
          isRestrictedPath({
            routing: {
              location: {
                pathname: path,
              },
            },
          })
        ).toBe(false)
      })
    })
  })

  describe('selectInDeliveryAndPayment', () => {
    it('should return false if the path does not end with "/delivery-payment"', () => {
      const mockState = {
        routing: {
          location: {
            pathname: '/',
          },
        },
      }

      expect(selectInDeliveryAndPayment(mockState)).toBe(false)
    })

    it('should return false if the path is empty', () => {
      const mockState = {
        routing: {
          location: {
            pathname: '',
          },
        },
      }
      expect(selectInDeliveryAndPayment(mockState)).toBe(false)
    })

    it('should return false if the path state does not exist', () => {
      const mockState = {
        routing: {},
      }
      expect(selectInDeliveryAndPayment(mockState)).toBe(false)
    })

    it('should return true if the path ends with "delivery-payment"', () => {
      const mockState = {
        routing: {
          location: {
            pathname: '/delivery-payment',
          },
        },
      }
      expect(selectInDeliveryAndPayment(mockState)).toBe(true)
    })
  })

  describe('getRedirect', () => {
    it('selects redirect', () => {
      const redirect = 'some redirect'
      const state = {
        routing: {
          redirect,
        },
      }
      expect(getRedirect(state)).toBe(redirect)
    })
  })

  describe('selectHostname', () => {
    it('selects the hostname', () => {
      const hostname = 'm.mans.nothot.com'
      const state = {
        routing: {
          location: {
            hostname,
          },
        },
      }

      expect(selectHostname(state)).toBe(hostname)
    })
  })

  describe('getPageStatusCode', () => {
    it('selects the page status code', () => {
      const state = {
        routing: {
          pageStatusCode: 200,
        },
      }

      expect(getPageStatusCode(state)).toBe(200)
    })
  })

  describe('isNotFound', () => {
    it('returns true for 404 status code', () => {
      const state = {
        routing: {
          pageStatusCode: 404,
        },
      }

      expect(isNotFound(state)).toBe(true)
    })

    it('returns false for non-404 codes', () => {
      const state = {
        routing: {
          pageStatusCode: 200,
        },
      }

      expect(isNotFound(state)).toBe(false)
    })
  })

  describe('isLoginPage', () => {
    it('should return true for login page', () => {
      const state = {
        routing: {
          location: {
            pathname: '/login',
          },
        },
      }

      expect(isLoginPage(state)).toBe(true)
    })

    it('should return true for checkout login', () => {
      const state = {
        routing: {
          location: {
            pathname: '/checkout/login',
          },
        },
      }

      expect(isLoginPage(state)).toBe(true)
    })

    it('should return false for other paths', () => {
      const state = {
        routing: {
          location: {
            pathname: '/something/else',
          },
        },
      }

      expect(isLoginPage(state)).toBe(false)
    })
  })

  describe('getCurrentCountry', () => {
    it('should return currentCountry if any', () => {
      const state = {
        routing: {
          location: {
            query: {
              currentCountry: 'Unitied Kingdom',
            },
          },
        },
      }
      expect(getCurrentCountry(state)).toEqual('Unitied Kingdom')
    })
  })

  describe('isOrderComplete', () => {
    it('returns true if has order-complete string', () => {
      const state = {
        routing: {
          location: {
            pathname: '/order-complete/random-string/3456895',
          },
        },
      }
      expect(isOrderComplete(state)).toBe(true)
    })

    it('returns false if doesnt have order-complete string', () => {
      const state = {
        routing: {
          location: {
            pathname: '/another-string/random-string/3456895',
          },
        },
      }
      expect(isOrderComplete(state)).toBe(false)
    })
  })

  describe('isOrderSuccess', () => {
    it('returns true if has psd2-order-success string', () => {
      const state = {
        routing: {
          location: {
            pathname: '/psd2-order-success/random-string/3456895',
          },
        },
      }
      expect(isOrderSuccess(state)).toBe(true)
    })

    it('returns false if doesnt have psd2-order-success string', () => {
      const state = {
        routing: {
          location: {
            pathname: '/another-string/random-string/3456895',
          },
        },
      }
      expect(isOrderSuccess(state)).toBe(false)
    })
  })

  describe('getCurrentPageFromRouting', () => {
    it('returns currentPage if it exists', () => {
      const state = {
        routing: {
          location: {
            query: {
              currentPage: 3,
            },
          },
        },
      }
      expect(getCurrentPageFromRouting(state)).toEqual(3)
    })

    it('returns 1 if currentPage does not exist', () => {
      const state = {}
      expect(getCurrentPageFromRouting(state)).toEqual(1)
    })
  })
})
