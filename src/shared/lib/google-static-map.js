/**
 * @typedef {[number, number]} Coordinates
 */

/**
 *
 * @param {Array.<Coordinates>} coordinatesList
 */
const createListOfMarker = (coordinatesList) => {
  return coordinatesList.map((v) => v.join(',')).join('|')
}

/**
 * @typedef Dimensions
 * @property {number} width - length in pixels
 * @property {number} height  - length in pixels
 */

/**
 * @typedef GoogleMapsPayload
 * @property {number} currentLat
 * @property {number} currentLng
 * @property {Array.<Coordinates>} markers
 * @property {Dimensions} dimensions
 * @property {string} iconDomain
 * @property {number} zoom
 * @property {string} [apiKey] - optional apikey string
 */

/**
 * takes a google maps payload object and constructs a url used to request
 * a map from the google maps api
 * @param {GoogleMapsPayload} googleMapsPayload
 * @returns {string}
 */
export const createStaticMapUrl = ({
  currentLat,
  currentLng,
  markers = [],
  dimensions,
  iconDomain,
  zoom,
  apiKey,
}) => {
  // apiKey will only be passed in on the server
  const googleApiKey = apiKey || window.GOOGLE_API_KEY
  const hasMarkers = markers.length !== 0
  const iconUrl = `https://${iconDomain}/v1/static/store-markers`
  const params = [
    `center=${encodeURIComponent(`${currentLat},${currentLng}`)}`,
    `zoom=${encodeURIComponent(zoom)}`,
    `size=${encodeURIComponent(dimensions.width)}x${encodeURIComponent(
      dimensions.height
    )}`,
    'maptype=roadmap',
    `style=${encodeURIComponent(
      `feature:poi|visibility:off&style=feature:poi.park|visibility:on`
    )}`,
    `key=${googleApiKey}`,
    hasMarkers &&
      `markers=${encodeURIComponent(
        `icon:${iconUrl}|${createListOfMarker(markers)}`
      )}`,
  ].filter((urlParam) => !!urlParam)

  return `https://maps.googleapis.com/maps/api/staticmap?${params.join('&')}`
}
