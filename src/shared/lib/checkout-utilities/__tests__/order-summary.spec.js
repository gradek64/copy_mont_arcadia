import {
  removeCFSIFromOrderSummary,
  normaliseEstimatedDeliveryDate,
  normaliseDeliveryType,
  isErroredStore,
} from '../order-summary'

import { orderSummaryCollectFromStoreImmediately } from '../../../../../test/mocks/orderSummary/collect-from-store-immediately'

describe('Order Summary fix utils', () => {
  describe('removeCFSIFromOrderSummary(orderSummary)', () => {
    it('should remove Collect from Store Delivery Type from orderSummary', () => {
      expect(
        removeCFSIFromOrderSummary(orderSummaryCollectFromStoreImmediately)
      ).toMatchSnapshot()
    })
  })

  describe(normaliseEstimatedDeliveryDate.name, () => {
    it('normalises english estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate(
          'no later than Thursday 14 September 2000'
        )
      ).toEqual('Thursday 14 September 2000')
    })
    it('normalises french estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate(
          'pas plus tard que vendredi 15 septembre 2000'
        )
      ).toEqual('vendredi 15 septembre 2000')
    })
    it('normalises german estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate(
          'nicht später als Freitag 15 September 2000'
        )
      ).toEqual('Freitag 15 September 2000')
    })
  })

  describe(`${normaliseEstimatedDeliveryDate.name} array`, () => {
    it('normalises english estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate([
          'no later than Thursday 14 September 2000',
        ])
      ).toEqual('Thursday 14 September 2000')
    })
    it('normalises french estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate([
          'pas plus tard que vendredi 15 septembre 2000',
        ])
      ).toEqual('vendredi 15 septembre 2000')
    })
    it('normalises german estimated delivery date', () => {
      expect(
        normaliseEstimatedDeliveryDate([
          'nicht später als Freitag 15 September 2000',
        ])
      ).toEqual('Freitag 15 September 2000')
    })
  })

  describe('normaliseDeliveryType', () => {
    it('normalises english', () => {
      expect(normaliseDeliveryType('Home Delivery Network')).toEqual(
        'Home Delivery Network'
      )
      expect(normaliseDeliveryType('Parcelnet')).toEqual('Parcelnet')
    })

    it('normalises french', () => {
      expect(normaliseDeliveryType('Express International')).toEqual(
        'Home Delivery Network'
      )
      expect(normaliseDeliveryType('Standard International')).toEqual(
        'Parcelnet'
      )
      expect(normaliseDeliveryType('Livraison Express')).toEqual(
        'Home Delivery Network'
      )
      expect(normaliseDeliveryType('Livraison Standard')).toEqual('Parcelnet')
    })

    it('normalises german', () => {
      expect(normaliseDeliveryType('Expresslieferung')).toEqual(
        'Home Delivery Network'
      )
      expect(normaliseDeliveryType('Standardlieferung')).toEqual('Parcelnet')
      expect(normaliseDeliveryType('Expresslieferung (2)')).toEqual(
        'Home Delivery Network'
      )
      expect(normaliseDeliveryType('Standardlieferung (3)')).toEqual(
        'Parcelnet'
      )
    })
  })

  describe('isErroredStore', () => {
    it('it finds no message', () => {
      expect(isErroredStore()).toEqual(false)
    })

    it('it finds different message', () => {
      expect(isErroredStore('hello')).toEqual(false)
    })

    it('it finds _ERR_DELIVERY_STORE_INVALID', () => {
      expect(isErroredStore('_ERR_DELIVERY_STORE_INVALID')).toEqual(true)
    })

    it('it finds _ERR_DELIVERY_STORE_ADDRESS_INVALID', () => {
      expect(isErroredStore('_ERR_DELIVERY_STORE_ADDRESS_INVALID')).toEqual(
        true
      )
    })

    it('it finds _ERR_DELIVERY_STORE_ADDRESS_INACTIVE', () => {
      expect(isErroredStore('_ERR_DELIVERY_STORE_ADDRESS_INACTIVE')).toEqual(
        true
      )
    })
  })
})
