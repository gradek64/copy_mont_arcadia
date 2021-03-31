import { connect } from 'react-redux'

// components
import AddressFormDetails from '../../../common/AddressFormDetails/AddressFormDetails'

// selectors
import {
  getFormNames,
  getCountryFor,
  getAddressForm,
} from '../../../../selectors/formsSelectors'

export const mapStateToProps = (state, { addressType }) => {
  const formNames = getFormNames(addressType)
  const country = getCountryFor(addressType, formNames.address, state)
  return {
    addressType,
    country,
    formNames,
    getAddressFormFromState: getAddressForm,
  }
}

export default connect(mapStateToProps)(AddressFormDetails)
