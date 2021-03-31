import applePayReducer from '../applePayReducer'

describe('ApplePayReducer', () => {
  describe('SET_APPLE_PAY_AVAILABILITY', () => {
    describe('canMakePayments is true', () => {
      it('sets canMakePayments to true', () => {
        const reducer = applePayReducer(
          {},
          {
            type: 'SET_APPLE_PAY_AVAILABILITY',
            canMakePayments: true,
          }
        )
        expect(reducer).toEqual({ canMakePayments: true })
      })
    })

    describe('canMakePayments is false', () => {
      it('sets canMakePayments to false', () => {
        const reducer = applePayReducer(
          {},
          {
            type: 'SET_APPLE_PAY_AVAILABILITY',
            canMakePayments: false,
          }
        )
        expect(reducer).toEqual({ canMakePayments: false })
      })
    })
  })

  describe('SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD', () => {
    describe('canMakePaymentsWithActiveCard is true', () => {
      it('sets canMakePaymentsWithActiveCard to true', () => {
        const reducer = applePayReducer(
          {},
          {
            type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
            canMakePaymentsWithActiveCard: true,
          }
        )
        expect(reducer).toEqual({ canMakePaymentsWithActiveCard: true })
      })
    })

    describe('canMakePaymentsWithActiveCard is false', () => {
      it('sets canMakePaymentsWithActiveCard to false', () => {
        const reducer = applePayReducer(
          {},
          {
            type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
            canMakePaymentsWithActiveCard: false,
          }
        )
        expect(reducer).toEqual({ canMakePaymentsWithActiveCard: false })
      })
    })
  })
})
