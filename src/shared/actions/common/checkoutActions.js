import { compose, head, isEmpty, path, pathOr, pluck } from 'ramda'
import { browserHistory } from 'react-router'
import { getYourDetailsSchema } from '../../components/containers/CheckoutV2/shared/validationSchemas'
import { getYourAddressSchema } from '../../schemas/validation/addressFormValidationSchema'
import { getPostCodeRules } from '../../selectors/common/configSelectors'
import { getAccount } from './accountActions'
import * as paymentTypes from '../../constants/paymentTypes'
import {
  setFormMessage,
  setFormMeta,
  resetForm,
  resetFormDirty,
  touchedMultipleFormFields,
  validateForm,
} from './formActions'
import { setGenericError, setApiError } from './errorMessageActions'
import { updateMenuForAuthenticatedUser } from './navigationActions'
import {
  updateBag,
  addStoredPromoCode,
  openMiniBag,
} from './shoppingBagActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { applyCheckoutFilters } from '../components/StoreLocatorActions'
import { setSelectedBrandFulfilmentStore } from './selectedBrandFulfilmentStoreActions'
import {
  sendAnalyticsErrorMessage,
  sendAnalyticsDeliveryOptionChangeEvent,
  sendAnalyticsDeliveryMethodChangeEvent,
  ANALYTICS_ERROR,
} from '../../analytics'
import { get, put, post, del } from '../../lib/api-service'
import {
  fixOrderSummary,
  removeCFSIFromOrderSummary,
  isErroredStore,
} from '../../lib/checkout-utilities/order-summary'
import { findSelected } from '../../lib/checkout-utilities/delivery-options-utils'
import { localise } from '../../lib/localisation'
import { joinQuery } from '../../lib/query-helper'
import { setStoreCookie } from '../../../client/lib/cookie'
import {
  getDefaultAddress,
  getDefaultNameAndPhone,
  getDefaultPaymentOptions,
  isUserCreditCard,
} from '../../lib/checkout-utilities/actions-helpers'
import {
  getCheckoutOrderSummary,
  getErrors,
  getSelectedDeliveryMethod,
  getSelectedDeliveryMethodLabel,
  selectedDeliveryLocationTypeEquals,
  isReturningCustomer,
  isStoreOrParcelDelivery,
  shouldUpdateOrderSummaryStore,
  getSelectedDeliveryType,
  getShipModeId,
  getCountryFor,
  getDeliveryStoreForOrderUpdate,
  isGuestOrder,
  getCheckoutOrderError,
} from '../../selectors/checkoutSelectors'
import { getShoppingBagOrderId } from '../../selectors/shoppingBagSelectors'
import { isUserAuthenticated } from '../../selectors/userAuthSelectors'
import { isFeatureCFSIEnabled } from '../../selectors/featureSelectors'
import { scrollToFormField } from '../../lib/scroll-helper'
import { getSelectedBrandFulfilmentStore } from '../../reducers/common/selectedBrandFulfilmentStore'
import { setOrderSummaryEspots } from './espotActions'
import { isMobile } from '../../selectors/viewportSelectors'
import { isInCheckout, getRoutePath } from '../../selectors/routingSelectors'
import { showErrorModal } from './modalActions'
import {
  restrictedAction,
  isRestrictedActionResponse,
} from '../../lib/restricted-actions'

export function updateOrderSummaryProduct(index, update) {
  return (dispatch, getState) => {
    if (
      getState().checkout.orderSummary.basket &&
      getState().checkout.orderSummary.basket.products
    ) {
      dispatch({
        type: 'UPDATE_ORDER_SUMMARY_PRODUCT',
        index,
        update,
      })
    }
  }
}

export function setStoreWithParcel(val) {
  return {
    type: 'SET_STORE_WITH_PARCEL',
    storeWithParcel: val,
  }
}

export function clearCheckoutForms() {
  return {
    type: 'CLEAR_CHECKOUT_FORMS',
  }
}

export function toggleExpressDeliveryOptions(bool) {
  return {
    type: 'TOGGLE_EXPRESS_DELIVERY_OPTIONS_SUMMARY_PAGE',
    bool,
  }
}

export function setStoreUpdating(updating) {
  return {
    type: 'SET_STORE_UPDATING',
    updating,
  }
}

export function setDeliveryStore(store) {
  return {
    type: 'SET_DELIVERY_STORE',
    store: {
      deliveryStoreCode: path(['storeId'], store),
      storeAddress1: path(['address', 'line1'], store),
      storeAddress2: path(['address', 'line2'], store),
      storeCity: path(['address', 'city'], store),
      storePostcode: path(['address', 'postcode'], store),
      storeCountry: path(['address', 'country'], store),
    },
  }
}

export function resetStoreDetails() {
  return {
    type: 'RESET_STORE_DETAILS',
  }
}

function setFilters() {
  return function setFiltersThunk(dispatch, getState) {
    const { deliveryLocations } = getState().checkout.orderSummary
    if (deliveryLocations) {
      const selectedDeliveryLocation = findSelected(deliveryLocations) || {}
      const filters =
        selectedDeliveryLocation.deliveryLocationType === 'STORE'
          ? ['brand', 'other']
          : ['parcel']
      dispatch(applyCheckoutFilters(filters))
    }
  }
}

export function updateCheckoutBag(data) {
  return {
    type: 'UPDATE_ORDER_SUMMARY_BASKET',
    data,
  }
}

export const getCheckoutBag = () => {
  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(get('/shopping_bag/get_items'))
      .then(({ body }) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(updateBag(body))
        return dispatch(updateCheckoutBag(body))
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

/*
   * setOrderSummary is used for multi-tab sync,
   * therefore it needs persist flag (default true)
   * persist=true => allow window and tab sync
   * persinst=false => dont allow tab and window sync
*/
export function setOrderSummary(orderSummary, persist = true) {
  return function setOrderSummaryThunk(dispatch, getState) {
    // @TODO to be refactored with a getOrderSummary selector that filters out
    // deliveryMethods if FEATURE_CFSI is disabled
    let hackedOrderSummary = orderSummary
    if (!isFeatureCFSIEnabled(getState()))
      hackedOrderSummary = removeCFSIFromOrderSummary(hackedOrderSummary)
    dispatch({
      type: 'FETCH_ORDER_SUMMARY_SUCCESS',
      data: hackedOrderSummary,
      persist,
    })
    dispatch(setFilters())
    return dispatch(setOrderSummaryEspots(orderSummary))
  }
}

export function clearOrderSummaryBasket() {
  return {
    type: 'FETCH_ORDER_SUMMARY_SUCCESS',
    data: {},
    persist: false,
  }
}

export function setOrderSummaryField(field, value) {
  return {
    type: 'SET_ORDER_SUMMARY_FIELD',
    field,
    value,
  }
}

export function setOrderSummaryError(data) {
  return {
    type: 'SET_ORDER_SUMMARY_ERROR',
    data,
  }
}

export function clearOutOfStockError() {
  return {
    type: 'CLEAR_ORDER_SUMMARY_OUT_OF_STOCK',
  }
}

export function setOrderSummaryOutOfStock() {
  return {
    type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK',
  }
}

// @NOTE setSameDeliveryAsBillingFlag is meant to replace setDeliveryAddressToBillingBool
export function setDeliveryAsBillingFlag(val) {
  return {
    type: 'SET_DELIVERY_AS_BILLING_FLAG',
    val,
  }
}

export function resetAddress() {
  return {
    type: 'RESET_SEARCH',
  }
}

export function setManualAddressMode() {
  return {
    type: 'SET_ADDRESS_MODE_TO_MANUAL',
  }
}

export function emptyOrderSummary() {
  return {
    type: 'EMPTY_ORDER_SUMMARY',
  }
}

export function setFindAddressMode() {
  return {
    type: 'SET_ADDRESS_MODE_TO_FIND',
  }
}

export function setMonikerAddress(data) {
  return {
    type: 'UPDATE_MONIKER',
    data,
  }
}

/**
 * resets the Billing form either to the delivery details or the default values
 * @deprecated Use setDeliveryAsBilling
 */
export function setDeliveryAddressToBilling(useDeliveryFormData) {
  return (dispatch, getState) => {
    const {
      checkout: { orderSummary },
      forms: {
        checkout: { yourDetails, yourAddress },
      },
    } = getState()
    const defaultAddress = {
      ...getDefaultAddress(),
      country: orderSummary.shippingCountry,
    }
    const formDeliveryDetails = yourDetails.fields
    const formDeliveryAddress = yourAddress.fields
    dispatch(
      resetFormDirty(
        'billingDetails',
        useDeliveryFormData
          ? pluck('value', formDeliveryDetails)
          : getDefaultNameAndPhone()
      )
    )
    if (!orderSummary.storeDetails) {
      dispatch(
        resetFormDirty(
          'billingAddress',
          useDeliveryFormData
            ? pluck('value', formDeliveryAddress)
            : defaultAddress
        )
      )
    }
  }
}

export const copyDeliveryValuesToBillingForms = () => {
  return (dispatch, getState) => {
    const state = getState()
    const homeDeliverySelected = selectedDeliveryLocationTypeEquals(
      state,
      'HOME'
    )

    // billingDetails
    const {
      forms: {
        checkout: { yourDetails, yourAddress },
      },
    } = state
    const details = pluck('value', yourDetails.fields)
    dispatch(resetFormDirty('billingDetails', details))
    if (homeDeliverySelected) {
      // billingAddress
      const address = pluck('value', yourAddress.fields)
      dispatch(resetFormDirty('billingAddress', address))
      // address mode
      dispatch(setManualAddressMode())
    }
  }
}

export const resetBillingForms = () => {
  return (dispatch, getState) => {
    const state = getState()

    // billingDetails
    const defaultDetails = getDefaultNameAndPhone()
    dispatch(resetForm('billingDetails', defaultDetails))
    // billingAddress
    const {
      checkout: { orderSummary },
    } = state
    const defaultAddress = {
      ...getDefaultAddress(),
      country: orderSummary.shippingCountry,
    }
    dispatch(resetForm('billingAddress', defaultAddress))
  }
}

// @NOTE setDeliveryAsBilling is meant to replace setDeliveryAddressToBilling
export function setDeliveryAsBilling(useDeliveryAsBilling = true) {
  return (dispatch, getState) => {
    const state = getState()
    const {
      checkout: { orderSummary },
      forms: {
        checkout: { yourDetails, yourAddress },
      },
    } = state
    const homeDeliverySelected = selectedDeliveryLocationTypeEquals(
      state,
      'HOME'
    )

    if (useDeliveryAsBilling) {
      // billingDetails
      const formDeliveryDetails = pluck('value', yourDetails.fields)
      dispatch(resetFormDirty('billingDetails', formDeliveryDetails))
      if (homeDeliverySelected) {
        // billingAddress
        const formDeliveryAddress = pluck('value', yourAddress.fields)
        dispatch(resetFormDirty('billingAddress', formDeliveryAddress))
        // address mode
        dispatch(setManualAddressMode())
      }
    } else {
      // billingDetails
      const defaultDetails = getDefaultNameAndPhone()
      dispatch(resetForm('billingDetails', defaultDetails))
      // billingAddress
      const defaultAddress = {
        ...getDefaultAddress(),
        country: orderSummary.shippingCountry,
      }
      dispatch(resetForm('billingAddress', defaultAddress))
    }
  }
}

const guestUserResetForm = ({
  deliveryNameAndPhone,
  deliveryAddress,
  billingNameAndPhone,
  billingAddress,
}) => (dispatch, getState) => {
  const state = getState()
  const orderSummary = pathOr({}, ['checkout', 'orderSummary'], state)

  const guestUserEmail = path(['email'], orderSummary) || ''
  const country = getCountryFor('billingCheckout', state)
  const postCodeRules = getPostCodeRules(state, country)
  const billingAddressSchema = getYourAddressSchema(postCodeRules, country)

  // resetDirty delivery address
  dispatch(resetFormDirty('yourDetails', deliveryNameAndPhone))
  dispatch(resetFormDirty('yourAddress', deliveryAddress))

  // resetDirty billing address
  dispatch(resetFormDirty('billingDetails', billingNameAndPhone))
  dispatch(resetFormDirty('billingAddress', billingAddress))
  dispatch(validateForm('billingDetails', getYourDetailsSchema(country)))
  dispatch(validateForm('billingAddress', billingAddressSchema))

  // resetDirty guest user email
  dispatch(
    resetFormDirty('guestUser', { email: guestUserEmail, signUpGuest: '' })
  )
}

export function resetCheckoutForms(orderSummary) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({ type: 'RESET_CHECKOUT_FORMS' })
    const deliveryTelephone =
      path(
        ['account', 'user', 'deliveryDetails', 'nameAndPhone', 'telephone'],
        state
      ) || null
    const billingTelephone =
      path(
        ['account', 'user', 'billingDetails', 'nameAndPhone', 'telephone'],
        state
      ) || null
    const { siteOptions } = state
    const { shippingCountry } = orderSummary
    const defaultState =
      shippingCountry === 'United States' ? siteOptions.USStates[0] : null
    const defaultAddress = {
      ...getDefaultAddress(),
      country: orderSummary.shippingCountry,
      state: defaultState,
    }
    const deliveryAddress =
      path(['deliveryDetails', 'address'], orderSummary) || defaultAddress
    dispatch(resetForm('yourAddress', { ...deliveryAddress, county: null }))

    const deliveryNameAndPhone =
      path(['deliveryDetails', 'nameAndPhone'], orderSummary) ||
      getDefaultNameAndPhone()
    dispatch(
      resetForm('yourDetails', {
        ...deliveryNameAndPhone,
        telephone: deliveryTelephone,
      })
    )

    // PFS + PPal or MPass:
    // User cancel the payment and returns to the site
    // Clicks on Go To Checkout
    // @TODO REFACTOR
    const billingAddress =
      path(['billingDetails', 'address'], orderSummary) || defaultAddress
    dispatch(resetForm('billingAddress', { ...billingAddress, county: null }))
    dispatch(setFindAddressMode())
    const billingNameAndPhone =
      path(['billingDetails', 'nameAndPhone'], orderSummary) ||
      getDefaultNameAndPhone()
    dispatch(
      resetForm('billingDetails', {
        ...billingNameAndPhone,
        telephone: billingTelephone,
      })
    )

    // This is needed to re-build the payload for the guest checkout after the order fails for paypal
    // After hydrating the forms we need to set the fields to dirty. This forces monty
    // to rebuild the payload for the createOrder() in submitOrder() from orderActions
    if (isGuestOrder(state) && getCheckoutOrderError(state)) {
      dispatch(
        guestUserResetForm({
          deliveryNameAndPhone,
          deliveryAddress,
          billingNameAndPhone,
          billingAddress,
        })
      )
    }

    // Note:
    // At this stage we validate the delivery form before resetting it which is needed for certain scenarios,
    // this results in the fields being filled and the validation errors being displayed, the user cannot proceed as the form is not valid.
    // I have added an extra validation after the reset.
    const country = getCountryFor('delivery', state)
    dispatch(validateForm('yourDetails', getYourDetailsSchema(country)))

    // Payment details
    const {
      account: { user },
    } = state
    let userCardDetails = null

    const defaultPaymentOptions = getDefaultPaymentOptions()

    // scrAPI Paypal users come back with broken card details so we set them to be valid.
    if (isUserCreditCard(user)) {
      const { type } = user.creditCard
      userCardDetails = {
        ...defaultPaymentOptions,
        paymentType: type,
        expiryMonth: defaultPaymentOptions.expiryMonth,
        expiryYear: defaultPaymentOptions.expiryYear,
      }
    }

    if (
      !userCardDetails ||
      userCardDetails.paymentType !== paymentTypes.APPLEPAY
    ) {
      dispatch(
        resetForm(
          'billingCardDetails',
          userCardDetails || defaultPaymentOptions
        )
      )
    }
  }
}

export const setShowCollectFromStoreModal = (show) => ({
  type: 'SHOW_COLLECT_FROM_STORE_MODAL',
  show,
})

export function putOrderSummary(payload, showError = true) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    dispatch(ajaxCounter('increment'))
    dispatch(setOrderSummaryError({}))

    return dispatch(put('/checkout/order_summary', payload))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if (res.body.message) {
          dispatch(setOrderSummaryError(res.body))
        } else if (res.body.isBasketResponse) {
          dispatch(updateBag(res.body))
          dispatch(updateCheckoutBag(res.body))
          if (isMobile(getState())) {
            dispatch(openMiniBag())
          }
        } else {
          const { account, siteOptions, config } = getState()
          // WARNING: scrAPI FIX HERE.... fixOrderSummary will 'fix' the malformed address data from scrAPI
          const fixedOrderSummary = fixOrderSummary(
            res.body,
            account.user,
            siteOptions.billingCountries,
            config
          )
          dispatch(updateBag(res.body.basket))
          dispatch(setOrderSummary(fixedOrderSummary))
        }
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        if (isRestrictedActionResponse(err.response)) {
          throw err
        }

        let message =
          err.response && err.response.body
            ? err.response.body.message
            : l`An error has occurred. Please try again.`
        const wcsErrorCode = path(['response', 'body', 'wcsErrorCode'], err)
        const erroredStore = isErroredStore(wcsErrorCode)
        if (erroredStore) {
          message = l`Unfortunately this delivery option is no longer available for this store. Please choose another option or select an alternative store`
          dispatch(setDeliveryStore({}))
        }
        if (showError) {
          dispatch(showErrorModal(message))
        } else if (erroredStore) {
          // because there was an error in selecting a store, open the modal again
          dispatch(setShowCollectFromStoreModal(true))
        }
      })
  }
}

export function updateDeliveryOptions(showError = true) {
  return function updateDeliveryOptionsThunk(dispatch, getState) {
    const state = getState()
    const { checkout } = state
    const deliveryStore = getDeliveryStoreForOrderUpdate(state)

    if (isStoreOrParcelDelivery(state) && !deliveryStore) {
      // user has to select a store first
      if (!isMobile(state)) {
        dispatch(setShowCollectFromStoreModal(true))
      }
      return Promise.resolve()
    }

    return dispatch(
      putOrderSummary(
        {
          orderId: checkout.orderSummary.basket.orderId,
          deliveryType: getSelectedDeliveryType(state),
          shippingCountry: deliveryStore
            ? deliveryStore.storeCountry
            : checkout.orderSummary.shippingCountry,
          shipModeId: getShipModeId(state),
          ...deliveryStore,
        },
        showError
      )
    )
  }
}

export function selectDeliveryStoreAction(deliveryStore, showError = true) {
  return function selectDeliveryStoreThunk(dispatch, getState) {
    const state = getState()
    const isAnonymous = path(
      ['routing', 'location', 'query', 'isAnonymous'],
      state
    )
    const isBrandStore =
      path(['storeId'], deliveryStore) && !deliveryStore.storeId.startsWith('S')
    dispatch(setDeliveryStore(deliveryStore))
    dispatch(setStoreUpdating(false))
    // @NOTE only if it is Collect From Store
    if (isBrandStore) {
      setStoreCookie(deliveryStore)
      dispatch(setSelectedBrandFulfilmentStore(deliveryStore))
    }

    return dispatch(updateDeliveryOptions(showError)).then(() => {
      const deliveryPath = isGuestOrder(state)
        ? '/guest/checkout/delivery'
        : '/checkout/delivery'
      const pathname = isReturningCustomer(state)
        ? '/checkout/delivery-payment'
        : deliveryPath
      if (getState().routing.location.pathname !== pathname) {
        browserHistory.push({
          pathname,
          query: {
            isAnonymous,
          },
        })
      }
    })
  }
}

export const selectDeliveryStore = restrictedAction(
  selectDeliveryStoreAction,
  'selectDeliveryStore'
)

export function selectDeliveryLocationAction({ deliveryLocationType }) {
  return async (dispatch, getState) => {
    const state = getState()
    const orderSummary = getCheckoutOrderSummary(state)
    const selectedBrandFulfilmentStore = getSelectedBrandFulfilmentStore(state)
    const isCollectFromStore = deliveryLocationType === 'STORE'

    dispatch(setStoreUpdating(true))

    await dispatch(
      setOrderSummary({
        ...orderSummary,
        deliveryLocations: orderSummary.deliveryLocations.map((location) => ({
          ...location,
          selected: location.deliveryLocationType === deliveryLocationType,
        })),
      })
    )

    // @NOTE We need to wipe out the store details so that the user will be forced to reselect a store
    // in the event that the api call to actually select the store failed for some reason
    dispatch(resetStoreDetails())

    if (
      isCollectFromStore &&
      isFeatureCFSIEnabled(state) &&
      !isEmpty(selectedBrandFulfilmentStore)
    ) {
      await dispatch(
        selectDeliveryStoreAction(selectedBrandFulfilmentStore, false)
      )
    } else {
      await dispatch(updateDeliveryOptions())
    }

    dispatch(sendAnalyticsDeliveryOptionChangeEvent(deliveryLocationType))
  }
}

export const selectDeliveryLocation = restrictedAction(
  selectDeliveryLocationAction,
  'selectDeliveryLocation'
)

export function selectDeliveryTypeAction(index) {
  return async (dispatch, getState) => {
    const { orderSummary } = getState().checkout
    await dispatch(
      setOrderSummary({
        ...orderSummary,
        deliveryLocations: orderSummary.deliveryLocations.map((location) => {
          return location.selected
            ? {
                ...location,
                deliveryMethods: location.deliveryMethods.map(
                  (method, currentIndex) => ({
                    ...method,
                    selected: index === currentIndex,
                  })
                ),
              }
            : location
        }),
      })
    )
    await dispatch(updateDeliveryOptions())

    dispatch(
      sendAnalyticsDeliveryMethodChangeEvent(
        getSelectedDeliveryMethodLabel(getState())
      )
    )
  }
}

export const selectDeliveryType = restrictedAction(
  selectDeliveryTypeAction,
  'selectDeliveryType'
)

function selectDeliveryOptionAction(deliveryType, shipModeId) {
  return (dispatch, getState) => {
    const { basket, shippingCountry } = getState().checkout.orderSummary
    const payload = {
      orderId: basket.orderId,
      shippingCountry,
      deliveryType,
      shipModeId,
    }
    return dispatch(putOrderSummary(payload))
  }
}

export const selectDeliveryOption = restrictedAction(
  selectDeliveryOptionAction,
  'selectDeliveryOption'
)

export function forceDeliveryMethodSelection() {
  return (dispatch, getState) => {
    dispatch({ type: 'FORCE_DELIVERY_METHOD_SELECTION' })
    const state = getState()
    const selectedDeliveryMethod = getSelectedDeliveryMethod(state)
    if (!selectedDeliveryMethod || shouldUpdateOrderSummaryStore(state)) {
      return dispatch(updateDeliveryOptions())
    }
  }
}

/*
  updateOrderSummaryWithResponse for tab sync has to call with
  comesFrom event flag withch is false if comes from getOrderSummaryRequest()
*/

export function updateOrderSummaryWithResponse(
  res,
  shouldUpdateForms,
  shouldUpdateBag,
  shouldSync
) {
  return (dispatch, getState) => {
    if (res.body.message) {
      dispatch(setOrderSummaryError(res.body))
    } else if (res.body.isBasketResponse) {
      if (process.browser) {
        browserHistory.goBack()
        setTimeout(() => {
          dispatch(setOrderSummaryOutOfStock())
          dispatch(updateBag(res.body, false))
        }, 1000)
      } else {
        dispatch(setOrderSummaryOutOfStock())
        dispatch(updateBag(res.body, false))
      }
    } else {
      const { account, siteOptions, config } = getState()
      // WARNING: scrAPI FIX HERE.... fixOrderSummary will 'fix' the malformed address data from scrAPI

      const isGuestOrder = pathOr(false, ['body', 'isGuestOrder'], res)
      const fixedOrderSummary = isGuestOrder
        ? res.body
        : fixOrderSummary(
            res.body,
            account.user,
            siteOptions.billingCountries,
            config
          )

      dispatch(addStoredPromoCode()) // It is still possible to have a stored promo code when on checkout.
      dispatch(setOrderSummary(fixedOrderSummary, shouldSync))
      if (shouldUpdateForms) {
        dispatch(resetCheckoutForms(fixedOrderSummary))
      }
      if (shouldUpdateBag) {
        dispatch(updateBag(fixedOrderSummary.basket, false))
      }
      // scrAPI eu returns no selected delivery method
      dispatch(forceDeliveryMethodSelection())
    }
  }
}

export function getOrderSummaryRequest({
  shouldUpdateBag = true,
  shouldUpdateForms = true,
  shouldSync = true,
  clearGuestDetails = false,
} = {}) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const isInGuestDelivery =
      getRoutePath(getState()) === '/guest/checkout/delivery'
    dispatch(ajaxCounter('increment'))
    dispatch(setOrderSummaryError({}))

    const orderId = getShoppingBagOrderId(getState())
    const queryParams = `${
      clearGuestDetails || isInGuestDelivery ? '?guestUser=true' : ''
    }`

    const url = `/checkout/order_summary${
      orderId ? `/${orderId}` : ''
    }${queryParams}`

    return dispatch(get(url))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(
          updateOrderSummaryWithResponse(
            res,
            shouldUpdateForms,
            shouldUpdateBag,
            shouldSync
          )
        )
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        const message =
          err.response && err.response.status === 404
            ? l`We're sorry, an error has occurred. We're working to fix it as soon as possible.`
            : pathOr(
                l`An error has occurred. Please try again.`,
                ['response', 'body', 'message'],
                err
              )

        dispatch(setOrderSummary({}))
        dispatch(setOrderSummaryError({ message }))
      })
  }
}

export function getAccountAndOrderSummary() {
  return (dispatch, getState) => {
    return isUserAuthenticated(getState())
      ? dispatch(getAccount()).then(() => dispatch(getOrderSummaryRequest()))
      : dispatch(getOrderSummaryRequest())
  }
}

export function getOrderSummary(args) {
  return getOrderSummaryRequest(args)
}

export function selectDeliveryCountry(country) {
  return (dispatch, getState) => {
    dispatch(
      setOrderSummary({
        ...getState().checkout.orderSummary,
        shippingCountry: country,
      })
    )
    dispatch(updateDeliveryOptions())
  }
}

export function getAddressByMoniker({ moniker, country }, formName) {
  const name = formName
  return function getAddressByMonikerThunk(dispatch, getState) {
    const encodedMoniker = encodeURIComponent(moniker)

    dispatch(ajaxCounter('increment'))
    return dispatch(get(`/address/${encodedMoniker}?country=${country}`)).then(
      ({ body }) => {
        const isCheckout = isInCheckout(getState())
        dispatch(ajaxCounter('decrement'))
        dispatch(resetForm(name, body))
        dispatch(setManualAddressMode())
        if (isCheckout) {
          const {
            checkout: { orderSummary },
          } = getState()
          dispatch(setOrderSummary({ ...orderSummary, deliveryDetails: body }))
        }
      },
      (err) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(setFormMessage(name, err.response.body.message))
      }
    )
  }
}

export function findAddress(data, yourAddressFormName, findAddressFormName) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const error = l`We are unable to find your address at the moment. Please enter your address manually.`
    dispatch(ajaxCounter('increment'))
    dispatch(setFormMessage(findAddressFormName, ''))
    return dispatch(get(`/address${joinQuery(data)}`))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(setMonikerAddress(res.body))
        if (res.body.length === 1) {
          const moniker = res.body[0].moniker
          dispatch(
            getAddressByMoniker(
              {
                country: data.country,
                moniker,
              },
              yourAddressFormName
            )
          )
        } else if (!res.body.length) {
          dispatch(setFormMessage(findAddressFormName, error))
        }
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        const statusCode = err && err.response && err.response.statusCode
        if (statusCode === 503 || statusCode === 422) {
          // 503 the server for the address look up is unavailable (timeout)
          // 422 is the response from wcs if the address could not be found
          dispatch(setFormMessage(findAddressFormName, error))
        } else {
          dispatch(
            setFormMessage(
              findAddressFormName,
              (err.response.body && err.response.body.message) || error
            )
          )
        }
      })
  }
}

export function showGiftCardBanner(message) {
  return (dispatch) => {
    return dispatch(setFormMeta('giftCard', 'banner', message))
  }
}

export function hideGiftCardBanner() {
  return (dispatch) => {
    return dispatch(setFormMeta('giftCard', 'banner', false))
  }
}

export function addGiftCard(data) {
  return (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    return dispatch(post('/checkout/gift-card', data, true))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(
          showGiftCardBanner(l`Thank you, your gift card has been added.`)
        )
        dispatch(setFormMessage('giftCard', { message: null, type: 'error' }))
        dispatch(setOrderSummary(res.body))
        dispatch(resetForm('giftCard', { giftCardNumber: '', pin: '' }))
      })
      .catch((err) => {
        const message =
          (err.response && err.response.body && l(err.response.body.message)) ||
          l`An error has occurred. Please try again.`
        dispatch(ajaxCounter('decrement'))
        dispatch(setFormMessage('giftCard', { message, type: 'error' }))
        dispatch(sendAnalyticsErrorMessage(ANALYTICS_ERROR.GIFT_CARD_ERROR))
      })
  }
}

export function removeGiftCard(giftCardId) {
  return (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    return dispatch(del(`/checkout/gift-card?giftCardId=${giftCardId}`))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(hideGiftCardBanner())
        dispatch(setOrderSummary(res.body))
      })
      .catch((err) => {
        const message =
          (err.response && err.response.body && l(err.response.body.message)) ||
          l`An error has occurred. Please try again.`
        dispatch(ajaxCounter('decrement'))
        dispatch(setFormMessage('giftCard', { message, type: 'error' }))
      })
  }
}

export const syncClientForEmailExists = (email) => (dispatch) => {
  dispatch(ajaxCounter('increment'))
  return dispatch(get(`/account?email=${email}`))
    .then((resp) => {
      dispatch(ajaxCounter('decrement'))
      if (resp.body.exists) {
        dispatch(updateMenuForAuthenticatedUser())
        return dispatch(getAccount())
      }
    })
    .catch(() => {
      dispatch(ajaxCounter('decrement'))
    })
}

export function setDeliveryEditingEnabled(enabled) {
  return {
    type: 'DELIVERY_AND_PAYMENT_SET_DELIVERY_EDITING_ENABLED',
    enabled,
  }
}

export const validateForms = (
  formNames,
  { onValid = () => {}, onInvalid = () => {} } = {}
) => {
  return (dispatch, getState) => {
    const errors = getErrors(formNames, getState())
    if (isEmpty(errors)) {
      onValid()
    } else {
      Object.keys(errors).forEach((formName) => {
        dispatch(
          touchedMultipleFormFields(formName, Object.keys(errors[formName]))
        )
      })
      // get the first error (using the formNames ordering)
      const firstErroringForm = formNames.find((formName) => formName in errors)
      const erroringField = compose(
        head,
        Object.keys
      )(errors[firstErroringForm])
      scrollToFormField(erroringField)
      onInvalid(errors)
    }
  }
}

export const setSavePaymentDetailsEnabled = function setSavePaymentDetailsEnabled(
  enabled
) {
  return {
    type: 'SET_SAVE_PAYMENT_DETAILS_ENABLED',
    enabled,
  }
}

export function saveSelectedPaymentMethod(selectedPaymentMethod) {
  return {
    type: 'SAVE_SELECTED_PAYMENT_METHOD',
    selectedPaymentMethod,
  }
}

export function openPaymentMethods() {
  return {
    type: 'OPEN_PAYMENT_METHODS',
  }
}

export function closePaymentMethods() {
  return {
    type: 'CLOSE_PAYMENT_METHODS',
  }
}

export function setRecaptchaToken(recaptchaToken) {
  return {
    type: 'SET_RECAPTCHA_TOKEN',
    recaptchaToken,
  }
}
