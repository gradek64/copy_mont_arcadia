import createReducer from '../../lib/create-reducer'
import withStorage from '../decorators/withStorage'
import storageHandlers from '../../../client/lib/state-sync/handlers'
import { getItem } from '../../../client/lib/cookie/utils'

/**
 * sessionUX is a grouping of UX state that needs to be persisted using session
 * storage, eg popup dismissal state
 */

export const initialSessionState = {
  marketingSlideUp: {
    clicksEventsFired: 0,
    isSliderActive: false,
    hasSliderBeenSeen: false,
  },
  recentlyViewedTab: {
    isOpen: false,
    isDismissed: false,
  },
}
export const reducer = createReducer(initialSessionState, {
  MARKETING_SLIDEUP_CLICK_EVENT: (state = initialSessionState) => ({
    ...state,
    marketingSlideUp: {
      ...state.marketingSlideUp,
      clicksEventsFired: state.marketingSlideUp.clicksEventsFired
        ? state.marketingSlideUp.clicksEventsFired + 1
        : initialSessionState.marketingSlideUp.clicksEventsFired + 1,
    },
  }),
  GET_MARKETING_SLIDER_DISMISSED_COOKIE: (state = initialSessionState) => ({
    ...state,
    marketingSlideUp: {
      ...state.marketingSlideUp,
      hasSliderBeenSeen: getItem('marketingSliderDismissed') === 'true',
    },
  }),
  SHOW_MARKETING_SLIDEUP: (state = initialSessionState) => ({
    ...state,
    marketingSlideUp: {
      ...state.marketingSlideUp,
      isSliderActive: true,
    },
  }),
  HIDE_MARKETING_SLIDEUP: (state = initialSessionState) => ({
    ...state,
    marketingSlideUp: {
      ...state.marketingSlideUp,
      isSliderActive: false,
    },
  }),
  TOGGLE_RECENTLY_VIEWED_TAB_OPEN: (state) => ({
    ...state,
    recentlyViewedTab: {
      ...state.recentlyViewedTab,
      isOpen: !state.recentlyViewedTab.isOpen,
    },
  }),
  DISMISS_RECENTLY_VIEWED_TAB: (state) => ({
    ...state,
    recentlyViewedTab: {
      ...state.recentlyViewedTab,
      isDismissed: true,
    },
  }),
})

export default withStorage(storageHandlers.sessionUX)(reducer)
