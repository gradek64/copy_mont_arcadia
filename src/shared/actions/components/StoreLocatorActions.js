import { uniq, path } from 'ramda'
import { browserHistory } from 'react-router'
import brandMapMarkers from '../../constants/brandMapMarkers'
import { getItem, setStoreCookie } from '../../../client/lib/cookie'
import { get, post } from '../../lib/api-service'
import { createLabel } from '../../lib/google-maps-label'
import { pollForGoogleService } from '../../lib/google-utils'
import { joinQuery, splitQuery } from '../../lib/query-helper'
import {
  getAppliedFilters,
  getBasketDetails,
  getSkuList,
  shouldFetchBagStock,
} from '../../lib/store-locator-utilities'
import { capitalize } from '../../lib/string-utils'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { openAccordion, closeAccordion } from '../common/accordionActions'
import * as UserLocatorActions from './UserLocatorActions'
import { setDeliveryStore } from '../common/checkoutActions'
import { setSelectedBrandFulfilmentStore } from '../common/selectedBrandFulfilmentStoreActions'
import { setSelectedStore } from '../../../client/lib/storage'
import { getSelectedBrandFulfilmentStore } from '../../reducers/common/selectedBrandFulfilmentStore'
import { getShoppingBag } from '../../selectors/shoppingBagSelectors'
import { getCheckoutOrderSummaryBasket } from '../../selectors/checkoutSelectors'
import {
  isFeatureCFSIEnabled,
  isFeatureStoreLocatorGpsEnabled,
} from '../../selectors/featureSelectors'
import { getCurrentProductId } from '../../selectors/productSelectors'
import { getStoreId, getBrandName } from '../../selectors/configSelectors'
import {
  getActiveItem,
  getStoreByIndex,
  getStoreLocatorFilters,
  getStoreLocatorStores,
  isMapExpanded,
  getMapCentrePointAndZoom,
} from '../../selectors/storeLocatorSelectors'
import {
  getSelectedPlaceId,
  getPreviousSelectedPlaceId,
  getUserInputGeoLocation,
  getGeoLocatorCoordinatesLat,
  getGeoLocatorCoordinatesLong,
} from '../../selectors/userLocatorSelectors'
import { isMobile } from '../../selectors/viewportSelectors'
import {
  sendAnalyticsClickEvent,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../analytics'
import { createStaticMapUrl } from '../../lib/google-static-map'

export function noStoresFound() {
  return {
    type: 'NO_STORES_FOUND',
  }
}

export function resetStoreLocator() {
  return {
    type: 'RESET_STORE_LOCATOR',
  }
}

export function getStoresLoading(loading) {
  return {
    type: 'GET_STORES_LOADING',
    loading,
  }
}

function getStoresError(error) {
  return {
    type: 'GET_STORES_ERROR',
    error,
  }
}

export function receiveStores(stores) {
  return {
    type: 'RECEIVE_STORES',
    stores,
  }
}

export function setDeliveryStoreWithDetails(store) {
  return {
    type: 'SET_DELIVERY_STORE_WITH_DETAILS',
    store,
  }
}

export function setSelectedStoreIndex(index) {
  return {
    type: 'SELECT_STORE',
    index,
  }
}

export function setFulfilmentStore(store) {
  return {
    type: 'SET_FULFILMENT_STORE',
    payload: store,
  }
}

export function setFulfilmentStoreSKU(sku) {
  return {
    type: 'SET_FULFILMENT_STORE_SKU',
    sku,
  }
}

/*
 * Ensures the supplied thunk only runs in the browser.
 *
 * Used in cases where the thunk references the global window object
 * and the mapping data and functions available through it.
 */
function runInBrowser(thunk) {
  return process.browser && typeof thunk === 'function' ? thunk : () => {}
}

export function signStaticMapsUrl(args, cb) {
  return runInBrowser((dispatch) =>
    dispatch(post('/static-map', args))
      .then(({ body: { url, signature } }) => {
        cb({ url, signature })
      })
      // fallback to unsigned url on error
      .catch(() => {
        const url = createStaticMapUrl(args)
        cb({ url, signature: '' })
      })
  )
}

export function setMarkerIcon(index) {
  return runInBrowser((dispatch, getState) => {
    const {
      storeLocator: { stores },
      config: { brandName, logoVersion },
    } = getState()

    const { brandName: storeBrand } = stores[index]
    let url
    if (storeBrand === 'Hermes') {
      url = `/assets/${brandName}/images/parcelshop-marker-icon.svg?version=${logoVersion}`
    } else {
      url = `/assets/${brandName}/images/store-marker-icon.svg?version=${logoVersion}`
    }

    const {
      scale,
      size: { width, height },
      anchor: { x: anchorX, y: anchorY },
    } = brandMapMarkers[brandName]

    window.markers[index].setIcon({
      url,
      size: new window.google.maps.Size(width, height),
      scaledSize: new window.google.maps.Size(width * scale, height * scale),
      anchor: new window.google.maps.Point(anchorX * scale, anchorY * scale),
    })
  })
}

function setZoom(zoomLevel) {
  return runInBrowser(() => {
    if (window.map) {
      window.map.setZoom(zoomLevel)
    }
  })
}

function removeMarkers() {
  // eslint-disable-next-line prefer-arrow-callback
  return runInBrowser(function removeMarkersThunk() {
    if (window.markers) {
      window.markers.forEach((marker) => marker.setMap(null))
    }
  })
}

function removeLabels() {
  // eslint-disable-next-line prefer-arrow-callback
  return runInBrowser(function removeLabelsThunk() {
    if (window.labels) {
      window.labels.forEach((label) => label.setMap(null))
    }
  })
}

function resetMarkers() {
  return runInBrowser((dispatch) => {
    if (window.markers) {
      window.markers.forEach((marker, index) => {
        dispatch(setMarkerIcon(index))
        marker.setZIndex(0)
      })
    }
  })
}

function selectMarker(index) {
  return runInBrowser((dispatch, getState) => {
    if (window.map) {
      dispatch(resetMarkers(getBrandName(getState())))
      dispatch(setMarkerIcon(index))
      window.markers[index].setZIndex(1)
      window.markers[index].setMap(window.map)
      const focusMarker = () => {
        window.map.panTo(window.markers[index].getPosition())
        dispatch(setZoom(15))
      }
      // if map is expanded, wait till it collapses and triggers resize to center
      if (isMapExpanded(getState())) {
        window.google.maps.event.addListenerOnce(window.map, 'resize', () => {
          focusMarker()
        })
      } else {
        focusMarker()
      }
    }
  })
}

export function updateCurrentLatLng(coordinates) {
  // eslint-disable-next-line prefer-arrow-callback
  return runInBrowser(function updateCurrentLatLngThunk(dispatch) {
    dispatch({ type: 'UPDATE_CURRENT_LAT_LNG', coordinates })
    if (window.map) {
      window.map.setCenter({
        lat: coordinates.currentLat,
        lng: coordinates.currentLng,
      })
    }
  })
}

function closeOpenAccordion() {
  return (dispatch, getState) => {
    const { storeLocator } = getState()
    const selectedStore = storeLocator.stores[storeLocator.selectedStoreIndex]
    if (selectedStore) {
      dispatch(closeAccordion(`store-${selectedStore.storeId}`))
    }
  }
}

export function setMapExpanded(expanded) {
  return (dispatch, getState) => {
    const { mapExpanded } = getState().storeLocator
    if (mapExpanded !== expanded) {
      dispatch({
        type: 'SET_MAP_EXPANDED',
        expanded,
      })
    }
  }
}

export function expandMap() {
  return (dispatch) => dispatch(setMapExpanded(true))
}

export function collapseMap() {
  return (dispatch) => dispatch(setMapExpanded(false))
}

export function selectStore(index) {
  return (dispatch, getState) => {
    const { storeId } = getStoreByIndex(getState(), index)
    dispatch(selectMarker(index))
    dispatch(closeOpenAccordion())
    dispatch(setSelectedStoreIndex(index))
    dispatch(collapseMap())
    dispatch(openAccordion(`store-${storeId}`))
    dispatch(
      sendAnalyticsClickEvent({
        category: GTM_CATEGORY.PDP,
        action: GTM_ACTION.IN_STORE_POSTCODE_RESULT,
        label: getCurrentProductId(getState()),
      })
    )
  }
}

function fitBoundsToMarkers() {
  return runInBrowser((dispatch, getState) => {
    if (window.map && window.markers) {
      const { currentLat, currentLng, stores } = getState().storeLocator
      const nearestStores = stores.slice(0, 3)
      const bounds = new window.google.maps.LatLngBounds()
      const currentPosition = new window.google.maps.LatLng(
        currentLat,
        currentLng
      )
      bounds.extend(currentPosition)
      nearestStores.forEach((store, index) =>
        bounds.extend(window.markers[index].getPosition())
      )
      window.map.fitBounds(bounds)
    }
  })
}

export function deselectStore() {
  return (dispatch, getState) => {
    const brandName = getState().config.brandName
    dispatch(closeOpenAccordion())
    dispatch(setSelectedStoreIndex())
    resetMarkers(brandName)
  }
}

export function setMarkers(fitToMarkers = true) {
  return runInBrowser((dispatch, getState) => {
    const stores = getStoreLocatorStores(getState())
    const siteId = getStoreId(getState())
    const brandName = getBrandName(getState())

    // If no stores returned then no markers are required to be set.
    if (!window.map || stores.length < 1) return

    if (window.markers) {
      window.markers.forEach((marker) => marker.setMap(null))
    }
    window.markers = []
    window.labels = []
    stores.forEach((store, index) => {
      const lat = parseFloat(store.latitude)
      const lng = parseFloat(store.longitude)
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: window.map,
        title: store.name,
      })
      marker.addListener('click', () => dispatch(selectStore(index)))
      window.markers.push(marker)
      const storeName =
        store.brandId === siteId
          ? `${capitalize(brandName)} ${store.name}`
          : store.name
      window.labels.push(
        createLabel({
          map: window.map,
          position: marker.getPosition(),
          text: storeName,
        })
      )
      dispatch(setMarkerIcon(index))
    })
    if (fitToMarkers) dispatch(fitBoundsToMarkers())
  })
}

export function applyFilters(filters) {
  return {
    type: 'APPLY_FILTERS',
    filters,
  }
}

export function applyCheckoutFilters(filters) {
  return {
    type: 'APPLY_CHECKOUT_FILTERS',
    filters,
  }
}

function applyQueryFilters() {
  return (dispatch, getState) => {
    const query = getState().routing.location.query

    if (query && query.types) {
      const queryFilters = query.types.split(',')
      dispatch(applyFilters(queryFilters))
    }
  }
}

export function setStoreLocatorQuery(query) {
  return {
    type: 'SET_STORE_LOCATOR_QUERY',
    query,
  }
}

export function buildQueryAndSearchStores(
  storeLocatorType,
  activeItem,
  latitude,
  longitude
) {
  return (dispatch, getState) => {
    const filters = getStoreLocatorFilters(getState())
    const appliedFilters = getAppliedFilters(filters)
    const cfsi = isFeatureCFSIEnabled(getState())
    const { sku } = activeItem || getActiveItem(getState())
    const baseQuery = {
      latitude,
      longitude,
      brandPrimaryEStoreId: getStoreId(getState()),
    }

    let query = {
      ...baseQuery,
      cfsi,
    }

    switch (storeLocatorType) {
      case 'collectFromStore':
        query = {
          ...query,
          deliverToStore: true,
          types: appliedFilters.join(','),
        }
        break
      case 'findInStore':
        query = {
          ...query,
          types: 'brand',
          sku,
        }
        break
      default:
        query = {
          ...query,
          deliverToStore: true,
          types: 'brand',
          sku,
        }
    }

    const url = `/store-locator${joinQuery(query)}`
    dispatch(getStoresLoading(true))
    dispatch(
      sendAnalyticsClickEvent({
        category: GTM_CATEGORY.PDP,
        action: GTM_ACTION.IN_STORE_POSTCODE_GO,
        label: getCurrentProductId(getState()),
      })
    )
    return dispatch(get(url)).then(
      ({ body: stores }) => {
        dispatch(resetStoreLocator())
        dispatch(
          updateCurrentLatLng({
            currentLat: latitude,
            currentLng: longitude,
          })
        )
        dispatch(receiveStores(stores))
        dispatch(getStoresLoading(false))
        dispatch(setStoreLocatorQuery(query))
        if (stores.length) {
          dispatch(setMarkers())
        } else {
          dispatch(noStoresFound())
        }
      },
      (error) => {
        dispatch(getStoresError(error))
        dispatch(getStoresLoading(false))
      }
    )
  }
}

export function getStoreForModal(storeLocatorType, activeItem) {
  return (dispatch, getState) => {
    const state = getState()

    if (
      isFeatureStoreLocatorGpsEnabled(state) &&
      getUserInputGeoLocation(state)
    ) {
      const latitude = getGeoLocatorCoordinatesLat(state)
      const longitude = getGeoLocatorCoordinatesLong(state)
      dispatch(
        buildQueryAndSearchStores(
          storeLocatorType,
          activeItem,
          latitude,
          longitude
        )
      )
    } else {
      dispatch(
        UserLocatorActions.getPlaceCoordinates(
          getSelectedPlaceId(state),
          ({ latitude, longitude }) => {
            dispatch(
              buildQueryAndSearchStores(
                storeLocatorType,
                activeItem,
                latitude,
                longitude
              )
            )
          }
        )
      )
    }
  }
}

export function buildQueryForCheckoutModal(latitude, longitude) {
  return (dispatch, getState) => {
    const cfsi = isFeatureCFSIEnabled(getState())
    const filters = getStoreLocatorFilters(getState())
    const basket = getCheckoutOrderSummaryBasket(getState())
    const basketDetails = cfsi ? getBasketDetails(basket) : ''
    const query = {
      latitude,
      longitude,
      brandPrimaryEStoreId: getStoreId(getState()),
      deliverToStore: true,
      types: getAppliedFilters(filters).join(','),
      cfsi,
      basketDetails,
    }
    const url = `/store-locator${joinQuery(query)}`

    dispatch(
      updateCurrentLatLng({
        currentLat: latitude,
        currentLng: longitude,
      })
    )
    dispatch(getStoresLoading(true))
    // @TODO difficult to test what is inside, the following can be an action on its own
    dispatch(get(url)).then(
      ({ body: stores }) => {
        dispatch(resetStoreLocator())
        dispatch(
          updateCurrentLatLng({
            currentLat: latitude,
            currentLng: longitude,
          })
        )
        dispatch(receiveStores(stores))
        dispatch(getStoresLoading(false))
        dispatch(setStoreLocatorQuery(query))
        if (stores.length) {
          dispatch(setMarkers())
        } else {
          dispatch(noStoresFound())
        }
      },
      (error) => {
        dispatch(getStoresError(error))
        dispatch(getStoresLoading(false))
      }
    )
  }
}

export function getStoresForCheckoutModal() {
  return (dispatch, getState) => {
    const state = getState()

    if (
      isFeatureStoreLocatorGpsEnabled(state) &&
      getUserInputGeoLocation(state)
    ) {
      const latitude = getGeoLocatorCoordinatesLat(state)
      const longitude = getGeoLocatorCoordinatesLong(state)
      dispatch(buildQueryForCheckoutModal(latitude, longitude))
    } else {
      const placeId =
        getSelectedPlaceId(state) || getPreviousSelectedPlaceId(state)
      dispatch(
        UserLocatorActions.getPlaceCoordinates(
          placeId,
          ({ latitude, longitude }) =>
            dispatch(buildQueryForCheckoutModal(latitude, longitude))
        )
      )
    }
  }
}

export function getStores({ search }) {
  return (dispatch, getState) => {
    if (!search) return
    const cfsi = isFeatureCFSIEnabled(getState())
    const brand = path(['config', 'siteId'], getState())
    const url = `/store-locator${search}${
      brand ? `&brand=${brand}` : ''
    }&cfsi=${cfsi}`
    dispatch(applyQueryFilters())
    return dispatch(get(url))
  }
}

export function getRecentStores({ search }) {
  return (dispatch) => {
    if (!search) return
    return dispatch(getStores({ search })).then(
      ({ body: stores }) => {
        dispatch(UserLocatorActions.completeRecentStores(stores))
      },
      (error) => {
        dispatch(getStoresError(error))
      }
    )
  }
}

export function getFulfilmentStore({ search }, isFFS = false, sku) {
  return (dispatch) => {
    if (!search) return
    return dispatch(getStores({ search })).then(
      ({ body: stores }) => {
        if (Array.isArray(stores) && stores.length === 1) {
          if (isFFS && sku) dispatch(setFulfilmentStoreSKU(sku))
          dispatch(setFulfilmentStore(stores[0]))
        }
      },
      (error) => {
        dispatch(getStoresError(error))
      }
    )
  }
}

export function getDeliveryStoreDetails(storeId) {
  return (dispatch, getState) => {
    const bag = getShoppingBag(getState())
    const deliveryStoreDetails = getSelectedBrandFulfilmentStore(getState())
    const selectedStoreId = storeId || getItem('WC_pickUpStore')
    const shouldFetchStore = shouldFetchBagStock(
      bag,
      deliveryStoreDetails,
      selectedStoreId
    )
    const cfsi = isFeatureCFSIEnabled(getState())
    if (!shouldFetchStore || !cfsi) return
    return dispatch(
      getStores({
        search: `?storeIds=${selectedStoreId}&skuList=${getSkuList(bag)}`,
      })
    ).then(
      ({ body: stores }) => {
        if (Array.isArray(stores) && stores.length === 1) {
          dispatch(setSelectedBrandFulfilmentStore(stores[0]))
        }
      },
      (error) => {
        dispatch(getStoresError(error))
      }
    )
  }
}

const isValidStoreFinderQueryParams = (search) => {
  const params = splitQuery(search)
  if (params.country) {
    return true
  } else if (
    (params.latitude || params.lat) &&
    (params.longitude || params.long)
  ) {
    return true
  }
  return false
}

export function storeSearch({ search }) {
  return (dispatch, getState) => {
    if (!isValidStoreFinderQueryParams(search)) return

    const stores = getState().storeLocator.stores
    // we prevent the server side render if we already have a stores.
    if (!process.browser && stores && stores.length) return

    dispatch(getStoresLoading(true))
    return dispatch(getStores({ search })).then(
      ({ body: stores }) => {
        dispatch(receiveStores(stores))
        dispatch(getStoresLoading(false))
        const queryParams = search.split('&')
        const latitudeParam = queryParams.find((param) =>
          param.includes('latitude')
        )
        const longitudeParam = queryParams.find((param) =>
          param.includes('longitude')
        )
        if (latitudeParam && longitudeParam) {
          dispatch(
            updateCurrentLatLng({
              currentLat: parseFloat(latitudeParam.split('=')[1]),
              currentLng: parseFloat(longitudeParam.split('=')[1]),
            })
          )
        }
        if (stores.length) {
          dispatch(setMarkers())
        } else {
          dispatch(noStoresFound())
        }
      },
      (error) => {
        dispatch(getStoresError(error))
        dispatch(getStoresLoading(false))
      }
    )
  }
}

// Google refuses to add a method of
// disposal to the maps API. The best solution
// is to reuse a single instance
function createMapInstanceIfRequired(dispatch, getState) {
  if (window.map) {
    return true
  }
  const isMob = isMobile(getState())
  const { lat, long, zoom } = getMapCentrePointAndZoom(getState())
  window.map = new window.google.maps.Map(
    document.getElementsByClassName('GoogleMap-map')[0],
    {
      disableDefaultUI: true,
      streetViewControl: true,
      zoomControl: !isMob,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      zoom,
      center: { lat, lng: long },
    }
  )

  window.google.maps.event.addListener(window.map, 'mousedown', () =>
    dispatch(expandMap())
  )

  return false
}

function insertIntoDom() {
  const insertionPoint = document.getElementsByClassName('GoogleMap-map')[0]
  const container = window.map.getDiv()
  const parent = insertionPoint.parentElement

  parent.replaceChild(container, insertionPoint)
}

export function initMap() {
  return runInBrowser((dispatch, getState) => {
    const requiresInsertion = createMapInstanceIfRequired(dispatch, getState)
    if (requiresInsertion) {
      insertIntoDom()
    }

    const { selectedStoreIndex } = getState().storeLocator
    const fitToMarkers = selectedStoreIndex === undefined
    dispatch(setMarkers(fitToMarkers))
    if (typeof selectedStoreIndex === 'number') {
      dispatch(selectMarker(selectedStoreIndex))
      dispatch(setSelectedStoreIndex(selectedStoreIndex))
      dispatch(
        sendAnalyticsClickEvent({
          category: GTM_CATEGORY.PDP,
          action: GTM_ACTION.IN_STORE_POSTCODE_RESULT,
          label: getCurrentProductId(getState()),
        })
      )
    }
    return window.map
  })
}

// only for the GoogleMapError
export function loadGoogleMapScript() {
  return runInBrowser((dispatch, getState) => {
    const { region, lang } = getState().config

    return new Promise((resolve, reject) => {
      if (window.google) {
        return resolve()
      }

      const googleMapsKey = window.GOOGLE_API_KEY
      window.loadScript({
        id: 'googleMapsScript',
        defer: true,
        isAsync: true,
        src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&language=${lang}&region=${region}`,
        onload: () => {
          resolve()
        },
        onerror: () => {
          reject('Unfortunately, we were unable to load the map.')
        },
      })
    })
  })
}

// only for Googlemap component
export function initMapWhenGoogleMapsAvailable() {
  return runInBrowser((dispatch) =>
    dispatch(loadGoogleMapScript()).then(() => dispatch(initMap()))
  )
}

export function setFilters(filters) {
  return {
    type: 'SET_FILTERS',
    filters,
  }
}

export function setFilterSelected(filter, selected) {
  return {
    type: 'SET_FILTER_SELECTED',
    filter,
    selected,
  }
}

export function applySelectedFilters() {
  return (dispatch, getState) => {
    dispatch(deselectStore())
    dispatch({ type: 'APPLY_SELECTED_FILTERS' })
    const { filters } = getState().storeLocator
    const { location } = getState().routing
    const appliedFilters = getAppliedFilters(filters)

    browserHistory.push({
      ...location,
      query: {
        ...(location.query || {}),
        types: appliedFilters.join(','),
      },
    })
  }
}

export function resizeMap() {
  return runInBrowser(() => {
    window.google.maps.event.trigger(window.map, 'resize')
  })
}

function setFilterErrorDisplay(display) {
  return {
    type: 'SET_FILTERS_ERROR_DISPLAY',
    display,
  }
}

export function hideFiltersError() {
  return (dispatch) => dispatch(setFilterErrorDisplay(false))
}

export function showFiltersError() {
  return (dispatch) => dispatch(setFilterErrorDisplay(true))
}

export function clearFilters() {
  return {
    type: 'CLEAR_FILTERS',
  }
}

function selectStoreByStore(store) {
  return function selectStoreByStoreThunk(dispatch) {
    dispatch(setDeliveryStoreWithDetails(store))
    dispatch(setMarkers())
    dispatch(setZoom(15))
    dispatch(selectStore(0))
  }
}

export function findStore(address) {
  const buildStoreAddress = (address) => {
    const stringify = (address) =>
      [
        address.address2,
        address.address3,
        address.address4,
        address.country,
      ].join(' ')

    return address ? { address: stringify(address) } : null
  }

  const lookupAddress = (dispatch, getState, storeAddress) => {
    return new Promise((res, rej) => {
      const geocoder = new window.google.maps.Geocoder()
      dispatch(removeMarkers())
      dispatch(removeLabels())
      dispatch(ajaxCounter('increment'))
      geocoder.geocode(storeAddress, (results, status) => {
        dispatch(ajaxCounter('decrement'))

        if (status !== window.google.maps.GeocoderStatus.OK) {
          return dispatch(noStoresFound())
        }

        if (results.length === 0) {
          return dispatch(noStoresFound())
        }

        const state = getState()
        const { lat, lng } = results[0].geometry.location
        const query = {
          brandPrimaryEStoreId: getStoreId(state),
          latitude: lat(),
          longitude: lng(),
          deliverToStore: true,
          types: 'brand',
          cfsi: isFeatureCFSIEnabled(state),
        }
        const url = `/store-locator${joinQuery(query)}`
        dispatch(getStoresLoading(true))
        dispatch(ajaxCounter('increment'))

        dispatch(get(url)).then(
          ({ body: stores }) => {
            dispatch(ajaxCounter('decrement'))
            const store = stores.find(
              (store) =>
                store.address.postcode === address.address4 ||
                store.address.postcode === address.address5
            )
            if (store) {
              dispatch(selectStoreByStore(store))
              dispatch(receiveStores(stores))
            } else {
              dispatch(noStoresFound())
            }
            dispatch(getStoresLoading(false))
            res()
          },
          (error) => {
            dispatch(ajaxCounter('decrement'))
            dispatch(getStoresError(error))
            dispatch(getStoresLoading(false))
            dispatch(noStoresFound())
            rej(error)
          }
        )
      })
    })
  }

  return runInBrowser((dispatch, getState) => {
    const storeAddress = buildStoreAddress(address)

    return storeAddress === null
      ? dispatch(noStoresFound())
      : pollForGoogleService(['Geocoder'])
          .then(() => lookupAddress(dispatch, getState, storeAddress))
          .catch((err) => {
            if (window.NREUM && window.NREUM.noticeError)
              window.NREUM.noticeError(err)
          })
  })
}

export function setCountries(countries) {
  return {
    type: 'SET_COUNTRIES',
    countries,
  }
}

export function getCountries() {
  return (dispatch, getState) => {
    const brand = getStoreId(getState())
    const cfsi = isFeatureCFSIEnabled(getState())
    return dispatch(
      get(`/stores-countries?brandPrimaryEStoreId=${brand}&cfsi=${cfsi}`)
    )
      .then(({ body }) => body)
      .then((countries) => dispatch(setCountries(uniq(countries))))
      .catch(() => {
        // We don't have to do anything more in the case of an error here.
        // the application remains responsive. Store locator will have to handle
        // the missing data.
      })
  }
}

export function selectCountry(name) {
  return {
    type: 'SELECT_COUNTRY',
    name,
  }
}

export function setSelectedStoreID(selectedStoreId) {
  return {
    type: 'SET_SELECTED_STORE_ID',
    selectedStoreId,
  }
}

export function getSelectedStoreIdFromCookie() {
  return (dispatch) => {
    const selectedStoreId = getItem('WC_pickUpStore')
    dispatch(setSelectedStoreID(selectedStoreId))
  }
}

export function changeFulfilmentStore(store) {
  setStoreCookie(store)
  setSelectedStore(store)
  return (dispatch) => {
    dispatch(setFulfilmentStore(store))
    dispatch(setSelectedStoreID(store.storeId))
    dispatch(setDeliveryStore(store))
  }
}
