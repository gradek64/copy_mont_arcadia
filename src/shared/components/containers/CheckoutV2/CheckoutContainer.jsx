// Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Actions
import {
  getOrderSummary,
  getAccountAndOrderSummary,
  clearOutOfStockError,
} from '../../../actions/common/checkoutActions'
import { sessionReset } from '../../../actions/common/sessionActions'
import { getAllPaymentMethods } from '../../../actions/common/paymentMethodsActions'
import { openMiniBag } from '../../../actions/common/shoppingBagActions'
import { getContent } from '../../../actions/common/sandBoxActions'

// Constants
import espotsMobile from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'

// Selectors
import {
  getCheckoutOrderSummary,
  getThreeDSecurePrompt,
} from '../../../selectors/checkoutSelectors'
import {
  getLocation,
  getVisitedPaths,
} from '../../../selectors/routingSelectors'

// Components
import CheckoutMessage from '../../common/CheckoutMessage/CheckoutMessage'
import CheckoutBagSide from '../../common/CheckoutBagSide/CheckoutBagSide'
import CheckoutProgressTracker from '../CheckoutV2/shared/CheckoutProgressTracker'
import ContactBanner from '../../common/ContactBanner/ContactBanner'

@connect(
  (state) => ({
    errorSession: state.errorSession,
    threeDSecurePrompt: getThreeDSecurePrompt(state),
    orderSummary: getCheckoutOrderSummary(state),
    isOutOfStockInCheckout: state.checkout.isOutOfStockInCheckout,
    location: getLocation(state),
    visited: getVisitedPaths(state),
  }),
  {
    getOrderSummary,
    sessionReset,
    getAllPaymentMethods,
    clearOutOfStockError,
    openMiniBag,
  }
)
class CheckoutContainer extends Component {
  static propTypes = {
    threeDSecurePrompt: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    children: PropTypes.node,
    errorSession: PropTypes.object,
    location: PropTypes.object.isRequired,
    orderSummary: PropTypes.object.isRequired,
    visited: PropTypes.array,
    getOrderSummary: PropTypes.func.isRequired,
    sessionReset: PropTypes.func.isRequired,
    clearOutOfStockError: PropTypes.func.isRequired,
    isOutOfStockInCheckout: PropTypes.bool,
    openMiniBag: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  // When navigating to checkout out we assume that you have a valid session
  // The sessionExpired error state might not have been cleared, as a guard the sessionError state is reset.
  UNSAFE_componentWillMount() {
    const { sessionReset } = this.props
    sessionReset()
  }

  isLogin = ({ pathname }) => pathname.includes('login')

  processClientSideMounting = () => {
    const { getOrderSummary, location, getAllPaymentMethods } = this.props
    const inDeliveryAndPayment = location.pathname.endsWith('/delivery-payment')

    if (!this.isLogin(location)) {
      getOrderSummary({
        shouldUpdateBag: true,
        shouldUpdateForms: inDeliveryAndPayment,
      })
    }

    getAllPaymentMethods()
  }

  componentDidMount() {
    const {
      visited,
      clearOutOfStockError,
      isOutOfStockInCheckout,
      openMiniBag,
    } = this.props

    if (visited.length > 1) {
      this.processClientSideMounting()
    }

    if (isOutOfStockInCheckout) {
      browserHistory.push('/')
      openMiniBag()
      clearOutOfStockError()
    }
  }

  componentWillUnmount() {
    window.onpopstate = null
  }

  isCollectFromStore = (location) =>
    location.pathname.startsWith('/checkout/delivery/collect-from-store')

  sendForm = () => {
    document.getElementById('paymentForm').submit()
  }

  // Get
  static needs = [
    getAccountAndOrderSummary,
    getAllPaymentMethods,
    () =>
      getContent(null, espotsMobile.checkout[0], cmsConsts.ESPOT_CONTENT_TYPE),
  ]

  render() {
    const {
      threeDSecurePrompt,
      children,
      location,
      errorSession,
      orderSummary,
    } = this.props
    const inCollectFromStore = this.isCollectFromStore(location)
    const isLogin = this.isLogin(location)
    const isSessionError = errorSession && errorSession.sessionExpired
    const hideBreadCrumbs = isLogin || inCollectFromStore

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
            {!isLogin && !isSessionError && <CheckoutMessage />}
            {threeDSecurePrompt && (
              <div
                ref={() => this.sendForm()}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: threeDSecurePrompt }}
              />
            )}
            {!isSessionError && children}
          </div>
          {!isLogin &&
            orderSummary.basket && (
              <div className="CheckoutContainer-groupRight">
                <CheckoutBagSide orderSummary={orderSummary} showDiscounts />
              </div>
            )}
        </div>
      </section>
    )
  }
}

export default CheckoutContainer
