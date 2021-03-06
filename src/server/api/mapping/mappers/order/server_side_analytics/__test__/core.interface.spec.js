import deepFreeze from 'deep-freeze'
import universalAnalytics from 'universal-analytics'
import uuidv4 from 'uuid/v4'

import * as logger from '../../../../../../lib/logger'

import {
  getVisitor,
  logStandardEcommercePurchase,
  logEnhancedEcommercePurchase,
  logSsr,
} from '../core'

jest.mock('universal-analytics')
jest.mock('uuid/v4')
jest.mock('../../../../../../lib/logger')

const TEST_UUID = '12345'
uuidv4.mockReturnValue(TEST_UUID)

const TESTING_TRACKING_ID = 'UA-99206402-27'
const TOPSHOP_TRACKING_ID = 'UA-99206402-1'

const TEST_CLIENT_ID = '1524909754.1544283648'
const TEST_USER_ID = '00001234'

const DEFAULT_VISITOR_OPTIONS = deepFreeze({ enableBatching: false })

const visitor = {
  event: jest.fn(() => visitor),
  item: jest.fn(() => visitor),
  send: jest.fn(),
  transaction: jest.fn(() => visitor),
}

const TRANSACTION_INFO = deepFreeze({
  transactionId: 'ID_1234',
  revenue: '123.45',
  shipping: '1.99',
  currencyCode: 'gbp',
})

const LINE_ITEMS = deepFreeze([
  {
    total: '100',
    quantity: 2,
    lineNo: 'SKU_1234',
    name: 'test_product_one',
  },

  {
    total: '300',
    quantity: 1,
    lineNo: 'SKU_5678',
    name: 'test_product_two',
  },
])

const PROMO_CODES = deepFreeze([
  {
    voucherCodes: 'BUY_TWO_FOR_TWICE_THE_PRICE',
  },
])

describe('Core Interface', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.process.env.SSA_ENABLE_REPORTING = true
  })

  afterAll(() => {
    delete global.process.env.SSA_ENABLE_REPORTING
  })

  describe('getVisitor', () => {
    it('should not throw when no arguments are passed', () => {
      expect(() => getVisitor()).not.toThrow()
    })

    it('should default to the TESTING analytics property with an autogenerated client ID when called with no arguments', () => {
      getVisitor()
      expect(universalAnalytics).toHaveBeenCalledTimes(1)
      expect(universalAnalytics).toHaveBeenCalledWith(
        TESTING_TRACKING_ID,
        TEST_UUID,
        DEFAULT_VISITOR_OPTIONS
      )
    })

    it('should use a brand tracking ID when called with a valid brand code', () => {
      getVisitor('ts')
      expect(universalAnalytics).toHaveBeenCalledTimes(1)
      expect(universalAnalytics).toHaveBeenCalledWith(
        TOPSHOP_TRACKING_ID,
        TEST_UUID,
        DEFAULT_VISITOR_OPTIONS
      )
    })

    it('should use a pool tracking ID when called with a valid brand code if SSA_POOL_PROPERTY is defined in the environment', () => {
      const SSA_POOL_PROPERTY = global.process.env.SSA_POOL_PROPERTY

      global.process.env.SSA_POOL_PROPERTY = 'TESTING'

      getVisitor('ts')
      expect(universalAnalytics).toHaveBeenCalledTimes(1)
      expect(universalAnalytics).toHaveBeenCalledWith(
        TESTING_TRACKING_ID,
        TEST_UUID,
        DEFAULT_VISITOR_OPTIONS
      )

      global.process.env.SSA_POOL_PROPERTY = SSA_POOL_PROPERTY
    })

    it('should use the supplied client ID instead of autogenerating one when provided', () => {
      getVisitor('ts', TEST_CLIENT_ID)
      expect(universalAnalytics).toHaveBeenCalledTimes(1)
      expect(universalAnalytics).toHaveBeenCalledWith(
        TOPSHOP_TRACKING_ID,
        TEST_CLIENT_ID,
        DEFAULT_VISITOR_OPTIONS
      )
    })

    it('should add the user ID when provided', () => {
      const extendedVisitorOptions = deepFreeze({
        ...DEFAULT_VISITOR_OPTIONS,
        uid: TEST_USER_ID,
      })

      getVisitor('ts', TEST_CLIENT_ID, TEST_USER_ID)
      expect(universalAnalytics).toHaveBeenCalledTimes(1)
      expect(universalAnalytics).toHaveBeenCalledWith(
        TOPSHOP_TRACKING_ID,
        TEST_CLIENT_ID,
        extendedVisitorOptions
      )
    })
  })

  describe('logStandardEcommercePurchase', () => {
    it('should not attempt to use a missing visitor parameter', () => {
      const transactionInfo = {}
      const lineItems = []
      expect(() =>
        logStandardEcommercePurchase(undefined, transactionInfo, lineItems)
      ).not.toThrow()

      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
      expect(visitor.send).not.toHaveBeenCalled()
    })

    it('should not throw with a missing transactionInfo parameter', () => {
      const lineItems = []
      expect(() =>
        logStandardEcommercePurchase(visitor, undefined, lineItems)
      ).not.toThrow()
    })

    it('should not throw with a missing lineItems parameter', () => {
      const transactionInfo = {}
      expect(() =>
        logStandardEcommercePurchase(visitor, transactionInfo)
      ).not.toThrow()
    })

    it('should send a sequence of transaction and item hits', () => {
      logStandardEcommercePurchase(visitor, TRANSACTION_INFO, LINE_ITEMS)

      expect(visitor.transaction).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).toHaveBeenCalledWith({
        ti: TRANSACTION_INFO.transactionId,
        tr: TRANSACTION_INFO.revenue,
        ts: TRANSACTION_INFO.shipping,
        cu: TRANSACTION_INFO.currencyCode,
        pa: 'purchase',
      })

      expect(visitor.item).toHaveBeenCalledTimes(LINE_ITEMS.length)
      expect(visitor.item.mock.calls).toEqual(
        LINE_ITEMS.map((item) => [
          {
            ip: item.total,
            iq: item.quantity,
            ic: item.lineNo,
            in: item.name,
            iv: '',
          },
        ])
      )

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.event).not.toHaveBeenCalled()
    })

    it('should not send anything to Google Analytics if SSA_ENABLE_REPORTING is not set in the environment', () => {
      const SSA_ENABLE_REPORTING = global.process.env.SSA_ENABLE_REPORTING

      delete global.process.env.SSA_ENABLE_REPORTING

      logStandardEcommercePurchase(visitor, TRANSACTION_INFO, LINE_ITEMS)
      expect(visitor.transaction).toHaveBeenCalledTimes(1)
      expect(visitor.item).toHaveBeenCalledTimes(LINE_ITEMS.length)
      expect(visitor.send).not.toHaveBeenCalled()

      global.process.env.SSA_ENABLE_REPORTING = SSA_ENABLE_REPORTING
    })

    it('should log to New Relic a failure to send a hit', () => {
      const error = new Error('oops')
      visitor.send.mockImplementation((callback) => callback(error))
      logStandardEcommercePurchase(visitor, TRANSACTION_INFO, LINE_ITEMS)
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        'server-side-analytics send() failed',
        error
      )
    })

    it('should not log to New Relic a successfully sent hit', () => {
      visitor.send.mockImplementation((callback) => callback(null))
      logStandardEcommercePurchase(visitor, TRANSACTION_INFO, LINE_ITEMS)
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).not.toHaveBeenCalled()
    })
  })

  describe('logEnhancedEcommercePurchase', () => {
    it('should not attempt to use a missing visitor parameter', () => {
      const brandCode = 'ts'
      const transactionInfo = {}
      const lineItems = []
      expect(() =>
        logEnhancedEcommercePurchase(
          undefined,
          brandCode,
          transactionInfo,
          lineItems
        )
      ).not.toThrow()

      expect(visitor.event).not.toHaveBeenCalled()
      expect(visitor.send).not.toHaveBeenCalled()
    })

    it('should not throw with a missing brandCode parameter', () => {
      const transactionInfo = {}
      const lineItems = []
      expect(() =>
        logEnhancedEcommercePurchase(
          visitor,
          undefined,
          transactionInfo,
          lineItems
        )
      ).not.toThrow()
    })

    it('should not throw with a missing transactionInfo parameter', () => {
      const brandCode = 'ts'
      const lineItems = []
      expect(() =>
        logEnhancedEcommercePurchase(visitor, brandCode, undefined, lineItems)
      ).not.toThrow()
    })

    it('should not throw with a missing lineItems parameter', () => {
      const brandCode = 'ts'
      const transactionInfo = {}
      expect(() =>
        logEnhancedEcommercePurchase(visitor, brandCode, transactionInfo)
      ).not.toThrow()
    })

    it('should send an event hit containing all transaction details', () => {
      const brandCode = 'ts'
      logEnhancedEcommercePurchase(
        visitor,
        brandCode,
        TRANSACTION_INFO,
        LINE_ITEMS
      )

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.event).toHaveBeenCalledWith({
        dl: 'https://m.topshop.com/order-complete',
        ds: 'coreApi',
        cg1: `${brandCode.toUpperCase()}:Order-Confirmed`,
        cg2: `${brandCode.toUpperCase()}:Order-Confirmed`,
        ec: 'ecommerce',
        ea: 'purchase',
        el: TRANSACTION_INFO.transactionId,
        ni: 1,
        ti: TRANSACTION_INFO.transactionId,
        tr: TRANSACTION_INFO.revenue,
        ts: TRANSACTION_INFO.shipping,
        cu: TRANSACTION_INFO.currencyCode,
        pa: 'purchase',
        ...LINE_ITEMS.reduce(
          (object, item, index) => ({
            ...object,
            [`pr${index + 1}id`]: item.lineNo,
            [`pr${index + 1}nm`]: item.name,
            [`pr${index + 1}pr`]: item.total,
            [`pr${index + 1}br`]: 'Topshop',
            [`pr${index + 1}qt`]: item.quantity,
            [`pr${index + 1}ca`]: '',
          }),
          {}
        ),
      })

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
    })

    it('should include a promotional code in the hit if present', () => {
      const brandCode = 'ts'
      logEnhancedEcommercePurchase(
        visitor,
        brandCode,
        TRANSACTION_INFO,
        LINE_ITEMS,
        PROMO_CODES
      )

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.event).toHaveBeenCalledWith({
        dl: 'https://m.topshop.com/order-complete',
        ds: 'coreApi',
        cg1: `${brandCode.toUpperCase()}:Order-Confirmed`,
        cg2: `${brandCode.toUpperCase()}:Order-Confirmed`,
        ec: 'ecommerce',
        ea: 'purchase',
        el: TRANSACTION_INFO.transactionId,
        ni: 1,
        ti: TRANSACTION_INFO.transactionId,
        tr: TRANSACTION_INFO.revenue,
        ts: TRANSACTION_INFO.shipping,
        cu: TRANSACTION_INFO.currencyCode,
        tcc: PROMO_CODES[0].voucherCodes,
        pa: 'purchase',
        ...LINE_ITEMS.reduce(
          (object, item, index) => ({
            ...object,
            [`pr${index + 1}id`]: item.lineNo,
            [`pr${index + 1}nm`]: item.name,
            [`pr${index + 1}pr`]: item.total,
            [`pr${index + 1}br`]: 'Topshop',
            [`pr${index + 1}qt`]: item.quantity,
            [`pr${index + 1}ca`]: '',
          }),
          {}
        ),
      })

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
    })

    it('should use the supplied hostname, if present', () => {
      const promoCodes = []
      const brandCode = 'br'
      const hostname = 'm.eu.burton-menswear.com'
      logEnhancedEcommercePurchase(
        visitor,
        brandCode,
        TRANSACTION_INFO,
        LINE_ITEMS,
        promoCodes,
        hostname
      )

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.event).toHaveBeenCalledWith({
        dl: `https://${hostname}/order-complete`,
        ds: 'coreApi',
        cg1: `${brandCode.toUpperCase()}:Order-Confirmed`,
        cg2: `${brandCode.toUpperCase()}:Order-Confirmed`,
        ec: 'ecommerce',
        ea: 'purchase',
        el: TRANSACTION_INFO.transactionId,
        ni: 1,
        ti: TRANSACTION_INFO.transactionId,
        tr: TRANSACTION_INFO.revenue,
        ts: TRANSACTION_INFO.shipping,
        cu: TRANSACTION_INFO.currencyCode,
        pa: 'purchase',
        ...LINE_ITEMS.reduce(
          (object, item, index) => ({
            ...object,
            [`pr${index + 1}id`]: item.lineNo,
            [`pr${index + 1}nm`]: item.name,
            [`pr${index + 1}pr`]: item.total,
            [`pr${index + 1}br`]: 'Burton',
            [`pr${index + 1}qt`]: item.quantity,
            [`pr${index + 1}ca`]: '',
          }),
          {}
        ),
      })

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
    })

    it('should not send anything to Google Analytics if SSA_ENABLE_REPORTING is not set in the environment', () => {
      const SSA_ENABLE_REPORTING = global.process.env.SSA_ENABLE_REPORTING

      delete global.process.env.SSA_ENABLE_REPORTING

      logEnhancedEcommercePurchase(visitor, 'ts', TRANSACTION_INFO, LINE_ITEMS)

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.send).not.toHaveBeenCalled()

      global.process.env.SSA_ENABLE_REPORTING = SSA_ENABLE_REPORTING
    })

    it('should log to New Relic a failure to send a hit', () => {
      const brandCode = 'ts'
      const error = new Error('oops')
      visitor.send.mockImplementation((callback) => callback(error))
      logEnhancedEcommercePurchase(
        visitor,
        brandCode,
        TRANSACTION_INFO,
        LINE_ITEMS
      )
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        'server-side-analytics send() failed',
        error
      )
    })

    it('should not log to New Relic a successfully sent hit', () => {
      const brandCode = 'ts'
      visitor.send.mockImplementation((callback) => callback(null))
      logEnhancedEcommercePurchase(
        visitor,
        brandCode,
        TRANSACTION_INFO,
        LINE_ITEMS
      )
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).not.toHaveBeenCalled()
    })
  })

  describe('logSsr', () => {
    it('should not throw with a missing visitor parameter', () => {
      const transactionInfo = {}
      const hostname = 'hostname'
      const path = 'page'
      expect(() =>
        logSsr(undefined, transactionInfo, hostname, path)
      ).not.toThrow()
      expect(visitor.event).not.toHaveBeenCalled()
      expect(visitor.send).not.toHaveBeenCalled()
    })

    it('should not throw with a missing transactionInfo parameter', () => {
      const hostname = 'hostname'
      const path = 'page'
      expect(() => logSsr(visitor, undefined, hostname, path)).not.toThrow()
    })

    it('should send an event hit containing all transaction details', () => {
      const path = 'page'
      logSsr(visitor, TRANSACTION_INFO, undefined, path)

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.event).toHaveBeenCalledWith({
        dl: `https://m.topshop.com/${path}`,
        ds: 'coreApi',
        ec: 'ecommerce',
        ea: 'server side render',
        el: TRANSACTION_INFO.transactionId,
        ni: 1,
      })

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
    })

    it('should use the supplied hostname, if present', () => {
      const path = 'page'
      const hostname = 'm.eu.burton-menswear.com'
      logSsr(visitor, TRANSACTION_INFO, hostname, path)

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.event).toHaveBeenCalledWith({
        dl: `https://${hostname}/${path}`,
        ds: 'coreApi',
        ec: 'ecommerce',
        ea: 'server side render',
        el: TRANSACTION_INFO.transactionId,
        ni: 1,
      })

      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(visitor.transaction).not.toHaveBeenCalled()
      expect(visitor.item).not.toHaveBeenCalled()
    })

    it('should not send anything to Google Analytics if SSA_ENABLE_REPORTING is not set in the environment', () => {
      const SSA_ENABLE_REPORTING = global.process.env.SSA_ENABLE_REPORTING

      delete global.process.env.SSA_ENABLE_REPORTING

      logSsr(visitor, TRANSACTION_INFO, 'hostname', 'page')

      expect(visitor.event).toHaveBeenCalledTimes(1)
      expect(visitor.send).not.toHaveBeenCalled()

      global.process.env.SSA_ENABLE_REPORTING = SSA_ENABLE_REPORTING
    })

    it('should log to New Relic a failure to send a hit', () => {
      const error = new Error('oops')
      visitor.send.mockImplementation((callback) => callback(error))
      logSsr(visitor, TRANSACTION_INFO, 'hostname', 'page')
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        'server-side-analytics send() failed',
        error
      )
    })

    it('should not log to New Relic a successfully sent hit', () => {
      visitor.send.mockImplementation((callback) => callback(null))
      logSsr(visitor, TRANSACTION_INFO, 'hostname', 'page')
      expect(visitor.send).toHaveBeenCalledTimes(1)
      expect(logger.error).not.toHaveBeenCalled()
    })
  })
})
