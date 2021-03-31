import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import { path, pathOr } from 'ramda'
import { updateCountryForChannelIslands } from '../../../lib/checkout-utilities/utils'
import Input from '../FormComponents/Input/Input'
import Select from '../FormComponents/Select/Select'
import Button from '../FormComponents/Button/Button'
import Message from '../FormComponents/Message/Message'

class FindAddress extends Component {
  componentDidMount() {
    const { validateForm, formNames, findAddressValidationSchema } = this.props
    validateForm(formNames.findAddress, findAddressValidationSchema)
  }
  componentWillUnmount() {
    const { clearFormErrors, resetForm, formNames } = this.props
    resetForm(formNames.findAddress, {
      houseNumber: '',
      message: '',
      findAddress: '',
      selectAddress: '',
      postcode: '',
    })
    clearFormErrors(formNames.findAddress)
  }
  render() {
    const {
      onBlur,
      country,
      findAddressForm,
      formNames,
      isDesktopMultiColumnStyle,
      monikers,
      postCodeRules,
      setAndValidateFindAddressField,
      touchField,
      setCountry,
      handleFindAddressRequest,
      handleAddressChange,
      handleSwitchToManualAddress,
    } = this.props
    const { l } = this.context

    const error = path(['message', 'message'], findAddressForm)

    const FindAddressClass = classnames('FindAddressV1', {
      'FindAddressV1--multiColumn': isDesktopMultiColumnStyle,
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

    return (
      <section className={FindAddressClass} aria-label="Find Address">
        <div className="FindAddressV1-form">
          <div className="FindAddressV1-row">
            <Input
              className="FindAddressV1-postcode"
              field={pathOr({}, ['fields', 'postcode'], findAddressForm)}
              name="postcode"
              label={l(postCodeRules.postcodeLabel || 'Postcode')}
              errors={findAddressForm.errors}
              placeholder={l`Eg. W1T 3NL`}
              onBlur={postcodeBlurHandler}
              setField={setAndValidateFindAddressField}
              touchedField={touchField(formNames.findAddress)}
              isRequired={postCodeRules.postcodeRequired}
            />
            <Input
              className="FindAddressV1-houseNumber"
              field={pathOr({}, ['fields', 'houseNumber'], findAddressForm)}
              name="houseNumber"
              label={l(postCodeRules.premisesLabel || 'House number')}
              errors={findAddressForm.errors}
              placeholder={l`Eg. 214`}
              setField={setAndValidateFindAddressField}
              touchedField={touchField(formNames.findAddress)}
            />
          </div>
          <Button
            onClick={handleFindAddressRequest}
            customClass="FindAddressV1-cta"
            className="FindAddressV1-button"
            name="findAddress"
            isDisabled={!!path(['errors', 'postcode'], findAddressForm)}
            error={path(['errors', 'findAddress'], findAddressForm)}
            touched={path(
              ['fields', 'findAddress', 'isTouched'],
              findAddressForm
            )}
          >
            {l`Find Address`}
          </Button>
          <button
            type="button"
            onClick={handleSwitchToManualAddress}
            className="FindAddressV1-link"
          >
            {l`or manually enter address`}
          </button>
          {error && <Message message={error} type="error" />}
          <Select
            label={l`Click to select your address`}
            onChange={handleAddressChange}
            className={`FindAddressV1-selectAddress${
              Array.isArray(monikers) && monikers.length ? '' : ' is-hidden'
            }`}
            name="selectAddress"
            firstDisabled={l`Please select your address...`}
            options={
              Array.isArray(monikers)
                ? monikers.map(({ address, moniker }) => ({
                    label: address,
                    value: moniker,
                  }))
                : []
            }
            field={path(['fields', 'selectAddress'], findAddressForm)}
            errors={findAddressForm.errors}
            isRequired
          />
        </div>
      </section>
    )
  }
}

FindAddress.propTypes = {
  country: PropTypes.string.isRequired,
  findAddressForm: PropTypes.object.isRequired,
  formNames: PropTypes.object.isRequired,
  isDesktopMultiColumnStyle: PropTypes.bool,
  monikers: PropTypes.array,
  onBlur: PropTypes.func.isRequired,
  postCodeRules: PropTypes.object,
  setAndValidateFindAddressField: PropTypes.func.isRequired,
  touchField: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  handleFindAddressRequest: PropTypes.func.isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  handleSwitchToManualAddress: PropTypes.func.isRequired,
}

FindAddress.contextTypes = {
  l: PropTypes.func,
}

FindAddress.defaultProps = {
  country: 'United Kingdom',
  countries: [],
  isDesktopMultiColumnStyle: false,
  isFindAddressVisible: true,
  monikers: [],
  postCodeRules: {},
  onBlur: () => null,
  titleHidden: false,
}

export default FindAddress
