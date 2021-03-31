import createReducer from '../../lib/create-reducer'

const initialState = {
  /* Creating a klarna session returns a clientToken. clientToken is used
   * to initiate the Klarna SDK to communicate with Klarna
   * */
  clientToken: '',
  /* Creating a klarna session returns a paymentMethodCategories.
   * paymentMethodCategories is used to load the Klarna form and to display
   * the correct payment options.
   * */
  paymentMethodCategories: [],
  /* isKlarnaUpdateBlocked is to prevent the Klarna form from updating while
   * klarna update is in progress
   * */
  isKlarnaUpdateBlocked: false,
  /* isKlarnaPaymentBlocked is to prevent a customer from submitting a payment
   * when a customer is rejected by Klarna.
   * */
  isKlarnaPaymentBlocked: false,
}

export default createReducer(initialState, {
  BLOCK_KLARNA_UPDATE: (state, { isKlarnaUpdateBlocked }) => ({
    ...state,
    isKlarnaUpdateBlocked,
  }),
  BLOCK_KLARNA_PAYMENT: (state, { isKlarnaPaymentBlocked }) => ({
    ...state,
    isKlarnaPaymentBlocked,
  }),
  SET_KLARNA_CLIENT_TOKEN: (state, { clientToken }) => ({
    ...state,
    clientToken,
  }),
  SET_KLARNA_PAYMENT_METHOD_CATEGORIES: (
    state,
    { paymentMethodCategories }
  ) => ({ ...state, paymentMethodCategories }),
  RESET_KLARNA: () => {
    return { ...initialState }
  },
  // TODO: What is this for?
  PRE_CACHE_RESET: () => initialState,
})
