import * as utils from '../../../__test__/utils'
import RemoveFromWishlist from '../RemoveFromWishlist'

describe('DeleteFromWishlist mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setWCSResponse({
      body: {
        success: true,
      },
    })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const wishlistId = '1234567'
  const wishlistItemId = '67890'

  const payloadFromMonty = {
    wishlistId,
    wishlistItemId,
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    giftListId: wishlistId,
    giftListItemId: wishlistItemId,
  }

  const defaults = {
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    method: 'post',
    params: {},
  }

  const execute = utils.buildExecutor(RemoveFromWishlist, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/AjaxGiftListServiceDeleteItem'
      )
    })

    it('should use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('should map the payload correctly', () => {
      execute()
      expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
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
        body: { success: 'false', message: 'Wishlist not found' },
      })

      await expect(execute()).rejects.toThrow('Wishlist not found')
    })
  })
})
