import * as utils from '../../../__test__/utils'
import DeleteSavedBasket from '../DeleteSavedBasket'
import wcs from '../../../../../../../test/apiResponses/saved-basket/deleteSavedBasket/wcs.json'

describe('DeleteSavedBasket Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setUserSession([utils.createCookies()(utils.createJSessionIdCookie)])

    utils.setWCSResponse({ body: wcs })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    updatePrices: 1,
    calculationUsageId: -1,
    productId: '*',
    catEntryId: '*',
    orderId: '',
    calculateOrder: 1,
    URL: 'InterestItemsRemoveItemAjaxView',
  }

  const defaults = {
    method: 'delete',
    payload: {},
    query: {},
    endpoint: '',
    params: {},
  }

  const execute = utils.buildExecutor(DeleteSavedBasket, defaults)

  describe('Requests', () => {
    it('set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/InterestItemDelete'
      )
    })

    it('use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('map the query correctly', () => {
      execute()
      expect(utils.getRequestArgs(0).query).toEqual(payloadToWCS)
    })

    it('map the response correctly', async () => {
      await expect(execute()).resolves.toEqual({ body: wcs })
    })
  })

  describe('if the WCS request fails', () => {
    it('throws an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS is not working'))
      await expect(execute()).rejects.toBe('WCS is not working')
    })
  })

  describe('if the success value from the WCS response is false', () => {
    it('throws an error', async () => {
      utils.setWCSResponse({
        body: { success: 'false', message: 'Could not clear saved items' },
      })

      await expect(execute()).rejects.toThrow('Could not clear saved items')
    })
  })
})
