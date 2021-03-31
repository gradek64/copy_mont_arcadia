import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Image from '../Image/Image'
import storeLocatorConsts from '../../../constants/storeLocator'
import Button from '../Button/Button'
import CountryChooser from '../StoreLocator/CountryChooser'
import UserLocatorInput from '../UserLocatorInput/UserLocatorInput'
import {
  searchStores,
  searchStoresCheckout,
  setSelectedPlace,
  resetPredictions,
  resetSearchTerm,
  resetSelectedPlace,
  navigateToStoreLocator,
} from '../../../actions/components/UserLocatorActions'
import {
  selectCountry,
  receiveStores,
  getStoresLoading,
} from '../../../actions/components/StoreLocatorActions'
import { setFormField } from '../../../actions/common/formActions'
import Form from '../FormComponents/Form/Form'
import {
  getSelectedCountry,
  getIntStoreCountries,
} from '../../../selectors/storeLocatorSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getBrandName, getCountry } from '../../../selectors/configSelectors'

@connect(
  (state) => ({
    selectedCountry: getSelectedCountry(state),
    isMobile: isMobile(state),
    countries: getIntStoreCountries(state),
    brandName: getBrandName(state),
    country: getCountry(state),
  }),
  {
    searchStores,
    searchStoresCheckout,
    setSelectedPlace,
    resetPredictions,
    resetSearchTerm,
    resetSelectedPlace,
    setFormField,
    selectCountry,
    receiveStores,
    navigateToStoreLocator,
    getStoresLoading,
  }
)
class InternationalUserLocator extends Component {
  static propTypes = {
    selectedCountry: PropTypes.string,
    storeLocatorType: PropTypes.string,
    storeLocatorLandingPage: PropTypes.bool,
    searchStores: PropTypes.func,
    searchStoresCheckout: PropTypes.func,
    resetPredictions: PropTypes.func,
    resetSearchTerm: PropTypes.func,
    resetSelectedPlace: PropTypes.func,
    setFormField: PropTypes.func,
    selectCountry: PropTypes.func,
    isMobile: PropTypes.bool,
    receiveStores: PropTypes.func,
    navigateToStoreLocator: PropTypes.func,
    getStoresLoading: PropTypes.func,
    countries: PropTypes.array,
    country: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  UNSAFE_componentWillReceiveProps({ selectedCountry }) {
    if (selectedCountry && selectedCountry !== this.props.selectedCountry) {
      this.searchStoresByCountry(selectedCountry)
    }
  }

  clearSearchField = () => {
    const {
      setFormField,
      resetPredictions,
      resetSearchTerm,
      resetSelectedPlace,
    } = this.props
    setFormField('userLocator', 'userLocation', '')
    resetPredictions()
    resetSearchTerm()
    resetSelectedPlace()
  }

  submitHandler = (e) => {
    if (e) e.preventDefault()
    this.searchStores()
  }

  searchStores = () => {
    const { storeLocatorType, searchStoresCheckout, searchStores } = this.props
    if (storeLocatorType === 'collectFromStore') {
      searchStoresCheckout()
    } else {
      searchStores()
    }
  }

  locatorReset = () => {
    const {
      receiveStores,
      navigateToStoreLocator,
      getStoresLoading,
    } = this.props
    navigateToStoreLocator({})
    getStoresLoading(true)
    receiveStores([])
    getStoresLoading(false)
  }

  searchStoresByCountry = (country) => {
    const { storeLocatorLandingPage, selectCountry } = this.props
    selectCountry(country)
    this.locatorReset()
    if (
      storeLocatorLandingPage &&
      country !== storeLocatorConsts.defaultCountry
    ) {
      // Avoiding the scenario where the User selects UK and a place in the UK,
      // then he selects US and then again UK seeing the search field already
      // filled with the previous data.
      this.clearSearchField()
      this.searchStores()
    }
  }

  get showInput() {
    const { selectedCountry } = this.props
    return selectedCountry === storeLocatorConsts.defaultCountry
  }

  render() {
    const { l } = this.context
    const {
      isMobile,
      selectedCountry,
      storeLocatorLandingPage, // TODO: remove when there is no store finder any more in the hamburger menu,
      brandName,
      country,
    } = this.props
    const url = storeLocatorConsts.yextProdLinks[brandName]
    return (
      <Form className="IntUserLocator" onSubmit={this.submitHandler}>
        <div className="IntUserLocator-countryContainer">
          {!storeLocatorLandingPage && (
            <Image
              className="IntUserLocator-mapMarker"
              alt="Store locator map marker"
              src={'/assets/{brandName}/images/map-marker.svg'}
            />
          )}
          <div
            className={`${
              storeLocatorLandingPage ? 'IntUserLocator-container' : ''
            }`}
            style={{
              marginBottom: isMobile && this.showInput ? 15 : 0,
            }}
          >
            {storeLocatorLandingPage && (
              <div>
                <h1 className="IntUserLocator-storeFinderText">{l`International Store Finder`}</h1>
                {country === storeLocatorConsts.defaultCountry && (
                  <a
                    href={url}
                    className="IntUserLocator-findText"
                  >{l`Find UK Stores`}</a>
                )}
                <p className="IntUserLocator-chooseCountryStatement">
                  {l`Choose Country Statement`}
                </p>
              </div>
            )}
            <CountryChooser
              isLandingPage={storeLocatorLandingPage}
              name={
                storeLocatorLandingPage
                  ? 'InterStoreFinderCountrySelect'
                  : 'InterCountrySelect'
              }
              selectedCountry={null}
              countries={this.props.countries}
            />
          </div>
          {!storeLocatorLandingPage &&
            selectedCountry &&
            !this.showInput && (
              <Button
                title={l`Go`}
                type="submit"
                className="IntUserLocator-goButton IntUserLocator-goButton--country"
              >
                {l`Go`}
              </Button>
            )}
        </div>
        {!storeLocatorLandingPage && (
          <UserLocatorInput selectedCountry={selectedCountry} />
        )}
      </Form>
    )
  }
}

export default InternationalUserLocator
