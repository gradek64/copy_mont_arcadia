import { createSelector } from 'reselect'
import { equals } from 'ramda'

const matchProductId = (x) => ({ productId }) => productId === x
const getWishlist = (state) => (state && state.wishlist) || {}

export function getDefaultWishlistId(state) {
  const { giftListId } = getWishlist(state)

  return giftListId || null
}

export function getWishlistItemIds(state) {
  const { productList } = getWishlist(state)

  return productList || null
}

export function getTotalWishlistItems(state) {
  return getWishlist(state).noOfItemsInList || 0
}

export function getWishlistItemDetails(state) {
  const { itemDetails } = getWishlist(state)

  return itemDetails || null
}

export function getWishlistItemCount(state) {
  const wishlistedItems = getWishlistItemIds(state) || []
  return wishlistedItems.length
}

export function isProductAddedToWishlist(state, productId) {
  const wishlistedItems = getWishlistItemIds(state) || []
  return wishlistedItems.some(matchProductId(productId))
}

export function isMovingProductToWishlist(state, productId) {
  const { movingProductToWishlist } = getWishlist(state)

  return movingProductToWishlist === productId
}
export function isMovingAnyProductToWishlist(state) {
  const { movingProductToWishlist } = getWishlist(state)

  return !!movingProductToWishlist
}

export const getWishlistedItem = createSelector(
  [(state) => getWishlistItemIds(state) || [], (state, productId) => productId],
  (wishlistedItems, productId) => {
    return wishlistedItems.find(matchProductId(productId)) || {}
  }
)

export const isWishlistSync = createSelector(
  [getWishlistItemIds, getWishlistItemDetails],
  (wishlistItemIds, wishlistItemDetails) => {
    return wishlistItemIds && wishlistItemDetails
      ? equals(
          wishlistItemIds.map(({ productId }) => productId),
          wishlistItemDetails.map(({ parentProductId }) => parentProductId)
        )
      : false
  }
)

export const isLoadingWishlistItemDetails = (state) =>
  getWishlist(state).isLoadingItemDetails || false

export const getWishlistPageNo = (state) => getWishlist(state).pageNo || 0
