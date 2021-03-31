import { path, pathOr } from 'ramda'
import { createSelector } from 'reselect'

// constants
import { formNames } from '../constants/forms'

// selectors
import { getCountryCodeFromQAS } from './common/configSelectors'
import { getCountry } from '../selectors/configSelectors'
import {
  isReturningCustomer,
  getDeliveryCountry,
  getBillingCountry,
} from '../selectors/checkoutSelectors'

const rootSelector = (state) => (state && state.forms) || {}

const getFormsCheckout = (state) => {
  const { checkout } = rootSelector(state)
  return checkout || {}
}

const getFormsCheckoutBillingCardDetails = (state) => {
  const { billingCardDetails } = getFormsCheckout(state)
  return billingCardDetails || {}
}

const getBillingCardPaymentType = (state) => {
  const { fields } = getFormsCheckoutBillingCardDetails(state)
  return pathOr('', ['paymentType', 'value'], fields)
}

const getBillingCardNumber = createSelector(
  getFormsCheckoutBillingCardDetails,
  (billingCardDetails) =>
    pathOr('', ['fields', 'cardNumber', 'value'], billingCardDetails)
)

/* TODO: These selectors should be refactored to follow the reselect pattern
 *
 *  */
const getForgetPasswordForm = (state) =>
  path(['forms', 'forgetPassword'], state)

const getOrderFormErrorMessage = (state) =>
  path(['forms', 'checkout', 'order', 'message', 'message'], state)

const getResetPasswordForm = (state) => path(['forms', 'resetPassword'], state)

const getUserLocationValue = (state) =>
  path(['forms', 'userLocator', 'fields', 'userLocation', 'value'], state)

const cardDetailsStatePaths = {
  paymentCardDetailsMCD: [
    'account',
    'myCheckoutDetails',
    'paymentCardDetailsMCD',
  ],
  billingCardDetails: ['checkout', 'billingCardDetails'],
}

const getSelectedPaymentType = (state, formName = 'billingCardDetails') => {
  const fields = pathOr(
    {},
    ['forms', ...cardDetailsStatePaths[formName], 'fields'],
    state
  )
  return pathOr(null, ['paymentType', 'value'], fields)
}

const selectCheckoutForms = (state) => path(['forms', 'checkout'], state)

const selectBillingCardPaymentTypeFromCheckoutForm = (state) =>
  path(
    [
      'forms',
      'checkout',
      'billingCardDetails',
      'fields',
      'paymentType',
      'value',
    ],
    state
  )

const getDeliveryInstructionsForm = (state) =>
  path(['deliveryInstructions'], selectCheckoutForms(state))

const getBillingAddressForm = (state) =>
  path(['billingAddress'], selectCheckoutForms(state))

const getBillingDetailsForm = (state) =>
  path(['billingDetails'], selectCheckoutForms(state))

const isPaymentTypeFieldDirty = (state) =>
  path(
    ['billingCardDetails', 'fields', 'paymentType', 'isDirty'],
    selectCheckoutForms(state)
  )

const getFormLoading = (formName, state) =>
  pathOr(false, ['forms', formName, 'isLoading'], state)

const getFormNames = (addressType) => formNames[addressType]

const getAddressForm = (addressType, formName, state) => {
  switch (addressType) {
    case 'addressBook':
      return pathOr({}, ['forms', 'addressBook', formName], state)
    case 'deliveryCheckout':
    case 'billingCheckout':
      return pathOr({}, ['forms', 'checkout', formName], state)
    case 'deliveryMCD':
    case 'billingMCD':
      return pathOr(
        {},
        ['forms', 'account', 'myCheckoutDetails', formName],
        state
      )
    default:
      return {}
  }
}

const getIsFindAddressVisible = (addressType, formName, country, state) => {
  const addressForm = getAddressForm(addressType, formName, state)
  const isManual = !!path(['fields', 'isManual', 'value'], addressForm)
  const QASCountry = getCountryCodeFromQAS(state, country)

  return !isManual && QASCountry !== ''
}

const getCountryFormField = (addressType, formName, state) => {
  const addressForm = getAddressForm(addressType, formName, state)
  return pathOr('', ['fields', 'country', 'value'], addressForm)
}

const getCountryFromUserProfile = (addressType, state) => {
  switch (addressType) {
    case 'deliveryMCD':
      return pathOr(
        '',
        ['account', 'user', 'deliveryDetails', 'address', 'country'],
        state
      )
    case 'billingMCD':
      return pathOr(
        '',
        ['account', 'user', 'billingDetails', 'address', 'country'],
        state
      )
    default:
      return ''
  }
}

const getCountryForReturningUser = (addressType, formName, state) => {
  const defaultSiteCountry = getCountry(state)
  const formFieldCountry = getCountryFormField(addressType, formName, state)
  const accountCountry = getCountryFromUserProfile(addressType, state)

  return formFieldCountry || accountCountry || defaultSiteCountry
}

const getCountryForNewUser = (addressType, state) => {
  switch (addressType) {
    case 'deliveryCheckout':
      return getDeliveryCountry(state)
    case 'billingCheckout':
      return getBillingCountry(state)
    default:
      return ''
  }
}

const getCountryFor = (addressType, formName, state) => {
  if (isReturningCustomer(state)) {
    return getCountryForReturningUser(addressType, formName, state)
  }
  return getCountryForNewUser(addressType, state)
}

const getMCDDeliveryCountry = (state) => {
  return getCountryForReturningUser('deliveryMCD', 'deliveryAddressMCD', state)
}

const getMCDBillingCountry = (state) => {
  return getCountryForReturningUser('billingMCD', 'billingAddressMCD', state)
}

const isUsingCurrentLocation = (state) => {
  const userLocationValue = getUserLocationValue(state)
  return userLocationValue === 'Current Location'
}

export {
  getFormsCheckout,
  getFormsCheckoutBillingCardDetails,
  getBillingCardPaymentType,
  getBillingCardNumber,
  getForgetPasswordForm,
  getOrderFormErrorMessage,
  getResetPasswordForm,
  getCountryFromUserProfile,
  getSelectedPaymentType,
  selectCheckoutForms,
  selectBillingCardPaymentTypeFromCheckoutForm,
  getBillingAddressForm,
  getBillingDetailsForm,
  isPaymentTypeFieldDirty,
  getFormLoading,
  getFormNames,
  getAddressForm,
  getIsFindAddressVisible,
  getCountryFormField,
  getCountryForReturningUser,
  getMCDDeliveryCountry,
  getMCDBillingCountry,
  getCountryFor,
  isUsingCurrentLocation,
  getDeliveryInstructionsForm,
}
