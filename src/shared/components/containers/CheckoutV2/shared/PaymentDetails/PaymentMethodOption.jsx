import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// SELECTORS
import { isMobile } from '../../../../../selectors/viewportSelectors'
import {
  getBillingCardPaymentType,
  getBillingCardNumber,
} from '../../../../../selectors/formsSelectors'
import { getAfterPayScriptUrl } from '../../../../../selectors/clearPaySelectors'

// ACTIONS
import {
  resetFormPartial,
  setFormField,
  validateFormField,
} from '../../../../../actions/common/formActions'

// ANALYTICS
import { sendAnalyticsPaymentMethodSelectionEvent } from '../../../../../analytics'

// COMPONENTS
import QubitReact from 'qubit-react/wrapper'
import WithQubit from '../../../../common/Qubit/WithQubit'

import creditCardType from 'credit-card-type'
import { getCardSchema } from '../validationSchemas'
import CardIcon from './CardIcon'
import { CLEARPAY } from '../../../../../constants/paymentTypes'

@connect(
  (state) => ({
    isMobile: isMobile(state),
    paymentType: getBillingCardPaymentType(state),
    cardNumber: getBillingCardNumber(state),
    afterPayScriptUrl: getAfterPayScriptUrl(state),
  }),
  {
    resetFormPartial,
    setFormField,
    sendAnalyticsPaymentMethodSelectionEvent,
    validateFormField,
  }
)
class PaymentMethodOption extends Component {
  static propTypes = {
    billingCardFieldsToValidate: PropTypes.object,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    value: PropTypes.string.isRequired,
    icons: PropTypes.arrayOf(PropTypes.string),
    isChecked: PropTypes.bool,
    paymentType: PropTypes.string.isRequired,
    cardNumber: PropTypes.string,
    afterPayScriptUrl: PropTypes.string,
  }

  static defaultProps = {
    description: '',
    icons: [],
    isChecked: false,
    onChange: () => {},
    billingCardFieldsToValidate: {
      cardNumber: '',
      cvv: '',
    },
    cardNumber: '',
    afterPayScriptUrl: '',
  }

  handlePaymentMethodChange = ({ currentTarget: { value } }) => {
    const {
      resetFormPartial,
      setFormField,
      sendAnalyticsPaymentMethodSelectionEvent,
      paymentType,
      validateFormField,
      billingCardFieldsToValidate,
      savePaymentMethod,
      afterPayScriptUrl,
    } = this.props

    const validationSchema = getCardSchema(paymentType)

    // Resetting only the card number and cvv leaving the expire month and year as selected by the user by default
    resetFormPartial('billingCardDetails', billingCardFieldsToValidate)

    setFormField(
      'billingCardDetails',
      'paymentType',
      value === 'CARD' ? 'VISA' : value
    )
    savePaymentMethod(value)
    // This will re-populate the error object with cardNumber and cvv by default
    Object.keys(billingCardFieldsToValidate).forEach((field) => {
      validateFormField('billingCardDetails', field, validationSchema[field])
    })

    sendAnalyticsPaymentMethodSelectionEvent({
      selectedPaymentMethod: value,
    })

    if (!window.AfterPay && window.loadScript && value === CLEARPAY) {
      window.loadScript({
        src: afterPayScriptUrl,
        isAsync: false,
      })
    }
  }

  render() {
    const {
      label,
      description,
      value,
      icons,
      isChecked,
      cardNumber,
      renderPaymentMethod,
    } = this.props

    const showDescription = description && ['KLRNA', 'CLRPY'].includes(value)
    const selectedMethodClasses = classnames('PaymentMethodOption', {
      'PaymentMethodOption--selected': isChecked,
    })
    return (
      <div className={selectedMethodClasses}>
        <button
          className="PaymentMethodOption-button"
          value={value}
          checked={isChecked}
          onClick={this.handlePaymentMethodChange}
        >
          <span className="PaymentMethodOption-content">
            <label // eslint-disable-line jsx-a11y/label-has-for
              className="PaymentMethodOption-label"
            >
              <WithQubit
                id="qubit-credit-card-title"
                shouldUseQubit={value === 'CARD'}
              >
                {label}
              </WithQubit>
            </label>
            {showDescription && (
              <span className="PaymentMethodOption-description">
                {description}
              </span>
            )}
          </span>
          {icons.length > 0 && (
            <span className="PaymentMethodOption-icons">
              {icons.map((icon) => {
                return (
                  <QubitReact
                    id={`${
                      value === 'CARD'
                        ? 'qubit-payment-card-method'
                        : 'qubit-payment-other-methods'
                    }`}
                    key={icon}
                    creditCardType={creditCardType}
                    renderIcon={<CardIcon key={icon} icon={icon} />}
                    cardNumber={cardNumber}
                    isChecked={isChecked}
                  >
                    <CardIcon key={icon} icon={icon} />
                  </QubitReact>
                )
              })}
            </span>
          )}
        </button>
        {isChecked && renderPaymentMethod}
      </div>
    )
  }
}

export default PaymentMethodOption
