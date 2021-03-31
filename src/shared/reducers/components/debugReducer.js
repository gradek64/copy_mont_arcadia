import createReducer from '../../lib/create-reducer'

export const initialState = {
  montyVisualIndicatorVisible: true,
}

export default createReducer(initialState, {
  ALLOW_DEBUG: (state) => ({ ...state, isAllowed: true }),
  SET_DEBUG_INFO: (state, { environment, buildInfo }) => ({
    ...state,
    environment,
    buildInfo,
  }),
  SHOW_DEBUG: (state) => ({ ...state, isShown: state.isAllowed }),
  HIDE_DEBUG: (state) => ({ ...state, isShown: false }),
})
