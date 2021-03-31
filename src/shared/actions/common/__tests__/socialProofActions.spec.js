import nock from 'nock'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { getRegion } from '../../../selectors/common/configSelectors'
import {
  getSocialProofConfigForView,
  getBrandName,
  getStoreCode,
  getSocialProofBannersCMSPageID,
  getDistinctSocialProofConfigs,
} from '../../../selectors/configSelectors'
import {
  isFeatureSocialProofEnabled,
  isFeatureSocialProofEnabledForView,
} from '../../../selectors/featureSelectors'
import {
  hasFetchedTrendingProductsRecently,
  hasFetchedSocialProofBanners,
} from '../../../selectors/socialProofSelectors'
import correctCMSresponse from '../__mocks__/cmsResponseForSocialProof'

import * as logger from '../../../../client/lib/logger'

import {
  getTrendingProducts,
  incrementSocialProofCounters,
  getSocialProofBanners,
} from '../socialProofActions'

jest.mock('../../../selectors/common/configSelectors')
jest.mock('../../../selectors/configSelectors')
jest.mock('../../../selectors/featureSelectors')
jest.mock('../../../selectors/socialProofSelectors')
jest.mock('../../../../client/lib/logger')

const fakeSocialProofConfig = {
  counter: 'my_fake_counter',
  k: '250',
  timePeriod: 60 * 24,
}

const incorrectCMSResponse = { page: { wrongJson: 'test' } }

describe('social proof actions', () => {
  const middlewares = [thunk]
  // note: mocking selectors rather than providing required state:
  const mockStore = configureMockStore(middlewares)({})

  beforeEach(() => {
    jest.clearAllMocks()
    mockStore.clearActions()
    nock.cleanAll()

    getBrandName.mockReturnValue('topshop')
    getStoreCode.mockReturnValue('tsuk')
    getSocialProofBannersCMSPageID.mockReturnValue('0000163857')
    getRegion.mockReturnValue('uk')
    isFeatureSocialProofEnabled.mockReturnValue(true)
    isFeatureSocialProofEnabledForView.mockReturnValue(true)
    hasFetchedTrendingProductsRecently.mockReturnValue(false)
    hasFetchedSocialProofBanners.mockReturnValue(false)
    getSocialProofConfigForView.mockReturnValue(fakeSocialProofConfig)
  })

  describe('#getTrendingProducts', () => {
    it('should hit the correct endpoint', () => {
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(200, {})

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should format the data and dispatch to store if valid', () => {
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(200, {
          data: [
            ['topshop::my_fake_counter::topk::35389491', '606'],
            ['topshop::my_fake_counter::topk::35389492', '498'],
            ['topshop::my_fake_counter::topk::35389493', '230'],
            ['topshop::my_fake_counter::topk::35389494', '4'],
          ],
        })

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(mockStore.getActions()).toEqual([
          {
            type: 'FETCH_SOCIAL_PROOF_SUCCESS',
            trendingProductCounts: {
              35389491: 606,
              35389492: 498,
              35389493: 230,
              35389494: 4,
            },
            counter: 'my_fake_counter',
          },
        ])
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should log an error if the data is invalid', () => {
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(200, {
          something: 'unexpected',
        })

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(mockStore.getActions()).toHaveLength(0)
        expect(logger.error).toHaveBeenCalledWith(
          'tally',
          expect.objectContaining({
            message: 'Invalid data received from Qubit Tally endpoint',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error fetching Trending Product data from Tally',
          expect.objectContaining({
            message: 'Invalid data received from Qubit Tally endpoint',
          })
        )
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should log an error if the request is unsuccessful', () => {
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(500)

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(mockStore.getActions()).toHaveLength(0)
        expect(logger.error).toHaveBeenCalledWith(
          'tally',
          expect.objectContaining({
            message: 'Internal Server Error',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error fetching Trending Product data from Tally',
          expect.objectContaining({
            message: 'Internal Server Error',
          })
        )
        expect(nockScope.isDone()).toBe(true)
      })
    })

    it('should not fetch the trending products if the social proof feature flag is disabled', () => {
      isFeatureSocialProofEnabledForView.mockReturnValue(false)
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(200, {})

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(nockScope.isDone()).toBe(false)
        expect(mockStore.getActions()).toHaveLength(0)
      })
    })

    it('should not fetch if the trending products have already been fetched', () => {
      hasFetchedTrendingProductsRecently.mockReturnValue(true)
      const nockScope = nock('https://tally-1.qubitproducts.com')
        .get('/tally/topshop-uk/topk/my_fake_counter')
        .query({ k: '250' })
        .reply(200, {})

      return mockStore.dispatch(getTrendingProducts()).then(() => {
        expect(nockScope.isDone()).toBe(false)
        expect(mockStore.getActions()).toHaveLength(0)
      })
    })
  })

  describe('#incrementSocialProofCounters', () => {
    const mockProductId = 5526

    describe('when only one social proof counter is configured', () => {
      beforeEach(() => {
        getDistinctSocialProofConfigs.mockReturnValue([fakeSocialProofConfig])
      })

      it('should hit the correct endpoint and dispatch RESET_SOCIAL_PROOF', () => {
        const nockScope = nock('https://tally-1.qubitproducts.com')
          .post(`/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`)
          .reply(200, { status: 'saved' })

        return mockStore
          .dispatch(incrementSocialProofCounters(mockProductId))
          .then(() => {
            expect(nockScope.isDone()).toBe(true)
            expect(mockStore.getActions()).toEqual([
              { type: 'RESET_SOCIAL_PROOF', counter: 'my_fake_counter' },
            ])
          })
      })

      it('should log an error if the data is invalid', () => {
        const nockScope = nock('https://tally-1.qubitproducts.com')
          .post(`/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`)
          .reply(200, {
            error: 'error',
          })

        return mockStore
          .dispatch(incrementSocialProofCounters(mockProductId))
          .then(() => {
            expect(mockStore.getActions()).toHaveLength(0)
            expect(logger.error).toHaveBeenCalledWith(
              'tally',
              expect.objectContaining({
                message: 'Error posting Trending Product data from Tally',
              })
            )
            expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
              'Error posting Trending Product data from Tally',
              expect.objectContaining({
                message: 'Error posting Trending Product data from Tally',
              })
            )
            expect(nockScope.isDone()).toBe(true)
          })
      })

      it('should not increment the tally counter if the social proof feature flag is disabled', () => {
        isFeatureSocialProofEnabled.mockReturnValue(false)
        const nockScope = nock('https://tally-1.qubitproducts.com')
          .post(`/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`)
          .reply(200, {
            error: 'error',
          })

        return mockStore
          .dispatch(incrementSocialProofCounters(mockProductId))
          .then(() => {
            expect(nockScope.isDone()).toBe(false)
            expect(mockStore.getActions()).toHaveLength(0)
          })
      })

      it('should resolve even if the POST request fails', () => {
        const nockScope = nock('https://tally-1.qubitproducts.com')
          .post(`/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`)
          .reply(400, {
            error: 'no way bro',
          })

        return mockStore
          .dispatch(incrementSocialProofCounters(mockProductId))
          .then(() => {
            expect(nockScope.isDone()).toBe(true)
          })
      })
    })

    describe('when there are multiple social proof counters configured', () => {
      const secondFakeSocialProofConfig = {
        counter: 'my_fake_counter_2',
        timePeriod: 5,
      }
      let nockScope1
      let nockScope2

      beforeEach(() => {
        getDistinctSocialProofConfigs.mockReturnValue([
          fakeSocialProofConfig,
          secondFakeSocialProofConfig,
        ])
      })

      describe('when POST requests are successful', () => {
        beforeEach(() => {
          nockScope1 = nock('https://tally-1.qubitproducts.com')
            .post(
              `/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`
            )
            .reply(200, { status: 'saved' })
          nockScope2 = nock('https://tally-1.qubitproducts.com')
            .post(`/tally/topshop-uk/topk/my_fake_counter_2/${mockProductId}/5`)
            .reply(200, { status: 'saved' })
        })

        it('should make one POST request for each configured counter', () => {
          return mockStore
            .dispatch(incrementSocialProofCounters(mockProductId))
            .then(() => {
              expect(nockScope1.isDone()).toBe(true)
              expect(nockScope2.isDone()).toBe(true)
            })
        })

        it('should reset each configured counter', () => {
          return mockStore
            .dispatch(incrementSocialProofCounters(mockProductId))
            .then(() => {
              expect(mockStore.getActions()).toEqual([
                {
                  type: 'RESET_SOCIAL_PROOF',
                  counter: 'my_fake_counter',
                },
                {
                  type: 'RESET_SOCIAL_PROOF',
                  counter: 'my_fake_counter_2',
                },
              ])
            })
        })
      })

      describe('when POST requests are not successful', () => {
        it('should still resolve', () => {
          nockScope1 = nock('https://tally-1.qubitproducts.com')
            .post(
              `/tally/topshop-uk/topk/my_fake_counter/${mockProductId}/1440`
            )
            .reply(500, { error: 'some pesky internal server error' })
          nockScope2 = nock('https://tally-1.qubitproducts.com')
            .post(`/tally/topshop-uk/topk/my_fake_counter_2/${mockProductId}/5`)
            .reply(500, { error: 'another pesky internal server error' })

          return mockStore
            .dispatch(incrementSocialProofCounters(mockProductId))
            .then(() => {
              expect(nockScope1.isDone()).toBe(true)
              expect(nockScope2.isDone()).toBe(true)
            })
        })
      })
    })
  })

  describe('getSocialProofBanners', () => {
    describe('bannersCMSPageId is present in the configuration', () => {
      describe('At least one of the SocialProof flags is enabled', () => {
        it('fetches banners and dispatch FETCH_SOCIAL_PROOF_BANNERS_SUCCESS with all banners', () => {
          isFeatureSocialProofEnabled.mockReturnValue(true)
          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, correctCMSresponse)

          return mockStore.dispatch(getSocialProofBanners()).then(() => {
            expect(nockScope.isDone()).toBe(true)
            expect(mockStore.getActions()).toEqual([
              {
                type: 'FETCH_SOCIAL_PROOF_BANNERS_SUCCESS',
                plpBanners: {
                  desktop: 'plpSocialProofDesktop',
                  mobile: 'plpSocialProofMobile',
                },
                orderProductBanners: {
                  desktop: 'orderProductSocialProofDesktop',
                  mobile: 'orderProductSocialProofMobile',
                },
              },
            ])
          })
        })

        it('catchs any error if json returned doesnt respect the structure', () => {
          isFeatureSocialProofEnabled.mockReturnValue(true)

          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, incorrectCMSResponse)

          return mockStore.dispatch(getSocialProofBanners()).then(() => {
            expect(nockScope.isDone()).toBe(true)
            expect(logger.error).toHaveBeenCalledWith(
              'SocialProof',
              expect.objectContaining({
                message: 'Error with the JSON structure from ECMC',
              })
            )
            expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
              'Error getting Trending Product banners from ECMC',
              expect.objectContaining({
                message: 'Error with the JSON structure from ECMC',
              })
            )
          })
        })

        it('does not fetch any banners if banners have been already fetched', () => {
          hasFetchedSocialProofBanners.mockReturnValue(true)
          isFeatureSocialProofEnabled.mockReturnValue(true)

          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, correctCMSresponse)

          return mockStore.dispatch(getSocialProofBanners()).catch(() => {
            expect(nockScope.isDone()).toBe(false)
            expect(mockStore.getActions()).toHaveLength(0)
          })
        })
      })

      describe('All SocialProof flags are disabled', () => {
        it('does not fetch any banners', () => {
          getSocialProofBannersCMSPageID.mockReturnValue('0000163857')
          isFeatureSocialProofEnabled.mockReturnValue(false)

          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, correctCMSresponse)

          return mockStore.dispatch(getSocialProofBanners()).catch(() => {
            expect(nockScope.isDone()).toBe(false)
            expect(mockStore.getActions()).toHaveLength(0)
          })
        })
      })
    })

    describe('bannersCMSPageId is not present', () => {
      describe('At least one of the SocialProof flags is enabled', () => {
        it('does not fetch any banners', () => {
          isFeatureSocialProofEnabled.mockReturnValue(true)

          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, correctCMSresponse)

          return mockStore.dispatch(getSocialProofBanners()).catch(() => {
            expect(nockScope.isDone()).toBe(false)
            expect(mockStore.getActions()).toHaveLength(0)
          })
        })
      })

      describe('All SocialProof flags are disabled', () => {
        it('does not fetch any banners', () => {
          isFeatureSocialProofEnabled.mockReturnValue(false)

          const nockScope = nock('http://localhost')
            .get(
              '/cmscontent/page-data/topshop/tsuk?seoUrl=%2Fcms%2Fpages%2Fjson%2Fjson-0000163857%2Fjson-0000163857.json'
            )
            .reply(200, correctCMSresponse)

          return mockStore.dispatch(getSocialProofBanners()).catch(() => {
            expect(nockScope.isDone()).toBe(false)
            expect(mockStore.getActions()).toHaveLength(0)
          })
        })
      })
    })
  })
})
