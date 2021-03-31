import createReducer from '../../lib/create-reducer'

export default createReducer(null, {
  SET_PAGE_TYPE: (state, { pageType }) => pageType,
  CLEAR_PAGE_TYPE: () => null,
})
