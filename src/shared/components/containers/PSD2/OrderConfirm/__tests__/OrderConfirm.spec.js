import deepFreeze from 'deep-freeze'
import OrderConfirm from '../OrderConfirm'
import testComponentHelper from 'test/unit/helpers/test-component'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

const requiredActions = {
  ajaxCounter: jest.fn(),
  psd2ConfirmOrder: jest.fn(() => Promise.resolve()),
  sendAnalyticsOrderCompleteEvent: jest.fn(),
  sendAnalyticsPaymentMethodPurchaseSuccessEvent: jest.fn(),
  sendAnalyticsPurchaseEvent: jest.fn(),
}

describe('<OrderConfirm />', () => {
  const renderComponent = testComponentHelper(OrderConfirm.WrappedComponent)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    it('displays a confirmation message', () => {
      const props = {
        ...requiredActions,
        orderCompleted: {
          orderId: 'test-order-id',
        },
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@componentDidMount', () => {
    it('confirms the order', async () => {
      const props = {
        ...requiredActions,
        orderCompleted: {},
      }

      const { instance } = renderComponent(props)

      const params = deepFreeze({
        catalogId: 'test-catalog-id',
        ga: 'test-ga',
        hostname: 'test-hostname',
        orderId: 'test-order-id',
        storeId: 'test-store-id',
      })

      const path = `/psd2-order-confirm?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`

      window.history.pushState({}, 'Test Title', path)

      expect(requiredActions.ajaxCounter).not.toHaveBeenCalled()
      expect(requiredActions.psd2ConfirmOrder).not.toHaveBeenCalled()
      await instance.componentDidMount()
      expect(requiredActions.ajaxCounter).toHaveBeenCalledTimes(2)
      expect(requiredActions.ajaxCounter.mock.calls[0][0]).toEqual('increment')
      expect(requiredActions.ajaxCounter.mock.calls[1][0]).toEqual('decrement')
      expect(requiredActions.psd2ConfirmOrder).toHaveBeenCalledTimes(1)
      expect(requiredActions.psd2ConfirmOrder).toHaveBeenCalledWith(params)
    })
  })

  describe('@componentDidUpdate', () => {
    it('redirects the client to /psd2-order-success', () => {
      const orderId = 'test-order-id'

      const props = {
        ...requiredActions,
        orderCompleted: {
          orderId,
        },
      }

      const { instance } = renderComponent(props)

      expect(browserHistory.push).not.toHaveBeenCalled()
      instance.componentDidUpdate()
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith(
        `/psd2-order-success/${orderId}`
      )
    })

    it('redirects the client to /psd2-order-failure when orderError is set', () => {
      const props = {
        ...requiredActions,
        orderCompleted: {
          orderId: 'test-order-id',
        },
        orderError: 'test-error-message',
      }

      const { instance } = renderComponent(props)

      expect(browserHistory.push).not.toHaveBeenCalled()
      instance.componentDidUpdate()
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith('/psd2-order-failure')
    })

    it('redirects the client to /psd2-order-failure with payment details when orderError is set', () => {
      const orderId = 'test-order-id'
      const paymentMethod = 'test-payment-method'
      const props = {
        ...requiredActions,
        orderCompleted: {
          orderId,
        },
        orderError: 'test-error-message',
        orderErrorPaymentDetails: {
          orderId,
          paymentMethod,
        },
      }

      const { instance } = renderComponent(props)

      expect(browserHistory.push).not.toHaveBeenCalled()
      instance.componentDidUpdate()
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith(
        `/psd2-order-failure?paymentMethod=${paymentMethod}&orderId=${orderId}`
      )
    })

    it('sends hits to Google Analytics', () => {
      const orderId = 'test-order-id'
      const selectedPaymentMethod = 'test-payment-method'
      const orderCompleted = deepFreeze({
        orderId,
        paymentDetails: [{ selectedPaymentMethod }],
      })

      const props = {
        ...requiredActions,
        orderCompleted,
      }

      const { instance } = renderComponent(props)

      expect(
        requiredActions.sendAnalyticsOrderCompleteEvent
      ).not.toHaveBeenCalled()
      expect(
        requiredActions.sendAnalyticsPaymentMethodPurchaseSuccessEvent
      ).not.toHaveBeenCalled()
      expect(requiredActions.sendAnalyticsPurchaseEvent).not.toHaveBeenCalled()
      instance.componentDidUpdate()
      expect(
        requiredActions.sendAnalyticsOrderCompleteEvent
      ).toHaveBeenCalledTimes(1)
      expect(
        requiredActions.sendAnalyticsOrderCompleteEvent
      ).toHaveBeenCalledWith(orderCompleted)
      expect(
        requiredActions.sendAnalyticsPaymentMethodPurchaseSuccessEvent
      ).toHaveBeenCalledTimes(1)
      expect(
        requiredActions.sendAnalyticsPaymentMethodPurchaseSuccessEvent
      ).toHaveBeenCalledWith({
        orderId,
        selectedPaymentMethod,
      })
      expect(requiredActions.sendAnalyticsPurchaseEvent).toHaveBeenCalledTimes(
        1
      )
    })
  })

  describe('@componentWillUnmount', () => {
    it('hides the <LoaderOverlay />', () => {
      const props = {
        ...requiredActions,
        orderCompleted: {
          orderId: 'test-order-id',
        },
      }

      const { instance } = renderComponent(props)

      instance.componentWillUnmount()
      expect(requiredActions.ajaxCounter).toHaveBeenCalledTimes(1)
      expect(requiredActions.ajaxCounter).toHaveBeenCalledWith('decrement')
    })
  })
})
