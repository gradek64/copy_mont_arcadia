import createReducer from '../../lib/create-reducer'

const initialState = {
  orders: [],
  orderDetails: {
    orderLines: [],
    orderLinesSortedByTracking: [],
  },
}

export default createReducer(initialState, {
  SET_ORDER_HISTORY_ORDERS: (state, { orders }) => ({
    ...state,
    orders,
  }),
  SET_ORDER_HISTORY_DETAILS: (state, { orderDetails }) => ({
    ...state,
    orderDetails,
  }),
  LOGOUT: () => initialState,
})
