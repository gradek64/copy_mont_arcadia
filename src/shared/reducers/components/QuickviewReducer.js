import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    product: {},
    activeItem: {},
    showError: false,
  },
  {
    SET_PRODUCT_QUICKVIEW: (state, { product }) => {
      if (state.newItems && state.newItems.productId === product.productId) {
        product.items = state.newItems.items
      }
      return {
        ...state,
        newItems: undefined,
        product,
      }
    },
    SET_PRODUCT_ID_QUICKVIEW: (state, { productId }) => ({
      ...state,
      productId,
    }),
    UPDATE_QUICK_VIEW_ACTIVE_ITEM: (state, { activeItem }) => ({
      ...state,
      activeItem,
      selectedQuantity: 1,
      showError: false,
    }),
    UPDATE_QUICK_VIEW_ACTIVE_ITEM_QUANTITY: (state, { selectedQuantity }) => ({
      ...state,
      selectedQuantity,
    }),
    UPDATE_PRODUCT_ITEMS: (state, { productId, items }) => {
      if (state.productId === productId) {
        return {
          ...state,
          product: {
            ...state.product,
            items,
          },
        }
      }
      return {
        ...state,
        newItems: {
          productId,
          items,
        },
      }
    },
    UPDATE_QUICK_VIEW_SHOW_ITEMS_ERROR: (state, { showError = true }) => ({
      ...state,
      showError,
    }),
  }
)
