import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    refreshPlp: true,
  },
  {
    PLP_PROPS_REFRESH: (state) => ({ ...state, refreshPlp: !state.refreshPlp }),
  }
)
