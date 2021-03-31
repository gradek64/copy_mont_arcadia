import createReducer from '../../lib/create-reducer'

const initialState = {
  canMakePayments: false,
  canMakePaymentsWithActiveCard: false,
}

export default createReducer(initialState, {
  SET_APPLE_PAY_AVAILABILITY: (state, { canMakePayments }) => ({
    ...state,
    canMakePayments,
  }),
  SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD: (
    state,
    { canMakePaymentsWithActiveCard }
  ) => ({
    ...state,
    canMakePaymentsWithActiveCard,
  }),
})
