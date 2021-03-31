import * as utils from '../../__test__/utils'
import Home from '../Home'
import wcs from '../../../../../../test/apiResponses/home/wcs.json'

describe('Home Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  const defaults = {
    payload: {},
    method: 'get',
    headers: {},
    endpoint: '',
    query: {},
  }

  const config = utils.getConfigByStoreCode('tsuk')

  const queryToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
  }

  const execute = utils.buildExecutor(Home, defaults)

  describe('Requests', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/TopCategoriesDisplay'
      )
    })

    it('should use the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should have the correct query', async () => {
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual(queryToWCS)
    })
  })

  describe('Responses', () => {
    it('should be returned correctly', async () => {
      utils.setWCSResponse({ body: wcs })
      await expect(execute()).resolves.toEqual({ body: wcs })
    })
  })
})
