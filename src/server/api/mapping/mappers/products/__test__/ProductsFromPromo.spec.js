import * as utils from '../../../__test__/utils'
import ProductsFromPromo from '../ProductsFromPromo'
import wcs from '../../../../../../../test/apiResponses/promo-category/wcs.json'

const promoId = 11008914
const jsessionid = '12345'

const montyRequest = {
  originEndpoint: '/api/products/promo',
  query: { promoId },
  payload: {},
  method: 'get',
  headers: {},
  params: {},
}

const wcsQuery = {
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  promoId,
}

const execute = utils.buildExecutor(ProductsFromPromo, montyRequest)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('ProductsFromPromo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('calling the wcs endpoint for product promotion landing', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/DisplayPromoLanding', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/DisplayPromoLanding'
      )
    })
    it('should call with the get method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })
    it('should call with the correct query', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual(wcsQuery)
    })
  })
  describe('response', () => {
    beforeEach(() => {
      happyApi()
    })
    it('should contain the wcs response in the body', async () => {
      const result = await execute()
      expect(result.body).toEqual(wcs)
    })
    it('should contain the jsessionid', async () => {
      const result = await execute()
      expect(result.jsessionid).toBe(jsessionid)
    })
  })
})
