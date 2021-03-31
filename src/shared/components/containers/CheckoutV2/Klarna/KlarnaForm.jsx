import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// ACTIONS
import {
  blockKlarnaPayment,
  blockKlarnaUpdate,
  createKlarnaSession,
  loadKlarnaForm,
  updateKlarnaSession,
} from '../../../../actions/common/klarnaActions'

// SELECTORS
import {
  getKlarnaIsKlarnaPaymentBlocked,
  getKlarnaIsKlarnaUpdateBlocked,
  isCountrySupportedByKlarna,
  shouldInitialiseKlarnaSession,
} from '../../../../selectors/klarnaSelectors'
import { getShoppingBagOrderId } from '../../../../selectors/shoppingBagSelectors'
import {
  getBasketDeliveryOptions,
  getCheckoutAmount,
} from '../../../../selectors/checkoutSelectors'
import { isModalOpen } from '../../../../selectors/modalSelectors'

// UTILS
import { hasOrderBeenUpdated } from '../../../../lib/checkout-utilities/klarna-utils'

@connect(
  (state) => ({
    deliveryOptions: getBasketDeliveryOptions(state),
    isKlarnaPaymentBlocked: getKlarnaIsKlarnaPaymentBlocked(state),
    isKlarnaUpdateBlocked: getKlarnaIsKlarnaUpdateBlocked(state),
    isModalOpen: isModalOpen(state),
    orderId: getShoppingBagOrderId(state),
    shouldInitialiseKlarnaSession: shouldInitialiseKlarnaSession(state),
    total: getCheckoutAmount(state),
    isCountrySupportedByKlarna: isCountrySupportedByKlarna(state),
  }),
  {
    blockKlarnaUpdate,
    blockKlarnaPayment,
    createKlarnaSession,
    updateKlarnaSession,
    loadKlarnaForm,
  }
)
class KlarnaForm extends Component {
  static propTypes = {
    deliveryOptions: PropTypes.array.isRequired,
    isKlarnaPaymentBlocked: PropTypes.bool.isRequired,
    isKlarnaUpdateBlocked: PropTypes.bool.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    orderId: PropTypes.number.isRequired,
    shouldInitialiseKlarnaSession: PropTypes.bool.isRequired,
    blockKlarnaUpdate: PropTypes.func,
    blockKlarnaPayment: PropTypes.func,
    createKlarnaSession: PropTypes.func,
    updateKlarnaSession: PropTypes.func,
    total: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isCountrySupportedByKlarna: PropTypes.bool,
  }

  componentDidMount() {
    const {
      orderId,
      shouldInitialiseKlarnaSession,
      createKlarnaSession,
      updateKlarnaSession,
      blockKlarnaUpdate,
    } = this.props
    blockKlarnaUpdate(true)

    if (shouldInitialiseKlarnaSession) {
      createKlarnaSession({ orderId })
    } else {
      updateKlarnaSession(true)
    }
  }

  shouldComponentUpdate(prevProps) {
    this.shouldComponentUpdateKlarnaIframe(prevProps)
    // KlarnaForm is never required to re-render. Only the Klarna Iframe
    // controlled by the Klarna SDK
    return false
  }

  shouldComponentUpdateKlarnaIframe(prevProps) {
    const {
      isKlarnaUpdateBlocked,
      isModalOpen,
      updateKlarnaSession,
      deliveryOptions,
      total,
    } = this.props
    const isTotalGreaterThanZero = prevProps.total > 0

    if (isKlarnaUpdateBlocked || isModalOpen) return

    if (
      prevProps.isCountrySupportedByKlarna &&
      hasOrderBeenUpdated({ deliveryOptions, total }, prevProps) &&
      isTotalGreaterThanZero
    ) {
      blockKlarnaUpdate(true)
      updateKlarnaSession()
    }
  }

  componentWillUnmount() {
    const {
      isKlarnaUpdateBlocked,
      isKlarnaPaymentBlocked,
      blockKlarnaUpdate,
      blockKlarnaPayment,
    } = this.props
    if (isKlarnaUpdateBlocked) blockKlarnaUpdate(false)
    if (isKlarnaPaymentBlocked) blockKlarnaPayment(false)
  }

  render() {
    return <section className="KlarnaForm" />
  }
}

export default KlarnaForm
