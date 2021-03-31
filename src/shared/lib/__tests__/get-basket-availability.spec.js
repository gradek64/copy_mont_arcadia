global.process.browser = true

import { deliveryDays } from '../get-basket-availability'
import { getBasketProductsWithInventory } from '../ffs/product-inventory-utilities'

jest.mock('../ffs/product-inventory-utilities', () => ({
  getBasketProductsWithInventory: jest.fn(),
}))

describe('deliveryDays', () => {
  const RealDate = Date
  const mockDate = (isoDate) => {
    global.Date = class extends RealDate {
      constructor(...datestring) {
        super()
        if (datestring && datestring.length) {
          return new RealDate(...datestring)
        }
        return new RealDate(isoDate)
      }
    }
  }
  const getStore = () => ({
    name: 'Topshop Oxford Street',
    cfsiPickCutOffTime: '23:59',
    stockList: [{ sku: '602015000890861', stock: 100 }],
    cfsiAvailableOn: ['2017-09-12'],
  })
  const getBasket = () => ({
    products: ['mocked product objects :)'],
  })
  afterEach(() => {
    global.Date = RealDate
  })

  it('gets CFSi day', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      { catEntryId: 21919948, sku: '602015000890861', quantity: 1 },
    ])
    const { CFSiDay } = deliveryDays(getBasket(), getStore())
    expect(CFSiDay).toEqual('today')
  })
  it('CFSi day is empty string if no stock', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      { catEntryId: 21919948, sku: '602015000890861', quantity: 1 },
    ])
    const store = getStore()
    store.stockList[0].stock = 0
    const { CFSiDay } = deliveryDays(getBasket(), store)
    expect(CFSiDay).toEqual('')
  })
  it('gets express delivery day', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
    ])
    const { expressDeliveryDay } = deliveryDays(getBasket(), getStore())
    expect(expressDeliveryDay).toEqual(true)
  })
  it('gets home express delivery day and parcel collect day', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          inventorys: [
            {
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
    ])
    const { homeExpressDeliveryDay, parcelCollectDay } = deliveryDays(
      getBasket(),
      getStore()
    )
    expect(homeExpressDeliveryDay).toEqual(true)
    expect(parcelCollectDay).toEqual(true)
  })
  it('express delivery day is false if one product not available', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 0,
            },
          ],
        },
      },
    ])
    const { expressDeliveryDay } = deliveryDays(getBasket(), getStore())
    expect(expressDeliveryDay).toEqual(false)
  })
  it('home express day is false if one product not available', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 3,
            },
          ],
        },
      },
      {
        catEntryId: 21499230,
        sku: '602015000885582',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 0,
            },
          ],
        },
      },
    ])
    const { homeExpressDeliveryDay } = deliveryDays(getBasket(), getStore())
    expect(homeExpressDeliveryDay).toEqual(false)
  })

  it('parcel collect day is false if one product not available', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          inventorys: [
            {
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 3,
            },
          ],
        },
      },
      {
        catEntryId: 21499230,
        sku: '602015000885582',
        quantity: 1,
        inventoryPositions: {
          inventorys: [
            {
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 0,
            },
          ],
        },
      },
    ])
    const { parcelCollectDay } = deliveryDays(getBasket(), getStore())
    expect(parcelCollectDay).toEqual(false)
  })

  it('CFSi day is in 2 days', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-14'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
    ])
    const store = getStore()
    store.stockList[0] = { stock: 0 }
    const { CFSiDay } = deliveryDays(getBasket(), store)
    expect(CFSiDay).toEqual('Thursday')
  })

  it('CFSi day is set with 3 items in bag and middle item not available', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
      {
        catEntryId: 21499230,
        sku: '602015000885582',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-15'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
      {
        catEntryId: 21919980,
        sku: '602015000890890',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
    ])
    const store = getStore()
    store.stockList[1] = { sku: '602015000885582', stock: 0 }
    store.stockList[2] = { sku: '602015000890890', stock: 100 }
    const { CFSiDay } = deliveryDays(getBasket(), store)
    expect(CFSiDay).toEqual('Friday')
  })

  it('CFSi day is 8 days away if one item is not available till then', () => {
    mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')
    getBasketProductsWithInventory.mockImplementationOnce(() => [
      {
        catEntryId: 21919948,
        sku: '602015000890861',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-12'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
      {
        catEntryId: 21499230,
        sku: '602015000885582',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-15'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
      {
        catEntryId: 21919980,
        sku: '602015000890890',
        quantity: 1,
        inventoryPositions: {
          invavls: [
            {
              stlocIdentifier: 'EXPRESS',
              expressdates: ['2017-09-18'],
              cutofftime: '2359',
              quantity: 99,
            },
          ],
        },
      },
    ])
    const store = getStore()
    store.stockList[1] = { sku: '602015000890861', stock: 100 }
    store.stockList[2] = { sku: '602015000885582', stock: 0 }
    store.stockList[3] = { sku: '602015000890890', stock: 0 }
    const { CFSiDay } = deliveryDays(getBasket(), store)
    expect(CFSiDay).toEqual('Monday')
  })
})
