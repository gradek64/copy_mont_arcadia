import * as utils from '../../../__test__/utils'
import CreateWishlist from '../CreateWishlist'

describe('CreateWishlist Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    utils.setWCSResponse({ body: { success: true } })
  })

  const config = utils.getConfigByStoreCode('tsuk')

  const payloadFromMonty = {
    wishlistName: 'My Wishlist',
  }

  const payloadToWCS = {
    langId: config.langId,
    storeId: config.siteId,
    catalogId: config.catalogId,
    accessPreference: 'Public',
    default: 'Yes',
    disabled: false,
    name: payloadFromMonty.wishlistName,
  }

  const defaults = {
    payload: payloadFromMonty,
    query: {},
    endpoint: '',
    method: 'post',
    params: {},
  }

  const execute = utils.buildExecutor(CreateWishlist, defaults)

  describe('requests', () => {
    it('should set the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ArcadiaCreateWishList'
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
    it('should throw an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS crashed'))
      await expect(execute()).rejects.toBe('WCS crashed')
    })
  })

  describe('if the success value from WCS is false', () => {
    it('should throw an error', async () => {
      utils.setWCSResponse({
        body: { success: false, message: 'Name already exists!' },
      })

      await expect(execute()).rejects.toThrow('Name already exists!')
    })
  })
})
