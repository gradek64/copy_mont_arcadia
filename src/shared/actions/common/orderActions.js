import React from 'react'
import { map, path } from 'ramda'
import { browserHistory } from 'react-router'

// Utilities
import {
  createThreeDSecure1Form,
  createThreeDSecureFlexForm,
} from '../../lib/checkout-utilities/create-three-d-secure-form'
import {
  WCS_ERRORS,
  sanitizeWCSJavaErrors,
  WCS_PENDING_PAYMENT_STATUS_CODE,
} from '../../lib/wcsCodes'
import { localise } from '../../lib/localisation'
import { post, put, get } from '../../lib/api-service'
import { fixEuropeanOrderCompleted } from '../../lib/checkout-utilities/order-summary'
import { createOrder as generateOrder } from '../../lib/checkout'
import { prepareKlarnaPayload } from '../../lib/checkout-utilities/klarna-utils'

// Components
import ThirdPartyPaymentIFrame from '../../components/containers/ThirdPartyPaymentIFrame/ThirdPartyPaymentIFrame'

// Selectors
import {
  isFeatureSavePaymentDetailsEnabled,
  isFeaturePSD2PunchoutPopupEnabled,
  isFeaturePSD2ThreeDSecure2Enabled,
  isFeaturePaypalSmartButtonsEnabled,
} from '../../selectors/featureSelectors'
import { getRouteSearch } from '../../selectors/routingSelectors'
import { isPaymentTypeKlarna } from '../../selectors/klarnaSelectors'
import { isPaymentTypeApplePay } from '../../selectors/applePaySelectors'
import { isPaymentTypeClearPay } from '../../selectors/clearPaySelectors'
import { isBasketTotalCoveredByGiftCards } from '../../selectors/shoppingBagSelectors'

import {
  isUserAuthenticated,
  isUserAtLeastPartiallyAuthenticated,
} from '../../selectors/userAuthSelectors'
import {
  getCurrentPaymentConfig,
  isCard,
} from '../../selectors/paymentMethodSelectors'
import {
  getCheckoutFinalisedOrder,
  isGuestOrder,
} from '../../selectors/checkoutSelectors'
import { isGuestRecaptchaEnabled } from '../../selectors/recaptchaSelectors'

// Actions
import { setFinalisedOrder, clearFinalisedOrder } from './orderAuxiliaryActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { setFormMessage, resetForm } from './formActions'
import { updateMenuForAuthenticatedUser } from './navigationActions'
import { performApplePayPayment } from './applePayActions'

import {
  emptyShoppingBag,
  updateShoppingBagBadgeCount,
} from './shoppingBagActions'
import { getAccount } from './accountActions'
import {
  syncClientForEmailExists,
  getCheckoutBag,
  getOrderSummary,
} from './checkoutActions'
import {
  authorizeByKlarna,
  blockKlarnaPayment,
  blockKlarnaUpdate,
  resetKlarna,
} from './klarnaActions'
import { initialiseClearPay } from './clearPayActions'
import {
  sendAnalyticsErrorMessage,
  sendAnalyticsPaymentMethodIntentionEvent,
  ANALYTICS_ERROR,
} from '../../analytics'
import { setThankyouPageEspots } from './espotActions'
import { showModal } from './modalActions'
import { PAYPAL } from '../../../shared/constants/paymentTypes'

export const setOrderConfirmation = (data) => {
  return {
    type: 'SET_ORDER_COMPLETED',
    data,
  }
}

export const setNewlyConfirmedOrder = (newlyConfirmedOrder = false) => {
  return {
    type: 'SET_NEWLY_CONFIRMED_ORDER',
    newlyConfirmedOrder,
  }
}

export const setOrderPending = (data) => {
  return {
    type: 'SET_ORDER_PENDING',
    data,
  }
}

export const updateOrderPending = (data) => {
  return {
    type: 'UPDATE_ORDER_PENDING',
    data,
  }
}

export const clearOrderPending = () => {
  return {
    type: 'CLEAR_ORDER_PENDING',
  }
}

export const setThreeDSecurePrompt = (data) => {
  return {
    type: 'SET_THREE_D_SECURE_PROMPT',
    data,
  }
}

export const clearThreeDSecurePrompt = () => {
  return {
    type: 'CLEAR_THREE_D_SECURE_PROMPT',
  }
}

export const setOrderError = (error) => {
  return {
    type: 'SET_ORDER_ERROR',
    error: sanitizeWCSJavaErrors(error),
  }
}

export const clearOrderError = () => {
  return {
    type: 'CLEAR_ORDER_ERROR',
  }
}

export const setOrderErrorPaymentDetails = (data) => {
  return {
    type: 'SET_ORDER_ERROR_PAYMENT_DETAILS',
    data,
  }
}

export const clearOrderErrorPaymentDetails = () => {
  return {
    type: 'CLEAR_ORDER_ERROR_PAYMENT_DETAILS',
  }
}

export const setPrePaymentConfig = (config) => {
  return {
    type: 'SET_PRE_PAYMENT_CONFIG',
    config,
  }
}

export const clearPrePaymentConfig = () => {
  return {
    type: 'CLEAR_PRE_PAYMENT_CONFIG',
  }
}

const clearCheckoutForms = () => {
  return (dispatch, getState) => {
    dispatch(
      resetForm(
        'billingCardDetails',
        map(() => '', getState().forms.checkout.billingCardDetails.fields)
      )
    )
    dispatch(
      resetForm(
        'giftCard',
        map(() => '', getState().forms.giftCard.fields)
      )
    )
  }
}

const extractEmail = (orderPayload) => {
  return (
    (orderPayload.accountCreate && orderPayload.accountCreate.email) ||
    (orderPayload.accountLogin && orderPayload.accountLogin.email)
  )
}

const getCreateOrderErrorMessage = (err, getState) => {
  const { language, brandName } = getState().config
  const l = localise.bind(null, language, brandName)
  const body = path(['response', 'body'], err)
  if (body) {
    if (body.statusCode === 504)
      return l`There's been a temporary issue. Please confirm your order again.`
    if (body.message) return body.message
    if (body.validationErrors && body.validationErrors.length)
      return body.validationErrors[0].message
    if (body.originalMessage) return body.originalMessage
  }
  return path(['response', 'text'], err)
}

export const showThirdPartyPaymentModal = (threeDSecureForm) => {
  return (dispatch) => {
    return dispatch(
      showModal(
        <ThirdPartyPaymentIFrame
          redirectionMode="three-d-secure-form"
          threeDSecureForm={threeDSecureForm}
        />,
        {
          mode: 'paymentPunchout',
        }
      )
    )
  }
}

export const redirectExternally = (destinationUrl) => {
  window.location.href = destinationUrl
}

export const redirectThreeDSecure1Challenge = ({
  vbvForm,
  punchoutReturnUrl,
}) => {
  return (dispatch, getState) => {
    const { termUrl, originalTermUrl, action, md, paReq } = vbvForm

    const formParams = {
      action,
      md,
      paReq,
      wcsReturnUrl: originalTermUrl,
    }

    if (isFeaturePSD2PunchoutPopupEnabled(getState())) {
      dispatch(ajaxCounter('decrement'))

      const threeDSecureForm = createThreeDSecure1Form({
        ...formParams,
        montyReturnUrl: punchoutReturnUrl,
      })

      return dispatch(showThirdPartyPaymentModal(threeDSecureForm))
    }

    dispatch(
      setThreeDSecurePrompt(
        createThreeDSecure1Form({
          ...formParams,
          montyReturnUrl: termUrl,
        })
      )
    )
  }
}

export const redirectThreeDSecureFlexChallenge = ({
  challengeJwt,
  challengeUrl,
  md,
}) => {
  return (dispatch) => {
    dispatch(ajaxCounter('decrement'))

    const threeDSecureForm = createThreeDSecureFlexForm({
      challengeJwt,
      challengeUrl,
      md,
    })

    return dispatch(showThirdPartyPaymentModal(threeDSecureForm))
  }
}

export const completeOrder = ({ finalisedOrder, completedOrder }) => {
  return (dispatch, getState) => {
    dispatch({ type: 'COMPLETE_ORDER' })
    try {
      // Fix Order-Completed for France billing/delivery SCRAPI BUG
      const state = getState()
      const { account, siteOptions } = state
      const {
        returnUrl,
        orderDeliveryOption: { orderId },
      } = finalisedOrder
      const regOrderCompletePath = /https?:\/\/[\w-.:]+(\/[\w-]+)(\?.+)?/i

      dispatch(
        setOrderConfirmation(
          fixEuropeanOrderCompleted(
            completedOrder,
            account.user,
            siteOptions.billingCountries
          )
        )
      )

      dispatch(setNewlyConfirmedOrder(true))
      dispatch(clearCheckoutForms())

      let redirectionToOrderComplete = regOrderCompletePath.exec(returnUrl)[1]
      // Adding query parameters so that in the scenario of User refreshing the Thank You page we
      // provide to the server side render what is needed in order to be able to perform the PUT /order
      // which is one of the needs. This to avoid displaying an error on refresh for order placed correctly
      redirectionToOrderComplete = `${redirectionToOrderComplete}?orderId=${orderId}&noRedirectionFromPaymentGateway=true`
      browserHistory.push(redirectionToOrderComplete)

      dispatch(updateMenuForAuthenticatedUser())
      // on Thank You page , sync tabs and windows hence flag true
      dispatch(updateShoppingBagBadgeCount(0, true))
      return dispatch(setThankyouPageEspots(completedOrder))
    } catch (error) {
      dispatch(clearCheckoutForms())

      throw error
    }
  }
}

export const retrievePrePaymentConfig = (orderId) => {
  return async (dispatch) => {
    try {
      dispatch(ajaxCounter('increment'))
      const response = await dispatch(
        post('/psd2/pre-payment-config', { orderId })
      )
      dispatch(setPrePaymentConfig(response.body))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export const initialiseOrderCreation = (payload) => {
  return (dispatch) => {
    dispatch(setFormMessage('order', {}))
    dispatch(clearOrderError())
    dispatch(clearOrderErrorPaymentDetails())
    dispatch(clearOrderPending()) // reset Order Visa or Paypal
    dispatch(clearThreeDSecurePrompt())
    dispatch(clearPrePaymentConfig())
    dispatch(setFinalisedOrder(payload))
  }
}

export const concludeOrderCreation = ({
  threeDSecure,
  applePaySession,
} = {}) => {
  return async (dispatch, getState) => {
    const state = getState()
    const finalisedOrder = getCheckoutFinalisedOrder(state)
    const paidWithKlarna = isPaymentTypeKlarna(state)
    const paidWithApplePay = isPaymentTypeApplePay(state)
    const paidWithClearPay = isPaymentTypeClearPay(state)

    // No need to show the loader for ApplePay
    if (!paidWithApplePay) {
      dispatch(ajaxCounter('increment'))
    }

    dispatch(clearPrePaymentConfig())

    try {
      const orderPayload =
        isFeaturePSD2ThreeDSecure2Enabled(state) && threeDSecure
          ? {
              ...finalisedOrder,
              ...threeDSecure,
              challengeWindowSize: '390x400',
              returnUrl: finalisedOrder.punchoutReturnUrl,
            }
          : finalisedOrder

      const response = await dispatch(post('/order', orderPayload))

      /**
       * Orders yet to be approved by a 3rd Party and confirmed through a latter
       * PUT /order request. They will require some SSR or external redirection
       */

      // Support for Paypal, AliPay, and China Union Pay
      const paymentProviderUrl =
        response.body.paypalUrl || response.body.paymentUrl
      if (paymentProviderUrl) {
        // if is PAYPAL and FF for smart buttons is enabled we know it is the new paypal implementation
        // if that is the case we resolve the promise and return the response.body so no redirection will happen
        if (
          finalisedOrder.paymentType === PAYPAL &&
          isFeaturePaypalSmartButtonsEnabled(state)
        ) {
          dispatch(ajaxCounter('decrement'))
          return Promise.resolve(response.body)
        }

        return redirectExternally(paymentProviderUrl)
      }

      // 3DS Flex handles 3DS1 and 3DS2. If Core API's response
      // does not have this property, fall back to the original
      // 3DS1 implementation.
      if (/^[12]\./.test(response.body.threeDSVersion)) {
        return dispatch(redirectThreeDSecureFlexChallenge(response.body))
      }

      // The original 3DS1 implementation.
      if (response.body.vbvForm) {
        return dispatch(
          redirectThreeDSecure1Challenge({
            vbvForm: response.body.vbvForm,
            punchoutReturnUrl: finalisedOrder.punchoutReturnUrl,
          })
        )
      }

      if (paidWithClearPay) {
        dispatch(initialiseClearPay(response.body))

        return dispatch(ajaxCounter('decrement'))
      }

      /* End of pending confirmation orders block */

      /**
       * The following orders have been already completed and don't require
       * any further confirmation or external redirection
       * I.E. CARD payment without 3D Secure validation, Account card, Klarna, ApplePay, etc...
       */

      // Get the user account only if it is a logged in user
      if (!isGuestOrder(state)) await dispatch(getAccount())

      if (paidWithKlarna) {
        dispatch(resetKlarna())
        if (!isGuestOrder(state)) {
          // We need to prevent this action from being dispatched for the guestCheckout.
          // If fired and a second order is placed with a card the
          // Pay Now button will be disabled.
          dispatch(blockKlarnaPayment(true))
        }
      }

      if (paidWithApplePay) {
        applePaySession.completePayment(applePaySession.STATUS_SUCCESS)
      }

      dispatch(emptyShoppingBag())
      dispatch(ajaxCounter('decrement'))

      return dispatch(
        completeOrder({
          finalisedOrder,
          completedOrder: response.body.completedOrder,
        })
      )
    } catch (error) {
      // note: PAYMENT_DECLINED still creates Account & authenticates Session
      // via the syncClientForEmailExists action below
      const email = extractEmail(finalisedOrder)
      if (email) {
        dispatch(syncClientForEmailExists(email))
      }
      dispatch(ajaxCounter('decrement'))
      const errorMessage = getCreateOrderErrorMessage(error, getState)
      const errorCode = path(['response', 'body', 'wcsErrorCode'], error)
      if (errorCode === WCS_ERRORS.OUT_OF_STOCK) {
        dispatch(getCheckoutBag())
      } else {
        dispatch(
          setFormMessage('order', {
            type: 'error',
            message: sanitizeWCSJavaErrors(errorMessage),
          })
        )
      }
      dispatch(sendAnalyticsErrorMessage(ANALYTICS_ERROR.CONFIRM_AND_PAY))
      dispatch(blockKlarnaUpdate(false))

      if (isGuestOrder(state)) {
        // Ensure to clear guest checkout details
        await dispatch(
          getOrderSummary({
            shouldUpdateBag: false,
            shouldUpdateForms: false,
            shouldSync: true,
            clearGuestDetails: true,
          })
        )
      }

      if (paidWithApplePay) {
        applePaySession.completePayment(applePaySession.STATUS_FAILURE)
      }

      return new Error(errorMessage)
    }
  }
}

export const createOrder = (payload, applePaySession) => {
  return async function createOrderThunk(dispatch, getState) {
    dispatch(initialiseOrderCreation(payload))

    // Going down this path will eventually call concludeOrderCreation()
    const state = getState()
    const { paymentType, orderDeliveryOption } = payload
    if (
      isFeaturePSD2PunchoutPopupEnabled(state) &&
      isFeaturePSD2ThreeDSecure2Enabled(state) &&
      isCard(state, paymentType)
    ) {
      return dispatch(retrievePrePaymentConfig(orderDeliveryOption.orderId))
    }

    return dispatch(concludeOrderCreation({ applePaySession }))
  }
}

export const submitOrder = (dependencies = {}) => (dispatch, getState) => {
  const { recaptchaToken = '', ...extractedDeps } = dependencies
  const deps = {
    createOrder,
    generateOrder,
    ...extractedDeps,
  }
  const state = getState()
  const {
    account: { user },
    auth,
    checkout: { orderSummary },
    config: { brandName },
    forms: {
      checkout: {
        billingAddress,
        billingCardDetails,
        billingDetails,
        deliveryInstructions,
        yourAddress,
        yourDetails,
        guestUser,
      },
    },
    paymentMethods,
  } = state
  const featureSavePaymentDetailsEnabled = isFeatureSavePaymentDetailsEnabled(
    state
  )

  const paymentConfig = getCurrentPaymentConfig(state)
  const guestRecaptchaEnabled = isGuestRecaptchaEnabled(state)
  const guestOrder = isGuestOrder(state)
  const orderCompletePath = 'order-complete'
  const psd2PunchoutPath = 'psd2-order-punchout'
  const order = deps.generateOrder({
    auth,
    billingAddress,
    billingCardDetails,
    billingDetails,
    deliveryInstructions,
    orderSummary,
    paymentMethods,
    user,
    yourAddress,
    yourDetails,
    featureSavePaymentDetailsEnabled,
    orderCompletePath,
    psd2PunchoutPath,
    isGuestOrder: guestOrder,
    guestUser,
    recaptchaToken,
    brandName,
    isGuestRecaptchaEnabled: guestRecaptchaEnabled,
    paymentConfig,
  })

  dispatch(
    sendAnalyticsPaymentMethodIntentionEvent({
      orderId: `${order.orderDeliveryOption.orderId}`,
      selectedPaymentMethod: order.paymentType,
    })
  )

  if (isPaymentTypeKlarna(state) && !isBasketTotalCoveredByGiftCards(state)) {
    return dispatch(authorizeByKlarna(prepareKlarnaPayload(state), order))
  }

  if (isPaymentTypeApplePay(state)) {
    return dispatch(performApplePayPayment(order))
  }

  return dispatch(deps.createOrder(order))
}

const updateOrderDetail = (body) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'UPDATE_ORDER_DETAIL' })
    dispatch(updateMenuForAuthenticatedUser())
    dispatch(updateShoppingBagBadgeCount(0))
    dispatch(ajaxCounter('decrement'))
    // Fix Order-Completed for France billing/delivery SCRAPI BUG
    const { account, siteOptions } = getState()

    // Get the user account only if it is a logged in user
    if (!body.isGuestOrder) await dispatch(getAccount())

    dispatch(
      setOrderConfirmation(
        fixEuropeanOrderCompleted(
          body,
          account.user,
          siteOptions.billingCountries
        )
      )
    )

    return dispatch(setThankyouPageEspots(body))
  }
}

export const psd2ConfirmOrder = (payload) => {
  return async (dispatch, getState) => {
    const state = getState()
    const { language, brandName } = state.config
    const l = localise.bind(null, language, brandName)
    const globalError = l`Unable to find order, please check your account`

    try {
      dispatch(ajaxCounter('increment'))
      dispatch(clearOrderPending()) // reset Order Visa or Paypal
      dispatch(clearThreeDSecurePrompt())
      dispatch(clearFinalisedOrder())

      const { body: orderComplete } = await dispatch(
        put('/psd2/order', payload, false)
      )

      dispatch(emptyShoppingBag())
      return dispatch(updateOrderDetail(orderComplete))
    } catch (error) {
      dispatch(ajaxCounter('decrement'))
      await dispatch(getAccount())
      const orderConfirmationError =
        error instanceof Error
          ? path(['response', 'body', 'message'], error) || error.message
          : error
      const { paymentMethod, orderId } = payload
      dispatch(setOrderErrorPaymentDetails({ paymentMethod, orderId }))
      dispatch(setOrderError(orderConfirmationError || globalError))
    }
  }
}

export const psd2GetOrder = (needArgs) => {
  // grabs the orderId from the URL
  const orderId = needArgs.orderId // 9489474
  const ORDER_HISTORY = '/account/order-history/'
  return async (dispatch) => {
    try {
      const response = await dispatch(get(`${ORDER_HISTORY}${orderId}`, false))
      return dispatch(updateOrderDetail(response.body))
    } catch (err) {
      const resp = err.response || {}
      const errMessage =
        (resp.body && resp.body.message) || 'Error getting order'
      dispatch(setOrderError(errMessage))
    }
  }
}

export const fetchPSD2Order = (needArgs) => async (dispatch, getState) => {
  await dispatch(getAccount())
  if (isUserAuthenticated(getState())) {
    await dispatch(psd2GetOrder(needArgs))
  }
}

const getOrder = () => {
  return (dispatch, getState) => {
    // Blocking the getOrderHistory called on the SSR
    // if a guest user refreshes the Thank You page after paying with a card
    if (!isUserAtLeastPartiallyAuthenticated(getState())) return
    const payload = getState().checkout.verifyPayment
    const orderId = payload.orderId

    return dispatch(get(`/account/order-history/${orderId}`, false))
      .then(({ body }) => {
        if (
          body.statusCode !== '' &&
          body.statusCode !== WCS_PENDING_PAYMENT_STATUS_CODE
        ) {
          return dispatch(updateOrderDetail(body))
        }
        dispatch(ajaxCounter('decrement'))
      })
      .catch((err) => {
        throw err
      })
  }
}

// called when returning to the site after a completed payment through a 3rd party provider
const updateOrder = () => async (dispatch, getState) => {
  const payload = getState().checkout.verifyPayment

  try {
    const { body = {} } = await dispatch(put(`/order`, payload, false))

    await dispatch(updateOrderDetail(body))
    dispatch(setNewlyConfirmedOrder(true))
  } catch (err) {
    // ADP-3271: 412 error code used below is not entirely correct https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
    // To be replaced with a 400 or 422 with error handling that captures when the order could not be updated
    // or confirmed because it is already completed
    //
    // Currently implemented for 3D Secure journeys in ConfirmOrder.jsx
    // Paypal handler to throw a similar error to be captured here ADP-3362
    if (err.status === 412) {
      // Order has been already confirmed
      return dispatch(getOrder())
    }
    throw err
  }
}

export const processOrder = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const { language, brandName } = state.config
    const l = localise.bind(null, language, brandName)
    const globalError = l`Unable to find order, please check your account`
    const payload = path(['checkout', 'verifyPayment'], state)
    const isOrderConfirmed = getRouteSearch(state).includes(
      'orderConfirmed=true'
    )
    dispatch(ajaxCounter('increment'))
    if (!payload) {
      dispatch(ajaxCounter('decrement'))
      dispatch(setOrderError(globalError))
    } else {
      try {
        return isOrderConfirmed
          ? await dispatch(getOrder())
          : await dispatch(updateOrder())
      } catch (err) {
        const resp = err.response || {}
        const errMessage =
          (resp.body && resp.body.message) ||
          resp.text ||
          'Error processing order'

        dispatch(ajaxCounter('decrement'))
        dispatch(setOrderError(errMessage))
      } finally {
        dispatch(clearOrderPending()) // reset Order Visa or Paypal
        dispatch(clearThreeDSecurePrompt())
        dispatch(clearFinalisedOrder())
      }
    }
  }
}

export const completePaypalOrder = () => async (dispatch, getState) => {
  const state = getState()
  const payload = state.checkout.verifyPayment
  const finalisedOrder = getCheckoutFinalisedOrder(state)

  dispatch(ajaxCounter('increment'))

  try {
    const { body: completedOrder } = await dispatch(
      put(`/order`, payload, false)
    )

    return dispatch(completeOrder({ finalisedOrder, completedOrder }))
  } catch (error) {
    throw error
  } finally {
    dispatch(ajaxCounter('decrement'))
  }
}
