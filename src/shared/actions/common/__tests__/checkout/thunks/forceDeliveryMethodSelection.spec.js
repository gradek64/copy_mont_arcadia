import { forceDeliveryMethodSelection } from '../../../checkoutActions'
import {
  getSelectedDeliveryMethod,
  shouldUpdateOrderSummaryStore,
} from '../../../../../selectors/checkoutSelectors'

jest.mock('../../../../../selectors/checkoutSelectors', () => ({
  isStoreWithParcel: jest.fn(),
  getSelectedDeliveryMethod: jest.fn(),
  shouldUpdateOrderSummaryStore: jest.fn(),
  getCheckoutOrderSummaryBasket: jest.fn(),
  getCheckoutOrderSummaryShippingCountry: jest.fn(),
}))

jest.mock('../../../../../selectors/ddpSelectors', () => ({
  isDDPStandaloneOrderCompleted: jest.fn(),
}))

describe(forceDeliveryMethodSelection.name, () => {
  const dispatch = jest.fn()
  const getState = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const executeThunk = (actionThunk) => actionThunk(dispatch, getState)

  it('should not update orderSummary delivery options if there is a selectedDeliveryMethod or orderSummary store does not need to be updated', () => {
    getSelectedDeliveryMethod.mockImplementation(() => ({
      deliveryType: 'STORE_EXPRESS',
      selected: true,
    }))
    shouldUpdateOrderSummaryStore.mockImplementation(() => false)

    executeThunk(forceDeliveryMethodSelection())
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FORCE_DELIVERY_METHOD_SELECTION',
    })
  })
  it('should update OrderSummary delivery options if there is not selectedDeliveryMethod', () => {
    getSelectedDeliveryMethod.mockImplementation(() => null)
    shouldUpdateOrderSummaryStore.mockImplementation(() => false)

    executeThunk(forceDeliveryMethodSelection())
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FORCE_DELIVERY_METHOD_SELECTION',
    })
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[1][0].name).toBe('updateDeliveryOptionsThunk')
  })
  it('should update OrderSummary delivery options if orderSummary store needs to be updated', () => {
    getSelectedDeliveryMethod.mockImplementation(() => ({
      deliveryType: 'STORE_EXPRESS',
      selected: true,
    }))
    shouldUpdateOrderSummaryStore.mockImplementation(() => true)

    executeThunk(forceDeliveryMethodSelection())
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FORCE_DELIVERY_METHOD_SELECTION',
    })
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[1][0].name).toBe('updateDeliveryOptionsThunk')
  })
})
