import { all, isEmpty, map, pathOr, prop } from 'ramda'
import { requiresAuth } from '../auth/auth-handlers'
import { isAuth } from '../auth/auth-helpers'
import {
  isReturningCustomer,
  selectedDeliveryLocationTypeEquals,
} from '../../../../selectors/checkoutSelectors'
import {
  setDeliveryAsBillingFlag,
  setSavePaymentDetailsEnabled,
} from '../../../../actions/common/checkoutActions'
import { resetFormDirty } from '../../../../actions/common/formActions'
import { isFeatureSavePaymentDetailsEnabled } from '../../../../selectors/featureSelectors'
import { yourDetailsExist } from '../../../checkout-utilities/utils'
import { getShoppingBagTotalItems } from '../../../../selectors/shoppingBagSelectors'

export const isYourDetailsFormEmpty = (state) => {
  const yourDetailsFields = pathOr(
    {},
    ['forms', 'checkout', 'yourDetails', 'fields'],
    state
  )
  const yourDetailsValues = map(prop('value'), yourDetailsFields)
  return all(isEmpty, yourDetailsValues)
}

export const fillYourDetailsForm = (state, dispatch) => {
  const userNameAndPhone = pathOr(
    {},
    ['account', 'user', 'deliveryDetails', 'nameAndPhone'],
    state
  )
  dispatch(resetFormDirty('yourDetails', userNameAndPhone))
}

export const isYourAddressFormEmpty = (state) => {
  const yourAddressFields = pathOr(
    {},
    ['forms', 'checkout', 'yourAddress', 'fields'],
    state
  )
  const yourAddressValues = map(prop('value'), yourAddressFields)
  return all(isEmpty, yourAddressValues)
}

export const fillYourAddressForm = (state, dispatch) => {
  const userAddress = pathOr(
    {},
    ['account', 'user', 'deliveryDetails', 'address'],
    state
  )
  dispatch(resetFormDirty('yourAddress', userAddress))
}

export const redirectToDeliveryPayment = (state, dispatch, replace) => {
  if (selectedDeliveryLocationTypeEquals(state, 'HOME')) {
    dispatch(setDeliveryAsBillingFlag(true))
    if (isYourDetailsFormEmpty(state)) {
      fillYourDetailsForm(state, dispatch)
    }
    if (isYourAddressFormEmpty(state)) {
      fillYourAddressForm(state, dispatch)
    }
  }
  replace('/checkout/delivery-payment')
}

export const redirectToDelivery = (state, nextState, dispatch, replace) => {
  replace(`/checkout/delivery${pathOr('', ['location', 'search'], nextState)}`)
}

export const checkoutRedirect = (
  { getState, dispatch },
  nextState,
  replace
) => {
  const state = getState()

  switch (true) {
    case !isAuth(state):
      replace('/checkout/login')
      break
    case isReturningCustomer(state):
      redirectToDeliveryPayment(state, dispatch, replace)
      break
    default:
      redirectToDelivery(state, nextState, dispatch, replace)
  }
}

export const paymentRedirect = ({ getState }, nextState, replace) => {
  return process.browser
    ? requiresAuth({ getState }, nextState, replace)
    : replace('/checkout/delivery')
}

export const resetSavePaymentDetails = (state, dispatch) => {
  if (isFeatureSavePaymentDetailsEnabled(state)) {
    dispatch(setSavePaymentDetailsEnabled(true))
  }
}

export const onEnterPayment = (
  { getState, dispatch },
  nextState,
  replace,
  callback
) => {
  const state = getState()
  const totalItems = getShoppingBagTotalItems(state) || 0

  if (isAuth(state)) {
    if (totalItems < 1) {
      // If a user is authenticate and does not have items in the shoppingBag
      // then redirect the user to the homePage.
      // This scenario are users who bookmark the checkout page or press the back
      // button when completing an order.
      replace('/')
    } else if (yourDetailsExist(state) || isReturningCustomer(state)) {
      resetSavePaymentDetails(state, dispatch)
    } else {
      replace('/checkout/delivery')
    }
  } else {
    replace('/checkout/login')
  }
  callback()
}

export const onEnterDelivery = ({ getState }, nextState, replace, callback) => {
  const state = getState()
  const totalItems = getShoppingBagTotalItems(state) || 0
  const isAuthenticated = isAuth(state)
  const noItems = totalItems < 1

  if (!isAuthenticated) {
    replace('/checkout/login')
  } else if (isAuthenticated && noItems) {
    replace('/')
  } else if (isAuthenticated && !noItems && isReturningCustomer(state)) {
    replace('/checkout/delivery-payment')
  }

  callback()
}

export const redirectOnSSR = (nextState, replace) => {
  if (!process.browser) {
    replace('/')
  }
}
