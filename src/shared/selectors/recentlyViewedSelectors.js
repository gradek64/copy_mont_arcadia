import { createSelector } from 'reselect'
import { isAmplienceFeatureEnabled } from './featureSelectors'

export const rootSelector = (state) => state.recentlyViewed || []

export const getRecentlyViewedProductsWithAmplienceUrl = createSelector(
  rootSelector,
  isAmplienceFeatureEnabled,
  (recentlyViewed, isAmplienceEnabled) =>
    isAmplienceEnabled
      ? recentlyViewed.filter(({ amplienceUrl }) => Boolean(amplienceUrl))
      : recentlyViewed
)
