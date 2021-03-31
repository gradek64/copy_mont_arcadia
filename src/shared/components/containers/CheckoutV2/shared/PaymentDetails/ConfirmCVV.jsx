import { path, pathOr } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getCardSchema } from '../validationSchemas'
import { isMobile } from '../../../../../selectors/viewportSelectors'
import { getSelectedPaymentType } from '../../../../../../shared/selectors/formsSelectors'
import { getSavedPaymentTypeFromAccount } from '../../../../../selectors/paymentMethodSelectors'
import { selectStoredPaymentDetails } from '../../../../../../shared/selectors/common/accountSelectors'
import { storedCardHasExpired } from '../../../../../../shared/selectors/checkoutSelectors'

// actions
import {
  setAndValidateFormField,
  validateFormField,
  clearFormFieldError,
  touchedFormField,
} from '../../../../../actions/common/formActions'
import { showModal } from '../../../../../actions/common/modalActions'

// components
import CVVField from './PaymentMethods/CVVField'

const mapStateToProps = (state = {}) => {
  const defaultField = { value: '', isTouched: false }
  const field = pathOr(
    defaultField,
    ['forms', 'checkout', 'billingCardDetails', 'fields', 'cvv'],
    state
  )
  const error = pathOr(
    '',
    ['forms', 'checkout', 'billingCardDetails', 'errors', 'cvv'],
    state
  )
  const cardType = path(['account', 'user', 'creditCard', 'type'], state)

  return {
    field,
    error,
    isMobile: isMobile(state),
    paymentType: getSelectedPaymentType(state),
    validators: getCardSchema(cardType).cvv,
    savedPaymentType: getSavedPaymentTypeFromAccount(state),
    storedPaymentDetails: selectStoredPaymentDetails(state),
    isStoredCardExpired: storedCardHasExpired(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  setField: (validators) => (name) => ({ target: { value } }) => {
    dispatch(
      setAndValidateFormField('billingCardDetails', name, value, validators)
    )
  },
  touchedField: (name) => () =>
    dispatch(touchedFormField('billingCardDetails', name)),
  showModal: (...args) => dispatch(showModal(...args)),
  validate: (validators) => {
    dispatch(validateFormField('billingCardDetails', 'cvv', validators))
  },
  clearError: () => {
    dispatch(clearFormFieldError('billingCardDetails', 'cvv'))
  },
})

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class ConfirmCVV extends Component {
  componentDidMount() {
    const { validators, validate } = this.props
    validate(validators)
  }

  componentWillUnmount() {
    this.props.clearError()
  }

  render() {
    const { validators, setField } = this.props
    const props = {
      ...this.props,
      setField: setField(validators),
    }
    return <CVVField {...props} />
  }
}

export default ConfirmCVV

export { mapStateToProps, mapDispatchToProps }
