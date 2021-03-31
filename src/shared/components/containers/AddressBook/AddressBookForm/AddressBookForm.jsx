import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddressForm from '../../../common/AddressForm/AddressForm'
import DeliverToAddressBttnForm from '../../../common/AddressForm/DeliverToAddressBttnForm'
import AddressFormDetails from '../../../common/AddressFormDetails/AddressFormDetails'

import { getFormNames } from '../../../../selectors/formsSelectors'
import { pluck, isEmpty } from 'ramda'
import { validate } from '../../../../lib/validator/index'
import { scrollElementIntoView } from '../../../../lib/scroll-helper'
import { removeSpacing } from '../../../../lib/string-utils'
import Form from '../../../common/FormComponents/Form/Form'

export default class AddressBookForm extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }
  static propTypes = {
    addressType: PropTypes.string.isRequired,
    onSaveAddress: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    bagHasDDPProduct: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    addressForm: PropTypes.object.isRequired,
    detailsForm: PropTypes.object.isRequired,
    findAddressForm: PropTypes.object.isRequired,
    addressValidationSchema: PropTypes.object.isRequired,
    detailsValidationSchema: PropTypes.object.isRequired,
    findAddressValidationSchema: PropTypes.object.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    closeAccordionWithAddress: PropTypes.func.isRequired,
    clearFormFieldError: PropTypes.func.isRequired,
    validateDDPForCountry: PropTypes.func.isRequired,
  }

  static defaultProps = {
    bagHasDDPProduct: false,
  }

  scrollToFirstError = (name) => {
    if (process.browser) {
      const el = document.querySelector(
        `.AddressBookForm .FormComponent-${name}`
      )
      scrollElementIntoView(el, 400, 20)
    }
  }
  validateForm = (validationSchema, addressForm, formName) => {
    const { l } = this.context
    const { touchedFormField } = this.props
    const errors = validate(validationSchema, addressForm, l)
    if (!isEmpty(errors)) {
      this.scrollToFirstError(Object.keys(errors)[0])
      Object.keys(validationSchema).forEach((name) =>
        touchedFormField(formName, name)
      )
      return false
    }
    return true
  }

  onSubmitForm = (event) => {
    event.preventDefault()
    const {
      onSaveAddress,
      addressType,
      addressForm,
      detailsForm,
      findAddressForm,
      addressValidationSchema,
      detailsValidationSchema,
      findAddressValidationSchema,
      clearFormFieldError,
      country,
      bagHasDDPProduct,
      validateDDPForCountry,
      closeAccordionWithAddress,
    } = this.props
    const formNames = getFormNames(addressType)
    const address = pluck('value', addressForm.fields)
    const details = pluck('value', detailsForm.fields)
    const findAddress = pluck('value', findAddressForm.fields)

    clearFormFieldError(formNames.deliverToAddress, 'deliverToAddress')
    const isFormValid = [
      this.validateForm(detailsValidationSchema, details, formNames.details),
      this.validateForm(
        findAddressValidationSchema,
        findAddress,
        formNames.findAddress
      ),
      this.validateForm(addressValidationSchema, address, formNames.address),
    ].every((value) => value)
    if (isFormValid) {
      onSaveAddress({
        address,
        nameAndPhone: {
          ...details,
          telephone: removeSpacing(details.telephone),
        },
      }).then(() => {
        // inform customer that his DDP subscription doesn`t work outside UK
        if (bagHasDDPProduct) validateDDPForCountry(country)
        // close accordion with selected address
        closeAccordionWithAddress()
      })
    }
  }

  render() {
    const { l } = this.context
    const {
      addressType,
      onClose,
      detailsForm,
      addressForm,
      findAddressForm,
      deliverToAddressForm,
      validateForm,
      resetForm,
      clearFormErrors,
    } = this.props

    return (
      <div className="AddressBookFormWrapper">
        <a
          href=""
          className="AddressBookForm-close"
          onClick={(event) => {
            event.preventDefault()
            onClose()
          }}
        >
          {l`CANCEL`}
        </a>
        <Form className="AddressBookForm">
          <AddressForm addressType={addressType} />
          <AddressFormDetails addressType={addressType} />
          <DeliverToAddressBttnForm
            forms={{
              detailsForm,
              findAddressForm,
              addressForm,
              deliverToAddressForm,
            }}
            addressType={addressType}
            onSubmitForm={this.onSubmitForm}
            validateForm={validateForm}
            resetForm={resetForm}
            clearFormErrors={clearFormErrors}
          />
        </Form>
      </div>
    )
  }
}
