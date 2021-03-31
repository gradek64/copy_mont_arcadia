import PropTypes from 'prop-types'
import { path, isEmpty } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import QubitReact from 'qubit-react/wrapper'

import { isMobileBreakpoint } from '../../../../selectors/viewportSelectors'
import * as paymentTypes from '../../../../constants/paymentTypes'

// actions
import { setFormField } from '../../../../actions/common/formActions'
import {
  saveSelectedPaymentMethod,
  setManualAddressMode,
  openPaymentMethods,
  closePaymentMethods,
} from '../../../../actions/common/checkoutActions'

import {
  setApplePayAvailability,
  setApplePayAsDefaultPayment,
} from '../../../../actions/common/applePayActions'

// components
import PaymentDetails from './PaymentDetails/PaymentDetails'
import {
  selectPaymentMethodForStoredPaymentDetails,
  selectDecoratedCombinedPaymentMethods,
  getSavedPaymentTypeFromAccount,
  getSelectedPaymentTypeFromForms,
} from '../../../../selectors/paymentMethodSelectors'
import {
  selectStoredPaymentDetails,
  getUserSelectedPaymentOptionType,
} from '../../../../selectors/common/accountSelectors'
import { selectInDeliveryAndPayment } from '../../../../selectors/routingSelectors'
import { isPaymentTypeFieldDirty } from '../../../../selectors/formsSelectors'
import {
  getSelectedPaymentMethod,
  storedCardHasExpired,
} from '../../../../selectors/checkoutSelectors'
import { getShoppingBagTotalItems } from '../../../../selectors/shoppingBagSelectors'
import { isCountrySupportedByKlarna } from '../../../../selectors/klarnaSelectors'

const mapStateToProps = (state = {}) => {
  return {
    inDeliveryAndPayment: selectInDeliveryAndPayment(state),
    billingAddressForm: path(['forms', 'checkout', 'billingAddress'], state),
    billingDetailsForm: path(['forms', 'checkout', 'billingDetails'], state),
    combinedPaymentMethods: selectDecoratedCombinedPaymentMethods(state),
    storedPaymentDetails: selectStoredPaymentDetails(state),
    storedPaymentMethod: selectPaymentMethodForStoredPaymentDetails(state),
    storedCombinedPaymentMethod: getSavedPaymentTypeFromAccount(state),
    selectedCombinedPaymentMethod: getSelectedPaymentTypeFromForms(state),
    isMobileBreakpoint: isMobileBreakpoint(state),
    storedCardHasExpired: storedCardHasExpired(state),
    userAccountSelectedPaymentMethod: getUserSelectedPaymentOptionType(state),
    showPaymentForm: isPaymentTypeFieldDirty(state),
    shoppingBagTotalItems: getShoppingBagTotalItems(state),
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    isCountrySupportedByKlarna: isCountrySupportedByKlarna(state),
    isApplePayAvailable: state.applePay.canMakePayments,
    isApplePayAvailableWithActiveCard:
      state.applePay.canMakePaymentsWithActiveCard,
  }
}

const mapDispatchToProps = {
  setFormField,
  setManualAddressMode,
  saveSelectedPaymentMethod,
  openPaymentMethods,
  closePaymentMethods,
  setApplePayAvailability,
  setApplePayAsDefaultPayment,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class PaymentDetailsContainer extends Component {
  static propTypes = {
    setFormField: PropTypes.func.isRequired,
    openPaymentMethods: PropTypes.func.isRequired,
    closePaymentMethods: PropTypes.func.isRequired,
    setApplePayAvailability: PropTypes.func.isRequired,
    setApplePayAsDefaultPayment: PropTypes.func.isRequired,
    isCountrySupportedByKlarna: PropTypes.bool.isRequired,
    isApplePayAvailable: PropTypes.bool.isRequired,
    isApplePayAvailableWithActiveCard: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    openPaymentMethods: () => {},
    closePaymentMethods: () => {},
    setApplePayAvailability: false,
    setApplePayAsDefaultPayment: false,
    isCountrySupportedByKlarna: false,
    isApplePayAvailable: false,
    isApplePayAvailableWithActiveCard: false,
  }

  componentDidMount() {
    const {
      setFormField,
      userAccountSelectedPaymentMethod,
      setApplePayAvailability,
      setApplePayAsDefaultPayment,
      storedPaymentDetails,
    } = this.props

    // This fixes the error with paypal when user switches from collect from store to home delivery for the second order
    if (
      userAccountSelectedPaymentMethod &&
      userAccountSelectedPaymentMethod === 'PYPAL'
    ) {
      setFormField(
        'billingCardDetails',
        'paymentType',
        userAccountSelectedPaymentMethod,
        null,
        {
          isDirty: true,
        }
      )
    }

    // User saved payment option is ApplePay. setApplePayAsDefaultPayment will make sure
    // that the current device has ApplePay with an active card and ApplePay can be defaulted as payment.
    setApplePayAvailability()

    if (
      userAccountSelectedPaymentMethod === paymentTypes.APPLEPAY &&
      storedPaymentDetails.type === paymentTypes.APPLEPAY
    ) {
      setApplePayAsDefaultPayment()
    }
  }

  render() {
    return (
      <QubitReact
        id="payment-details"
        setFormField={this.props.setFormField}
        selectedCombinedPaymentMethod={
          this.props.selectedPaymentTypeWithoutDefault
        }
        hasNoStoredPaymentMethod={isEmpty(this.props.storedPaymentMethod)}
      >
        <PaymentDetails {...this.props} />
      </QubitReact>
    )
  }
}

export default PaymentDetailsContainer

export { mapStateToProps, mapDispatchToProps }
