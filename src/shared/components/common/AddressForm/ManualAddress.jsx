import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import { pathOr } from 'ramda'

import { updateCountryForChannelIslands } from '../../../lib/checkout-utilities/utils'

// components
import Input from '../FormComponents/Input/Input'
import Select from '../FormComponents/Select/Select'

class ManualAddress extends Component {
  componentDidMount() {
    const { validateForm, formNames, addressValidationSchema } = this.props
    validateForm(formNames.address, addressValidationSchema)
  }

  componentWillUnmount() {
    const {
      clearFormErrors,
      formNames,
      resetFormPartial,
      shouldResetFormOnUnmount,
    } = this.props

    if (shouldResetFormOnUnmount) {
      resetFormPartial(formNames.address, {
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        county: '',
        state: '',
        isManual: false,
      })
    }
    clearFormErrors(formNames.address)
  }

  handleClearForm = (event) => {
    event.preventDefault()
    const {
      country,
      formNames,
      validateForm,
      resetForm,
      addressValidationSchema,
    } = this.props

    resetForm(formNames.address, {
      address1: '',
      address2: '',
      postcode: '',
      city: '',
      county: '',
      state: '',
      country,
      isManual: true,
    })
    validateForm(formNames.address, addressValidationSchema)
  }

  render() {
    const {
      addressForm,
      onBlur,
      country,
      canFindAddress,
      formNames,
      isDesktopMultiColumnStyle,
      isFindAddressVisible,
      postCodeRules,
      usStates,
      setAndValidateAddressField,
      touchField,
      setCountry,
      handleSwitchToFindAddress,
    } = this.props
    const { l } = this.context

    const ManualAddressClass = classnames('ManualAddress', {
      'ManualAddress--multiColumn': isDesktopMultiColumnStyle,
    })

    const postcodeBlurHandler = (event) => {
      const updateCountry = updateCountryForChannelIslands({
        postcode: pathOr('', ['target', 'value'], event),
        country,
      })

      if (updateCountry) {
        setCountry(this.props.addressType, updateCountry)
      }

      const blurHandler = onBlur('postcode')
      blurHandler(event)
    }

    return country &&
      country !== 'default' &&
      isFindAddressVisible === false ? (
      <section className={ManualAddressClass} aria-label="Address">
        <div className="ManualAddress-row">
          <Input
            className="ManualAddress-address1"
            label={l`Address Line 1`}
            field={addressForm.fields.address1}
            setField={setAndValidateAddressField}
            touchedField={touchField(formNames.address)}
            placeholder={l`Address Line 1`}
            name="address1"
            errors={addressForm.errors}
            isRequired
          />
          <Input
            className="ManualAddress-address2"
            label={l`Address Line 2`}
            field={addressForm.fields.address2}
            setField={setAndValidateAddressField}
            touchedField={touchField(formNames.address)}
            placeholder={l`Address Line 2`}
            name="address2"
            errors={addressForm.errors}
          />
        </div>
        {postCodeRules.stateFieldType ? (
          postCodeRules.stateFieldType === 'input' ? (
            <Input
              label={l`State`}
              field={addressForm.fields.state}
              setField={setAndValidateAddressField}
              touchedField={touchField(formNames.address)}
              placeholder="State"
              name="state"
            />
          ) : (
            <Select
              label={l`State`}
              name="state"
              value={addressForm.fields.state.value}
              onChange={setAndValidateAddressField('state')}
              options={usStates}
              defaultValue={addressForm.fields.state.value || usStates[0]}
            />
          )
        ) : null}
        <div className="ManualAddress-row">
          <Input
            className="ManualAddress-postcode"
            label={l(postCodeRules.postcodeLabel || 'Postcode')}
            field={addressForm.fields.postcode}
            onBlur={postcodeBlurHandler}
            setField={setAndValidateAddressField}
            touchedField={touchField(formNames.address)}
            placeholder={l(postCodeRules.postcodeLabel || 'Postcode')}
            name="postcode"
            errors={addressForm.errors}
            isRequired={postCodeRules.postcodeRequired}
          />
          <Input
            className="ManualAddress-city"
            label={l`Town/City`}
            field={addressForm.fields.city}
            setField={setAndValidateAddressField}
            touchedField={touchField(formNames.address)}
            placeholder={l`Town/City`}
            name="city"
            errors={addressForm.errors}
            isRequired
          />
        </div>
        <div className="ManualAddress-linkWrapper">
          <button
            type="reset"
            data-jest-button-id="clear-form"
            onClick={(e) => this.handleClearForm(e)}
            className="ManualAddress-link ManualAddress-link--left"
          >
            {l`Clear form`}
          </button>
          {canFindAddress && (
            <button
              type="button"
              onClick={handleSwitchToFindAddress}
              className="ManualAddress-link ManualAddress-link--right"
            >
              {l`Find Address`}
            </button>
          )}
        </div>
      </section>
    ) : null
  }
}

ManualAddress.propTypes = {
  addressForm: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
  canFindAddress: PropTypes.bool,
  formNames: PropTypes.object.isRequired,
  isDesktopMultiColumnStyle: PropTypes.bool,
  isFindAddressVisible: PropTypes.bool,
  postCodeRules: PropTypes.object,
  usStates: PropTypes.arrayOf(PropTypes.string),
  setAndValidateAddressField: PropTypes.func.isRequired,
  touchField: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  handleSwitchToFindAddress: PropTypes.func.isRequired,
  shouldResetFormOnUnmount: PropTypes.bool,
}

ManualAddress.contextTypes = {
  l: PropTypes.func,
}

ManualAddress.defaultProps = {
  country: 'United Kingdom',
  canFindAddress: false,
  isDesktopMultiColumnStyle: false,
  isFindAddressVisible: true,
  shouldResetFormOnUnmount: false,
  postCodeRules: {},
  onBlur: () => null,
}

export default ManualAddress
