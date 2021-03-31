import {
  isMarketingSlideUpActive,
  hasMarketingSliderBeenSeen,
  getNumberOfMarketingSliderClickEventsFired,
  isRecentlyViewedTabOpen,
  isRecentlyViewedTabDismissed,
} from '../sessionUXSelectors'

describe('session selectors', () => {
  describe('isMarketingSlideUpActive', () => {
    it('should return correct value if true', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {
            isSliderActive: true,
          },
        },
      }
      expect(isMarketingSlideUpActive(state)).toBe(true)
    })
    it('should return correct value if false', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {
            isSliderActive: false,
          },
        },
      }
      expect(isMarketingSlideUpActive(state)).toBe(false)
    })
    it('should return false if value does not exist', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {},
        },
      }
      expect(isMarketingSlideUpActive(state)).toBe(false)
    })
  })
  describe('hasSliderBeenSeen', () => {
    it('should return correct value if true', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {
            hasSliderBeenSeen: true,
          },
        },
      }
      expect(hasMarketingSliderBeenSeen(state)).toBe(true)
    })
    it('should return correct value if false', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {
            hasSliderBeenSeen: false,
          },
        },
      }
      expect(hasMarketingSliderBeenSeen(state)).toBe(false)
    })
    it('should return false if value does not exist', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {},
        },
      }
      expect(hasMarketingSliderBeenSeen(state)).toBe(false)
    })
  })
  describe('numberOfMarketingSliderClickEventsFired', () => {
    it('should return correct value if true', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {
            clicksEventsFired: 2,
          },
        },
      }
      expect(getNumberOfMarketingSliderClickEventsFired(state)).toBe(2)
    })
    it('should return 0 if value does not exist', () => {
      const state = {
        sessionUX: {
          marketingSlideUp: {},
        },
      }
      expect(getNumberOfMarketingSliderClickEventsFired(state)).toBe(0)
    })
  })
  describe('isRecentlyViewedTabOpen', () => {
    it('should return correct value if true', () => {
      const state = {
        sessionUX: {
          recentlyViewedTab: {
            isOpen: true,
          },
        },
      }
      expect(isRecentlyViewedTabOpen(state)).toBe(true)
    })
    it('should return false if value does not exist', () => {
      const state = {
        sessionUX: {
          recentlyViewedTab: {
            isOpen: null,
          },
        },
      }
      expect(isRecentlyViewedTabOpen(state)).toBe(false)
    })
  })
  describe('isRecentlyViewedTabDismissed', () => {
    it('should return correct value if true', () => {
      const state = {
        sessionUX: {
          recentlyViewedTab: {
            isDismissed: true,
          },
        },
      }
      expect(isRecentlyViewedTabDismissed(state)).toBe(true)
    })
    it('should return false if value does not exist', () => {
      const state = {
        sessionUX: {
          recentlyViewedTab: {},
        },
      }
      expect(isRecentlyViewedTabDismissed(state)).toBe(false)
    })
  })
})
