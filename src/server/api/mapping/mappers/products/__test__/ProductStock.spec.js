import ProductSizes from '../ProductStock'

import wcs_normal from '../../../../../../../test/apiResponses/pdp/fetch_items/wcs.json'
import hapiMonty_normal from '../../../../../../../test/apiResponses/pdp/fetch_items/hapi.json'

jest.mock('../../../Mapper')

describe('# ProductSizes', () => {
  describe('# mapEndpoint', () => {
    it('expects to set "destinationEndpoint" property to the expected value', () => {
      const productSizes = new ProductSizes()
      expect(productSizes.destinationEndpoint).toBeUndefined()
      productSizes.mapEndpoint()
      expect(productSizes.destinationEndpoint).toEqual(
        '/webapp/wcs/stores/servlet/GetSizeQuantity'
      )
    })
  })
  describe('# mapRequestParameters', () => {
    it('expects to set "query" property to the expeted value if no storeConfig available', () => {
      const productSizes = new ProductSizes()
      expect(productSizes.query).toBeUndefined()
      productSizes.mapRequestParameters()
      expect(productSizes.query).toEqual({
        langId: undefined,
        catalogId: undefined,
        storeId: undefined,
      })
    })
    it('expects to set "query" property to the expeted value if "brand-code" in "headers" property', () => {
      const productSizes = new ProductSizes()
      productSizes.query = {
        productId: '12345',
      }
      productSizes.storeConfig = {
        siteId: 12556,
        catalogId: '33057',
        langId: '-1',
      }
      productSizes.headers = { 'brand-code': 'tsuk' }
      productSizes.mapRequestParameters()
      expect(productSizes.query).toEqual({
        productId: '12345',
        storeId: 12556,
        catalogId: '33057',
        langId: '-1',
      })
    })
  })
  describe('# mapReponseBody', () => {
    it('# returns the expected object', () => {
      const productSizes = new ProductSizes()
      const r = productSizes.mapResponseBody(wcs_normal)
      expect(r).toEqual(hapiMonty_normal)
    })
  })
})
