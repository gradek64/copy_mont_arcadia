import { wishlistAssetTypes } from '../constants/wishlist'

/**
 * @description Takes an image URL from a WCS product and creates an array of URLs for different image sizes.
 * @description WCS provides the URL for the smallest image, e.g. http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS10H01NBLK_Small_M_1.jpg
 * @returns [
        {
          "assetType": "IMAGE_SMALL",
          "index": 1,
          "url": "http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS10H01NBLK_Small_F_1.jpg"
        },
        {
          "assetType": "IMAGE_THUMB",
          "index": 1,
          "url": "http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS10H01NBLK_Thumb_F_1.jpg"
        },
        {
          "assetType": "IMAGE_NORMAL",
          "index": 1,
          "url": "http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS10H01NBLK_2col_F_1.jpg"
        },
        ... etc
      ]
 * @param {Object} item
 * @param {Array} assetTypes
 */
const assetsFragment = (item, assetTypes = []) => {
  return !!item && Array.isArray(assetTypes)
    ? assetTypes.map(({ type, property, transform }) => ({
        assetType: type,
        url: transform ? transform(item[property]) : item[property],
      }))
    : []
}

const productFragment = (item) => ({
  ...item,
  assets: assetsFragment(item, wishlistAssetTypes),
})

const getWishlistTransform = (body) => {
  const { itemDetails } = body
  return {
    ...body,
    itemDetails: Array.isArray(itemDetails)
      ? itemDetails.map((item) => productFragment(item))
      : null,
  }
}

export default getWishlistTransform

export { productFragment, assetsFragment }
