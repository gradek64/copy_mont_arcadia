import deepFreeze from 'deep-freeze'
import dataLayer from '../../dataLayer'
import * as siteInteractions from '../site-interactions'

import { calculatePayloadSize } from '../../analytics-utils'
import { nrBrowserLogError } from '../../../../client/lib/logger'

jest.mock('../../analytics-utils', () => ({
  calculatePayloadSize: jest.fn(() => 0),
}))

jest.mock('../../../../client/lib/logger', () => ({
  nrBrowserLogError: jest.fn(),
}))

describe('Analytics - site interaction', () => {
  const fakeAction = 'some action'

  const originalProcessBrowser = global.process.browser

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(dataLayer, 'push')
    global.process.browser = true
  })

  afterEach(() => {
    global.process.browser = originalProcessBrowser
  })

  describe('pushApiResponseEvent()', () => {
    it('should push the correct event into the data layer', () => {
      const payload = {
        apiEndpoint: '/getAccount',
        responseCode: 200,
      }
      siteInteractions.pushApiResponseEvent(payload)
      expect(dataLayer.push).toHaveBeenCalledWith(payload, null, 'apiResponse')
    })

    describe('when process.browser is falsy', () => {
      it('should not push the correct event into the data layer', () => {
        global.process.browser = false
        const payload = {
          apiEndpoint: '/getAccount',
          responseCode: 200,
        }
        siteInteractions.pushApiResponseEvent(payload)
        expect(dataLayer.push).not.toHaveBeenCalledWith(
          payload,
          null,
          'apiResponse'
        )
      })
    })
  })

  describe('pushClickEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        siteInteractions.pushClickEvent({
          ec: 'fish',
          ea: 'frog',
          el: 'lemming',
          ev: 'vole',
          foo: 'bar',
        })
        expect(dataLayer.push).toHaveBeenCalledWith(
          {
            ec: 'fish',
            ea: 'frog',
            el: 'lemming',
            ev: 'vole',
            foo: 'bar',
          },
          null,
          'clickevent'
        )
      })

      it('should provide correct defaults for unsupplied values', () => {
        siteInteractions.pushClickEvent({})
        expect(dataLayer.push).toHaveBeenCalledWith(
          {
            ec: '',
            ea: '',
            el: 'https://www.topshop.com/',
            ev: '',
          },
          null,
          'clickevent'
        )
      })
    })

    describe('when process.browser is falsy', () => {
      it('should not push anything into the data layer', () => {
        global.process.browser = false
        siteInteractions.pushClickEvent({})
        expect(dataLayer.push).not.toHaveBeenCalled()
      })
    })
  })

  describe('pushErrorMessage()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        const errorMessage = 'I am broken.'
        siteInteractions.pushErrorMessage(errorMessage)
        expect(dataLayer.push).toHaveBeenCalledWith(
          { errorMessage },
          null,
          'errorMessage'
        )
      })
    })

    describe('when process.browser is falsy', () => {
      it('should not push anything into the data layer', () => {
        global.process.browser = false
        siteInteractions.pushErrorMessage('foo')
        expect(dataLayer.push).not.toHaveBeenCalled()
      })
    })
  })

  describe('analyticsGlobalNavClickEvent()', () => {
    it('should push the correct event into the data layer', () => {
      siteInteractions.analyticsGlobalNavClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          ec: 'globalnavigation',
          ea: fakeAction,
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsPlpClickEvent()', () => {
    it('should push the correct event into the data layer', () => {
      siteInteractions.analyticsPlpClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          ec: 'plp',
          ea: fakeAction,
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsSearchClickEvent()', () => {
    it('should push the correct event into the data layer', () => {
      siteInteractions.analyticsSearchClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          ec: 'search',
          ea: fakeAction,
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsShoppingBagClickEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      const fakeAction = deepFreeze({
        action: 'fakeAction',
      })
      siteInteractions.analyticsShoppingBagClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          action: fakeAction.action,
          ea: '',
          ec: 'shoppingBag',
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsPdpClickEvent()', () => {
    it('should push the correct event into the data layer', () => {
      siteInteractions.analyticsPdpClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          ec: 'pdp',
          ea: fakeAction,
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsRegisterClickEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      const fakeAction = deepFreeze({
        action: 'fakeAction',
      })
      siteInteractions.analyticsRegisterClickEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          action: fakeAction.action,
          ea: '',
          ec: 'register',
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })
  describe('analyticsBagDrawerCheckoutClickEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      siteInteractions.analyticsBagDrawerCheckoutClickEvent(
        'my-page-type',
        'my-action-name'
      )
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        {
          ec: 'my-page-type',
          ea: 'my-action-name',
          el: 'https://www.topshop.com/',
          ev: '',
        },
        null,
        'clickevent'
      )
    })
  })

  describe('analyticsErrorEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      const fakeAction = deepFreeze({
        action: 'fakeAction',
      })
      siteInteractions.analyticsErrorEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        fakeAction,
        null,
        'errorMessage'
      )
    })
  })

  describe('analyticsErrorEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      const fakeAction = deepFreeze({
        action: 'fakeAction',
      })
      siteInteractions.analyticsErrorEvent(fakeAction)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        fakeAction,
        null,
        'errorMessage'
      )
    })
  })

  describe('pushProductClickEvent()', () => {
    describe('when process.browser is truthy', () => {
      const productObj = deepFreeze({
        name: "big ol' hat",
        id: 123456,
        price: '1 000 000.00',
        brand: 'topshop',
        category: 'hat',
        position: 3,
      })
      const list = 'some list view'

      it('should push the correct event into the data layer', () => {
        siteInteractions.pushProductClickEvent(productObj, list)
        expect(dataLayer.push).toHaveBeenCalledWith(
          {
            ecommerce: {
              click: {
                actionField: { list },
                products: [productObj],
              },
            },
          },
          'productClickSchema',
          'productClick'
        )
      })
    })

    describe('when process.browser is falsy', () => {
      it('should not push anything into the data layer', () => {
        global.process.browser = false
        siteInteractions.pushProductClickEvent({}, 'some list')
        expect(dataLayer.push).not.toHaveBeenCalled()
      })
    })
  })

  describe('pushDisplayEvent()', () => {
    it('pushes the correct event into the data layer', () => {
      const payload = 'foo'
      const eventName = 'bar'
      siteInteractions.pushDisplayEvent(payload, eventName)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(payload, null, eventName)
    })
    it('should not call dataLayer.push if called on server', () => {
      global.process.browser = false
      siteInteractions.pushDisplayEvent()
      expect(dataLayer.push).toHaveBeenCalledTimes(0)
    })
  })

  describe('pushDeliveryOptionChangeEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        const deliveryOption = 'Greetings, human.'
        siteInteractions.pushDeliveryOptionChangeEvent(deliveryOption)
        expect(dataLayer.push).toHaveBeenCalledWith(
          { deliveryOption },
          null,
          'deliveryOptionChanged'
        )
      })
    })

    describe('when process.browser is falsy', () => {
      it('should not push anything into the data layer', () => {
        global.process.browser = false
        siteInteractions.pushDeliveryOptionChangeEvent('foo')
        expect(dataLayer.push).not.toHaveBeenCalled()
      })
    })
  })

  describe('pushInputValidationStatus()', () => {
    const payload = { id: 'alskdfj', validationStatus: 'skdhfs' }
    it('should push the correct event into the data layer', () => {
      siteInteractions.pushInputValidationStatus(payload)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(
        payload,
        null,
        'formValidation'
      )
    })
  })

  describe('pushDeliveryMethodChangeEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        const deliveryMethod = 'Ultimate Pigeon Carrier'
        siteInteractions.pushDeliveryMethodChangeEvent({ deliveryMethod })
        expect(dataLayer.push).toHaveBeenCalledWith(
          { deliveryMethod },
          null,
          'deliveryMethodChanged'
        )
      })
    })

    describe('when process.browser is falsy', () => {
      it('should not push anything into the data layer', () => {
        global.process.browser = false
        siteInteractions.pushInputValidationStatus({
          id: 'alskdfj',
          validationStatus: 'skdhfs',
        })
        siteInteractions.pushDeliveryMethodChangeEvent('foo')
        expect(dataLayer.push).not.toHaveBeenCalled()
      })
    })
  })

  describe('pushFilterUsedEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        const payload = { foo: 'bar' }
        siteInteractions.pushFilterUsedEvent({ payload })
        expect(dataLayer.push).toHaveBeenCalledWith(
          { ...payload },
          null,
          'filterUsed'
        )
      })
    })
  })

  describe('pushOrderCompleteEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the correct event into the data layer', () => {
        const payload = {
          deliveryMethod: 'Next Day',
          orderId: 121231,
          paymentDetails: [{ paymentMethod: 'VISA' }],
          returning_buyer: true,
        }
        siteInteractions.pushOrderCompleteEvent(payload)
        expect(dataLayer.push).toHaveBeenCalledWith(
          payload,
          null,
          'orderComplete'
        )
      })
    })
  })

  describe('pushPurchaseEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the right event into the data layer', () => {
        const action = {
          payload: {
            ecommerce: {},
          },
        }
        siteInteractions.pushPurchaseEvent(action)
        expect(dataLayer.push).toHaveBeenCalledWith(
          action.payload,
          null,
          'purchase'
        )
        expect(nrBrowserLogError).not.toHaveBeenCalled()
      })
      it('should not report new relic event if payload exceeds limit', () => {
        calculatePayloadSize.mockImplementationOnce(() => 8193)

        const action = {
          payload: {
            ecommerce: {},
          },
        }
        siteInteractions.pushPurchaseEvent(action)

        expect(nrBrowserLogError).toHaveBeenCalled()
      })
    })
  })

  describe('pushPurchaseErrorEvent()', () => {
    describe('when process.browser is truthy', () => {
      it('should push the right event into the data layer', () => {
        const action = {
          payload: {
            orderError: true,
          },
        }
        siteInteractions.pushPurchaseErrorEvent(action)
        expect(dataLayer.push).toHaveBeenCalledWith(
          action.payload,
          null,
          'purchaseError'
        )
      })
    })
  })
})
