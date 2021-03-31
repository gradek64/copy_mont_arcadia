import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'

import UserLocatorInput from '../UserLocatorInput/UserLocatorInput'
import GoogleMap from '../StoreLocator/GoogleMap'
import StoreList from '../StoreLocator/StoreList'

import { getStoresForCheckoutModal } from '../../../actions/components/StoreLocatorActions'
import {
  selectDeliveryStore,
  setStoreUpdating,
} from '../../../actions/common/checkoutActions'
import { closeModal } from '../../../actions/common/modalActions'

import { getAppliedFilters } from '../../../lib/store-locator-utilities'
import storeLocatorConsts from '../../../constants/storeLocator'
import Form from '../FormComponents/Form/Form'
import { getMapCentrePointAndZoom } from '../../../selectors/storeLocatorSelectors'
import { getUserInputGeoLocation } from '../../../selectors/userLocatorSelectors'

@connect(
  (state) => ({
    stores: state.storeLocator.stores,
    storeQuery: state.storeLocator.query,
    filters: state.storeLocator.filters,
    isStoresLoading: state.storeLocator.loading,
    isMobile: state.viewport.media === 'mobile',
    selectedPlaceDetails: state.userLocator.selectedPlaceDetails,
    mapCentrePointAndZoom: getMapCentrePointAndZoom(state),
    getUserInputGeoLocation: getUserInputGeoLocation(state),
  }),
  {
    getStoresForCheckoutModal,
    selectDeliveryStore,
    setStoreUpdating,
    closeModal,
  }
)
class CollectFromStore extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    stores: PropTypes.array.isRequired,
    isStoresLoading: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    storeQuery: PropTypes.object,
    selectedPlaceDetails: PropTypes.object,
    getStoresForCheckoutModal: PropTypes.func,
    selectDeliveryStore: PropTypes.func,
    setStoreUpdating: PropTypes.func,
    mapCentrePointAndZoom: PropTypes.object,
    getUserInputGeoLocation: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }
  state = {
    dimensions: null,
    noStoresFound: false,
  }

  UNSAFE_componentWillMount() {
    const {
      storeQuery,
      filters,
      getStoresForCheckoutModal,
      selectedPlaceDetails,
      getUserInputGeoLocation,
    } = this.props

    if (
      storeQuery !== undefined &&
      getAppliedFilters(filters).join(',') !== storeQuery.types &&
      (!isEmpty(selectedPlaceDetails) || getUserInputGeoLocation)
    ) {
      getStoresForCheckoutModal()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isMobile, closeModal } = this.props
    if (nextProps.isMobile && isMobile !== nextProps.isMobile) closeModal()
  }

  componentDidUpdate(prevProps) {
    if (this.props.stores !== prevProps.stores) {
      this.setState({ noStoresFound: this.props.stores.length === 0 }) // eslint-disable-line
    }
  }

  componentWillUnmount() {
    const { setStoreUpdating } = this.props
    setStoreUpdating(false)
  }

  onSelectDeliveryStore = (store) => {
    const { selectDeliveryStore, closeModal } = this.props
    selectDeliveryStore(store)

    closeModal()
  }

  searchStores = (e) => {
    const { getStoresForCheckoutModal } = this.props
    if (e) e.preventDefault()

    getStoresForCheckoutModal()
  }

  render() {
    const {
      stores,
      isMobile,
      isStoresLoading,
      mapCentrePointAndZoom: { lat, long, zoom, markers, iconDomain },
    } = this.props
    const { dimensions, noStoresFound } = this.state
    const { l } = this.context
    return (
      <div className="CollectFromStore">
        <h3 className="CollectFromStore-title">{l`Where do you want to collect from?`}</h3>
        <div className="CollectFromStore-row">
          <div className="CollectFromStore-columnLeft">
            <Form
              className="CollectFromStore-search"
              onSubmit={this.searchStores}
            >
              <UserLocatorInput
                selectedCountry={storeLocatorConsts.defaultCountry}
                submitHandler={this.searchStores}
              />
            </Form>
            {noStoresFound && !isStoresLoading ? (
              <p>
                {l`Sorry, we couldn't find any locations matching your search. Please enter another location and try again.`}
              </p>
            ) : null}
            {!!stores.length && !isStoresLoading ? (
              <StoreList
                name="CollectFromStore"
                storeType="collectFromStore"
                hasFilters
                fetchStores={this.searchStores}
                selectDeliveryStore={this.onSelectDeliveryStore}
              />
            ) : null}
          </div>
          <div
            className="CollectFromStore-columnRight"
            ref={(columnRight) => {
              if (columnRight && !dimensions) {
                this.setState({
                  dimensions: {
                    width: columnRight.offsetWidth,
                    height: columnRight.offsetHeight,
                  },
                })
              }
            }}
          >
            {process.browser &&
              !isMobile &&
              !isStoresLoading &&
              !!dimensions && (
                <GoogleMap
                  currentLat={lat}
                  currentLng={long}
                  markers={markers}
                  dimensions={dimensions}
                  iconDomain={iconDomain}
                  zoom={zoom}
                />
              )}
          </div>
        </div>
        {!stores.length || isStoresLoading ? (
          <div className="CollectFromStore-espotContainer" />
        ) : null}
      </div>
    )
  }
}

export default CollectFromStore
