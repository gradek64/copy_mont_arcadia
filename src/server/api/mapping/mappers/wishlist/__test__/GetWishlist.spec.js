import * as utils from '../../../__test__/utils'
import GetWishlist from '../GetWishlist'

jest.mock('../../../transforms/getWishlist')
import getWishlistTransform from '../../../transforms/getWishlist'

describe('GetWishlist mapper', () => {
  const wcsSuccessBody = { success: true, giftListId: 123456, itemDetails: [] }

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
    sortOption: 'Recent',
    maxItemsInPage: 100,
    onlyProductIds: false,
    pageNo: 1,
  }

  const execute = utils.buildExecutor(GetWishlist, defaults)

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
    it('should be transformed by the getWishlist transform function', async () => {
      await execute()
      expect(getWishlistTransform).toHaveBeenCalledWith(wcsSuccessBody)
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
