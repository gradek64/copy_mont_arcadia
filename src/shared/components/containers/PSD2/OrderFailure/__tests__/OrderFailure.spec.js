import OrderFailure from '../OrderFailure'
import testComponentHelper from 'test/unit/helpers/test-component'

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

const setOrderError = jest.fn()
const sendAnalyticsPaymentMethodPurchaseFailureEvent = jest.fn()

describe('<OrderFailure />', () => {
  const renderComponent = testComponentHelper(OrderFailure.WrappedComponent)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    it('displays a failure message', () => {
      const props = {
        locationQuery: {},
        setOrderError,
        sendAnalyticsPaymentMethodPurchaseFailureEvent,
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@componentDidMount', () => {
    it('redirects the client to /checkout', () => {
      const props = {
        locationQuery: {},
        setOrderError,
        sendAnalyticsPaymentMethodPurchaseFailureEvent,
        isAuthenticated: true,
      }

      const { instance } = renderComponent(props)

      expect(browserHistory.replace).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith('/checkout')
    })

    it('redirects the client to /guest/checkout/payment for a guest user', () => {
      const props = {
        locationQuery: {},
        setOrderError,
        sendAnalyticsPaymentMethodPurchaseFailureEvent,
        isAuthenticated: false,
      }

      const { instance } = renderComponent(props)

      expect(browserHistory.replace).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith(
        '/guest/checkout/payment'
      )
    })

    it('should call setOrderError() to capture an error passed as a query parameter', () => {
      const error = 'test-error'
      const props = {
        locationQuery: {
          error,
        },
        setOrderError,
        sendAnalyticsPaymentMethodPurchaseFailureEvent,
      }

      const { instance } = renderComponent(props)

      expect(setOrderError).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(setOrderError).toHaveBeenCalledTimes(1)
      expect(setOrderError).toHaveBeenCalledWith(error)
    })

    it('should call sendAnalyticsPaymentMethodPurchaseFailureEvent() to report to Google Analytics', () => {
      const orderId = 'test-order-id'
      const paymentMethod = 'test-payment-method'

      const props = {
        locationQuery: {
          orderId,
          paymentMethod,
        },
        setOrderError,
        sendAnalyticsPaymentMethodPurchaseFailureEvent,
      }

      const { instance } = renderComponent(props)

      expect(
        sendAnalyticsPaymentMethodPurchaseFailureEvent
      ).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(
        sendAnalyticsPaymentMethodPurchaseFailureEvent
      ).toHaveBeenCalledTimes(1)
      expect(
        sendAnalyticsPaymentMethodPurchaseFailureEvent
      ).toHaveBeenCalledWith({
        orderId,
        selectedPaymentMethod: paymentMethod,
      })
    })
  })
})
