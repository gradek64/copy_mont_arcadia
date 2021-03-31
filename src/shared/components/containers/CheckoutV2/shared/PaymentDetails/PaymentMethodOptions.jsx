import React, { Component } from 'react'
import { equals } from 'ramda'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// TYPES
import * as paymentTypes from '../../../../../constants/paymentTypes'

// SELECTORS
import { isMobile } from '../../../../../selectors/viewportSelectors'
import {
  getSelectedPaymentTypeFromForms,
  getEnabledDecoratedCombinedPaymentMethods,
  getSelectedPaymentTypeFromFormsWithoutDefaultResult,
} from '../../../../../selectors/paymentMethodSelectors'

// COMPONENTS
import QubitReact from 'qubit-react/wrapper'
import PaymentMethodOption from './PaymentMethodOption'
import KlarnaForm from '../../Klarna/KlarnaForm'
import CardPaymentMethod from './PaymentMethods/CardPaymentMethod'
import * as types from './types'

// Local Card Const
const cardPath = ['checkout', 'billingCardDetails', 'fields']
const cardErrorPath = ['forms', 'checkout', 'billingCardDetails', 'errors']
const cardName = 'billingCardDetails'

@connect((state) => ({
  isMobile: isMobile(state),
  combinedPaymentMethods: getEnabledDecoratedCombinedPaymentMethods(state),
  selectedPaymentMethod: getSelectedPaymentTypeFromForms(state),
  // this prop is only required for EXP-254 payment details A/B test:
  selectedPaymentTypeWithoutDefault: getSelectedPaymentTypeFromFormsWithoutDefaultResult(
    state
  ),
}))
class PaymentMethodsOptions extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    combinedPaymentMethods: PropTypes.arrayOf(types.combinedPaymentMethod)
      .isRequired,
  }

  shouldComponentUpdate(prevProps) {
    return !equals(prevProps, this.props)
  }

  renderPaymentMethod(paymentType) {
    if (paymentType === paymentTypes.KLARNA) {
      return <KlarnaForm key="klarna-form" />
    } else if (paymentType === 'CARD' || paymentType === 'ACCNT') {
      return (
        <QubitReact
          id="qubit-card-payment-method"
          showChild={Boolean(this.props.selectedPaymentTypeWithoutDefault)}
        >
          <CardPaymentMethod
            isPaymentCard={paymentType === 'CARD'}
            formCardPath={cardPath}
            formCardErrorPath={cardErrorPath}
            formCardName={cardName}
          />
        </QubitReact>
      )
    }
    return null
  }

  render() {
    const {
      combinedPaymentMethods,
      isMobile,
      selectedPaymentTypeWithoutDefault,
      savePaymentMethod,
    } = this.props
    const { l } = this.context

    return combinedPaymentMethods.map((paymentMethod) => {
      const { label, description, value, icons } = paymentMethod
      const isSelected = paymentMethod === selectedPaymentTypeWithoutDefault
      const paymentDescription =
        isSelected ||
        !isMobile ||
        value === paymentTypes.KLARNA ||
        value === paymentTypes.CLEARPAY
          ? l(description)
          : ''

      return (
        <div className="PaymentDetails-method" key={value}>
          <QubitReact
            id="qubit-allow-payment-method-selection"
            selectedPaymentMethod={selectedPaymentTypeWithoutDefault}
            paymentMethod={paymentMethod}
          >
            <PaymentMethodOption
              label={l(label)}
              value={value}
              description={paymentDescription}
              icons={icons}
              isChecked={isSelected}
              renderPaymentMethod={this.renderPaymentMethod(value)}
              savePaymentMethod={savePaymentMethod}
            />
          </QubitReact>
        </div>
      )
    })
  }
}

export default PaymentMethodsOptions
