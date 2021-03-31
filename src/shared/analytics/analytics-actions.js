import { ANALYTICS_ACTION, GTM_ACTION } from './analytics-constants'
import { getCurrencyCode } from '../selectors/configSelectors'
import {
  getCheckoutOrderError,
  getCheckoutOrderId,
  getCheckoutOrderLines,
  getCheckoutUserId,
  getCheckoutPromoCodes,
  getCheckoutTotalOrderPrice,
  getCheckoutTotalOrderDiscount,
  getCheckoutProductRevenue,
  getCheckoutPaymentDetails,
  getCheckoutDeliveryAddress,
  getCheckoutDeliveryMethod,
  getCheckoutDeliveryPrice,
  getDDPPromotion,
  getCheckoutUserType,
  getIsRegisteredEmail,
} from '../selectors/checkoutSelectors'
import transformBasket from '../../client/analytics/transforms/basket'
import { round } from '../lib/numbers'
import { getUserAuthState } from '../selectors/userAuthSelectors'
import { getDDPUserAnalyticsProperties } from '../selectors/ddpSelectors'
import {
  getUserTrackingId,
  getHashedUserEmail,
} from '../selectors/common/accountSelectors'
import { boolToString } from './analytics-utils'

export const sendAnalyticsApiResponseEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_API_RESPONSE_EVENT,
  payload,
})

export const sendAnalyticsClickEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_CLICK_EVENT,
  payload,
})

export const sendAnalyticsErrorMessage = (errorMessage) => ({
  type: ANALYTICS_ACTION.SEND_ERROR_MESSAGE,
  errorMessage,
})

export const sendAnalyticsProductClickEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_PRODUCT_CLICK_EVENT,
  payload,
})

export const sendAnalyticsDisplayEvent = (payload, eventName) => ({
  type: ANALYTICS_ACTION.SEND_DISPLAY_EVENT,
  payload,
  eventName,
})

export const sendAnalyticsDeliveryOptionChangeEvent = (
  deliveryLocationType
) => ({
  type: ANALYTICS_ACTION.SEND_DELIVERY_OPTION_CHANGE_EVENT,
  deliveryLocationType,
})

export const sendAnalyticsValidationState = ({ id, validationStatus }) => ({
  type: ANALYTICS_ACTION.SEND_INPUT_VALIDATION_STATUS,
  id,
  validationStatus,
})

export const sendAnalyticsPaymentMethodSelectionEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_SELECTION_EVENT,
  eventName: GTM_ACTION.PAYMENT_METHOD_SELECTION,
  payload,
})

export const sendAnalyticsPaymentMethodIntentionEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_INTENTION_EVENT,
  eventName: GTM_ACTION.PAYMENT_METHOD_INTENTION,
  payload,
})

export const sendAnalyticsPaymentMethodPurchaseSuccessEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_SUCCESS_EVENT,
  eventName: GTM_ACTION.PAYMENT_METHOD_PURCHASE_SUCCESS,
  payload,
})

export const sendAnalyticsPaymentMethodPurchaseFailureEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT,
  eventName: GTM_ACTION.PAYMENT_METHOD_PURCHASE_FAILURE,
  payload,
})

export const sendAnalyticsDeliveryMethodChangeEvent = (deliveryMethod) => ({
  type: ANALYTICS_ACTION.SEND_DELIVERY_METHOD_CHANGE_EVENT,
  deliveryMethod,
})

export const sendAnalyticsFilterUsedEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_FILTER_USED_EVENT,
  payload,
})

export const sendAnalyticsOrderCompleteEvent = (payload) => ({
  type: ANALYTICS_ACTION.SEND_ORDER_COMPLETE_EVENT,
  payload,
})

export const sendAnalyticsPurchaseEvent = () => (dispatch, getState) => {
  const state = getState()

  // From config
  const currencyCode = getCurrencyCode(state)

  // From checkout
  const orderError = getCheckoutOrderError(state)

  // From orderCompleted
  const orderId = getCheckoutOrderId(state)

  if (orderError || !orderId) {
    return dispatch({
      type: ANALYTICS_ACTION.SEND_PURCHASE_ERROR_EVENT,
      payload: {
        orderError,
        orderId,
      },
    })
  }

  // From orderCompleted
  const loggedIn = boolToString(getUserTrackingId(state))
  const authState = getUserAuthState(state)
  const userId = getCheckoutUserId(state)
  const hashedEmailAddress = getHashedUserEmail(state)
  const orderLines = getCheckoutOrderLines(state)
  const promoCodes = getCheckoutPromoCodes(state)
  const totalOrderPrice = parseFloat(getCheckoutTotalOrderPrice(state))
  const productRevenue = parseFloat(getCheckoutProductRevenue(state))
  const paymentDetails = getCheckoutPaymentDetails(state)
  const deliveryAddress = getCheckoutDeliveryAddress(state)
  const deliveryMethod = getCheckoutDeliveryMethod(state)
  const deliveryPrice = parseFloat(getCheckoutDeliveryPrice(state))
  const totalOrdersDiscount = getCheckoutTotalOrderDiscount(state)
  const orderWithDDPPromotion = getDDPPromotion(state)
  const userType = getCheckoutUserType(state)
  const isRegisteredEmail = getIsRegisteredEmail(state)

  const twoDP = (value) =>
    typeof value === 'number' && !Number.isNaN(value)
      ? round(value).toFixed(2)
      : '0.00'

  const paymentType = paymentDetails.map((item) => item.paymentMethod).join(',')

  const calculateOrderDiscount = (
    totalOrdersDiscount,
    totalOrderPrice,
    deliveryPrice
  ) => {
    const trimToNumber = (string) =>
      string.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '')

    const orderDiscount = parseFloat(trimToNumber(totalOrdersDiscount))

    if (Number.isNaN(orderDiscount) || orderDiscount === 0) {
      return 0
    }

    const productsPrice = totalOrderPrice - deliveryPrice
    return (orderDiscount / (productsPrice + orderDiscount)) * 100
  }

  const actionField = {
    id: `${orderId}`,
    revenue: twoDP(totalOrderPrice),
    productRevenue: twoDP(productRevenue),
    paymentType,
    orderDiscount: twoDP(
      calculateOrderDiscount(
        totalOrdersDiscount,
        totalOrderPrice,
        deliveryPrice
      )
    ),
    shippingCountry: deliveryAddress.country,
    shippingOption: deliveryMethod,
    shipping: twoDP(deliveryPrice),
    ddpOrder: {
      ddpPromotion: Object.keys(orderWithDDPPromotion).length > 0,
      value: orderWithDDPPromotion.value || 0,
    },
  }

  if (promoCodes.length) {
    // GA Measurement Protocol can only accommodate one coupon code
    // but this array can be transformed in GTM for consumption by
    // GA and any other analytics service that requires it.
    actionField.coupon = promoCodes
  }

  const products = orderLines.map(
    ({
      lineNo,
      skuId,
      name,
      unitPrice,
      colour,
      quantity,
      category,
      size,
      brand,
      reviewRating,
      ecmcCategory,
      department,
    }) => ({
      id: lineNo,
      productId: skuId,
      name: `(${lineNo}) ${name}`,
      price: unitPrice,
      unitNowPrice: unitPrice,
      colour,
      quantity: `${quantity}`,
      category,
      size,
      brand,
      reviewRating,
      ecmcCategory,
      department,
    })
  )

  const payload = {
    user: {
      ...getDDPUserAnalyticsProperties(state),
      loggedIn,
      authState,
      id: userId,
      userType,
      isRegisteredEmail,
    },
    ecommerce: {
      currencyCode,
      purchase: {
        actionField,
        products,
      },
    },

    // Exponea needs an empty basket to clear its state.
    fullBasket: transformBasket(state),

    // Prevent merging of the payload properties (effectively flush)
    // that are siblings to this data layer command.
    _clear: true,
  }

  if (hashedEmailAddress) {
    payload.user.hashedEmailAddress = hashedEmailAddress
  }

  return dispatch({
    type: ANALYTICS_ACTION.SEND_PURCHASE_EVENT,
    payload,
  })
}
