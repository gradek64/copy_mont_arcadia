import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, filter, isEmpty, pathOr } from 'ramda'
import animate from 'amator'
import Helmet from 'react-helmet'
import debounce from 'lodash.debounce'

import { closeModal, showModal } from '../../../actions/common/modalActions'
import { selectDeliveryStore } from '../../../actions/common/checkoutActions'
import {
  clearFilters,
  collapseMap,
  getStores,
  selectStore,
  deselectStore,
  resetStoreLocator,
  resizeMap,
  setMarkers,
  storeSearch,
} from '../../../actions/components/StoreLocatorActions'
import { searchStores } from '../../../actions/components/UserLocatorActions'
import FeatureCheck from '../../common/FeatureCheck/FeatureCheck'
import Loader from '../../common/Loader/Loader'
import UserLocator from '../../common/UserLocator/UserLocator'
import InternationalUserLocator from '../../common/UserLocator/InternationalUserLocator'
import UserLocatorInput from '../../common/UserLocatorInput/UserLocatorInput'

import GoogleMap from './GoogleMap'
import getFilterLabel from './get-filter-label'
import Store from './Store'
import StoreLocatorFilters from './StoreLocatorFilters'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../../shared/analytics'
import {
  isFeatureCFSIEnabled,
  isFeatureYextEnabled,
} from '../../../selectors/featureSelectors'

import Form from '../FormComponents/Form/Form'
import { getMapCentrePointAndZoom } from '../../../selectors/storeLocatorSelectors'

@analyticsDecorator(GTM_CATEGORY.STORE_LOCATOR, { isAsync: true })
@connect(
  (state) => ({
    brandName: state.config.brandName,
    filters: state.storeLocator.filters,
    isStoresLoading: state.storeLocator.loading,
    isHeaderEnabled:
      state.features.status.FEATURE_STORE_FINDER_HEADER_WITH_COUNTRY_SELECTOR,
    mapExpanded: state.storeLocator.mapExpanded,
    modalOpen: state.modal.open,
    stores: state.storeLocator.stores,
    isMobile: state.viewport.media === 'mobile',
    CFSI: isFeatureCFSIEnabled(state),
    mapCentrePointAndZoom: getMapCentrePointAndZoom(state),
    isFeatureYextEnabled: isFeatureYextEnabled(state),
  }),
  {
    collapseMap,
    getStores,
    selectStore,
    deselectStore,
    resizeMap,
    clearFilters,
    resetStoreLocator,
    setMarkers,
    closeModal,
    showModal,
    selectDeliveryStore,
    storeSearch,
    searchStores,
  }
)
class StoreLocator extends Component {
  static propTypes = {
    clearFilters: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    collapseMap: PropTypes.func.isRequired,
    deselectStore: PropTypes.func.isRequired,
    resetStoreLocator: PropTypes.func.isRequired,
    resizeMap: PropTypes.func.isRequired,
    searchStores: PropTypes.func.isRequired,
    selectDeliveryStore: PropTypes.func.isRequired,
    selectStore: PropTypes.func.isRequired,
    setMarkers: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,

    brandName: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    isStoresLoading: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mapExpanded: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    stores: PropTypes.array.isRequired,

    storeLocatorType: PropTypes.string,
    modalOpen: PropTypes.bool,
    isHeaderEnabled: PropTypes.bool,
    storeSearch: PropTypes.func,

    mapCentrePointAndZoom: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      dimensions: null,
    }
  }

  static needs = [storeSearch]

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  resizeHandler = debounce(() => {
    if (this.StoreLocatorGoogleMap) {
      // timeout needed so that Main's resize re-render has time to kick in
      // before this resize handler is run
      const { offsetWidth, offsetHeight } = this.StoreLocatorGoogleMap
      setTimeout(() => {
        this.setState({
          dimensions: {
            width: offsetWidth,
            height: offsetHeight,
          },
        })
      })
    }
  })

  UNSAFE_componentWillMount() {
    const { stores, storeSearch, location, setMarkers } = this.props
    if (process.browser) {
      storeSearch(location)
      if (!isEmpty(stores)) {
        setMarkers()
      }
      if (this.hideMap()) window.map = null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { query: nextQuery } = nextProps.location
    const { clearFilters, modalOpen } = this.props
    if (this.shouldPerformSearch(nextQuery)) {
      this.props.storeSearch(nextProps.location)
    }
    if (this.hideMap()) {
      window.map = null
    }
    if (!nextProps.modalOpen && modalOpen) {
      clearFilters()
    }
  }

  componentDidUpdate(prevProps) {
    const { mapExpanded, resizeMap, selectedStoreIndex } = this.props
    if (this.hideMap()) window.map = null
    if (prevProps.mapExpanded !== mapExpanded) {
      // wait untill DOM transition has been completed
      setTimeout(resizeMap, 300)
    }
    if (
      prevProps.selectedStoreIndex !== selectedStoreIndex &&
      selectedStoreIndex !== undefined
    ) {
      setTimeout(this.scrollToSelectedStore, 300)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
    this.props.resetStoreLocator()
  }

  onUserLocatorInputSubmit = (event) => {
    const { searchStores } = this.props
    event.preventDefault()
    searchStores()
  }

  getFiltersInfo = () => {
    const { filters, brandName, CFSI } = this.props
    const appliedFilters = filter(({ applied }) => applied, filters)

    return Object.keys(appliedFilters).length === Object.keys(filters).length
      ? 'Showing all store types'
      : `Showing ${Object.keys(appliedFilters)
          .map((filter) => getFilterLabel(filter, brandName, CFSI))
          .join(', ')}`
  }

  scrollToSelectedStore = () => {
    const offsetTop =
      this.selectedStore.getClientRects()[0].top -
      this.resultsContainer.getClientRects()[0].top
    const scrollTop = this.resultsContainer.scrollTop + offsetTop
    animate(
      this.resultsContainer,
      {
        scrollTop,
      },
      {
        duration: 100,
      }
    )
  }

  showFilters = (event) => {
    const { showModal, closeModal } = this.props
    event.stopPropagation()
    showModal(<StoreLocatorFilters onApply={closeModal} />, { mode: 'rollBig' })
  }

  shouldPerformSearch(nextQuery) {
    const latitude = pathOr('', ['latitude'], nextQuery)
    const longitude = pathOr('', ['longitude'], nextQuery)
    const country = pathOr('', ['country'], nextQuery)
    return (!isEmpty(latitude) && !isEmpty(longitude)) || !isEmpty(country)
      ? !equals(this.props.location.query, nextQuery)
      : false
  }

  hideMap = () => {
    const {
      location: {
        query: { latitude, longitude },
      },
    } = this.props
    return (!latitude && latitude !== 0) || (!longitude && longitude !== 0)
  }

  renderShowFiltersButton() {
    return (
      this.props.storeLocatorType === 'collectFromStore' && (
        <FeatureCheck flag="FEATURE_PUDO">
          <button
            className="StoreLocator-showFiltersButton"
            onClick={this.showFilters}
          >
            {this.context.l`Filter`}
          </button>
        </FeatureCheck>
      )
    )
  }

  renderFooterMapExpanded() {
    const { collapseMap } = this.props
    const { l } = this.context
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className="StoreLocator-footer"
        onClick={collapseMap}
      >
        {this.renderShowFiltersButton()}
        <div className="StoreLocator-footerText">{l`Show list`}</div>
      </div>
    )
  }

  renderFooterMapCollapsed() {
    return (
      <FeatureCheck flag="FEATURE_PUDO">
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className="StoreLocator-footer"
          onClick={this.showFilters}
        >
          {this.renderShowFiltersButton()}
          <div className="StoreLocator-footerText">{this.getFiltersInfo()}</div>
        </div>
      </FeatureCheck>
    )
  }

  renderFooter = () => {
    const { isMobile, mapExpanded } = this.props
    if (!isMobile) return null
    return mapExpanded
      ? this.renderFooterMapExpanded()
      : this.renderFooterMapCollapsed()
  }

  renderGoogleMap = () => {
    const {
      mapExpanded,
      isHeaderEnabled,
      isMobile,
      mapCentrePointAndZoom: { lat, long, zoom, markers, iconDomain },
    } = this.props
    const { dimensions } = this.state
    return (
      !this.hideMap() && (
        <div
          className={`StoreLocator-googleMapContainer${
            mapExpanded ? ' StoreLocator-googleMapContainer--expanded' : ''
          }${
            !this.isCfs && isHeaderEnabled
              ? ' StoreLocator-googleMapContainer--withEnabledHeader'
              : ''
          }`}
          key="StoreLocator-GoogleMap"
          ref={(StoreLocatorGoogleMap) => {
            this.StoreLocatorGoogleMap = StoreLocatorGoogleMap
            if (StoreLocatorGoogleMap && !dimensions) {
              const { offsetWidth, offsetHeight } = StoreLocatorGoogleMap
              this.setState({
                dimensions: {
                  width: offsetWidth,
                  height: offsetHeight,
                },
              })
            }
          }}
        >
          {isMobile &&
            !(isHeaderEnabled || this.isCfs) && (
              <Form
                onSubmit={this.onUserLocatorInputSubmit}
                className="StoreLocator-userLocatorInputContainer"
              >
                <UserLocatorInput selectedCountry="United Kingdom" />
              </Form>
            )}
          {process.browser &&
            !!dimensions && (
              <GoogleMap
                className="StoreLocator-googleMap"
                borderless
                currentLat={lat}
                currentLng={long}
                markers={markers}
                dimensions={dimensions}
                iconDomain={iconDomain}
                zoom={zoom}
              />
            )}
        </div>
      )
    )
  }

  renderStorePredictions = () => {
    const {
      selectedStoreIndex,
      selectStore,
      location,
      stores,
      deselectStore,
      storeLocatorType,
      selectDeliveryStore,
    } = this.props

    if (isEmpty(stores)) return null

    const { latitude, longitude } = location.query
    const searchCoordinates = { latitude, longitude }
    const googleMap = this.renderGoogleMap()
    const fullHeightModifier = !googleMap
      ? ' StoreLocator-resultsContainer--fullHeight'
      : ''
    const storeLocType = storeLocatorType || 'storeSearch'

    return (
      <div
        key="storeList"
        ref={(element) => {
          this.resultsContainer = element
        }}
        className={`StoreLocator-resultsContainer${fullHeightModifier}`}
      >
        {stores.map((store, index) => {
          const selected = selectedStoreIndex === index
          return (
            <Store
              parentElementRef={(store) => {
                if (selected) {
                  this.selectedStore = store
                }
              }}
              storeLocatorType={storeLocType}
              key={store.storeId}
              storeDetails={store}
              onHeaderClick={
                selected ? deselectStore : () => selectStore(index)
              }
              onSelectClick={() => selectDeliveryStore(store)}
              selected={selected}
              directionsFrom={searchCoordinates}
            />
          )
        })}
      </div>
    )
  }

  renderMap = () => {
    const {
      stores,
      isStoresLoading,
      isHeaderEnabled,
      isMobile,
      isFeatureYextEnabled,
      location,
    } = this.props
    if (isEmpty(stores)) return null
    const hideMap =
      location.pathname === '/store-locator' && isFeatureYextEnabled
    return (
      <div
        className={`StoreLocator-fullHeightContainer ${
          isHeaderEnabled && !this.isCfs && !this.hideMap()
            ? 'StoreLocator-fullHeightContainer--withEnabledHeader'
            : ''
        }`}
        style={{ opacity: isStoresLoading || isEmpty(stores) ? 0 : 1 }}
      >
        {!hideMap && this.renderGoogleMap()}
        {isMobile && this.renderStorePredictions()}
      </div>
    )
  }

  getUserLocatorComponent = (locator) => {
    return (
      <UserLocator
        locator={locator}
        storeLocatorLandingPage
        storeLocatorType={this.props.storeLocatorType}
      />
    )
  }

  getInterUserLocatorComponent = (locator) => {
    return (
      <InternationalUserLocator locator={locator} storeLocatorLandingPage />
    )
  }

  storeLocatorContainerClass = () => {
    return this.props.isFeatureYextEnabled && !this.isCfs
      ? 'StoreLocator-interUserLocatorContainer'
      : 'StoreLocator-userLocatorContainer'
  }

  renderUserLocator = () => {
    const { isMobile } = this.props
    return (
      <div className={this.storeLocatorContainerClass()}>
        {this.props.isFeatureYextEnabled
          ? this.getInterUserLocatorComponent('TopNavMenu')
          : this.getUserLocatorComponent('TopNavMenu')}
        {!isMobile && this.renderStorePredictions()}
      </div>
    )
  }

  renderNoResultsFound = () => {
    const { isFeatureYextEnabled } = this.props
    const { l } = this.context
    return (
      <div className={this.storeLocatorContainerClass()}>
        <div className="StoreLocator-noSearchResults">
          <p>
            {l`Sorry, we couldn't find any locations matching your search. Please enter another location or modify your filters.`}
          </p>
          {isFeatureYextEnabled && !this.isCfs
            ? this.getInterUserLocatorComponent('StoreLocator-noResults')
            : this.getUserLocatorComponent('StoreLocator-noResults')}
        </div>
      </div>
    )
  }

  get isCfs() {
    return this.props.storeLocatorType === 'collectFromStore'
  }

  get isLandingPage() {
    const { isMobile, isHeaderEnabled, stores } = this.props
    return !this.isCfs && (isEmpty(stores) || !isMobile || isHeaderEnabled)
  }

  shouldShowStoreLocator() {
    const { isMobile, stores, isHeaderEnabled } = this.props
    return (
      !this.isCfs &&
      ((isEmpty(stores) && !this.isValidSearch) ||
        (!isEmpty(stores) && (!isMobile || isHeaderEnabled)))
    )
  }

  get isValidSearch() {
    const {
      location: {
        query: { latitude, longitude, country },
      },
    } = this.props
    return (latitude && longitude) || (country && country !== '')
  }

  yextCssStoreLocatorClassName = () => {
    if (this.isLandingPage && this.props.isFeatureYextEnabled) {
      return ` is-landing StoreLocator-isYext`
    } else if (this.isLandingPage && !this.props.isFeatureYextEnabled) {
      return ` is-landing`
    }
    return ''
  }

  renderStoreLocator = () => {
    const { l } = this.context
    const { mapExpanded, storeLocatorType, stores } = this.props
    return (
      <div
        className={`StoreLocator${this.yextCssStoreLocatorClassName()}${
          storeLocatorType ? ` StoreLocator--${storeLocatorType}` : ''
        }`}
      >
        <Helmet title={l`Store Locator`} />
        {(!this.isValidSearch || this.shouldShowStoreLocator()) &&
          this.renderUserLocator()}
        {this.isValidSearch && isEmpty(stores) && this.renderNoResultsFound()}
        {!isEmpty(stores) && this.renderMap()}
        {(this.isCfs || mapExpanded) && this.renderFooter()}
      </div>
    )
  }

  render() {
    const { isStoresLoading } = this.props
    return isStoresLoading ? <Loader /> : this.renderStoreLocator()
  }
}

export default StoreLocator
