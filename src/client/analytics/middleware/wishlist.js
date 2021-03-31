import { pathOr } from 'ramda'

import { addPostDispatchListeners } from './analytics-middleware'
import dataLayer from '../../../shared/analytics/dataLayer'
import { getBrandCode } from '../../../shared/selectors/configSelectors'
import { getViewportMedia } from '../../../shared/selectors/viewportSelectors'
import { getRoutePathWithParams } from '../../../shared/selectors/routingSelectors'

const getUserId = (state) => {
  return pathOr(null, ['account', 'user', 'userTrackingId'], state)
}

const getLoginError = (state) => {
  return pathOr(null, ['forms', 'login', 'message', 'message'], state)
}

const getRegisterError = (state) => {
  return pathOr(null, ['forms', 'register', 'message', 'message'], state)
}

export const wishlistModalPageView = (action, store) => {
  const { modifier } = action
  const state = store.getState()
  const brandCode = getBrandCode(state).toUpperCase()
  const event = {
    wishlist: {
      pageType: `${brandCode}:Wish List Authentication`,
      pageCategory: `${brandCode}:Wish List`,
      viewport: getViewportMedia(state),
      openedFrom: modifier,
    },
  }
  dataLayer.push(event, null, 'wishlistModalPageView')
}

export const wishlistCloseAuthenticationModal = (action) => {
  const { modifier } = action
  const event = {
    wishlist: {
      eventCategory: 'wish list',
      eventAction: 'click-close-modal',
      eventLabel: modifier,
    },
  }
  dataLayer.push(event, null, 'wishlistCloseAuthenticationModal')
}

export const wishlistSuccessfulSignIn = (action, store) => {
  const state = store.getState()
  const userId = getUserId(state)
  const eventLabel = userId ? userId.toString() : null
  const event = {
    wishlist: {
      eventCategory: 'wish list',
      eventAction: 'successful-sign-in',
      eventLabel,
    },
  }
  dataLayer.push(event, null, 'wishlistSuccessfulSignIn')
}

export const wishlistUnsuccessfulSignIn = (action, store) => {
  const state = store.getState()
  const error = getLoginError(state)
  const event = {
    wishlist: {
      eventCategory: 'wish list',
      eventAction: 'unsuccessful-sign-in',
      eventLabel: error,
    },
  }
  dataLayer.push(event, null, 'wishlistUnsuccessfulSignIn')
}

export const wishlistSuccessfulRegister = (action, store) => {
  const state = store.getState()
  const userId = getUserId(state)
  const eventLabel = userId ? userId.toString() : null
  const event = {
    wishlist: {
      eventCategory: 'wish list',
      eventAction: 'successful-register',
      eventLabel,
    },
  }
  dataLayer.push(event, null, 'wishlistSuccessfulRegister')
}

export const wishlistUnsuccessfulRegister = (action, store) => {
  const state = store.getState()
  const error = getRegisterError(state)
  const event = {
    wishlist: {
      eventCategory: 'wish list',
      eventAction: 'unsuccessful-register',
      eventLabel: error,
    },
  }
  dataLayer.push(event, null, 'wishlistUnsuccessfulRegister')
}

export const addToWishlist = (action, store) => {
  const {
    productId,
    modifier,
    productDetails: { lineNumber, price },
  } = action
  const state = store.getState()
  const wlUrl = getRoutePathWithParams(state)
  const id = productId ? productId.toString() : null
  const event = {
    wishlist: {
      addedFrom: modifier,
      wlUrl,
      productId: id,
      lineNumber,
      price,
    },
  }
  dataLayer.push(event, null, 'addToWishlist')
}

export const removeFromWishlist = (action, store) => {
  const {
    productId,
    modifier,
    productDetails: { lineNumber, price },
  } = action
  const state = store.getState()
  const wlUrl = getRoutePathWithParams(state)
  const id = productId ? productId.toString() : null
  const event = {
    wishlist: {
      removedFrom: modifier,
      wlUrl,
      productId: id,
      lineNumber,
      price,
    },
  }
  dataLayer.push(event, null, 'removeFromWishlist')
}

export const addToBagFromWishlist = (action, store) => {
  const { productId, price, lineNumber, pageType } = action
  const state = store.getState()
  const wlUrl = getRoutePathWithParams(state)
  const event = {
    wishlist: {
      pageType: pageType || 'wishlist',
      wlUrl,
      productId,
      price,
      lineNumber,
    },
  }
  dataLayer.push(event, null, 'addToBagFromWishlist')
}

export default () => {
  addPostDispatchListeners('GA_WISHLIST_MODAL_PAGE_VIEW', wishlistModalPageView)
  addPostDispatchListeners(
    'GA_WISHLIST_MODAL_CLOSE',
    wishlistCloseAuthenticationModal
  )
  addPostDispatchListeners(
    'GA_WISHLIST_LOGIN_SUCCESS',
    wishlistSuccessfulSignIn
  )
  addPostDispatchListeners(
    'GA_WISHLIST_LOGIN_ERROR',
    wishlistUnsuccessfulSignIn
  )
  addPostDispatchListeners(
    'GA_WISHLIST_REGISTER_SUCCESS',
    wishlistSuccessfulRegister
  )
  addPostDispatchListeners(
    'GA_WISHLIST_REGISTER_ERROR',
    wishlistUnsuccessfulRegister
  )
  addPostDispatchListeners('GA_ADD_TO_WISHLIST', addToWishlist)
  addPostDispatchListeners('GA_REMOVE_FROM_WISHLIST', removeFromWishlist)
  addPostDispatchListeners('GA_ADD_TO_BAG_FROM_WISHLIST', addToBagFromWishlist)
}
