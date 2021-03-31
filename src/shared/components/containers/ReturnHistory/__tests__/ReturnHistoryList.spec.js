import React from 'react'
import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import { returnHistoryRequest } from '../../../../actions/common/accountActions'

import ReturnHistoryList from '../ReturnHistoryList'
import { compose } from 'ramda'
import { withStore } from '../../../../../../test/unit/helpers/test-component'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import { browserHistory } from 'react-router'
import { TYPE } from '../../OrderListContainer/types'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
  Link: function LinkComponent(props) {
    return <div>{props.children}</div>
  },
}))

jest.mock('../../../../actions/common/accountActions', () => ({
  returnHistoryRequest: jest.fn(),
}))

describe('<ReturnHistoryList />', () => {
  beforeEach(() => jest.resetAllMocks())

  const renderComponent = testComponentHelper(
    ReturnHistoryList.WrappedComponent
  )
  const initialProps = {
    returnHistoryRequest: jest.fn(),
    returns: [
      {
        orderId: 314396194,
        date: '02 December 2016',
        status: 'Fully Refunded',
        statusCode: 'r',
        total: '£39.50',
        rmaId: '014395191',
      },
      {
        orderId: 314234546,
        date: '05 December 2016',
        status: 'Fully refunded',
        statusCode: 'r',
        total: '£40.00',
        rmaId: '014395193',
      },
      {
        orderId: 314396185,
        date: '01 December 2016',
        status: 'Refund pending',
        statusCode: 'r',
        total: '£90.00',
        rmaId: '014395192',
      },
    ],
    visited: ['/login', '/my-account', '/my-account/return-history'],
    brandCode: 'ts',
    region: 'uk',
    orderHistoryMessageFeature: false,
  }

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('has no orders', () => {
      expect(
        renderComponent({
          ...initialProps,
          returns: [],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has return limits message and the brand code is in the numbers', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderHistoryMessageFeature: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has return limits message and the brand code is NOT in the numbers but region is EU', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderHistoryMessageFeature: true,
          region: 'eu',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has return limits message and the brand code is NOT in the numbers and region is NOT EU', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderHistoryMessageFeature: true,
          region: 'noneu',
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('child components pass as props', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orders: [],
        type: TYPE.RETURN,
      })

      it('should pass AccountHeaderComponent with the correct text', () => {
        const AccountHeaderComponent = wrapper.props().AccountHeaderComponent
        expect(AccountHeaderComponent.props.label).toBe('Back to My Account')
        expect(AccountHeaderComponent.props.title).toBe('My returns')
      })
      it('should pass OrderListTaglineComponent with the correct text', () => {
        const OrderListTaglineComponent = wrapper.props()
          .OrderListTaglineComponent
        expect(OrderListTaglineComponent.props.tagline).toBe(
          'Track your current returns and view your return history'
        )
      })
      it('should pass OrderListFooterComponent with the correct text', () => {
        const OrderListFooterComponent = wrapper.props()
          .OrderListFooterComponent
        expect(OrderListFooterComponent.props.displayText).toBe(
          'Displaying your last 20 returns.'
        )
        expect(OrderListFooterComponent.props.historyRequest).toBe(
          'Need your full return history?'
        )
        expect(OrderListFooterComponent.props.contact).toBe(
          ' Contact customer service on'
        )
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('should not call returnHistoryRequest if visited length is 0', () => {
        const { instance } = renderComponent({ ...initialProps, visited: [] })
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
      })

      it('should not call returnHistoryRequest if visited length is 1 or less', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/'],
        })
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
      })

      it('should NOT call returnHistoryRequest if visited length is greater than 1 and return list not empty', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/', '/blah'],
        })
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
      })
      it('should call returnHistoryRequest if visited length is greater than 1 and return list not empty', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/', '/blah'],
          returns: [],
        })
        expect(instance.props.returnHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.returnHistoryRequest).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@needs', () => {
    it('should call returnHistoryRequest', () => {
      expect(returnHistoryRequest).not.toHaveBeenCalled()
      ReturnHistoryList.WrappedComponent.needs[0]()
      expect(returnHistoryRequest).toHaveBeenCalledTimes(1)
    })
  })

  describe('@instance', () => {
    describe('@sortOrders', () => {
      it('should sort correctly', () => {
        const dates = [
          { date: '02 November 2016' },
          { date: '05 November 2016' },
          { date: '01 November 2016' },
          { date: '02 December 2016' },
          { date: '02 May 2017' },
          { date: '01 July 2017' },
        ]

        const sorted = [
          '01 July 2017',
          '02 May 2017',
          '02 December 2016',
          '05 November 2016',
          '02 November 2016',
          '01 November 2016',
        ]

        const { instance } = renderComponent(initialProps)
        const result = instance.sortOrders(dates).map((item) => item.date)

        expect(result).toEqual(sorted)
      })
    })
  })

  describe('My Returns Button', () => {
    it('should call browserHistory with the correct path name', () => {
      const initialState = {
        config: {
          brandName: 'topshop',
          brandCode: 'tsuk',
          region: 'United Kingdom',
        },
        returnHistory: {
          returns: [],
        },
        routing: {
          visited: [],
        },
        features: {
          status: {
            FEATURE_ORDER_HISTORY_MSG: true,
          },
        },
        viewport: {
          media: 'desktop',
        },
        debug: {
          environment: 'stage',
        },
      }
      const store = mockStoreCreator(initialState)
      const state = store.getState()
      const renderComponent = buildComponentRender(
        compose(
          mountRender,
          withStore(state)
        ),
        ReturnHistoryList
      )

      const { wrapper } = renderComponent(initialProps)
      const returnToItemButton = wrapper.find('.AccountHeader-action .Button')
      returnToItemButton.simulate('click')
      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenCalledWith(
        '/my-account/order-history'
      )
    })
  })
})
