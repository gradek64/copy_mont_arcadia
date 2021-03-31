import { saveRecentlyViewedState } from '../../../client/lib/storage'
import { pathOr } from 'ramda'
import { getRouteFromUrl } from '../../lib/get-product-route'

export function deleteRecentlyViewedProduct(productId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'DELETE_RECENTLY_VIEWED_PRODUCT',
      productId,
    })
    saveRecentlyViewedState(getState().recentlyViewed)
  }
}

export function extractRecentlyDataFromProduct(product) {
  const {
    productId,
    lineNumber,
    name,
    amplienceAssets: { images: amplienceImages = [] } = {},
    assets,
    unitPrice,
    iscmCategory,
    canonicalUrl,
  } = product
  const imageThumb = assets.find((asset) => asset.assetType === 'IMAGE_THUMB')

  return (dispatch, getState) => {
    dispatch({
      type: 'ADD_RECENTLY_VIEWED_PRODUCT',
      product: {
        productId,
        lineNumber,
        name,
        imageUrl: pathOr('', ['url'], imageThumb),
        amplienceUrl: amplienceImages[0],
        unitPrice,
        iscmCategory,
        url: getRouteFromUrl(canonicalUrl),
      },
    })
    saveRecentlyViewedState(getState().recentlyViewed)
  }
}
