import transform, { productFragment, assetsFragment } from '../getWishlist'
import { wishlistAssetTypes } from '../../constants/wishlist'

import wcsGetWishlist from 'test/apiResponses/wishlist/wcs-getWishlist.json'
import hapiGetWishlist from 'test/apiResponses/wishlist/hapi-getWishlist.json'

describe('getWishlistTransform', () => {
  describe('transform functions', () => {
    describe('assetsFragment', () => {
      const productImageUrl =
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS10N07NRED_Small_F_1.jpg'
      const outfitImageUrl =
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS10N07NRED_Small_M_1.jpg'

      const product = {
        productImageUrl,
        outfitImageUrl,
      }

      it('should generate asset URLs', () => {
        expect(assetsFragment(product, wishlistAssetTypes)).toMatchSnapshot()
      })

      it('should return an empty object if the asset is not the correct format', () => {
        expect(assetsFragment(product, null)).toEqual([])
      })
    })

    describe('productFragment', () => {
      it('should transform a product', () => {
        const item = wcsGetWishlist.itemDetails[0]
        expect(productFragment(item)).toEqual(hapiGetWishlist.itemDetails[0])
      })
    })
  })

  describe('transform function', () => {
    it('should not transform itemDetails if not populated in the response', () => {
      expect(transform({})).toEqual({ itemDetails: null })
    })
    it('should transform the get wishlist response', () => {
      expect(transform(wcsGetWishlist)).toEqual(hapiGetWishlist)
    })
  })
})
