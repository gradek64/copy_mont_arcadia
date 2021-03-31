import createReducer from '../../lib/create-reducer'
import { UPDATE_LOCATION } from 'react-router-redux'
import withStorage from '../decorators/withStorage'
import storageHandlers from '../../../client/lib/state-sync/handlers'
import { error, nrBrowserLogError } from '../../../client/lib/logger'
import { omit } from 'ramda'

function emptyBag() {
  return { products: [], orderId: 0 }
}

const emptyObjectEncoded = '%7B%7D'
const recentlyAdded = (state = {}, recentlyAdded) => ({
  ...state,
  recentlyAdded: {
    products: [],
    quantity: 0,
    isMiniBagConfirmShown: false,
    ...state.recentlyAdded,
    ...recentlyAdded,
  },
})

const countItems = (products = []) =>
  products.reduce((acc, product) => acc + (product.quantity || 0), 0)

const initialState = {
  totalItems: 0,
  isAddingToBag: false,
  miniBagOpen: false,
  autoClose: false,
  promotionCodeConfirmation: false,
  bag: emptyBag(),
  loadingShoppingBag: false,
  messages: [],
  ...recentlyAdded(),
}

export const reducer = createReducer(initialState, {
  UPDATE_SHOPPING_BAG_BADGE_COUNT: (state, { count }) => ({
    ...state,
    totalItems: count,
  }),
  SET_ADDING_TO_BAG: (state) => ({
    ...state,
    isAddingToBag: true,
  }),
  CLEAR_ADDING_TO_BAG: (state) => ({
    ...state,
    isAddingToBag: false,
  }),
  OPEN_MINI_BAG: (state, { autoClose }) => ({
    ...state,
    miniBagOpen: true,
    autoClose,
  }),
  CLOSE_MINI_BAG: (state) => {
    if (!state.bag.products.some((product) => product.editing)) {
      // If none of the products are being edited then we want to return early
      // in order to avoid components re-rendering unnecessarily
      // see: https://redux.js.org/faq/react-redux#why-is-my-component-re-rendering-too-often
      return { ...state, miniBagOpen: false }
    }
    // When a user closes their minibag we want to stop editing all products:
    return {
      ...state,
      miniBagOpen: false,
      bag: {
        ...state.bag,
        products: state.bag.products.map((product) => {
          if (!product.editing) return product
          return {
            ...product,
            editing: false,
          }
        }),
      },
    }
  },
  SET_LOADING_SHOPPING_BAG: (state, { isLoading }) => ({
    ...state,
    loadingShoppingBag: isLoading,
  }),
  SET_PROMOTION_CODE_CONFIRMATION: (state, { promotionCodeConfirmation }) => ({
    ...state,
    promotionCodeConfirmation,
  }),
  UPDATE_BAG: (state, { bag }) => {
    const { deliveryThresholdsJson = emptyObjectEncoded } = bag

    let deliveryMessageThresholds = {}

    try {
      deliveryMessageThresholds =
        deliveryThresholdsJson !== emptyObjectEncoded
          ? JSON.parse(decodeURIComponent(deliveryThresholdsJson))
          : deliveryMessageThresholds
    } catch (e) {
      error('deliveryThresholdsJson', e)
      nrBrowserLogError('Error parsing deliveryThresholdsJson', e)
    }

    return {
      ...state,
      bag: {
        ...omit(['deliveryThresholdsJson'], bag),
        deliveryMessageThresholds,
      },
    }
  },
  UPDATE_SHOPPING_BAG_PRODUCT: (state, action) => ({
    ...state,
    bag: {
      ...state.bag,
      products: state.bag.products.map((product, index) => {
        return index === action.index
          ? {
              ...product,
              ...action.update,
            }
          : product
      }),
    },
  }),
  EMPTY_SHOPPING_BAG: (state) => ({
    ...state,
    ...recentlyAdded(),
    bag: emptyBag(),
    totalItems: 0,
  }),
  FETCH_ORDER_SUMMARY_SUCCESS: (state, { data: { basket } }) => ({
    ...state,
    ...(!basket && recentlyAdded()),
    bag: basket || emptyBag(),
    totalItems: basket ? countItems(basket.products) : 0,
  }),
  PRODUCTS_ADDED_TO_BAG: (state, { payload }) => recentlyAdded(state, payload),
  SHOW_MINIBAG_CONFIRM: (state, { payload }) =>
    recentlyAdded(state, { isMiniBagConfirmShown: payload }),
  UPDATE_ACTIVE_ITEM: (state) => recentlyAdded(state),
  PRE_CACHE_RESET: () => initialState,
  LOGOUT: (state) => ({ ...initialState, miniBagOpen: state.miniBagOpen }),
  [UPDATE_LOCATION]: (state) => {
    if (!state.miniBagOpen) return state

    return { ...state, miniBagOpen: false }
  },
  ADD_MINIBAG_MESSAGE: (state, { payload }) => ({
    ...state,
    messages: [...state.messages, payload],
  }),
  REMOVE_MINIBAG_MESSAGE: (state, { id }) => ({
    ...state,
    messages: state.messages.filter((message) => message.id !== id),
  }),
  CLEAR_MINIBAG_MESSAGES: (state) => ({ ...state, messages: [] }),
  SHOW_MINIBAG_MESSAGE: (state, { id }) => {
    const messages = state.messages.map(
      (message) =>
        message.id === id ? { ...message, isVisible: true } : message
    )
    return { ...state, messages }
  },
  HIDE_MINIBAG_MESSAGE: (state, { id }) => {
    const messages = state.messages.map(
      (message) =>
        message.id === id ? { ...message, isVisible: false } : message
    )
    return { ...state, messages }
  },
  UPDATE_ORDER_ID: (state, { orderId }) => {
    return {
      ...state,
      bag: {
        ...state.bag,
        orderId,
      },
    }
  },
  RESET_SHOPPING_BAG: () => initialState,
  NO_BAG: (state) => ({
    ...state,
    totalItems: initialState.totalItems,
    messages: initialState.messages,
    bag: emptyBag(),
  }),
})

export default withStorage(storageHandlers.shoppingBag)(reducer)
