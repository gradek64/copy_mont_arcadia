import deepFreeze from 'deep-freeze'
import { getRecentlyViewedProductsWithAmplienceUrl } from '../recentlyViewedSelectors'

describe('Recently viewed selectors', () => {
  describe('getRecentlyViewedProductsWithAmplienceUrl', () => {
    const state = deepFreeze({
      features: {
        status: {
          FEATURE_USE_AMPLIENCE: false,
        },
      },
      recentlyViewed: [
        {
          imageUrl: 'url',
          amplienceUrl: 'url',
        },
        {
          imageUrl: 'url',
        },
      ],
    })

    it('when amplience feature flag is disabled, return recently viewed products with no change', () => {
      expect(getRecentlyViewedProductsWithAmplienceUrl(state)).toEqual(
        state.recentlyViewed
      )
    })
    it('when amplience feature flag is enabled, return only recently viewed products with amplienceUrl', () => {
      expect(
        getRecentlyViewedProductsWithAmplienceUrl({
          ...state,
          features: {
            status: {
              FEATURE_USE_AMPLIENCE: true,
            },
          },
        })
      ).toEqual([state.recentlyViewed[0]])
    })
  })
})
