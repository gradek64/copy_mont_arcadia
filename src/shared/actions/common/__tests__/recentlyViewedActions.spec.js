import { omit } from 'ramda'
import {
  deleteRecentlyViewedProduct,
  extractRecentlyDataFromProduct,
} from '../recentlyViewedActions'
import { saveRecentlyViewedState } from '../../../../client/lib/storage'

jest.mock('../../../../client/lib/storage')

describe('recentlyViewedActions', () => {
  beforeEach(jest.clearAllMocks)

  const recentlyViewed = ['some product']
  const getState = jest.fn(() => ({ recentlyViewed }))
  const dispatch = jest.fn((x) => x)

  describe('deleteRecentlyViewedProduct', () => {
    it('should delete recently viewed product', () => {
      deleteRecentlyViewedProduct(3434)(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith({
        type: 'DELETE_RECENTLY_VIEWED_PRODUCT',
        productId: 3434,
      })
      expect(saveRecentlyViewedState).toHaveBeenCalledWith(recentlyViewed)
    })
  })

  describe('extractRecentlyDataFromProduct', () => {
    const imageUrl = 'some image url'
    const amplienceUrl = 'some amplience url'
    const productId = 'product id'
    const lineNumber = 'line number'
    const name = 'some name'
    const type = 'ADD_RECENTLY_VIEWED_PRODUCT'
    const canonicalUrl = 'http://domain.com/canonical/product/url'
    const product = {
      productId,
      lineNumber,
      name,
      assets: [
        { url: 'some url', assetType: 'IMAGE_LARGE' },
        { url: imageUrl, assetType: 'IMAGE_THUMB' },
      ],
      amplienceAssets: { images: [amplienceUrl] },
      canonicalUrl,
    }

    it('should filter product and call addRecentlyViewedProduct', () => {
      extractRecentlyDataFromProduct(product)(dispatch, getState)

      expect(dispatch).toHaveBeenCalledWith({
        type,
        product: {
          productId,
          lineNumber,
          name,
          imageUrl,
          amplienceUrl,
          url: '/canonical/product/url',
        },
      })
      expect(saveRecentlyViewedState).toHaveBeenCalledWith(recentlyViewed)
    })

    it('should pass amplience images as undefined when not available', () => {
      extractRecentlyDataFromProduct(omit('amplienceAssets', product))(
        dispatch,
        getState
      )
      expect(dispatch).toHaveBeenCalledWith({
        type,
        product: {
          productId,
          lineNumber,
          name,
          imageUrl,
          amplienceUrl: undefined,
          url: '/canonical/product/url',
        },
      })
    })
  })
})
