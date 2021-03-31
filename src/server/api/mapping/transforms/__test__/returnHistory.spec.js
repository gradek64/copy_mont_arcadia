import { orderFragment, returns } from '../returnHistory'
import wcs from '../../../../../../test/apiResponses/returns/wcs.json'
import monty from '../../../../../../test/apiResponses/returns/hapiMonty.json'

const emptyOrderItem = {
  orderId: '',
  date: '',
  status: '',
  statusCode: '',
  total: '',
  rmaId: '',
}

const emptyReturns = {
  orders: [],
  version: '1.7',
}

describe('transform returns', () => {
  describe('orderFragment', () => {
    it('transforms wcs returns item to monty order item', () => {
      expect(orderFragment(wcs.returns[0])).toEqual(monty.orders[0])
    })
    it('returns a default monty order item if nothing is passed in', () => {
      expect(orderFragment()).toEqual(emptyOrderItem)
      expect(orderFragment({})).toEqual(emptyOrderItem)
      expect(orderFragment([])).toEqual(emptyOrderItem)
    })

    it('should transform HTML entity to currency symbol', () => {
      const data = {
        symbol: '&euro;',
        totalCredit: 100,
      }

      const result = orderFragment(data)
      expect(result.total).toEqual('€100.00')
    })

    it('should default to currency symbol if not an HTML entity', () => {
      const data = {
        symbol: '$',
        totalCredit: 100,
      }

      const result = orderFragment(data)
      expect(result.total).toEqual('$100.00')
    })
  })
  describe('returns', () => {
    it('transforms wcs returns history to monty returns history', () => {
      expect(returns(wcs)).toEqual(monty)
    })
    it('returns a default monty returns history if nothing is passed in', () => {
      expect(returns()).toEqual(emptyReturns)
      expect(returns({})).toEqual(emptyReturns)
      expect(returns([])).toEqual(emptyReturns)
    })
  })
})
