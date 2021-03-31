import createReducer from '../../lib/create-reducer'

const initialState = {}

export default createReducer(initialState, {
  SET_BRAND_FULFILMENT_STORE: (state, { store }) => ({
    ...state,
    ...store,
  }),
})

// TODO move to a selector file
export const getSelectedBrandFulfilmentStore = (state) =>
  state.selectedBrandFulfilmentStore
