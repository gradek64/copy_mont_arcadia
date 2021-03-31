import {
  processRedirectUrl,
  isLowStockProduct,
  parseCurrentPage,
  isSeoUrlSearchFilter,
  updateSeoUrlIfSearchFilter,
  prepareSeoUrl,
  isSeoUrlCategoryFilter,
  cleanSeoUrl,
  addSearchParam,
  isSearchUrl,
  hasQueryParameter,
  parseSearchUrl,
  getResetSearchUrl,
  seoUrlIncludesProductsIndex,
  updatePriceSeoUrl,
  removePriceFromSeoUrl,
  isPriceFilter,
  encodeIfPriceSeoUrl,
  isSeoUrlFilterOnScroll,
  reviseNrppParam,
  reviseSiteIdParam,
  reviseNoParam,
  concatParam,
  concatUrl,
  getColourSwatchesIndex,
  addParamClearAll,
  removeParamClearAll,
  getCategoryFromBreadcrumbs,
  replaceSpacesWithPlus,
  isValidEcmcCategory,
} from '../products-utils'

jest.mock('../../../server/api/mapping/constants/plp')

jest.mock('react-router', () => ({
  browserHistory: {
    goBack: jest.fn(),
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

jest.mock('../window', () => ({
  getHostname: jest.fn(),
  changeURL: jest.fn(),
  isProductionBrandHost: jest.fn(),
}))
import { getHostname, changeURL, isProductionBrandHost } from '../window'

describe('Product Utils', () => {
  describe('HTML Utils', () => {
    const browser = global.process.browser

    afterEach(() => {
      global.process.browser = browser
      jest.resetAllMocks()
    })

    it('handles relative URL', () => {
      global.process.browser = true
      processRedirectUrl('/bbb')
      expect(browserHistory.replace).toHaveBeenCalledWith('/bbb')
    })

    it('handles locals URL', () => {
      getHostname.mockImplementation(() => 'aaa.com')
      isProductionBrandHost.mockImplementation(() => true)
      global.process.browser = true
      processRedirectUrl('http://aaa.com/bbb')
      expect(isProductionBrandHost).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith('/bbb')
    })

    it('handles external URL', () => {
      getHostname.mockImplementation(() => 'aaa.com')
      global.process.browser = true
      processRedirectUrl('http://ccc.com/bbb')
      expect(browserHistory.goBack).toHaveBeenCalledTimes(1)
      expect(changeURL).toHaveBeenCalledWith('http://ccc.com/bbb')
    })
  })
  describe('isLowStock', () => {
    it('should return false if quantity greather than stockThreshold', () => {
      expect(isLowStockProduct(15, 5)).toBe(false)
    })
    it('should return true if quantity less or equal than stockThreshold', () => {
      expect(isLowStockProduct(5, 5)).toBe(true)
    })
    it('should return true if quantity less or equal than undefined stockThreshold', () => {
      expect(isLowStockProduct(3)).toBe(true)
    })
  })
  describe('parseCurrentPage', () => {
    it('should return 1 if no product length is supplied', () => {
      expect(parseCurrentPage(undefined)).toEqual(1)
    })
    it('should return 2 if the product length is 24 or less', () => {
      expect(parseCurrentPage(8)).toEqual(2)
      expect(parseCurrentPage(10)).toEqual(2)
      expect(parseCurrentPage(16)).toEqual(2)
      expect(parseCurrentPage(20)).toEqual(2)
    })
    it('should return 3 if the product length is more than 24 and less than 48', () => {
      expect(parseCurrentPage(25)).toEqual(3)
      expect(parseCurrentPage(28)).toEqual(3)
      expect(parseCurrentPage(36)).toEqual(3)
      expect(parseCurrentPage(48)).toEqual(3)
    })
    it('should return 4 if the product length is more than 48 and less than 72', () => {
      expect(parseCurrentPage(49)).toEqual(4)
      expect(parseCurrentPage(56)).toEqual(4)
      expect(parseCurrentPage(62)).toEqual(4)
      expect(parseCurrentPage(72)).toEqual(4)
    })
  })
  describe('isSeoUrlSearchFilter', () => {
    it('should return false if the seoUrl is not a search filter', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlSearchFilter(seoUrl)).toBeFalsy()
    })

    it('should return true if the seoUrl is a search filter', () => {
      const seoUrl = '/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      expect(isSeoUrlSearchFilter(seoUrl)).toBeTruthy()
    })
    it('should return true if is basic seoUrl after search', () => {
      const seoUrl = '?seo=false&siteId=%2F12556'
      expect(isSeoUrlSearchFilter(seoUrl)).toBeTruthy()
    })
  })

  describe('isSeoUrlCategoryFilter', () => {
    it('should return false if the seoUrl is not a category filter', () => {
      const seoUrl = '/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      expect(isSeoUrlCategoryFilter(seoUrl)).toBeFalsy()
    })

    it('should return true if the seoUrl is a category filter', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlCategoryFilter(seoUrl)).toBeTruthy()
    })
    it('should return true if german/french seoUrl is a category filter', () => {
      const seoUrlGerman =
        '/en/tsuk/kategorie/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlCategoryFilter(seoUrlGerman)).toBeTruthy()
      const seoUrlFrench =
        '/en/tsuk/catégorie/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlCategoryFilter(seoUrlFrench)).toBeTruthy()
    })
  })

  describe('isSeoUrlFilterOnScroll', () => {
    it('should return false if the seoUrl is not a category filter', () => {
      const seoUrl =
        '/en/uk/category/something-wrong?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      expect(isSeoUrlFilterOnScroll(seoUrl)).toBeFalsy()
    })

    it('should return true if the seoUrl is a category filter', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlFilterOnScroll(seoUrl)).toBeTruthy()
    })
    it('should return true if the seoUrl is a category filter (also if not parameters like siteId)', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'
      expect(isSeoUrlFilterOnScroll(seoUrl)).toBeTruthy()
    })
    it('should return true if german/french seoUrl is a onScroll filter', () => {
      const seoUrlGerman =
        '/en/tsuk/kategorie/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlFilterOnScroll(seoUrlGerman)).toBeTruthy()
      const seoUrlFrench =
        '/en/tsuk/catégorie/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isSeoUrlFilterOnScroll(seoUrlFrench)).toBeTruthy()
    })
  })
  describe('updateSeoUrlIfSearchFilter', () => {
    it('should not update seoUrl if it is not a search filter', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(updateSeoUrlIfSearchFilter(seoUrl)).toEqual(seoUrl)
    })

    it('should update seoUrl if it is a search filter', () => {
      const seoUrl = '/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      const expected =
        '/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      expect(updateSeoUrlIfSearchFilter(seoUrl)).toEqual(expected)
    })
  })
  describe('prepareSeoUrl', () => {
    it('should remove "/filter" from the seoUrl', () => {
      const expected = '/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      const seoUrl =
        '/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      expect(prepareSeoUrl(seoUrl, '12556')).toEqual(expected)
    })
  })
  describe('cleanSeoUrl', () => {
    it('should remove two param from seoUrl "/filter" and "No=48"', () => {
      const expected = '/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
      const seoUrl =
        '/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556&No=48'
      expect(cleanSeoUrl(seoUrl)).toEqual(expected)
    })
  })
  describe('addSearchParam', () => {
    const nextPage = 2
    const siteId = '123456'

    it('should add a param to the seoUrl, to get a number of products starting from 24', () => {
      const expected = '?Nrpp=24&Ntt=blue&seo=false&siteId=%2F125568&No=24'
      const pathname = ''
      const search = '?Nrpp=24&Ntt=blue&seo=false&siteId=%2F125568'
      expect(addSearchParam(pathname, search, nextPage, siteId)).toEqual(
        expected
      )
    })

    it('should not add a param if the seoUrl is not a search filter', () => {
      const expected = ''
      const seoUrl = '/en/tsuk/category/clothing-427/dresses-442'
      const search = ''
      expect(addSearchParam(seoUrl, search, nextPage, siteId)).toEqual(expected)
    })
    it('should update "No" parameter with correct start index number', () => {
      const seoUrl = '/en/tsuk/category/clothing-427/dresses/N-qn9Zdgl'
      const search = '?No=0'
      const expected = '?No=24&siteId=%2F123456'
      expect(addSearchParam(seoUrl, search, nextPage, siteId)).toEqual(expected)
    })
  })
  describe('reviseNrppParam', () => {
    it('should update Nrpp param to 24', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/N-qn9Zdgl?No=24&Nrpp=20&siteId=%2F12345'
      const expected =
        '/en/tsuk/category/clothing-427/dresses-442/N-qn9Zdgl?No=24&Nrpp=24&siteId=%2F12345'
      expect(reviseNrppParam(seoUrl)).toEqual(expected)
    })
    it('should add param Nrpp=24 if it does not exist', () => {
      const seoUrl =
        '/en/tsuk/category/clothing-427/dresses-442/N-qn9Zdgl?No=24&siteId=%2F12345'
      const expected =
        '/en/tsuk/category/clothing-427/dresses-442/N-qn9Zdgl?No=24&siteId=%2F12345&Nrpp=24'
      expect(reviseNrppParam(seoUrl)).toEqual(expected)
    })
  })
  describe('reviseSiteIdParam', () => {
    const siteId = '12345'
    it('should return search with no changes', () => {
      const search = '?No=24&Nrpp=20&siteId=%2F12345'
      const expected = search
      expect(reviseSiteIdParam(search, siteId)).toEqual(expected)
    })
    it('should return search with a site id parameter', () => {
      const search = '?No=24&Nrpp=20'
      const expected = '?No=24&Nrpp=20&siteId=%2F12345'
      expect(reviseSiteIdParam(search, siteId)).toEqual(expected)
    })
  })
  describe('concatParam', () => {
    it('should return a concatenated string with an ampersand separating the new param', () => {
      const search = '?No=0&Nrpp=20'
      const newParam = 'siteId=%2F12345'
      const expected = `${search}&${newParam}`
      expect(concatParam(search, newParam)).toEqual(expected)
    })
    it('should add new param to beginning of string with a question mark if search is empty', () => {
      const search = ''
      const newParam = 'siteId=%2F12345'
      const expected = `?${newParam}`
      expect(concatParam(search, newParam)).toEqual(expected)
    })
  })

  describe('getCategoryFromBreadcrumbs', () => {
    it('should return the last category', () => {
      const breadcrumbs = [
        {},
        {},
        {
          category: 'foo',
        },
      ]
      expect(getCategoryFromBreadcrumbs(breadcrumbs)).toEqual(
        breadcrumbs[2].category
      )
    })
    it("should return the undefined if it doesn't exist", () => {
      const breadcrumbs = [{}, {}, undefined]
      expect(getCategoryFromBreadcrumbs(breadcrumbs)).toEqual(undefined)
    })
  })

  describe('concatUrl', () => {
    it('should return a concatenated string with an ampersand separating the new param with full SEOURL', () => {
      const seoUrl = '/some/n-12dnjds?No=0&Nrpp=20'
      const siteId = 'siteId=%2F12345'
      const expected = `${seoUrl}&${siteId}`
      expect(concatUrl(seoUrl, siteId)).toEqual(expected)
    })
    it('should add new param to beginning of string with a question mark if search is empty with full SEOURL', () => {
      const seoUrl = '/some/n-12dnjds'
      const siteId = 'siteId=%2F12345'
      const expected = `${seoUrl}?${siteId}`
      expect(concatUrl(seoUrl, siteId)).toEqual(expected)
    })
  })

  describe('reviseNoParam', () => {
    const nextPage = 2
    it('should update "No" parameter if it exist', () => {
      const search = '?No=0&Nrpp=20&siteId=%2F12345'
      const expected = '?No=24&Nrpp=20&siteId=%2F12345'
      expect(reviseNoParam(search, nextPage)).toEqual(expected)
    })
    it('should add "No" parameter if it does not exist', () => {
      const search = '?Nrpp=20&siteId=/12345'
      const expected = '?Nrpp=20&siteId=/12345&No=24'
      expect(reviseNoParam(search, nextPage)).toEqual(expected)
    })
  })
  describe('isSearchUrl', () => {
    it('should return false if the seoUrl supplied is not a search url', () => {
      const seoUrl = 'N-deoZdgl?Nrpp=24&Ntt=red&seo=false&siteId=%2F12556'
      expect(isSearchUrl(seoUrl)).toBeFalsy()
    })

    it('should return true if the seoUrl supplied is a search url', () => {
      const seoUrl = '/search/?q=red'
      expect(isSearchUrl(seoUrl)).toBeTruthy()
    })
  })
  describe('hasQueryParameter', () => {
    it('should return false as no query has been provided', () => {
      const seoUrl = '/search/'
      expect(hasQueryParameter(seoUrl)).toBeFalsy()
    })

    it('should return true as a regular query has been provided', () => {
      const seoUrl = '/search/?q=red&p=bed'
      expect(hasQueryParameter(seoUrl)).toBeTruthy()
    })
  })
  describe('parseSearchUrl', () => {
    it('should return a query object from a search URL', () => {
      const seoUrl = '/search/?q=red&p=bed'
      const expected = {
        q: 'red',
        p: 'bed',
      }
      expect(parseSearchUrl(seoUrl)).toEqual(expected)
    })
  })
  describe('seoUrlIncludesProductsIndex', () => {
    it('should return true if "No" param exists on the seoUrl', () => {
      const seoUrl = '?Nrpp=24&Ntt=blue&seo=false&siteId=%2F125568&No=48'
      expect(seoUrlIncludesProductsIndex(seoUrl)).toBeTruthy()
    })
  })
  describe('getResetSearchUrl', () => {
    it('should return a formatted path based on current search path', () => {
      const currentSearchPath =
        '?Nrpp=24&Ntt=blink182&seo=false&siteId=%2F12556'
      const expected = '/search/?q=blink182'
      expect(getResetSearchUrl(currentSearchPath)).toEqual(expected)
    })
  })

  describe('isPriceFilter', () => {
    it('should return true if path is price filter', () => {
      const currentSearchPath =
        '/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B74%2B250'
      expect(isPriceFilter(currentSearchPath)).toBeTruthy()
    })

    it('should return false if path is not price filter', () => {
      const currentSearchPath =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      expect(isPriceFilter(currentSearchPath)).toBeFalsy()
    })
  })

  describe('updatePriceSeoUrl and removePriceFromSeoUrl', () => {
    const navigationStateFromCategory =
      '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556'
    const navigationStateFromSearch =
      '/N-dgl?Nrpp=24&Ntt=red&seo=false&siteId=%2F12556'

    const navigationStateWithPriceFromCategory =
      '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN+28.0+45.0'
    const navigationStateWithPriceFromSearch =
      '/N-dgl?Nrpp=24&Ntt=red&seo=false&siteId=%2F12556&Nf=nowPrice%7CBTWN+28.0+45.0'

    it('Add new Price refinement from category products', () => {
      expect(updatePriceSeoUrl([5, 10], navigationStateFromCategory)).toBe(
        `${navigationStateFromCategory}&Nf=nowPrice%7CBTWN%2B5%2B10`
      )
    })
    it('Add new Price refinement from search products', () => {
      expect(updatePriceSeoUrl([5, 10], navigationStateFromSearch)).toBe(
        `${navigationStateFromSearch}&Nf=nowPrice%7CBTWN%2B5%2B10`
      )
    })
    it('modify SeoUrl Price refinement from category products', () => {
      expect(
        updatePriceSeoUrl([15, 25], navigationStateWithPriceFromCategory)
      ).toBe(`${navigationStateFromCategory}&Nf=nowPrice%7CBTWN%2B15%2B25`)
    })
    it('modify SeoUrl Price refinement from category products', () => {
      expect(
        updatePriceSeoUrl([15, 25], navigationStateWithPriceFromSearch)
      ).toBe(`${navigationStateFromSearch}&Nf=nowPrice%7CBTWN%2B15%2B25`)
    })

    it('Remove Price Refinement from category products', () => {
      expect(removePriceFromSeoUrl(navigationStateWithPriceFromCategory)).toBe(
        `${navigationStateFromCategory}`
      )
    })
    it('Remove Price Refinement from search products', () => {
      expect(removePriceFromSeoUrl(navigationStateWithPriceFromSearch)).toBe(
        `${navigationStateFromSearch}`
      )
    })
  })
  describe('encodeIfPriceSeoUrl', () => {
    it('Encode Price Filter from Seo Url if there', () => {
      const url =
        'http://local.m.topshop.com:8080/en/tsuk/category/jeans-6877054/jamie-jeans-6906622/N-277xZdgl?Nf=nowPrice%7CBTWN+23.0+59.0&Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556'
      expect(encodeIfPriceSeoUrl(url)).toBe(
        'http://local.m.topshop.com:8080/en/tsuk/category/jeans-6877054/jamie-jeans-6906622/N-277xZdgl?Nf%3DnowPrice%257CBTWN%2B23.0%2B59.0&Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556'
      )
    })
  })

  describe('getColourSwatchesProduct', () => {
    const fakeColourSwatches = [
      {
        colourName: '',
        imageUrl:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/swatch/999999.jpg',
        swatchProduct: {
          productId: 32441919,
          grouping: 'TS32S32NMUL',
          lineNumber: '32S32NMUL',
          name: 'Spirit Cross Strap Mules',
          shortDescription: 'Spirit Cross Strap Mules',
          unitPrice: '39.00',
          wasPrice: '39.00',
          productUrl:
            '/en/tsuk/product/shoes-430/heels-458/spirit-cross-strap-mules-7869484',
          productBaseImageUrl:
            'https://images.topshop.com/i/TopShop/TS32S32NMUL_F_1',
          outfitBaseImageUrl:
            'https://images.topshop.com/i/TopShop/TS32S32NMUL_M_1',
        },
      },
      {
        colourName: '',
        imageUrl:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/swatch/ffffff.jpg',
        swatchProduct: {
          productId: 32444436,
          grouping: 'TS32S32NWHT',
          lineNumber: '32S32NWHT',
          name: 'Spirit Cross Strap Mules',
          shortDescription: 'Spirit Cross Strap Mules',
          unitPrice: '39.00',
          wasPrice: '39.00',
          productUrl:
            '/en/tsuk/product/shoes-430/heels-458/spirit-cross-strap-mules-7869516',
          productBaseImageUrl:
            'https://images.topshop.com/i/TopShop/TS32S32NWHT_F_1',
          outfitBaseImageUrl:
            'https://images.topshop.com/i/TopShop/TS32S32NWHT_M_1',
        },
      },
    ]

    it('should return ArrayPosition of the colourSwatches product object grouping match with lineNumber', () => {
      expect(getColourSwatchesIndex('TS32S32NWHT', fakeColourSwatches)).toBe(1)
    })
    it('should return -1 when the colourSwatches product lineNumber DON`T match with any grouping', () => {
      expect(getColourSwatchesIndex('fakedontexist', fakeColourSwatches)).toBe(
        -1
      )
      expect(getColourSwatchesIndex('', fakeColourSwatches)).toBe(-1)
      expect(getColourSwatchesIndex(undefined, fakeColourSwatches)).toBe(-1)
      expect(getColourSwatchesIndex('TS32S32NWHT', undefined)).toBe(-1)
    })
  })

  describe('addParamClearAll', () => {
    it('should return a clear all param at the end of the query', () => {
      const url =
        '/en/tsuk/category/jeans-6877054/jamie-jeans-6906622/N-277xZdgl?Nf=nowPrice%7CBTWN%2023.0%2059.0&Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556'
      const expected = `${url}&clearAll=true`
      expect(addParamClearAll(url)).toBe(expected)
    })
    it('should return a clear all param at the beginning of the query', () => {
      const url =
        '/en/tsuk/category/jeans-6877054/jamie-jeans-6906622/N-277xZdgl'
      const expected = `${url}?clearAll=true`
      expect(addParamClearAll(url)).toBe(expected)
    })
    it('should return an empty string if url is an empty string', () => {
      const url = ''
      const expected = url
      expect(addParamClearAll(url)).toBe(expected)
    })
    it('should return url if "clearAll" param already exist', () => {
      const url =
        '/en/tsuk/category/jeans-6877054/jamie-jeans-6906622/N-277xZdgl?clearAll=true'
      const expected = url
      expect(addParamClearAll(url)).toBe(expected)
    })
  })

  describe('removeParamClearAll', () => {
    it('should return an empty string', () => {
      const url = ''
      const expected = ''
      expect(removeParamClearAll(url)).toBe(expected)
    })
    it('should remove clear all param from query string', () => {
      const url = '?Nrpp=24&siteId=%2F12556&categoryId=208523&clearAll=true'
      const expected = '?Nrpp=24&siteId=/12556&categoryId=208523'
      expect(removeParamClearAll(url)).toBe(expected)
    })
  })

  describe('replaceSpacesWithPlus', () => {
    it('should replace empty spaces with plus signs', () => {
      const pathname =
        '/en/tsuk/category/shoes-430/black/N-8ewZdeoZdgl?Nf=nowPrice|BTWN 25.0 120.0&Nrpp=24&currentPage=2&siteId=/12556&No=24'
      const expectedPathName = replaceSpacesWithPlus(pathname)
      expect(expectedPathName).toBe(
        '/en/tsuk/category/shoes-430/black/N-8ewZdeoZdgl?Nf=nowPrice|BTWN+25.0+120.0&Nrpp=24&currentPage=2&siteId=/12556&No=24'
      )
    })
  })

  describe('isValidEcmcCategory', () => {
    const validUrls = [
      '/en/tsuk/category/clothing-427',
      '/en/tsuk/category/clothing-427/dresses-442',
      '/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B7%2B121',
      '/en/tsuk/category/bags-accessories-1702216',
      '/fr/tsfr/catégorie/vêtements-415222/édition-limitée/sno/jeans-jamie/N-94tZq5qZ1y77Zq5dZdgg',
      '/de/tsde/kategorie/bekleidung-345341/kostüme-anzüge-1908595',
      '/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements-415222/%C3%A9dition-limit%C3%A9e/sno/jeans-jamie/N-94tZq5qZ1y77Zq5dZdgg',
      '/de/tsde/kategorie/bekleidung-345341/kost%C3%BCme-anz%C3%BCge-1908595',
      '/fr/tsfr/catégorie/vêtements-415222/loungewear-262403',
      '/fr/tsfr/catégorie/vêtements-415222/loungewear-2624038/chapeaux/camel/N-2buwZrj0Zdf7Zdgg?Nf=nowPrice%7CBTWN+5.0+83.0&Nrpp=24&siteId=%2F13057',
      '/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements-415222/loungewear-2624038/chapeaux/camel/N-2buwZrj0Zdf7Zdgg?Nf=nowPrice%257CBTWN+5.0+83.0&Nrpp=24&siteId=%252F13057',
      '/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements-415222/32/N-94tZdihZdgg?Nf=nowPrice%257CBTWN+1.0+451.0&Nrpp=24&siteId=%252F13057',
      '/de/tmde/kategorie/schuhe-und-accessoires-2932357/sliders-und-flip-flops-6559370',
      '/fr/tsfr/catégorie/sacs-et-accessoires-1702233',
      '/fr/tsfr/catégorie/sacs-et-accessoires-1702233/iphones-et-ipads-4170966/m%C3%A9tal/N-93aZ28a6Zdgg',
      '/fr/tsfr/cat%C3%A9gorie/sacs-et-accessoires-1702233',
      '/fr/tsfr/cat%C3%A9gorie/sacs-et-accessoires-1702233/iphones-et-ipads-4170966/m%C3%A9tal/N-93aZ28a6Zdgg',
    ]

    const invalidUrls = [
      '/en/tsuk/category/clothing/test',
      '/en/tsuk/category/clothing',
      '/en/tsuk/category/dresses',
      '/en/tsuk/category/bags-accessories/',
      '/fr/tsfr/catégorie/vêtements/36/N-94tZdijZdgg?Nrpp=24&siteId=%2F13057&Nf=nowPrice%7CBTWN%2B223%2B490',
      '/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements/%C3%A9dition-limit%C3%A9e/sno/jeans-jamie/N-94tZq5qZ1y77Zq5dZdgg',
      '/fr/tsfr/catégorie/vêtements/loungewear/chapeaux/camel/N-2buwZrj0Zdf7Zdgg?Nf=nowPrice%7CBTWN+5.0+83.0&Nrpp=24&siteId=%2F13057',
      '/fr/tsfr/cat%C3%A9gorie/v%C3%AAtements/loungewear/chapeaux/camel/N-2buwZrj0Zdf7Zdgg?Nf=nowPrice%257CBTWN+5.0+83.0&Nrpp=24&siteId=%252F13057',
      '/en/tsuk/category/N-2baZ2bbnZdgl?Nrpp=24&siteId=%2F12556',
      '/en/tmeu/category/N-7y7?Nrpp=24&siteId=%2F13061',
      '/en/tmus/category/N-7ye?Nrpp=24&Ns=promoPrice%7C1&siteID=Jv.v1_Wldzg-7weR_oO3BZA6A.tTRDOATw&siteId=/13051&currentPage=2&pagination=1',
      '/en/dpuk/category/N-224hZc1y?Nrpp=24&siteId=%2F12552',
      '/en/dpuk/category/N-21vsZ224gZc1y?Nrpp=24&siteId=%2F12552',
      '/en/dpuk/category/N-224iZc1y?Nrpp=24&siteId=/12552&currentPage=3&pagination=1',
      '/en/tsuk/category/N-2bbaZ2bbnZdgl?Nrpp=24&siteId=%2F12556',
    ]

    it.each(validUrls)('should return true for %p', (url) =>
      expect(isValidEcmcCategory(url)).toBe(true)
    )
    it.each(invalidUrls)('should return false for %p', (url) =>
      expect(isValidEcmcCategory(url)).toBe(false)
    )
  })
})
