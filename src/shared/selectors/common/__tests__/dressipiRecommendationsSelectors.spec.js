import {
  getDressipiRelatedRecommendations,
  getDressipiEventId,
  getDressipiContentId,
} from '../dressipiRecommendationsSelectors'

describe('Recommendations Selectors', () => {
  const dressipiRelatedRecommendationsMockState = {
    dressipiRecommendations: {
      eventId: 'ABC123',
      contentId: 'ABC321',
      dressipiRecommendations: [
        {
          title: 'Grey Clean Panel Hoodie',
          productId: 36738885,
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1.jpg?$2col$',
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1',
          prices: {
            GBP: {
              salePrice: 20,
              unitPrice: 20,
            },
          },
          product_code: 'TS09H07SGYM',
          id: 4845634,
          position: 0,
        },
        {
          title: 'Lilac Panel Relaxed Hoodie',
          productId: 36793240,
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1.jpg?$2col$',
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1',
          prices: {
            GBP: {
              salePrice: 20,
              unitPrice: 20,
            },
          },
          product_code: 'TS09H07SLIL',
          id: 4905498,
          position: 1,
        },
      ],
      position: 0,
      sizeLimit: 7,
    },
  }
  describe('Related Recommendations', () => {
    it('should return recommendations', () => {
      expect(
        getDressipiRelatedRecommendations(
          dressipiRelatedRecommendationsMockState
        )
      ).toEqual([
        {
          title: 'Grey Clean Panel Hoodie',
          productId: 36738885,
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1.jpg?$2col$',
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1',
          prices: {
            GBP: {
              salePrice: 20,
              unitPrice: 20,
            },
          },
          product_code: 'TS09H07SGYM',
          id: 4845634,
          position: 0,
        },
        {
          title: 'Lilac Panel Relaxed Hoodie',
          productId: 36793240,
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1.jpg?$2col$',
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1',
          prices: {
            GBP: {
              salePrice: 20,
              unitPrice: 20,
            },
          },
          product_code: 'TS09H07SLIL',
          id: 4905498,
          position: 1,
        },
      ])
    })
    it('should return empty object if location is not defined', () => {
      expect(getDressipiRelatedRecommendations({})).toEqual({})
    })
  })

  describe('getDressipiEventId', () => {
    it('should return the eventId', () => {
      expect(getDressipiEventId(dressipiRelatedRecommendationsMockState)).toBe(
        'ABC123'
      )
    })

    it('should return null if the eventId is not defined', () => {
      expect(getDressipiEventId({})).toBe(null)
    })
  })

  describe('getDressipiContentId', () => {
    it('should return the contentId', () => {
      expect(
        getDressipiContentId(dressipiRelatedRecommendationsMockState)
      ).toBe('ABC321')
    })

    it('should return null if the contentId is not defined', () => {
      expect(getDressipiContentId({})).toBe(null)
    })
  })
})
