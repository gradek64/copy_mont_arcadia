import {
  mockStoreCreator,
  getMockStoreWithInitialReduxState,
} from '../get-redux-mock-store'

describe('redux-mock-store creators', () => {
  describe('mockStoreCreator', () => {
    it('should create a new store given an initialState', () => {
      const initialState = {
        prop1: {
          prop2: '',
        },
        prop3: false,
        prop4: {
          prop5: {
            prop6: 'prop6',
          },
        },
      }
      const store = mockStoreCreator(initialState)
      expect(store.getState()).toEqual(initialState)
    })
  })
  describe('getMockStoreWithInitialState', () => {
    it('should get mock store with default real redux store merged with initialState', () => {
      const initialState = {
        account: {
          user: {
            name: 'José',
          },
          forgetPwd: true,
        },
      }
      const store = getMockStoreWithInitialReduxState(initialState)
      expect(store.getState()).toEqual(
        expect.objectContaining({
          account: expect.objectContaining({
            user: {
              name: 'José',
            },
            forgetPwd: true,
          }),
        })
      )
    })
  })
})
