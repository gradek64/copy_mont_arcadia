import React from 'react'
import { browserHistory } from 'react-router'
import { path, pathOr, difference, omit } from 'ramda'
import uuid from 'uuid'
import Button from '../../components/common/Button/Button'
import { get, post, put, del } from '../../lib/api-service'
import { getItem, removeItem } from '../../../client/lib/cookie'
import {
  resetForm,
  setFormMeta,
  setFormMessage,
  setFormLoading,
  handleFormResponseErrorMessage,
} from './formActions'
import {
  setGenericError,
  setUserErrorMessage,
  setApiError,
} from './errorMessageActions'
import { showModal, closeModal } from './modalActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { joinQuery } from '../../lib/query-helper'
import { localise } from '../../lib/localisation'
import {
  updateOrderSummaryProduct,
  updateOrderSummaryWithResponse,
  getOrderSummary,
} from './checkoutActions'
import { setMiniBagEspots } from './espotActions'
import { getDeliveryStoreDetails } from '../components/StoreLocatorActions'
import {
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
  ANALYTICS_ERROR,
  GTM_ACTION,
} from '../../analytics'
import { scrollElementIntoView } from '../../lib/scroll-helper'
import {
  getLocationQuery,
  isInCheckout,
  isNotFound,
} from '../../selectors/routingSelectors'
import {
  shouldTransferShoppingBag,
  removeTransferShoppingBagParams,
} from '../../lib/transfer-shopping-bag'
import {
  isFeatureTransferBasketEnabled,
  isFeatureAddItem3,
} from '../../selectors/featureSelectors'
import { isMobile } from '../../selectors/viewportSelectors'
import { selectConfig as getConfig } from '../../selectors/configSelectors'
import {
  bagContainsDDPProduct,
  getShoppingBagTotalItems,
  isZeroValueBag,
  isShoppingBagEmpty,
  isBasketTotalCoveredByGiftCards,
  getShoppingBagProducts,
} from '../../selectors/shoppingBagSelectors'
import { isDDPActiveUserPreRenewWindow } from '../../selectors/ddpSelectors'
import { incrementSocialProofCounters } from './socialProofActions'
import { isGuestOrder } from '../../selectors/checkoutSelectors'
import { authLogin, authPending, setAuthentication } from './authActions'
import { getAccount } from './accountActions'

export function openMiniBag(autoClose = false) {
  return (dispatch) => {
    dispatch(closeModal())
    dispatch({
      type: 'OPEN_MINI_BAG',
      autoClose,
    })
    document.dispatchEvent(new Event('openMiniBag'))
  }
}

export function updateOrderId(orderId) {
  return {
    type: 'UPDATE_ORDER_ID',
    payload: {
      orderId,
    },
  }
}

export function showMiniBagConfirm(isShown = true) {
  return {
    type: 'SHOW_MINIBAG_CONFIRM',
    payload: isShown,
  }
}

export function productsAdded(products, quantity) {
  return {
    type: 'PRODUCTS_ADDED_TO_BAG',
    payload: {
      products,
      quantity,
    },
  }
}

export function setLoadingShoppingBag(isLoading) {
  return {
    type: 'SET_LOADING_SHOPPING_BAG',
    isLoading,
  }
}
/*
   * updateShoppingBagBadgeCount is used for multi-tab sync,
   * therefore it needs persist flag (default false)
   * persist=true => allow window and tab sync
   * persinst=false => dont allow tab and window sync
*/
export function updateShoppingBagBadgeCount(count, persist = false) {
  return {
    type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
    count,
    persist,
  }
}

export const addMiniBagMessage = (message, options = {}) => {
  const {
    id = uuid(),
    duration = false,
    isError = false,
    isVisible = true,
    showOnce = false,
  } = options
  const payload = {
    id,
    message,
    duration,
    isError,
    isVisible,
    showOnce,
  }

  return {
    type: 'ADD_MINIBAG_MESSAGE',
    payload,
  }
}

export const removeMiniBagMessage = (id) => ({
  type: 'REMOVE_MINIBAG_MESSAGE',
  id,
})

export const clearMiniBagMessages = () => ({
  type: 'CLEAR_MINIBAG_MESSAGES',
})

export const showMiniBagMessage = (id) => ({
  type: 'SHOW_MINIBAG_MESSAGE',
  id,
})

export const hideMiniBagMessage = (id) => ({
  type: 'HIDE_MINIBAG_MESSAGE',
  id,
})

const checkForZeroValueOrder = () => (dispatch, getState) => {
  const state = getState()
  const { language, brandName } = getConfig(state)
  const l = localise.bind(null, language, brandName)

  if (
    isZeroValueBag(state) &&
    !isShoppingBagEmpty(state) &&
    !isBasketTotalCoveredByGiftCards(state)
  ) {
    const modalHtml = (
      <div className="OrderProducts-modal">
        <p>{l`We are unable to accept a zero value order`}</p>
        <Button clickHandler={() => dispatch(closeModal())}>{l`Ok`}</Button>
      </div>
    )
    dispatch(showModal(modalHtml))
  }
}
/*
   * updateBag is used for multi-tab sync,
   * therefore it needs persist flag (default true)
   * persist=true => allow window and tab sync
   * persinst=false => dont allow tab and window sync
*/
export function updateBag(bag, persist = true) {
  return (dispatch) => {
    const clampQuantity = (quantity) => (quantity >= 0 ? quantity : NaN)

    const sumQuantities = (prevItemCount, nextItem) =>
      prevItemCount + clampQuantity(nextItem.quantity)

    const ungroupedProductsCount = (products) =>
      Array.isArray(products) ? products.reduce(sumQuantities, 0) : NaN

    dispatch(updateShoppingBagBadgeCount(ungroupedProductsCount(bag.products)))

    if (bag.total !== '' && bag.subTotal !== '') {
      dispatch({
        type: 'UPDATE_BAG',
        bag,
        persist,
      })
      dispatch(checkForZeroValueOrder())
      dispatch(getDeliveryStoreDetails())
    }
  }
}

export function setPromotionCodeConfirmation(promotionCodeConfirmation) {
  return {
    type: 'SET_PROMOTION_CODE_CONFIRMATION',
    promotionCodeConfirmation,
  }
}

export function addPromotionCode({ gtmCategory, errorCallback, ...data }) {
  return (dispatch, getState) => {
    const inCheckout = isInCheckout(getState())
    const responseType = inCheckout ? 'orderSummary' : 'basket'
    dispatch(setFormLoading('promotionCode', true))
    dispatch(setFormMessage('promotionCode', {}))

    return dispatch(
      post('/shopping_bag/addPromotionCode', {
        ...data,
        responseType,
      })
    )
      .then((res) => {
        dispatch(setFormLoading('promotionCode', false))
        if (!inCheckout) {
          dispatch(updateBag(res.body))
        }
        dispatch(resetForm('promotionCode', { promotionCode: '' }))
        dispatch(setFormMeta('promotionCode', 'isVisible', false))
        dispatch(setPromotionCodeConfirmation(true))
        if (inCheckout) {
          dispatch(updateOrderSummaryWithResponse(res))
        }
        removeItem('arcpromoCode')
        if (gtmCategory) {
          dispatch(
            sendAnalyticsClickEvent({
              category: gtmCategory,
              action: GTM_ACTION.PROMO_CODE_APPLIED,
              label: data.promotionId,
            })
          )
        }
      })
      .catch((error) => {
        removeItem('arcpromoCode')
        dispatch(setFormLoading('promotionCode', false))
        dispatch(handleFormResponseErrorMessage('promotionCode', error))

        if (errorCallback) errorCallback(error)
        scrollElementIntoView(document.querySelector('.PromotionCode'))
        dispatch(
          sendAnalyticsErrorMessage(ANALYTICS_ERROR.SHOPPING_BAG_PROMO_CODE)
        )

        throw error
      })
  }
}

const isPromoCodeAdded = (code, bag) =>
  bag.promotions.some(({ promotionCode }) => promotionCode === code)

// The site supports setting a promotion code by adding ARCPROMO_CODE=<code> as a url parameter.
export const addStoredPromoCode = () => (dispatch, getState) => {
  if (typeof document === 'undefined') return
  const bag = getState().shoppingBag.bag
  const promoCode = getItem('arcpromoCode')
  if (promoCode && bag.products.length && !isPromoCodeAdded(promoCode, bag)) {
    return dispatch(addPromotionCode({ promotionId: promoCode }))
  }
}

export function getBagRequest(persist = true) {
  return (dispatch) => {
    dispatch(setLoadingShoppingBag(true))
    return dispatch(get('/shopping_bag/get_items'))
      .then(({ body }) => {
        dispatch(setLoadingShoppingBag(false))
        dispatch(updateBag(body, persist))
        const result = dispatch(addStoredPromoCode())
        if (result) {
          result
            .then(() => {
              dispatch(openMiniBag())
            })
            .catch(() => {
              dispatch(openMiniBag())
            })
        }
        return dispatch(setMiniBagEspots(body))
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
        dispatch(setLoadingShoppingBag(false))
      })
  }
}

export function getBag(isMergeRequest = false, persist = true) {
  return (dispatch) => {
    if (isMergeRequest)
      dispatch({
        type: 'BAG_MERGE_STARTED',
      })
    return dispatch(getBagRequest(persist)).then(() => {
      if (isMergeRequest)
        dispatch({
          type: 'BAG_MERGE_FINISHED',
        })
    })
  }
}

/**
 * This function is used for multi-tabs and when the user is in checkout.
 * It will check if the user is logged in one of the tabs and if so it will grab
 * the cached_auth param from the storage and rehydrate the user account and the auth
 * in the redux store.
 */
const rehydrateUserAuthInCheckout = async (dispatch) => {
  try {
    const cachedAuth = JSON.parse(localStorage.getItem('cached_auth'))
    if (cachedAuth) {
      dispatch(authPending(true))
      dispatch(authLogin(cachedAuth.bvToken))
      dispatch(setAuthentication('full'))
      await dispatch(getAccount())
      dispatch(authPending(false))
      browserHistory.push('/checkout')
    } else {
      browserHistory.push('/')
    }
  } catch (e) {
    browserHistory.push('/')
  }
}

/**
 * This action should only be used to synchronise bag with local storage on startup and between multiple tabs
 */
export const syncBag = () => async (dispatch, getState) => {
  const { routing } = getState()
  const pathName = routing.location.pathname
  const isNotFoundPage = isNotFound(getState())
  const inDeliveryAndPayment = pathName.endsWith('/delivery-payment')
  const bagCountCookie = getItem('bagCount')
  let isBagEmpty

  if (bagCountCookie) {
    const bagItemCount = parseInt(bagCountCookie, 10)
    dispatch(updateShoppingBagBadgeCount(bagItemCount))
    if (bagItemCount > 0) {
      dispatch(getBag(true, false))
    } else {
      isBagEmpty = true
    }
  } else {
    isBagEmpty = true
  }

  if (isBagEmpty) {
    dispatch({ type: 'NO_BAG' })
  }

  if (pathName.includes('checkout')) {
    if (!isNotFoundPage && isBagEmpty) {
      browserHistory.push('/')
    } else if (!isBagEmpty) {
      if (isGuestOrder(getState())) {
        await rehydrateUserAuthInCheckout(dispatch)
      }

      dispatch(
        getOrderSummary({
          shouldUpdateBag: false,
          shouldUpdateForms: inDeliveryAndPayment,
          shouldSync: false,
        })
      )
    }
  }

  // This is a quick fix for the issue reported in ticket ADP-3585.
  // It only affects the guest user but we do need to implement a more solid solution
  // to sync the user auth between tabs.
  if (pathName.includes('/order-complete') && isGuestOrder(getState())) {
    await rehydrateUserAuthInCheckout(dispatch)
  }
}

export function closeMiniBag() {
  return {
    type: 'CLOSE_MINI_BAG',
  }
}

export function toggleMiniBag() {
  return (dispatch, getState) => {
    if (getState().shoppingBag.miniBagOpen) {
      dispatch(closeMiniBag())
    } else {
      dispatch(openMiniBag())
    }
  }
}

export const synchroniseBagPostLogin = (preLoginState) => {
  return (dispatch, getState) => {
    const postLoginBagCount = getShoppingBagTotalItems(getState())
    const preLoginBagCount = getShoppingBagTotalItems(preLoginState)
    if (postLoginBagCount !== preLoginBagCount && isInCheckout(getState())) {
      dispatch(getBag(true))
    }
  }
}

export function checkForMergedItemsInBag(preLoginState) {
  return (dispatch, getState) => {
    const postLoginBagCount = getShoppingBagTotalItems(getState())
    const preLoginProductCount = getShoppingBagTotalItems(preLoginState)
    const postLoginActiveDDPUser = isDDPActiveUserPreRenewWindow(getState())
    const preLoginDdpInBag = bagContainsDDPProduct(preLoginState)
    const removingDdpFromBag = postLoginActiveDDPUser && preLoginDdpInBag
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const onCheckout = isInCheckout(getState())

    if (postLoginBagCount === preLoginProductCount && !removingDdpFromBag)
      return

    const ddpMessage =
      removingDdpFromBag &&
      l`Great news! You already have a delivery subscription.`

    if (ddpMessage) dispatch(addMiniBagMessage(ddpMessage))

    if (postLoginBagCount !== preLoginProductCount) {
      if (postLoginBagCount > 0) {
        const previousItemsMessage = l`You have items in your shopping bag from a previous visit.`

        dispatch(addMiniBagMessage(previousItemsMessage, { showOnce: true }))
      }
    }

    if (!onCheckout) dispatch(openMiniBag())

    if (onCheckout && process.browser) window.scrollTo(0, 0)
  }
}

function addToBagSuccess(res, successHTML) {
  return (dispatch, getState) => {
    const promotionCode = getItem('arcpromoCode')
    if (promotionCode) {
      dispatch(addPromotionCode({ promotionId: promotionCode }))
    }
    if (isMobile(getState())) dispatch(showModal(successHTML))
    dispatch(updateBag(res.body))
  }
}

const setAddingToBag = () => ({
  type: 'SET_ADDING_TO_BAG',
})

const clearAddingToBag = () => ({
  type: 'CLEAR_ADDING_TO_BAG',
})

/**
 * @typedef BundleItem
 * @property {number} productId
 * @property {string} sku
 */

/**
 * adds item(s) to customers bag
 * @func addToBag
 * @param {number} productId
 * @param {string} sku
 * @param {string} partNumber
 * @param {number} [quantity]
 * @param {React.Component} successHTML
 * @param {BundleItem[]} [bundleItems]
 * @param {boolean} isDDPProduct
 * @param {number} [catEntryId]
 */
export function addToBag(
  productId,
  sku,
  partNumber,
  quantity = 1,
  successHTML,
  bundleItems,
  isDDPProduct,
  catEntryId
) {
  return (dispatch, getState) => {
    const state = getState()
    const {
      shoppingBag: { productBeingAdded },
    } = state
    if (productBeingAdded) return

    dispatch(setAddingToBag())

    const inCheckout = isInCheckout(state)
    const responseType = inCheckout ? 'orderSummary' : 'basket'
    const AddItem3Enabled = isFeatureAddItem3(state)
    if (!AddItem3Enabled && bundleItems)
      bundleItems = bundleItems.map((bundleItem) =>
        omit(['catEntryId'], bundleItem)
      )
    const item = {
      productId,
      sku,
      partNumber,
      quantity: bundleItems ? undefined : quantity,
      bundleItems,
      isDDPProduct,
      inCheckout,
      responseType,
      ...(AddItem3Enabled && {
        catEntryId,
        noRedirect: true,
      }),
    }

    const previousBagProducts = getShoppingBagProducts(state)

    return dispatch(post('/shopping_bag/add_item2', item))
      .then((res) => {
        if (res.body && res.body.success === false) {
          throw new Error(res.body.message)
        }
        const basket = inCheckout ? pathOr({}, ['basket'], res.body) : res.body

        const addedProducts = difference(basket.products, previousBagProducts)

        dispatch(incrementSocialProofCounters(productId))

        dispatch(productsAdded(addedProducts, quantity))
        if (inCheckout) {
          dispatch(updateOrderSummaryWithResponse(res))
        } else if (successHTML) {
          dispatch(addToBagSuccess(res, successHTML))
        } else {
          dispatch(updateBag(res.body))
        }
        dispatch(clearAddingToBag())
        return dispatch(setMiniBagEspots(basket))
      })
      .catch((err) => {
        const errorMessage = path(['response', 'body', 'message'], err)
        if (errorMessage) {
          dispatch(setUserErrorMessage(err))
        } else {
          dispatch(setApiError(err))
        }
        dispatch(clearAddingToBag())
        return err
      })
  }
}

export function addToBagWithCatEntryId(catEntryId, successHTML, quantity = 1) {
  return (dispatch, getState) => {
    const previousBagProducts = getState().shoppingBag.bag.products
    const payload = { catEntryId, quantity }
    const isSmallViewport = isMobile(getState())

    return dispatch(post('/wishlist/add_to_bag', payload))
      .then((res) => {
        const addedProducts = difference(res.body.products, previousBagProducts)

        dispatch(productsAdded(addedProducts, quantity))

        dispatch(
          successHTML
            ? addToBagSuccess(res, successHTML)
            : updateBag(res.body, true)
        )

        if (!isSmallViewport) {
          dispatch(openMiniBag(true))
        }
        return dispatch(setMiniBagEspots(res.body))
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
        dispatch(ajaxCounter('decrement'))
        return err
      })
  }
}

export function deleteFromBag(orderId, product, successModalText = null) {
  return (dispatch, getState) => {
    const { orderItemId, isDDPProduct: isDDPItem } = product
    const inCheckout = isInCheckout(getState())
    const responseType = inCheckout ? 'orderSummary' : 'basket'
    dispatch(ajaxCounter('increment'))
    return dispatch(
      del(
        `/shopping_bag/delete_item${joinQuery({
          orderId,
          orderItemId,
          responseType,
          isDDPItem,
        })}`
      )
    )
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if (res.body && res.body.success === false) {
          throw new Error(res.body.message)
        }
        if (inCheckout) {
          dispatch(updateOrderSummaryWithResponse(res))
        } else {
          dispatch(updateBag(res.body))
        }
        if (successModalText) {
          const { language, brandName } = getState().config
          const l = localise.bind(null, language, brandName)
          const successModalHTML = (
            <div className="OrderProducts-modal">
              <p>{successModalText}</p>
              <Button
                clickHandler={() => dispatch(closeModal())}
              >{l`Ok`}</Button>
            </div>
          )
          dispatch(showModal(successModalHTML))
        }
      })
      .catch(() => {
        dispatch(ajaxCounter('decrement'))
      })
  }
}

export function updateShoppingBagProduct(index, update) {
  return {
    type: 'UPDATE_SHOPPING_BAG_PRODUCT',
    index,
    update,
  }
}

export function fetchProductItemSizesAndQuantities(index) {
  return (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const catEntryId = path(
      ['shoppingBag', 'bag', 'products', index, 'catEntryId'],
      getState()
    )
    return dispatch(
      get(
        `/shopping_bag/fetch_item_sizes_and_quantities?catEntryId=${catEntryId}`,
        false
      )
    )
      .then(({ body: { items } }) => {
        dispatch(updateShoppingBagProduct(index, { items }))
        dispatch(updateOrderSummaryProduct(index, { items }))
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
      })
      .then(() => {
        dispatch(ajaxCounter('decrement'))
      })
  }
}

export function persistShoppingBagProduct(index) {
  return (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const inCheckout = isInCheckout(getState())
    const responseType = inCheckout ? 'orderSummary' : 'basket'

    const product = getState().shoppingBag.bag.products[index]
    const quantity = product.quantitySelected || product.quantity
    const catEntryIdToAdd =
      product.catEntryIdToAdd === undefined
        ? product.catEntryId
        : product.items[product.catEntryIdToAdd].catEntryId

    return dispatch(
      put(
        '/shopping_bag/update_item',
        {
          quantity,
          catEntryIdToDelete: product.catEntryId,
          catEntryIdToAdd,
          responseType,
        },
        false
      )
    )
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if (inCheckout) {
          dispatch(updateOrderSummaryWithResponse(res))
        } else {
          dispatch(updateBag(res.body))
        }

        dispatch(
          updateShoppingBagProduct(index, {
            editing: false,
            selectedQuantityWasCorrected: false,
          })
        )
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
        dispatch(ajaxCounter('decrement'))
      })
  }
}

export function delPromotionCode(data) {
  return (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const inCheckout = isInCheckout(getState())
    const responseType = inCheckout ? 'orderSummary' : 'basket'
    return dispatch(
      del('/shopping_bag/delPromotionCode', {
        ...data,
        responseType,
      })
    )
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if (inCheckout) {
          dispatch(updateOrderSummaryWithResponse(res))
        } else {
          dispatch(updateBag(res.body))
        }
      })
      .catch((error) => {
        dispatch(ajaxCounter('decrement'))
        if (error.response && error.response.body) {
          error.message = error.response.body.message
          dispatch(setGenericError(error))
        } else {
          dispatch(setApiError(error))
        }
      })
  }
}

export function changeDeliveryType(payload) {
  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(put('/shopping_bag/delivery', payload, false))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(updateBag(res.body))
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
      })
  }
}

const getBagAndRemoveTranferShoppingBagParams = (dispatch, getState) => {
  return dispatch(getBagRequest()).finally(() => {
    removeTransferShoppingBagParams(getState())
  })
}

export const initShoppingBag = function initShoppingBagThunk() {
  return function transferShoppingBagThunk(dispatch, getState) {
    const state = getState()
    const featureTransferBasketEnabled = isFeatureTransferBasketEnabled(state)
    const locationQuery = getLocationQuery(state)
    const transferStoreID = window.parseInt(locationQuery.transferStoreID)
    const transferOrderID = window.parseInt(locationQuery.transferOrderID)
    if (
      featureTransferBasketEnabled &&
      shouldTransferShoppingBag(transferStoreID, transferOrderID)
    ) {
      dispatch(
        post('/shopping_bag/transfer', { transferStoreID, transferOrderID })
      ).finally(() => {
        getBagAndRemoveTranferShoppingBagParams(dispatch, getState)
      })
    }
  }
}

export const resetShoppingBag = () => ({
  type: 'RESET_SHOPPING_BAG',
})

export const emptyShoppingBag = () => ({
  type: 'EMPTY_SHOPPING_BAG',
})
