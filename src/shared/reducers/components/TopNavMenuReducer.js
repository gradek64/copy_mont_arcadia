import createReducer from '../../lib/create-reducer'
import { tablet, laptop, desktop } from '../../constants/viewportConstants'

export const initialState = { open: false, scrollToTop: false }

export default createReducer(initialState, {
  TOGGLE_TOP_NAV_MENU: (state) => ({ ...state, open: !state.open }),
  CLOSE_TOP_NAV_MENU: (state) => ({ ...state, open: false }),
  TOGGLE_SCROLL_TO_TOP: (state) => ({
    ...state,
    scrollToTop: !state.scrollToTop,
  }),
  UPDATE_MEDIA_TYPE: (state, payload) => {
    if (payload === undefined) return state
    if ([tablet, laptop, desktop].includes(payload.media)) {
      return initialState
    }
    return state
  },
})
