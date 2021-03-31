import createReducer from '../../lib/create-reducer'

export default createReducer(null, {
  SET_ERROR: (state, { error }) => error,
})
