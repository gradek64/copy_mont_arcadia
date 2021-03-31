import { identity, uniqBy, prop } from 'ramda'
import createReducer from '../../lib/create-reducer'

// Helper functions
const filterProductList = (productList, productId) =>
  Array.isArray(productList)
    ? productList.filter((item) => item.productId !== productId)
    : productList
const filterItemDetails = (itemDetails, productId) =>
  Array.isArray(itemDetails)
    ? itemDetails.filter((item) => item.parentProductId !== productId)
    : itemDetails

const initialState = {
  itemDetails: null,
}

/**
 * Takes in the current itemDetails, and new itemDetails and merges the two lists
 * Ordered by the position in productList
 */
const mergeItemDetails = (currentItems, newItems = [], productList = []) => {
  /**
   * Creates a productId => index mapping
   */
  const productIds = productList.reduce((acc, { productId }, index) => {
    acc[productId] = index
    return acc
  }, {})

  /**
   * Concatanates the arrays
   * Ensure uniqueness bases on the parentProductId property
   * and sorts using the mappings above.
   */
  return uniqBy(prop('parentProductId'), currentItems.concat(newItems)).sort(
    (a, b) => productIds[a.parentProductId] - productIds[b.parentProductId]
  )
}

export default createReducer(initialState, {
  ADD_TO_WISHLIST_SUCCESS: (state, { wishlist }) => ({
    ...state,
    ...wishlist,
  }),
  ADD_TO_WISHLIST_FAILURE: identity,
  GET_ALL_WISHLISTS_SUCCESS: identity,
  GET_WISHLIST_SUCCESS: (state, { wishlist }) => ({
    ...state,
    ...wishlist,
  }),
  GET_PAGINATED_WISHLIST_SUCCESS: (state, { wishlist }) => ({
    ...state,
    ...wishlist,
    itemDetails: Array.isArray(state.itemDetails)
      ? mergeItemDetails(
          state.itemDetails,
          wishlist.itemDetails,
          state.productList
        )
      : wishlist.itemDetails,
  }),
  GET_WISHLIST_FAILURE: identity,
  REMOVE_ITEM_FROM_WISHLIST: (state, { productId }) => ({
    ...state,
    // @TODO: see if the response from removing an item can include the updated list of items.
    // Ideally the server would return the sole source of truth instead of the store being altered.
    productList: filterProductList(state.productList, productId),
    itemDetails: filterItemDetails(state.itemDetails, productId),
  }),
  WISHLIST_STORE_PRODUCT_ID: (state, { productId }) => ({
    ...state,
    pendingProductId: productId,
  }),
  WISHLIST_DELETE_STORED_PRODUCT_ID: (state) => ({
    ...state,
    pendingProductId: null,
  }),
  CLEAR_WISHLIST: () => ({
    productList: null,
    itemDetails: null,
  }),
  SET_MOVING_PRODUCT_TO_WISHLIST: (state, { productId }) => ({
    ...state,
    movingProductToWishlist: productId,
  }),
  CLEAR_MOVING_PRODUCT_TO_WISHLIST: (state) => ({
    ...state,
    movingProductToWishlist: null,
  }),
  START_WISHLIST_LOADING_DETAILS: (state) => ({
    ...state,
    isLoadingItemDetails: true,
  }),
  END_WISHLIST_LOADING_DETAILS: (state) => ({
    ...state,
    isLoadingItemDetails: false,
  }),
})
