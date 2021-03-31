import createReducer from '../../lib/create-reducer'

export default createReducer(
  { isHidden: false },
  {
    HIDE_BREADCRUMBS: (state, { payload }) => ({ ...state, isHidden: payload }),
  }
)
