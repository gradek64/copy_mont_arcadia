import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import { orderHistoryRequest } from '../../../../actions/common/accountActions'
import OrderHistoryList from '../OrderHistoryList'
import { TYPE } from '../../OrderListContainer/types'

jest.mock('../../../../actions/common/accountActions', () => ({
  orderHistoryRequest: jest.fn(),
}))

describe('<OrderHistoryList />', () => {
  beforeEach(() => jest.resetAllMocks())

  const renderComponent = testComponentHelper(
    OrderHistoryList.WrappedComponent.WrappedComponent
  )
  const initialProps = {
    orderHistoryRequest: jest.fn(),
    orders: [
      {
        orderId: 1446704,
        date: '03 May 2017',
        status: 'Your order is currently being packed by our warehouse.',
        statusCode: 'C',
        total: '£53.00',
        returnPossible: false,
        returnRequested: false,
      },
      {
        orderId: 1438912,
        date: '27 April 2017',
        status: 'Your order is currently being packed by our warehouse.',
        statusCode: 'C',
        total: '£42.00',
        returnPossible: false,
        returnRequested: false,
      },
    ],
    // only used in didMount
    visited: ['/login', '/my-account', '/my-account/order-history'],
    brandCode: 'ts',
    region: 'uk',
    orderHistoryMessageFeature: false,
  }

  describe('@decorators', () => {
    analyticsDecoratorHelper(OrderHistoryList, 'my-orders', {
      componentName: 'OrderHistoryList',
      isAsync: true,
      redux: true,
    })
  })

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('has no orders', () => {
      expect(
        renderComponent({
          ...initialProps,
          orders: [],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has order limits message and the brand code is in the numbers', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderHistoryMessageFeature: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has order limits message and the brand code is NOT in the numbers but region is EU', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderHistoryMessageFeature: true,
          region: 'eu',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has order limits message and the brand code is NOT in the numbers and region is NOT EU', () => {
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
        expect(AccountHeaderComponent.props.title).toBe('My orders')
      })
      it('should pass OrderListTaglineComponent with the correct text', () => {
        const OrderListTaglineComponent = wrapper.props()
          .OrderListTaglineComponent
        expect(OrderListTaglineComponent.props.tagline).toBe(
          'Track your current orders, view your order history and start a return'
        )
      })
      it('should pass OrderListFooterComponent with the correct text', () => {
        const OrderListFooterComponent = wrapper.props()
          .OrderListFooterComponent
        expect(OrderListFooterComponent.props.displayText).toBe(
          'Displaying your last 20 orders.'
        )
        expect(OrderListFooterComponent.props.historyRequest).toBe(
          'Need your full order history?'
        )
        expect(OrderListFooterComponent.props.contact).toBe(
          ' Contact customer service on'
        )
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('should not call orderHistoryRequest if visited length is 0', () => {
        const { instance } = renderComponent({ ...initialProps, visited: [] })
        expect(instance.props.orderHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.orderHistoryRequest).not.toHaveBeenCalled()
      })

      it('should not call orderHistoryRequest if visited length is 1 or less', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/'],
        })
        expect(instance.props.orderHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.orderHistoryRequest).not.toHaveBeenCalled()
      })

      it('should not call orderHistoryRequest if visited length is 1 or less', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/', '/blah'],
        })
        expect(instance.props.orderHistoryRequest).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.orderHistoryRequest).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@Needs', () => {
    it('should call orderHistoryRequest', () => {
      expect(orderHistoryRequest).not.toHaveBeenCalled()
      OrderHistoryList.WrappedComponent.needs[0]()
      expect(orderHistoryRequest).toHaveBeenCalledTimes(1)
    })
  })

  describe('@instance', () => {
    describe('@sortOrders', () => {
      it('should sort correctly', () => {
        const orderIds = [
          { orderId: 1000001 },
          { orderId: 1000002 },
          { orderId: 1000000 },
          { orderId: 999999 },
        ]
        const sorted = [1000002, 1000001, 1000000, 999999]

        const { instance } = renderComponent(initialProps)
        const result = instance.sortOrders(orderIds).map((item) => item.orderId)

        expect(result).toEqual(sorted)
      })
    })
  })
})
