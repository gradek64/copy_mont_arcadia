import createReducer from '../../lib/create-reducer'

const initialState = {
  isManual: false,
  monikers: [],
}

export default createReducer(initialState, {
  RESET_SEARCH: () => initialState,
  LOGOUT: () => initialState,
  SET_ADDRESS_MODE_TO_FIND: () => ({ isManual: false, monikers: [] }),
  SET_ADDRESS_MODE_TO_MANUAL: () => ({ isManual: true, monikers: [] }),
  UPDATE_MONIKER: (state, { data }) => ({ ...state, monikers: data }),
})
