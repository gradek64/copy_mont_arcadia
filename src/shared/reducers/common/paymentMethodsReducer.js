import createReducer from '../../lib/create-reducer'

const initialState = []

export default createReducer(initialState, {
  SET_PAYMENT_METHODS: (state, { payload }) => payload,
})
