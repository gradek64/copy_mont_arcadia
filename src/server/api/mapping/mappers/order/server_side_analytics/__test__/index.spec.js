import deepFreeze from 'deep-freeze'
import * as serverSideAnalytics from '../index'

import {
  extractClientId,
  getVisitor,
  logEnhancedEcommercePurchase,
  logSsr,
} from '../core'

import {
  extractHostName,
  extractBrandCodeFromHeader,
} from '../../../../../../config'

jest.mock('../core')
jest.mock('../../../../../../config')

const HEADER_BRAND_CODE = 'tsde'
const HOSTNAME = 'm.de.topshop.com'
const ANALYTICS_ID = 'GA1.2.1524909754.1544283648'
const USER_ID = '00001234'

const WCS_ORDER = deepFreeze({
  orderId: 'ID_1234',
  totalOrderPrice: '123.45',
  deliveryCost: '4.99',
  currencyConversion: {
    currencyRate: 'eur',
  },
})

const PROMO_CODES = deepFreeze([
  {
    voucherCodes: 'BUY_TWO_FOR_TWICE_THE_PRICE',
  },
])

describe('Server Side Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('logPurchase', () => {
    it('should not throw when completedOrder is undefined', () => {
      expect(() =>
        serverSideAnalytics.logPurchase({
          analyticsId: '',
          headerBrandCode: '',
          userId: '',
          promoCodes: [],
          analyticsHost: '',
        })
      ).not.toThrow()
    })

    it('should extract all necessary information to successfully log a purchase', () => {
      serverSideAnalytics.logPurchase({
        completedOrder: WCS_ORDER,
        analyticsId: ANALYTICS_ID,
        headerBrandCode: HEADER_BRAND_CODE,
        userId: USER_ID,
        promoCodes: PROMO_CODES,
        analyticsHost: HOSTNAME,
      })

      expect(extractHostName).toHaveBeenCalledTimes(1)
      expect(extractBrandCodeFromHeader).toHaveBeenCalledTimes(1)
      expect(extractClientId).toHaveBeenCalledTimes(1)
      expect(getVisitor).toHaveBeenCalledTimes(1)
      expect(logEnhancedEcommercePurchase).toHaveBeenCalledTimes(1)
    })
  })

  describe('logSsrOrderComplete', () => {
    it('should not throw when completedOrder is undefined', () => {
      expect(() =>
        serverSideAnalytics.logSsrOrderComplete({
          analyticsId: '',
          headerBrandCode: '',
          analyticsHost: '',
        })
      ).not.toThrow()
    })

    it('should extract all necessary information to successfully log the SSR of /order-complete', () => {
      serverSideAnalytics.logSsrOrderComplete({
        completedOrder: WCS_ORDER,
        analyticsId: ANALYTICS_ID,
        headerBrandCode: HEADER_BRAND_CODE,
        analyticsHost: HOSTNAME,
      })

      expect(extractHostName).toHaveBeenCalledTimes(1)
      expect(extractBrandCodeFromHeader).toHaveBeenCalledTimes(1)
      expect(extractClientId).toHaveBeenCalledTimes(1)
      expect(getVisitor).toHaveBeenCalledTimes(1)
      expect(logSsr).toHaveBeenCalledTimes(1)
    })
  })
})
