import createReducer from '../../lib/create-reducer'

export default createReducer(
  { open: false },
  {
    TOGGLE_PRODUCTS_SEARCH_BAR: (state) => ({ open: !state.open }),
    CLOSE_PRODUCTS_SEARCH_BAR: () => ({ open: false }),
  }
)
