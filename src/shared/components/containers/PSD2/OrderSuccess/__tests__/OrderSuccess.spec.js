import testComponentHelper from 'test/unit/helpers/test-component'
import OrderSuccess from '../OrderSuccess'
import { deliveryTypes } from '../../../../../selectors/checkoutSelectors'
import { sendEvent } from '../../../../../actions/common/googleAnalyticsActions'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => {
  return {
    browserHistory: {
      push: jest.fn(),
    },
    Link: () => {},
  }
})

jest.mock('../../../../../../client/lib/cookie', () => ({
  getItem: jest.fn(),
}))

global.window.scrollTo = jest.fn()

afterEach(() => {
  jest.resetAllMocks()
})

describe('<OrderSuccess/>', () => {
  const renderComponent = testComponentHelper(
    OrderSuccess.WrappedComponent.WrappedComponent
  )
  const initialProps = {
    isDDPOrderCompleted: false,
    ddpDefaultName: 'Topshop Unlimited',
    isDDPStandaloneOrderCompleted: false,
    brandName: 'topshop',
    stores: [],
    deliveryType: 'HOME',
    orderCompleted: {
      orderId: 1164497,
      subTotal: '',
      returnPossible: false,
      returnRequested: false,
      deliveryMethod: 'UK Standard up to 4 working days',
      deliveryDate: 'Wednesday 15 February 2017',
      deliveryCost: '4.00',
      deliveryCarrier: 'Parcelnet',
      deliveryPrice: '4.00',
      totalOrderPrice: '30.00',
      totalOrdersDiscountLabel: '',
      totalOrdersDiscount: '',
      billingAddress: {
        name: 'Mr john doe',
        address1: 'Unit 1fl, 2 Michael Road',
        address2: 'LONDON',
        address3: 'SW6 2AD',
        country: 'United Kingdom',
      },
      deliveryAddress: {
        name: 'Mr john doe',
        address1: 'Unit 1fl, 2 Michael Road',
        address2: 'LONDON',
        address3: 'SW6 2AD',
        country: 'United Kingdom',
      },
      orderLines: [
        {
          lineNo: '42C39LBLK',
          name: 'CRUMBLE Canvas Flatform Trainers',
          size: 36,
          colour: 'BLACK',
          imageUrl:
            '//media.topshop.com/wcsstore/TopShop/images/catalog/TS42C39LBLK_Small_F_1.jpg',
          quantity: 1,
          unitPrice: '26.00',
          discount: '',
          total: '26.00',
          nonRefundable: false,
        },
      ],
      paymentDetails: [
        {
          paymentMethod: 'Visa',
          cardNumberStar: '************1111',
          totalCost: '??30.00',
          selectedPaymentMethod: 'VISA',
        },
      ],
      currencyConversion: {
        currencyRate: 'GBP',
      },
    },
    currencyCode: 'GBP',
    hasUser: true,
    minLaptop: false,
    orderSubtotal: '26.00',
    deliveryTypes,
    deliveryDate: 'Wednesday 15 February 2017',
    isCollectFromOrder: false,
    sendEvent,
    location: {
      pathname: '/psd2-order-success',
    },
    visited: [],
    checkout: {
      checkoutVersion: 'AAAAA',
    },
    hostname: 'local.m.topshop.com',
    isDiscoverMoreEnabled: false,
    getAccount: jest.fn(),
    resetForm: jest.fn(),
    resetStoreLocator: jest.fn(),
    sendAnalyticsOrderCompleteEvent: jest.fn(),
    sendAnalyticsPurchaseEvent: jest.fn(),
    getOrderCompleteEspot: jest.fn(),
    paymentMethods: [
      {
        value: 'VISA',
        type: 'CARD',
        label: 'Visa',
        description: 'Pay with VISA',
        icon: 'icon-visa.svg',
        validation: {
          cardNumber: {
            length: 16,
            message: 'A 16 digit card number is required',
          },
          cvv: {
            length: 3,
            message: '3 digits required',
          },
          expiryDate: 'MM/YY',
          startDate: null,
        },
      },
      {
        value: 'MCARD',
        type: 'CARD',
        label: 'MasterCard',
        description: 'Pay with MasterCard',
        icon: 'icon-mastercard.svg',
        validation: {
          cardNumber: {
            length: 16,
            message: 'A 16 digit card number is required',
          },
          cvv: {
            length: 3,
            message: '3 digits required',
          },
          expiryDate: 'MM/YY',
          startDate: null,
        },
      },
      {
        value: 'AMEX',
        type: 'CARD',
        label: 'American Express',
        description: 'Pay with American Express',
        icon: 'icon-amex.svg',
        validation: {
          cardNumber: {
            length: 15,
            message: 'A 15 digit card number is required',
          },
          cvv: {
            length: 4,
            message: '4 digits required',
          },
          expiryDate: 'MM/YY',
          startDate: null,
        },
      },
      {
        value: 'SWTCH',
        type: 'CARD',
        label: 'Switch/Maestro',
        description: 'Pay with Switch / Maestro',
        icon: 'icon-switch.svg',
        validation: {
          cardNumber: {
            length: 16,
            message: 'A 16 digit card number is required',
          },
          cvv: {
            length: 3,
            message: '3 digits required',
          },
          expiryDate: 'MM/YY',
          startDate: null,
        },
      },
      {
        value: 'ACCNT',
        type: 'OTHER_CARD',
        label: 'Account Card',
        description: 'Pay with Account Card',
        icon: 'icon-account-card.svg',
        validation: {
          cardNumber: {
            length: 16,
            message: 'A 16 digit card number is required',
          },
          cvv: {
            length: 3,
            message: '3 digits required',
          },
          expiryDate: 'MM/YY',
          startDate: null,
        },
      },
      {
        value: 'PYPAL',
        type: 'OTHER',
        label: 'PayPal',
        description: 'Check out with your PayPal account',
        icon: 'icon-paypal.svg',
      },
      {
        value: 'ALIPY',
        type: 'OTHER',
        label: 'AliPay',
        description: 'Check out with your AliPay account',
        icon: 'icon-alipay.svg',
        billingCountry: ['China'],
      },
      {
        value: 'CUPAY',
        type: 'OTHER',
        label: 'China Union Pay',
        description: 'Check out with your China Union Pay account',
        icon: 'icon-cupay.svg',
        billingCountry: ['China'],
      },
      {
        value: 'KLRNA',
        type: 'OTHER',
        label: 'Klarna',
        description: 'Shop now, Pay later',
        icon: 'icon-klarna.svg',
        region: 'uk',
        deliveryCountry: ['United Kingdom'],
        billingCountry: ['United Kingdom'],
      },
    ],
    setFormField: jest.fn(),
  }

  const parcelProps = (minLaptop = false) => ({
    ...initialProps,
    deliveryType: 'STORE',
    orderCompleted: {
      ...initialProps.orderCompleted,
      deliveryMethod: 'Collect from ParcelShop',
      deliveryCarrier: 'Retail Store Collection',
    },
    stores: [
      {
        storeId: 'TS0001',
        brandId: 12556,
        name: 'Oxford Circus',
        distance: 0.16,
        latitude: 51.5157,
        longitude: -0.141396,
        address: {
          line1: '214 Oxford Street',
          line2: 'Oxford Circus',
          city: 'West End',
          postcode: 'W1W 8LG',
        },
        openingHours: {
          monday: '09:30-21:00',
          tuesday: '09:30-21:00',
          wednesday: '09:30-21:00',
          thursday: '09:30-21:00',
          friday: '09:30-21:00',
          saturday: '09:00-21:00',
          sunday: '11:30-18:00',
        },
        telephoneNumber: '03448 487487',
        collectFromStore: {
          standard: {
            dates: [
              {
                availableUntil: '2017-02-08 11:30:00',
                collectFrom: '2017-02-11',
              },
              {
                availableUntil: '2017-02-09 11:30:00',
                collectFrom: '2017-02-12',
              },
              {
                availableUntil: '2017-02-10 11:30:00',
                collectFrom: '2017-02-13',
              },
            ],
            price: 0,
          },
          express: {
            dates: [
              {
                availableUntil: '2017-02-08 20:30:00',
                collectFrom: '2017-02-09',
              },
              {
                availableUntil: '2017-02-09 20:30:00',
                collectFrom: '2017-02-10',
              },
              {
                availableUntil: '2017-02-10 20:30:00,',
                collectFrom: '2017-02-11',
              },
            ],
            price: 3,
          },
        },
      },
    ],
    minLaptop,
    isCollectFromOrder: true,
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      const prevCookie = global.document.cookie
      const prevBrowser = process.browser

      afterAll(() => {
        global.document.cookie = prevCookie
        process.browser = prevBrowser
      })

      it('updates cookie value "bagCount" to zero if greater than zero', () => {
        const props = {
          ...initialProps,
          isDiscoverMoreEnabled: true,
          isMobile: false,
        }

        global.document.cookie = 'bagCount=5;'
        process.browser = true

        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(document.cookie).toEqual('bagCount=0')
      })

      it('setOrderCompleteEspot should be called when FF is active on desktop', () => {
        const props = {
          ...initialProps,
          isDiscoverMoreEnabled: true,
          isMobile: false,
        }
        const { instance } = renderComponent(props)
        expect(props.getOrderCompleteEspot).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(props.getOrderCompleteEspot).toHaveBeenCalledTimes(1)
      })

      it('goes to the home page if guest user refreshes the thank you page', () => {
        const props = {
          ...parcelProps(),
          orderCompleted: {},
          orderError: false,
          isAuthenticated: false,
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith('/')
      })

      it('should call setFormField if it is a guest order with no registered email', () => {
        const props = {
          ...initialProps,
          orderCompleted: {
            isGuestOrder: true,
            isRegisteredEmail: false,
          },
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(props.setFormField).toHaveBeenCalled()
      })

      it('should not call setFormField if it is a guest order with registered email', () => {
        const props = {
          ...initialProps,
          orderCompleted: {
            isGuestOrder: true,
            isRegisteredEmail: true,
          },
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(props.setFormField).not.toHaveBeenCalled()
      })

      it('should not call setFormField if it is not a guest order', () => {
        const props = {
          ...initialProps,
          orderCompleted: {
            isGuestOrder: false,
            isRegisteredEmail: true,
          },
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(props.setFormField).not.toHaveBeenCalled()
      })
    })

    describe('on componentWillUnmount', () => {
      it('should call resetStoreLocator', () => {
        const { instance } = renderComponent(initialProps)
        expect(initialProps.resetStoreLocator).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(initialProps.resetStoreLocator).toHaveBeenCalledTimes(1)
      })

      it('should call resetForm', () => {
        const { instance } = renderComponent(initialProps)
        expect(initialProps.resetForm).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(initialProps.resetForm).toHaveBeenCalledTimes(2)
      })
    })
  })
})
