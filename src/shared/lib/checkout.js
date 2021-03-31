import {
  isEmpty,
  omit,
  pick,
  prop,
  pluck,
  compose,
  any,
  values,
  pathOr,
} from 'ramda'
import { isUserAuthenticated } from '../selectors/userAuthSelectors'
import { getPaymentMethodFromValue, isCard } from './checkout-utilities/utils'
import { getItem } from '../../client/lib/cookie/utils'
import { getTraceIdFromCookie } from '../../shared/lib/cookie'
import {
  getSelectedDeliveryLocationType,
  isReturningCustomer,
} from '../selectors/checkoutSelectors'

const ADDRESS_FIELDS = [
  'address1',
  'address2',
  'city',
  'state',
  'country',
  'postcode',
]
const NAME_AND_PHONE_FIELDS = ['firstName', 'lastName', 'telephone']
const CREDIT_CARD_FIELDS = ['expiryYear', 'expiryMonth', 'cardNumber', 'type']

// For countries that do not require a postcode (i.e Ireland) we need to pass at the very least a truthy string to WCS in order for
// it to not kick up a fuss about validation. Hence adding a string of '0' at the very least when formatting the address
const formatAddress = (data) =>
  pick(ADDRESS_FIELDS, {
    ...data,
    state: data.county || data.state,
    postcode: data.postcode || '0',
  })

export const formatPhoneNumber = (num) => num.replace(/\D/g, '')

const formatNameAndPhone = (data) =>
  pick(NAME_AND_PHONE_FIELDS, {
    ...data,
    telephone: formatPhoneNumber(data.telephone),
  })
const formatCreditCard = (data) =>
  pick(CREDIT_CARD_FIELDS, { ...data, type: data.paymentType })
const extractFormData = compose(
  pluck('value'),
  prop('fields')
)

export const giftCardCoversTotal = (giftCards, total) =>
  Array.isArray(giftCards) && giftCards.length > 0 && parseFloat(total) === 0

export const isCheckoutProfile = ({
  deliveryDetails = {},
  billingDetails = {},
  creditCard = {},
}) => {
  // When a user has not checked out the creditCard.type === ''
  if (creditCard.type) return true

  // When a user has no saved address details the addressDetailsId is -1
  return (
    deliveryDetails.addressDetailsId > 0 || billingDetails.addressDetailsId > 0
  )
}

export const reportIncorrectDataAnalytics = (customMessage, customProperty) => {
  if (window.NREUM && typeof window.NREUM.noticeError === 'function') {
    window.NREUM.noticeError(customMessage, {
      data: customProperty,
    })
  }
}

export const createOrderDeliveryOption = (orderSummary, yourAddress) => {
  const selectedDeliveryLocation =
    (orderSummary &&
      Array.isArray(orderSummary.deliveryLocations) &&
      orderSummary.deliveryLocations.find(prop('selected'))) ||
    {}
  const selectedDeliveryMethod =
    (Array.isArray(selectedDeliveryLocation.deliveryMethods) &&
      selectedDeliveryLocation.deliveryMethods.find(prop('selected'))) ||
    {}
  const shouldUseDeliveryOptions =
    selectedDeliveryMethod &&
    Array.isArray(selectedDeliveryMethod.deliveryOptions) &&
    selectedDeliveryMethod.deliveryOptions.length

  /* ADP-214 - Sends error to new relic when deliveryLocations data is incorrect */
  if (isEmpty(selectedDeliveryMethod)) {
    reportIncorrectDataAnalytics(
      'ADP-214 There is no selected delivery method',
      {
        traceId: getTraceIdFromCookie(window.document.cookie),
        orderId: pathOr(null, ['basket', 'orderId'], orderSummary),
        deliveryLocations: pathOr({}, ['deliveryLocations'], orderSummary),
      }
    )
  }
  /* END ADP-214 error */

  // because of inconsistent data structure in ordersummary
  const { shipModeId, nominatedDate } = shouldUseDeliveryOptions
    ? selectedDeliveryMethod.deliveryOptions.find(prop('selected')) || {}
    : selectedDeliveryMethod

  /* ADP-819 - Tracks incorrect orderSummary data */
  if (
    shouldUseDeliveryOptions &&
    !selectedDeliveryMethod.deliveryOptions.find(prop('selected'))
  ) {
    reportIncorrectDataAnalytics(
      'ADP-819 There is no selected delivery option',
      orderSummary.deliveryLocations
    )
  }
  /* END ADP-819 error */

  const payload = {
    orderId: orderSummary.basket.orderId,
    shippingCountry:
      yourAddress.fields.country.value || orderSummary.shippingCountry,
    shipCode: selectedDeliveryMethod.shipCode,
    deliveryType: selectedDeliveryMethod.deliveryType,
    shipModeId,
    nominatedDate,
  }

  if (orderSummary.deliveryStoreCode) {
    payload.deliveryStoreCode = orderSummary.deliveryStoreCode
  }

  return payload
}

const extraGuestRecaptchaProperties = (
  brandName,
  isGuestRecaptchaEnabled,
  recaptchaToken
) => {
  return isGuestRecaptchaEnabled
    ? {
        recaptchaToken,
        brandName,
        isGuestRecaptchaEnabled,
      }
    : {}
}

const createBaseOrder = ({
  orderSummary,
  billingCardDetails: cardDetailsForm,
  yourAddress,
  deliveryInstructions,
  orderCompletePath,
  psd2PunchoutPath,
  isGuestOrder,
  guestUser,
  recaptchaToken,
  brandName,
  isGuestRecaptchaEnabled,
}) => {
  const buildReturnUrl = ({
    protocol,
    host,
    path,
    paymentMethod,
    ga,
    orderId,
  }) => {
    const queryParams = [
      ...(ga ? [`ga=${encodeURIComponent(ga)}`] : []),
      ...(orderId ? [`orderId=${encodeURIComponent(orderId)}`] : []),
      `paymentMethod=${paymentMethod}`,
    ]

    return `${protocol}//${host}/${path}?${queryParams.join('&')}`
  }

  const billingCardDetails = extractFormData(cardDetailsForm)
  const {
    location: { protocol, host },
  } = window
  const giftCards = pathOr(null, ['giftCards'], orderSummary)
  const total = pathOr(null, ['basket', 'total'], orderSummary)
  const orderId = pathOr(null, ['basket', 'orderId'], orderSummary)
  const zeroValueOrder = giftCardCoversTotal(giftCards, total)
  const paymentType = zeroValueOrder ? '' : billingCardDetails.paymentType
  const email = pathOr('', ['fields', 'email', 'value'], guestUser)
  const signUpGuest = pathOr(
    false,
    ['fields', 'signUpGuest', 'value'],
    guestUser
  )

  return {
    smsMobileNumber: formatPhoneNumber(
      deliveryInstructions.fields.smsMobileNumber.value
    ),
    remoteIpAddress: '127.0.0.1', // refer to the scrAPI documentation. (none of us know why this is needed)
    cardCvv: zeroValueOrder ? '0' : billingCardDetails.cvv || '0',
    orderDeliveryOption: createOrderDeliveryOption(orderSummary, yourAddress),
    deliveryInstructions:
      deliveryInstructions.fields.deliveryInstructions.value,
    returnUrl: buildReturnUrl({
      protocol,
      host,
      path: orderCompletePath,
      paymentMethod: paymentType,
      ga: getItem('_ga'),
      orderId,
    }),
    punchoutReturnUrl: buildReturnUrl({
      protocol,
      host,
      path: psd2PunchoutPath,
      paymentMethod: paymentType,
      ga: getItem('_ga'),
      orderId,
    }),
    paymentType,
    isGuestOrder,
    signUpGuest: isGuestOrder ? signUpGuest : undefined,
    email,
    ...extraGuestRecaptchaProperties(
      brandName,
      isGuestRecaptchaEnabled,
      recaptchaToken
    ),
  }
}

export const deliverySections = ({
  yourAddress,
  yourDetails,
  orderSummary,
  user,
}) => {
  const state = {
    checkout: {
      orderSummary,
    },
  }
  const deliveryFormFields = {
    ...yourDetails.fields,
    ...yourAddress.fields,
  }
  // If the user has modified the data we need to add the new data to the order
  // Because we are not "submitting" the delivery form data, we need to see if it has been changed in the form.
  const isDirty = any(prop('isDirty'), values(deliveryFormFields))
  const deliveryInfo = pluck('value', deliveryFormFields) // form data as: {field: value}
  const notDeliveryTypeHome = getSelectedDeliveryLocationType(state) !== 'HOME'

  /* isDirty: form has been updated
   * notDeliveryTypeHome: The delivery type is not a home address
   * !isReturningCustomer: is not a returning customer
   *
   * Passing these properties are required for a new user or a returning user
   * when delivery type is CFS or CFP and has updated the delivery details form
   * */
  return isDirty &&
    (notDeliveryTypeHome || !isReturningCustomer({ account: { user } }))
    ? {
        deliveryAddress:
          orderSummary.storeDetails || formatAddress(deliveryInfo),
        deliveryNameAndPhone: formatNameAndPhone(deliveryInfo),
      }
    : {}
}

const billingSection = ({ billingAddress, billingDetails }) => {
  const billingFormFields = {
    ...billingAddress.fields,
    ...billingDetails.fields,
  }
  // If the user has modified the data we need to add the new data to the order
  // as with delivery data, we use the form data if the form fields has been changed.
  const isDirty = any(prop('isDirty'), values(billingFormFields))
  const billingInfo = pluck('value', billingFormFields)
  return isDirty
    ? {
        billingDetails: {
          address: formatAddress(billingInfo),
          nameAndPhone: formatNameAndPhone(billingInfo),
        },
      }
    : {}
}

const paymentSection = ({
  billingCardDetails,
  orderSummary,
  paymentMethods,
  user,
}) => {
  const {
    giftCards,
    basket: { total },
    cardNumberHash,
  } = orderSummary
  if (giftCardCoversTotal(giftCards, total)) return undefined
  // If the user has modified the data we need to add the new data to the order
  const isDirty = any(
    prop('isDirty'),
    values(omit(['cvv'], billingCardDetails.fields))
  )
  if (isDirty) {
    const cardInfo = pluck('value', billingCardDetails.fields)
    const paymentTypeValue = getPaymentMethodFromValue(
      cardInfo.paymentType,
      paymentMethods
    )
    if (!isCard(paymentTypeValue.value, paymentMethods)) {
      // TODO : check if Field (Year - Month) is today OR future
      cardInfo.expiryYear = (new Date().getFullYear() + 1).toString() // API requires this, but don't use it when paying with paypal
      cardInfo.expiryMonth = '1'
      cardInfo.cardNumber = '0'
      cardInfo.cvv = '0'
    }
    return { creditCard: formatCreditCard(cardInfo) }
  }

  return {
    // NOTE: if first order is store delivery, then there is no cardNumberHash in the order summary - ¯\_(ツ)_/¯
    cardNumberHash: cardNumberHash || user.creditCard.cardNumberHash,
  }
}

const savePaymentDetailsSection = (
  featureSavePaymentDetailsEnabled,
  paymentConfig
) => {
  if (!featureSavePaymentDetailsEnabled) return {}

  return {
    save_details: paymentConfig.saveDetails,
  }
}

const isTempUser = (user) => /\.TEMP.*/.test(user.email)

const accountSection = ({
  auth,
  credentials = {},
  user,
  isGuestOrder = false,
}) => {
  // For a guest user we return the empty object userAuth = {}
  let userAuth = {}
  if ((!isUserAuthenticated({ auth }) || isTempUser(user)) && !isGuestOrder) {
    if (user && user.exists && !isTempUser(user)) {
      // Returning user
      userAuth = {
        accountLogin: {
          password: credentials.fields.password.value,
          email: credentials.fields.email.value,
        },
      }
    } else {
      // New user
      userAuth = { accountCreate: pluck('value', credentials.fields) }
    }
  }
  return userAuth
}

export const createOrder = (arg) => {
  const {
    billingCardDetails,
    yourDetails,
    yourAddress,
    billingAddress,
    billingDetails,
    deliveryInstructions,
    orderSummary,
    credentials,
    auth,
    user,
    paymentMethods,
    featureSavePaymentDetailsEnabled,
    orderCompletePath,
    psd2PunchoutPath,
    isGuestOrder,
    guestUser,
    recaptchaToken,
    brandName,
    isGuestRecaptchaEnabled,
    paymentConfig,
  } = arg

  return {
    ...createBaseOrder({
      billingCardDetails,
      orderSummary,
      yourAddress,
      deliveryInstructions,
      orderCompletePath,
      psd2PunchoutPath,
      isGuestOrder,
      guestUser,
      ...extraGuestRecaptchaProperties(
        brandName,
        isGuestRecaptchaEnabled,
        recaptchaToken
      ),
    }),
    ...deliverySections({ yourAddress, yourDetails, orderSummary, user }),
    ...billingSection({ billingAddress, billingDetails }),
    ...paymentSection({
      billingCardDetails,
      orderSummary,
      paymentMethods,
      user,
    }),
    ...accountSection({ auth, credentials, user, isGuestOrder }),
    ...savePaymentDetailsSection(
      featureSavePaymentDetailsEnabled,
      paymentConfig
    ),
  }
}

// TODO: refactor this to use isCheckout in routingSelectors.js instead
export const isCheckoutPath = (pathname) => {
  return /\/checkout(\/.*)/.test(pathname)
}
