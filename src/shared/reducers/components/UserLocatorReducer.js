import createReducer from '../../lib/create-reducer'

const initialState = {
  searchTerm: '',
  predictions: [],
  selectedPlaceDetails: {
    place_id: '',
  },
  /*
  * ADP-254: prevSelectedPlaceDetails is used for keeping persistant place_id for retrieving google coordinates
  * when a user clears the input box for store locator on checkout.
  */
  prevSelectedPlaceDetails: {
    place_id: '',
  },
  countries: [],
  pending: false,
  geoLocation: {
    geoLocationError: false,
    userInputGeoLocation: false,
    userGeoLongLat: {
      lat: undefined,
      long: undefined,
    },
  },
}

export default createReducer(initialState, {
  FILL_PREDICTIONS: (state, { searchTerm, predictions }) => ({
    ...state,
    searchTerm,
    predictions,
  }),
  RESET_PREDICTIONS: (state) => ({
    ...state,
    predictions: [],
  }),
  FILL_RECENT_STORES: (state, { recentStores }) => ({
    ...state,
    recentStores,
  }),
  RESET_RECENT_STORES: (state) => ({
    ...state,
    recentStores: [],
  }),
  SET_SELECTED_PLACE: (state, { selectedPlaceDetails }) => ({
    ...state,
    selectedPlaceDetails,
  }),
  RESET_SELECTED_PLACE: (state) => ({
    ...state,
    selectedPlaceDetails: {},
    prevSelectedPlaceDetails: {
      place_id: state.selectedPlaceDetails.place_id,
    },
  }),
  SET_CURRENT_LOCATION_ERROR: (state, { error }) => ({
    ...state,
    geoLocation: {
      ...state.geoLocation,
      geolocationError: error,
    },
  }),
  RESET_SEARCH_TERM: (state) => ({
    ...state,
    searchTerm: '',
  }),
  SET_USER_LOCATOR_PENDING: (state, { pending }) => ({
    ...state,
    pending,
  }),
  SET_USER_INPUT_GEO_LOCATED: (state, { condition }) => ({
    ...state,
    geoLocation: {
      ...state.geoLocation,
      userInputGeoLocation: condition,
    },
  }),
  SET_USER_GEO_LOCATION_LAT_LONG: (state, { latLong }) => ({
    ...state,
    geoLocation: {
      ...state.geoLocation,
      userGeoLongLat: {
        lat: latLong.lat,
        long: latLong.long,
      },
    },
  }),
  RESET_GEO_USER_LOCATION: (state) => ({
    ...state,
    geoLocation: initialState.geoLocation,
  }),
})
