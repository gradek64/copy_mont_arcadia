import { pathOr } from 'ramda'

/**
 * sessionUX is a grouping of UX state that needs to be persisted using session
 * storage, eg popup dismissal state
 */

export const isMarketingSlideUpActive = (state) =>
  pathOr(false, ['sessionUX', 'marketingSlideUp', 'isSliderActive'], state)

export const hasMarketingSliderBeenSeen = (state) =>
  pathOr(false, ['sessionUX', 'marketingSlideUp', 'hasSliderBeenSeen'], state)

export const getNumberOfMarketingSliderClickEventsFired = (state) =>
  pathOr(0, ['sessionUX', 'marketingSlideUp', 'clicksEventsFired'], state)

export const isRecentlyViewedTabOpen = (state) =>
  pathOr(false, ['sessionUX', 'recentlyViewedTab', 'isOpen'], state)

export const isRecentlyViewedTabDismissed = (state) =>
  pathOr(false, ['sessionUX', 'recentlyViewedTab', 'isDismissed'], state)
