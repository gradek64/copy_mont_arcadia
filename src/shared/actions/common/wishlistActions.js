import React from 'react'

import { get, post, del } from '../../lib/api-service'

import {
  showModal,
  showInfoModal,
  toggleModal,
  setPredecessorModal,
} from './modalActions'

import { isUserAuthenticated } from '../../selectors/userAuthSelectors'
import {
  getDefaultWishlistId,
  getWishlistItemCount,
  isProductAddedToWishlist,
  getWishlistedItem,
} from '../../selectors/wishlistSelectors'
import { isFeatureWishlistEnabled } from '../../selectors/featureSelectors'
import {
  MAX_WISHLIST_ITEMS,
  MAX_WISHLIST_INFO_MODAL,
  ITEMS_TO_SHOW,
} from '../../constants/wishlistConstants'
import { isMobile, getWindowWidth } from '../../selectors/viewportSelectors'

/**
 * Add to Wishlist
 */
const addToWishlistSuccess = (wishlist) => ({
  type: 'ADD_TO_WISHLIST_SUCCESS',
  wishlist,
})

const addToWishlistFailure = () => ({
  type: 'ADD_TO_WISHLIST_FAILURE',
})

const captureWishlistEvent = (type, options = {}) => (dispatch) =>
  dispatch({ type, ...options })

// Temporarily save the catEntry in the store so that it can be added after the user aunthenticates
const storeProductId = (productId) => ({
  type: 'WISHLIST_STORE_PRODUCT_ID',
  productId,
})

const deleteStoredProductId = () => ({
  type: 'WISHLIST_DELETE_STORED_PRODUCT_ID',
})

const setMovingProductToWishlist = (productId) => ({
  type: 'SET_MOVING_PRODUCT_TO_WISHLIST',
  productId,
})

const clearMovingProductToWishlist = () => ({
  type: 'CLEAR_MOVING_PRODUCT_TO_WISHLIST',
})

const addToWishlist = (productId, modifier, productDetails) => (
  dispatch,
  getState
) => {
  const wishlistCount = getWishlistItemCount(getState())
  const infoModalProps = {
    infoText: MAX_WISHLIST_INFO_MODAL,
    cancelClick: () => dispatch(toggleModal()),
    cancelText: 'cancel',
    actionLink: '/wishlist',
    actionClick: () => dispatch(toggleModal()),
    actionText: 'go to wishlist',
  }

  if (wishlistCount >= MAX_WISHLIST_ITEMS) {
    dispatch(showInfoModal(infoModalProps, {}))
    dispatch(addToWishlistFailure())
    return Promise.reject('Promise rejected')
  }

  return dispatch(post('/wishlist/add_item', { productId, modifier }))
    .then((res) => {
      return Promise.all([
        dispatch(
          captureWishlistEvent('GA_ADD_TO_WISHLIST', {
            productId,
            modifier,
            productDetails,
          })
        ),
        dispatch(addToWishlistSuccess(res.body)),
      ])
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch(addToWishlistFailure())
      return Promise.reject('Promise rejected')
    })
}

const triggerWishlistLoginModal = (
  productId,
  ModalComponent,
  modifier,
  afterAddToWishlist,
  onCancelLogin,
  isSuccessor,
  productDetails
) => (dispatch, getState) => {
  const state = getState()
  const isSmallViewport = isMobile(state)
  const viewportWidth = getWindowWidth(state)
  const mode = isSmallViewport && viewportWidth ? 'rollFull' : 'wishlistLogin'
  if (productId) dispatch(storeProductId(productId))
  if (isSuccessor) dispatch(setPredecessorModal(state.modal))

  return dispatch(
    showModal(
      <ModalComponent
        afterAddToWishlist={afterAddToWishlist}
        modifier={modifier}
        onCancelLogin={onCancelLogin}
        productDetails={productDetails}
      />,
      { mode }
    )
  )
}

const addToWishlistAfterLogin = (productId, modifier, productDetails) => (
  dispatch,
  getState
) => {
  const state = getState()

  if (isProductAddedToWishlist(state, productId)) {
    return Promise.all([
      dispatch(
        captureWishlistEvent('GA_ADD_TO_WISHLIST', {
          productId,
          modifier,
          productDetails,
        })
      ),
      dispatch(deleteStoredProductId()),
    ])
  }
  return dispatch(addToWishlist(productId, modifier, productDetails)).then(() =>
    dispatch(deleteStoredProductId())
  )
}

/**
 * Create Wishlist
 */
const createWishlistSuccess = (wishlist) => ({
  type: 'CREATE_WISHLIST_SUCCESS',
  wishlist,
})

const createWishlistFailure = () => ({
  type: 'CREATE_WISHLIST_FAILURE',
})

const createDefaultWishlist = () => (dispatch) => {
  return dispatch(post('/wishlist/create', { wishlistName: 'default' }))
    .then((res) => {
      dispatch(createWishlistSuccess(res.body))
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch(createWishlistFailure())
    })
}

/**
 * Get All Wishlists
 */
const getAllWishlistsSuccess = (payload) => ({
  type: 'GET_ALL_WISHLISTS_SUCCESS',
  payload,
})

const getAllWishlistsFailure = () => ({
  type: 'GET_ALL_WISHLISTS_FAILURE',
})

const getAllWishlists = () => (dispatch) => {
  return dispatch(get('/wishlists'))
    .then((res) => {
      dispatch(getAllWishlistsSuccess(res.body))
      return Promise.resolve(res.body)
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch(getAllWishlistsFailure())
      return Promise.reject('Promise rejected')
    })
}

/**
 * Get Wishlist
 */
const getWishlistSuccess = (wishlist) => ({
  type: 'GET_WISHLIST_SUCCESS',
  wishlist,
})

const getPaginatedWishlistSuccess = (wishlist) => ({
  type: 'GET_PAGINATED_WISHLIST_SUCCESS',
  wishlist,
})

const getWishlistFailure = () => ({
  type: 'GET_WISHLIST_FAILURE',
})

const getWishlist = (wishlistId) => (dispatch) => {
  return dispatch(get(`/wishlist/item_ids?wishlistId=${wishlistId}`))
    .then((res) => {
      dispatch(getWishlistSuccess(res.body))
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch(getWishlistFailure())
    })
}

const getPaginatedWishlist = (pageNo = 1) => (dispatch, getState) => {
  const state = getState()
  const wishlistId = getDefaultWishlistId(state)

  if (!wishlistId) return dispatch(getWishlistFailure())

  dispatch({ type: 'START_WISHLIST_LOADING_DETAILS' })
  return dispatch(
    get(
      `/wishlist?wishlistId=${wishlistId}&pageNo=${pageNo}&maxItemsPerPage=${ITEMS_TO_SHOW}`
    )
  )
    .then((res) => {
      dispatch({ type: 'END_WISHLIST_LOADING_DETAILS' })
      dispatch(getPaginatedWishlistSuccess(res.body))
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch({ type: 'END_WISHLIST_LOADING_DETAILS' })
      dispatch(getWishlistFailure())
    })
}

const getDefaultWishlist = () => (dispatch, getState) => {
  const state = getState()

  // @NOTE checking wishlist is enabled because action is used in Main.jsx needs
  return isFeatureWishlistEnabled(state) && isUserAuthenticated(state)
    ? dispatch(getAllWishlists())
        .then((wishlists) => {
          const defaultWishlist = wishlists.find(
            ({ default: isDefault }) => isDefault === 'Yes'
          )
          if (defaultWishlist) {
            return dispatch(getWishlist(defaultWishlist.giftListId))
          }
          return dispatch(createDefaultWishlist())
        })
        .catch(() => {
          // @TODO error handling strategy to be defined
          dispatch(getWishlistFailure())
        })
    : null
}

/**
 * Remove from Wishlist
 */
const removeWishlistProduct = (productId) => ({
  type: 'REMOVE_ITEM_FROM_WISHLIST',
  productId,
})

const removeWishListFailure = () => ({
  type: 'REMOVE_WISHLIST_FAILURE',
})

/**
 * @typedef ProductDetailsForWishlistEvent
 * @property {number} productId- what's the products id
 * @property {string} lineNumber - what is the products line number
 * @property {string} price - what is the products now price
 */

/**
 * @typedef RemoveProductFromWishlistInterface
 * @property {number} productId - what's the products id
 * @property {string} modifier - where was this action triggered e.g. 'plp', 'wishlist' etc
 * @property {boolean} reportToGA - should this action report the event to Google Analytics
 * @property {ProductDetailsForWishlistEvent} productDetails
 */

/**
 * This removes an item from a wishlist. And optionally triggers an event
 * to let google analytics know this action has occurred
 * @param {RemoveProductFromWishlistInterface} Args
 * @returns {function}
 */
const removeProductFromWishlist = ({
  productId,
  modifier,
  productDetails,
  reportToGA,
}) => (dispatch, getState) => {
  const state = getState()
  const wishlistId = getDefaultWishlistId(state)
  const { giftListItemId: wishlistItemId } = getWishlistedItem(state, productId)
  if (!wishlistItemId) return dispatch(removeWishListFailure())

  return dispatch(del('/wishlist/remove_item', { wishlistId, wishlistItemId }))
    .then((res) => {
      if (res.statusCode === 200) {
        const promisesToDispatch = [dispatch(removeWishlistProduct(productId))]
        if (reportToGA) {
          promisesToDispatch.push(
            dispatch(
              captureWishlistEvent('GA_REMOVE_FROM_WISHLIST', {
                productId,
                modifier,
                productDetails,
              })
            )
          )
        }
        return Promise.all(promisesToDispatch)
      }
      return dispatch(removeWishListFailure())
    })
    .catch(() => {
      // @TODO error handling strategy to be defined
      dispatch(removeWishListFailure())
      return Promise.reject('Promise rejected')
    })
}

const clearWishlist = () => ({
  type: 'CLEAR_WISHLIST',
})

export {
  addToWishlistSuccess,
  addToWishlistFailure,
  addToWishlist,
  addToWishlistAfterLogin,
  storeProductId,
  deleteStoredProductId,
  triggerWishlistLoginModal,
  createWishlistSuccess,
  createWishlistFailure,
  createDefaultWishlist,
  getAllWishlistsSuccess,
  getAllWishlistsFailure,
  getAllWishlists,
  getWishlistSuccess,
  getPaginatedWishlistSuccess,
  getWishlistFailure,
  getWishlist,
  getPaginatedWishlist,
  getDefaultWishlist,
  removeProductFromWishlist,
  clearWishlist,
  captureWishlistEvent,
  setMovingProductToWishlist,
  clearMovingProductToWishlist,
}
