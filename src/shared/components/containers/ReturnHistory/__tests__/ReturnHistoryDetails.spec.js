import testComponentHelper from 'test/unit/helpers/test-component'
import ReturnHistoryDetails, { mapStateToProps } from '../ReturnHistoryDetails'
import AccountHeader from '../../../common/AccountHeader/AccountHeader'
import ReturnHistoryDetailsSummary from '../ReturnHistoryDetailsSummary'
import ReturnHistoryDetailsPayment from '../ReturnHistoryDetailsPayment'
import NotFound from '../../OrderListContainer/NotFound'
import ReturnHistoryOrder from '../ReturnHistoryOrder'

import {
  returnHistoryRequest,
  returnHistoryDetailsRequest,
} from '../../../../actions/common/accountActions'

jest.mock('../../../../actions/common/accountActions', () => ({
  returnHistoryRequest: jest.fn(),
  returnHistoryDetailsRequest: jest.fn(),
}))

describe('ReturnHistoryDetails', () => {
  beforeEach(() => jest.resetAllMocks())

  const renderComponent = testComponentHelper(
    ReturnHistoryDetails.WrappedComponent
  )

  const order = {
    lineNo: '19M43JRED',
    name: 'Pizza Princess Padded Sticker',
    size: 'ONE',
    colour: 'RED',
    imageUrl:
      'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS19M43JRED_Small_F_1.jpg',
    returnQuantity: 1,
    returnReason: 'Colour not as description',
    unitPrice: '',
    discount: '',
    total: '0.50',
    nonRefundable: false,
  }

  const baseProps = {
    rmaId: 88506,
    orderId: 1303603,
    subTotal: '0.50',
    deliveryPrice: '0.00',
    totalOrderPrice: '0.50',
    totalOrdersDiscountLabel: '',
    totalOrdersDiscount: '£0.00',
    orderLines: [
      {
        lineNo: '19M43JRED',
        name: 'Pizza Princess Padded Sticker',
        size: 'ONE',
        colour: 'RED',
        imageUrl:
          'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS19M43JRED_Small_F_1.jpg',
        returnQuantity: 1,
        returnReason: 'Colour not as description',
        unitPrice: '',
        discount: '',
        total: '0.50',
        nonRefundable: false,
      },
    ],
    paymentDetails: [
      {
        paymentMethod: 'Visa',
        cardNumberStar: '************4258',
        totalCost: '£0.50',
      },
    ],
  }

  const initialProps = {
    params: {
      id: 88506,
      param: 1303603,
    },
    isMobile: true,
    visited: [],
    returns: [
      {
        orderId: 1303603,
        date: '02 December 2016',
        status: 'Fully Refunded',
        statusCode: 'r',
        total: '£39.50',
        rmaId: '88506',
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
    returnDetails: baseProps,
    setReturnHistoryDetails: jest.fn(),
    returnHistoryDetailsRequest: jest.fn(),
  }

  const requiredState = {
    viewport: {
      media: 'mobile',
    },
    routing: {
      visited: false,
    },
  }

  const returnsHistoryState = {
    ...requiredState,
    returnHistory: {
      returnDetails: baseProps,
      returns: initialProps.returns,
    },
    paymentMethods: [
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
      {
        value: 'ACCNT',
        type: 'OTHER_CARD',
        label: 'Account Card',
        description: 'Pay with Account Card',
        icon: 'icon_account-card.svg',
      },
      {
        value: 'PYPAL',
        type: 'OTHER',
        label: 'Paypal',
        description: 'Check out with your PayPal account',
        icon: 'icon_paypal.svg',
      },
    ],
  }

  describe('@mapStateToProps', () => {
    it('should decorate the payment details of the return with data from the relevant payment methods', () => {
      const props = mapStateToProps(returnsHistoryState)
      expect(props).toEqual({
        isMobile: true,
        visited: false,
        returnDetails: {
          ...baseProps,
          paymentDetails: [
            {
              paymentMethod: 'Visa',
              cardNumberStar: '************4258',
              totalCost: '£0.50',
              type: 'CARD',
              value: 'VISA',
              icon: 'icon_visa.svg',
            },
          ],
        },
        returns: initialProps.returns,
      })
    })
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({ params: {}, returnDetails: {} }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@dom check', () => {
    // using tdd so not sure about using snapshop
    let currentWrapped

    beforeEach(() => {
      const { wrapper } = renderComponent(initialProps)
      currentWrapped = wrapper
    })

    it('should have an outer div', () => {
      expect(currentWrapped.find('section').length).toBe(1)
    })

    describe('AccountHeader', () => {
      it('should have an AccountHeader component', () => {
        expect(currentWrapped.find(AccountHeader).length).toBe(1)
      })

      it('should have AccountHeader with correct link', () => {
        expect(currentWrapped.find(AccountHeader).prop('link')).toBe(
          '/my-account/return-history'
        )
      })

      it('should have an AccountHeader with correct title', () => {
        expect(currentWrapped.find(AccountHeader).prop('title')).toBe(
          'Return Details'
        )
      })
    })

    describe('OrderHistoryDetailsNumber', () => {
      it('should have an order number with label and with correct order id', () => {
        expect(
          currentWrapped.find('.ReturnHistoryDetails-orderNumberLabel').length
        ).toBe(1)
        expect(
          currentWrapped.find('.ReturnHistoryDetails-orderNumberLabel').text()
        ).toBe('Order Number:')
        expect(
          currentWrapped.find('.ReturnHistoryDetails-orderNumber').length
        ).toBe(1)
        expect(
          currentWrapped
            .find('.ReturnHistoryDetails-orderNumber')
            .find('strong')
            .text()
        ).toBe(baseProps.orderId.toString())
      })
    })

    describe('ReturnHistoryDetailsSummary', () => {
      it('should have a ReturnHistoryDetailsSummary component', () => {
        expect(currentWrapped.find(ReturnHistoryDetailsSummary).length).toBe(1)
      })
    })

    describe('ReturnHistoryDetailsSummary', () => {
      it('should have a ReturnHistoryDetailsPayment component', () => {
        expect(currentWrapped.find(ReturnHistoryDetailsPayment).length).toBe(1)
      })
    })

    describe('Orders', () => {
      it('should have a NotFound component if orderLines prop array is empty', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          returnDetails: {
            totalOrderPrice: '0.0',
            totalOrdersDiscount: '0.0',
            orderLines: [],
            orderId: '12345',
          },
        })
        expect(wrapper.find(NotFound).length).toBe(1)
      })

      it('should have a NotFound component if no orderLines array does not exist', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          returnDetails: {
            totalOrderPrice: '0.0',
            totalOrdersDiscount: '0.0',
            orderLines: false,
            orderId: '12345',
          },
        })

        expect(wrapper.find(NotFound).length).toBe(1)
      })

      it('should have a single ReturnHistoryOrderComponent if orderLines array length is 1', () => {
        expect(currentWrapped.find(ReturnHistoryOrder).length).toBe(1)
      })

      it('should have ReturnHistoryOrderComponent equal to OrderLines length', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          returnDetails: {
            totalOrderPrice: '0.0',
            totalOrdersDiscount: '0.0',
            orderLines: [order, order],
            orderId: '12345',
          },
        })
        expect(wrapper.find(ReturnHistoryOrder).length).toBe(2)
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('should NOT call returnHistoryDetailsRequest if visited length is 1 or less', () => {
        const { instance } = renderComponent(initialProps)

        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
      })

      it('should NOT call returnHistoryDetailsRequest if visited length is 0', () => {
        const { instance } = renderComponent({ ...initialProps, visited: [1] })

        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
      })

      it('should NOT call returnHistoryDetailsRequest if visited length is more than 1 but with same rmaId', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/my-account', '/my-account/details'],
        })
        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
      })

      it('should call returnHistoryDetailsRequest if visited length is more than 1 but with different rmaId', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: [1, 2],
          params: {
            id: 885334,
            param: 1303603,
          },
        })
        expect(
          instance.props.returnHistoryDetailsRequest
        ).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.returnHistoryDetailsRequest).toHaveBeenCalled()
      })

      it('should call returnHistoryDetailsRequest with correct arguments', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: [1, 2],
          params: {
            id: 885334,
            param: 1303603,
          },
        })
        instance.componentDidMount()
        expect(instance.props.returnHistoryDetailsRequest).toHaveBeenCalledWith(
          1303603,
          885334
        )
      })
    })
  })

  describe('@instance', () => {
    describe('setOrderComponent', () => {
      it('returns not found if there are no orders', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.setOrderComponent(undefined)).toMatchSnapshot()
      })
      it('returns with the orders if there is any', () => {
        const { instance } = renderComponent(initialProps)
        const { orderLines } = baseProps
        expect(instance.setOrderComponent(orderLines)).toMatchSnapshot()
      })
    })

    describe('@needs', () => {
      it('should call returnHistoryRequest', () => {
        expect(returnHistoryRequest).not.toHaveBeenCalled()
        expect(returnHistoryDetailsRequest).not.toHaveBeenCalled()

        ReturnHistoryDetails.WrappedComponent.needs[0](1, 3)
        expect(returnHistoryDetailsRequest).toHaveBeenCalledTimes(1)

        ReturnHistoryDetails.WrappedComponent.needs[1]()
        expect(returnHistoryRequest).toHaveBeenCalledTimes(1)
      })
    })
  })
})
