import {
  reviseCanonicalUrl,
  getPaginationSeoUrls,
  reviseUrl,
  getPrevPageUrl,
  getNextPageUrl,
} from '../plp-utils'
import { productListPageSize } from '../../../server/api/mapping/constants/plp'

describe('PLP Utils', () => {
  describe('#reviseCanonicalUrl', () => {
    const props = {
      canonicalUrl:
        'http://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl',
      location: {
        protocol: 'http:',
        hostname: 'local.m.topshop.com',
        pathname: '/en/tsuk/category/clothing-427/dresses-442/N-82zZdgl',
      },
      isFeatureHttpsCanonicalEnabled: false,
    }

    it('should return products.canonicalUrl', () => {
      const expected = props.canonicalUrl
      expect(reviseCanonicalUrl(props)).toEqual(expected)
    })

    it('should update protocol to "https" when feature flag enabled', () => {
      const expected =
        'https://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl'
      expect(
        reviseCanonicalUrl({
          ...props,
          isFeatureHttpsCanonicalEnabled: true,
        })
      ).toEqual(expected)
    })

    it('should still return a canonicalUrl if one is not provided by products', () => {
      const expected =
        'https://local.m.topshop.com/en/tsuk/category/clothing-427/dresses-442/N-82zZdgl'
      expect(
        reviseCanonicalUrl({
          ...props,
          canonicalUrl: '',
          isFeatureHttpsCanonicalEnabled: true,
        })
      ).toEqual(expected)
    })

    it('should build a canonicalUrl if one is not provided and feature flag is set to false', () => {
      const expected =
        'http://local.m.topshop.com/en/tsuk/category/clothing-427/dresses-442/N-82zZdgl'
      expect(
        reviseCanonicalUrl({
          ...props,
          canonicalUrl: '',
        })
      ).toEqual(expected)
    })

    it('should return canonicalUrl and apply query params at the beginning of the query', () => {
      const expected = `${
        props.canonicalUrl
      }?currentPage=2&No=${productListPageSize}`
      expect(
        reviseCanonicalUrl({
          ...props,
          location: {
            ...props.location,
            query: { currentPage: 2 },
          },
        })
      ).toEqual(expected)
    })

    it('should return canonicalUrl and apply query params at the end of the query', () => {
      const expected = `http://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?siteId=/123456&currentPage=2&No=${productListPageSize}`
      expect(
        reviseCanonicalUrl({
          ...props,
          canonicalUrl:
            'http://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?siteId=/123456',
          location: {
            ...props.location,
            query: { currentPage: 2 },
          },
        })
      ).toEqual(expected)
    })

    it('should grow the No Query parameter as a product of the productListPageSize', () => {
      const expected = `http://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?siteId=/123456&currentPage=3&No=${productListPageSize *
        2}`
      expect(
        reviseCanonicalUrl({
          ...props,
          canonicalUrl:
            'http://ts-dev2.dev.digital.arcadiagroup.co.uk/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?siteId=/123456',
          location: {
            ...props.location,
            query: { currentPage: 3 },
          },
        })
      ).toEqual(expected)
    })
  })

  describe('#reviseUrl', () => {
    it('should return undefined if pathname is an empty string', () => {
      const pathname = ''
      const query = {}
      const currentPage = 2
      expect(reviseUrl(pathname, query, currentPage)).toBeUndefined()
    })

    it('should update query param for a category url', () => {
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      const query = { currentPage: 1 }
      const currentPage = 2
      const expected = `${pathname}?currentPage=2&No=24`
      expect(reviseUrl(pathname, query, currentPage)).toEqual(expected)
    })

    it('should update query param for a filtered url', () => {
      const pathname =
        '/en/tsuk/category/brands-4210405/calvin-klein/N-7z2Z21o6Zdgl'
      const query = { currentPage: 1 }
      const currentPage = 2
      const expected = `${pathname}?currentPage=2&No=24`
      expect(reviseUrl(pathname, query, currentPage)).toEqual(expected)
    })

    it('should filter out unwanted query parameters', () => {
      const pathname = '/test/path'
      const query = {
        currentPage: '5',
        somethingUnwanted: 'to-be-filtered',
        Ns: 'sort-mode',
        pagination: '1',
        alsoUnwanted: 'also-filtered',
      }
      const currentPage = 2
      const expected = '/test/path?currentPage=2&Ns=sort-mode&No=24'
      expect(reviseUrl(pathname, query, currentPage)).toEqual(expected)
    })
  })

  describe('#getPrevPageUrl', () => {
    const categoryPath = '/en/tsuk/category/clothing-427/dresses-442'
    const filterPath =
      '/en/tsuk/category/brands-4210405/calvin-klein/N-7z2Z21o6Zdgl'

    it('should return undefined if current page is one', () => {
      const params = {
        query: { currentPage: 1 },
        pathname: categoryPath,
      }
      expect(getPrevPageUrl(params)).toBeUndefined()
    })

    it('should return the previous seoUrl for a category url', () => {
      const params = {
        query: { currentPage: 2 },
        pathname: categoryPath,
      }
      expect(getPrevPageUrl(params)).toEqual(categoryPath)
    })

    it('should return the previous seoUrl for a filtered url', () => {
      const minimalParams = {
        query: { currentPage: 2 },
        pathname: filterPath,
      }
      expect(getPrevPageUrl(minimalParams)).toEqual(filterPath)

      const extraParams = {
        query: { currentPage: 2, pagination: 1 },
        pathname: filterPath,
      }
      const expected = `${filterPath}?pagination=1`
      expect(getPrevPageUrl(extraParams)).toEqual(expected)
    })

    it('should return seoUrl with the previous page number', () => {
      const params = {
        query: { currentPage: 3 },
        pathname: categoryPath,
      }
      const expected = `${categoryPath}?currentPage=2&No=24`
      expect(getPrevPageUrl(params)).toEqual(expected)
    })

    it('should strip Nrpp, currentPage and No query params from PrevPageUrl when currentPage is 2', () => {
      const params = {
        query: { currentPage: 2, Nrpp: 24, No: 48 },
        pathname: categoryPath,
      }
      expect(getPrevPageUrl(params)).toEqual(categoryPath)
    })
  })

  describe('#getNextPageUrl', () => {
    const categoryPath = '/en/tsuk/category/clothing-427/dresses-442'
    const location = {
      query: { currentPage: 1 },
      pathname: categoryPath,
    }

    it('should return undefined if current page is greater than max pages', () => {
      const totalProducts = 24
      expect(getNextPageUrl(location, totalProducts)).toBeUndefined()
    })

    it('should return seo url with next current page', () => {
      const totalProducts = 72
      const expected = `${categoryPath}?currentPage=2&No=24`
      expect(getNextPageUrl(location, totalProducts)).toEqual(expected)
    })
  })

  describe('#getPaginationSeoUrls', () => {
    it('should return "nextPageUrl" and "prevPageUrl" as undefined if totalProducts is less than 25 and query.currentPage is less than 2', () => {
      const props = {
        totalProducts: 24,
        canonicalUrl: '',
        location: {
          pathname: '',
          query: {},
        },
      }
      const urls = getPaginationSeoUrls(props)
      expect(urls.nextPageUrl).toBeUndefined()
      expect(urls.prevPageUrl).toBeUndefined()
    })

    it('should return "nextPageUrl" and "prevPageUrl" as undefined if a search url', () => {
      const props = {
        totalProducts: 24,
        canonicalUrl: '',
        location: {
          pathname: '/search/',
          query: {
            q: 'blue',
          },
        },
      }
      const urls = getPaginationSeoUrls(props)
      expect(urls.nextPageUrl).toBeUndefined()
      expect(urls.prevPageUrl).toBeUndefined()
    })

    it('should return "nextPageUrl" and "prevPageUrl" as undefined if a search filter url', () => {
      const props = {
        totalProducts: 100,
        canonicalUrl: '',
        location: {
          pathname: '/filter/N-7ttZdgl',
          search: '?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556',
          query: {
            q: 'blue',
            currentPage: 2,
          },
        },
      }
      const urls = getPaginationSeoUrls(props)
      expect(urls.nextPageUrl).toBeUndefined()
      expect(urls.prevPageUrl).toBeUndefined()
    })
  })
})
