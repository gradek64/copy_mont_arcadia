import { pathOr } from 'ramda'
import { getSocialProofConfigForView } from './configSelectors'

const TIME_30_MIN = 1800000
const rootSelector = (state) => state.socialProof || {}

const getTrendingProductCounts = (state, counter) =>
  pathOr(
    null,
    ['socialProof', 'counters', counter, 'trendingProductCounts'],
    state
  )

const getLastFetched = (state, counter) =>
  pathOr(0, ['socialProof', 'counters', counter, 'lastFetched'], state)

export const getImageBannersSocialProof = (state) => rootSelector(state).banners

export const isProductTrending = (state, productId, view) => {
  const { counter, minimumThreshold = 0 } = getSocialProofConfigForView(
    state,
    view
  )
  const trendingProductCounts = getTrendingProductCounts(state, counter)
  return !!(
    trendingProductCounts &&
    trendingProductCounts[productId] >= minimumThreshold
  )
}

export const getSocialProofProductCount = (state, productId, view) => {
  const { counter } = getSocialProofConfigForView(state, view)
  const trendingProductCounts = getTrendingProductCounts(state, counter)

  return trendingProductCounts ? trendingProductCounts[productId] : 0
}

export const hasFetchedTrendingProductsRecently = (state, view) => {
  const { counter } = getSocialProofConfigForView(state, view)
  const lastFetched = getLastFetched(state, counter)
  const currentTimestamp = Date.now()

  return lastFetched > 0 && currentTimestamp - lastFetched < TIME_30_MIN
}

export const hasFetchedSocialProofBanners = (state) => {
  const banners = getImageBannersSocialProof(state)

  return !!banners
}
