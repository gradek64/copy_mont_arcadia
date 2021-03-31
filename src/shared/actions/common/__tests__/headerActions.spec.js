import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import { setSticky } from '../headerActions'

describe('Header Actions', () => {
  const initialState = {
    sticky: false,
  }
  const store = mockStoreCreator(initialState)

  describe('`setSticky`', () => {
    beforeEach(() => {
      store.clearActions()
    })
    it('should call UPDATE_STICKY_HEADER=true', () => {
      store.dispatch(setSticky(true))
      const expectedAction = {
        type: 'UPDATE_STICKY_HEADER',
        sticky: true,
      }
      const actualActions = store.getActions()
      expect(actualActions).toHaveLength(1)
      expect(actualActions[0]).toEqual(expectedAction)
    })
    it('should call UPDATE_STICKY_HEADER=false', () => {
      store.dispatch(setSticky(false))
      const expectedAction = {
        type: 'UPDATE_STICKY_HEADER',
        sticky: false,
      }
      const actualActions = store.getActions()
      expect(actualActions).toHaveLength(1)
      expect(actualActions[0]).toEqual(expectedAction)
    })
  })
})
