import refinementsReducerV2 from '../refinementsReducerV2'

describe('Refinements Reducer Version 2', () => {
  const seoUrl =
    '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'
  describe('CACHE_SEOURL', () => {
    it('should update cached seoUrl', () => {
      const action = {
        type: 'CACHE_SEOURL',
        seoUrl,
      }

      const { seoUrlCache } = refinementsReducerV2({}, action)
      expect(seoUrlCache).toEqual(seoUrl)
    })
  })

  describe('CLEAR_SEOURL', () => {
    it('should clear cached seoUrl', () => {
      const action = {
        type: 'CLEAR_SEOURL',
      }

      const { seoUrlCache } = refinementsReducerV2(
        { seoUrlCache: seoUrl },
        action
      )
      expect(seoUrlCache).toEqual(null)
    })
  })

  describe('LOADING_REFINEMENTS', () => {
    it('should set loading state to true when passed true', () => {
      const action = {
        type: 'LOADING_REFINEMENTS',
        isLoading: true,
      }

      const { isLoadingRefinements } = refinementsReducerV2({}, action)
      expect(isLoadingRefinements).toEqual(true)
    })
    it('should set loading state to false when passed false', () => {
      const action = {
        type: 'LOADING_REFINEMENTS',
        isLoading: false,
      }

      const { isLoadingRefinements } = refinementsReducerV2({}, action)
      expect(isLoadingRefinements).toEqual(false)
    })
  })
})
