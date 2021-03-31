import { addPreDispatchListeners } from './analytics-middleware'
import {
  pushApiResponseEvent,
  pushClickEvent,
  pushErrorMessage,
  pushProductClickEvent,
  pushDisplayEvent,
  pushDeliveryOptionChangeEvent,
  pushInputValidationStatus,
  pushDeliveryMethodChangeEvent,
  pushFilterUsedEvent,
  pushOrderCompleteEvent,
  pushPurchaseEvent,
  pushPurchaseErrorEvent,
} from '../../../shared/analytics/tracking/site-interactions'
import { ANALYTICS_ACTION } from '../../../shared/analytics/analytics-constants'

const gtmParameterMap = {
  category: 'ec',
  action: 'ea',
  label: 'el',
  value: 'ev',
  rememberMe: 'rememberMe',
}

const deliveryOptionMap = {
  HOME: 'Home Delivery',
  STORE: 'Collect from Store',
  PARCELSHOP: 'Collect from ParcelShop',
}

const sendApiResponseEvent = ({ payload }) => pushApiResponseEvent(payload)

const sendClickEvent = ({ payload }) => {
  const gtmPayload = Object.entries(payload).reduce(
    (newPayload, [key, value]) => {
      newPayload[gtmParameterMap[key]] = value
      return newPayload
    },
    {}
  )
  pushClickEvent(gtmPayload)
}

const sendDisplayEvent = ({ payload, eventName }) =>
  pushDisplayEvent(payload, eventName)

const sendErrorEvent = ({ errorMessage }) => pushErrorMessage(errorMessage)

const sendProductClickEvent = ({ payload }) => {
  const { name, id, price, brand, category, position, listType } = payload
  pushProductClickEvent(
    {
      name,
      id,
      price,
      brand,
      category,
      position,
    },
    listType
  )
}

const sendDeliveryOptionChangeEvent = ({ deliveryLocationType }) =>
  pushDeliveryOptionChangeEvent(deliveryOptionMap[deliveryLocationType])

const sendValidationStatus = ({ id, validationStatus }) => {
  pushInputValidationStatus({ id, validationStatus })
}

const sendOrderCompleteEvent = ({ payload }) => {
  const {
    orderId,
    returning_buyer,
    deliveryMethod,
    paymentDetails = [],
  } = payload
  pushOrderCompleteEvent({
    orderId,
    returning_buyer,
    deliveryMethod,
    paymentMethods: paymentDetails.map(({ paymentMethod }) => paymentMethod),
  })
}

export const setupAnalyticsActionListeners = () => {
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_API_RESPONSE_EVENT,
    sendApiResponseEvent
  )
  addPreDispatchListeners(ANALYTICS_ACTION.SEND_CLICK_EVENT, sendClickEvent)
  addPreDispatchListeners(ANALYTICS_ACTION.SEND_ERROR_MESSAGE, sendErrorEvent)
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PRODUCT_CLICK_EVENT,
    sendProductClickEvent
  )
  addPreDispatchListeners(ANALYTICS_ACTION.SEND_DISPLAY_EVENT, sendDisplayEvent)
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_INPUT_VALIDATION_STATUS,
    sendValidationStatus
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PAYMENT_METHOD_SELECTION_EVENT,
    sendDisplayEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PAYMENT_METHOD_INTENTION_EVENT,
    sendDisplayEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_SUCCESS_EVENT,
    sendDisplayEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT,
    sendDisplayEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_DELIVERY_OPTION_CHANGE_EVENT,
    sendDeliveryOptionChangeEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_DELIVERY_METHOD_CHANGE_EVENT,
    pushDeliveryMethodChangeEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_FILTER_USED_EVENT,
    pushFilterUsedEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_ORDER_COMPLETE_EVENT,
    sendOrderCompleteEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PURCHASE_EVENT,
    pushPurchaseEvent
  )
  addPreDispatchListeners(
    ANALYTICS_ACTION.SEND_PURCHASE_ERROR_EVENT,
    pushPurchaseErrorEvent
  )
}
