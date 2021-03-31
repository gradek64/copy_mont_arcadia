import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '../../common/FormComponents/Input/Input'
import Select from '../../common/FormComponents/Select/Select'

import { isCard } from '../../../lib/checkout-utilities/utils'

import { connect } from 'react-redux'
import { pick, isEmpty } from 'ramda'
import { selectPaymentMethodsValidForDeliveryAndBillingCountry } from '../../../selectors/paymentMethodSelectors'

export const mapStateToProps = (state) => ({
  paymentSchema: state.config.paymentSchema,
  paymentMethods: selectPaymentMethodsValidForDeliveryAndBillingCountry(state),
  expiryYears: state.siteOptions.expiryYears,
  expiryMonths: state.siteOptions.expiryMonths,
})

@connect(mapStateToProps)
class PaymentDetails extends Component {
  static propTypes = {
    user: PropTypes.object,
    setField: PropTypes.func,
    touchedField: PropTypes.func,
    form: PropTypes.object.isRequired,
    resetFormPartial: PropTypes.func,
    paymentSchema: PropTypes.array,
    paymentMethods: PropTypes.array,
    expiryYears: PropTypes.array,
    expiryMonths: PropTypes.array,
    errors: PropTypes.object,
    privacyProtected: PropTypes.bool,
  }

  static defaultProps = {
    paymentMethods: [],
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { user } = this.props
    if (user) this.setCardInfo()
  }

  setCardInfo() {
    const { resetFormPartial, paymentSchema, user } = this.props

    const formInfo = {
      ...pick(paymentSchema, user.creditCard),
      cardNumber: '',
    }

    if (
      !isEmpty(formInfo.expiryMonth) &&
      !isEmpty(formInfo.expiryYear) &&
      !isEmpty(formInfo.type)
    ) {
      resetFormPartial('customerDetails', formInfo)
    }
  }

  renderCardFields = () => {
    const {
      form,
      errors,
      setField,
      touchedField,
      expiryMonths,
      expiryYears,
    } = this.props
    const { l } = this.context
    return (
      <div>
        <Input
          field={form.fields.cardNumber}
          label={l`Card Number`}
          placeholder={l`Card Number`}
          name="cardNumber"
          type="tel"
          errors={errors}
          setField={setField}
          touchedField={touchedField}
          isRequired
          privacyProtected
        />
        <div className="PaymentDetails-row">
          <Select
            name="expiryMonth"
            className="PaymentDetails-expiryMonth"
            label={l`Expiry: month`}
            value={String(form.fields.expiryMonth.value)}
            onChange={setField('expiryMonth')}
            onBlur={touchedField('expiryMonth')}
            options={expiryMonths}
            isRequired
            privacyProtected
          />
          <Select
            name="expiryYear"
            className="PaymentDetails-expiryYear"
            label={l`Expiry: year`}
            value={String(form.fields.expiryYear.value)}
            onChange={setField('expiryYear')}
            onBlur={touchedField('expiryYear')}
            options={expiryYears}
            isRequired
            privacyProtected
          />
        </div>
      </div>
    )
  }

  render() {
    const { l } = this.context
    const {
      paymentMethods,
      setField,
      touchedField,
      errors,
      form,
      privacyProtected,
    } = this.props
    return (
      <section className="PaymentDetails">
        <h3>{l`Payment details`}</h3>
        <p>
          {l`Please note, for security reasons you will need to update your payment details each time you update your delivery information.`}
        </p>
        <Select
          label={l`Payment type`}
          options={paymentMethods}
          name="paymentOption"
          value={form.fields.type.value}
          onChange={setField('type')}
          onBlur={touchedField('type')}
          isRequired
          privacyProtected={privacyProtected}
        />

        {isCard(form.fields.type.value, paymentMethods) &&
          this.renderCardFields()}

        {(form.fields.expiryMonth.isDirty ||
          form.fields.expiryYear.isDirty) && (
          <div className="PaymentDetails-expiryValidationMessage">
            {errors.expiryMonth}
          </div>
        )}
      </section>
    )
  }
}

export default PaymentDetails
