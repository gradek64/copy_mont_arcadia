import { isEmpty, path } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// Decorators
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'
import {
  sendAnalyticsOrderCompleteEvent,
  sendAnalyticsPaymentMethodPurchaseSuccessEvent,
  sendAnalyticsPaymentMethodPurchaseFailureEvent,
  sendAnalyticsPurchaseEvent,
} from '../../../../analytics'

// Actions
import { getAccount } from '../../../../actions/common/accountActions'
import { resetForm, setFormField } from '../../../../actions/common/formActions'
import {
  clearPrePaymentConfig,
  processOrder,
  setNewlyConfirmedOrder,
} from '../../../../actions/common/orderActions'
import { resetStoreLocator } from '../../../../actions/components/StoreLocatorActions'
import { getOrderCompleteEspot } from '../../../../actions/common/espotActions'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'

// Selectors
import { isFeatureEnabled } from '../../../../selectors/featureSelectors'
import {
  getNewlyConfirmedOrder,
  getCheckoutOrderError,
  getCheckoutOrderCompleted,
} from '../../../../selectors/checkoutSelectors'
import {
  getRoutePathWithParams,
  getLocationQuery,
} from '../../../../selectors/routingSelectors'
import { isUserAtLeastPartiallyAuthenticated } from '../../../../selectors/userAuthSelectors'

// Components
import OrderCompleteSummary from './OrderCompleteSummary'

// Constants
import { setItem } from '../../../../../client/lib/cookie/utils'

@analyticsDecorator('order-completed', {
  isAsync: true,
})
@connect(
  (state) => ({
    currencyCode: state.siteOptions.currencyCode,
    hasUser: isEmpty(state.account.user),
    isFirstVisit: state.routing.visited.length === 1,
    orderCompleted: getCheckoutOrderCompleted(state),
    orderError: getCheckoutOrderError(state),
    isNewlyConfirmedOrder: getNewlyConfirmedOrder(state),
    routeWithParams: getRoutePathWithParams(state),
    isDiscoverMoreEnabled: isFeatureEnabled(
      state,
      'FEATURE_CONFIRMATION_DISCOVER_MORE'
    ),
    locationQuery: getLocationQuery(state),
    isAuthenticated: isUserAtLeastPartiallyAuthenticated(state),
  }),
  {
    getAccount,
    resetStoreLocator,
    // TEMPORARY DUPLICATE EVENT, part of GTM investigation
    sendAnalyticsOrderCompleteEvent,
    sendAnalyticsPaymentMethodPurchaseSuccessEvent,
    sendAnalyticsPaymentMethodPurchaseFailureEvent,
    sendAnalyticsPurchaseEvent,
    setNewlyConfirmedOrder,
    resetForm,
    getOrderCompleteEspot,
    clearPrePaymentConfig,
    setFormField,
  }
)
class OrderComplete extends Component {
  static propTypes = {
    currencyCode: PropTypes.string,
    hasUser: PropTypes.bool,
    isFirstVisit: PropTypes.bool,
    orderCompleted: PropTypes.object.isRequired,
    orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    getAccount: PropTypes.func.isRequired,
    sendAnalyticsOrderCompleteEvent: PropTypes.func,
    sendAnalyticsPaymentMethodPurchaseSuccessEvent: PropTypes.func,
    sendAnalyticsPaymentMethodPurchaseFailureEvent: PropTypes.func,
    sendAnalyticsPurchaseEvent: PropTypes.func,
    isNewlyConfirmedOrder: PropTypes.bool,
    resetStoreLocator: PropTypes.func,
    setNewlyConfirmedOrder: PropTypes.func,
    resetForm: PropTypes.func,
    getOrderCompleteEspot: PropTypes.func,
    locationQuery: PropTypes.object.isRequired,
    clearPrePaymentConfig: PropTypes.func,
    isAuthenticated: PropTypes.bool,
  }

  static defaultProps = {
    currencyCode: 'GBP',
    hasUser: false,
    isFirstVisit: false,
    orderError: false,
    orderCompleted: {},
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  static needs = [getAccount, getAllPaymentMethods, processOrder]

  constructor(props) {
    super(props)
    this.buttonClickHandler = this.gotoNextPage.bind(this)
  }

  componentDidMount() {
    const {
      hasUser,
      getAccount,
      isFirstVisit,
      orderCompleted,
      orderError,
      currencyCode,
      sendAnalyticsOrderCompleteEvent,
      sendAnalyticsPurchaseEvent,
      sendAnalyticsPaymentMethodPurchaseSuccessEvent,
      sendAnalyticsPaymentMethodPurchaseFailureEvent,
      isNewlyConfirmedOrder,
      routeWithParams,
      setNewlyConfirmedOrder,
      getOrderCompleteEspot,
      isDiscoverMoreEnabled,
      locationQuery,
      clearPrePaymentConfig,
      isAuthenticated,
      setFormField,
    } = this.props

    // @NOTE One-time-only event. Set as soon as order is confirmed in the client or on SSR for 3rd party payments
    if (isNewlyConfirmedOrder) {
      // Set bagCount cookie value to zero when order is completed
      setItem('bagCount', 0)
      // Send GA events
      sendAnalyticsOrderCompleteEvent(orderCompleted) // @NOTE to confirm if this event can be removed once the data loss issue is solved
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

      // ADP-580 workaround to distinguish 3rd party payment `order-complete` SSRs from page-refreshes
      browserHistory.replace(`${routeWithParams}&orderConfirmed=true`)
      setNewlyConfirmedOrder(false)
    }

    clearPrePaymentConfig()

    if (isDiscoverMoreEnabled) getOrderCompleteEspot()

    if (!hasUser && !isFirstVisit) {
      getAccount()
    }

    if (window) window.scrollTo(0, 0)

    // FIRE GLOBAL EVENT NEED FOR OPEN-TAGS-ANALITYCS
    if (process.browser) {
      document.dispatchEvent(
        new CustomEvent('purchase', {
          detail: {
            value: orderCompleted.totalOrderPrice,
            currency: currencyCode,
          },
        })
      )
    }

    if (orderError) {
      const { paymentMethod, orderId } = locationQuery

      // Avoid potential over-reporting of payment failures if orderError has been
      // set for unrelated reasons, for example direct manipulation of the URL.
      if (paymentMethod && orderId) {
        // Paypal (PYPAL) sometimes comes through as 'PYPAL/some-extraneous-detail'
        // so this extracts the payment method if such detail is present.
        const matches = /^(\w+)\//.exec(paymentMethod)

        sendAnalyticsPaymentMethodPurchaseFailureEvent({
          orderId,
          selectedPaymentMethod: matches ? matches[1] : paymentMethod,
        })
      }

      if (!isAuthenticated) {
        browserHistory.push('/guest/checkout/payment')
      } else {
        browserHistory.push('/checkout')
      }
    }

    // Redirects the guest user to the home page on page refresh
    if (!orderError && isEmpty(orderCompleted)) {
      browserHistory.push('/')
    }

    // Set the email address if it is a guest order and if the email has not been registered before
    if (orderCompleted.isGuestOrder && !orderCompleted.isRegisteredEmail)
      setFormField('register', 'email', orderCompleted.guestUserEmail)
  }

  componentWillUnmount() {
    const { resetStoreLocator, resetForm } = this.props
    resetStoreLocator()
    resetForm('billingCardDetails', {
      paymentType: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      startMonth: '',
      startYear: '',
      cvv: '',
    })
    resetForm('register', {
      email: '',
      password: '',
      subscribe: false,
      rememberMeRegister: false,
    })
  }

  gotoNextPage() {
    browserHistory.push(this.props.orderError ? '/checkout' : '/')
  }

  render() {
    const { isDiscoverMoreEnabled, orderCompleted, orderError } = this.props

    return (
      <OrderCompleteSummary
        buttonClickHandler={this.buttonClickHandler}
        isDiscoverMoreEnabled={isDiscoverMoreEnabled}
        orderCompleted={orderCompleted}
        orderError={orderError}
      />
    )
  }
}

export default OrderComplete
