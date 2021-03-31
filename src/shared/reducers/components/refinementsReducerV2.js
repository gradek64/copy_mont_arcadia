import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    seoUrlCache: null,
    isLoadingRefinements: false,
  },
  {
    CACHE_SEOURL: (state, { seoUrl = null }) => ({
      ...state,
      seoUrlCache: seoUrl,
    }),
    CLEAR_SEOURL: (state) => ({
      ...state,
      seoUrlCache: null,
    }),
    LOADING_REFINEMENTS: (state, { isLoading = false }) => ({
      ...state,
      isLoadingRefinements: isLoading,
    }),
  }
)
