import { path, pathOr, ifElse, isNil } from 'ramda'

/*
 *  if selectedPlaceDetails does not have a location property
 *  return the key property
 *  else return the full selectedPlaceDetails object
 */

const getSelectedPlaceLocation = path([
  'userLocator',
  'selectedPlaceDetails',
  'location',
])
const getSelectedPlaceKey = path(['userLocator', 'selectedPlaceDetails', 'key'])
const getSelectedPlace = path(['userLocator', 'selectedPlaceDetails'])

const isSelectedPlaceLocationNull = (state) =>
  isNil(getSelectedPlaceLocation(state))

export const getSelectedPlaceId = ifElse(
  isSelectedPlaceLocationNull,
  getSelectedPlaceKey,
  getSelectedPlace
)

export const getPredictionDescription = path([
  'userLocator',
  'selectedPlaceDetails',
  'description',
])

export const getPreviousSelectedPlaceId = path([
  'userLocator',
  'prevSelectedPlaceDetails',
  'key',
])

export const getGeoLocationError = pathOr(false, [
  'userLocator',
  'geoLocation',
  'geolocationError',
])

export const getUserInputGeoLocation = path([
  'userLocator',
  'geoLocation',
  'userInputGeoLocation',
])

export const getGeoLocatorCoordinatesLong = path([
  'userLocator',
  'geoLocation',
  'userGeoLongLat',
  'long',
])

export const getGeoLocatorCoordinatesLat = path([
  'userLocator',
  'geoLocation',
  'userGeoLongLat',
  'lat',
])
