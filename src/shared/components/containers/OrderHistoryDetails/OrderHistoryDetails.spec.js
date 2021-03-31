import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import OrderHistoryDetails, { mapStateToProps } from './OrderHistoryDetails'
import { orderHistoryDetailsRequest } from '../../../actions/common/accountActions'

jest.mock('../../../actions/common/accountActions', () => ({
  orderHistoryDetailsRequest: jest.fn(),
}))

describe('<OrderHistoryDetails />', () => {
  const renderComponent = testComponentHelper(
    OrderHistoryDetails.WrappedComponent.WrappedComponent
  )

  const orderDetails = {
    paymentDetails: [
      {
        paymentMethod: 'American Express',
        cardNumberStar: '***********0009',
        totalCost: '£13.95',
      },
    ],
  }

  const paymentMethods = [
    {
      value: 'VISA',
      type: 'CARD',
      label: 'Visa',
      description: 'Pay with VISA',
      icon: 'icon_visa.svg',
    },
    {
      value: 'AMEX',
      type: 'CARD',
      label: 'American Express',
      description: 'Pay with American Express',
      icon: 'icon_amex.svg',
    },
  ]

  const initialProps = {
    params: {
      param: 10,
    },
    visited: ['site1', 'site2'],
    location: {
      param: 20,
    },
    orderDetails: {},
  }

  const requiredState = {
    routing: {
      visited: false,
    },
  }

  const orderHistoryState = {
    ...requiredState,
    orderHistory: {
      orders: [],
      orderDetails,
    },
    paymentMethods,
  }

  describe('@decorators', () => {
    analyticsDecoratorHelper(OrderHistoryDetails, 'order-details', {
      componentName: 'OrderHistoryDetails',
      isAsync: true,
      redux: true,
    })
  })

  describe('@needs', () => {
    const orderHistoryDetailReqWrapper =
      OrderHistoryDetails.WrappedComponent.WrappedComponent.needs[0]
    const fakeLocationObj = {
      param: 'someOrderId',
    }
    orderHistoryDetailReqWrapper(fakeLocationObj)
    expect(orderHistoryDetailsRequest).toHaveBeenCalledWith(
      fakeLocationObj.param
    )
  })

  describe('@mapStateToProps', () => {
    it('should decorate the payment details of the order with data from the relevant payment methods', () => {
      const props = mapStateToProps(orderHistoryState)
      expect(props).toEqual({
        visited: false,
        orderDetails: {
          ...orderDetails,
          paymentDetails: [
            {
              paymentMethod: 'American Express',
              cardNumberStar: '***********0009',
              totalCost: '£13.95',
              type: 'CARD',
              value: 'AMEX',
              icon: 'icon_amex.svg',
            },
          ],
        },
      })
    })
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with orderDetails', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderDetails: { orderId: 234 },
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle methods', () => {
    beforeEach(() => {
      global.process.browser = true
    })
    describe('@UNSAFE_componentWillMount', () => {
      beforeEach(() => jest.resetAllMocks())
      it('should NOT call setOrderHistoryDetails method if no orderId', () => {
        const { instance } = renderComponent({
          ...initialProps,
          setOrderHistoryDetails: jest.fn(),
          orderHistoryDetailsRequest: jest.fn(),
        })
        expect(instance.props.setOrderHistoryDetails).not.toHaveBeenCalled()
      })
      it('should NOT call setOrderHistoryDetails method if orderId is equal to value from params', () => {
        const { instance } = renderComponent({
          ...initialProps,
          orderDetails: { orderId: 10 },
          setOrderHistoryDetails: jest.fn(),
          orderHistoryDetailsRequest: jest.fn(),
        })
        expect(instance.props.setOrderHistoryDetails).not.toHaveBeenCalled()
      })
      it('should call setOrderHistoryDetails method if orderId is not equal to value from params', () => {
        const { instance } = renderComponent({
          ...initialProps,
          orderDetails: { orderId: 20 },
          setOrderHistoryDetails: jest.fn(),
          orderHistoryDetailsRequest: jest.fn(),
        })
        expect(instance.props.setOrderHistoryDetails).toHaveBeenCalledTimes(1)
      })
      it('should NOT call orderHistoryDetailsRequest method if visited less than 1', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: [],
          orderHistoryDetailsRequest: jest.fn(),
        })
        expect(instance.props.orderHistoryDetailsRequest).not.toHaveBeenCalled()
      })
      it('should call orderHistoryDetailsRequest method if visited more than 1', () => {
        const { instance } = renderComponent({
          ...initialProps,
          orderHistoryDetailsRequest: jest.fn(),
        })
        expect(instance.props.orderHistoryDetailsRequest).toHaveBeenCalledTimes(
          1
        )
        expect(instance.props.orderHistoryDetailsRequest).toHaveBeenCalledWith(
          10
        )
      })
    })
  })
})
