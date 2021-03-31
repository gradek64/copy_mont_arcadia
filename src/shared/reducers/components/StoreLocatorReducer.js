import createReducer from '../../lib/create-reducer'

export const enabledFilters = {
  brand: {
    applied: true,
    selected: true,
    disabled: false,
  },
  parcel: {
    selected: true,
    applied: true,
    disabled: false,
  },
  other: {
    applied: true,
    selected: true,
    disabled: false,
  },
}

export const defaultStoreLocatorState = {
  currentLat: 51.515615,
  currentLng: -0.1432734,
  currentZoom: 14,
  filters: {
    ...enabledFilters,
    today: {
      applied: true,
      selected: true,
      disabled: false,
    },
  },
  loading: false,
  mapExpanded: false,
  noStoresFound: false,
  query: undefined,
  selectedStoreIndex: undefined,
  stores: [],
  selectedStore: {},
}

export default createReducer(defaultStoreLocatorState, {
  // EXP-313 - if storeWithParcel is true we should enable
  // all filters so that they can all be used
  SET_STORE_WITH_PARCEL: (state, { storeWithParcel }) => {
    return storeWithParcel
      ? {
          ...state,
          filters: {
            ...state.filters,
            ...enabledFilters,
          },
        }
      : state
  },
  ADD_MARKERS: (state, { markers }) => ({
    ...state,
    markers,
  }),
  GET_STORES_LOADING: (state, { loading }) => ({
    ...state,
    loading,
  }),
  GET_STORES_ERROR: (state, { error }) => ({
    ...state,
    error,
  }),
  RECEIVE_STORES: (state, { stores }) => ({
    ...state,
    stores,
    noStoresFound: false,
  }),
  SET_FULFILMENT_STORE: (state, { payload }) => ({
    ...state,
    selectedStore: payload,
  }),
  SET_FULFILMENT_STORE_SKU: (state, { sku }) => ({
    ...state,
    selectedStoreSKU: sku,
  }),
  SET_SELECTED_STORE_ID: (state, { selectedStoreId }) => ({
    ...state,
    selectedStoreId,
  }),
  SET_DELIVERY_STORE_WITH_DETAILS: (state, { store }) => ({
    ...state,
    stores: [store],
  }),
  SELECT_STORE: (state, { index }) => ({
    ...state,
    selectedStoreIndex: index,
  }),
  UPDATE_CURRENT_LAT_LNG: (
    state,
    { coordinates: { currentLat, currentLng } }
  ) => ({
    ...state,
    currentLat,
    currentLng,
  }),
  RESET_STORE_LOCATOR: (state) => ({
    ...state,
    ...defaultStoreLocatorState,
    filters: state.filters,
    selectedStore: state.selectedStore,
  }),
  NO_STORES_FOUND: (state) => ({ ...state, stores: [], noStoresFound: true }),
  SET_FILTER_SELECTED: (state, { filter, selected }) => ({
    ...state,
    filters: {
      ...state.filters,
      [filter]: {
        ...state.filters[filter],
        selected,
      },
    },
  }),
  APPLY_SELECTED_FILTERS: (state) => ({
    ...state,
    filters: Object.keys(state.filters).reduce(
      (filters, filter) => ({
        ...filters,
        [filter]: {
          ...state.filters[filter],
          applied: state.filters[filter].selected,
        },
      }),
      {}
    ),
  }),
  APPLY_FILTERS: (state, { filters }) => ({
    ...state,
    filters: Object.keys(state.filters).reduce((existingFilters, filter) => {
      const applied = filters.includes(filter)
      let disabled = state.filters[filter] && state.filters[filter].disabled
      if (state.filters.today) {
        if (
          ['parcel', 'other'].includes(filter) &&
          state.filters.today.selected
        ) {
          disabled = true
        }
      }
      return {
        ...existingFilters,
        [filter]: {
          ...state.filters[filter],
          applied,
          selected: applied,
          disabled,
        },
      }
    }, {}),
  }),
  APPLY_CHECKOUT_FILTERS: (state, { filters }) => ({
    ...state,
    filters: Object.keys(state.filters).reduce((existingFilters, filter) => {
      const isActive = filters.includes(filter)
      return {
        ...existingFilters,
        [filter]: {
          ...state.filters[filter],
          applied: isActive,
          selected: isActive,
          disabled: !isActive,
        },
      }
    }, {}),
  }),
  SET_FILTERS: (state, { filters }) => ({
    ...state,
    filters,
  }),
  SET_STORE_LOCATOR_QUERY: (state, { query }) => ({
    ...state,
    query,
  }),
  SET_MAP_EXPANDED: (state, { expanded }) => ({
    ...state,
    mapExpanded: expanded,
  }),
  SET_FILTERS_ERROR_DISPLAY: (state, { display }) => ({
    ...state,
    filtersErrorDisplayed: display,
  }),
  CLEAR_FILTERS: (state) => ({
    ...state,
    filtersErrorDisplayed: false,
    filters: Object.keys(state.filters).reduce(
      (filters, filter) => ({
        ...filters,
        [filter]: {
          ...state.filters[filter],
          selected: state.filters[filter].applied,
        },
      }),
      {}
    ),
  }),
  SET_COUNTRIES: (state, { countries }) => ({
    ...state,
    countries,
  }),
  SELECT_COUNTRY: (state, { name }) => ({
    ...state,
    selectedCountry: name,
  }),
})
