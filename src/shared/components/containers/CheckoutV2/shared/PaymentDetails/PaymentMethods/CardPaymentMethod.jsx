import creditCardType from 'credit-card-type'
import PropTypes from 'prop-types'
import { pathOr, pluck, omit } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import QubitReact from 'qubit-react/wrapper'
import {
  combineCardOptions,
  withValue,
  getPaymentTypeFromValidCardTypes,
} from '../../../../../../lib/checkout-utilities/utils'
import { getCardSchema } from '../../validationSchemas'
import { getSelectedPaymentType } from '../../../../../../../shared/selectors/formsSelectors'
import { isMobile } from '../../../../../../selectors/viewportSelectors'
import {
  setFormField,
  setAndValidateFormField,
  validateForm,
  validateFormField,
  clearFormErrors,
  resetFormPartial,
  touchedFormField,
} from '../../../../../../actions/common/formActions'
import { showModal } from '../../../../../../actions/common/modalActions'
import { sendAnalyticsValidationState } from '../../../../../../analytics'
import CVVField from './CVVField'
import Input from '../../../../../common/FormComponents/Input/Input'

import {
  getCurrentCentury,
  isCardExpiryYearInvalid,
  maxLengthExpiryDate,
  formatExpiryDate,
} from '../../../../../../lib/dates'

const types = {
  field: PropTypes.shape({
    value: PropTypes.string,
    isTouched: PropTypes.boolean,
  }),
  validator: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string,
  ]),
}

const getPaymentTypeFromCardNumber = (cardNumber, cardTypes) => {
  const validCardTypes = creditCardType(cardNumber).filter(({ niceType }) => {
    const niceTypeLowerCase = niceType.toLowerCase()
    return cardTypes.some((cardType) =>
      cardType.toLowerCase().includes(niceTypeLowerCase)
    )
  })

  return getPaymentTypeFromValidCardTypes(validCardTypes)
}

const mapStateToProps = (state, props) => {
  const paymentType = getSelectedPaymentType(state, props.formCardName)
  const fields = pathOr({}, props.formCardPath, state.forms)
  const combinedPaymentMethods = combineCardOptions(state.paymentMethods)
  const { paymentTypes: cardPaymentTypes = [] } =
    combinedPaymentMethods.find(withValue('CARD')) || {}
  const cardTypes = pluck('label', cardPaymentTypes)

  return {
    isMobile: isMobile(state),
    cardNumberField: fields.cardNumber || {},
    expiryMonthField: fields.expiryMonth || {},
    expiryDateField: fields.expiryDate || {},
    cvvField: fields.cvv || {},
    paymentType,
    errors: pathOr({}, props.formCardErrorPath, state),
    cardTypes,
    validationSchema: getCardSchema(paymentType),
    expiryMonths: state.siteOptions.expiryMonths,
    expiryYears: state.siteOptions.expiryYears,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  showModal: (children, options) => dispatch(showModal(children, options)),
  validateForm,
  setFormField: (formName, field, validators) =>
    dispatch(setFormField(formName, field, validators)),
  setAndValidateFormField: (formName, fieldName, value, validators) =>
    dispatch(setAndValidateFormField(formName, fieldName, value, validators)),
  validateFormField: (formName, month, year) =>
    dispatch(validateFormField(formName, month, year)),
  touchFormField: (formName, fieldName) =>
    dispatch(touchedFormField(formName, fieldName)),
  validate: (validationSchema) =>
    dispatch(validateForm(props.formCardName, validationSchema)),
  clearErrors: () => dispatch(clearFormErrors(props.formCardName)),
  resetFormPartial: (formName, fieldName) =>
    dispatch(resetFormPartial(formName, fieldName)),
  sendAnalyticsValidationState: ({ id, validationStatus }) =>
    dispatch(sendAnalyticsValidationState({ id, validationStatus })),
})

class CardPaymentMethod extends Component {
  static propTypes = {
    noCVV: PropTypes.bool,
    paymentType: PropTypes.string,
    cardNumberField: types.field,
    expiryDateField: types.field,
    expiryMonthField: types.field,
    cvvField: types.field,
    errors: PropTypes.objectOf(PropTypes.string),
    cardTypes: PropTypes.arrayOf(PropTypes.string),
    isPaymentCard: PropTypes.bool,
    isMobile: PropTypes.bool,
    billingCardFieldsToValidate: PropTypes.object,
    validationSchema: PropTypes.shape({
      cardNumber: types.validator,
      cvv: types.validator,
      expiryMonth: types.validator,
    }),
    formCardName: PropTypes.string.isRequired,
    // actions
    showModal: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    setAndValidateFormField: PropTypes.func.isRequired,
    validateFormField: PropTypes.func.isRequired,
    touchFormField: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    sendAnalyticsValidationState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    noCVV: false,
    paymentType: '',
    billingCardFieldsToValidate: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      expiryDate: '',
      cvv: '',
    },
    cardNumberField: {},
    expiryDateField: {},
    expiryMonthField: {},
    cvvField: {},
    errors: {},
    cardTypes: [],
    isPaymentCard: false,
    isMobile: false,
    validationSchema: {
      cardNumber: [],
      cvv: [],
      expiryMonth: [],
    },
    formCardName: 'billingCardDetails',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  setPaymentType(cardNumber) {
    const {
      isPaymentCard,
      cardTypes,
      paymentType: currentPaymentType,
      setFormField,
      formCardName,
    } = this.props
    // only set the payment type if this is a credit or debit card
    if (isPaymentCard) {
      const paymentType = getPaymentTypeFromCardNumber(cardNumber, cardTypes)
      if (currentPaymentType !== paymentType) {
        setFormField(formCardName, 'paymentType', paymentType)
      }
    }
  }

  setField = (fieldName) => ({ target: { value } }) => {
    const {
      setAndValidateFormField,
      validationSchema: { [fieldName]: validators },
      formCardName,
    } = this.props

    setAndValidateFormField(formCardName, fieldName, value, validators)
  }

  setCardNumber = () => (event) => {
    this.setField('cardNumber')(event)
    const {
      target: { value: cardNumber },
    } = event
    this.setPaymentType(cardNumber)
  }

  removeWhiteSpaces = (name) => (ev) => {
    const value = ev.target.value.replace(/\s/g, '')
    this.setField(name)({ target: { value } })
  }

  setExpiryDateValue = (expiry) => {
    const [month] = expiry
    if (Array.isArray(expiry)) {
      return month ? expiry.join(' / ') : ''
    }
    return expiry
  }

  setAndValidateExpiryDate = () => (event) => {
    const {
      setFormField,
      validateFormField,
      validationSchema,
      formCardName,
    } = this.props
    const { value } = event.target
    const expiry = formatExpiryDate(value)
    const [month, year] = expiry

    if (maxLengthExpiryDate(value) || isCardExpiryYearInvalid(year)) {
      return
    }
    const expiryDateValue = this.setExpiryDateValue(expiry)
    setFormField(formCardName, 'expiryDate', expiryDateValue)

    this.setField('expiryMonth')({ target: { value: `${month}` } })
    this.setExpiryYear()({ target: { value: `${getCurrentCentury()}${year}` } })
    validateFormField(formCardName, 'expiryDate', validationSchema.expiryMonth)
  }

  setExpiryYear = () => ({ target: { value } }) => {
    const {
      setFormField,
      validateFormField,
      validationSchema: { expiryMonth: expiryMonthValidators },
      formCardName,
    } = this.props

    setFormField(formCardName, 'expiryYear', value)
    validateFormField(formCardName, 'expiryMonth', expiryMonthValidators)
  }

  touchField = (fieldName) => () => {
    this.props.touchFormField(this.props.formCardName, fieldName)
  }

  componentDidMount() {
    const {
      validate,
      validationSchema,
      noCVV,
      setFormField,
      formCardName,
      paymentType,
    } = this.props
    // When rendering the CardPaymentMethods we set a the default value to VISA. This will populate the error message object
    // so that If the user tries to submit without entering card number or cvv the errors will be displayed
    if (paymentType === '') setFormField(formCardName, 'paymentType', 'VISA')
    validate(noCVV ? omit(['cvv'], validationSchema) : validationSchema)
  }

  componentDidUpdate(prevProps) {
    const { paymentType, validate, validationSchema, noCVV } = this.props
    if (prevProps.paymentType !== paymentType) {
      /* there is no CVV field in user account card update */
      validate(noCVV ? omit(['cvv'], validationSchema) : validationSchema)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      clearErrors,
      paymentType,
      cvvField,
      validateFormField,
      validationSchema: { cvv },
      formCardName,
    } = this.props
    if (paymentType !== nextProps.paymentType) {
      clearErrors()
    }

    if (cvvField.isActive && !nextProps.cvvField.isActive) {
      validateFormField(formCardName, 'cvv', cvv)
    }
  }

  componentWillUnmount() {
    const {
      clearErrors,
      resetFormPartial,
      formCardName,
      noCVV,
      billingCardFieldsToValidate,
    } = this.props
    clearErrors()
    const fieldsToReset = billingCardFieldsToValidate
    resetFormPartial(
      formCardName,
      /* there is no CVV field in user account card update */
      noCVV ? omit(['cvv'], fieldsToReset) : fieldsToReset
    )
  }

  handleDateBlur = (field) => (...args) => {
    this.touchField(field)(...args)
    const {
      errors,
      expiryMonthField,
      formCardName,
      validationSchema,
      validateFormField,
    } = this.props
    const dateError = errors && expiryMonthField.isDirty && errors.expiryMonth

    validateFormField(formCardName, 'expiryDate', validationSchema.expiryMonth)
    this.props.sendAnalyticsValidationState({
      id: field,
      validationStatus: dateError ? 'failure' : 'success',
    })
  }

  render() {
    const { l } = this.context
    const {
      cardNumberField,
      expiryDateField,
      cvvField,
      paymentType,
      errors,
      isMobile,
      showModal,
      noCVV,
    } = this.props
    return (
      <div className="CardPaymentMethod">
        <QubitReact id="qubit-credit-card-field">
          <Input
            className="CardPaymentMethod-cardNumber"
            field={cardNumberField}
            name="cardNumber"
            label={l`Card Number`}
            type="tel"
            placeholder={l`Card Number`}
            errors={{ cardNumber: l(errors.cardNumber) }}
            setField={this.setCardNumber}
            onBlur={this.removeWhiteSpaces('cardNumber')}
            touchedField={this.touchField}
            messagePosition={'bottom'}
            isRequired
          />
        </QubitReact>
        <div className="CardPaymentMethod-container">
          <div className={'CardPaymentMethod-expiryDate-container'}>
            <QubitReact
              id="qubit-expiry-date"
              setExpiryYear={this.setExpiryYear()}
              setExpiryMonth={this.setField('expiryMonth')}
              handleDateBlur={this.handleDateBlur}
            >
              <Input
                className="CardPaymentMethod-expiryDate"
                field={expiryDateField}
                name="expiryDate"
                label={l`Expiry Date`}
                errors={{ expiryDate: l(errors.expiryDate) }}
                type="text"
                placeholder="MM/YY"
                setField={this.setAndValidateExpiryDate}
                onBlur={this.handleDateBlur('expiryDate')}
                touchedField={this.touchField}
                messagePosition={'bottom'}
                isRequired
              />
            </QubitReact>
          </div>
        </div>
        {!noCVV && (
          <div className="CardPaymentMethod-cvvFieldContainer">
            <QubitReact id="qubit-security-code-field">
              <CVVField
                field={cvvField}
                error={l(errors.cvv)}
                label={l`Security Code`}
                isMobile={isMobile}
                setField={this.setField}
                touchedField={this.touchField}
                showModal={showModal}
                paymentType={paymentType}
                messagePosition={'bottom'}
              />
            </QubitReact>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPaymentMethod)

export { CardPaymentMethod as WrappedCardPaymentMethod, mapStateToProps }
