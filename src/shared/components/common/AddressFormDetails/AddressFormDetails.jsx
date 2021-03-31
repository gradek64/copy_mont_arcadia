import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import { smsMobileNumber } from '../../../lib/validator/validators'

// actions
import {
  setFormField,
  setAndValidateFormField,
  touchedFormField,
  validateForm,
  clearFormErrors,
  resetForm,
} from '../../../actions/common/formActions'

// selectors
import {
  getFormNames,
  getCountryFor,
  getAddressForm,
  getDeliveryInstructionsForm,
} from '../../../selectors/formsSelectors'
import { getSelectedStoreCode } from '../../../selectors/checkoutSelectors'

// schemas
import { getYourDetailsSchema } from '../../../schemas/validation/addressFormValidationSchema'

// components
import Input from '../../common/FormComponents/Input/Input'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'

export const mapStateToProps = (state, { addressType }) => {
  const formNames = getFormNames(addressType)
  const detailsForm = formNames.details
  const country = getCountryFor(addressType, formNames.address, state)
  const form = getAddressForm(addressType, detailsForm, state)
  return {
    form,
    formName: detailsForm,
    errors: form.errors,
    validationSchema: getYourDetailsSchema(country),
    // NOTE: rather hacky way of determining whether the schemas have updated (as can't do a `===` on them)
    // think about using something like https://github.com/reactjs/reselect
    schemaHash: [country].join(':'),
    deliveryInstructionForm: getDeliveryInstructionsForm(state),
    currentCountry: country,
    isDeliverToStore: getSelectedStoreCode(state),
  }
}

export const mapDispatchToProps = {
  setFormField,
  setAndValidateFormField,
  touchedFormField,
  validateForm,
  clearFormErrors,
  resetForm,
}

class AddressFormDetails extends Component {
  static propTypes = {
    addressType: PropTypes.oneOf([
      'deliveryCheckout',
      'deliveryMCD',
      'billingCheckout',
      'billingMCD',
      'addressBook',
    ]).isRequired,
    label: PropTypes.string,
    titleHidden: PropTypes.bool,
    h4: PropTypes.bool,
    isDesktopMultiColumnStyle: PropTypes.bool,
    form: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    errors: PropTypes.object,
    validationSchema: PropTypes.object,
    deliveryInstructionForm: PropTypes.object.isRequired,
    currentCountry: PropTypes.string.isRequired,
    // functions
    setAndValidateFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    clearFormErrors: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    // sendEventAnalytics: PropTypes.func,
  }

  static defaultProps = {
    autofocus: false,
    label: '',
    titlesHidden: false,
    h4: false,
    isDesktopMultiColumnStyle: false,
    errors: {},
    validationSchema: {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.validateDetails()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemaHash !== this.props.schemaHash) {
      this.validateDetails()
    }
  }

  componentWillUnmount() {
    const { addressType, formName, clearFormErrors, resetForm } = this.props
    const shouldResetFormOnUnmount = [
      'addressBook',
      'billingMCD',
      'deliveryMCD',
    ].includes(addressType)

    if (shouldResetFormOnUnmount) {
      resetForm(formName, {
        firstName: '',
        lastName: '',
        telephone: '',
      })
    }
    clearFormErrors(formName)
  }

  setAndValidateDetailsField = (fieldName) => ({
    target: { value } = {},
  } = {}) => {
    const {
      formName,
      validationSchema,
      setAndValidateFormField,
      setFormField,
    } = this.props
    setAndValidateFormField(
      formName,
      fieldName,
      value,
      validationSchema[fieldName]
    )

    if (fieldName === 'telephone') {
      setFormField('deliveryInstructions', 'smsMobileNumber', '')
    }
  }

  validateDetails() {
    const { formName, validationSchema, validateForm } = this.props
    return validateForm(formName, validationSchema)
  }

  touchDetailsField = (fieldName) => () => {
    const { formName, touchedFormField } = this.props
    touchedFormField(formName, fieldName)
  }

  isValidUkMobileNumber() {
    const { form } = this.props
    const { l } = this.context
    const smsMobErrors = smsMobileNumber(
      path(['fields', 'telephone'], form),
      'value',
      l
    )
    if (smsMobErrors === '' || (smsMobErrors && smsMobErrors.length > 0)) {
      return false
    }
    return true
  }

  checkboxChecked = (deliveryInstructionForm) => {
    if (path(['fields', 'smsMobileNumber', 'value'], deliveryInstructionForm)) {
      return true
    }
    return false
  }

  onCheckBoxChange(event) {
    const { touchedFormField, setFormField, form } = this.props
    const { checked } = event.target
    const value = path(['fields', 'telephone', 'value'], form)

    if (!checked) {
      setFormField('deliveryInstructions', 'smsMobileNumber', '')
      return checked
    }

    setFormField('deliveryInstructions', 'smsMobileNumber', value)
    touchedFormField('deliveryInstructions', 'smsMobileNumber')
    return checked
  }

  render() {
    const { l } = this.context
    const {
      form,
      label,
      errors,
      addressType,
      titleHidden,
      isDesktopMultiColumnStyle,
      h4,
      deliveryInstructionForm,
      currentCountry,
      isDeliverToStore,
    } = this.props
    const chckboxChecked = this.checkboxChecked(deliveryInstructionForm)
    const chckBoxDisabled = !this.isValidUkMobileNumber()
    const showCheckbox =
      (addressType === 'deliveryCheckout' || addressType === 'addressBook') &&
      (currentCountry === 'United Kingdom' && !isDeliverToStore)
    return (
      <section
        className={`AddressFormDetails AddressFormDetails--${addressType} ${
          isDesktopMultiColumnStyle ? 'AddressFormDetails--multiColumn' : ''
        }`}
        aria-label={`${addressType} Details`}
      >
        {!titleHidden && (
          <header className="AddressFormDetails-header">
            {h4 ? (
              <h4 className="AddressFormDetails-headerText">{label}</h4>
            ) : (
              <h3 className="AddressFormDetails-headerText">{label}</h3>
            )}
          </header>
        )}
        <div className="AddressFormDetails-row">
          <Input
            className="AddressFormDetails-firstName"
            isDisabled={form.success}
            field={path(['fields', 'firstName'], form)}
            name="firstName"
            errors={errors}
            label={l`First Name`}
            placeholder={l`First Name`}
            setField={this.setAndValidateDetailsField}
            touchedField={this.touchDetailsField}
            isRequired
          />
          <Input
            isDisabled={form.success}
            className="AddressFormDetails-lastName"
            field={path(['fields', 'lastName'], form)}
            name="lastName"
            errors={errors}
            label={l`Surname`}
            placeholder={l`Surname`}
            setField={this.setAndValidateDetailsField}
            touchedField={this.touchDetailsField}
            isRequired
          />
        </div>
        <div className="AddressFormDetails-row">
          <Input
            className="AddressFormDetails-telephone"
            isDisabled={form.success}
            field={path(['fields', 'telephone'], form)}
            name="telephone"
            type="tel"
            errors={errors}
            label={l`Phone Number`}
            placeholder={l`07123 123123`}
            setField={this.setAndValidateDetailsField}
            touchedField={this.touchDetailsField}
            isRequired
          />
          {isDesktopMultiColumnStyle && (
            <div className="AddressFormDetails-col AddressFormDetails-telephoneCol">
              &nbsp;
            </div>
          )}
        </div>
        <div className="AddressFormDetails-row">
          <span className="AddressFormDetails-telephoneCopy">{l`We'll only call you if there are issues with your order`}</span>
          {isDesktopMultiColumnStyle && (
            <div className="AddressFormDetails-telephoneCol">&nbsp;</div>
          )}
        </div>
        {showCheckbox && (
          <Checkbox
            className={'AddressFormDetails-checkbox'}
            name="smsMobileNumber"
            isDisabled={chckBoxDisabled}
            onChange={(event) => this.onCheckBoxChange(event)}
            reverse={false}
            checked={{ value: chckboxChecked }}
          >
            {l`Free SMS delivery updates (mobile only)`}
          </Checkbox>
        )}
      </section>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressFormDetails)

export { AddressFormDetails as WrappedAddressFormDetails }
