import {
  getSkuList,
  getBasketDetails,
  shouldFetchBagStock,
} from '../store-locator-utilities'

const basket = {
  products: [
    { catEntryId: 1234, quantity: 1 },
    { catEntryId: 5678, quantity: 3 },
  ],
  inventoryPositions: {
    item_1: {
      catentryId: '1234',
      partNumber: '0001',
    },
    item_2: {
      catentryId: '5678',
      partNumber: '0002',
    },
  },
}
describe('getSkuList(basket)', () => {
  it('should return empty string if products is undefined', () => {
    expect(getSkuList({})).toBe('')
  })
  it('should return empty string if products is emty', () => {
    expect(getSkuList({ products: [] })).toBe('')
  })
  it('should return a string of comma separated product SKUs', () => {
    expect(getSkuList(basket)).toBe('0001,0002')
  })
})

describe('getBasketDetails(basket)', () => {
  it('should return empty string if products is undefined', () => {
    expect(getBasketDetails({})).toBe('')
  })
  it('should return empty string if products is emty', () => {
    expect(getBasketDetails({ products: [] })).toBe('')
  })
  it('should return a string of product SKU:Quantity pairs', () => {
    expect(getBasketDetails(basket)).toBe('0001:1,0002:3')
  })
})

describe('shouldFetchBagStock(basket, deliveryStoreDetails, storeId)', () => {
  it('should return false if products is not an array', () => {
    expect(shouldFetchBagStock({}, { storeId: 'TS0001' }, 'TS0001')).toBe(false)
    expect(shouldFetchBagStock(null, { storeId: 'TS0001' }, 'TS0001')).toBe(
      false
    )
    expect(
      shouldFetchBagStock(undefined, { storeId: 'TS0001' }, 'TS0001')
    ).toBe(false)
    expect(
      shouldFetchBagStock('product', { storeId: 'TS0001' }, 'TS0001')
    ).toBe(false)
  })
  it('should return false if products is empty', () => {
    expect(
      shouldFetchBagStock({ products: [] }, { storeId: 'TS0001' }, 'TS0001')
    ).toBe(false)
  })
  it('should return false if storeId is undefined', () => {
    expect(
      shouldFetchBagStock(
        { products: undefined },
        { storeId: 'TS0001' },
        undefined
      )
    ).toBe(false)
  })
  it('should return false if any of the params is not valid', () => {
    expect(shouldFetchBagStock()).toBe(false)
  })
  it('should return true if deliveryStoreDetails is empty and (products is non empty array and storeId exists)', () => {
    expect(shouldFetchBagStock(basket, {}, 'TS0001'))
  })
  it('should return true if deliveryStoreDetails.storeId != storeId and (products is non empty array and storeId exists)', () => {
    expect(shouldFetchBagStock(basket, { storeId: 'TS0002' }, 'TS0001'))
  })
  it('should return false if deliveryStoreDetails does not have stockList', () => {
    expect(shouldFetchBagStock(basket, { storeId: 'TS0001' }, 'TS0001')).toBe(
      false
    )
  })
  it('should return true if not all products can be found in the store stockList', () => {
    const params = [
      basket,
      { storeId: 'TM0098', stockList: [{ sku: '0001' }] },
      'TM0098',
    ]
    expect(shouldFetchBagStock(...params)).toBe(true)
  })
  it('should return false if all products are found in the store stockList', () => {
    const params = [
      basket,
      { storeId: 'TM0098', stockList: [{ sku: '0001' }, { sku: '0002' }] },
      'TM0098',
    ]
    expect(shouldFetchBagStock(...params)).toBe(false)
  })
})
