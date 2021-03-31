import * as utils from '../../../__test__/utils'
import UpdateItem from '../UpdateSavedItem'
import wcsUpdateSizeQuantity from '../../../../../../../test/apiResponses/saved-basket/updateItem/wcs-updateSizeQuantity.json'

describe('UpdateSavedItem mapper', () => {
  const orderId = '123123'
  const productId = '789789'
  const quantity = 2

  const config = utils.getConfigByStoreCode('tsuk')

  const montySizeQuantityChangePayload = {
    productId,
    catEntryIdToAdd: '1234567',
    catEntryIdToDelete: '9876543',
    quantity,
  }

  const montyQuantityChangePayload = {
    productId,
    catEntryIdToAdd: '9876543',
    catEntryIdToDelete: '9876543',
    quantity,
  }

  const sharedPayloadToWcs = {
    storeId: config.siteId,
    catalogId: config.catalogId,
    langId: config.langId,
    orderId: '',
    calculateOrder: '1',
    calculationUsageId: '-1',
    updatePrices: '1',
    sourcePage: '',
    productId,
    catEntryId: '9876543',
    quantity,
  }

  const defaults = {
    method: 'put',
    payload: montySizeQuantityChangePayload,
    endpoint: '',
    query: {},
    params: {},
  }

  const mockAPI = () => utils.setWCSResponse({ body: wcsUpdateSizeQuantity })

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    utils.setUserSession({
      cookies: [utils.createCookies()(utils.createCartIdCookie(orderId))],
    })

    mockAPI()
  })

  const execute = utils.buildExecutor(UpdateItem, defaults)

  describe('Any request', () => {
    it('should have the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/InterestItemDelete'
      )
    })

    it('should use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('should correctly map the response', async () => {
      await expect(execute()).resolves.toEqual({ body: wcsUpdateSizeQuantity })
    })
  })

  describe('Requests changing only quantity of a saved item', () => {
    it('should set a correct payload', () => {
      execute()
      expect(utils.getRequestArgs(0).payload).toEqual({
        ...sharedPayloadToWcs,

        URL:
          'AjaxInterestItemAdd?catEntryId=1234567&sourcePage=&URL=InterestItemUpdateItemAjaxView',
      })
    })
  })

  describe('Requests changing quantity and size of a saved item', () => {
    it('should set a correct payload', () => {
      execute({
        payload: montyQuantityChangePayload,
      })
      expect(utils.getRequestArgs(0).payload).toEqual({
        ...sharedPayloadToWcs,
        URL: 'AjaxInterestItemAdd?URL=InterestItemUpdateItemAjaxView',
      })
    })
  })

  describe('If any parameters are missing', () => {
    it('throws an error', () => {
      expect(() => execute({ payload: {} })).toThrow('Invalid parameters')
    })
  })

  describe('If the WCS request fails', () => {
    it('throws an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS error'))
      await expect(execute()).rejects.toBe('WCS error')
    })
  })

  describe('If the WCS response has a success value of false', () => {
    it('throws an error', async () => {
      utils.setWCSResponse({
        body: { success: 'false', message: 'There was an error of some sort' },
      })
      await expect(execute()).rejects.toMatchObject({
        output: {
          payload: {
            statusCode: 422,
            message: 'There was an error of some sort',
          },
        },
      })
    })
  })
})
