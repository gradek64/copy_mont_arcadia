import { CLEARPAY } from '../../constants/paymentTypes'
import { getAfterPayScriptUrl } from '../../selectors/clearPaySelectors'
import { setFormMessage } from './formActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { setOrderPending, processOrder, completeOrder } from './orderActions'
import { sendAnalyticsPaymentMethodPurchaseFailureEvent } from '../../../shared/analytics/analytics-actions'
import {
  getCheckoutFinalisedOrder,
  getCheckoutOrderCompleted,
  getCheckoutOrderError,
} from '../../selectors/checkoutSelectors'

const showErrorAction = (dispatch) => (
  message = 'An error has occurred. Please try again'
) => {
  dispatch(
    setFormMessage('order', {
      type: 'error',
      message,
    })
  )
  dispatch(ajaxCounter('decrement'))
}

export const initialiseClearPay = (createOrderResponse = {}) => {
  return (dispatch, getState) => {
    const {
      paymentToken,
      policyId,
      tranId,
      success,
      errorMessage,
    } = createOrderResponse
    const state = getState()
    const afterPayScriptUrl = getAfterPayScriptUrl(state)
    const finalisedOrder = getCheckoutFinalisedOrder(state)
    const {
      orderDeliveryOption: { orderId },
    } = finalisedOrder
    const showError = showErrorAction(dispatch)

    dispatch(ajaxCounter('increment'))

    if (!success) return showError(errorMessage)
    if (!window.loadScript) return showError()

    const initClearPay = ({ attempts = 0 } = {}) => {
      // window.AfterPay can be unavailable just after we load the script.
      // Especially for slow connection, we need to wait till the object is available.

      if (attempts > 0 && !window.AfterPay)
        return setTimeout(() => {
          initClearPay({ attempts: attempts - 1 })
        }, 500)

      if (!paymentToken || !window.AfterPay) return showError()

      window.AfterPay.initialize({ countryCode: 'GB' })
      window.AfterPay.open()
      window.AfterPay.onComplete = async (event) => {
        const { status, orderToken } = event.data

        if (status === 'SUCCESS') {
          const payload = {
            orderId,
            token: orderToken,
            authProvider: CLEARPAY,
            userAgent: '',
            tran_id: tranId,
            policyId,
          }

          // PUT /order
          dispatch(setOrderPending(payload))

          await dispatch(processOrder())

          const orderError = getCheckoutOrderError(getState())
          const orderCompleted = getCheckoutOrderCompleted(getState())

          if (orderError) {
            dispatch(
              sendAnalyticsPaymentMethodPurchaseFailureEvent({
                orderId,
                selectedPaymentMethod: CLEARPAY,
              })
            )
            return showError(orderError)
          }

          await dispatch(
            completeOrder({
              finalisedOrder,
              completedOrder: orderCompleted,
            })
          )

          dispatch(ajaxCounter('decrement'))
        } else {
          showError()
        }
      }

      window.AfterPay.transfer({ token: paymentToken })
    }

    // Avoid to load the script more than one time.
    // e.g user attempt for the second time with ClearPay.
    if (window.AfterPay) {
      initClearPay()
    } else {
      window.loadScript({
        src: afterPayScriptUrl,
        isAsync: false,
        onload: () => initClearPay({ attempts: 10 }),
        onerror: () => showError(),
      })
    }
  }
}
