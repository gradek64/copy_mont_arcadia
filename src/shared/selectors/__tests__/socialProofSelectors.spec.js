import mockdate from 'mockdate'
import {
  isProductTrending,
  hasFetchedTrendingProductsRecently,
  getSocialProofProductCount,
  hasFetchedSocialProofBanners,
  getImageBannersSocialProof,
} from '../socialProofSelectors'

const pdpCounter = 'pdp_counter'
const defaultCounter = 'default_counter'
const minimumThreshold = 3
const productClicks = 100000
const orderProductBanner = 'orderProductBannerUrlMock'
const plpBanner = 'plpBannerUrlMock'

const config = {
  socialProof: {
    views: {
      PDP: {
        counter: pdpCounter,
        minimumThreshold,
      },
      default: {
        counter: defaultCounter,
        minimumThreshold,
      },
    },
  },
}

const unFetchedState = {
  config,
  socialProof: {
    counters: {},
    banners: null,
  },
}

describe('social proof selectors', () => {
  describe('#isProductTrending', () => {
    describe('when the specified view has its own config', () => {
      describe('and the corresponding counter state has been fetched', () => {
        const state = {
          config,
          socialProof: {
            counters: {
              [pdpCounter]: {
                trendingProductCounts: {
                  12345: productClicks,
                  12222: minimumThreshold - 1,
                  12000: minimumThreshold,
                },
                lastFetched: 1560163788474,
              },
            },
          },
        }

        it('should return true if the productId is in the trendingProductCounts mapping and the counter is greater than the minimum threshold', () => {
          expect(isProductTrending(state, 12345, 'PDP')).toBe(true)
        })

        it('should return true if the productId is in the trendingProductCounts mapping and the counter is equal to the minimum threshold', () => {
          expect(isProductTrending(state, 12000, 'PDP')).toBe(true)
        })

        it('should return false if the productId is not in the trendingProductCounts mapping', () => {
          expect(isProductTrending(state, 12345, 'PDP')).toBe(true)
        })

        it('should return false if the productId is in trendingProductCounts and counter is less than the mimimumThreshold', () => {
          expect(isProductTrending(state, 12222, 'PDP')).toBe(false)
        })
      })

      describe('but the corresponding counter state has not been fetched yet', () => {
        const state = {
          config,
          socialProof: {},
        }

        it('should return false', () => {
          expect(isProductTrending(state, 12345, 'PDP')).toBe(false)
        })
      })
    })

    describe('when the specified view does not have its own config but there is a default config', () => {
      const state = {
        config,
        socialProof: {
          counters: {
            [defaultCounter]: {
              trendingProductCounts: {
                12345: productClicks,
              },
              lastFetched: 1560163788474,
            },
          },
        },
      }

      it('should fall back to using the default config and counter state', () => {
        expect(isProductTrending(state, 12345, 'PLP')).toBe(true)
        expect(isProductTrending(state, 11111, 'PLP')).toBe(false)
      })
    })
  })

  describe('#hasFetchedTrendingProductsRecently', () => {
    describe('when the specified view has its own config', () => {
      describe('and the corresponding counter state has been fetched', () => {
        const createStateWithLastFetched = (lastFetched) => ({
          config,
          socialProof: {
            counters: {
              [pdpCounter]: {
                lastFetched,
              },
            },
          },
        })

        it('should return false if the lastFetched is equal to 0', () => {
          const state = createStateWithLastFetched(0)
          expect(hasFetchedTrendingProductsRecently(state, 'PDP')).toBe(false)
        })

        it('should return true if trendingProductCounts have been fetched in the last 30minutes', () => {
          const lastFetched = new Date(
            'Tue Sep 12 2017 13:59:10 GMT+0100 (BST)'
          ).getTime()
          const state = createStateWithLastFetched(lastFetched)

          mockdate.set('Tue Sep 12 2017 14:12:12 GMT+0100 (BST)')

          expect(hasFetchedTrendingProductsRecently(state, 'PDP')).toBe(true)
        })

        it('should return false if trendingProductCounts have been fetched more then 30 minutes ago or lastfetched is 0', () => {
          const lastFetched = new Date(
            'Tue Sep 15 2018 13:00:10 GMT+0100 (BST)'
          ).getTime()
          const state = createStateWithLastFetched(lastFetched)

          mockdate.set('Tue Sep 15 2018 13:35:10 GMT+0100 (BST)')

          expect(hasFetchedTrendingProductsRecently(state, 'PDP')).toBe(false)
        })
      })

      describe('but the corresponding state has not been fetched yet', () => {
        const state = {
          config,
          socialProof: {},
        }

        it('should return false', () => {
          expect(hasFetchedTrendingProductsRecently(state, 'PDP')).toBe(false)
        })
      })
    })

    describe('when the specified view does not have its own config there is a default config', () => {
      it('should fall back to using the default config and counter state', () => {
        const lastFetched = new Date(
          'Tue Sep 12 2017 13:59:10 GMT+0100 (BST)'
        ).getTime()

        const state = {
          config,
          socialProof: {
            counters: {
              [defaultCounter]: {
                lastFetched,
              },
            },
          },
        }

        mockdate.set('Tue Sep 12 2017 14:12:12 GMT+0100 (BST)')

        expect(hasFetchedTrendingProductsRecently(state, 'PLP')).toBe(true)
      })
    })
  })

  describe('#getSocialProofProductCount', () => {
    const state = {
      config,
      socialProof: {
        counters: {
          [pdpCounter]: {
            trendingProductCounts: {
              12345: 444,
            },
          },
          [defaultCounter]: {
            trendingProductCounts: {
              12345: 555,
            },
          },
        },
      },
    }

    describe('when the specified view has its own config', () => {
      describe('and the corresponding counter state has been fetched', () => {
        it('should return the number of clicks if the product is trendingProductCounts', () => {
          expect(getSocialProofProductCount(state, 12345, 'PDP')).toBe(444)
        })

        it('should return undefined if the preduct is not in trendingProductCounts', () => {
          expect(getSocialProofProductCount(state, 1, 'PDP')).toBe(undefined)
        })
      })

      describe('but the corresponding counter state has not been fetched', () => {
        it('should return 0', () => {
          const unfetchedState = {
            ...state,
            socialProof: {
              ...state.socialProof,
              counters: {
                [pdpCounter]: undefined,
              },
            },
          }
          expect(getSocialProofProductCount(unfetchedState, 12345, 'PDP')).toBe(
            0
          )
        })
      })
    })

    describe('when the specified view does not have its own config', () => {
      it('should fall back to using the default config', () => {
        expect(getSocialProofProductCount(state, 12345, 'PLP')).toBe(555)
      })
    })
  })

  const fetchedBannersState = {
    config,
    socialProof: {
      counters: {},
      banners: {
        plpBanner,
        orderProductBanner,
      },
    },
  }

  describe('#hasFetchedSocialProofBanners', () => {
    it('returns true if banners have already been fetched', () => {
      expect(hasFetchedSocialProofBanners(fetchedBannersState)).toEqual(true)
    })

    it('returns false if banners have not been fetched', () => {
      expect(hasFetchedSocialProofBanners(unFetchedState)).toEqual(false)
    })
  })

  describe('#getImageBannersSocialProof', () => {
    it('returns image banners if present', () => {
      expect(getImageBannersSocialProof(fetchedBannersState)).toEqual({
        plpBanner,
        orderProductBanner,
      })
    })

    it('returns null if not present', () => {
      expect(getImageBannersSocialProof(unFetchedState)).toEqual(null)
    })
  })
})
