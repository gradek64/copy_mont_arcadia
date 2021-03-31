import { createStore } from 'redux'
import PlpContainerReducer from '../PlpContainerReducer'

describe('PlpContainerReducer', () => {
  describe('PLP_PROPS_REFRESH', () => {
    it('should set refreshPlp to false', () => {
      const store = createStore(PlpContainerReducer)

      expect(store.getState().refreshPlp).toEqual(true)

      store.dispatch({ type: 'PLP_PROPS_REFRESH' })

      expect(store.getState().refreshPlp).toEqual(false)
    })
  })
})
