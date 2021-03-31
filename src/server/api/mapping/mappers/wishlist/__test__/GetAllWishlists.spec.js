import * as utils from '../../../__test__/utils'
import GetAllWishlists from '../GetAllWishlists'

describe('AddToWishlist mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setWCSResponse({
      body: [],
    })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const defaults = {
    payload: {},
    query: {},
    endpoint: '',
    method: 'get',
    params: {},
  }

  const queryToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
  }

  const execute = utils.buildExecutor(GetAllWishlists, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/AjaxGetWishListResponse'
      )
    })

    it('should use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should map the query correctly', () => {
      execute()
      expect(utils.getRequestArgs(0).query).toEqual(queryToWCS)
    })
  })

  describe('if the WCS request fails', () => {
    it('throws an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS failed'))
      await expect(execute()).rejects.toBe('WCS failed')
    })
  })
})
