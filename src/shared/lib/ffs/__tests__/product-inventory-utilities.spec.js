import {
  getCatEntryId,
  getInventoryPositions,
  getBasketProductsWithInventory,
} from '../product-inventory-utilities'

describe('product-inventory-utilities', () => {
  describe('getCatEntryId(sku, productDataQuantity)', () => {
    it('returns null if catEntryId is not found', () => {
      expect(getCatEntryId()).toBe(null)
      expect(getCatEntryId('0007', undefined)).toBe(null)
      expect(getCatEntryId('0007', null)).toBe(null)
      expect(getCatEntryId('0007', {})).toBe(null)
      expect(
        getCatEntryId('0007', {
          SKUs: [{ partnumber: '0007' }],
        })
      ).toBe(null)
    })
    it('returns catEntryId if sku product is found', () => {
      expect(
        getCatEntryId('0007', {
          SKUs: [{ skuid: '1234', partnumber: '0007' }],
        })
      ).toBe('1234')
    })
  })

  describe('getInventoryPositions(catEntryId, productDataQuantity)', () => {
    it('returns null if inventoryPositions are not found', () => {
      expect(getInventoryPositions()).toBe(null)
      expect(getInventoryPositions(1234, null)).toBe(null)
      expect(getInventoryPositions(1234, undefined)).toBe(null)
      expect(getInventoryPositions(1234, {})).toBe(null)
      expect(
        getInventoryPositions(1234, {
          inventoryPositions: [{ catentryId: 2345 }],
        })
      ).toBe(null)
    })
    it('returns inventoryPositions matching catEntryId is found', () => {
      const productDataQuantity = {
        inventoryPositions: [{ catentryId: 1234, inventorys: [{}] }],
      }
      expect(getInventoryPositions(1234, productDataQuantity)).toBe(
        productDataQuantity.inventoryPositions[0]
      )
    })
  })

  describe('getBasketProductsWithInventory(basket)', () => {
    const products = [
      {
        productId: 21919934,
        catEntryId: 21919948,
        size: 'L',
        name: '**Suedette Tuxedo Dress by Love',
        quantity: 1,
      },
      {
        productId: 21499229,
        catEntryId: 21499230,
        size: 'ONE',
        name: '**Krusty Print Backpack by Skinnydip',
        quantity: 1,
      },
      {
        productId: 21919934,
        catEntryId: 21919940,
        size: 'XS',
        name: '**Suedette Tuxedo Dress by Love',
        quantity: 2,
      },
    ]

    const inventoryPositions = {
      item_1: {
        partNumber: '602015000890861',
        catentryId: '21919948',
        inventorys: [{ quantity: 1000 }],
      },
      item_2: {
        partNumber: '602015000885582',
        catentryId: '21499230',
        inventorys: [{}],
      },
      item_3: {
        partNumber: '602015000890858',
        catentryId: '21919940',
        invavls: [{}],
      },
    }

    it('should return empty array if basket is not valid', () => {
      expect(getBasketProductsWithInventory()).toEqual([])
      expect(getBasketProductsWithInventory({})).toEqual([])
      expect(getBasketProductsWithInventory(null)).toEqual([])
    })

    it('should return empty array if products is empty', () => {
      expect(getBasketProductsWithInventory({ products: [] })).toEqual([])
    })

    it('should return identical product list if inventoryPositions is not defined', () => {
      expect(getBasketProductsWithInventory({ products })).toEqual(products)
    })

    it('should return product list with mapped SKU and inventoryPositions', () => {
      const basket = { products, inventoryPositions }
      expect(getBasketProductsWithInventory(basket)).toMatchSnapshot()
    })
  })
})
