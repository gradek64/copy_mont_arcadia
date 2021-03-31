import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import QubitReact from 'qubit-react/wrapper'

// components
import Select from '../Select/Select'
import ShippingDestinationFlag from '../../../../components/common/ShippingDestinationFlag/ShippingDestinationFlag'

// selectors
import {
  getAddressForm,
  getFormNames,
  getCountryFor,
} from '../../../../selectors/formsSelectors'
import { getCountriesByAddressType } from '../../../../selectors/common/configSelectors'
import {
  sendAnalyticsValidationState,
  GTM_VALIDATION_STATES,
} from '../../../../analytics'

// actions
import { setCountry } from '../../../../actions/common/countryActions'

const CountrySelect = (
  {
    addressType,
    addressForm,
    countries,
    country,
    setCountry,
    sendAnalyticsValidationState,
  },
  { l }
) => {
  const onChangeSelect = ({ target: { value: country } }) => {
    setCountry(addressType, country)
  }

  return (
    <QubitReact
      id="qubit-delivery-country-select"
      addressType={addressType}
      setCountry={setCountry}
      ShippingDestinationFlag={ShippingDestinationFlag}
      sendAnalyticsValidationState={sendAnalyticsValidationState}
      GTM_VALIDATION_STATES={GTM_VALIDATION_STATES}
    >
      <Select
        className="AddressForm-country"
        label={
          addressType.includes('billing')
            ? l`Billing country`
            : l`Delivery country`
        }
        field={country}
        options={[
          {
            label: l`Please select your country`,
            value: '',
            disabled: true,
          },
          ...countries.map((country) => ({
            label: country,
            value: country,
          })),
        ]}
        name="country"
        errors={addressForm.errors}
        value={country}
        onChange={onChangeSelect}
        isRequired
        noTranslate
      />
    </QubitReact>
  )
}

CountrySelect.contextTypes = {
  l: PropTypes.func,
}

CountrySelect.propTypes = {
  addressType: PropTypes.oneOf([
    'deliveryCheckout',
    'deliveryMCD',
    'billingCheckout',
    'billingMCD',
    'addressBook',
  ]).isRequired,
  addressForm: PropTypes.object.isRequired,
  countries: PropTypes.array,
  country: PropTypes.string,
  sendAnalyticsValidationState: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
}

CountrySelect.defaultProps = {
  countries: [],
  country: '',
}

const mapStateToProps = (state, { addressType }) => {
  const addressForm = getAddressForm(addressType, state)
  const formNames = getFormNames(addressType)
  const country = getCountryFor(addressType, formNames.address, state)

  return {
    addressForm,
    countries: getCountriesByAddressType(state, addressType),
    country,
  }
}

const mapDispatchToProps = {
  setCountry,
  sendAnalyticsValidationState,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySelect)
