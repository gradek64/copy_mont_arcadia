import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { path, pathOr } from 'ramda'
import WithQubit from '../../common/Qubit/WithQubit'
import CountrySelect from '../../common/FormComponents/CountrySelect/CountrySelect'
import { shouldDisplayDeliveryInstructions } from '../../../selectors/checkoutSelectors'

// actions
import {
  setFormField,
  setAndValidateFormField,
  validateForm,
  clearFormErrors,
  clearFormFieldError,
  touchedFormField,
  resetForm,
  resetFormPartial,
} from '../../../actions/common/formActions'
import {
  findAddress,
  findExactAddressByMoniker,
} from '../../../actions/common/findAddressActions'
import { validateDDPForCountry } from '../../../actions/common/ddpActions'
import { showModal } from '../../../actions/common/modalActions'
// libs
import {
  getYourAddressSchema,
  getFindAddressSchema,
  getYourDetailsSchema,
} from '../../../schemas/validation/addressFormValidationSchema'

// selectors
import {
  getPostCodeRules,
  getCountryCodeFromQAS,
  getCountriesByAddressType,
} from '../../../selectors/common/configSelectors'
import { getSiteDeliveryISOs } from '../../../selectors/configSelectors'
import { setCountry } from '../../../actions/common/countryActions'

import {
  getCountryFor,
  getIsFindAddressVisible,
  getFormNames,
  getAddressForm,
} from '../../../selectors/formsSelectors'

// components
import FindAddress from './FindAddress'
import ManualAddress from './ManualAddress'
import HomeDeliveryInstructions from '../../containers/CheckoutV2/shared/DeliveryInstructions/DeliveryInstructionsContainer'
import Accordion from '../../common/Accordion/Accordion'

// component helper
export function getHasSelectedAddress(form) {
  return !!path(['fields', 'address1', 'value'], form)
}
export function gethasFoundAddress(form) {
  return !path(['fields', 'findAddress', 'value'], form)
}
export const mapStateToProps = (state, { addressType }) => {
  const formNames = getFormNames(addressType)
  const country = getCountryFor(addressType, formNames.address, state)
  const isFindAddressVisible = getIsFindAddressVisible(
    addressType,
    formNames.address,
    country,
    state
  )

  const postCodeRules = getPostCodeRules(state, country)
  const addressForm = getAddressForm(addressType, formNames.address, state)
  const findAddressForm = getAddressForm(
    addressType,
    formNames.findAddress,
    state
  )
  const hasFoundAddress = gethasFoundAddress(findAddressForm)
  const hasSelectedAddress = getHasSelectedAddress(addressForm)
  const countries = getCountriesByAddressType(state, addressType)

  return {
    addressForm,
    addressValidationSchema: getYourAddressSchema(postCodeRules, countries),
    country,
    countries,
    countryCode: getCountryCodeFromQAS(state, country),
    canFindAddress: !!path(['config', 'qasCountries', country], state),
    detailsForm: getAddressForm(addressType, formNames.details, state),
    detailsValidationSchema: getYourDetailsSchema(country),
    findAddressForm,
    findAddressValidationSchema: isFindAddressVisible
      ? getFindAddressSchema(postCodeRules)
      : {},
    formNames,
    isFindAddressVisible,
    postCodeRules,
    siteDeliveryISOs: getSiteDeliveryISOs(state),
    // NOTE: rather hacky way of determining whether the schemas have updated (as can't do a `===` on them)
    // think about using something like https://github.com/reactjs/reselect
    schemaHash: isFindAddressVisible
      ? [
          country,
          isFindAddressVisible,
          hasFoundAddress,
          hasSelectedAddress,
        ].join(':')
      : [country, isFindAddressVisible].join(':'),
    usStates: pathOr([], ['siteOptions', 'USStates'], state),
    shouldDisplayDeliveryInstructions: shouldDisplayDeliveryInstructions(state),
  }
}

export const mapDispatchToProps = {
  clearFormErrors,
  clearFormFieldError,
  findAddress,
  findExactAddressByMoniker,
  resetForm,
  resetFormPartial,
  setFormField,
  setAndValidateFormField,
  touchedFormField,
  validateForm,
  validateDDPForCountry,
  showModal,
  setCountry,
}

class AddressForm extends Component {
  static propTypes = {
    addressType: PropTypes.oneOf([
      'deliveryCheckout',
      'deliveryMCD',
      'billingCheckout',
      'billingMCD',
      'addressBook',
    ]).isRequired,
    addressValidationSchema: PropTypes.object,
    countryCode: PropTypes.string,
    detailsValidationSchema: PropTypes.object,
    findAddressForm: PropTypes.object.isRequired,
    findAddressValidationSchema: PropTypes.object,
    formNames: PropTypes.object.isRequired,
    schemaHash: PropTypes.string,
    isCheckout: PropTypes.bool.isRequired,
    siteDeliveryISOs: PropTypes.arrayOf(PropTypes.string).isRequired,
    titleHidden: PropTypes.bool,
    isFindAddressVisible: PropTypes.bool,
    isDesktopMultiColumnStyle: PropTypes.bool,
    // functions
    onSelectCountry: PropTypes.func,
    clearFormErrors: PropTypes.func.isRequired,
    clearFormFieldError: PropTypes.func.isRequired,
    findAddress: PropTypes.func.isRequired,
    findExactAddressByMoniker: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    resetFormPartial: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    setAndValidateFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    validateDDPForCountry: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    addressValidationSchema: {},
    findAddressValidationSchema: {},
    countryCode: null,
    countries: [],
    canFindAddress: false,
    detailsValidationSchema: {},
    isFindAddressVisible: true,
    isDesktopMultiColumnStyle: false,
    postCodeRules: {},
    schemaHash: '',
    usStates: [],
    onSelectCountry: () => {},
    validateDDPForCountry: () => {},
    isCheckout: false,
    titleHidden: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      monikers: [],
      deliveryAccordion: false,
    }
  }

  componentDidMount() {
    const {
      country,
      formNames,
      setAndValidateFormField,
      addressValidationSchema,
    } = this.props
    // validate set default/initial Country
    setAndValidateFormField(
      formNames.address,
      'country',
      country,
      addressValidationSchema.country
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemaHash !== this.props.schemaHash) {
      this.validateForms()
    }
  }

  setAndValidateFindAddressField = (fieldName) => ({ target: { value } }) => {
    const {
      formNames,
      setAndValidateFormField,
      findAddressValidationSchema,
    } = this.props
    return setAndValidateFormField(
      formNames.findAddress,
      fieldName,
      value,
      findAddressValidationSchema[fieldName]
    )
  }

  setAndValidateAddressField = (fieldName) => ({ target: { value } }) => {
    const {
      formNames,
      addressValidationSchema,
      setAndValidateFormField,
    } = this.props
    return setAndValidateFormField(
      formNames.address,
      fieldName,
      value,
      addressValidationSchema[fieldName]
    )
  }

  validateForms() {
    const {
      formNames,
      addressValidationSchema,
      findAddressValidationSchema,
      validateForm,
      isFindAddressVisible,
    } = this.props
    if (isFindAddressVisible) {
      validateForm(formNames.findAddress, findAddressValidationSchema)
    } else {
      validateForm(formNames.address, addressValidationSchema)
    }
  }

  touchField = (formName) => (fieldName) => () => {
    const { touchedFormField } = this.props
    return touchedFormField(formName, fieldName)
  }

  handleFindAddressRequest = () => {
    const {
      formNames,
      countryCode,
      findAddressForm,
      clearFormFieldError,
      findAddress,
    } = this.props
    return findAddress({
      data: {
        country: countryCode,
        postcode: findAddressForm.fields.postcode.value,
        address: findAddressForm.fields.houseNumber.value,
      },
      formNames,
    }).then((monikers) => {
      if (Array.isArray(monikers)) {
        this.setState({
          monikers,
        })
        /*
          addresses have been found thefore clear errors in FindAddress form
        */
        clearFormFieldError(formNames.findAddress, 'findAddress')
      }
      // @monikers came back with a single address object
      if (monikers && monikers.body) {
        /*
          findAddress action results sets ManualAddress address fields and changes isManual=true
          The call to action started from FindAdress form
          Hence validation messages for FindAddress need to be cleared as follows
          - findAddress for FindAddress button
          - selectAddress for moniker results dropdown select field
        */
        clearFormFieldError(formNames.findAddress, 'findAddress')
        clearFormFieldError(formNames.findAddress, 'selectAddress')
      }
    })
  }

  handleAddressChange = ({ target: { selectedIndex } }) => {
    const {
      countryCode,
      formNames,
      findExactAddressByMoniker,
      clearFormErrors,
    } = this.props

    const moniker = path([selectedIndex - 1, 'moniker'], this.state.monikers)

    if (moniker) {
      findExactAddressByMoniker({
        country: countryCode,
        moniker,
        formNames,
      })
      clearFormErrors(formNames.findAddress)
    }
  }

  handleSwitchToFindAddress = (event) => {
    const { formNames, resetFormPartial } = this.props
    event.preventDefault()
    this.setState({
      monikers: [],
    })
    resetFormPartial(formNames.address, {
      isManual: false,
    })
  }

  handleSwitchToManualAddress = (event) => {
    const { formNames, resetFormPartial } = this.props
    event.preventDefault()
    resetFormPartial(formNames.address, {
      isManual: true,
    })
  }

  trimOnBlur = (formName, validationSchema) => (fieldName) => ({
    target: { value },
  }) => {
    const { setAndValidateFormField } = this.props
    return setAndValidateFormField(
      formName,
      fieldName,
      value.trim(),
      validationSchema[fieldName]
    )
  }

  handleAccordionToggle = () => {
    const { deliveryAccordion } = this.state
    this.setState({ deliveryAccordion: !deliveryAccordion })
  }

  render() {
    const {
      formNames,
      findAddressValidationSchema,
      addressValidationSchema,
      isFindAddressVisible,
      addressType,
      titleHidden,
      isDesktopMultiColumnStyle,
      shouldDisplayDeliveryInstructions,
    } = this.props
    const { l } = this.context

    const AddressForm = classnames('AddressForm', {
      'AddressForm--multiColumn': isDesktopMultiColumnStyle,
    })

    return (
      <section className={AddressForm} aria-label="AddressForm">
        {!titleHidden && (
          <h3 className="AddressForm-heading">
            {addressType === 'addressBook' ? l`Add New Address` : l`Address`}
          </h3>
        )}
        <div className="AddressForm-row">
          <WithQubit
            id="qubit-hide-delivery-country"
            shouldUseQubit={addressType === 'deliveryCheckout'}
          >
            <CountrySelect addressType={addressType} />
          </WithQubit>
          <div className="AddressForm-col">&nbsp;</div>
        </div>
        {isFindAddressVisible ? (
          <FindAddress
            {...this.props}
            onBlur={this.trimOnBlur(
              formNames.findAddress,
              findAddressValidationSchema
            )}
            isDesktopMultiColumnStyle={isDesktopMultiColumnStyle}
            monikers={this.state.monikers}
            setAndValidateFindAddressField={this.setAndValidateFindAddressField}
            setAndValidateAddressField={this.setAndValidateAddressField}
            touchField={this.touchField}
            handleFindAddressRequest={this.handleFindAddressRequest}
            handleAddressChange={this.handleAddressChange}
            handleSwitchToManualAddress={this.handleSwitchToManualAddress}
          />
        ) : (
          <React.Fragment>
            <ManualAddress
              {...this.props}
              onBlur={this.trimOnBlur(
                formNames.address,
                addressValidationSchema
              )}
              isDesktopMultiColumnStyle={isDesktopMultiColumnStyle}
              setAndValidateAddressField={this.setAndValidateAddressField}
              touchField={this.touchField}
              handleSwitchToFindAddress={this.handleSwitchToFindAddress}
              shouldResetFormOnUnmount={[
                'addressBook',
                'billingMCD',
                'deliveryMCD',
              ].includes(addressType)}
            />

            {addressType === 'deliveryCheckout' &&
              shouldDisplayDeliveryInstructions && (
                <Accordion
                  className="Accordion--deliveryInstructions"
                  header={l`Delivery Instructions`}
                  accordionName={l`Delivery Instructions`}
                  onAccordionToggle={this.handleAccordionToggle}
                  expanded={this.state.deliveryAccordion}
                  noContentPadding
                  noHeaderPadding
                >
                  <HomeDeliveryInstructions />
                </Accordion>
              )}
          </React.Fragment>
        )}
      </section>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressForm)

export { AddressForm as WrappedAddressForm }
