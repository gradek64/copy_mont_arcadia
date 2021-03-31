import * as utils from '../../../__test__/utils'
import AddToWishlist from '../AddToWishlist'

describe('AddToWishlist mapper', () => {
  const wcsSuccessBody = {
    success: true,
    productList: [
      { productId: 31308633, giftListItemId: 39303433 },
      { productId: 31308769, giftListItemId: 39303490 },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setWCSResponse({
      body: wcsSuccessBody,
    })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const productId = '1234567'

  const payloadFromMonty = {
    productId,
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    productId,
    pageName: 'addToWishlist',
  }

  const defaults = {
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    method: 'post',
    params: {},
  }

  const execute = utils.buildExecutor(AddToWishlist, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ArcadiaAddItemToList'
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

  describe('successful responses', () => {
    it('should return payload', async () => {
      await expect(execute()).resolves.toEqual({
        body: wcsSuccessBody,
      })
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
        body: { success: 'false', message: 'Could not add that item' },
      })

      await expect(execute()).rejects.toThrow('Could not add that item')
    })
  })
})
