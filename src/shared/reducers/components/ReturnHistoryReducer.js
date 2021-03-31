import createReducer from '../../lib/create-reducer'

const initialState = { returns: [] }

export default createReducer(initialState, {
  SET_RETURN_HISTORY_RETURNS: (state, { returns }) => ({
    ...state,
    returns,
  }),
  SET_RETURN_HISTORY_DETAILS: (state, { returnDetails }) => ({
    ...state,
    returnDetails,
  }),
  LOGOUT: () => initialState,
})
