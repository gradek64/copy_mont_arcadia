import createReducer from '../../lib/create-reducer'

export default createReducer(
  { activeItem: {}, storeListOpen: false, storeLocatorProps: {} },
  {
    UPDATE_FIND_IN_STORE_ACTIVE_ITEM: (state, { activeItem }) => ({
      ...state,
      activeItem,
    }),
    CLEAR_FIND_IN_STORE_ACTIVE_ITEM: (state) => ({
      ...state,
      activeItem: {},
    }),
    SET_STORE_STOCK_LIST: (state, { storeListOpen }) => ({
      ...state,
      storeListOpen,
    }),
    SET_STORE_STOCK_LIST_PROPS: (state, { storeLocatorProps }) => ({
      ...state,
      storeLocatorProps,
    }),
  }
)
