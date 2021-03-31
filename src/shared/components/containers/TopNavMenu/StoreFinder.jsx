import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Image from '../../common/Image/Image'
import Form from '../../common/FormComponents/Form/Form'
import storeLocatorConsts from '../../../constants/storeLocator'
import UserLocatorInput from '../../common/UserLocatorInput/UserLocatorInput'
import { selectCountry } from '../../../actions/components/StoreLocatorActions'
import {
  searchStores,
  setSelectedPlace,
  resetPredictions,
  resetSearchTerm,
  resetSelectedPlace,
} from '../../../actions/components/UserLocatorActions'
import { setFormField } from '../../../actions/common/formActions'
import TopSectionItemLayout from './TopSectionItemLayout'
import { isFeatureYextEnabled } from '../../../../shared/selectors/featureSelectors'
import { isUsingCurrentLocation } from '../../../../shared/selectors/formsSelectors'
import { getBrandName } from '../../../../shared/selectors/configSelectors'

// selectors
import { getShippingDestination } from '../../../selectors/shippingDestinationSelectors'
import {
  getGeoLocatorCoordinatesLong,
  getGeoLocatorCoordinatesLat,
  getPredictionDescription,
} from '../../../selectors/userLocatorSelectors'

@connect(
  (state) => ({
    selectedCountry: getShippingDestination(state), // assigned the value returned by getShippingDestination as this components now work in tandem
    isFeatureYextEnabled: isFeatureYextEnabled(state),
    isUsingCurrentLocation: isUsingCurrentLocation(state),
    brandName: getBrandName(state),
    userLat: getGeoLocatorCoordinatesLat(state),
    userLong: getGeoLocatorCoordinatesLong(state),
    getPrediction: getPredictionDescription(state),
  }),
  {
    searchStores,
    setSelectedPlace,
    resetPredictions,
    resetSearchTerm,
    resetSelectedPlace,
    setFormField,
    selectCountry,
  }
)
class StoreFinder extends Component {
  state = {
    showUserLocatorInput: false,
  }

  static propTypes = {
    selectedCountry: PropTypes.string,
    storeLocatorLandingPage: PropTypes.bool,
    searchStores: PropTypes.func,
    resetPredictions: PropTypes.func,
    resetSearchTerm: PropTypes.func,
    resetSelectedPlace: PropTypes.func,
    setFormField: PropTypes.func,
    isFeatureYextEnabled: PropTypes.bool,
    selectCountry: PropTypes.func,
    getPrediction: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  UNSAFE_componentWillReceiveProps({ selectedCountry }) {
    if (selectedCountry && selectedCountry !== this.props.selectedCountry) {
      this.searchStoresByCountry(selectedCountry)
      if (
        this.state.showUserLocatorInput &&
        selectedCountry !== storeLocatorConsts.defaultCountry
      ) {
        this.setState({
          showUserLocatorInput: false,
        })
      }
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
    /*  setTimeout is used here to move the below code to the end of event queue.
      * This is because the prediction is updated in state, however not quick enough for 
      * the getPrediction selector below to pick up the change.
    */
    setTimeout(() => {
      const {
        isFeatureYextEnabled,
        brandName,
        isUsingCurrentLocation,
        selectedCountry,
        userLat,
        userLong,
        searchStores,
        getPrediction,
      } = this.props
      if (
        isFeatureYextEnabled &&
        selectedCountry === storeLocatorConsts.defaultCountry
      ) {
        if (isUsingCurrentLocation) {
          const url = `${
            storeLocatorConsts.yextProdLinks[brandName]
          }?q=${userLat},${userLong}&qp=My%20Location&l=en_GB`
          window.location = url
        } else {
          const url = `${
            storeLocatorConsts.yextProdLinks[brandName]
          }?q=${getPrediction}`
          window.location = url
        }
      } else {
        searchStores()
      }
    })
  }

  searchStoresByCountry = (country) => {
    const {
      storeLocatorLandingPage,
      searchStores,
      selectCountry,
      isFeatureYextEnabled,
    } = this.props
    if (!isFeatureYextEnabled) {
      selectCountry(country)
    }
    if (
      storeLocatorLandingPage &&
      country !== storeLocatorConsts.defaultCountry
    ) {
      // Avoiding the scenario where the User selects UK and a place in the UK,
      // then he selects US and then again UK seeing the search field already
      // filled with the previous data.
      this.clearSearchField()
      searchStores()
    }
  }

  get showInput() {
    const { selectedCountry } = this.props
    return selectedCountry === storeLocatorConsts.defaultCountry
  }

  handleRowClick = () => {
    if (!this.showInput) {
      this.submitHandler()
    } else {
      this.toggleUserLocatorInput()
    }
  }

  toggleUserLocatorInput() {
    this.setState({
      showUserLocatorInput: !this.state.showUserLocatorInput,
    })
  }

  doesBrandSupportYext(brandName) {
    const unsupportedBrands = ['wallis', 'evans']
    return !unsupportedBrands.includes(brandName)
  }

  render() {
    const { l } = this.context
    const { showUserLocatorInput } = this.state
    const { selectedCountry, isFeatureYextEnabled, brandName } = this.props

    const categoryArrow = <span className="Categories-arrow" />

    const showHideArrow = (
      <span
        role="presentation"
        className={`TopSectionItemLayout-arrow TopSectionItemLayout-arrow--${
          showUserLocatorInput ? 'up' : 'down'
        }Arrow`}
      />
    )

    const rightIcon =
      selectedCountry === storeLocatorConsts.defaultCountry
        ? showHideArrow
        : categoryArrow

    return (
      <Form
        id="store-finder-form"
        className="StoreFinder"
        onSubmit={this.submitHandler}
      >
        <div
          className="rowClick"
          role="presentation"
          onClick={this.handleRowClick}
        >
          <TopSectionItemLayout
            leftIcon={
              <Image
                className="StoreFinder-mapMarker"
                alt="Store locator map marker"
                src={'/assets/{brandName}/images/map-marker.svg'}
              />
            }
            text={'Store Finder'}
            rightIcon={rightIcon}
            expanded={showUserLocatorInput}
          />
        </div>

        {showUserLocatorInput && (
          <div className="StoreFinder-userLocatorInput">
            <UserLocatorInput
              selectedCountry={selectedCountry}
              submitHandler={this.submitHandler}
            />
            {isFeatureYextEnabled &&
              this.doesBrandSupportYext(brandName) && (
                <div className="StoreFinder-findInterStoresLink">
                  <a href="/store-locator">{l`Find International Stores`}</a>
                </div>
              )}
          </div>
        )}
      </Form>
    )
  }
}

export default StoreFinder
