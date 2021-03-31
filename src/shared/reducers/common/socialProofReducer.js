import createReducer from '../../lib/create-reducer'

const initialState = {
  counters: {},
  banners: null,
}

/**
 * The trendingProductCounts part of state is a mapping for the top k products
 * from productIds to their respective counts
 *
 * You can find the value of k from the site's socialProof configuration - see:
 * src/server/config/brands
 */

export default createReducer(initialState, {
  FETCH_SOCIAL_PROOF_SUCCESS: (state, { trendingProductCounts, counter }) => ({
    ...state,
    counters: {
      ...state.counters,
      [counter]: {
        trendingProductCounts,
        lastFetched: Date.now(),
      },
    },
  }),
  RESET_SOCIAL_PROOF: (state, { counter }) => ({
    ...state,
    counters: {
      ...state.counters,
      [counter]: {
        ...(state.counters[counter] ? state.counters[counter] : {}),
        lastFetched: 0,
      },
    },
  }),
  FETCH_SOCIAL_PROOF_BANNERS_SUCCESS: (
    state,
    { plpBanners, orderProductBanners }
  ) => ({
    ...state,
    banners: {
      plpBanners,
      orderProductBanners,
    },
  }),
})
