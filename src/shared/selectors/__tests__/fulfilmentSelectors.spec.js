import { isCFSIAvailable } from '../fulfilmentSelectors'
import {
  getActiveProductWithInventory,
  getCheckoutOrderSummaryProductsWithInventory,
} from '../inventorySelectors'
import { isCFSIToday } from '../../lib/get-delivery-days/isCfsi'

jest.mock('../inventorySelectors', () => ({
  getActiveProductWithInventory: jest.fn(),
  getCheckoutOrderSummaryProductsWithInventory: jest.fn(),
}))

jest.mock('../../lib/get-delivery-days/isCfsi.js', () => ({
  isCFSIToday: jest.fn(),
}))

const mockedProducts = [{ productId: 123 }, { productId: 234 }]

const mockedState = {
  checkout: {
    orderSummary: {
      basket: {
        products: mockedProducts,
      },
    },
  },
}

const mockedStore = {
  storeId: 'TS0873',
}

describe('@isCFSIAvailable(state, storeDetails, storeLocatorType)', () => {
  beforeEach(jest.clearAllMocks)

  describe('when storeLocatorType is collectFromStore', () => {
    it('returns false if there are no products', () => {
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce([])
      expect(
        isCFSIAvailable(
          { ...mockedState },
          { ...mockedStore },
          'collectFromStore'
        )
      ).toBe(false)
    })
    it('returns false if basket is not CFS Immediately eligible', () => {
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce(
        mockedProducts
      )
      isCFSIToday.mockReturnValueOnce(true)
      isCFSIToday.mockReturnValueOnce(false)
      expect(
        isCFSIAvailable(
          { ...mockedState },
          { ...mockedStore },
          'collectFromStore'
        )
      ).toBe(false)
    })
    it('returns true if basket is CFS Immediately eligible', () => {
      getCheckoutOrderSummaryProductsWithInventory.mockReturnValueOnce(
        mockedProducts
      )
      isCFSIToday.mockReturnValueOnce(true)
      isCFSIToday.mockReturnValueOnce(true)
      expect(
        isCFSIAvailable(
          { ...mockedState },
          { ...mockedStore },
          'collectFromStore'
        )
      ).toBe(true)
    })
  })
  describe('when storeLocatorType is findInStore', () => {
    it('should return true if activeProduct is CFS Immediately eligible', () => {
      getActiveProductWithInventory.mockReturnValue({ productId: 123 })
      isCFSIToday.mockReturnValueOnce(true)
      expect(isCFSIAvailable(mockedState, mockedStore, 'findInStore')).toBe(
        true
      )
    })
  })
})
