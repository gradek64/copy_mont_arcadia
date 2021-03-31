import React from 'react'
import OrderListContainer from '../OrderListContainer'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import { compose } from 'ramda'
import { withStore } from '../../../../../../test/unit/helpers/test-component'
import { TYPE } from '../../../containers/OrderListContainer/types'
import {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'

describe('<OrderListContainer />', () => {
  const initialProps = {
    className: 'Mocked-className',
    notFoundMessage: 'mockedNotFoundMessage',
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
    title: 'Mocked Title',
  }

  const MockHeaderComp = <div id="MockHeaderComp">{'MockHeaderComp'}</div>
  const MockTaglineComp = <div id="MockTaglineComp">{'MockTaglineComp'}</div>
  const MockFooterComp = <div id="MockFooterComp">{'MockFooterComp'}</div>

  describe('@render', () => {
    const initialState = {
      config: {
        brandName: 'topshop',
        brandCode: 'ts',
        region: 'United Kingdom',
      },
      viewport: {
        media: 'desktop',
      },
    }

    const store = mockStoreCreator(initialState)
    const state = store.getState()
    const renderComponent = buildComponentRender(
      compose(
        mountRender,
        withStore(state)
      ),
      OrderListContainer
    )

    describe('when passed orders', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        type: TYPE.RETURN,
        AccountHeaderComponent: MockHeaderComp,
        OrderListTaglineComponent: MockTaglineComp,
        OrderListFooterComponent: MockFooterComp,
      })

      it('should render an orderList', () => {
        const OrderListContainerComp = wrapper.find('OrderListContainer')
        expect(OrderListContainerComp.find('OrderList')).toHaveLength(1)
        expect(OrderListContainerComp.find('#MockHeaderComp')).toHaveLength(1)
        expect(OrderListContainerComp.find('#MockTaglineComp')).toHaveLength(1)
        expect(OrderListContainerComp.find('#MockFooterComp')).toHaveLength(1)
        expect(wrapper.find('NotFound')).toHaveLength(0)
      })
    })

    describe('when there is no Order', () => {
      it('should render a not found message', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          orders: [],
          type: TYPE.RETURN,
        })
        expect(wrapper.find('NotFound')).toHaveLength(1)
      })
    })
  })
})
