import { browserHistory } from 'react-router'
import { path, isEmpty } from 'ramda'
import { closeTopNavMenu } from '../../actions/components/TopNavMenuActions'
import { setFormField } from '../../actions/common/formActions'
import { setGenericError } from '../common/errorMessageActions'
import { localise } from '../../lib/localisation'
import { pollForGoogleService } from '../../lib/google-utils'
import { woosmapFetch } from '../../lib/woosmap-utils'
import {
  setStoreLocatorQuery,
  setSelectedStoreIndex,
  loadGoogleMapScript,
} from './StoreLocatorActions'
import {
  getAppliedFilters,
  getBasketDetails,
} from '../../lib/store-locator-utilities'
import { getStoreId } from '../../selectors/configSelectors'
import {
  isFeatureCFSIEnabled,
  isFeatureStoreLocatorGpsEnabled,
} from '../../selectors/featureSelectors'
import {
  getUserInputGeoLocation,
  getGeoLocatorCoordinatesLat,
  getGeoLocatorCoordinatesLong,
  getSelectedPlaceId,
} from '../../selectors/userLocatorSelectors'
import { isGuestOrder } from '../../selectors/checkoutSelectors'

export function resetSearchTerm() {
  return {
    type: 'RESET_SEARCH_TERM',
  }
}

export function fillPredictions(searchTerm, predictions) {
  return {
    type: 'FILL_PREDICTIONS',
    searchTerm,
    predictions,
  }
}

export function resetPredictions() {
  return {
    type: 'RESET_PREDICTIONS',
  }
}

export function setSelectedPlace(selectedPlaceDetails) {
  return {
    type: 'SET_SELECTED_PLACE',
    selectedPlaceDetails,
  }
}

export function resetSelectedPlace() {
  return {
    type: 'RESET_SELECTED_PLACE',
  }
}

export function navigateToStoreLocator({
  country,
  latitude,
  longitude,
  sku,
  region,
}) {
  return (dispatch) => {
    browserHistory.push({
      pathname: '/store-locator',
      query: { country, latitude, longitude, sku, region },
    })
    dispatch(closeTopNavMenu())
  }
}

export function getPlaceCoordinates(selectedPrediction, callback) {
  return (dispatch, getState) => {
    if (selectedPrediction && selectedPrediction.location) {
      const {
        location: { lat, long },
      } = selectedPrediction
      if (isEmpty(selectedPrediction.location)) {
        return dispatch(setGenericError('Sorry could not find your location'))
      }
      return callback({
        latitude: lat && lat,
        longitude: long && long,
      })
    }
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { placeId: getSelectedPlaceId(getState()) },
      (results, status) => {
        if (status !== window.google.maps.GeocoderStatus.OK) {
          const { language, brandName } = getState().config
          const l = localise.bind(null, language, brandName)
          return dispatch(
            setGenericError(`${l`Error with googleGeocodeService`}: ${status}`)
          )
        }
        const latitude = results[0].geometry.location.lat()
        const longitude = results[0].geometry.location.lng()
        return callback({ latitude, longitude })
      }
    )
  }
}

function searchStoresBySelectedPlace() {
  return (dispatch, getState) => {
    const { region } = getState().config
    getPlaceCoordinates(
      getSelectedPlaceId(getState()),
      ({ latitude, longitude }) => {
        // If a store is selected when triggering a search we need to clear it
        dispatch(setSelectedStoreIndex(undefined))
        dispatch(navigateToStoreLocator({ latitude, longitude, region }))
      }
    )(dispatch, getState)
  }
}

export function searchStoresBySelectedCoordinates() {
  return (dispatch, getState) => {
    const { region } = getState().config
    const latitude = getGeoLocatorCoordinatesLat(getState())
    const longitude = getGeoLocatorCoordinatesLong(getState())

    dispatch(setSelectedStoreIndex(undefined))
    dispatch(navigateToStoreLocator({ latitude, longitude, region }))
  }
}

export function createStoreLocatorQuery(latitude, longitude) {
  return (dispatch, getState) => {
    const filters = path(['storeLocator', 'filters'], getState()) || []
    const cfsi = isFeatureCFSIEnabled(getState())
    const basket =
      path(['checkout', 'orderSummary', 'basket'], getState()) || {}
    const basketDetails = cfsi ? getBasketDetails(basket) : ''
    const query = {
      latitude,
      longitude,
      brandPrimaryEStoreId: getStoreId(getState()),
      deliverToStore: true,
      types: getAppliedFilters(filters).join(','),
      basketDetails,
    }

    dispatch(setStoreLocatorQuery(query))

    browserHistory.push({
      pathname: isGuestOrder(getState())
        ? '/guest/checkout/delivery/collect-from-store'
        : '/checkout/delivery/collect-from-store',
      query: {
        ...getState().routing.location.query,
        ...query,
      },
    })
  }
}

export function searchStoresCheckout() {
  return (dispatch, getState) => {
    if (
      isFeatureStoreLocatorGpsEnabled(getState()) &&
      getUserInputGeoLocation(getState())
    ) {
      const latitude = getGeoLocatorCoordinatesLat(getState())
      const longitude = getGeoLocatorCoordinatesLong(getState())

      dispatch(createStoreLocatorQuery(latitude, longitude))
    } else {
      const prediction = getState().userLocator.selectedPlaceDetails // todo use selector
      getPlaceCoordinates(prediction, ({ latitude, longitude }) => {
        dispatch(createStoreLocatorQuery(latitude, longitude))
      })(dispatch, getState)
    }
  }
}

export function searchStores() {
  return (dispatch, getState) => {
    const { selectedCountry } = getState().storeLocator
    if (selectedCountry === 'United Kingdom') {
      // feature flag added to bypass geocoder api for place and they have filled userInputGeoLocation
      if (
        isFeatureStoreLocatorGpsEnabled(getState()) &&
        getUserInputGeoLocation(getState())
      ) {
        dispatch(searchStoresBySelectedCoordinates())
      } else {
        dispatch(searchStoresBySelectedPlace())
      }
    } else {
      dispatch(navigateToStoreLocator({ country: selectedCountry }))
    }
  }
}

export function fillRecentStores(recentStores) {
  return {
    type: 'FILL_RECENT_STORES',
    recentStores,
  }
}

export function resetRecentStores() {
  return {
    type: 'RESET_RECENT_STORES',
  }
}

function initGoogleAutocompleteService() {
  return (dispatch) =>
    dispatch(loadGoogleMapScript())
      .then(() => pollForGoogleService(['places', 'AutocompleteService'], 3000))
      .then(() => new window.google.maps.places.AutocompleteService())
}

export function googleAutocomplete(searchTerm) {
  return (dispatch) => {
    return dispatch(initGoogleAutocompleteService())
      .then((service) => {
        return new Promise((resolve, reject) => {
          service.getPlacePredictions(
            {
              input: searchTerm,
              componentRestrictions: { country: 'uk' },
            },
            (predictions, status) => {
              if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                return reject(new Error('PlaceServiceStatus not ok'))
              }
              return resolve(
                predictions.map((p) => ({
                  key: p.place_id,
                  description: p.description,
                  id: p.id,
                }))
              )
            }
          )
        })
      })
      .catch((err) => {
        if (window.NREUM && window.NREUM.noticeError)
          window.NREUM.noticeError(err)

        throw err
      })
  }
}

export function fetchAutocomplete(searchTerm) {
  return (dispatch, getState) => {
    const preferredISOs = getState().config.preferredISOs
    return (
      woosmapFetch(preferredISOs, searchTerm)
        // Google fallback if WoosMap doesn't work
        .catch(() => dispatch(googleAutocomplete(searchTerm)))
        .then((predictions) => {
          if (searchTerm.length >= 3) {
            dispatch(fillPredictions(searchTerm, predictions))
          } else if (searchTerm.length === 0) {
            dispatch(resetPredictions())
          }
        })
    )
  }
}

export function completeRecentStores(searchTerm) {
  return (dispatch, getState) => {
    return dispatch(initGoogleAutocompleteService())
      .then(() => {
        const service = new window.google.maps.places.AutocompleteService()
        const { brandName } = getState().config
        searchTerm.forEach((term) => {
          if (
            term.brandName &&
            term.name &&
            term.brandName.toLowerCase() === brandName.toLowerCase()
          ) {
            service.getPlacePredictions(
              {
                input: `${term.address.postcode}`,
                componentRestrictions: { country: 'uk' },
              },
              (predictions, status) => {
                if (
                  status !== window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  // error handling
                  return
                }
                predictions[0].description = `${term.brandName}, ${term.name}`
                predictions[0].storeId = term.storeId
                dispatch(fillRecentStores(predictions))
              }
            )
          }
        })
      })
      .catch((err) => {
        if (window.NREUM && window.NREUM.noticeError)
          window.NREUM.noticeError(err)
      })
  }
}

export function setCurrentLocationError(error) {
  return {
    type: 'SET_CURRENT_LOCATION_ERROR',
    error,
  }
}

export function setGetCurrentLocationError(id) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    let formattedError

    switch (id) {
      case 1:
        formattedError = l`Please enable location services in your browser settings`
        break
      case 2:
        formattedError = l`As you are currently offline your location can’t be determined`
        break
      case 3:
        formattedError = l`Geolocation timed out`
        break
      default:
        formattedError = l`An unknown error occurred`
    }

    return dispatch(setCurrentLocationError(formattedError))
  }
}

export function setUserGeoLocationLatLong(latLong) {
  return {
    type: 'SET_USER_GEO_LOCATION_LAT_LONG',
    latLong,
  }
}

export function setUserLocatorPending(pending) {
  return {
    type: 'SET_USER_LOCATOR_PENDING',
    pending,
  }
}

export function setUserInputGeoLocation(condition) {
  return {
    type: 'SET_USER_INPUT_GEO_LOCATED',
    condition,
  }
}

/**
 * Set the current location based on gps location
 * @param latLng
 * @returns {Function}
 */
export function setLocationByGeocoder(latLng) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)

    dispatch(setUserGeoLocationLatLong(latLng))
    dispatch(setUserLocatorPending(false))
    dispatch(setFormField('userLocator', 'userLocation', l`Current Location`))
    dispatch(setUserInputGeoLocation(true))
  }
}

/**
 * Successful callback if geoLocation is enabled
 * @param latitude
 * @param longitude
 * @returns {Function}
 */
export function onGetCurrentPositionSuccess({
  coords: { latitude, longitude },
}) {
  const latLng = { lat: parseFloat(latitude), long: parseFloat(longitude) }
  return (dispatch) => {
    dispatch(setLocationByGeocoder(latLng))
  }
}

export function clearGeolocationError() {
  return {
    type: 'SET_CURRENT_LOCATION_ERROR',
    error: false,
  }
}

export function resetUserGeoLocation() {
  return {
    type: 'RESET_GEO_USER_LOCATION',
  }
}
