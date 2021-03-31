import * as utils from '../../../__test__/utils'
import wcs from 'test/apiResponses/saved-basket/getSavedBasket/wcs.json'
import hapiMonty from 'test/apiResponses/saved-basket/getSavedBasket/hapi.json'
import GetSavedBasket from '../GetSavedBasket'

describe('GetSavedBasket mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setUserSession([
      utils.createCookies('array')(utils.createJSessionIdCookie()),
    ])

    utils.setWCSResponse({ body: wcs })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const queryToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    getBag: 'false',
  }

  const defaults = {
    method: 'get',
    payload: {},
    query: {},
    endpoint: '',
    params: {},
  }

  const execute = utils.buildExecutor(GetSavedBasket, defaults)

  describe('Requests', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/SaveForLaterAjaxView'
      )
    })

    it('should use the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should map the query correctly', async () => {
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual(queryToWCS)
    })

    it('should map the response correctly', async () => {
      await expect(execute()).resolves.toEqual({
        body: hapiMonty,
      })
    })
  })
})
