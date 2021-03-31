import * as utils from '../../../__test__/utils'
import AddToBasketFromWishlist from '../AddToBasketFromWishlist'

import wcsAddToBasket from '../../../../../../../test/apiResponses/wishlist/wcs-addToBasketFromWishlist.json'
import wcsGetBasket from '../../../../../../../test/apiResponses/wishlist/wcs-getBasket.json'
import hapiAddToBasket from '../../../../../../../test/apiResponses/wishlist/hapi-addToBasketFromWishlist.json'

describe('AddToBasketFromWishlist mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    utils.setWCSResponse({ body: wcsAddToBasket }, { n: 0 })
    utils.setWCSResponse({ body: wcsGetBasket }, { n: 1 })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const catEntryId = '1234567'

  const payloadFromMonty = {
    catEntryId,
    quantity: 1,
  }

  const addToBasketPayloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    add2cartErrorViewName: 'Add2ShopCartResponseView',
    errorViewName: 'ProductDisplayErrorView',
    isMiniBagEnabled: true,
    Add2ShopCart: true,
    result: 'ADDED_TO_BAG',
    catEntryId,
    quantity: 1,
  }

  const getBasketPayloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    updatePrices: 1,
    calculationUsageId: [-1, -2, -7],
    calculateOrder: 1,
    orderId: '.',
    URL: 'OrderItemDisplay',
  }

  const defaults = {
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    method: 'post',
    params: {},
  }

  const execute = utils.buildExecutor(AddToBasketFromWishlist, defaults)

  describe('requests', () => {
    describe('request to add to bag', () => {
      it('should set the correct endpoint', () => {
        execute()
        expect(utils.getRequestArgs(0).endpoint).toBe(
          '/webapp/wcs/stores/servlet/NewProductDetailsActionControl'
        )
      })

      it('should use the correct method', () => {
        execute()
        expect(utils.getRequestArgs(0).method).toBe('post')
      })

      it('should have the correct payload', () => {
        execute()
        expect(utils.getRequestArgs(0).payload).toEqual(addToBasketPayloadToWCS)
      })
    })

    describe('request to get bag details', () => {
      it('should set the correct endpoint', async () => {
        await execute()
        expect(utils.getRequestArgs(1).endpoint).toBe(
          '/webapp/wcs/stores/servlet/OrderCalculate'
        )
      })

      it('should use the correct method', async () => {
        await execute()
        expect(utils.getRequestArgs(1).method).toBe('get')
      })

      it('should have the correct query', async () => {
        await execute()
        expect(utils.getRequestArgs(1).query).toEqual(getBasketPayloadToWCS)
      })
    })
  })

  describe('responses', () => {
    it('should be transformed correctly', async () => {
      await expect(execute()).resolves.toEqual(hapiAddToBasket)
    })
  })

  describe('if the WCS request fails', () => {
    it('throws an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS failed'))
      await expect(execute()).rejects.toBe('WCS failed')
    })
  })

  describe('if the success value from the WCS response is false', () => {
    it('throws an error', async () => {
      utils.setWCSResponse({
        body: { success: 'false', message: 'Could not add that item to cart' },
      })

      await expect(execute()).rejects.toThrow('Could not add that item to cart')
    })
  })
})
