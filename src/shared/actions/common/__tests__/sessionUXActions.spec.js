import * as actions from '../sessionUXActions'

describe('MarketingSlideup', () => {
  describe('fireMarketingSlideUpClickEvent', () => {
    it('should dispatch `MARKETING_SLIDEUP_CLICK_EVENT`', () => {
      expect(actions.fireMarketingSlideUpClickEvent()).toEqual({
        type: 'MARKETING_SLIDEUP_CLICK_EVENT',
      })
    })
  })
  describe('showMarketingSlideUp', () => {
    it('should dispatch `SHOW_MARKETING_SLIDEUP`', () => {
      expect(actions.showMarketingSlideUp()).toEqual({
        type: 'SHOW_MARKETING_SLIDEUP',
      })
    })
  })
  describe('getMarketingSliderDismissedCookie', () => {
    it('should dispatch `GET_MARKETING_SLIDER_DISMISSED_COOKIE`', () => {
      expect(actions.getMarketingSliderDismissedCookie()).toEqual({
        type: 'GET_MARKETING_SLIDER_DISMISSED_COOKIE',
      })
    })
  })
  describe('hideMarketingSlideUp', () => {
    it('should dispatch `HIDE_MARKETING_SLIDEUP`', () => {
      expect(actions.hideMarketingSlideUp()).toEqual({
        type: 'HIDE_MARKETING_SLIDEUP',
      })
    })
  })
  describe('fireMarketingSlideUpClickEvent', () => {
    it('should dispatch `MARKETING_SLIDEUP_CLICK_EVENT`', () => {
      expect(actions.fireMarketingSlideUpClickEvent()).toEqual({
        type: 'MARKETING_SLIDEUP_CLICK_EVENT',
      })
    })
  })
})

describe('RecentlyViewedTab', () => {
  describe('toggleRecentlyViewedTabOpen', () => {
    it('should call `TOGGLE_RECENTLY_VIEWED_TAB_OPEN`', () => {
      expect(actions.toggleRecentlyViewedTabOpen()).toEqual({
        type: 'TOGGLE_RECENTLY_VIEWED_TAB_OPEN',
      })
    })
  })

  describe('dismissRecentlyViewedTab', () => {
    it('should call `DISMISS_RECENTLY_VIEWED_TAB`', () => {
      expect(actions.dismissRecentlyViewedTab()).toEqual({
        type: 'DISMISS_RECENTLY_VIEWED_TAB',
      })
    })
  })
})
