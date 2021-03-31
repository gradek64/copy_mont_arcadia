import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// Selectors
import { getLocationQuery } from '../../../../selectors/routingSelectors'
import { isUserAtLeastPartiallyAuthenticated } from '../../../../selectors/userAuthSelectors'

// Actions
import { getAccount } from '../../../../actions/common/accountActions'
import { setOrderError } from '../../../../actions/common/orderActions'
import { sendAnalyticsPaymentMethodPurchaseFailureEvent } from '../../../../analytics'

@connect(
  (state) => ({
    locationQuery: getLocationQuery(state),
    isAuthenticated: isUserAtLeastPartiallyAuthenticated(state),
  }),
  {
    setOrderError,
    sendAnalyticsPaymentMethodPurchaseFailureEvent,
  }
)
class OrderFailure extends Component {
  static needs = [getAccount]

  static propTypes = {
    locationQuery: PropTypes.object.isRequired,
    setOrderError: PropTypes.func.isRequired,
    sendAnalyticsPaymentMethodPurchaseFailureEvent: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const {
      sendAnalyticsPaymentMethodPurchaseFailureEvent,
      setOrderError,
      locationQuery: { error, orderId, paymentMethod },
      isAuthenticated,
    } = this.props

    if (error) {
      setOrderError(error)
    }

    sendAnalyticsPaymentMethodPurchaseFailureEvent({
      orderId,
      selectedPaymentMethod: paymentMethod,
    })

    if (!isAuthenticated) {
      browserHistory.replace('/guest/checkout/payment')
    } else {
      browserHistory.replace('/checkout')
    }
  }

  render() {
    const { l } = this.context

    return (
      <div className="OrderFailure">{l`Your order could not be completed`}</div>
    )
  }
}

export default OrderFailure
