// TODO: Move this file to ../ (main selectors folder) https://arcadiagroup.atlassian.net/browse/PTM-575

import {
  all,
  defaultTo,
  either,
  find,
  isEmpty,
  isNil,
  map,
  merge,
  mergeAll,
  not,
  path,
  pathOr,
  pick,
  pipe,
  pluck,
  propEq,
  values,
} from 'ramda'

// selectors
import { getFormNames, getAddressForm } from '../formsSelectors'
import { createSelector } from 'reselect'
import crypto from 'crypto'

// data

// Account
export const getExponeaLink = (state) => {
  return pathOr('', ['account', 'exponeaLink'], state)
}

export const isResetPasswordLinkValid = (state) =>
  path(['account', 'resetPasswordLinkIsValid'], state)

// Account => My Checkout Details
export const getMyCheckoutDetailsEditingEnabled = (state) => {
  return pathOr(
    false,
    ['account', 'myCheckoutDetails', 'editingEnabled'],
    state
  )
}

// Account => User
export const getUser = (state) => {
  return pathOr({}, ['account', 'user'], state)
}

export const isLoggedIn = (state) => {
  const { exists } = getUser(state)

  return exists || false
}

export const getUserEmail = (state) => {
  const { email } = getUser(state)

  return email || null
}

export const getHashedUserEmail = (state) => {
  const email = getUserEmail(state)
  return email
    ? crypto
        .createHash('sha256')
        .update(email)
        .digest('hex')
    : null
}

export const getUserTrackingId = createSelector(
  getUser,
  (user) => user.userTrackingId
)

export const getExponeaMemberId = (state) => {
  return pathOr('', ['account', 'user', 'expId2'], state)
}

// Account => User => Billing details

export const getUserAddress = (state, type) => {
  const accountUser = getUser(state)

  return pathOr({}, [type, 'address'], accountUser)
}

export const getUserDetails = (state, type) => {
  const accountUser = getUser(state)

  return pathOr({}, [type, 'nameAndPhone'], accountUser)
}

export const getUserCountry = (state, type) => {
  const accountUser = getUser(state)

  return pathOr('United Kingdom', [type, 'address', 'country'], accountUser)
}

export const selectBillingCountry = (state) => {
  return (
    path(
      ['forms', 'checkout', 'billingAddress', 'fields', 'country', 'value'],
      state
    ) ||
    path(['account', 'user', 'billingDetails', 'address', 'country'], state) ||
    path(['config', 'country'], state)
  )
}

// Account =>  User => Delivery details
export const getDeliveryDetails = (state) => {
  const { deliveryDetails } = getUser(state)

  return deliveryDetails || {}
}

export const selectDeliveryCountry = (state) =>
  path(
    ['checkout', 'orderSummary', 'deliveryDetails', 'address', 'country'],
    state
  ) ||
  path(
    ['forms', 'checkout', 'yourAddress', 'fields', 'country', 'value'],
    state
  ) ||
  path(['account', 'user', 'deliveryDetails', 'address', 'country'], state) ||
  path(['config', 'country'], state)

export const getOrderDetailsDeliveryPostCode = (state) => {
  // Only for UK Address
  return pathOr('', ['address4'], state)
}

export const getOrderDetailsDeliveryCountry = (state) => {
  return pathOr('', ['country'], state)
}

export const getValidUKOrdersCountries = (deliveryAddress = {}) => {
  const userCountry = pathOr('', ['country'], deliveryAddress)
  const countriesAllowed = ['United Kingdom', 'Jersey', 'Guernsey']

  return countriesAllowed.includes(userCountry)
}

// Account => User => Credit card
export const getCreditCardType = (state) => {
  const accountUser = getUser(state)

  return pathOr('', ['creditCard', 'type'], accountUser)
}

export const selectStoredPaymentDetails = (state) => {
  const accountUser = getUser(state)

  return pathOr({}, ['creditCard'], accountUser)
}

export const isKlarnaDefaultPaymentType = (state) => {
  return getCreditCardType(state) === 'KLRNA'
}

const paymentMethodsSelector = (state) => state.paymentMethods

export const checkPaymentMethodExistsOrDefault = createSelector(
  [paymentMethodsSelector, (state, type) => type],
  (paymentMethods, type) => {
    const defaultPaymentMethod = 'CARD'
    if (!paymentMethods) {
      return defaultPaymentMethod
    }

    if (Array.isArray(paymentMethods)) {
      const contains = paymentMethods.some((payment) => payment.value === type)

      return contains ? type : defaultPaymentMethod
    }

    return defaultPaymentMethod
  }
)

export const getPaymentCardDetailsMCD = path([
  'forms',
  'account',
  'myCheckoutDetails',
  'paymentCardDetailsMCD',
])

export const getMyCheckoutDetailForm = (state) => {
  return pathOr(
    null,
    ['forms', 'account', 'myCheckoutDetails', 'myCheckoutDetailsForm'],
    state
  )
}

export const getMCDPaymentMethodForm = (state) => {
  /* @todo get the right form names when v2 checkout component more generic
    return pathOr({}, ['forms', 'account', 'myCheckoutDetails', formNames.payment.paymentCardDetails], state) */
  const formName = getFormNames('payment').paymentCardDetailsMCD
  return pathOr({}, ['forms', 'account', 'myCheckoutDetails', formName], state)
}

export const getSelectedPaymentMethodValue = (state) => {
  const cardForm = getMCDPaymentMethodForm(state)
  return pathOr(undefined, ['fields', 'paymentType', 'value'], cardForm)
}

const isCardPayment = (value, state) => {
  const paymentMethods = state.paymentMethods || []

  return !!paymentMethods.find((paymentMethod) => {
    return paymentMethod.value === value && paymentMethod.type === 'CARD'
  })
}

export const getUserSelectedPaymentOptionType = (state) => {
  const value =
    getSelectedPaymentMethodValue(state) ||
    selectStoredPaymentDetails(state).type
  return isCardPayment(value, state)
    ? 'CARD'
    : checkPaymentMethodExistsOrDefault(state, value)
}

export const isSaveMyCheckoutDetailsDisabled = (state) => {
  const forms = {
    billingAddressForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').address,
      state
    ),
    deliveryAddressForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').address,
      state
    ),
    billingDetailsForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').details,
      state
    ),
    deliveryDetailsForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').details,
      state
    ),
    billingFindAddressForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').findAddress,
      state
    ),
    deliveryFindAddressForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').findAddress,
      state
    ),
  }
  const errors = mergeAll(values(pluck('errors', forms)))
  const errorMessages = values(errors)
  return not(all(either(isNil, isEmpty), errorMessages))
}

// orderHistory
const orderDetailsSelector = (state) => {
  return pathOr({}, ['orderHistory', 'orderDetails'], state)
}

// returnHistory
const returnDetailsSelector = (state) =>
  pathOr({}, ['returnHistory', 'returnDetails'], state)
const orderPaymentDetailsSelector = (state) =>
  pathOr({}, ['orderHistory', 'orderDetails', 'paymentDetails'], state)
const returnPaymentDetailsSelector = (state) =>
  pathOr({}, ['returnHistory', 'returnDetails', 'paymentDetails'], state)

export const getValidOrderStatusReturn = (orderStatus) => {
  /**
   * S - Order shipped
   * D - Order payment settled
   * c - Parcel collected by customer
   * */
  const allowedReturnOnStatus = ['S', 'D', 'c']
  return allowedReturnOnStatus.includes(orderStatus)
}

// decorators
const decoratePaymentDetailsWithPaymentMethodData = (
  paymentDetails,
  paymentMethods
) => {
  const decoratePaymentDetail = (paymentDetail) =>
    pipe(
      find(propEq('label', path(['paymentMethod'], paymentDetail))),
      defaultTo({}),
      pick(['icon', 'type', 'value']),
      merge(paymentDetail)
    )(paymentMethods)

  return map(decoratePaymentDetail, paymentDetails)
}

const decorateOrderPaymentDetails = createSelector(
  orderPaymentDetailsSelector,
  paymentMethodsSelector,
  decoratePaymentDetailsWithPaymentMethodData
)

const decorateReturnPaymentDetails = createSelector(
  returnPaymentDetailsSelector,
  paymentMethodsSelector,
  decoratePaymentDetailsWithPaymentMethodData
)

export const getDecoratedOrderDetails = createSelector(
  orderDetailsSelector,
  decorateOrderPaymentDetails,
  (orderDetails, paymentDetails) => ({
    ...orderDetails,
    paymentDetails,
  })
)

export const getDecoratedReturnDetails = createSelector(
  returnDetailsSelector,
  decorateReturnPaymentDetails,
  (orderDetails, paymentDetails) => ({
    ...orderDetails,
    paymentDetails,
  })
)
