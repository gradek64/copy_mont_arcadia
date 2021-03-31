import * as utils from '../../../__test__/utils'
import DeleteWishlist from '../DeleteWishlist'

describe('DeleteWishlist mapper', () => {
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

  const payloadFromMonty = {
    wishlistId,
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    giftListId: wishlistId,
  }

  const defaults = {
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    method: 'post',
    params: {},
  }

  const execute = utils.buildExecutor(DeleteWishlist, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/AjaxGiftListServiceDeleteGiftList'
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

  describe('if the response is successful', () => {
    it('returns response payload', async () => {
      // @NOTE current WCS response, to verify with Cogz why do we need arrays in the props
      const response = {
        body: {
          success: true,
          giftListState: ['Deleted'],
          externalId: ['11005'],
          isDefault: false,
          giftListId: ['11005'],
          storeId: ['12556'],
        },
      }
      utils.setWCSResponse(Promise.resolve(response))

      await expect(execute()).resolves.toEqual(response)
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
        body: { success: 'false', message: "Wishlist can't be deleted" },
      })

      await expect(execute()).rejects.toThrow("Wishlist can't be deleted")
    })
  })
})
