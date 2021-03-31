// Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Actions
import {
  getOrderSummary,
  clearOutOfStockError,
  clearCheckoutForms,
} from '../../../../actions/common/checkoutActions'
import { sessionReset } from '../../../../actions/common/sessionActions'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'
import { openMiniBag } from '../../../../actions/common/shoppingBagActions'
import { clearOrderError } from '../../../../actions/common/orderActions'

// Selectors
import {
  getCheckoutOrderError,
  getCheckoutOrderSummary,
  getThreeDSecurePrompt,
} from '../../../../selectors/checkoutSelectors'
import { getLocation } from '../../../../selectors/routingSelectors'

// Components
import CheckoutMessage from '../../../common/CheckoutMessage/CheckoutMessage'
import CheckoutBagSide from '../../../common/CheckoutBagSide/CheckoutBagSide'
import CheckoutProgressTracker from '../../CheckoutV2/shared/CheckoutProgressTracker'
import ContactBanner from '../../../common/ContactBanner/ContactBanner'

@connect(
  (state) => ({
    errorSession: state.errorSession,
    threeDSecurePrompt: getThreeDSecurePrompt(state),
    orderError: getCheckoutOrderError(state),
    orderSummary: getCheckoutOrderSummary(state),
    isOutOfStockInCheckout: state.checkout.isOutOfStockInCheckout,
    location: getLocation(state),
  }),
  {
    clearCheckoutForms,
    getOrderSummary,
    sessionReset,
    getAllPaymentMethods,
    clearOutOfStockError,
    openMiniBag,
    clearOrderError,
  }
)
class GuestCheckoutContainer extends Component {
  static propTypes = {
    threeDSecurePrompt: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    children: PropTypes.node,
    errorSession: PropTypes.object,
    location: PropTypes.object.isRequired,
    orderSummary: PropTypes.object.isRequired,
    getOrderSummary: PropTypes.func.isRequired,
    clearCheckoutForms: PropTypes.func.isRequired,
    clearOrderError: PropTypes.func.isRequired,
    // sessionReset: PropTypes.func.isRequired,
    // clearOutOfStockError: PropTypes.func.isRequired,
    // isOutOfStockInCheckout: PropTypes.bool,
    // openMiniBag: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { getOrderSummary, getAllPaymentMethods } = this.props
    getOrderSummary()
    getAllPaymentMethods()
  }

  componentDidUpdate() {
    const { orderError, orderSummary, getOrderSummary } = this.props

    /**
     * This is a workaround covering those journeys in which a guest customer submits
     * an order that results in failure.
     * I.E. After landing in the payment page from a failed Paypal payment request, WCS
     * will return user's addresses (for GET /orderSummary) so Monty can populate the forms
     * and allow the customer to quickly select an alternative payment method.
     *
     * This persisted data in the orderSummary must be cleared asap so it is not available
     * accross different sessions and therefore the condition below.
     *
     * When dispatching getOrderSummary with option `clearGuestDetails: true` the GET request
     * will instruct WCS to clear any guest user data on that orderSummary
     */
    if (orderError && orderSummary.email) {
      getOrderSummary({
        clearGuestDetails: true,
        shouldUpdateForms: false,
      })
    }
  }

  componentWillUnmount() {
    const { clearCheckoutForms, clearOrderError } = this.props

    window.onpopstate = null

    clearCheckoutForms()
    clearOrderError()
  }

  isCollectFromStore = (location) =>
    location.pathname.startsWith('/guest/checkout/delivery/collect-from-store')

  sendForm = () => {
    document.getElementById('paymentForm').submit()
  }

  render() {
    const {
      threeDSecurePrompt,
      children,
      location,
      errorSession,
      orderSummary,
    } = this.props
    const inCollectFromStore = this.isCollectFromStore(location)
    const isSessionError = errorSession && errorSession.sessionExpired
    const hideBreadCrumbs = inCollectFromStore

    return (
      <section
        role="main"
        className={`CheckoutContainer ${
          inCollectFromStore ? 'CheckoutContainer-collectFromStore' : ''
        }`}
      >
        <div
          className={`CheckoutContainer-row ${
            hideBreadCrumbs ? 'is-hidden' : ''
          }`}
        >
          <div className="CheckoutContainer-fullWidth">
            <CheckoutProgressTracker />
          </div>
        </div>
        <ContactBanner />
        <div className="CheckoutContainer-row">
          <div className="CheckoutContainer-groupLeft">
            {!isSessionError && <CheckoutMessage />}
            {threeDSecurePrompt && (
              <div
                ref={() => this.sendForm()}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: threeDSecurePrompt }}
              />
            )}
            {!isSessionError && children}
          </div>
          {orderSummary.basket && (
            <div className="CheckoutContainer-groupRight">
              <CheckoutBagSide orderSummary={orderSummary} showDiscounts />
            </div>
          )}
        </div>
      </section>
    )
  }
}

export default GuestCheckoutContainer
