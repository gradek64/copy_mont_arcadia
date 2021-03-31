import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { getItem, setItem } from '../../../../../client/lib/cookie/utils'

// Actions
import { getAccount } from '../../../../actions/common/accountActions'
import { resetForm, setFormField } from '../../../../actions/common/formActions'
import { fetchPSD2Order } from '../../../../actions/common/orderActions'
import { resetStoreLocator } from '../../../../actions/components/StoreLocatorActions'
import { getOrderCompleteEspot } from '../../../../actions/common/espotActions'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'

// Decorators
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'

// Selectors
import { isFeatureEnabled } from '../../../../selectors/featureSelectors'
import {
  getCheckoutOrderCompleted,
  getCheckoutOrderError,
} from '../../../../selectors/checkoutSelectors'
import { getVisitedPaths } from '../../../../selectors/routingSelectors'
import { isMobile } from '../../../../selectors/viewportSelectors'

// Components
import OrderCompleteSummary from '../../CheckoutV2/Summary/OrderCompleteSummary'

@analyticsDecorator('order-completed', {
  isAsync: true,
})
@connect(
  (state) => ({
    hasUser: isEmpty(state.account.user),
    isFirstVisit: getVisitedPaths(state).length === 1,
    isMobile: isMobile(state),
    orderCompleted: getCheckoutOrderCompleted(state),
    isDiscoverMoreEnabled: isFeatureEnabled(
      state,
      'FEATURE_CONFIRMATION_DISCOVER_MORE'
    ),
    orderError: getCheckoutOrderError(state),
  }),
  {
    fetchPSD2Order,
    getAccount,
    resetStoreLocator,
    resetForm,
    getOrderCompleteEspot,
    setFormField,
  }
)
class OrderSuccess extends Component {
  static propTypes = {
    hasUser: PropTypes.bool,
    isFirstVisit: PropTypes.bool,
    isMobile: PropTypes.bool,
    orderCompleted: PropTypes.object.isRequired,
    orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    getAccount: PropTypes.func.isRequired,
    getOrderCompleteEspot: PropTypes.func,
  }

  static defaultProps = {
    hasUser: false,
    isFirstVisit: false,
    isMobile: true,
    orderCompleted: {},
    orderSubtotal: '',
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  static needs = [getAllPaymentMethods, fetchPSD2Order]

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

  componentDidMount() {
    const {
      hasUser,
      getAccount,
      isFirstVisit,
      getOrderCompleteEspot,
      isDiscoverMoreEnabled,
      isMobile,
      orderCompleted,
      orderError,
      setFormField,
    } = this.props

    // Set bagCount cookie value to zero when order is completed
    const key = 'bagCount'
    const bagCount = getItem(key)
    if (bagCount > 0) {
      setItem(key, 0)
    }

    if (isDiscoverMoreEnabled && !isMobile) {
      getOrderCompleteEspot()
    }

    if (!hasUser && !isFirstVisit) {
      getAccount()
    }

    if (window) window.scrollTo(0, 0)

    // Redirects the guest user to the home page on page refresh
    if (!orderError && isEmpty(orderCompleted)) {
      browserHistory.push('/')
    }

    // Set the email address if it is a guest order and if the email has not been registered before
    if (orderCompleted.isGuestOrder && !orderCompleted.isRegisteredEmail)
      setFormField('register', 'email', orderCompleted.guestUserEmail)
  }

  buttonClickHandler() {
    browserHistory.push('/')
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

export default OrderSuccess
