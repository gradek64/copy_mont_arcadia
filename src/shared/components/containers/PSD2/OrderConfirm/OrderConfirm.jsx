import React, { PureComponent } from 'react'
import { path } from 'ramda'
import qs from 'qs'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Actions
import { ajaxCounter } from '../../../../actions/components/LoaderOverlayActions'
import { psd2ConfirmOrder } from '../../../../actions/common/orderActions'
import {
  sendAnalyticsOrderCompleteEvent,
  sendAnalyticsPaymentMethodPurchaseSuccessEvent,
  sendAnalyticsPurchaseEvent,
} from '../../../../analytics'

// Selectors
import {
  getCheckoutOrderCompleted,
  getCheckoutOrderError,
  getCheckoutOrderErrorPaymentDetails,
} from '../../../../selectors/checkoutSelectors'

@connect(
  (state) => ({
    orderCompleted: getCheckoutOrderCompleted(state),
    orderError: getCheckoutOrderError(state),
    orderErrorPaymentDetails: getCheckoutOrderErrorPaymentDetails(state),
  }),
  {
    psd2ConfirmOrder,
    ajaxCounter,
    sendAnalyticsOrderCompleteEvent,
    sendAnalyticsPaymentMethodPurchaseSuccessEvent,
    sendAnalyticsPurchaseEvent,
  }
)
class OrderConfirm extends PureComponent {
  static propTypes = {
    orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    orderErrorPaymentDetails: PropTypes.object,
    orderCompleted: PropTypes.object,
    psd2ConfirmOrder: PropTypes.func.isRequired,
    ajaxCounter: PropTypes.func.isRequired,
    sendAnalyticsOrderCompleteEvent: PropTypes.func.isRequired,
    sendAnalyticsPaymentMethodPurchaseSuccessEvent: PropTypes.func.isRequired,
    sendAnalyticsPurchaseEvent: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  sendGoogleAnalyticsHits() {
    const {
      orderCompleted,
      sendAnalyticsOrderCompleteEvent,
      sendAnalyticsPaymentMethodPurchaseSuccessEvent,
      sendAnalyticsPurchaseEvent,
    } = this.props

    // @NOTE Can the 'order complete' event can be removed once
    // the data loss issue is solved?
    sendAnalyticsOrderCompleteEvent(orderCompleted)
    sendAnalyticsPurchaseEvent()

    const orderId = path(['orderId'], orderCompleted)
    const selectedPaymentMethod = path(
      ['paymentDetails', '0', 'selectedPaymentMethod'],
      orderCompleted
    )
    if (selectedPaymentMethod) {
      sendAnalyticsPaymentMethodPurchaseSuccessEvent({
        orderId: `${orderId}`,
        selectedPaymentMethod,
      })
    }
  }

  async componentDidMount() {
    this.props.ajaxCounter('increment')

    const matches = /^\??(.*)$/.exec(window.location.search)
    const queryString = matches ? matches[1] : ''
    const {
      catalogId,
      orderId,
      storeId,
      ga,
      hostname,
      paymentMethod,
    } = qs.parse(queryString)

    await this.props.psd2ConfirmOrder({
      catalogId, // "33057"
      orderId, // "9489474"
      storeId, // "12556"
      ga, // "GA1.2.12345678.12345678"
      hostname, // "local.m.topshop.com"
      paymentMethod, // "VISA"
    })

    this.props.ajaxCounter('decrement')
  }

  componentWillUnmount() {
    this.props.ajaxCounter('decrement')
  }

  componentDidUpdate() {
    const {
      orderError,
      orderErrorPaymentDetails,
      orderCompleted: { orderId } = {},
    } = this.props

    if (orderError) {
      const { paymentMethod, orderId: errorOrderId } =
        orderErrorPaymentDetails || {}

      const params = [
        ...(paymentMethod ? [`paymentMethod=${paymentMethod}`] : []),
        ...(errorOrderId ? [`orderId=${errorOrderId}`] : []),
      ]

      const failureQuery = params.length ? `?${params.join('&')}` : ''

      browserHistory.replace(`/psd2-order-failure${failureQuery}`)
    } else if (orderId) {
      this.sendGoogleAnalyticsHits()
      browserHistory.replace(`/psd2-order-success/${orderId}`)
    }
  }

  render() {
    const { l } = this.context

    return <div className="OrderConfirm">{l`Confirming your order...`}</div>
  }
}

export default OrderConfirm
