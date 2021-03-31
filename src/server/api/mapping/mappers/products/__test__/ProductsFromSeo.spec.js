import ProductsFromSeo from '../ProductsFromSeo'

jest.mock('../../../Mapper')
jest.mock('../../../transforms/product')

import transform from '../../../transforms/product'

const responseBody = { body: 'wcs' }
const transformedBody = { body: 'monty' }
const resultBody = { body: 'monty' }

const storeConfig = {
  catalogId: 98765,
  langId: -1,
  siteId: 12345,
  brandName: 'Jimmy',
  storeCode: 'msuk',
}

const seoQuery = {
  seoUrl: '/en/tsuk/category/clothing-427/dresses-442?currentPage=4',
}

describe('ProductsFromSeo', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    describe('when seoQuery has currentPage query param', () => {
      it('sets destinationEndpoint to the seoUrl and appends pagination params in the query', () => {
        const productsFromSeo = new ProductsFromSeo()
        productsFromSeo.query = seoQuery
        expect(productsFromSeo.destinationEndpoint).toBeUndefined()
        productsFromSeo.mapEndpoint()
        expect(productsFromSeo.destinationEndpoint).toBe(
          `${seoQuery.seoUrl}&Nrpp=24&No=72`
        )
      })
    })

    describe('when seoQuery does not have currentPage query param', () => {
      it('sets destinationEndpoint to the seoUrl in the query', () => {
        const productsFromSeo = new ProductsFromSeo()
        productsFromSeo.query = {
          ...seoQuery,
          seoUrl: '/en/tsuk/category/clothing-427/dresses-442',
        }
        expect(productsFromSeo.destinationEndpoint).toBeUndefined()
        productsFromSeo.mapEndpoint()
        expect(productsFromSeo.destinationEndpoint).toBe(
          '/en/tsuk/category/clothing-427/dresses-442'
        )
      })
    })
  })

  describe('mapResponseBody', () => {
    it('maps the response body calling the transform for the product', () => {
      const productsFromSeo = new ProductsFromSeo()

      productsFromSeo.storeConfig = storeConfig
      productsFromSeo.destinationHostname = 'hostname'

      transform.mockReturnValue(transformedBody)

      expect(transform).not.toHaveBeenCalled()
      expect(productsFromSeo.mapResponseBody(responseBody)).toEqual(resultBody)
      expect(transform).toHaveBeenCalledTimes(1)

      expect(transform).toHaveBeenCalledWith(
        responseBody,
        storeConfig.brandName,
        storeConfig.storeCode,
        'hostname'
      )
    })
  })
})
