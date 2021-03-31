import createReducer from '../../lib/create-reducer'
import { assoc, assocPath, evolve, pathOr } from 'ramda'

const initialState = {
  orderCompleted: {},
  orderSummary: {},
  orderSummaryError: {},
  orderError: false,
  orderErrorPaymentDetails: null,
  prePaymentConfig: null,
  useDeliveryAsBilling: true,
  verifyPayment: null,
  storeUpdating: false,
  deliveryAndPayment: {
    deliveryEditingEnabled: false,
  },
  savePaymentDetails: false,
  deliveryStore: undefined,
  isOutOfStockInCheckout: undefined,
  newlyConfirmedOrder: false,
  threeDSecurePrompt: null,
  selectedPaymentMethod: 'CARD',
  finalisedOrder: null,
  paymentMethodsAreOpen: false,
  recaptchaToken: '',
  // EXP-313
  storeWithParcel: false,
}

const setOrderSummaryField = (state, action) => {
  const transform = {
    orderSummary: {
      [action.field]: () => action.value,
    },
  }

  return evolve(transform, state)
}

const getSavedAddress = pathOr(
  [],
  ['DeliveryOptionsDetails', 'deliveryoptionsform', 'savedAddresses']
)

export default createReducer(initialState, {
  // EXP-313
  SET_STORE_WITH_PARCEL: (state, { storeWithParcel }) => ({
    ...state,
    storeWithParcel,
  }),
  EMPTY_ORDER_SUMMARY: (state) => ({
    ...state,
    orderSummary: {},
  }),
  FETCH_ORDER_SUMMARY_SUCCESS: (state, { data }) => ({
    ...state,
    orderSummary: data,
    orderCompleted: {},
  }),
  SET_ORDER_SUMMARY_FIELD: (state, action) =>
    setOrderSummaryField(state, action),
  SET_ORDER_SUMMARY_ERROR: (state, { data }) => ({
    ...state,
    orderSummaryError: data,
  }),
  SET_ORDER_SUMMARY_OUT_OF_STOCK: (state) => ({
    ...state,
    isOutOfStockInCheckout: true,
  }),
  CLEAR_ORDER_SUMMARY_OUT_OF_STOCK: (state) => ({
    ...state,
    isOutOfStockInCheckout: undefined,
  }),
  // @NOTE SET_DELIVERY_AS_BILLING_FLAG is meant to replace SET_DELIVERY_ADDRESS_TO_BILLING
  SET_DELIVERY_AS_BILLING_FLAG: (state, { val }) => ({
    ...state,
    useDeliveryAsBilling: val,
  }),
  SET_ORDER_COMPLETED: (state, { data }) => ({
    ...state,
    orderCompleted: data,
  }),
  SET_NEWLY_CONFIRMED_ORDER: (state, { newlyConfirmedOrder }) => ({
    ...state,
    newlyConfirmedOrder,
  }),
  LOGOUT: () => ({ ...initialState }),
  SET_ORDER_PENDING: (state, { data }) => ({
    ...state,
    verifyPayment: data,
  }),
  UPDATE_ORDER_PENDING: (state, { data }) => ({
    ...state,
    verifyPayment: { ...state.verifyPayment, ...data },
  }),
  CLEAR_ORDER_PENDING: (state) => ({
    ...state,
    verifyPayment: null,
  }),
  SET_THREE_D_SECURE_PROMPT: (state, { data }) => ({
    ...state,
    threeDSecurePrompt: data,
  }),
  CLEAR_THREE_D_SECURE_PROMPT: (state) => ({
    ...state,
    threeDSecurePrompt: null,
  }),
  SET_ORDER_ERROR: (state, { error }) => ({
    ...state,
    orderError: error,
  }),
  CLEAR_ORDER_ERROR: (state) => ({
    ...state,
    orderError: false,
  }),
  SET_ORDER_ERROR_PAYMENT_DETAILS: (state, { data }) => ({
    ...state,
    orderErrorPaymentDetails: data,
  }),
  CLEAR_ORDER_ERROR_PAYMENT_DETAILS: (state) => ({
    ...state,
    orderErrorPaymentDetails: null,
  }),
  SET_PRE_PAYMENT_CONFIG: (state, { config }) => ({
    ...state,
    prePaymentConfig: config,
  }),
  CLEAR_PRE_PAYMENT_CONFIG: (state) => ({
    ...state,
    prePaymentConfig: null,
  }),
  SET_FINALISED_ORDER: (state, { finalisedOrder }) => ({
    ...state,
    finalisedOrder,
  }),
  CLEAR_FINALISED_ORDER: (state) => ({
    ...state,
    finalisedOrder: null,
  }),
  RESET_STORE_DETAILS: (state) => ({
    ...state,
    deliveryStore: undefined,
    orderSummary: {
      ...state.orderSummary,
      storeDetails: undefined,
    },
    showCollectFromStore: false,
  }),
  SET_DELIVERY_STORE: (state, { store }) => ({
    ...state,
    deliveryStore: store,
  }),
  UPDATE_ORDER_SUMMARY_BASKET: (state, action) => ({
    ...state,
    orderSummary: {
      ...state.orderSummary,
      basket: action.data,
    },
  }),
  UPDATE_ORDER_SUMMARY_PRODUCT: (state, action) => ({
    ...state,
    orderSummary: {
      ...state.orderSummary,
      basket: {
        ...state.orderSummary.basket,
        products: state.orderSummary.basket.products.map((product, index) => {
          return index === action.index
            ? {
                ...product,
                ...action.update,
              }
            : product
        }),
      },
    },
  }),
  SET_STORE_UPDATING: (state, { updating }) => ({
    ...state,
    storeUpdating: updating,
  }),
  DELIVERY_AND_PAYMENT_SET_DELIVERY_EDITING_ENABLED: (state, { enabled }) => {
    return assocPath(
      ['deliveryAndPayment', 'deliveryEditingEnabled'],
      enabled,
      state
    )
  },
  SET_SAVE_PAYMENT_DETAILS_ENABLED: (state, { enabled }) => {
    return assoc('savePaymentDetails', enabled, state)
  },
  ADDRESS_BOOK_DELETE_ADDRESS: (state, { payload }) => {
    return {
      ...state,
      orderSummary: {
        ...state.orderSummary,
        savedAddresses: getSavedAddress(payload),
      },
    }
  },
  REMOVE_UNCACHEABLE: (state) => ({ ...state, checkoutVersion: undefined }),
  SHOW_COLLECT_FROM_STORE_MODAL: (state, { show }) => ({
    ...state,
    showCollectFromStore: show,
  }),
  SAVE_SELECTED_PAYMENT_METHOD: (state, { selectedPaymentMethod }) => ({
    ...state,
    selectedPaymentMethod,
  }),
  OPEN_PAYMENT_METHODS: (state) => ({
    ...state,
    paymentMethodsAreOpen: true,
  }),
  CLOSE_PAYMENT_METHODS: (state) => ({
    ...state,
    paymentMethodsAreOpen: false,
  }),

  SET_RECAPTCHA_TOKEN: (state, { recaptchaToken }) => ({
    ...state,
    recaptchaToken,
  }),
})
