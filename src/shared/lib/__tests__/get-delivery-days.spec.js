global.process.browser = true

import * as timeDateUtils from '../get-delivery-days/utils'
import * as getDeliveryDay from '../get-delivery-days/get-delivery-day'
import * as getDCday from '../get-delivery-days/get-dc-deliveryday'
import * as cfsi from '../get-delivery-days/isCfsi'
import * as getStock from '../get-delivery-days/get-stock-list'
import * as getExpress from '../get-delivery-days/get-express'
import * as getFulfil from '../get-delivery-days/get-fulfilments'
// const brandName = 'Topshop'
// const name = 'Oxford Circus'
// const selectedStore = {
//   brandName,
//   name,
//   cfsiAvailableOn: new Date().toDateString(),
//   stockList: [{ stock: 1 }]
// }
//
// const milliseconds = new Date().getTime() + (1 * 60 * 60 * 1000)
// // 1 hour from now
// const hours = new Date(milliseconds).getHours()
// selectedStore.cfsiPickCutOffTime = `${hours}:30`

describe('get-delivery-days', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('generateCutoffTimestamp(date, cutoffTime)', () => {
    it('should return the timestamp of the cutofftime', () => {
      const date = new Date(2017, 8, 10)
      const timestamp = new Date(2017, 8, 10, 18, 0).getTime()
      expect(timeDateUtils.generateCutoffTimestamp(date, '18:00')).toBe(
        timestamp
      )
    })

    it('should return the timestamp of the cutofftime if the cutofftime is an array', () => {
      const date = new Date(2017, 8, 10)
      const timestamp = new Date(2017, 8, 10, 18, 0).getTime()
      expect(timeDateUtils.generateCutoffTimestamp(date, ['18', '00'])).toBe(
        timestamp
      )
    })
  })

  describe('isTimePast(cutoffTime)', () => {
    const RealDate = Date

    function mockDate(...isoDate) {
      global.Date = class {
        constructor(...dateArgs) {
          if (Array.isArray(dateArgs) && dateArgs.length) {
            return new RealDate(...dateArgs)
          }
          return new RealDate(...isoDate)
        }
      }
    }

    afterEach(() => {
      global.Date = RealDate
    })

    it('should return true when the time has passed', () => {
      mockDate(2017, 11, 25, 13, 0)

      expect(timeDateUtils.isTimePast('12:00')).toEqual(true)
    })
    it('should return false when the time has not passed', () => {
      mockDate(2017, 11, 25, 13, 0)

      expect(timeDateUtils.isTimePast('15:00')).toEqual(false)
    })
    it('should return true when cutofftime not given', () => {
      mockDate(2017, 11, 25, 13, 0)

      expect(timeDateUtils.isTimePast()).toEqual(true)
    })
  })

  describe('formatDateAsYMD(date)', () => {
    it('sould format the date as yyyy-MM-DD', () => {
      const date = new Date(2017, 7, 23)

      expect(timeDateUtils.formatDateAsYMD(date)).toBe('2017-08-23')
    })
  })

  describe('getNumberOfDaysFromNow(day)', () => {
    const RealDate = Date
    const mockDate = (isoDate) => {
      global.Date = class extends RealDate {
        constructor() {
          super()
          return new RealDate(isoDate)
        }
      }
    }

    afterEach(() => {
      global.Date = RealDate
    })

    it('return 0 if today', () => {
      const days = timeDateUtils.getNumberOfDaysFromNow('today')

      expect(days).toEqual(0)
    })

    it('day is 2 days from now', () => {
      mockDate('Tue Sep 12 2017 13:59:10 GMT+0100 (BST)')

      const days = timeDateUtils.getNumberOfDaysFromNow('Thursday')

      expect(days).toEqual(2)
    })
  })

  describe('getStockFromStockList(sku, store)', () => {
    it('should return the stock when stock for the sku exists', () => {
      const store = {
        stockList: [
          {
            sku: 'wrongSKU',
            stock: 5,
          },
          {
            sku: 'correctSKU',
            stock: 11,
          },
        ],
      }
      expect(getStock.getStockFromStockList('correctSKU', store)).toBe(11)
    })

    it('should return falsey if stockList does not exist', () => {
      const store = {}
      expect(getStock.getStockFromStockList('correctSKU', store)).toBeFalsy()
    })

    it('should return falsey if stockList is not an array', () => {
      const store = {
        stockList: {},
      }
      expect(getStock.getStockFromStockList('correctSKU', store)).toBeFalsy()
    })

    it('should return falsey when stock object for sku does not exist', () => {
      const store = {
        stockList: [
          {
            sku: 'wrongSKU',
            stock: 5,
          },
        ],
      }
      expect(getStock.getStockFromStockList('correctSKU', store)).toBeFalsy()
    })

    it('should return falsey if stock prop does not exist in the stock object', () => {
      const store = {
        stockList: [
          {
            sku: 'wrongSKU',
            stock: 5,
          },
          {
            sku: 'correctSKU',
          },
        ],
      }
      expect(getStock.getStockFromStockList('correctSKU', store)).toBeFalsy()
    })

    it('should return falsey if sku is undefined', () => {
      const store = {
        stockList: [
          {
            sku: 'wrongSKU',
            stock: 5,
          },
          {
            sku: 'correctSKU',
            stock: 11,
          },
        ],
      }
      expect(getStock.getStockFromStockList(undefined, store)).toBeFalsy()
    })
  })

  describe('getDeliveryDay(inventory, quantity)', () => {
    beforeAll(() => {
      jest.spyOn(timeDateUtils, 'isTimePast').mockReturnValue(false)
    })

    afterAll(() => {
      timeDateUtils.isTimePast.mockRestore()
    })

    it('should return an empty string if inventory expressdates does not exist', () => {
      const inventory = { expressdates: [], quantity: 10, cutofftime: '1800' }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('')
    })

    it('it should return an empty string if inventory.quantity is undefined', () => {
      const inventory = {
        expressdates: ['2017-09-12', '2017-09-13'],
        cutofftime: '1800',
      }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('')
    })

    it('should return an empty if inventory stockQuantity < quantity', () => {
      const inventory = {
        expressdates: ['2017-09-12', '2017-09-13'],
        quantity: 4,
        cutofftime: '1800',
      }
      expect(getDeliveryDay.getDeliveryDay(inventory, 5)).toBe('')
    })

    it('should return 2nd day when inventory expressdates exists and quantity is higher no cutoff ', () => {
      const inventory = {
        expressdates: ['2017-09-12', '2017-09-13'],
        quantity: 10,
      }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('Wednesday')
    })

    it('should return an empty string when inventory expressdates exists, but no 2nd day and quantity is higher and no cutoff ', () => {
      const inventory = { expressdates: ['2017-09-12'], quantity: 10 }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('')
    })

    it('should return 2nd day when inventory expressdates exists and quantity is higher and cutoff time has past ', () => {
      timeDateUtils.isTimePast.mockReturnValueOnce(true)

      const inventory = {
        expressdates: ['2017-09-12', '2017-09-13'],
        quantity: 10,
        cutofftime: '0',
      }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('Wednesday')
    })

    it('should return 1st day when inventory expressdates exists and quantity is higher and cutoff time has not past ', () => {
      timeDateUtils.isTimePast.mockReturnValueOnce(false)
      const inventory = {
        expressdates: ['2017-09-12', '2017-09-13'],
        quantity: 10,
        cutofftime: `2359`,
      }
      expect(getDeliveryDay.getDeliveryDay(inventory, 1)).toBe('Tuesday')
    })
  })

  describe('getDCDeliveryDay(product)', () => {
    beforeAll(() => {
      jest
        .spyOn(getDeliveryDay, 'getDeliveryDay')
        .mockReturnValue('deliveryDay')
    })

    it('should return empty string if inventoryPositions does not contain key inventorys', () => {
      expect(getDCday.getDCDeliveryDay({})).toBe('')
    })

    it('should return empty string if inventoryPositions.inventorys is not an array', () => {
      expect(
        getDCday.getDCDeliveryDay({
          inventoryPositions: { inventorys: {} },
          quantity: 1,
        })
      ).toBe('')
    })

    it('should return empty string if inventoryPositions.inventorys is an empty array', () => {
      expect(
        getDCday.getDCDeliveryDay({
          inventoryPositions: { inventorys: [] },
          quantity: 1,
        })
      ).toBe('')
    })

    it('should call getDeliveryDay when inventoryPpositions.inventorys is non empty array', () => {
      const inventoryPositions = {
        inventorys: [{ expressdates: [], quantity: 10, cutofftime: '1800' }],
      }

      expect(
        getDCday.getDCDeliveryDay({
          inventoryPositions,
          quantity: 1,
        })
      ).toBe('deliveryDay')
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenCalledTimes(1)
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenLastCalledWith(
        inventoryPositions.inventorys[0],
        1
      )
    })
  })

  describe('getExpressDeliveryDay(product)', () => {
    beforeAll(() => {
      jest
        .spyOn(getDeliveryDay, 'getDeliveryDay')
        .mockReturnValue('deliveryDay')
    })

    it('should return empty string if inventoryPositions does not contain key invavls', () => {
      expect(getExpress.getExpressDeliveryDay({})).toBe('')
    })

    it('should return empty string if inventoryPositions.invavls is not an array', () => {
      expect(
        getExpress.getExpressDeliveryDay({
          inventoryPositions: { invavls: {} },
        })
      ).toBe('')
    })

    it('should return empty string if inventoryPositions.invavls is an empty array', () => {
      expect(
        getExpress.getExpressDeliveryDay({
          inventoryPositions: { invavls: [] },
        })
      ).toBe('')
    })

    it('should return empty string if inventoryPositions.invavls is an array of object where no prop has stlocIdentifier with "EXPRESS"', () => {
      const inventoryPositions = { invavls: [{ stlocIdentifier: 'STANDARD' }] }
      expect(
        getExpress.getExpressDeliveryDay({
          inventoryPositions,
          quantity: 1,
        })
      ).toBe('')
      expect(getDeliveryDay.getDeliveryDay).not.toHaveBeenCalled()
    })

    it('should call getDeliveryDay if inventoryPositions.invavls is an array of object where some prop has stlocIdentifier with "EXPRESS"', () => {
      const express = { stlocIdentifier: 'EXPRESS' }
      const inventoryPositions = {
        invavls: [{ stlocIdentifier: 'STANDARD' }, express],
      }
      expect(
        getExpress.getExpressDeliveryDay({
          inventoryPositions,
          quantity: 1,
        })
      ).toBe('deliveryDay')
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenCalledTimes(1)
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenLastCalledWith(express, 1)
    })

    it('should call getDeliveryDay if inventoryPositions.invavls is an array of object where some prop has stlocIdentifier with "EXPRESS-INTERNATIONAL"', () => {
      const express = { stlocIdentifier: 'EXPRESS-INTERNATIONAL' }
      const inventoryPositions = {
        invavls: [{ stlocIdentifier: 'STANDARD' }, express],
      }
      expect(
        getExpress.getExpressDeliveryDay({
          inventoryPositions,
          quantity: 1,
        })
      ).toBe('deliveryDay')
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenCalledTimes(1)
      expect(getDeliveryDay.getDeliveryDay).toHaveBeenLastCalledWith(express, 1)
    })
  })

  describe('isCFSIToday(product, store)', () => {
    const product = {
      quantity: 2,
      sku: 'correctSKU',
    }

    beforeAll(() => {
      jest
        .spyOn(timeDateUtils, 'getCurrentDate')
        .mockReturnValue(new Date(2017, 7, 23, 13, 0))
      jest.spyOn(timeDateUtils, 'isTimePast').mockReturnValue(false)
      jest
        .spyOn(getStock, 'getStockFromStockList')
        .mockImplementation(jest.fn())
    })

    it('should return false if product does not contain sku or quantity but store is provided', () => {
      const store = {
        basketInStock: true,
        cfsiAvailableOn: '',
        stock: 3,
      }
      expect(cfsi.isCFSIToday(null, store)).toBe(false)
      expect(cfsi.isCFSIToday(undefined, store)).toBe(false)
      expect(cfsi.isCFSIToday({}, store)).toBe(false)
      expect(cfsi.isCFSIToday(false, store)).toBe(false)
      expect(
        cfsi.isCFSIToday({ quantity: undefined, sku: undefined }, store)
      ).toBe(false)
    })

    it('should return false if product is provided but there is no store', () => {
      expect(cfsi.isCFSIToday(product, null)).toBe(false)
      expect(cfsi.isCFSIToday(product, false)).toBe(false)
      expect(cfsi.isCFSIToday(product, undefined)).toBe(false)
      expect(cfsi.isCFSIToday(product, 'store')).toBe(false)
    })

    it('should return false when basketInStock is true but there is no cfsiAvailableOn dates', () => {
      const store = {
        basketInStock: true,
        cfsiAvailableOn: '',
        stock: 3,
      }

      expect(cfsi.isCFSIToday(product, store)).toBe(false)
    })

    it('should return true when cutoff time is after 1pm, available on 2017-08-23 and store.stock available and quantity < stock (true condition)', () => {
      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '18:00',
        stock: 3,
      }

      expect(cfsi.isCFSIToday(product, store)).toBe(true)
    })

    it('should return false when not available on 2017-08-23', () => {
      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-24,2017-08-25',
        cfsiPickCutOffTime: '18:00',
        stock: 3,
      }

      expect(cfsi.isCFSIToday(product, store)).toBe(false)
    })

    it('should return false when available on 2017-08-23 but cutoff is before 1pm', () => {
      timeDateUtils.isTimePast.mockReturnValueOnce(true)

      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '12:00',
        stock: 3,
      }

      expect(cfsi.isCFSIToday(product, store)).toBe(false)
    })

    it('should return false when available on 2017-08-23, cutoff is after 1pm, but stock < quantity', () => {
      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '18:00',
        stock: 1,
      }

      expect(cfsi.isCFSIToday(product, store)).toBe(false)
    })

    it('should call getStockFromStockList if store.stock does not exist and should return true if getStockFromStockList returns stock > quantity', () => {
      getStock.getStockFromStockList.mockReturnValueOnce(3)

      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '18:00',
      }

      expect(getStock.getStockFromStockList).not.toHaveBeenCalled()
      expect(cfsi.isCFSIToday(product, store)).toBe(true)
      expect(getStock.getStockFromStockList).toHaveBeenCalledTimes(1)
      expect(getStock.getStockFromStockList).toHaveBeenLastCalledWith(
        product.sku,
        store
      )
    })

    it('should call getStockFromStockList if store.stock does not exist and should return false if getStockFromStockList returns stock < quantity', () => {
      getStock.getStockFromStockList.mockReturnValueOnce(1)

      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '18:00',
      }

      expect(getStock.getStockFromStockList).not.toHaveBeenCalled()
      expect(cfsi.isCFSIToday(product, store)).toBe(false)
      expect(getStock.getStockFromStockList).toHaveBeenCalledTimes(1)
      expect(getStock.getStockFromStockList).toHaveBeenLastCalledWith(
        product.sku,
        store
      )
    })

    it('should call getStockFromStockList if store.stock does not exist and should return false if getStockFromStockList returns undefined', () => {
      getStock.getStockFromStockList.mockReturnValueOnce(undefined)

      const store = {
        cfsiAvailableOn: '2017-08-22,2017-08-23,2017-08-24',
        cfsiPickCutOffTime: '18:00',
      }

      expect(getStock.getStockFromStockList).not.toHaveBeenCalled()
      expect(cfsi.isCFSIToday(product, store)).toBe(false)
      expect(getStock.getStockFromStockList).toHaveBeenCalledTimes(1)
      expect(getStock.getStockFromStockList).toHaveBeenLastCalledWith(
        product.sku,
        store
      )
    })
  })

  describe('getFulfilmentDetails(product, store)', () => {
    const store = { storeId: 'TS420' }
    const product = { sku: '00007' }

    beforeAll(() => {
      jest.spyOn(getDCday, 'getDCDeliveryDay').mockReturnValue('Friday')
      jest.spyOn(getExpress, 'getExpressDeliveryDay').mockReturnValue('Tuesday')
      jest.spyOn(cfsi, 'isCFSIToday').mockReturnValue(true)
    })

    it('should return null if product is not valid', () => {
      expect(getFulfil.getFulfilmentDetails()).toEqual(null)
      expect(getFulfil.getFulfilmentDetails('', [])).toEqual(null)
      expect(getFulfil.getFulfilmentDetails(undefined, undefined)).toEqual(null)
      expect(getFulfil.getFulfilmentDetails(null, null)).toEqual(null)
      expect(getFulfil.getFulfilmentDetails('product', 'shop')).toEqual(null)
      expect(getFulfil.getFulfilmentDetails({}, store)).toEqual(null)
    })

    describe('without store', () => {
      it('CFSiDay should not be "today" and should fallback into expressDeliveryDay value', () => {
        cfsi.isCFSIToday.mockReturnValueOnce(false)

        expect(getFulfil.getFulfilmentDetails(product, {})).toEqual({
          CFSiDay: 'Tuesday',
          expressDeliveryDay: 'Tuesday',
          homeExpressDeliveryDay: 'Friday',
          parcelCollectDay: 'Friday',
        })
      })
    })

    describe('with store', () => {
      it('if getDCDeliveryDay return "Friday", getExpressDeliveryDay returns "Tuesday" and isCFSIToday is true and with store', () => {
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'today',
          expressDeliveryDay: 'Tuesday',
          homeExpressDeliveryDay: 'Friday',
          parcelCollectDay: 'Friday',
        })
      })

      it('if getDCDeliveryDay returns "Friday", getExpressDeliveryDay returns "Tuesday" and isCFSIToday is false', () => {
        cfsi.isCFSIToday.mockReturnValueOnce(false)
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'Tuesday',
          expressDeliveryDay: 'Tuesday',
          homeExpressDeliveryDay: 'Friday',
          parcelCollectDay: 'Friday',
        })
      })

      it('if there is no getDCDeliveryDay , getExpressDeliveryDay returns "Tuesday" and isCFSIToday is true', () => {
        getDCday.getDCDeliveryDay.mockReturnValueOnce('')
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'today',
          expressDeliveryDay: 'Tuesday',
          homeExpressDeliveryDay: 'Tuesday',
          parcelCollectDay: '',
        })
      })

      it('if getDCDeliveryDay returns "Friday", there is no getExpressDeliveryDay and isCFSIToday is true', () => {
        getExpress.getExpressDeliveryDay.mockReturnValueOnce('')
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'today',
          expressDeliveryDay: 'Friday',
          homeExpressDeliveryDay: 'Friday',
          parcelCollectDay: 'Friday',
        })
      })

      it('if there is no getDCDeliveryDay or getExpressDeliveryDay and isCFSIToday is true', () => {
        getDCday.getDCDeliveryDay.mockReturnValueOnce('')
        getExpress.getExpressDeliveryDay.mockReturnValueOnce('')
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'today',
          expressDeliveryDay: '',
          homeExpressDeliveryDay: '',
          parcelCollectDay: '',
        })
      })

      it('if getDCDeliveryDay returns "Friday", there is no getExpressDeliveryDay and isCFSIToday is false', () => {
        getExpress.getExpressDeliveryDay.mockReturnValueOnce('')
        cfsi.isCFSIToday.mockReturnValueOnce(false)
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'Friday',
          expressDeliveryDay: 'Friday',
          homeExpressDeliveryDay: 'Friday',
          parcelCollectDay: 'Friday',
        })
      })

      it('if there is no getDCDeliveryDay, getExpressDeliveryDay returns "Tuesday" and isCFSIToday is false', () => {
        getDCday.getDCDeliveryDay.mockReturnValueOnce('')
        cfsi.isCFSIToday.mockReturnValueOnce(false)
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: 'Tuesday',
          expressDeliveryDay: 'Tuesday',
          homeExpressDeliveryDay: 'Tuesday',
          parcelCollectDay: '',
        })
      })

      it('if there is no getDCDeliveryDay or getExpressDeliveryDay and isCFSIToday is false', () => {
        getDCday.getDCDeliveryDay.mockReturnValueOnce('')
        getExpress.getExpressDeliveryDay.mockReturnValueOnce('')
        cfsi.isCFSIToday.mockReturnValueOnce(false)
        expect(getFulfil.getFulfilmentDetails(product, store)).toEqual({
          CFSiDay: '',
          expressDeliveryDay: '',
          homeExpressDeliveryDay: '',
          parcelCollectDay: '',
        })
      })
    })
  })
})
