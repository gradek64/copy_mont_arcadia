import { createStore } from 'redux'
import recommendationsReducer from '../RecommendationsReducer'
import {
  setRecommendations,
  forwardRecommendations,
  backRecommendations,
} from 'src/shared/actions/components/RecommendationsActions'
import { IMAGE_FORMAT } from '../../../constants/amplience'
import deepFreeze from 'deep-freeze'

describe('RecommendationsReducer', () => {
  describe('SET_RECOMMENDATIONS', () => {
    it('should not set recommendations when in an incorrect format', () => {
      const store = createStore(recommendationsReducer)
      expect(store.getState().recommendations).toEqual([])
      store.dispatch(setRecommendations({}))
      expect(store.getState().recommendations).toEqual([])
      store.dispatch(setRecommendations('not-array'))
      expect(store.getState().recommendations).toEqual([])
      store.dispatch(setRecommendations([{ foo: 'bar' }]))
      expect(store.getState().recommendations).toEqual([])
    })

    it('should format recommendations', () => {
      const product1 = {
        img: `https://images.topshop.com/i/TopShop/TS44J82EBLK_M_1.${IMAGE_FORMAT}?$2col$`,
        url:
          'http://www.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=33057&storeId=12556&productId=1708381&langId=-1',
      }
      const product2 = {
        img: `https://images.topshop.com/i/TopShop/TS44J82EBLK_M_2.${IMAGE_FORMAT}?$2col$`,
        url:
          'http://www.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=33057&storeId=12556&productId=2205159&langId=-1',
      }
      const store = createStore(recommendationsReducer)
      const receivedRecommendations = deepFreeze([
        { recs: [product1, product2] },
      ])
      const formattedRecommendations = [
        {
          ...product1,
          productId: 1708381,
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS44J82EBLK_M_1',
          position: 1,
        },
        {
          ...product2,
          productId: 2205159,
          amplienceUrl: 'https://images.topshop.com/i/TopShop/TS44J82EBLK_M_2',
          position: 2,
        },
      ]
      expect(store.getState().recommendations).toEqual([])
      store.dispatch(setRecommendations(receivedRecommendations))
      expect(store.getState().recommendations).toEqual(formattedRecommendations)
    })
  })

  it('FORWARD_RECOMMENDATIONS', () => {
    const store = createStore(recommendationsReducer)
    expect(store.getState().position).toBe(0)
    store.dispatch(forwardRecommendations())
    expect(store.getState().position).toBe(4)
  })

  it('BACK_RECOMMENDATIONS', () => {
    const store = createStore(recommendationsReducer)
    expect(store.getState().position).toBe(0)
    store.dispatch(backRecommendations())
    expect(store.getState().position).toBe(1)
  })
})
