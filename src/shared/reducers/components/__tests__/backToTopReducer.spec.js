import testReducer from '../backToTopReducer'
import { getMockStoreWithInitialReduxState } from '../../../../../test/unit/helpers/get-redux-mock-store'
import { UPDATE_LOCATION } from 'react-router-redux'

describe('Back To Top Reducer', () => {
  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.backToTop.isVisible).toBe(false)
  })
  describe('`UPDATE_LOCATION`', () => {
    it('should change `isVisible` to false', () => {
      expect(
        testReducer(
          { isVisible: true },
          {
            type: UPDATE_LOCATION,
          }
        )
      ).toEqual({
        isVisible: false,
      })
    })
  })
  describe('SET_BACK_TO_TOP_VISIBLE', () => {
    it('should change `isVisible` to passed value', () => {
      expect(
        testReducer(
          { isVisible: false },
          {
            type: 'SET_BACK_TO_TOP_VISIBLE',
            isVisible: true,
          }
        )
      ).toEqual({
        isVisible: true,
      })
    })
  })
})
