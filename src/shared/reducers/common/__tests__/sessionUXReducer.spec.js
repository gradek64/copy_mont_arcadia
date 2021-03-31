import testReducer from '../sessionUXReducer'

describe('sessionUX Reducer', () => {
  describe('TOGGLE_RECENTLY_VIEWED_TAB_OPEN', () => {
    describe('if isOpen is false', () => {
      it('changes isOpen to true', () => {
        expect(
          testReducer(
            {
              recentlyViewedTab: {
                isOpen: false,
              },
            },
            {
              type: 'TOGGLE_RECENTLY_VIEWED_TAB_OPEN',
            }
          )
        ).toEqual({
          recentlyViewedTab: {
            isOpen: true,
          },
        })
      })
    })
    describe('if isOpen is true', () => {
      it('changes isOpen to false', () => {
        expect(
          testReducer(
            {
              recentlyViewedTab: {
                isOpen: true,
              },
            },
            {
              type: 'TOGGLE_RECENTLY_VIEWED_TAB_OPEN',
            }
          )
        ).toEqual({
          recentlyViewedTab: {
            isOpen: false,
          },
        })
      })
    })
    describe('if isOpen is undefined', () => {
      it('changes isOpen to true', () => {
        expect(
          testReducer(
            {
              recentlyViewedTab: {
                isOpen: undefined,
              },
            },
            {
              type: 'TOGGLE_RECENTLY_VIEWED_TAB_OPEN',
            }
          )
        ).toEqual({
          recentlyViewedTab: {
            isOpen: true,
          },
        })
      })
    })
  })
  describe('DISMISS_RECENTLY_VIEWED_TAB', () => {
    describe('if isDismissed is false', () => {
      it('sets isDismissed to true', () => {
        const state = testReducer(
          {
            recentlyViewedTab: {
              isDismissed: false,
            },
          },
          {
            type: 'DISMISS_RECENTLY_VIEWED_TAB',
          }
        )

        expect(state.recentlyViewedTab.isDismissed).toEqual(true)
      })
      it('remains true if isDismissed is already true', () => {
        const state = testReducer(
          {
            recentlyViewedTab: {
              isDismissed: true,
            },
          },
          {
            type: 'DISMISS_RECENTLY_VIEWED_TAB',
          }
        )

        expect(state.recentlyViewedTab.isDismissed).toEqual(true)
      })
    })
  })
  describe('MARKETING_SLIDEUP_CLICK_EVENT', () => {
    it('should increment clicksEventsFired', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            clicksEventsFired: 0,
          },
        },
        {
          type: 'MARKETING_SLIDEUP_CLICK_EVENT',
        }
      )

      expect(state.marketingSlideUp.clicksEventsFired).toEqual(1)
    })
  })
  describe('GET_MARKETING_SLIDER_DISMISSED_COOKIE', () => {
    it('should set the value of hasSliderBeenSeen to false if cookie doesnt exist', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            hasSliderBeenSeen: null,
          },
        },
        {
          type: 'GET_MARKETING_SLIDER_DISMISSED_COOKIE',
        }
      )
      expect(state.marketingSlideUp.hasSliderBeenSeen).toEqual(false)
    })
  })
  describe('SHOW_MARKETING_SLIDEUP', () => {
    it('should set the value of isSliderActive to true', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            isSliderActive: null,
          },
        },
        {
          type: 'SHOW_MARKETING_SLIDEUP',
        }
      )
      expect(state.marketingSlideUp.isSliderActive).toEqual(true)
    })
    it('should set the value of isSliderActive to true if value was false', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            isSliderActive: false,
          },
        },
        {
          type: 'SHOW_MARKETING_SLIDEUP',
        }
      )
      expect(state.marketingSlideUp.isSliderActive).toEqual(true)
    })
  })
  describe('HIDE_MARKETING_SLIDEUP', () => {
    it('should set the value of isSliderActive to false', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            isSliderActive: null,
          },
        },
        {
          type: 'HIDE_MARKETING_SLIDEUP',
        }
      )
      expect(state.marketingSlideUp.isSliderActive).toEqual(false)
    })
    it('should set the value of isSliderActive to false if value was true', () => {
      const state = testReducer(
        {
          marketingSlideUp: {
            isSliderActive: true,
          },
        },
        {
          type: 'HIDE_MARKETING_SLIDEUP',
        }
      )
      expect(state.marketingSlideUp.isSliderActive).toEqual(false)
    })
  })
})
