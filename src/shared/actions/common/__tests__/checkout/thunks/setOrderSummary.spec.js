import { setOrderSummary } from '../../../checkoutActions'
import { removeCFSIFromOrderSummary } from '../../../../../lib/checkout-utilities/order-summary'

jest.mock('../../../../../lib/checkout-utilities/order-summary', () => ({
  removeCFSIFromOrderSummary: jest.fn((orderSummary) => orderSummary),
}))

jest.mock('../../../espotActions', () => ({
  setOrderSummaryEspots: jest.fn(),
}))

import { setOrderSummaryEspots } from '../../../espotActions'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setOrderSummary(orderSummary)', () => {
  const dispatch = jest.fn()
  const getState = jest.fn()

  const orderSummary = {
    basket: { products: [] },
    deliveryStoreCode: 'TM007',
  }

  it('should set orderSummary and set filters', () => {
    getState.mockReturnValue({
      features: {
        status: {
          FEATURE_PUDO: false,
          FEATURE_CFSI: false,
        },
      },
    })

    const thunk = setOrderSummary(orderSummary)
    thunk(dispatch, getState)
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'FETCH_ORDER_SUMMARY_SUCCESS',
      data: orderSummary,
      persist: true,
    })
    expect(dispatch.mock.calls[1][0].name).toBe('setFiltersThunk')
  })
  it('should apply orderSummary fix for CFSI if feature flag is OFF', () => {
    getState.mockReturnValue({
      features: {
        status: {
          FEATURE_PUDO: false,
          FEATURE_CFSI: false,
        },
      },
    })

    const thunk = setOrderSummary(orderSummary)
    thunk(dispatch, getState)
    expect(removeCFSIFromOrderSummary).toHaveBeenCalledTimes(1)
  })

  describe('setting the orderSummary espot', () => {
    beforeEach(() => {
      const thunk = setOrderSummary(orderSummary)
      thunk(dispatch, getState)
    })
    it('should use the correct espot action', () => {
      expect(setOrderSummaryEspots).toHaveBeenCalled()
      expect(setOrderSummaryEspots).toHaveBeenCalledWith(orderSummary)
    })
  })
})
