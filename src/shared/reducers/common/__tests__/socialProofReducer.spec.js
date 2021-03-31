import testReducer from '../socialProofReducer'

const initialState = {
  counters: {
    myFakeCounter1: {
      trendingProductCounts: {
        12343: 10,
      },
      lastFetched: 123456789,
    },
    myFakeCounter2: {
      trendingProductCounts: {
        12343: 1,
      },
      lastFetched: 123455000,
    },
  },
  banners: 'mockBanners',
}

describe('scoialProofReducer', () => {
  describe('FETCH_SOCIAL_PROOF_SUCCESS', () => {
    it('should update the trending products for the counter specified', () => {
      const pidToCountMap = { 567: 1 }
      const newState = testReducer(initialState, {
        type: 'FETCH_SOCIAL_PROOF_SUCCESS',
        trendingProductCounts: pidToCountMap,
        counter: 'myFakeCounter1',
      })

      expect(newState.counters.myFakeCounter1.trendingProductCounts).toEqual(
        pidToCountMap
      )
    })

    it('should not update the trending products for other counters', () => {
      const pidToCountMap = { 567: 1 }
      const newState = testReducer(initialState, {
        type: 'FETCH_SOCIAL_PROOF_SUCCESS',
        trendingProductCounts: pidToCountMap,
        counter: 'myFakeCounter1',
      })

      expect(
        newState.counters.myFakeCounter2.trendingProductCounts
      ).not.toEqual(pidToCountMap)
      expect(newState.counters.myFakeCounter2.trendingProductCounts).toEqual(
        initialState.counters.myFakeCounter2.trendingProductCounts
      )
    })
  })

  describe('RESET_SOCIAL_PROOF', () => {
    it('should reset the state for the counter specified', () => {
      const newState = testReducer(initialState, {
        type: 'RESET_SOCIAL_PROOF',
        counter: 'myFakeCounter1',
      })

      expect(newState.counters.myFakeCounter1.lastFetched).toBe(0)
    })

    it('should not reset the trendingProductCounts', () => {
      const newState = testReducer(initialState, {
        type: 'RESET_SOCIAL_PROOF',
        counter: 'myFakeCounter1',
      })

      expect(newState.counters.myFakeCounter1.trendingProductCounts).toBe(
        initialState.counters.myFakeCounter1.trendingProductCounts
      )
    })

    it('should not reset the state for any other counters', () => {
      const newState = testReducer(initialState, {
        type: 'RESET_SOCIAL_PROOF',
        counter: 'myFakeCounter1',
      })

      expect(newState.counters.myFakeCounter2.lastFetched).not.toBe(0)
      expect(newState.counters.myFakeCounter2.lastFetched).toBe(
        initialState.counters.myFakeCounter2.lastFetched
      )
    })

    it('handles the case where the specified counter does not yet have any state', () => {
      const newState = testReducer(initialState, {
        type: 'RESET_SOCIAL_PROOF',
        counter: 'not_yet_existing_counter',
      })
      expect(newState.counters.not_yet_existing_counter).toEqual({
        lastFetched: 0,
      })
    })

    it('doesnt reset banners', () => {
      const newState = testReducer(initialState, {
        type: 'RESET_SOCIAL_PROOF',
      })

      expect(newState.banners).toEqual('mockBanners')
    })
  })

  describe('FETCH_SOCIAL_PROOF_BANNERS_SUCCESS', () => {
    it('update state with banners', () => {
      const plpBannersMock = { test: true }
      const orderProductBannersMock = { anotherTest: true }
      const newState = testReducer(initialState, {
        type: 'FETCH_SOCIAL_PROOF_BANNERS_SUCCESS',
        plpBanners: plpBannersMock,
        orderProductBanners: orderProductBannersMock,
      })

      expect(newState.banners.plpBanners).toEqual(plpBannersMock)
      expect(newState.banners.orderProductBanners).toEqual(
        orderProductBannersMock
      )
    })
  })
})
