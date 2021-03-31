import reducer from '../klarnaReducer'
import {
  setKlarnaClientToken,
  resetKlarna,
  setKlarnaPaymentMethodCategories,
  blockKlarnaUpdate,
  blockKlarnaPayment,
} from '../../../actions/common/klarnaActions'

describe('klarnaReducer', () => {
  const initialState = {
    clientToken: '',
    paymentMethodCategories: [],
    isKlarnaUpdateBlocked: false,
    isKlarnaPaymentBlocked: false,
  }
  const param = 'mock-param'
  const actionCreators = [
    [
      setKlarnaClientToken,
      {
        type: 'SET_KLARNA_CLIENT_TOKEN',
        clientToken: param,
      },
    ],
    [
      setKlarnaPaymentMethodCategories,
      {
        type: 'SET_KLARNA_PAYMENT_METHOD_CATEGORIES',
        paymentMethodCategories: param,
      },
    ],
    [
      blockKlarnaUpdate,
      {
        type: 'BLOCK_KLARNA_UPDATE',
        isKlarnaUpdateBlocked: param,
      },
    ],
    [
      blockKlarnaPayment,
      {
        type: 'BLOCK_KLARNA_PAYMENT',
        isKlarnaPaymentBlocked: param,
      },
    ],
    [
      resetKlarna,
      {
        type: 'RESET_KLARNA',
      },
    ],
  ]

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  actionCreators.forEach(([actionCreator, action]) => {
    const { type, ...rest } = action

    it(`should handle ${type}`, () => {
      const state = initialState
      const expectedState = {
        ...state,
        ...rest,
      }
      expect(reducer(initialState, actionCreator(param))).toEqual(expectedState)
    })
  })

  it('should handle PRE_CACHE_RESET', () => {
    const expectedState = initialState

    expect(reducer(undefined, { type: 'PRE_CACHE_RESET' })).toEqual(
      expectedState
    )
  })
})
