/**
 * GeoIP seeks to encourage a user to use a site most appropriate to their preferred country.
 * The URL we offer the user to be redirected to is determined by either:
 *
 * - the country of origin for their network request, as determined by IP blocks for that country, or
 * - the ISO country code stored as a preference by the user
 *
 * Detailed documentation: https://arcadiagroup.atlassian.net/wiki/spaces/MON/pages/1015087292/Monty+GeoIP
 */
const defaultState = {
  // Only set on a PDP - either the foreign catalog URL or 404 url
  redirectURL: '',
  // hostname of request
  hostname: '',
  // The value of x-user-geo header from Akamai
  geoISO: '',
  // The value of GEOIP cookie
  storedGeoPreference: '',
  // Best guess of user's preferred delivery country ISO based on GeoIP data
  userISOPreference: '',
  // Region based on userISOPreference:
  userRegionPreference: '',
  // Language based on userISOPreference:
  userLanguagePreference: '',
}

const geoIPReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_GEOIP_REDIRECT_URL':
      return {
        ...state,
        redirectURL: action.redirectURL,
      }
    case 'SET_GEOIP_REQUEST_DATA':
      return {
        ...state,
        hostname: action.hostname,
        geoISO: action.geoISO || '',
        storedGeoPreference: action.storedGeoPreference || '',
        userISOPreference: action.userISOPreference || '',
        userRegionPreference: action.userRegionPreference || '',
        userLanguagePreference: action.userLanguagePreference || '',
      }
    default:
      return state
  }
}

export default geoIPReducer
