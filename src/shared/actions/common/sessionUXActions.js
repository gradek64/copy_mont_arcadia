export function fireMarketingSlideUpClickEvent() {
  return {
    type: 'MARKETING_SLIDEUP_CLICK_EVENT',
  }
}

export function showMarketingSlideUp() {
  return {
    type: 'SHOW_MARKETING_SLIDEUP',
  }
}

export function getMarketingSliderDismissedCookie() {
  return {
    type: 'GET_MARKETING_SLIDER_DISMISSED_COOKIE',
  }
}

export function hideMarketingSlideUp() {
  return {
    type: 'HIDE_MARKETING_SLIDEUP',
  }
}

export function toggleRecentlyViewedTabOpen() {
  return {
    type: 'TOGGLE_RECENTLY_VIEWED_TAB_OPEN',
  }
}

export function dismissRecentlyViewedTab() {
  return {
    type: 'DISMISS_RECENTLY_VIEWED_TAB',
  }
}
