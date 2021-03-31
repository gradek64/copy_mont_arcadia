import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { isEmpty, path } from 'ramda'
import { getDeliverToAddressSchema } from '../../../schemas/validation/addressFormValidationSchema'
import Button from '../FormComponents/Button/Button'
import { formNames } from '../../../../shared/constants/forms'

class DeliverToAddressBttnForm extends Component {
  constructor(props) {
    super(props)
    this.deliverToAddressForm = formNames[props.addressType].deliverToAddress
    this.deliverToAddressSchema = getDeliverToAddressSchema()
  }
  componentDidMount() {
    const { validateForm } = this.props
    validateForm(this.deliverToAddressForm, this.deliverToAddressSchema)
  }
  componentWillUnmount() {
    const { clearFormErrors, resetForm } = this.props
    resetForm(this.deliverToAddressForm, {
      deliverToAddress: '',
    })
    clearFormErrors(this.deliverToAddressForm)
  }

  componentDidUpdate(prevProps) {
    const { detailsForm, findAddressForm, addressForm } = this.props.forms
    const {
      detailsForm: prevDetailsForm,
      findAddressForm: prevFindAddressForm,
      addressForm: prevAddressForm,
    } = prevProps.forms

    if (
      detailsForm.errors !== prevDetailsForm.errors ||
      findAddressForm.errors !== prevFindAddressForm ||
      addressForm.errors !== prevAddressForm.errors
    ) {
      this.shouldDisableAddressBookButton()
    }
  }

  shouldDisableAddressBookButton = () => {
    const { detailsForm, findAddressForm, addressForm } = this.props.forms
    const addressFormErrors = Object.keys(addressForm.errors).some(
      (key) => !!path(['errors', [key]], addressForm)
    )
    const detailsFormErrors = Object.keys(detailsForm.errors).some(
      (key) => !!path(['errors', [key]], detailsForm)
    )
    const findAddressFormErrors = !isEmpty(path(['errors'], findAddressForm))

    return findAddressFormErrors || addressFormErrors || detailsFormErrors
  }

  render() {
    const { onSubmitForm, forms } = this.props
    const { deliverToAddressForm } = forms
    const { l } = this.context
    const deliverToAddressFieldTouched = path(
      ['fields', 'deliverToAddress', 'isTouched'],
      deliverToAddressForm
    )
    const deliverToAddressErrorMsg = path(
      ['errors', 'deliverToAddress'],
      deliverToAddressForm
    )

    return (
      <Button
        className="Button Button--primary"
        type="submit"
        customClass="AddressBookForm-primary"
        name="deliverToAddress"
        isDisabled={this.shouldDisableAddressBookButton()}
        touched={deliverToAddressFieldTouched}
        onClick={onSubmitForm}
        error={deliverToAddressErrorMsg}
      >
        {l`Deliver to this address`}
      </Button>
    )
  }
}

DeliverToAddressBttnForm.propTypes = {
  forms: PropTypes.object.isRequired,
  addressType: PropTypes.string.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  clearFormErrors: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
}

DeliverToAddressBttnForm.contextTypes = {
  l: PropTypes.func,
}

DeliverToAddressBttnForm.defaultProps = {
  forms: {},
  addressType: 'addressBook',
  deliverToAddressErrorMsg:
    'Please confirm this new address or cancel to continue',
  onSubmitForm: () => null,
  resetForm: () => null,
  clearFormErrors: () => null,
  validateForm: () => null,
}

export default DeliverToAddressBttnForm
