import { UPDATE_LOCATION } from 'react-router-redux'

import createReducer from '../../lib/create-reducer'

const setSortOptions = (state, sortOptions) => {
  const decoded = sortOptions && decodeURIComponent(sortOptions)
  return decoded ? { ...state, currentSortOption: decoded } : state
}

export default createReducer(
  { currentSortOption: null },
  {
    SELECT_SORT_OPTION: (state, { option }) => ({
      ...state,
      currentSortOption: option,
    }),
    CLEAR_SORT_OPTIONS: (state) => ({ ...state, currentSortOption: null }),
    UPDATE_LOCATION_SERVER: (state, { location: { query: { sort } = {} } }) =>
      setSortOptions(state, sort),
    [UPDATE_LOCATION]: (state, { payload: { query: { sort, Ns } = {} } }) => {
      if (sort) {
        return setSortOptions(state, sort)
      } else if (Ns) {
        return { ...state }
      }
      return { ...state, currentSortOption: null } // clear `currentSortOption` if `sort` is falsey
    },
  }
)
