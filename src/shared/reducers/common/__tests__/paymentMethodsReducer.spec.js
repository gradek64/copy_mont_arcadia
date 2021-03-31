import testReducer from '../paymentMethodsReducer'

describe('Payment Method Reducer', () => {
  describe('SET_PAYMENT_METHODS', () => {
    it('stores payload in state', () => {
      const newState = testReducer([], {
        type: 'SET_PAYMENT_METHODS',
        payload: ['foo'],
      })

      expect(newState).toMatchSnapshot()
      expect(newState).toEqual(['foo'])
    })
  })
})
