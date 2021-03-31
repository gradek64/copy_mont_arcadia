import * as utils from '../../../__test__/utils'
import GetWishlistItemIds from '../GetWishlistItemIds'

describe('GetWishlist mapper', () => {
  const wcsSuccessBody = {
    success: true,
    giftListId: 123456,
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

  const wishlistId = '123456'

  const queryFromMonty = {
    wishlistId,
  }

  const defaults = {
    payload: {},
    query: queryFromMonty,
    endpoint: '',
    method: 'get',
    params: {},
  }

  const queryToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    giftListId: wishlistId,
    onlyProductIds: true,
    sortOption: 'Recent',
  }

  const execute = utils.buildExecutor(GetWishlistItemIds, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ArcadiaSortAndPageItemsInList'
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

  describe('successful responses', () => {
    it('should map response from getWishlistItemIds function', async () => {
      await expect(execute()).resolves.toEqual({
        body: wcsSuccessBody,
      })
    })
  })

  describe('unsuccessful responses', () => {
    describe('if the WCS request fails', () => {
      it('throws an error', async () => {
        utils.setWCSResponse(Promise.reject('WCS failed'))
        await expect(execute()).rejects.toBe('WCS failed')
      })
    })

    describe('if WCS returns an empty object', () => {
      it('throws "Wishlist not found"', async () => {
        utils.setWCSResponse({
          body: {},
        })
        await expect(execute()).rejects.toThrow('Wishlist not found')
      })
    })

    describe('if WCS returns an object without a giftListId or a message', () => {
      it('throws the body', async () => {
        const wcsErrorResponse = {
          success: false,
        }
        utils.setWCSResponse({
          body: {
            ...wcsErrorResponse,
          },
        })

        await expect(execute()).rejects.toMatchObject(wcsErrorResponse)
      })
    })

    describe('if WCS returns an object with a message and without a giftListId', () => {
      it('throws the message', async () => {
        const message = 'So many error conditions!'
        const wcsErrorResponse = {
          success: false,
          message,
        }
        utils.setWCSResponse({
          body: {
            ...wcsErrorResponse,
          },
        })

        await expect(execute()).rejects.toThrow(message)
      })
    })
  })
})
