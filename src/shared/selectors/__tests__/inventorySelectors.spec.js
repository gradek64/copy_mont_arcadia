import {
  getActiveProductWithInventory,
  getDCInventoryForProduct,
  getDCStockQuantityForProduct,
  getStoreInventoryForProduct,
  getStoreStockQuantityForProduct,
  getTotalStockQuantityForProduct,
  isStandardDeliveryOnlyProduct,
  checkIfOOS,
} from '../inventorySelectors'

describe('ProductInventory Selectors', () => {
  describe('#getActiveProductWithInventory(state)', () => {
    it('should return null if invalid state', () => {
      expect(getActiveProductWithInventory()).toEqual(null)
      expect(getActiveProductWithInventory({})).toEqual(null)
      expect(getActiveProductWithInventory(null)).toEqual(null)
      expect(getActiveProductWithInventory(undefined)).toEqual(null)
    })
    it('should return null if productDetails or currentProduct are not populated', () => {
      expect(
        getActiveProductWithInventory({
          currentProduct: {},
          productDetail: {},
        })
      ).toEqual(null)
      expect(
        getActiveProductWithInventory({
          currentProduct: null,
          productDetail: {},
        })
      ).toEqual(null)
      expect(
        getActiveProductWithInventory({
          currentProduct: undefined,
          productDetail: {},
        })
      ).toEqual(null)
    })
    it('should return null if there is no active item populated', () => {
      expect(
        getActiveProductWithInventory({
          currentProduct: {},
          productDetail: { activeItem: {} },
        })
      ).toEqual(null)
    })
    it('should return null if catEntryId can not be found', () => {
      expect(
        getActiveProductWithInventory({
          currentProduct: {
            productDataQuantity: {
              SKUs: [{ skuid: '123', partnumber: '00006' }],
            },
          },
          productDetail: {
            activeItem: { sku: '00007' },
          },
        })
      ).toEqual(null)
    })
    it('should map product with its inventory positions', () => {
      const currentProduct = {
        productId: 29931446,
        name: 'Wide Fit Taupe Mallory Boots',
        productDataQuantity: {
          inventoryPositions: [
            { catentryId: '29931450', inventorys: [{}] },
            { catentryId: '29931452', inventorys: [{}], invavls: [{}] },
          ],
          SKUs: [
            { skuid: '29931450', value: '3', partnumber: '262017000922318' },
            { skuid: '29931452', value: '4', partnumber: '262017000922319' },
          ],
        },
      }
      const productDetail = {
        activeItem: { sku: '262017000922319', size: '4' },
        selectedQuantity: 1,
      }

      expect(
        getActiveProductWithInventory({ currentProduct, productDetail })
      ).toMatchSnapshot()
    })
    describe('selector recomputations', () => {
      beforeEach(() => {
        getActiveProductWithInventory()
        getActiveProductWithInventory.resetRecomputations()
      })
      const state = {
        currentProduct: {
          productDataQuantity: {
            SKUs: [{ skuid: '123', partnumber: '00006' }],
          },
        },
        productDetail: {
          activeItem: { sku: '00007' },
        },
      }
      it('should recompute on state change', () => {
        getActiveProductWithInventory(state)
        getActiveProductWithInventory({})
        expect(getActiveProductWithInventory.recomputations()).toBe(2)
      })
      it('should not recompute if currentProduct and productDetail did not change', () => {
        getActiveProductWithInventory(state)
        getActiveProductWithInventory(state)
        getActiveProductWithInventory({ ...state })
        expect(getActiveProductWithInventory.recomputations()).toBe(1)
      })
    })
  })

  describe('#getShoppingBagProductsWithInventory(state)', () => {
    beforeEach(jest.resetModules)

    it('calls getBasketProductsWithInventory', () => {
      jest.doMock('../../lib/ffs/product-inventory-utilities', () => ({
        getBasketProductsWithInventory: jest.fn(),
      }))
      const utils = require('../../lib/ffs/product-inventory-utilities')
      const selectors = require('../inventorySelectors')

      const state = {
        shoppingBag: { bag: ['mocked bag'] },
      }
      selectors.getShoppingBagProductsWithInventory(state)
      expect(utils.getBasketProductsWithInventory).toHaveBeenCalledTimes(1)
      expect(utils.getBasketProductsWithInventory).toHaveBeenCalledWith([
        'mocked bag',
      ])
    })
  })

  describe('#getCheckoutOrderSummaryProductsWithInventory(state)', () => {
    beforeEach(jest.resetModules)

    it('calls getBasketProductsWithInventory', () => {
      jest.doMock('../../lib/ffs/product-inventory-utilities', () => ({
        getBasketProductsWithInventory: jest.fn(),
      }))
      const utils = require('../../lib/ffs/product-inventory-utilities')
      const selectors = require('../inventorySelectors')

      const state = {
        checkout: {
          orderSummary: {
            basket: ['mocked bag'],
          },
        },
      }
      selectors.getCheckoutOrderSummaryProductsWithInventory(state)
      expect(utils.getBasketProductsWithInventory).toHaveBeenCalledTimes(1)
      expect(utils.getBasketProductsWithInventory).toHaveBeenCalledWith([
        'mocked bag',
      ])
    })
  })

  describe('DC and Store inventory/stock selectors for bag products', () => {
    describe('getDCInventoryForProduct', () => {
      it('returns the DC inventory for the provided product', () => {
        expect(
          getDCInventoryForProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
          })
        ).toEqual([{ quantity: 1 }, { quantity: 2 }])
      })
      it('returns empty array if no product provided', () => {
        expect(getDCInventoryForProduct(null)).toEqual([])
      })
      it('returns empty array if inventoryPositions is null', () => {
        expect(
          getDCInventoryForProduct({
            inventoryPositions: null,
          })
        ).toEqual([])
      })
      it('returns empty array if DC inventory is null', () => {
        expect(
          getStoreInventoryForProduct({
            inventoryPositions: {
              inventorys: null,
            },
          })
        ).toEqual([])
      })
      it('returns empty array if product provided has no DC inventory', () => {
        expect(
          getDCInventoryForProduct({
            inventoryPositions: { invavls: [{ quantity: 1 }, { quantity: 2 }] },
          })
        ).toEqual([])
      })
    })

    describe('getDCStockQuantityForProduct', () => {
      it('returns the total DC stock quantity for the provided product', () => {
        expect(
          getDCStockQuantityForProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
          })
        ).toEqual(3)
      })
      it('returns 0 if no product provided', () => {
        expect(getDCStockQuantityForProduct(null)).toEqual(0)
      })
      it('returns 0 if product provided has no inventory', () => {
        expect(
          getDCStockQuantityForProduct({
            inventoryPositions: null,
          })
        ).toEqual(0)
      })
      it('returns 0 if product provided has no DC inventory', () => {
        expect(
          getDCStockQuantityForProduct({
            inventoryPositions: { invavls: [{ quantity: 1 }, { quantity: 2 }] },
          })
        ).toEqual(0)
      })
      it('returns 0 if product provided has no DC stock', () => {
        expect(
          getDCStockQuantityForProduct({
            inventoryPositions: { inventorys: [{ id: 1234 }, { id: 4567 }] },
          })
        ).toEqual(0)
      })
    })

    describe('getStoreInventoryForProduct', () => {
      it('returns the store inventory for the provided product', () => {
        expect(
          getStoreInventoryForProduct({
            inventoryPositions: { invavls: [{ quantity: 1 }, { quantity: 2 }] },
          })
        ).toEqual([{ quantity: 1 }, { quantity: 2 }])
      })
      it('returns empty array if no product provided', () => {
        expect(getStoreInventoryForProduct(null)).toEqual([])
      })
      it('returns empty array if inventoryPositions is null', () => {
        expect(
          getStoreInventoryForProduct({
            inventoryPositions: null,
          })
        ).toEqual([])
      })
      it('returns empty array if store inventory is null', () => {
        expect(
          getStoreInventoryForProduct({
            inventoryPositions: {
              invavls: null,
            },
          })
        ).toEqual([])
      })
      it('returns empty array if product provided has no store inventory', () => {
        expect(
          getStoreInventoryForProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
          })
        ).toEqual([])
      })
    })

    describe('getStoreStockQuantityForProduct', () => {
      it('returns the total store stock quantity for the provided product', () => {
        expect(
          getStoreStockQuantityForProduct({
            inventoryPositions: { invavls: [{ quantity: 1 }, { quantity: 2 }] },
          })
        ).toEqual(3)
      })
      it('returns 0 if no product provided', () => {
        expect(getStoreStockQuantityForProduct(null)).toEqual(0)
      })
      it('returns 0 if product provided has no inventory', () => {
        expect(
          getStoreStockQuantityForProduct({
            inventoryPositions: null,
          })
        ).toEqual(0)
      })
      it('returns 0 if product provided has no store inventory', () => {
        expect(
          getStoreStockQuantityForProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
          })
        ).toEqual(0)
      })
      it('returns 0 if product provided has no store stock', () => {
        expect(
          getStoreStockQuantityForProduct({
            inventoryPositions: { invavls: [{ id: 1234 }, { id: 4567 }] },
          })
        ).toEqual(0)
      })
    })

    describe('getTotalStockQuantityForProduct', () => {
      it('returns the total stock quantity available in DC and store', () => {
        expect(
          getTotalStockQuantityForProduct({
            inventoryPositions: {
              invavls: [{ quantity: 1 }, { quantity: 2 }],
              inventorys: [{ quantity: 3 }, { quantity: 4 }],
            },
          })
        ).toEqual(10)
      })
      it('returns 0 if inventoryPositions is null', () => {
        expect(
          getTotalStockQuantityForProduct({
            inventoryPositions: null,
          })
        ).toEqual(0)
      })
      it('returns 0 if stock and DC inventory is null', () => {
        expect(
          getTotalStockQuantityForProduct({
            inventoryPositions: {
              invavls: null,
              inventorys: null,
            },
          })
        ).toEqual(0)
      })
      it('returns 0 if no stock available', () => {
        expect(
          getTotalStockQuantityForProduct({
            inventoryPositions: {
              invavls: [{ id: 1234 }, { id: 4567 }],
              inventorys: [{ quantity: 0 }, { quantity: null }],
            },
          })
        ).toEqual(0)
      })
    })

    describe('isStandardDeliveryOnlyProduct', () => {
      it('returns true if product is in stock and DC stock quantity is less than the product quantity', () => {
        expect(
          isStandardDeliveryOnlyProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
            quantity: 10,
            inStock: true,
            exceedsAllowedQty: false,
          })
        ).toEqual(true)
      })
      it('returns false if product is in stock and DC stock quantity is greater than the product quantity', () => {
        expect(
          isStandardDeliveryOnlyProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
            quantity: 1,
            inStock: true,
            exceedsAllowedQty: false,
          })
        ).toEqual(false)
      })
      it('returns false if product is in stock and DC stock quantity is equal to the product quantity', () => {
        expect(
          isStandardDeliveryOnlyProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
            quantity: 3,
            inStock: true,
            exceedsAllowedQty: false,
          })
        ).toEqual(false)
      })
      it('returns false if product is out of stock', () => {
        expect(
          isStandardDeliveryOnlyProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
            quantity: 1,
            inStock: false,
            exceedsAllowedQty: false,
          })
        ).toEqual(false)
      })
      it('returns false if product is partially out of stock', () => {
        expect(
          isStandardDeliveryOnlyProduct({
            inventoryPositions: {
              inventorys: [{ quantity: 1 }, { quantity: 2 }],
            },
            quantity: 1,
            inStock: true,
            exceedsAllowedQty: true,
          })
        ).toEqual(false)
      })
    })
  })

  describe('#checkIfOOS', () => {
    it('should return true if stock is loading', () => {
      expect(checkIfOOS()).toEqual(true)
    })

    it('should return true if stock is not loading and there is stock', () => {
      expect(checkIfOOS([{ quantity: 0 }, { quantity: 0 }])).toEqual(true)
    })

    it('should return false if stock is loading and there is no stock', () => {
      expect(checkIfOOS([{ quantity: 1 }, { quantity: 0 }])).toEqual(false)
    })
  })
})
