import deepFreeze from 'deep-freeze'
import * as analyticsMiddleware from '../analytics-middleware'
import * as siteInteractions from '../../../../shared/analytics/tracking/site-interactions'
import { omit } from 'ramda'
import { ANALYTICS_ACTION } from '../../../../shared/analytics/analytics-constants'
import { setupAnalyticsActionListeners } from '../analytics-action-listeners'

jest.mock('../analytics-middleware')
jest.mock('../../../../shared/analytics/tracking/site-interactions')

describe('Analytics action listeners', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('setupAnalyticsActionListeners()', () => {
    it('should listen for the correct actions', () => {
      setupAnalyticsActionListeners()
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_API_RESPONSE_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_CLICK_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_ERROR_MESSAGE,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_PRODUCT_CLICK_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_DISPLAY_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_INPUT_VALIDATION_STATUS,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_PAYMENT_METHOD_SELECTION_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_DELIVERY_OPTION_CHANGE_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_DELIVERY_METHOD_CHANGE_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_FILTER_USED_EVENT,
        expect.any(Function)
      )
      expect(analyticsMiddleware.addPreDispatchListeners).toHaveBeenCalledWith(
        ANALYTICS_ACTION.SEND_ORDER_COMPLETE_EVENT,
        expect.any(Function)
      )
    })

    describe('ANALYTICS_ACTION.SEND_API_RESPONSE_EVENT pre-dispatch listener', () => {
      it('should push the correctly mapped click event', () => {
        expect(siteInteractions.pushApiResponseEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const payload = {
          apiEndpoint: '/getAccount',
          responseCode: 200,
        }

        const clickEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[0][1]
        clickEventListener({
          payload,
        })
        expect(siteInteractions.pushApiResponseEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushApiResponseEvent).toHaveBeenCalledWith(
          payload
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_CLICK_EVENT pre-dispatch listener', () => {
      it('should push the correctly mapped click event', () => {
        expect(siteInteractions.pushClickEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()

        const clickEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[1][1]
        clickEventListener({
          payload: {
            category: 'root vegetables',
            action: 'harvest',
            label: 'potato',
            value: 'priceless',
          },
        })
        expect(siteInteractions.pushClickEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushClickEvent).toHaveBeenCalledWith({
          ec: 'root vegetables',
          ea: 'harvest',
          el: 'potato',
          ev: 'priceless',
        })
      })
    })

    describe('ANALYTICS_ACTION.SEND_ERROR_MESSAGE pre-dispatch listener', () => {
      it('should push the correct error message event', () => {
        expect(siteInteractions.pushClickEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()

        const errorMessageListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[2][1]
        const errorMessage = 'I am error.'
        errorMessageListener({ errorMessage })
        expect(siteInteractions.pushErrorMessage).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushErrorMessage).toHaveBeenCalledWith(
          errorMessage
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_PRODUCT_CLICK_EVENT pre-dispatch listener', () => {
      const payload = deepFreeze({
        name: "big ol' hat",
        id: 123456,
        price: '1 000 000.00',
        brand: 'topshop',
        category: 'hat',
        position: 3,
        listType: 'some list view',
      })

      it('should push the correct click event', () => {
        expect(siteInteractions.pushProductClickEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()

        const clickEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[3][1]
        clickEventListener({ payload })
        expect(siteInteractions.pushProductClickEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushProductClickEvent).toHaveBeenCalledWith(
          {
            ...payload,
            listType: undefined,
          },
          payload.listType
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_DISPLAY_EVENT pre-dispatch listener', () => {
      it('should push the correct error message event', () => {
        setupAnalyticsActionListeners()
        const displayEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[4][1]
        const payload = 'foo'
        const eventName = 'bar'
        displayEventListener({ payload, eventName })
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledWith(
          payload,
          eventName
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_INPUT_VALIDATION_STATUS pre-dispatch listener', () => {
      const payload = deepFreeze({
        id: 'some id',
        validationStatus: 'success',
      })
      it('should push the correct validation event', () => {
        expect(
          siteInteractions.pushInputValidationStatus
        ).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const clickEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[5][1]
        clickEventListener(payload)
        expect(siteInteractions.pushInputValidationStatus).toHaveBeenCalledWith(
          {
            id: 'some id',
            validationStatus: 'success',
          }
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_PAYMENT_METHOD_SELECTION_EVENT pre-dispatch listener', () => {
      it('should push the correct display event', () => {
        expect(siteInteractions.pushDisplayEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const displayEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[6][1]
        const payload = 'foo'
        const eventName = 'bar'
        displayEventListener({ payload, eventName })
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledWith(
          payload,
          eventName
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_PAYMENT_METHOD_INTENTION_EVENT pre-dispatch listener', () => {
      it('should push the correct display event', () => {
        expect(siteInteractions.pushDisplayEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const displayEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[7][1]
        const payload = 'foo'
        const eventName = 'bar'
        displayEventListener({ payload, eventName })
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledWith(
          payload,
          eventName
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_SUCCESS_EVENT pre-dispatch listener', () => {
      it('should push the correct display event', () => {
        expect(siteInteractions.pushDisplayEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const displayEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[8][1]
        const payload = 'foo'
        const eventName = 'bar'
        displayEventListener({ payload, eventName })
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledWith(
          payload,
          eventName
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT pre-dispatch listener', () => {
      it('should push the correct display event', () => {
        expect(siteInteractions.pushDisplayEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const displayEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[9][1]
        const payload = 'foo'
        const eventName = 'bar'
        displayEventListener({ payload, eventName })
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledTimes(1)
        expect(siteInteractions.pushDisplayEvent).toHaveBeenCalledWith(
          payload,
          eventName
        )
      })
    })

    describe('ANALYTICS_ACTION.SEND_DELIVERY_OPTION_CHANGED_EVENT pre-dispatch listener', () => {
      const deliveryOptionMap = {
        HOME: 'Home Delivery',
        STORE: 'Collect from Store',
        PARCELSHOP: 'Collect from ParcelShop',
      }

      Object.entries(deliveryOptionMap).forEach(
        ([deliveryLocationType, deliveryOption]) => {
          it(`should push the correct deliveryOption event for delivery location type '${deliveryLocationType}'`, () => {
            expect(
              siteInteractions.pushDeliveryOptionChangeEvent
            ).not.toHaveBeenCalled()
            setupAnalyticsActionListeners()

            const deliveryOptionChangeEventListener =
              analyticsMiddleware.addPreDispatchListeners.mock.calls[10][1]
            deliveryOptionChangeEventListener({ deliveryLocationType })
            expect(
              siteInteractions.pushDeliveryOptionChangeEvent
            ).toHaveBeenCalledTimes(1)
            expect(
              siteInteractions.pushDeliveryOptionChangeEvent
            ).toHaveBeenCalledWith(deliveryOption)
          })
        }
      )
    })

    describe('ANALYTICS_ACTION.SEND_DELIVERY_METHOD_CHANGE_EVENT pre-dispatch listener', () => {
      it('should push the correct deliveryMethod event for', () => {
        expect(
          siteInteractions.pushDeliveryMethodChangeEvent
        ).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()
        const deliveryMethod = 'Drone'
        const deliveryMethodChangeEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[11][1]
        deliveryMethodChangeEventListener(deliveryMethod)
        expect(
          siteInteractions.pushDeliveryMethodChangeEvent
        ).toHaveBeenCalledTimes(1)
        expect(
          siteInteractions.pushDeliveryMethodChangeEvent
        ).toHaveBeenCalledWith(deliveryMethod)
      })
    })
    describe('ANALYTICS_ACTION.SEND_FILTER_USED_EVENT pre-dispatch listener', () => {
      it('should push the correct payload', () => {
        expect(siteInteractions.pushFilterUsedEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()

        const filterUsedEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[12][1]
        const payload = 'foo'
        const eventName = 'bar'
        filterUsedEventListener({ payload, eventName })
        expect(siteInteractions.pushFilterUsedEvent).toHaveBeenCalledWith({
          payload,
          eventName,
        })
      })
    })

    describe('ANALYTICS_ACTION.SEND_ORDER_COMPLETE_EVENT pre-dispatch listener', () => {
      it('should push the correct payload', () => {
        expect(siteInteractions.pushOrderCompleteEvent).not.toHaveBeenCalled()
        setupAnalyticsActionListeners()

        const orderCompleteEventListener =
          analyticsMiddleware.addPreDispatchListeners.mock.calls[13][1]
        const payload = {
          deliveryMethod: 'Next Day',
          orderId: 121231,
          paymentDetails: [{ paymentMethod: 'VISA' }],
          returning_buyer: true,
        }
        const eventName = 'bar'
        orderCompleteEventListener({ payload, eventName })
        expect(siteInteractions.pushOrderCompleteEvent).toHaveBeenCalledWith({
          ...omit(['paymentDetails'], payload),
          paymentMethods: ['VISA'],
        })
      })
    })
  })
})
