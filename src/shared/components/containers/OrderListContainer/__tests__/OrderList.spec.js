import React from 'react'
import deepFreeze from 'deep-freeze'
import testComponentHelper from 'test/unit/helpers/test-component'
import OrderList from '../OrderList'

describe('<OrderList />', () => {
  const renderComponent = testComponentHelper(OrderList)
  const initialProps = {
    brandCode: 'ts',
    orders: [
      {
        date: '03 May 2017',
        orderId: 1446704,
        isOrderDDPOnly: false,
        returnPossible: false,
        returnRequested: false,
        status: 'Your order is currently being packed by our warehouse.',
        statusCode: 'C',
        total: '£53.00',
      },
      {
        date: '27 April 2017',
        orderId: 1438912,
        isOrderDDPOnly: false,
        returnPossible: false,
        returnRequested: false,
        status: 'Your order is currently being packed by our warehouse.',
        statusCode: 'C',
        total: '£42.00',
      },
    ],
  }

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with header', () => {
      expect(
        renderComponent({
          ...initialProps,
          header: <div>mockedHeader</div>,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with isOrderDDPOnly set to true', () => {
      const ddpOrderOnlyProps = deepFreeze({
        ...initialProps,
        orders: [
          ...initialProps.orders,
          {
            date: '05 June 2019',
            isOrderDDPOnly: true,
            orderId: 8354892,
            returnPossible: false,
            returnRequested: false,
            status: 'Your order has been sent to our warehouse to be picked.',
            statusCode: 'W',
            total: '£9.95',
          },
        ],
      })
      expect(renderComponent(ddpOrderOnlyProps).getTree()).toMatchSnapshot()
    })
  })
})
