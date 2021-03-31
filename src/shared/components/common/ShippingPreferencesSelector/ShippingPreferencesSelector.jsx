import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import countryList from 'country-list'

import { error } from '../../../../client/lib/logger'
import {
  getBrandLanguageOptions,
  isMultiLanguageShippingCountry,
  getDefaultLanguageByShippingCountry,
} from '../../../lib/language'

// actions
import * as ShippingDestinationActions from '../../../actions/common/shippingDestinationActions'

// selectors
import {
  getBrandCode,
  getLanguage,
  getCountry,
} from '../../../selectors/configSelectors'
import { getShippingCountries } from '../../../selectors/common/configSelectors'
import { getShippingDestination } from '../../../selectors/shippingDestinationSelectors'

// components
import Select from '../FormComponents/Select/Select'
import Button from '../Button/Button'
import GeoIPPixelCookies from '../GeoIP/GeoIPPixelCookies'
import BagTransferNote from '../BagTransferNote/BagTransferNote'

import Form from '../FormComponents/Form/Form'

export const cantFindCountryHelpLinks = {
  ts:
    'http://help.topshop.com/system/templates/selfservice/topshop/#!portal/403700000001048/article/Prod-2224/Do-you-provide-International-delivery',
  tm:
    'http://help.topman.com/system/templates/selfservice/topman/#!portal/403700000001052/article/Prod-2434/Do-you-provide-International-delivery',
  dp:
    'http://help.dorothyperkins.com/system/templates/selfservice/dorothyperkins/#!portal/403700000001066/article/Prod-2614/Do-you-provide-International-delivery',
  wl:
    'http://help.wallis.co.uk/system/templates/selfservice/wallis/#!portal/403700000001010/article/Prod-2067/Do-you-provide-International-delivery',
  ev:
    'http://help.evans.co.uk/system/templates/selfservice/evans/#!portal/403700000001062/article/Prod-2725/Do-you-provide-International-delivery',
  br:
    'http://help.burton.co.uk/system/templates/selfservice/burton/#!portal/403700000001071/article/Prod-2463/Do-you-provide-International-delivery',
  ms:
    'http://help.missselfridge.com/system/templates/selfservice/missselfridge/#!portal/403700000001057/article/Prod-2599/Do-you-provide-International-delivery',
}

class ShippingPreferencesSelector extends Component {
  static propTypes = {
    brandCode: PropTypes.string.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    defaultShippingCountry: PropTypes.string.isRequired,
    currentShippingCountry: PropTypes.string.isRequired,
    geoIPEnabled: PropTypes.bool.isRequired,
    shippingCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    selectedShippingCountry:
      this.props.currentShippingCountry || this.props.defaultShippingCountry,
    selectedLanguage: this.props.currentLanguage,
    shouldSetGeoIPCookies: false,
  }

  get cantFindCountryHelpLink() {
    return cantFindCountryHelpLinks[this.props.brandCode]
  }

  handleGeoIPCookieError = (err) => {
    const { selectedShippingCountry, selectedLanguage } = this.state
    const { currentShippingCountry } = this.props

    error(`GeoIP pixel error when setting cookie for all hostnames`, {
      error: new Error(
        'GeoIP pixel error when setting cookie for all hostnames'
      ),
      message: JSON.stringify({
        message: 'GeoIP pixel error when setting cookie for all hostnames',
        sourceURL: window.location.href,
        geoPixelURL: err.nativeEvent.currentTarget.currentSrc,
        selectedShippingCountry,
        selectedLanguage,
        currentShippingCountry,
      }),
    })
  }

  handleGeoIPCookieSuccess = () => {
    this.props.redirect(
      this.state.selectedShippingCountry,
      this.state.selectedLanguage,
      'shippingSelectorModal'
    )
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.props.geoIPEnabled) {
      this.setState({ shouldSetGeoIPCookies: true })
    } else {
      this.handleGeoIPCookieSuccess()
    }
  }

  handleCountrySelectorChange = (e) => {
    const selectedShippingCountry = e.target.value
    const selectedLanguage = getDefaultLanguageByShippingCountry(
      this.props.brandCode,
      selectedShippingCountry
    )
    this.setState({ selectedShippingCountry, selectedLanguage })
  }

  handleLanguageSelectorChange = (e) => {
    this.setState({ selectedLanguage: e.target.value })
  }

  renderSubmitButton = (l) => {
    return (
      <div className="ShippingPreferencesSelector-inputGroupButton">
        <Button
          type="submit"
          className="ShippingPreferencesSelector-submitButton"
        >
          {l`Go`}
        </Button>
      </div>
    )
  }

  render() {
    const { l } = this.context
    const {
      selectedLanguage,
      selectedShippingCountry,
      shouldSetGeoIPCookies,
    } = this.state
    const { brandCode } = this.props

    const brandLanguageOptions = getBrandLanguageOptions(brandCode)
    const isMultiLangCountryOption = isMultiLanguageShippingCountry(
      selectedShippingCountry
    )
    const showLanguageSelector =
      brandLanguageOptions.length > 1 && isMultiLangCountryOption

    return (
      <section className="ShippingPreferencesSelector">
        <header className="ShippingPreferencesSelector-header">
          <div className="ShippingPreferencesSelector-subHeading">
            {l`We ship to over 100 countries`}
          </div>
        </header>

        <Form
          className="ShippingPreferencesSelector-form"
          onSubmit={this.handleFormSubmit}
        >
          <div className="ShippingPreferencesSelector-dropdowns">
            <div className="ShippingPreferencesSelector-inputGroup">
              <div className="ShippingPreferencesSelector-inputGroupSelect">
                <Select
                  className="ShippingPreferencesSelector-countrySelector"
                  name="country"
                  options={this.props.shippingCountries}
                  value={selectedShippingCountry}
                  label={l`Please choose your shipping destination`}
                  onChange={this.handleCountrySelectorChange}
                />
              </div>
              {!showLanguageSelector && this.renderSubmitButton(l)}
            </div>
            <a
              className="ShippingPreferencesSelector-cantFindCountryHelpLink"
              href={this.cantFindCountryHelpLink}
            >
              {l`Can't find country?`}
            </a>
            {showLanguageSelector && (
              <div className="ShippingPreferencesSelector-inputGroup">
                <div className="ShippingPreferencesSelector-inputGroupSelect">
                  <Select
                    className="ShippingPreferencesSelector-languageSelector"
                    name="language"
                    options={brandLanguageOptions}
                    value={selectedLanguage}
                    label={l`Choose your language`}
                    onChange={this.handleLanguageSelectorChange}
                  />
                </div>
                {this.renderSubmitButton(l)}
              </div>
            )}
          </div>
        </Form>
        <BagTransferNote />
        {shouldSetGeoIPCookies && (
          <GeoIPPixelCookies
            cookieValue={countryList.getCode(selectedShippingCountry)}
            handleSuccess={this.handleGeoIPCookieSuccess}
            handleError={this.handleGeoIPCookieError}
          />
        )}
      </section>
    )
  }
}

export default connect(
  (state) => ({
    brandCode: getBrandCode(state),
    currentLanguage: getLanguage(state),
    currentShippingCountry: getShippingDestination(state),
    defaultShippingCountry: getCountry(state),
    geoIPEnabled: state.features.status.FEATURE_GEOIP,
    shippingCountries: getShippingCountries(state),
  }),
  {
    redirect: ShippingDestinationActions.redirect,
  }
)(ShippingPreferencesSelector)

export { ShippingPreferencesSelector as WrappedShippingPreferencesSelector }
