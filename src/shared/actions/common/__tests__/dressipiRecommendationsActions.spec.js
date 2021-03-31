import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import nock from 'nock'
import { fetchDressipiRelatedRecommendations } from '../dressipiRecommendationsActions'
import dressipiRelatedRecommendationsResponse from '../../common/__mocks__/dressipiRelatedRecommendations'

describe('Recommendation Actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)({
    config: { region: 'uk' },
  })

  describe('fetchDressipiRelatedRecommendations', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockStore.clearActions()
      nock.cleanAll()
      process.env.DRESSIPI_ENVIRONMENT = 'https://dressipi-staging'
    })

    const url =
      '/api/items/1234/related?methods=similar_items&locale=UK&language=UK&exclude_source_garment=true&max_similar_items=5&garment_format=detailed&identifier_type=product-code'

    it('should hit the correct endpoint and transform the dressipi repsponse if successful and set the dressipi event data', () => {
      const nockScope = nock(`${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`)
        .get(url)
        .reply(200, dressipiRelatedRecommendationsResponse)

      return mockStore
        .dispatch(
          fetchDressipiRelatedRecommendations(
            1234,
            'https://dressipi-staging.topshop.com'
          )
        )
        .then(() => {
          expect(nockScope.isDone()).toBe(true)
          expect(mockStore.getActions()[0]).toEqual({
            type: 'SET_RELATED_RECOMMENDATIONS',
            dressipiRecommendations: [
              {
                name: 'Mid Blue Wash Mom Tapered Jeans',
                productId: 34103649,
                img:
                  'https://images.topshop.com/i/TopShop/TS02M04QMDT_M_1.jpg?$2col$',
                amplienceUrl:
                  'https://images.topshop.com/i/TopShop/TS02M04QMDT_M_1',
                salePrice: '40.00',
                unitPrice: '40.00',
                productCode: 'TS02M04QMDT',
                id: 4660703,
                position: 0,
                url:
                  '/en/tsuk/product/shoes-430/sandals-5388227/darwin-black-block-sandals-9718344',
              },
              {
                name: 'Mid Blue Worker Mom Tapered Jeans',
                productId: 36001980,
                img:
                  'https://images.topshop.com/i/TopShop/TS02M03RMDT_M_1.jpg?$2col$',
                amplienceUrl:
                  'https://images.topshop.com/i/TopShop/TS02M03RMDT_M_1',
                salePrice: '46.00',
                unitPrice: '46.00',
                productCode: 'TS02M03RMDT',
                id: 4793490,
                position: 1,
                url:
                  '/en/tsuk/product/shoes-430/sandals-5388227/darwin-black-block-sandals-9718344',
              },
            ],
          })

          expect(mockStore.getActions()[1]).toEqual({
            type: 'SET_DRESSIPI_EVENT_DATA',
            contentId: '5e5e6d8301d9795c6b610898',
            eventId: '5e5e6d8301d9795c6b610897',
          })
        })
    })

    it('should clear the recommendations and the dressipi event data if response is unsucessful', () => {
      const nockScope = nock('https://dressipi-staging.topshop.com')
        .get(url)
        .reply(422, {})

      return mockStore
        .dispatch(
          fetchDressipiRelatedRecommendations(
            1234,
            'https://dressipi-staging.topshop.com',
            'staging'
          )
        )
        .then(() => {
          expect(nockScope.isDone()).toBe(true)
          expect(mockStore.getActions()[0]).toEqual({
            type: 'CLEAR_RELATED_RECOMMENDATIONS',
          })
          expect(mockStore.getActions()[1]).toEqual({
            type: 'CLEAR_DRESSIPI_EVENT_DATA',
          })
        })
    })
  })
})
