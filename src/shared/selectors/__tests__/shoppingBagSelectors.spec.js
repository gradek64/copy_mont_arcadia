import {
  getShoppingBag,
  getShoppingBagOrderId,
  getShoppingBagTotalItems,
  isShoppingBagEmpty,
  isShoppingBagLoading,
  getShoppingBagProducts,
  bagContainsDDPProduct,
  bagContainsOnlyDDPProduct,
  getShoppingBagTotal,
  getShoppingBagSubTotal,
  isZeroValueBag,
  bagContainsOutOfStockProduct,
  bagContainsPartiallyOutOfStockProduct,
  bagContainsStandardDeliveryOnlyProduct,
  isBasketTotalCoveredByGiftCards,
  calculateBagDiscount,
  getDeliveryMessageThresholds,
} from '../shoppingBagSelectors'
import {
  getShoppingBagProductsWithInventory,
  isStandardDeliveryOnlyProduct,
} from '../inventorySelectors'

jest.mock('../inventorySelectors', () => ({
  getShoppingBagProductsWithInventory: jest.fn(),
  isStandardDeliveryOnlyProduct: jest.fn(),
}))

describe('Shopping Bag Selectors', () => {
  describe('getShoppingBagOrderId', () => {
    it('should return the orderId', () => {
      expect(
        getShoppingBagOrderId({
          shoppingBag: {
            bag: {
              orderId: 1234,
            },
          },
        })
      ).toBe(1234)
    })
    it('should return undefined if the orderId is not defined', () => {
      expect(getShoppingBagOrderId({})).toBeUndefined()
    })
  })

  describe('getShoppingBag', () => {
    it('should return the bag', () => {
      expect(
        getShoppingBag({
          shoppingBag: {
            bag: {
              orderId: 1234,
            },
          },
        })
      ).toEqual({ orderId: 1234 })
    })
    it('should return {} if the bag is not defined', () => {
      expect(getShoppingBag({})).toEqual({})
    })
  })
  describe('getShoppingBagTotal', () => {
    it('should return the total of the bag', () => {
      expect(
        getShoppingBagTotal({
          shoppingBag: {
            bag: {
              total: 1234,
            },
          },
        })
      ).toEqual(1234)
    })
    it('should return the numerical total of the bag', () => {
      expect(
        getShoppingBagTotal({
          shoppingBag: {
            bag: {
              total: '1234',
            },
          },
        })
      ).toEqual(1234)
    })
    it('should return 0 if the total is not defined', () => {
      expect(getShoppingBagTotal({})).toEqual(0)
    })
  })
  describe('getShoppingBagSubTotal', () => {
    it('should return the subtotal if there', () => {
      expect(
        getShoppingBagSubTotal({
          shoppingBag: {
            bag: {
              subTotal: '11',
            },
          },
        })
      ).toEqual(11)
    })
    it('should return 0 if the subTotal is not defined', () => {
      expect(getShoppingBagSubTotal({})).toEqual(0)
    })
  })
  describe('isZeroValueBag', () => {
    it('should return true if bag is 0', () => {
      expect(
        isZeroValueBag({
          shoppingBag: {
            bag: {
              total: 0,
            },
          },
        })
      ).toEqual(true)
    })
    it('should return false if bag is > 0', () => {
      expect(
        isZeroValueBag({
          shoppingBag: {
            bag: {
              total: 0.01,
            },
          },
        })
      ).toEqual(false)
    })
  })
  describe('getShoppingBagProducts', () => {
    it('should return the products in bag', () => {
      const products = ['product 1', 'product 2']
      expect(
        getShoppingBagProducts({
          shoppingBag: {
            bag: {
              products,
            },
          },
        })
      ).toEqual(products)
    })
    it('should return [] if the bag has no products', () => {
      expect(getShoppingBagProducts({})).toEqual([])
    })
  })
  describe('isShoppingBagEmpty', () => {
    it('should return true if no products in bag', () => {
      expect(
        isShoppingBagEmpty({
          shoppingBag: {
            totalItems: 0,
          },
        })
      ).toBe(true)
    })
    it('should return false if some products in bag', () => {
      expect(
        isShoppingBagEmpty({
          shoppingBag: {
            totalItems: 2,
          },
        })
      ).toBe(false)
    })
  })
  describe('getShoppingBagTotalItems', () => {
    it('should return 5 if there are products in bag', () => {
      expect(
        getShoppingBagTotalItems({
          shoppingBag: {
            totalItems: 5,
          },
        })
      ).toBe(5)
    })
    it(`should return undefined if totalItems doesn't exists in bag`, () => {
      expect(
        getShoppingBagTotalItems({
          shoppingBag: {},
        })
      ).toBeUndefined()
    })
  })
  describe('isShoppingBagLoading', () => {
    it('should return true if loading', () => {
      expect(
        isShoppingBagLoading({
          shoppingBag: {
            loadingShoppingBag: true,
          },
        })
      ).toBe(true)
    })
    it('should return false if not loading', () => {
      expect(
        isShoppingBagLoading({
          shoppingBag: {
            loadingShoppingBag: false,
          },
        })
      ).toBe(false)
    })
  })
  describe('bagContainsDDPProduct', () => {
    it('should return true if bag contains at least one DDP product', () => {
      const products = [{ isDDPProduct: true }, { isDDPProduct: false }]
      expect(
        bagContainsDDPProduct({
          shoppingBag: {
            bag: {
              products,
            },
          },
        })
      ).toBe(true)
    })

    it('should return false if bag does not contain any DDP product', () => {
      const products = [{ isDDPProduct: false }]
      expect(
        bagContainsDDPProduct({
          shoppingBag: {
            bag: products,
          },
        })
      ).toBe(false)
    })
  })

  describe('bagContainsOnlyDDPProduct', () => {
    it('should return true if bag contains one and only DDP product', () => {
      expect(
        bagContainsOnlyDDPProduct({
          shoppingBag: {
            totalItems: 1,
            bag: {
              products: [{ isDDPProduct: true }],
            },
          },
        })
      ).toBe(true)
    })

    it('should return false if bag contains a DDP product and there are other items in my bag', () => {
      expect(
        bagContainsOnlyDDPProduct({
          shoppingBag: {
            totalItems: 2,
            bag: {
              products: [{ isDDPProduct: true }, { isDDPProduct: false }],
            },
          },
        })
      ).toBe(false)
    })

    it('should return false if bag does not contain a DDP product and there is an item in my bag', () => {
      expect(
        bagContainsOnlyDDPProduct({
          shoppingBag: {
            totalItems: 1,
            bag: {
              products: [{ isDDPProduct: false }],
            },
          },
        })
      ).toBe(false)
    })

    it('should return false if bag does not contain any item and there is a DDP product in my bag', () => {
      expect(
        bagContainsOnlyDDPProduct({
          shoppingBag: {
            totalItems: 0,
            bag: {
              products: [],
            },
          },
        })
      ).toBe(false)
    })
  })

  describe('bagContainsOutOfStockProduct', () => {
    it('returns true if bag contains out of stock product', () => {
      expect(
        bagContainsOutOfStockProduct({
          shoppingBag: {
            bag: {
              products: [{ inStock: true }, { inStock: false }],
            },
          },
        })
      ).toBe(true)
    })
    it('returns false if bag does not contain out of stock product', () => {
      expect(
        bagContainsOutOfStockProduct({
          shoppingBag: {
            bag: {
              products: [{ inStock: true }, { inStock: true }],
            },
          },
        })
      ).toBe(false)
    })
  })

  describe('bagContainsPartiallyOutOfStockProduct', () => {
    it('returns true if bag contains product which exceeds allowed quantity', () => {
      expect(
        bagContainsPartiallyOutOfStockProduct({
          shoppingBag: {
            totalItems: 0,
            bag: {
              products: [
                { exceedsAllowedQty: undefined },
                { exceedsAllowedQty: false },
                { exceedsAllowedQty: true },
              ],
            },
          },
        })
      ).toBe(true)
    })
    it('returns false if bag does not contains product which exceeds allowed quantity', () => {
      expect(
        bagContainsPartiallyOutOfStockProduct({
          shoppingBag: {
            bag: {
              products: [
                { exceedsAllowedQty: undefined },
                { exceedsAllowedQty: false },
              ],
            },
          },
        })
      ).toBe(false)
    })
  })

  describe('bagContainsStandardDeliveryOnlyProduct', () => {
    const shoppingBag = {}

    it('returns true if bag contains product which is only available for standard delivery', () => {
      const mockProducts = [{}]
      getShoppingBagProductsWithInventory.mockReturnValueOnce(mockProducts)
      isStandardDeliveryOnlyProduct.mockReturnValueOnce(true)

      expect(bagContainsStandardDeliveryOnlyProduct({ shoppingBag })).toBe(true)
    })
    it('returns false if bag contains product which is not only available for standard delivery', () => {
      const mockProducts = [{}]
      getShoppingBagProductsWithInventory.mockReturnValueOnce(mockProducts)
      isStandardDeliveryOnlyProduct.mockReturnValueOnce(false)

      expect(bagContainsStandardDeliveryOnlyProduct({ shoppingBag })).toBe(
        false
      )
    })
    it('returns false if no product inventory', () => {
      const mockProducts = null
      getShoppingBagProductsWithInventory.mockReturnValueOnce(mockProducts)

      expect(bagContainsStandardDeliveryOnlyProduct({ shoppingBag })).toBe(
        false
      )
    })
  })

  describe('isBasketTotalCoveredByGiftCards', () => {
    it('should return false if `isOrderCoveredByGiftCards` property is not defined or null', () => {
      expect(isBasketTotalCoveredByGiftCards({})).toBe(false)
      expect(
        isBasketTotalCoveredByGiftCards({
          shoppingBag: { bag: { isOrderCoveredByGiftCards: null } },
        })
      ).toBe(false)
    })
    it('should return the value of `isOrderCoveredByGiftCards` if defined', () => {
      expect(
        isBasketTotalCoveredByGiftCards({
          shoppingBag: { bag: { isOrderCoveredByGiftCards: true } },
        })
      ).toBe(true)
    })
  })

  describe('calculateBagDiscount', () => {
    it('should return 0 if no discounts', () => {
      expect(calculateBagDiscount([])).toBe(0)
    })
    it('should return 0 if not an array', () => {
      expect(calculateBagDiscount({})).toBe(0)
    })
    it('should return 11 [sum of discounts]', () => {
      const bagDiscountsState = {
        shoppingBag: {
          bag: {
            discounts: [
              { label: 'test promotions code discount', value: '2.00' },
              { label: 'another promotions code discount', value: '9.00' },
            ],
          },
        },
      }
      expect(calculateBagDiscount(bagDiscountsState)).toBe(11)
    })
  })

  describe('getDeliveryMessageThresholds', () => {
    it('returns deliveryMessageThresholds', () => {
      const deliveryMessageThresholds = {
        nudgeMessageThreshold: 30.0,
        standardDeliveryThreshold: 50.0,
      }

      const shoppingBagState = {
        shoppingBag: {
          bag: {
            discounts: [
              { label: 'test promotions code discount', value: '2.00' },
              { label: 'another promotions code discount', value: '9.00' },
            ],
            deliveryMessageThresholds,
          },
        },
      }

      expect(getDeliveryMessageThresholds(shoppingBagState)).toEqual(
        deliveryMessageThresholds
      )
    })
  })

  it('return an empty object if deliveryMessageThresholds is not present', () => {
    const shoppingBagState = {
      shoppingBag: {
        bag: {
          discounts: [
            { label: 'test promotions code discount', value: '2.00' },
            { label: 'another promotions code discount', value: '9.00' },
          ],
        },
      },
    }

    expect(getDeliveryMessageThresholds(shoppingBagState)).toEqual({})
  })
})
