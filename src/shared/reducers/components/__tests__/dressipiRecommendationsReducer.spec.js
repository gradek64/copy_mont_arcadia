import testReducer from '../dressipiRecommendationsReducer'

describe('RecommendationsReducer', () => {
  const initialState = {
    dressipiRecommendations: [],
    position: 0,
    sizeLimit: 4,
    eventId: null,
    contentId: null,
  }

  const mockRecommendations = [
    {
      name: 'Mid Blue Wash Mom Tapered Jeans',
      productId: 34103649,
      img: 'https://images.topshop.com/i/TopShop/TS02M04QMDT_M_1.jpg?$2col$',
      amplienceUrl: 'https://images.topshop.com/i/TopShop/TS02M04QMDT_M_1',
      prices: {
        GBP: {
          salePrice: 40,
          unitPrice: 40,
        },
      },
      productCode: 'TS02M04QMDT',
      id: 4660703,
      position: 0,
    },
    {
      name: 'Mid Blue Worker Mom Tapered Jeans',
      productId: 36001980,
      img: 'https://images.topshop.com/i/TopShop/TS02M03RMDT_M_1.jpg?$2col$',
      amplienceUrl: 'https://images.topshop.com/i/TopShop/TS02M03RMDT_M_1',
      prices: {
        GBP: {
          salePrice: 46,
          unitPrice: 46,
        },
      },
      productCode: 'TS02M03RMDT',
      id: 4793490,
      position: 1,
    },
  ]

  describe('SET_RELATED_RECOMMENDATIONS', () => {
    it('should update the recommendations with the array specified', () => {
      const newState = testReducer(initialState, {
        type: 'SET_RELATED_RECOMMENDATIONS',
        dressipiRecommendations: mockRecommendations,
      })
      expect(newState.dressipiRecommendations).toEqual(mockRecommendations)
    })
  })

  describe('SET_DRESSIPI_EVENT_DATA', () => {
    it('should update the contentId and the eventId', () => {
      const newState = testReducer(initialState, {
        type: 'SET_DRESSIPI_EVENT_DATA',
        contentId: '1234',
        eventId: '4321',
      })
      expect(newState.contentId).toEqual('1234')
      expect(newState.eventId).toEqual('4321')
    })
  })

  describe('CLEAR_DRESSIPI_EVENT_DATA', () => {
    it('should contentId and the eventId to null', () => {
      const newState = testReducer(initialState, {
        type: 'CLEAR_DRESSIPI_EVENT_DATA',
      })
      expect(newState.contentId).toBe(null)
      expect(newState.eventId).toBe(null)
    })
  })

  describe('CLEAR_RELATED_RECOMMENDATIONS', () => {
    it('should clear the recommendations setting to empty array', () => {
      const newState = testReducer(initialState, {
        type: 'CLEAR_RELATED_RECOMMENDATIONS',
      })
      expect(newState.dressipiRecommendations).toEqual([])
    })
  })
})
