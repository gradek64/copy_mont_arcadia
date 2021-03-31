import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getName } from 'country-list'

import ShippingDestinationFlag from '../ShippingDestinationFlag/ShippingDestinationFlag'
import Button from '../Button/Button'

export default class RedirectionPrompt extends Component {
  static propTypes = {
    currentSiteRegion: PropTypes.string.isRequired,
    userISOPreference: PropTypes.string.isRequired,
    currentSiteISO: PropTypes.string.isRequired,
    setGeoIPCookies: PropTypes.func.isRequired,
    showFootnote: PropTypes.bool.isRequired,
    geoTranslate: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  /**
   * We translate the text in the GeoIPModal based on the userGeoPreference,
   * rather than using the default site language and so we have to maintain
   * a mini dictionary for it (see translateGeoIPTextInPreferredLanguage).
   *
   * If you change which dictionary entries are used here, please remember
   * to update the dictionaryStrings
   */
  /* eslint-disable no-template-curly-in-string */
  static dictionaryStrings = [
    'Country preferences',
    'de',
    'eu',
    'fr',
    'uk',
    'us',
    'the uk',
    'the us',
    'You are viewing the website for ${currentSite}. Would you like to view the website for ${otherSite} instead?',
    'Take me to the ${otherSite} site',
    'Continue to the ${currentSite} site',
    'NOTE: If you choose to be redirected, you will be taken to the home page.',
  ]
  /* eslint-enable no-template-curly-in-string */

  mapRegion = (regionCode) => {
    const regions = {
      eu: 'Europe',
      uk: 'United Kingdom',
      fr: 'France',
      de: 'Germany',
      us: 'United States',
    }
    return regions[regionCode] || 'default'
  }

  amendRegionName = (region) => {
    if (region === 'uk' || region === 'us') return `the ${region}`
    return region
  }

  render() {
    const {
      currentSiteRegion,
      userISOPreference,
      currentSiteISO,
      setGeoIPCookies,
      showFootnote,
      geoTranslate,
    } = this.props

    const geoPreferenceSiteCountryName = getName(userISOPreference)

    return (
      <div>
        <h3 className="GeoIP-title">{geoTranslate('Country preferences')}</h3>
        <p className="GeoIP-info">{geoTranslate`You are viewing the website for ${geoTranslate(
          this.amendRegionName(currentSiteRegion)
        )}. Would you like to view the website for ${geoPreferenceSiteCountryName} instead?`}</p>
        <Button
          clickHandler={setGeoIPCookies({
            cookieValue: currentSiteISO,
            shouldRedirect: false,
          })}
          className="GeoIP-optionBtn Button--secondary"
        >
          <span className="GeoIP-flag">
            <ShippingDestinationFlag
              shippingDestination={this.mapRegion(currentSiteRegion)}
            />
          </span>

          <span className="translate">
            {geoTranslate`Continue to the ${geoTranslate(
              currentSiteRegion
            )} site`}
          </span>
        </Button>
        <Button
          className="GeoIP-optionBtn Button--secondary"
          clickHandler={setGeoIPCookies({
            cookieValue: userISOPreference,
            shouldRedirect: true,
          })}
        >
          <span className="GeoIP-flag">
            <ShippingDestinationFlag
              shippingDestination={geoPreferenceSiteCountryName}
            />
          </span>
          <span className="translate">
            {geoTranslate`Take me to the ${geoPreferenceSiteCountryName} site`}
          </span>
        </Button>
        {showFootnote && (
          <p data-id="GeoIPModal-Footnote" className="GeoIP-footnote">
            {geoTranslate(
              'NOTE: If you choose to be redirected, you will be taken to the home page.'
            )}
          </p>
        )}
      </div>
    )
  }
}
