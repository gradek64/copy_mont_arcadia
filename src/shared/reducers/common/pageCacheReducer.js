import createReducer from '../../lib/create-reducer'

const initialState = { retrieved: false }

export default createReducer(initialState, {
  RETRIEVE_CACHED_DATA: (state) => ({ ...state, retrieved: true }),
})
