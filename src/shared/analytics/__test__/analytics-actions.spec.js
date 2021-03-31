import { ANALYTICS_ACTION, GTM_ACTION } from '../analytics-constants'
import * as analyticsActions from '../analytics-actions'
import * as mocks from './mocks/purchase-mocks'

import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'

describe('Analytics actions', () => {
  describe('sendAnalyticsApiResponseEvent()', () => {
    it('should return the correct action', () => {
      const payload = {
        event: 'apiResponse',
        apiEndpoint: '/getAccount',
        responseCode: 200,
      }

      expect(analyticsActions.sendAnalyticsApiResponseEvent(payload)).toEqual({
        type: ANALYTICS_ACTION.SEND_API_RESPONSE_EVENT,
        payload,
      })
    })
  })

  describe('sendAnalyticsClickEvent()', () => {
    it('should return the correct action', () => {
      const payload = 'foo'

      expect(analyticsActions.sendAnalyticsClickEvent(payload)).toEqual({
        type: ANALYTICS_ACTION.SEND_CLICK_EVENT,
        payload,
      })
    })
  })

  describe('sendAnalyticsDisplayEvent()', () => {
    it('should return the correct action', () => {
      const payload = 'foo'
      const eventName = 'bar'

      expect(
        analyticsActions.sendAnalyticsDisplayEvent(payload, eventName)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_DISPLAY_EVENT,
        payload,
        eventName,
      })
    })
  })

  describe('sendAnalyticsErrorMessage()', () => {
    it('should return the correct action', () => {
      const errorMessage = 'I am erroneous.'

      expect(analyticsActions.sendAnalyticsErrorMessage(errorMessage)).toEqual({
        type: ANALYTICS_ACTION.SEND_ERROR_MESSAGE,
        errorMessage,
      })
    })
  })

  describe('sendAnalyticsProductClickEvent()', () => {
    it('should return the correct action', () => {
      const payload = { foo: 'bar' }
      expect(analyticsActions.sendAnalyticsProductClickEvent(payload)).toEqual({
        type: ANALYTICS_ACTION.SEND_PRODUCT_CLICK_EVENT,
        payload,
      })
    })
  })

  describe('sendAnalyticsDeliveryOptionChangeEvent()', () => {
    it('should return the correct action', () => {
      const deliveryLocationType = "Carrier pigeon's nest"

      expect(
        analyticsActions.sendAnalyticsDeliveryOptionChangeEvent(
          deliveryLocationType
        )
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_DELIVERY_OPTION_CHANGE_EVENT,
        deliveryLocationType,
      })
    })
  })

  describe('sendAnalyticsValidationState()', () => {
    it('should return the correct action', () => {
      const payload = {
        id: 'some ID',
        validationStatus: 'successful obvs',
      }
      expect(analyticsActions.sendAnalyticsValidationState(payload)).toEqual({
        type: ANALYTICS_ACTION.SEND_INPUT_VALIDATION_STATUS,
        id: 'some ID',
        validationStatus: 'successful obvs',
      })
    })
  })

  describe('sendAnalyticsPaymentMethodSelectionEvent()', () => {
    it('should return the correct action', () => {
      const payload = { selectedPaymentMethod: 'KLRNA' }
      expect(
        analyticsActions.sendAnalyticsPaymentMethodSelectionEvent(payload)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_SELECTION_EVENT,
        eventName: GTM_ACTION.PAYMENT_METHOD_SELECTION,
        payload,
      })
    })
  })

  describe('sendAnalyticsPaymentMethodIntentionEvent()', () => {
    it('should return the correct action', () => {
      const payload = { selectedPaymentMethod: 'KLRNA', orderId: '12345' }
      expect(
        analyticsActions.sendAnalyticsPaymentMethodIntentionEvent(payload)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_INTENTION_EVENT,
        eventName: GTM_ACTION.PAYMENT_METHOD_INTENTION,
        payload,
      })
    })
  })

  describe('sendAnalyticsPaymentMethodPurchaseSuccessEvent()', () => {
    it('should return the correct action', () => {
      const payload = { selectedPaymentMethod: 'KLRNA', orderId: '12345' }
      expect(
        analyticsActions.sendAnalyticsPaymentMethodPurchaseSuccessEvent(payload)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_SUCCESS_EVENT,
        eventName: GTM_ACTION.PAYMENT_METHOD_PURCHASE_SUCCESS,
        payload,
      })
    })
  })

  describe('sendAnalyticsPaymentMethodPurchaseFailureEvent()', () => {
    it('should return the correct action', () => {
      const payload = { selectedPaymentMethod: 'KLRNA', orderId: '12345' }
      expect(
        analyticsActions.sendAnalyticsPaymentMethodPurchaseFailureEvent(payload)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_PAYMENT_METHOD_PURCHASE_FAILURE_EVENT,
        eventName: GTM_ACTION.PAYMENT_METHOD_PURCHASE_FAILURE,
        payload,
      })
    })
  })

  describe('sendAnalyticsDeliveryMethodChangeEvent()', () => {
    it('should return the correct action', () => {
      const deliveryMethod = 'Get it before you even think about it'
      expect(
        analyticsActions.sendAnalyticsDeliveryMethodChangeEvent(deliveryMethod)
      ).toEqual({
        type: ANALYTICS_ACTION.SEND_DELIVERY_METHOD_CHANGE_EVENT,
        deliveryMethod,
      })
    })
  })

  describe('sendAnalyticsFilterUsedEvent()', () => {
    it('should return the correct action', () => {
      const payload = { foo: 'bar' }
      expect(analyticsActions.sendAnalyticsFilterUsedEvent(payload)).toEqual({
        type: ANALYTICS_ACTION.SEND_FILTER_USED_EVENT,
        payload,
      })
    })
  })

  describe('sendAnalyticsOrderCompleteEvent()', () => {
    it('should return the correct action', () => {
      const payload = { foo: 'bar' }
      expect(analyticsActions.sendAnalyticsOrderCompleteEvent(payload)).toEqual(
        {
          type: ANALYTICS_ACTION.SEND_ORDER_COMPLETE_EVENT,
          payload,
        }
      )
    })
  })

  describe('sendAnalyticsPurchaseEvent', () => {
    describe('if there are order errors or missing data', () => {
      it('should dispatch purchase error event if there is an order error', () => {
        const store = getMockStoreWithInitialReduxState({
          checkout: {
            orderError: true,
          },
        })
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              orderError: true,
              orderId: undefined,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_ERROR_EVENT',
          },
        ])
      })

      it('should dispatch purchase error event if there is no orderId', () => {
        const store = getMockStoreWithInitialReduxState({})
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              orderError: false,
              orderId: undefined,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_ERROR_EVENT',
          },
        ])
      })
    })

    describe('with data to populate purchase event payload', () => {
      const emptyBasket = {
        productList: [],
        totalQuantity: 0,
        totalPrice: 0,
      }

      it('should dispatch analytics purchase event if orderSummary is populated', () => {
        const store = getMockStoreWithInitialReduxState(mocks.basicState)
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              _clear: true,
              user: {
                id: '987654',
                hashedEmailAddress:
                  '0904c4fabd5ce6902f0484bf47801851814336a7f6a6f691857919554b80ecf2',
                isRegisteredEmail: undefined,
                loggedIn: 'False',
                userType: undefined,
                authState: 'guest',
              },
              ecommerce: {
                currencyCode: 'EUR',
                purchase: {
                  actionField: {
                    id: '1706986',
                    revenue: '44.80',
                    productRevenue: '73.00',
                    paymentType: 'Visa',
                    orderDiscount: '15.00',
                    shippingCountry: 'United Kingdom',
                    shipping: '4.00',
                    shippingOption: 'UK Standard up to 4 working days',
                    ddpOrder: {
                      ddpPromotion: true,
                      value: -5.95,
                    },
                  },
                  products: [
                    {
                      id: '26M48MIVR',
                      productId: '123456789',
                      name:
                        '(26M48MIVR) PETITE Floral Jacquard Midi Wrap Dress',
                      price: '30.00',
                      unitNowPrice: '30.00',
                      brand: 'Topshop',
                      colour: 'IVORY',
                      quantity: '1',
                      category: 'Dresses',
                      size: '6',
                      reviewRating: '4',
                      ecmcCategory: 'DRES',
                      department: '21',
                    },
                    {
                      id: '42H08KGLD',
                      productId: '987654321',
                      name: '(42H08KGLD) HELD UP Leather Knot Sandals',
                      price: '18.00',
                      unitNowPrice: '18.00',
                      brand: 'Topshop',
                      colour: 'GOLD',
                      quantity: '1',
                      category: 'Shoes',
                      size: '38',
                      reviewRating: '1',
                      ecmcCategory: 'SHOE',
                      department: '24',
                    },
                  ],
                },
              },
              fullBasket: emptyBasket,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_EVENT',
          },
        ])
      })

      it('should dispatch analytics purchase event for 3rd party payments (orderSummary is not populated)', () => {
        const store = getMockStoreWithInitialReduxState(mocks.ssrMockState)
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              _clear: true,
              user: {
                id: '987654',
                hashedEmailAddress:
                  '0904c4fabd5ce6902f0484bf47801851814336a7f6a6f691857919554b80ecf2',
                isRegisteredEmail: undefined,
                loggedIn: 'False',
                userType: undefined,
                authState: 'guest',
              },
              ecommerce: {
                currencyCode: 'EUR',
                purchase: {
                  actionField: {
                    id: '2337940',
                    revenue: '136.00',
                    productRevenue: '130.00',
                    paymentType: 'Visa',
                    orderDiscount: '0.00',
                    shippingCountry: 'United Kingdom',
                    shipping: '6.00',
                    shippingOption: 'Friday Nominated Day Delivery:',
                    ddpOrder: {
                      ddpPromotion: true,
                      value: -5.95,
                    },
                  },
                  products: [
                    {
                      id: '02K77LMDT',
                      productId: '29689232',
                      name: '(02K77LMDT) MOTO Mid Blue Lace Fly Jamie Jeans',
                      price: '42.00',
                      unitNowPrice: '42.00',
                      brand: 'Topshop',
                      colour: 'MID STONE',
                      quantity: '2',
                      category: 'Trousers',
                      size: 'W2630',
                      reviewRating: '3',
                      ecmcCategory: 'TROU',
                      department: '13',
                    },
                    {
                      id: '20B03MPPK',
                      productId: '29832681',
                      name: '(20B03MPPK) OhK! Mini Tissues',
                      price: '1.00',
                      unitNowPrice: '1.00',
                      brand: 'Topshop',
                      colour: 'PALE PINK',
                      quantity: '4',
                      category: 'Miscellaneous',
                      size: '',
                      reviewRating: '5',
                      ecmcCategory: 'MISC',
                      department: '12',
                    },
                    {
                      id: '02K06NBLG',
                      productId: '31305407',
                      name: '(02K06NBLG) MOTO Jamie Skinny Fit Jeans',
                      price: '42.00',
                      unitNowPrice: '42.00',
                      brand: 'Topshop',
                      colour: 'Blue',
                      quantity: '1',
                      category: 'Trousers',
                      size: 'W3234',
                      reviewRating: '5',
                      ecmcCategory: 'TROU',
                      department: '34',
                    },
                  ],
                },
              },
              fullBasket: emptyBasket,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_EVENT',
          },
        ])
      })

      it('should dispatch analytics purchase event for with isRegisteredEmail if guest user pays with a registered email', () => {
        const state = {
          ...mocks.basicState,
          checkout: {
            ...mocks.basicState.checkout,
            orderCompleted: {
              ...mocks.basicState.checkout.orderCompleted,
              isRegisteredEmail: true,
              userType: 'G',
            },
          },
        }
        const store = getMockStoreWithInitialReduxState(state)
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              _clear: true,
              user: {
                id: '987654',
                hashedEmailAddress:
                  '0904c4fabd5ce6902f0484bf47801851814336a7f6a6f691857919554b80ecf2',
                isRegisteredEmail: true,
                userType: 'G',
                loggedIn: 'False',
                authState: 'guest',
              },
              ecommerce: {
                currencyCode: 'EUR',
                purchase: {
                  actionField: {
                    id: '1706986',
                    revenue: '44.80',
                    productRevenue: '73.00',
                    paymentType: 'Visa',
                    orderDiscount: '15.00',
                    shippingCountry: 'United Kingdom',
                    shipping: '4.00',
                    shippingOption: 'UK Standard up to 4 working days',
                    ddpOrder: {
                      ddpPromotion: true,
                      value: -5.95,
                    },
                  },
                  products: [
                    {
                      id: '26M48MIVR',
                      productId: '123456789',
                      name:
                        '(26M48MIVR) PETITE Floral Jacquard Midi Wrap Dress',
                      price: '30.00',
                      unitNowPrice: '30.00',
                      brand: 'Topshop',
                      colour: 'IVORY',
                      quantity: '1',
                      category: 'Dresses',
                      size: '6',
                      reviewRating: '4',
                      ecmcCategory: 'DRES',
                      department: '21',
                    },
                    {
                      id: '42H08KGLD',
                      productId: '987654321',
                      name: '(42H08KGLD) HELD UP Leather Knot Sandals',
                      price: '18.00',
                      unitNowPrice: '18.00',
                      brand: 'Topshop',
                      colour: 'GOLD',
                      quantity: '1',
                      category: 'Shoes',
                      size: '38',
                      reviewRating: '1',
                      ecmcCategory: 'SHOE',
                      department: '24',
                    },
                  ],
                },
              },
              fullBasket: emptyBasket,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_EVENT',
          },
        ])
      })

      it('should pass ddp properties from user if they exist in state', () => {
        const state = {
          ...mocks.basicState,
          auth: {
            authentication: 'full',
          },
          account: {
            ...mocks.basicState.account,
            user: {
              ...mocks.basicState.account.user,
              userTrackingId: 123456,
              isDDPUser: true,
              wasDDPUser: false,
              isDDPRenewable: true,
              ddpStartDate: '2 May 2020',
              ddpEndDate: '2 May 2021',
              ddpCurrentOrderCount: 3,
              ddpPreviousOrderCount: 0,
            },
          },
          checkout: {
            ...mocks.basicState.checkout,
            orderCompleted: {
              ...mocks.basicState.checkout.orderCompleted,
              isRegisteredEmail: true,
              userType: 'G',
            },
          },
        }
        const store = getMockStoreWithInitialReduxState(state)
        store.dispatch(analyticsActions.sendAnalyticsPurchaseEvent())
        expect(store.getActions()).toEqual([
          {
            payload: {
              _clear: true,
              user: {
                id: '987654',
                hashedEmailAddress:
                  '0904c4fabd5ce6902f0484bf47801851814336a7f6a6f691857919554b80ecf2',
                isRegisteredEmail: true,
                userType: 'G',
                isDDPUser: 'True',
                wasDDPUser: 'False',
                isDDPRenewable: 'True',
                ddpStartDate: '2 May 2020',
                ddpEndDate: '2 May 2021',
                ddpCurrentOrderCount: 3,
                ddpPreviousOrderCount: 0,
                loggedIn: 'True',
                authState: 'full',
              },
              ecommerce: {
                currencyCode: 'EUR',
                purchase: {
                  actionField: {
                    id: '1706986',
                    revenue: '44.80',
                    productRevenue: '73.00',
                    paymentType: 'Visa',
                    orderDiscount: '15.00',
                    shippingCountry: 'United Kingdom',
                    shipping: '4.00',
                    shippingOption: 'UK Standard up to 4 working days',
                    ddpOrder: {
                      ddpPromotion: true,
                      value: -5.95,
                    },
                  },
                  products: [
                    {
                      id: '26M48MIVR',
                      productId: '123456789',
                      name:
                        '(26M48MIVR) PETITE Floral Jacquard Midi Wrap Dress',
                      price: '30.00',
                      unitNowPrice: '30.00',
                      brand: 'Topshop',
                      colour: 'IVORY',
                      quantity: '1',
                      category: 'Dresses',
                      size: '6',
                      reviewRating: '4',
                      ecmcCategory: 'DRES',
                      department: '21',
                    },
                    {
                      id: '42H08KGLD',
                      productId: '987654321',
                      name: '(42H08KGLD) HELD UP Leather Knot Sandals',
                      price: '18.00',
                      unitNowPrice: '18.00',
                      brand: 'Topshop',
                      colour: 'GOLD',
                      quantity: '1',
                      category: 'Shoes',
                      size: '38',
                      reviewRating: '1',
                      ecmcCategory: 'SHOE',
                      department: '24',
                    },
                  ],
                },
              },
              fullBasket: emptyBasket,
            },
            type: 'MONTY/ANALYTICS.SEND_PURCHASE_EVENT',
          },
        ])
      })
    })
  })
})
