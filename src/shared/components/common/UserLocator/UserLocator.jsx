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
  getStoreCountries,
} from '../../../selectors/storeLocatorSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

@connect(
  (state) => ({
    selectedCountry: getSelectedCountry(state),
    isMobile: isMobile(state),
    countries: getStoreCountries(state),
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
class UserLocator extends Component {
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
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  UNSAFE_componentWillMount() {
    const {
      storeLocatorLandingPage,
      selectedCountry,
      selectCountry,
    } = this.props
    if (storeLocatorLandingPage && !selectedCountry) {
      selectCountry(storeLocatorConsts.defaultCountry)
    }
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
      countries,
    } = this.props
    return (
      <Form className="UserLocator" onSubmit={this.submitHandler}>
        <div className="UserLocator-countryContainer">
          {!storeLocatorLandingPage && (
            <Image
              className="UserLocator-mapMarker"
              alt="Store locator map marker"
              src={'/assets/{brandName}/images/map-marker.svg'}
            />
          )}
          <div
            className={`${
              storeLocatorLandingPage ? 'UserLocator-container' : ''
            }`}
            style={{
              marginBottom: isMobile && this.showInput ? 15 : 0,
            }}
          >
            {storeLocatorLandingPage && (
              <h1 className="UserLocator-storeFinderText">{l`Store Locator`}</h1>
            )}
            <CountryChooser
              isLandingPage={storeLocatorLandingPage}
              name={
                storeLocatorLandingPage
                  ? 'StoreFinderCountrySelect'
                  : 'CountrySelect'
              }
              countries={countries}
            />
          </div>
          {!storeLocatorLandingPage &&
            selectedCountry &&
            !this.showInput && (
              <Button
                title={l`Go`}
                type="submit"
                className="UserLocator-goButton UserLocator-goButton--country"
              >
                {l`Go`}
              </Button>
            )}
        </div>
        <UserLocatorInput
          selectedCountry={selectedCountry || storeLocatorConsts.defaultCountry}
          submitHandler={this.submitHandler}
        />
      </Form>
    )
  }
}

export default UserLocator
