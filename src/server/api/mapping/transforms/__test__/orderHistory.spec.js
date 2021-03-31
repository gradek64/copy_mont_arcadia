import { path } from 'ramda'

import wcsTrackOrders from '../../../../../../test/apiResponses/orders/wcs-trackOrders.json'
import montyOrders from '../../../../../../test/apiResponses/orders/hapiMonty-orders.json'

import transform, * as fragments from '../orderHistory'

describe('orderHistory transformer', () => {
  describe('orderHistory transform', () => {
    it('should transform a order history response from WCS into a format expected by Monty', () => {
      expect(transform(wcsTrackOrders, '£')).toEqual(montyOrders)
    })
  })

  describe('orderHistoryFragment', () => {
    const { orderHistoryFragment } = fragments
    it('should return an empty array if there are no orders in the order history', () => {
      expect(orderHistoryFragment([])).toEqual([])
    })

    it('should return an empty array if the orderHistory value is not an array or is undefined', () => {
      expect(orderHistoryFragment()).toEqual([])
      expect(orderHistoryFragment({})).toEqual([])
    })

    it('should transform the orderHistory array from WCS into a format expected by Monty', () => {
      expect(
        orderHistoryFragment(path(['orderHistory'], wcsTrackOrders), '£')
      ).toEqual(path(['orders'], montyOrders))
    })
  })

  describe('orderFragment', () => {
    const { orderFragment } = fragments

    it('should return a default value if any data is missing', () => {
      expect(orderFragment({}, '£')).toEqual({
        orderId: 0,
        date: '',
        isOrderDDPOnly: false,
        statusCode: '',
        status: '',
        total: '£0.00',
        returnPossible: false,
        returnRequested: false,
      })
    })

    it('should convert an order in the orderHistory array from WCS into a format expected by Monty', () => {
      expect(
        orderFragment(path(['orderHistory', 0], wcsTrackOrders), '£')
      ).toEqual(path(['orders', 0], montyOrders))
    })
  })

  describe('priceFragment', () => {
    const { priceFragment } = fragments
    it('should correctly format the total cost', () => {
      expect(priceFragment(20.0, '£')).toBe('£20.00')
    })

    it('should return a price of 0.00 if the price is 0 or falsy', () => {
      expect(priceFragment(0, '£')).toBe('£0.00')
      expect(priceFragment()).toBe('0.00')
    })
  })
})
