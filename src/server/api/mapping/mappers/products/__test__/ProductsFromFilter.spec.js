import * as utils from '../../../__test__/utils'
import ProductsFromFilter from '../ProductsFromFilter'
import wcs from '../../../../../../../test/apiResponses/products-filter/wcs.json'
import hapi from '../../../../../../../test/apiResponses/products-filter/hapi.json'

const storeId = 12556
const jsessionid = '12345'
const seoUrl = 'ts/uk/fakeSeoUrl'
const montyRequest = {
  originEndpoint: '/api/products/filter',
  query: { seoUrl },
  payload: {},
  method: 'get',
  headers: { 'brand-code': 'tsuk' },
  params: {},
}
const wcsQuery = {
  catalogId: '33057',
  langId: '-1',
  storeId,
  dimSelected: 'ts/uk/fakeSeoUrl',
}
const destinationEndPoint =
  '/webapp/wcs/stores/servlet/CatalogNavigationAjaxSearchResultCmd'
const wcs_env = global.process.env.WCS_ENVIRONMENT
const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
}

describe('ProductFromFilter', () => {
  describe('when seoUrl does not contain currentPage query param', () => {
    const execute = utils.buildExecutor(ProductsFromFilter, montyRequest)

    beforeEach(() => {
      jest.clearAllMocks()
      global.process.env.WCS_ENVIRONMENT = 'tst1'
    })

    afterEach(() => {
      global.process.env.WCS_ENVIRONMENT = wcs_env
    })

    describe('calling the wcs endpoint for product filter', () => {
      it('should call the endpoint without pagination parameters', async () => {
        happyApi()
        await execute()
        expect(utils.getRequestArgs(0).endpoint).toBe(`${destinationEndPoint}`)
        expect(utils.getRequestArgs(0).method).toBe('get')
        expect(utils.getRequestArgs(0).query).toEqual(wcsQuery)
      })
    })

    describe('response from wcs', () => {
      beforeEach(() => {
        happyApi()
      })

      it('should contain the wcs response in the body', async () => {
        const result = await execute()
        expect(result.body).toEqual(hapi)
      })
    })
  })
  describe('when seoUrl contains currentPage query param', () => {
    const execute = utils.buildExecutor(ProductsFromFilter, {
      ...montyRequest,
      query: { seoUrl: 'ts/uk/fakeSeoUrl?currentPage=4' },
    })

    beforeEach(() => {
      jest.clearAllMocks()
      global.process.env.WCS_ENVIRONMENT = 'tst1'
    })

    afterEach(() => {
      global.process.env.WCS_ENVIRONMENT = wcs_env
    })

    describe('calling the wcs endpoint for product filter', () => {
      it('should call the endpoint with pagination parameters', async () => {
        happyApi()
        await execute()
        expect(utils.getRequestArgs(0).endpoint).toBe(`${destinationEndPoint}`)
        expect(utils.getRequestArgs(0).method).toBe('get')
        expect(utils.getRequestArgs(0).query).toEqual({
          ...wcsQuery,
          dimSelected: 'ts/uk/fakeSeoUrl?currentPage=4&Nrpp=24&No=72',
        })
      })
    })

    describe('response from wcs', () => {
      beforeEach(() => {
        happyApi()
      })

      it('should contain the wcs response in the body', async () => {
        const result = await execute()
        expect(result.body).toEqual(hapi)
      })
    })
  })
})
