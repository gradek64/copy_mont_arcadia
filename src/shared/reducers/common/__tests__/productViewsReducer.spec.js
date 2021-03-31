import { createStore } from 'redux'
import productViewsReducer from '../productViewsReducer'
import { PRODUCT, OUTFIT } from '../../../constants/productImageTypes'

describe('productViewsReducer', () => {
  describe('SET_DEFAULT_VIEW', () => {
    it('set the default view if not initialised', () => {
      const store = createStore(productViewsReducer)
      store.dispatch({
        type: 'SET_DEFAULT_VIEW',
        viewType: PRODUCT,
      })
      expect(store.getState().defaultViewType).toEqual(PRODUCT)
    })
    it('does nothing if the default view is already initialised', () => {
      const store = createStore(productViewsReducer)
      store.dispatch({
        type: 'SET_DEFAULT_VIEW',
        viewType: OUTFIT,
      })
      store.dispatch({
        type: 'SET_DEFAULT_VIEW',
        viewType: PRODUCT,
      })
      expect(store.getState().defaultViewType).toEqual(OUTFIT)
    })
  })
  describe('SELECT_VIEW', () => {
    it('set the selectedViewType to PRODUCT', () => {
      const store = createStore(productViewsReducer)
      store.dispatch({
        type: 'SELECT_VIEW',
        viewType: PRODUCT,
      })
      expect(store.getState().selectedViewType).toEqual(PRODUCT)
    })
    it('set the selectedViewType to OUTFIT', () => {
      const store = createStore(productViewsReducer)
      store.dispatch({
        type: 'SELECT_VIEW',
        viewType: OUTFIT,
      })
      expect(store.getState().selectedViewType).toEqual(OUTFIT)
    })
  })
})
