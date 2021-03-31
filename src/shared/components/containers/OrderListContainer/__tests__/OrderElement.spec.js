import testComponentHelper from 'test/unit/helpers/test-component'
import OrderElement from '../OrderElement'

import { TYPE } from '../types'

describe('<OrderElement />', () => {
  const renderComponent = testComponentHelper(OrderElement)
  const orderProps = {
    orderId: 1234,
    orderDate: '20 12 2016',
    orderTotal: '1234',
    orderStatus: 'Some status message',
    type: TYPE.ORDER,
  }

  const returnProps = {
    orderId: 1234,
    rmaId: 9999,
    orderDate: '20 12 2016',
    orderTotal: '1234',
    orderStatus: 'Some status message',

    type: TYPE.RETURN,
  }

  describe('@render', () => {
    describe('order history', () => {
      it('in default state', () => {
        expect(renderComponent(orderProps).getTree()).toMatchSnapshot()
      })
    })

    describe('return history', () => {
      it('in default state', () => {
        expect(renderComponent(returnProps).getTree()).toMatchSnapshot()
      })
    })
  })

  describe('@instance methods', () => {
    describe('@getUrlByType', () => {
      it('should return url correct for orders', () => {
        const { instance } = renderComponent(orderProps)
        expect(instance.url).toBe('/my-account/order-history/1234')
      })

      it('should return url correct for returns', () => {
        const { instance } = renderComponent(returnProps)
        expect(instance.url).toBe('/my-account/return-history/1234/9999')
      })
    })
  })
})
