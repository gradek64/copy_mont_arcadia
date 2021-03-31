import { connect } from 'react-redux'
import AddressBookForm from './AddressBookForm'
import {
  getHasSelectedAddress,
  getHasFoundAddress,
} from '../../../../selectors/addressBookSelectors'
import {
  getFormNames,
  getIsFindAddressVisible,
  getCountryFor,
  getAddressForm,
} from '../../../../selectors/formsSelectors'
import {
  getYourDetailsSchema,
  getYourAddressSchema,
  getFindAddressSchema,
} from '../../../../schemas/validation/addressFormValidationSchema'
import {
  getPostCodeRules,
  getCountriesByAddressType,
} from '../../../../selectors/common/configSelectors'
import {
  touchedFormField,
  validateForm,
  resetForm,
  clearFormErrors,
  clearFormFieldError,
} from '../../../../actions/common/formActions'
import { validateDDPForCountry } from '../../../../actions/common/ddpActions'
import { bagContainsDDPProduct } from '../../../../selectors/shoppingBagSelectors'

export const mapStateToProps = (
  state,
  { addressType, onSaveAddress, onClose, closeAccordionWithAddress }
) => {
  const formNames = getFormNames(addressType)
  const addressForm = getAddressForm(addressType, formNames.address, state)
  const bagHasDDPProduct = bagContainsDDPProduct(state)

  const deliverToAddressForm = getAddressForm(
    addressType,
    formNames.deliverToAddress,
    state
  )
  const detailsForm = getAddressForm(addressType, formNames.details, state)
  const findAddressForm = getAddressForm(
    addressType,
    formNames.findAddress,
    state
  )
  const country = getCountryFor(addressType, formNames.address, state)
  const countries = getCountriesByAddressType(state, addressType)
  const postCodeRules = getPostCodeRules(state, country)
  const detailsValidationSchema = getYourDetailsSchema(country)
  const addressValidationSchema = getIsFindAddressVisible(
    addressType,
    formNames.address,
    country,
    state
  )
    ? {}
    : getYourAddressSchema(postCodeRules, countries)
  const findAddressValidationSchema = getIsFindAddressVisible(
    addressType,
    formNames.address,
    country,
    state
  )
    ? getFindAddressSchema(postCodeRules, {
        hasFoundAddress: getHasFoundAddress(findAddressForm),
        hasSelectedAddress: getHasSelectedAddress(addressForm),
      })
    : {}
  return {
    addressType,
    onSaveAddress,
    country,
    bagHasDDPProduct,
    onClose,
    addressForm,
    detailsForm,
    findAddressForm,
    deliverToAddressForm,
    addressValidationSchema,
    detailsValidationSchema,
    findAddressValidationSchema,
    closeAccordionWithAddress,
  }
}
export const mapDispatchToProps = {
  touchedFormField,
  validateForm,
  resetForm,
  clearFormErrors,
  clearFormFieldError,
  validateDDPForCountry,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressBookForm)
