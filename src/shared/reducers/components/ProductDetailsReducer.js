import createReducer from '../../lib/create-reducer'
import { UPDATE_LOCATION } from 'react-router-redux'

const initialState = {
  activeItem: {},
  selectedOosItem: {},
  showError: false,
  sizeGuideOpen: false,
  sizeGuideType: null,
}

export default createReducer(initialState, {
  UPDATE_ACTIVE_ITEM: (
    state,
    { activeItem, selectedQuantity = 1, showError = false }
  ) => ({ ...state, activeItem, selectedQuantity, showError }),
  UPDATE_ACTIVE_ITEM_QUANTITY: (state, { selectedQuantity }) => ({
    ...state,
    selectedQuantity,
  }),
  UPDATE_SELECTED_OOS_ITEM: (state, { selectedOosItem }) => ({
    ...state,
    selectedOosItem,
  }),
  UPDATE_SHOW_ITEMS_ERROR: (state, { showError = true }) => ({
    ...state,
    showError,
  }),
  SET_SIZE_GUIDE: (state, { sizeGuideType }) => ({ ...state, sizeGuideType }),
  SHOW_SIZE_GUIDE: (state) => ({ ...state, sizeGuideOpen: true }),
  HIDE_SIZE_GUIDE: (state) => ({
    ...state,
    sizeGuideOpen: false,
    sizeGuideType: null,
  }),
  [UPDATE_LOCATION]: (state) => ({ ...state, sizeGuideOpen: false }),
})
