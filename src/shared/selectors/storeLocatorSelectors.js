import { path } from 'ramda'
import { createSelector } from 'reselect'
import { getStaticAmplienceHost } from './configSelectors'
import { isStoreWithParcel } from './checkoutSelectors'
import { localise } from '../lib/localisation'

const rootSelector = (state) => state.storeLocator || {}

export const getStoreLocatorStores = (state) => {
  const { stores } = rootSelector(state)
  return stores || []
}

export const getStoresCoordinates = (state) => {
  const stores = getStoreLocatorStores(state)
  return stores.map((store) => {
    return [store.latitude, store.longitude]
  })
}

export const getStoreByIndex = (state, storeIndex) => {
  const stores = getStoreLocatorStores(state)

  return stores[storeIndex]
}

export const getStoreLocatorFilters = createSelector(
  rootSelector,
  // EXP-313
  isStoreWithParcel,
  // if enabledAllFilters is true no option should be
  // disabled
  ({ filters }, enableAllFilters) =>
    enableAllFilters
      ? Object.keys(filters).reduce(
          (updatedFilters, key) => ({
            ...updatedFilters,
            [key]: {
              ...filters[key],
              disabled: false,
            },
          }),
          {}
        )
      : filters
)

export const isMapExpanded = (state) => {
  const { mapExpanded } = rootSelector(state)

  return mapExpanded
}

export const getSelectedStoreIndex = (state) => {
  return path(['storeLocator', 'selectedStoreIndex'], state)
}

export const getStoreCountries = (state) => {
  return path(['storeLocator', 'countries'], state)
}

export const getIntStoreCountries = (state) => {
  const countries = path(['storeLocator', 'countries'], state)
  if (countries && countries.includes('United Kingdom')) {
    countries.splice(countries.indexOf('United Kingdom'), 1)
  }
  return countries
}

export const getSelectedCountry = (state) => {
  return path(['storeLocator', 'selectedCountry'], state)
}

export const createOptions = (state) => {
  const { language, brandName } = path(['config'], state)
  const l = localise.bind(null, language, brandName)
  const label = l`Choose country`
  const countries = path(['storeLocator', 'countries'], state)
  return [{ label, disabled: true }].concat(
    countries.map((country) => ({ value: country, label: country }))
  )
}

/**
 * Selects lat + long to centre the map on
 *
 * @param state {object}
 * @return {object}
 * @property {number} lat
 * @property {number} long
 * @property {number} zoom
 * @property {array} coordinates
 * @property {string} iconDomain
 */
export const getMapCentrePointAndZoom = (state) => {
  const {
    currentLat,
    currentLng,
    stores = [],
    selectedStoreIndex,
  } = rootSelector(state)
  const isAreaSelected = stores.length !== 0
  const isStoreSelected = isAreaSelected && selectedStoreIndex !== undefined
  const storeCoordinates = stores.map((store) => [
    store.latitude,
    store.longitude,
  ])
  const iconDomain = getStaticAmplienceHost(state)
  const markers = isStoreSelected
    ? [
        [
          stores[selectedStoreIndex].latitude,
          stores[selectedStoreIndex].longitude,
        ],
      ]
    : storeCoordinates

  return {
    lat: isStoreSelected ? stores[selectedStoreIndex].latitude : currentLat,
    long: isStoreSelected ? stores[selectedStoreIndex].longitude : currentLng,
    zoom: isAreaSelected ? (isStoreSelected ? 15 : 13) : 14,
    markers,
    iconDomain,
  }
}

// TODO: Move to another file? E.g. find-in-store-selectors.js
export const getActiveItem = path(['findInStore', 'activeItem'])
