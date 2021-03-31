import deepFreeze from 'deep-freeze'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import * as checkoutSelectors from '../../../selectors/checkoutSelectors'
import * as shoppingBagSelectors from '../../../selectors/shoppingBagSelectors'
import * as checkoutActions from '../checkoutActions'
import * as shoppingBagActions from '../shoppingBagActions'
import * as formActions from '../formActions'
import * as scrollHelper from '../../../lib/scroll-helper'
import * as storeLocatorActions from '../../components/StoreLocatorActions'
import * as espotActions from '../espotActions'
import * as actionsHelpers from '../../../lib/checkout-utilities/actions-helpers'
import * as analyticsActions from '../../../analytics/analytics-actions'
import { getAccount } from '../accountActions'
import {
  getYourDetailsSchema,
  regionalPhoneValidation,
} from '../../../components/containers/CheckoutV2/shared/validationSchemas'
import { getYourAddressSchema } from '../../../schemas/validation/addressFormValidationSchema'
import { getPostCodeRules } from '../../../selectors/common/configSelectors'

import { get, put } from '../../../lib/api-service'
import * as orderSummaryUtils from '../../../lib/checkout-utilities/order-summary'
import { isMobile } from '../../../selectors/viewportSelectors'

jest.mock(
  '../../../../shared/components/containers/CheckoutV2/shared/validationSchemas',
  () => ({
    getYourDetailsSchema: jest.fn(),
    regionalPhoneValidation: jest.fn(),
  })
)

jest.mock('../../../schemas/validation/addressFormValidationSchema', () => ({
  getYourAddressSchema: jest.fn(),
}))

jest.mock('../modalActions', () => ({
  showErrorModal: jest.fn((message) => ({
    type: 'MOCK_ERROR_MODAL',
    message,
  })),
}))
jest.mock('../../../selectors/viewportSelectors')
jest.mock('react-router')
jest.mock('../../../../client/lib/cookie', () => ({
  setItem: jest.fn(() => 'TS0001'),
  getItem: jest.fn(() => 'TS0001'),
  setStoreCookie: jest.fn(),
}))
jest.mock('../../../selectors/configSelectors', () => ({
  getDefaultLanguage: jest.fn(() => 'en'),
  getBrandName: jest.fn(),
}))
jest.mock('../../components/StoreLocatorActions')
jest.mock('../../../lib/checkout-utilities/order-summary')
jest.mock('../accountActions', () => ({
  getAccount: jest.fn(),
}))
jest.mock('../shoppingBagActions')
shoppingBagActions.updateBag.mockImplementation(() => ({
  type: 'MOCK_UPDATE_BAG',
}))

shoppingBagActions.openMiniBag.mockImplementation(() => ({
  type: 'MOCK_OPEN_MINI_BAG',
}))

jest.mock('../../../selectors/checkoutSelectors')
jest.mock('../../../selectors/shoppingBagSelectors')
jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}))
jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn().mockImplementation((l, b, m) => m[0]),
}))

import { browserHistory } from 'react-router'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockActionHelper = (name) => (...args) => ({ name, args })
const mockGetDefaultAddress = mockActionHelper('getDefaultAddress')
const mockGetDefaultNameAndPhone = mockActionHelper('getDefaultNameAndPhone')
storeLocatorActions.applyCheckoutFilters.mockReturnValue({
  type: 'APPLY_CHECKOUT_FILTERS',
})

describe('Checkout Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const initialState = {
    account: { user: {} },
    checkout: {
      orderSummary: {},
    },
    config: {
      lang: 'en',
      brandName: 'ts',
      storeCode: 'tsuk',
    },
    features: {
      status: {
        FEATURE_CFSI: true,
      },
    },
    siteOptions: { billingCountries: {} },
  }

  describe('request order summary', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const store = mockStore(initialState)
    const params = {
      shouldUpdateForms: false,
      shouldUpdateBag: false,
    }
    const mockOrderSummary = {
      basket: {},
      deliveryStoreCode: 12345,
    }

    const payload = {}

    shoppingBagActions.addStoredPromoCode.mockImplementation(() => ({
      type: 'MOCK_ADD_STORED_PROMO_CODE',
    }))
    shoppingBagActions.showMiniBagMessage.mockImplementation(() => ({
      type: 'MOCK_SHOW_MINIBAG_MESSAGE',
    }))
    orderSummaryUtils.fixOrderSummary.mockReturnValue(mockOrderSummary)
    orderSummaryUtils.removeCFSIFromOrderSummary.mockReturnValue({})
    checkoutSelectors.getSelectedDeliveryMethod.mockReturnValue({})

    beforeEach(() => {
      store.clearActions()
    })

    describe('getAccountAndOrderSummary', () => {
      it('dispatches `getAccount` action if authenticated', async () => {
        const store = mockStore({
          ...initialState,
          auth: { authentication: 'full' },
        })
        const createGetAccountMock = () => {
          const p = new Promise((resolve) => resolve())
          p.type = 'GET_USER_ACCOUNT'
          return p
        }
        const getAccountMock = createGetAccountMock()
        getAccount.mockImplementationOnce(() => getAccountMock)
        const createOrderSummaryRequestMock = () => {
          const p = new Promise((resolve) => resolve())
          p.type = 'MOCK_ORDER_SUMMARY_REQUEST'
          return p
        }
        const orderSummaryRequestMock = createOrderSummaryRequestMock()
        get.mockImplementationOnce(() => orderSummaryRequestMock)
        const expectedActions = [getAccountMock, orderSummaryRequestMock]

        await store.dispatch(checkoutActions.getAccountAndOrderSummary())
        expect(getAccount).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })

      it('does not dispatch `getAccount` action if not authenticated', async () => {
        const store = mockStore({
          ...initialState,
          auth: { authentication: false },
        })
        const createOrderSummaryRequestMock = () => {
          const p = new Promise((resolve) => resolve())
          p.type = 'MOCK_ORDER_SUMMARY_REQUEST'
          return p
        }
        const orderSummaryRequestMock = createOrderSummaryRequestMock()
        get.mockImplementationOnce(() => orderSummaryRequestMock)
        const expectedActions = [orderSummaryRequestMock]

        await store.dispatch(checkoutActions.getAccountAndOrderSummary())
        expect(getAccount).not.toHaveBeenCalled()
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('updateOrderSummaryWithResponse', () => {
      describe('when response comes back with error message', () => {
        it('should dispatch setOrderSummaryError action', () => {
          const store = mockStoreCreator({
            checkout: {
              orderSummary: {
                basket: { products: {} },
              },
            },
          })
          const errorMsgObject = { body: { message: 'error' } }
          store.dispatch(
            checkoutActions.updateOrderSummaryWithResponse(
              errorMsgObject,
              null,
              null
            )
          )
          expect(store.getActions()).toEqual([
            {
              type: 'SET_ORDER_SUMMARY_ERROR',
              data: errorMsgObject.body,
            },
          ])
        })
      })
      describe('when basket object is in response', () => {
        const basket = {
          isBasketResponse: true,
          orderId: '1123',
          products: [],
        }
        shoppingBagActions.updateBag.mockImplementationOnce(() => ({
          type: 'MOCK_UPDATE_BAG',
        }))

        describe('when in a browser', () => {
          jest.useFakeTimers()
          it('should dispatch setOrderSummaryOutOfStock and updateBag', async () => {
            process.browser = true
            await store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse({
                body: basket,
              })
            )
            const expectedActions = [
              { type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK' },
              { type: 'MOCK_UPDATE_BAG' },
            ]
            expect(browserHistory.goBack).toHaveBeenCalledTimes(1)
            jest.advanceTimersByTime(1000)
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
        describe('on the server side render', () => {
          it('should dispatch setOrderSummaryOutOfStock and updateBag', async () => {
            process.browser = false
            await store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse({
                body: basket,
              })
            )
            const expectedActions = [
              { type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK' },
              { type: 'MOCK_UPDATE_BAG' },
            ]
            expect(store.getActions()).toEqual(expectedActions)
          })
        })
      })
      describe('when response doesn`t come back with error message and is not basket response', () => {
        const basket = {
          isBasketResponse: false,
          orderId: '1123',
          products: [],
        }
        shoppingBagActions.updateBag.mockImplementationOnce(() => ({
          type: 'MOCK_UPDATE_BAG',
        }))
        shoppingBagActions.addStoredPromoCode.mockImplementationOnce(() => ({
          type: 'MOCK_ADD_STORED_PROMO_CODE',
        }))

        describe('was called with no params', () => {
          it('should update order summary, add promoCode and force delivery method', () => {
            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse({ body: basket })
            )

            const expectedActions = [
              { type: 'MOCK_ADD_STORED_PROMO_CODE' },
              {
                type: 'FETCH_ORDER_SUMMARY_SUCCESS',
                data: { basket: {}, deliveryStoreCode: 12345 },
                persist: true,
              },
              { type: 'FORCE_DELIVERY_METHOD_SELECTION' },
            ]
            expect(store.getActions()).toEqual(expectedActions)
          })

          it('should fix the order summary before setting it to the state', () => {
            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse(
                { body: basket },
                false,
                false
              )
            )

            const expectedActions = [
              {
                type: 'FETCH_ORDER_SUMMARY_SUCCESS',
                data: { basket: {}, deliveryStoreCode: 12345 },
                persist: true,
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
          })

          it('should set the order summary with the response body', () => {
            const store = mockStore({
              ...initialState,
            })

            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse(
                {
                  body: {
                    basket,
                    isGuestOrder: true,
                  },
                },
                false,
                false
              )
            )

            const expectedActions = [
              {
                type: 'FETCH_ORDER_SUMMARY_SUCCESS',
                data: {
                  basket,
                  isGuestOrder: true,
                },
                persist: true,
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
          })
        })
        describe('was called with shouldUpdateForms=true', () => {
          it('should dispatch resetCheckoutForms action', () => {
            const mockState = deepFreeze({
              siteOptions: {
                expiryYears: ['2016'],
                expiryMonths: ['01', '02'],
                titles: ['Mr'],
              },
              checkout: {
                orderSummary: {
                  basket: { products: {} },
                },
              },
              paymentMethods: [{ value: 'VISA', type: 'CARD', label: 'visa' }],
              routing: { location: { pathname: '/checkout ' } },
              account: {
                user: {
                  creditCard: {
                    type: 'VISA',
                    expiryMonth: '01',
                    expiryYear: '2016',
                  },
                },
              },
              config: {
                country: 'United Kingdom',
              },
            })
            const store = mockStore(mockState)
            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse(
                { body: basket },
                true,
                false
              )
            )
            const expectedActions = [{ type: 'RESET_CHECKOUT_FORMS' }]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
          })
        })
        describe('was called with shouldUpdateBag=true', () => {
          it('should dispatch updateBag action', () => {
            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse(
                { body: basket },
                false,
                true
              )
            )
            const expectedActions = [{ type: 'MOCK_UPDATE_BAG' }]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
          })
        })
        describe('was called with shouldSync=false', () => {
          it('should call orderSummary with shouldSync flag', () => {
            const store = mockStore({
              ...initialState,
            })

            store.dispatch(
              checkoutActions.updateOrderSummaryWithResponse(
                { body: basket },
                false,
                false,
                false
              )
            )

            const expectedActions = [
              {
                type: 'FETCH_ORDER_SUMMARY_SUCCESS',
                data: {
                  basket: {},
                  deliveryStoreCode: 12345,
                },
                persist: false,
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
          })
        })
      })
      describe('update bag without persisting to storage to not cause other tabs to sync', () => {
        const updateBagSpy = jest.spyOn(shoppingBagActions, 'updateBag')
        const persist = false
        const mockDispatch = jest.fn()
        const mockGetState = jest.fn(() => ({
          account: {
            user: {},
          },
          siteOptions: {
            billingCountries: [],
          },
          config: {},
        }))

        describe('no response body and is a basket response', () => {
          const res = { body: { message: null, isBasketResponse: true } }

          beforeEach(() => {
            jest.useFakeTimers()
          })

          it('call update bag with persist argument set to false when in browser', () => {
            process.browser = true
            const shouldUpdateBag = undefined

            checkoutActions.updateOrderSummaryWithResponse(
              res,
              null,
              shouldUpdateBag
            )(mockDispatch, mockGetState)

            expect(updateBagSpy).not.toHaveBeenCalled()
            jest.advanceTimersByTime(1000)
            expect(updateBagSpy).toHaveBeenCalledTimes(1)
            expect(updateBagSpy).toHaveBeenCalledWith(
              expect.any(Object),
              persist
            )
          })

          it('call update bag with persist argument set to false when NOT in browser', () => {
            process.browser = false
            const shouldUpdateBag = undefined

            checkoutActions.updateOrderSummaryWithResponse(
              res,
              null,
              shouldUpdateBag
            )(mockDispatch, mockGetState)

            expect(updateBagSpy).toHaveBeenCalledTimes(1)
            expect(updateBagSpy).toHaveBeenCalledWith(
              expect.any(Object),
              persist
            )
          })
        })

        describe('no response body and NOT a basket response', () => {
          const res = { body: { message: null, isBasketResponse: false } }

          it('should not call update bag when persist is set to false', () => {
            const shouldUpdateBag = false

            checkoutActions.updateOrderSummaryWithResponse(
              res,
              null,
              shouldUpdateBag
            )(mockDispatch, mockGetState)

            expect(updateBagSpy).not.toHaveBeenCalled()
          })

          it('call update bag with persist argument set to true', () => {
            const shouldUpdateBag = true

            checkoutActions.updateOrderSummaryWithResponse(
              res,
              null,
              shouldUpdateBag
            )(mockDispatch, mockGetState)

            expect(updateBagSpy).toHaveBeenCalledTimes(1)
            expect(updateBagSpy).toHaveBeenCalledWith(
              expect.any(Object),
              persist
            )
          })
        })
      })
    })

    describe('getOrderSummaryRequest', () => {
      const beforeBrowser = process.browser

      beforeEach(() => {
        jest.useFakeTimers()
        process.browser = true
      })

      afterEach(() => {
        process.browser = beforeBrowser
      })

      describe('when clearGuestDetails is defined as an option', () => {
        beforeEach(() => {
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) => resolve())
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          get.mockImplementationOnce(() => createGetOrderSummaryRequestMock())
        })

        it('adds guestUser=true to the query params for the GET request when error occurs', () => {
          store.dispatch(
            checkoutActions.getOrderSummaryRequest({ clearGuestDetails: true })
          )

          expect(get.mock.calls[0][0]).toMatch(
            '/checkout/order_summary?guestUser=true'
          )
        })

        it('adds guestUser=true to the query params for the GET request when in guest checkout delivery', () => {
          const store = mockStore({
            ...initialState,
            routing: {
              location: {
                pathname: '/guest/checkout/delivery',
              },
            },
          })

          store.dispatch(
            checkoutActions.getOrderSummaryRequest({ clearGuestDetails: true })
          )

          expect(get.mock.calls[0][0]).toMatch(
            '/checkout/order_summary?guestUser=true'
          )
        })
      })

      describe('success', () => {
        it('dispatches the expected actions', async () => {
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) =>
              resolve({ body: { ...mockOrderSummary } })
            )
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            { type: 'AJAXCOUNTER_INCREMENT' },
            { type: 'SET_ORDER_SUMMARY_ERROR', data: {} },
            getOrderSummaryRequestMock,
            { type: 'AJAXCOUNTER_DECREMENT' },
            { type: 'MOCK_ADD_STORED_PROMO_CODE' },
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: mockOrderSummary,
              persist: true,
            },
            { type: 'FORCE_DELIVERY_METHOD_SELECTION' },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest(params))
          expect(store.getActions()).toEqual(expectedActions)
        })

        it('sets message if exists in response', async () => {
          const message = 'An error has occurred'
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) => resolve({ body: { message } }))
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            getOrderSummaryRequestMock,
            { type: 'SET_ORDER_SUMMARY_ERROR', data: { message } },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('attempts to provide orderId', async () => {
          const orderSummaryRequestMock = () => {
            const p = new Promise((resolve) => resolve())
            p.type = 'MOCK_ORDER_SUMMARY_REQUEST'
            return p
          }

          shoppingBagSelectors.getShoppingBagOrderId.mockImplementationOnce(
            () => '12345'
          )
          get.mockImplementationOnce(orderSummaryRequestMock)

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(get).toHaveBeenCalledWith('/checkout/order_summary/12345')
        })

        it('sets expected error message a basket is returned', async () => {
          const basket = {
            isBasketResponse: true,
            orderId: '1123',
            products: [],
          }
          const getOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) =>
              resolve({
                body: basket,
              })
            )
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          get.mockImplementationOnce(getOrderSummaryRequestMock)
          const expectedActions = [
            { type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK' },
            { type: 'MOCK_UPDATE_BAG' },
          ]
          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          process.browser = true
          expect(browserHistory.goBack).toHaveBeenCalledTimes(1)
          jest.advanceTimersByTime(1000)
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets expected error message a basket is returned but does not call goBack if SSR', async () => {
          process.browser = false
          const basket = { orderId: '1123', products: [] }
          const getOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) =>
              resolve({
                body: basket,
              })
            )
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          get.mockImplementationOnce(getOrderSummaryRequestMock)
          expect(browserHistory.goBack).toHaveBeenCalledTimes(0)
          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(browserHistory.goBack).toHaveBeenCalledTimes(0)
        })
      })

      describe('error', () => {
        it('clears order summary', async () => {
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) => reject({}))
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            getOrderSummaryRequestMock,
            { type: 'FETCH_ORDER_SUMMARY_SUCCESS', data: {}, persist: true },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets expected error message if exists in response', async () => {
          const message = 'An error has occurred'
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) =>
              reject({
                response: { body: { message } },
              })
            )
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            getOrderSummaryRequestMock,
            {
              type: 'SET_ORDER_SUMMARY_ERROR',
              data: { message },
            },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets default error message if none in response', async () => {
          const message = 'An error has occurred. Please try again.'
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) => reject({ response: {} }))
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            getOrderSummaryRequestMock,
            {
              type: 'SET_ORDER_SUMMARY_ERROR',
              data: { message },
            },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets Your Order is gone if 404 is returned', async () => {
          const message = `We're sorry, an error has occurred. We're working to fix it as soon as possible.`
          const createGetOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) =>
              reject({
                response: {
                  status: 404,
                },
              })
            )
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const getOrderSummaryRequestMock = createGetOrderSummaryRequestMock()
          get.mockImplementationOnce(() => getOrderSummaryRequestMock)
          const expectedActions = [
            getOrderSummaryRequestMock,
            {
              type: 'SET_ORDER_SUMMARY_ERROR',
              data: { message },
            },
          ]

          await store.dispatch(checkoutActions.getOrderSummaryRequest())
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
      })
    })

    describe('putOrderSummaryRequest', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      describe('success', () => {
        const basket = {}
        const body = { basket }
        it('dispatches the expected actions', async () => {
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) => resolve({ body }))
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            { type: 'AJAXCOUNTER_INCREMENT' },
            { data: {}, type: 'SET_ORDER_SUMMARY_ERROR' },
            putOrderSummaryRequestMock,
            { type: 'AJAXCOUNTER_DECREMENT' },
            { type: 'MOCK_UPDATE_BAG' },
            {
              data: { basket: {}, deliveryStoreCode: 12345 },
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              persist: true,
            },
          ]

          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(expectedActions)

          expect(shoppingBagActions.updateBag).toHaveBeenCalledTimes(1)
          expect(shoppingBagActions.updateBag).toHaveBeenCalledWith(basket)
        })

        it('sets message if exists in response', async () => {
          const message = 'An error has occurred'
          const creatPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) => resolve({ body: { message } }))
            p.type = 'MOCK_REQUEST_SUCCESS'
            return p
          }
          const putOrderSummaryRequestMock = creatPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            putOrderSummaryRequestMock,
            { type: 'SET_ORDER_SUMMARY_ERROR', data: { message } },
          ]

          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets expected error message a basket is returned', async () => {
          const basket = {
            isBasketResponse: true,
            orderId: '1123',
            products: [],
          }
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) =>
              resolve({
                body: basket,
              })
            )
            p.type = 'MOCK_REQUEST_SUCESS'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            { type: 'AJAXCOUNTER_INCREMENT' },
            { data: {}, type: 'SET_ORDER_SUMMARY_ERROR' },
            putOrderSummaryRequestMock,
            { type: 'AJAXCOUNTER_DECREMENT' },
            {
              data: { isBasketResponse: true, orderId: '1123', products: [] },
              type: 'UPDATE_ORDER_SUMMARY_BASKET',
            },
          ]
          await store.dispatch(checkoutActions.putOrderSummary(payload))

          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets expected error message a basket is returned and opens mini bag in Mobile', async () => {
          const basket = {
            isBasketResponse: true,
            orderId: '1123',
            products: [],
          }
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve) =>
              resolve({
                body: basket,
              })
            )
            p.type = 'MOCK_REQUEST_SUCESS'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          isMobile.mockReturnValue(true)

          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            { type: 'AJAXCOUNTER_INCREMENT' },
            { data: {}, type: 'SET_ORDER_SUMMARY_ERROR' },
            putOrderSummaryRequestMock,
            { type: 'AJAXCOUNTER_DECREMENT' },
            {
              data: { isBasketResponse: true, orderId: '1123', products: [] },
              type: 'UPDATE_ORDER_SUMMARY_BASKET',
            },
            { type: 'MOCK_OPEN_MINI_BAG' },
          ]
          await store.dispatch(checkoutActions.putOrderSummary(payload))

          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
      })

      describe('error', () => {
        it('clears order summary error', async () => {
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) => reject({}))
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            putOrderSummaryRequestMock,
            { type: 'SET_ORDER_SUMMARY_ERROR', data: {} },
          ]

          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets expected error message if exists in response', async () => {
          const message = 'An error has occurred'
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) =>
              reject({
                response: { body: { message } },
              })
            )
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            {
              type: 'AJAXCOUNTER_INCREMENT',
            },
            putOrderSummaryRequestMock,
            {
              type: 'AJAXCOUNTER_DECREMENT',
            },
            {
              type: 'MOCK_ERROR_MODAL',
              message,
            },
          ]

          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets default error message if none in response', async () => {
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) => reject({ response: {} }))
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            {
              type: 'AJAXCOUNTER_INCREMENT',
            },
            {
              data: {},
              type: 'SET_ORDER_SUMMARY_ERROR',
            },
            putOrderSummaryRequestMock,
            {
              type: 'AJAXCOUNTER_DECREMENT',
            },
            {
              type: 'MOCK_ERROR_MODAL',
              message: 'An error has occurred. Please try again.',
            },
          ]

          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('sets errored store message if any of the 3 errored messages', async () => {
          const message = '_ERR_DELIVERY_STORE_INVALID'
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) =>
              reject({
                response: { body: { message } },
              })
            )
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            {
              type: 'AJAXCOUNTER_INCREMENT',
            },
            {
              data: {},
              type: 'SET_ORDER_SUMMARY_ERROR',
            },
            putOrderSummaryRequestMock,
            {
              type: 'AJAXCOUNTER_DECREMENT',
            },
            {
              type: 'SET_DELIVERY_STORE',
              store: {
                deliveryStoreCode: undefined,
                storeAddress1: undefined,
                storeAddress2: undefined,
                storeCity: undefined,
                storePostcode: undefined,
              },
            },
            {
              type: 'MOCK_ERROR_MODAL',
              message:
                'Unfortunately this delivery option is no longer available for this store. Please choose another option or select an alternative store',
            },
          ]
          orderSummaryUtils.isErroredStore.mockReturnValue(true)
          await store.dispatch(checkoutActions.putOrderSummary(payload))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('opens modals if errored store when showError = false', async () => {
          const message = '_ERR_DELIVERY_STORE_INVALID'
          const createPutOrderSummaryRequestMock = () => {
            const p = new Promise((resolve, reject) =>
              reject({
                response: { body: { message } },
              })
            )
            p.type = 'MOCK_REQUEST_ERROR'
            return p
          }
          const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
          put.mockImplementationOnce(() => putOrderSummaryRequestMock)
          const expectedActions = [
            {
              type: 'AJAXCOUNTER_INCREMENT',
            },
            {
              data: {},
              type: 'SET_ORDER_SUMMARY_ERROR',
            },
            putOrderSummaryRequestMock,
            {
              type: 'AJAXCOUNTER_DECREMENT',
            },
            {
              type: 'SET_DELIVERY_STORE',
              store: {
                deliveryStoreCode: undefined,
                storeAddress1: undefined,
                storeAddress2: undefined,
                storeCity: undefined,
                storePostcode: undefined,
              },
            },
            {
              type: 'SHOW_COLLECT_FROM_STORE_MODAL',
              show: true,
            },
          ]
          orderSummaryUtils.isErroredStore.mockReturnValue(true)
          await store.dispatch(checkoutActions.putOrderSummary(payload, false))
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
      })
    })
  })

  describe('updateOrderSummaryProduct', () => {
    const index = 123
    const update = 456

    it('should dispatch an action when there is a basket with products', () => {
      const store = mockStoreCreator({
        checkout: {
          orderSummary: {
            basket: { products: {} },
          },
        },
      })

      store.dispatch(checkoutActions.updateOrderSummaryProduct(index, update))
      expect(store.getActions()).toEqual([
        { type: 'UPDATE_ORDER_SUMMARY_PRODUCT', index, update },
      ])
    })

    it('should not dispatch an action when there is a basket with no products', () => {
      const store = mockStoreCreator({
        checkout: {
          orderSummary: {
            basket: {},
          },
        },
      })

      store.dispatch(checkoutActions.updateOrderSummaryProduct(index, update))
      expect(store.getActions()).toEqual([])
    })

    it('should not dispatch an action when there is no basket', () => {
      const store = mockStoreCreator({
        checkout: {
          orderSummary: {},
        },
      })

      store.dispatch(checkoutActions.updateOrderSummaryProduct(index, update))
      expect(store.getActions()).toEqual([])
    })
  })

  describe('clearCheckoutForms', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.clearCheckoutForms()).toEqual({
        type: 'CLEAR_CHECKOUT_FORMS',
      })
    })
  })

  describe('toggleExpressDeliveryOptions', () => {
    it('returns the correct action', () => {
      const bool = 'fake bool'

      expect(checkoutActions.toggleExpressDeliveryOptions(bool)).toEqual({
        type: 'TOGGLE_EXPRESS_DELIVERY_OPTIONS_SUMMARY_PAGE',
        bool,
      })
    })
  })

  describe('setStoreUpdating', () => {
    it('returns the correct action', () => {
      const updating = 'fake updating'

      expect(checkoutActions.setStoreUpdating(updating)).toEqual({
        type: 'SET_STORE_UPDATING',
        updating,
      })
    })
  })

  describe('setDeliveryStore', () => {
    it('returns the correct action', () => {
      const store = {
        storeId: 123,
        address: {
          line1: 'foo line1',
          line2: 'foo line2',
          city: 'foo city',
          postcode: 'foo postcode',
        },
      }

      const expectedStore = {
        deliveryStoreCode: 123,
        storeAddress1: 'foo line1',
        storeAddress2: 'foo line2',
        storeCity: 'foo city',
        storePostcode: 'foo postcode',
      }

      expect(checkoutActions.setDeliveryStore(store)).toEqual({
        type: 'SET_DELIVERY_STORE',
        store: expectedStore,
      })
    })
  })

  describe('resetStoreDetails', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.resetStoreDetails()).toEqual({
        type: 'RESET_STORE_DETAILS',
      })
    })
  })

  describe('clearOutOfStockError', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.clearOutOfStockError()).toEqual({
        type: 'CLEAR_ORDER_SUMMARY_OUT_OF_STOCK',
      })
    })
  })

  describe('setOrderSummaryOutOfStock', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.setOrderSummaryOutOfStock()).toEqual({
        type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK',
      })
    })
  })

  describe('updateCheckoutBag', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.updateCheckoutBag('bag')).toEqual({
        type: 'UPDATE_ORDER_SUMMARY_BASKET',
        data: 'bag',
      })
    })
  })

  describe('getCheckoutBag', () => {
    it('good state', async () => {
      const state = {}
      const store = mockStoreCreator(state)
      const mockBag = {
        type: 'MOCK_get_items',
        body: {
          products: [],
          invetoryPositions: {},
          total: '5',
          subTotal: '5',
        },
      }

      const createMockRequest = () => {
        const p = new Promise((resolve) => resolve({ body: { ...mockBag } }))
        p.type = 'MOCK_REQUEST_SUCCESS'
        return p
      }
      const mockRequest = createMockRequest()
      get.mockImplementationOnce(() => mockRequest)

      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        mockRequest,
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'MOCK_UPDATE_BAG' },
        {
          data: mockBag,
          type: 'UPDATE_ORDER_SUMMARY_BASKET',
        },
      ]

      await store.dispatch(checkoutActions.getCheckoutBag())
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('bad state no error', async () => {
      const state = {}
      const store = mockStoreCreator(state)
      const createMockRequest = () => {
        const p = new Promise((resolve, reject) => reject({}))
        p.type = 'MOCK_REQUEST_ERROR'
        return p
      }
      const mockRequest = createMockRequest()
      get.mockImplementationOnce(() => mockRequest)

      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        mockRequest,
        { type: 'AJAXCOUNTER_DECREMENT' },
        {
          error: {
            isOverlay: true,
            message: 'There was a problem, please try again later.',
            nativeError: {
              message: undefined,
              stack: undefined,
            },
          },
          type: 'SET_ERROR',
        },
      ]

      await store.dispatch(checkoutActions.getCheckoutBag())
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('bad state an error', async () => {
      const state = {}
      const store = mockStoreCreator(state)
      const createMockRequest = () => {
        const p = new Promise((resolve, reject) =>
          reject({
            response: {
              body: {
                message: 'Hello',
              },
            },
          })
        )
        p.type = 'MOCK_REQUEST_ERROR'
        return p
      }
      const mockRequest = createMockRequest()
      get.mockImplementationOnce(() => mockRequest)

      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        mockRequest,
        { type: 'AJAXCOUNTER_DECREMENT' },
        {
          error: {
            isOverlay: true,
            message: 'Hello',
            nativeError: {
              message: 'Hello',
              stack: undefined,
            },
            noReload: true,
          },
          type: 'SET_ERROR',
        },
      ]

      await store.dispatch(checkoutActions.getCheckoutBag())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setOrderSummary', () => {
    const describeTestsWithOrderSummary = (orderSummary) => {
      deepFreeze(orderSummary)

      const state = {
        // TODO: Test the FEATURE_CFSI === false execution path when `setOrderSummary` has been refactored.
        features: { status: { FEATURE_CFSI: true } },
      }

      describe('when there are delivery locations', () => {
        const mockActionCreator = (type) => (...args) => ({ type, args })

        beforeEach(() => {
          storeLocatorActions.applyFilters.mockImplementation(
            mockActionCreator('applyFilters')
          )
          jest
            .spyOn(espotActions, 'setOrderSummaryEspots')
            .mockImplementation(mockActionCreator('setOrderSummaryEspots'))
        })

        it('should dispatch the correct actions when selected delivery location is a store', () => {
          const store = mockStoreCreator({
            ...state,
            checkout: {
              orderSummary: {
                deliveryLocations: [
                  { foo: 123 },
                  { selected: true, deliveryLocationType: 'STORE' },
                ],
              },
            },
          })

          store.dispatch(checkoutActions.setOrderSummary(orderSummary))
          expect(store.getActions()).toEqual([
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: orderSummary,
              persist: true,
            },
            storeLocatorActions.applyCheckoutFilters(['brand', 'other']),
            espotActions.setOrderSummaryEspots(orderSummary),
          ])
        })

        it('should dispatch the correct actions when selected delivery location is not a store', () => {
          const store = mockStoreCreator({
            ...state,
            checkout: {
              orderSummary: {
                deliveryLocations: [
                  { foo: 123 },
                  { selected: true, deliveryLocationType: 'FOO' },
                ],
              },
            },
          })

          store.dispatch(checkoutActions.setOrderSummary(orderSummary))
          expect(store.getActions()).toEqual([
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: orderSummary,
              persist: true,
            },
            storeLocatorActions.applyCheckoutFilters(['parcel']),
            espotActions.setOrderSummaryEspots(orderSummary),
          ])
        })
      })

      describe('when there are no delivery locations', () => {
        let store
        beforeEach(() => {
          store = mockStoreCreator({
            ...state,
            checkout: {
              orderSummary: {},
            },
          })
        })
        it('should dispatch setOrderSummary by default(no-param) with persist=true for tab-sync', () => {
          store.dispatch(checkoutActions.setOrderSummary(orderSummary))
          expect(store.getActions()).toEqual([
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: orderSummary,
              persist: true,
            },
            espotActions.setOrderSummaryEspots(orderSummary),
          ])
        })
        it('should dispatch setOrderSummary with persist=false passed as function param', () => {
          store.dispatch(checkoutActions.setOrderSummary(orderSummary, false))
          expect(store.getActions()).toEqual([
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: orderSummary,
              persist: false,
            },
            espotActions.setOrderSummaryEspots(orderSummary),
          ])
        })
      })
    }

    describe('when there is a non-empty order', () => {
      describeTestsWithOrderSummary({
        basket: { foo: 123 },
        deliveryStoreCode: { bar: 456 },
        fish: 789,
        bread: 'rolls',
      })
    })

    describe('when there is an empty order', () => {
      describeTestsWithOrderSummary({
        fish: 789,
        bread: 'rolls',
      })
    })
  })

  describe('clearOrderSummaryBasket', () => {
    it('returns the correct action without timeStamp persist for multi-tab sync ', () => {
      expect(checkoutActions.clearOrderSummaryBasket()).toEqual({
        type: 'FETCH_ORDER_SUMMARY_SUCCESS',
        data: {},
        persist: false,
      })
    })
  })

  describe('setOrderSummaryField', () => {
    it('returns the correct action', () => {
      const field = 123
      const value = 456

      expect(checkoutActions.setOrderSummaryField(field, value)).toEqual({
        type: 'SET_ORDER_SUMMARY_FIELD',
        field,
        value,
      })
    })
  })

  describe('setOrderSummaryError', () => {
    it('returns the correct action', () => {
      const data = 123

      expect(checkoutActions.setOrderSummaryError(data)).toEqual({
        type: 'SET_ORDER_SUMMARY_ERROR',
        data,
      })
    })
  })

  describe('emptyOrderSummary', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.emptyOrderSummary()).toEqual({
        type: 'EMPTY_ORDER_SUMMARY',
      })
    })
  })

  describe('setDeliveryAsBillingFlag', () => {
    it('returns the correct action', () => {
      const val = 123

      expect(checkoutActions.setDeliveryAsBillingFlag(val)).toEqual({
        type: 'SET_DELIVERY_AS_BILLING_FLAG',
        val,
      })
    })
  })

  describe('resetAddress', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.resetAddress()).toEqual({ type: 'RESET_SEARCH' })
    })
  })

  describe('setManualAddressMode', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.setManualAddressMode()).toEqual({
        type: 'SET_ADDRESS_MODE_TO_MANUAL',
      })
    })
  })

  describe('setFindAddressMode', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.setFindAddressMode()).toEqual({
        type: 'SET_ADDRESS_MODE_TO_FIND',
      })
    })
  })

  describe('setMonikerAddress', () => {
    it('returns the correct action', () => {
      const data = 123

      expect(checkoutActions.setMonikerAddress(data)).toEqual({
        type: 'UPDATE_MONIKER',
        data,
      })
    })
  })

  describe('setDeliveryAddressToBilling', () => {
    const describeSetDeliveryAddressToBilling = ({
      useDeliveryFormData,
      expectedBillingDetails,
      expectedBillingAddress,
    }) => {
      it('should dispatch the correct actions when store details are present', () => {
        const store = mockStoreCreator({
          checkout: {
            orderSummary: {
              shippingCountry: 'fish',
              storeDetails: {},
            },
          },
          forms: {
            checkout: {
              yourDetails: {
                fields: [
                  {
                    value: 'foo details',
                  },
                  {
                    value: 'bar details',
                  },
                ],
              },
              yourAddress: {
                fields: [
                  {
                    value: 'foo address',
                  },
                  {
                    value: 'bar address',
                  },
                ],
              },
            },
          },
        })

        store.dispatch(
          checkoutActions.setDeliveryAddressToBilling(useDeliveryFormData)
        )
        expect(store.getActions()).toEqual([
          formActions.resetFormDirty('billingDetails', expectedBillingDetails),
        ])
      })

      it('should dispatch the correct actions when store details are not present', () => {
        const store = mockStoreCreator({
          checkout: {
            orderSummary: {
              shippingCountry: 'fish',
            },
          },
          forms: {
            checkout: {
              yourDetails: {
                fields: [
                  {
                    value: 'foo details',
                  },
                  {
                    value: 'bar details',
                  },
                ],
              },
              yourAddress: {
                fields: [
                  {
                    value: 'foo address',
                  },
                  {
                    value: 'bar address',
                  },
                ],
              },
            },
          },
        })

        store.dispatch(
          checkoutActions.setDeliveryAddressToBilling(useDeliveryFormData)
        )
        expect(store.getActions()).toEqual([
          formActions.resetFormDirty('billingDetails', expectedBillingDetails),
          formActions.resetFormDirty('billingAddress', expectedBillingAddress),
        ])
      })
    }

    describe('with delivery form data', () => {
      describeSetDeliveryAddressToBilling({
        useDeliveryFormData: true,
        expectedBillingDetails: ['foo details', 'bar details'],
        expectedBillingAddress: ['foo address', 'bar address'],
      })
    })

    describe('without delivery form data', () => {
      beforeEach(() => {
        jest
          .spyOn(actionsHelpers, 'getDefaultAddress')
          .mockImplementation(mockGetDefaultAddress)
        jest
          .spyOn(actionsHelpers, 'getDefaultNameAndPhone')
          .mockImplementation(mockGetDefaultNameAndPhone)
      })

      describeSetDeliveryAddressToBilling({
        useDeliveryFormData: false,
        expectedBillingDetails: mockGetDefaultNameAndPhone(),
        expectedBillingAddress: { ...mockGetDefaultAddress(), country: 'fish' },
      })
    })
  })

  describe('copyDeliveryValuesToBillingForms', () => {
    it('should dispatch the correct actions when home delivery is selected', () => {
      const state = deepFreeze({
        checkout: {
          orderSummary: {
            shippingCountry: 'fish',
          },
        },
        forms: {
          checkout: {
            yourDetails: {
              fields: [
                {
                  value: 'foo details',
                },
                {
                  value: 'bar details',
                },
              ],
            },
            yourAddress: {
              fields: [
                {
                  value: 'foo address',
                },
                {
                  value: 'bar address',
                },
              ],
            },
          },
        },
      })
      const store = mockStoreCreator(state)
      const selectedDeliveryLocationTypeEqualsSpy = jest
        .spyOn(checkoutSelectors, 'selectedDeliveryLocationTypeEquals')
        .mockReturnValue(true)

      store.dispatch(checkoutActions.copyDeliveryValuesToBillingForms())
      expect(store.getActions()).toEqual([
        formActions.resetFormDirty('billingDetails', [
          'foo details',
          'bar details',
        ]),
        formActions.resetFormDirty('billingAddress', [
          'foo address',
          'bar address',
        ]),
        checkoutActions.setManualAddressMode(),
      ])
      expect(selectedDeliveryLocationTypeEqualsSpy).toHaveBeenCalledTimes(1)
      expect(selectedDeliveryLocationTypeEqualsSpy).toHaveBeenCalledWith(
        state,
        'HOME'
      )
    })

    it('should dispatch the correct actions when home delivery is not selected', () => {
      const state = deepFreeze({
        checkout: {
          orderSummary: {
            shippingCountry: 'fish',
          },
        },
        forms: {
          checkout: {
            yourDetails: {
              fields: [
                {
                  value: 'foo details',
                },
                {
                  value: 'bar details',
                },
              ],
            },
          },
        },
      })
      const store = mockStoreCreator(state)
      const selectedDeliveryLocationTypeEqualsSpy = jest
        .spyOn(checkoutSelectors, 'selectedDeliveryLocationTypeEquals')
        .mockReturnValue(false)

      store.dispatch(checkoutActions.copyDeliveryValuesToBillingForms())
      expect(store.getActions()).toEqual([
        formActions.resetFormDirty('billingDetails', [
          'foo details',
          'bar details',
        ]),
      ])
      expect(selectedDeliveryLocationTypeEqualsSpy).toHaveBeenCalledTimes(1)
      expect(selectedDeliveryLocationTypeEqualsSpy).toHaveBeenCalledWith(
        state,
        'HOME'
      )
    })
  })

  describe('resetCheckoutForms', () => {
    beforeEach(() => {
      jest
        .spyOn(actionsHelpers, 'getDefaultAddress')
        .mockImplementation(mockGetDefaultAddress)
      jest
        .spyOn(actionsHelpers, 'getDefaultNameAndPhone')
        .mockImplementation(mockGetDefaultNameAndPhone)
    })

    const months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ]
    const month = new Date().getMonth() + 1

    const state = {
      siteOptions: {
        expiryYears: ['2016'],
        expiryMonths: months,
        titles: ['Mr'],
      },
      paymentMethods: [{ value: 'VISA', type: 'CARD', label: 'visa' }],
      routing: { location: { pathname: '/checkout ' } },
      account: {
        user: {
          creditCard: {
            type: '',
            expiryMonth: '',
            expiryYear: '',
          },
        },
      },
      config: {
        country: 'United Kingdom',
      },
    }

    const { paymentMethods } = state

    const defaultAddress = {
      ...mockGetDefaultAddress(),
      country: 'United Kingdom',
      county: null,
      state: null,
    }

    const defaultAddressGuestCheckout = {
      ...mockGetDefaultAddress(),
      country: 'United Kingdom',
      state: null,
    }

    const defaultNameAndPhone = {
      ...mockGetDefaultNameAndPhone(),
      telephone: null,
    }

    const defaultNameAndPhoneGuestCheckout = {
      ...mockGetDefaultNameAndPhone(),
    }

    const expectedPaymentOptions = actionsHelpers.getDefaultPaymentOptions(
      paymentMethods
    )

    const resetCheckoutFormsThunk = { type: 'RESET_CHECKOUT_FORMS' }

    it('should defer to the site options expiry date for PayPal, AliPay, and China Union Pay', () => {
      const country = regionalPhoneValidation('United Kingdom')
      const orderSummary = {
        shippingCountry: 'United Kingdom',
      }

      const alipayState = {
        ...state,
        account: {
          user: {
            creditCard: {
              type: 'ALIPAY',
              expiryMonth: month < 10 ? `0${month}` : `${month}`,
              expiryYear: '2018',
            },
          },
        },
      }

      const store = mockStoreCreator(alipayState)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,
        formActions.resetForm('yourAddress', defaultAddress),
        formActions.resetForm('yourDetails', defaultNameAndPhone),
        formActions.resetForm('billingAddress', defaultAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', defaultNameAndPhone),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
        formActions.resetForm('billingCardDetails', {
          ...expectedPaymentOptions,
          paymentType: 'ALIPAY',
        }),
      ])
    })

    it('should dispatch the correct actions when order summary is empty', () => {
      const country = regionalPhoneValidation('United Kingdom')
      const orderSummary = {
        shippingCountry: 'United Kingdom',
      }

      const store = mockStoreCreator(state)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,
        formActions.resetForm('yourAddress', defaultAddress),
        formActions.resetForm('yourDetails', defaultNameAndPhone),
        formActions.resetForm('billingAddress', defaultAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', defaultNameAndPhone),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
        formActions.resetForm('billingCardDetails', expectedPaymentOptions),
      ])
    })

    it('should dispatch the correct actions when order summary has delivery and billing details', () => {
      const country = regionalPhoneValidation('United Kingdom')
      const orderSummary = {
        billingDetails: {
          address: {
            field: 'address',
          },
          nameAndPhone: {
            field: 'nameAndPhone',
          },
        },
        deliveryDetails: {
          address: {
            field: 'address',
          },
          nameAndPhone: {
            field: 'nameAndPhone',
          },
        },
        shippingCountry: 'United Kingdom',
      }

      const expectedAddress = {
        field: 'address',
        county: null,
      }

      const expectedNameAndPhone = {
        field: 'nameAndPhone',
        telephone: null,
      }

      const store = mockStoreCreator(state)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,
        formActions.resetForm('yourAddress', expectedAddress),
        formActions.resetForm('yourDetails', expectedNameAndPhone),
        formActions.resetForm('billingAddress', expectedAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', expectedNameAndPhone),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
        formActions.resetForm('billingCardDetails', expectedPaymentOptions),
      ])
    })

    it('should dispatch the correct actions when user has no credit card', () => {
      // TODO: DRY, this Date snippet should go in a test helper somewhere...
      const country = regionalPhoneValidation('United Kingdom')
      const RealDate = Date

      const mockDate = (...isoDate) => {
        global.Date = class {
          constructor(...dateArgs) {
            if (Array.isArray(dateArgs) && dateArgs.length) {
              return new RealDate(...dateArgs)
            }
            return new RealDate(...isoDate)
          }
        }
      }

      afterEach(() => {
        global.Date = RealDate
      })

      mockDate('2000-01-01T00:00:00.000Z')

      const stateWithNoCreditCard = {
        ...state,
        account: { user: { creditCard: { type: '' } } },
      }

      const orderSummary = {
        shippingCountry: 'United Kingdom',
      }

      const defaultPaymentOptions = {
        ...expectedPaymentOptions,
        expiryMonth: '',
      }

      const store = mockStoreCreator(stateWithNoCreditCard)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,
        formActions.resetForm('yourAddress', defaultAddress),
        formActions.resetForm('yourDetails', defaultNameAndPhone),
        formActions.resetForm('billingAddress', defaultAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', defaultNameAndPhone),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
        formActions.resetForm('billingCardDetails', defaultPaymentOptions),
      ])
    })

    it('does not reset user card details if it is ApplePay', () => {
      const country = regionalPhoneValidation('United Kingdom')
      const orderSummary = {
        shippingCountry: 'United Kingdom',
      }

      const applePayState = {
        ...state,
        account: {
          user: {
            creditCard: {
              type: 'APPLE',
            },
          },
        },
      }

      const store = mockStoreCreator(applePayState)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,
        formActions.resetForm('yourAddress', defaultAddress),
        formActions.resetForm('yourDetails', defaultNameAndPhone),
        formActions.resetForm('billingAddress', defaultAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', defaultNameAndPhone),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
      ])
    })

    it('should dispatch the correct actions for a guest checkout user', () => {
      const country = regionalPhoneValidation('United Kingdom')
      const orderSummary = {
        shippingCountry: 'United Kingdom',
        isGuestOrder: true,
        email: 'email@mail.com',
      }

      const guestUserState = {
        ...state,
        paymentMethods: [{ value: 'PYPAL', type: 'OTHER', label: 'PayPal' }],
        account: {
          user: {},
        },
        routing: {
          location: {
            pathname: '/guest/checkout/payment',
          },
        },
        checkout: {
          orderError: 'error',
          orderSummary: {
            shippingCountry: 'United Kingdom',
            isGuestOrder: true,
            email: 'email@mail.com',
          },
        },
        config: {
          checkoutAddressFormRules: {
            'United Kingdom': {
              pattern:
                '^(([gG][iI][rR] {0,}0[aA]{2})|(([aA][sS][cC][nN]|[sS][tT][hH][lL]|[tT][dD][cC][uU]|[bB][bB][nN][dD]|[bB][iI][qQ][qQ]|[fF][iI][qQ][qQ]|[pP][cC][rR][nN]|[sS][iI][qQ][qQ]|[iT][kK][cC][aA]) {0,}1[zZ]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yxA-HK-XY]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
              postcodeLabel: 'Postcode',
              premisesRequired: false,
              premisesLabel: 'House number',
            },
          },
        },
      }

      const postcodeRules = getPostCodeRules(guestUserState, 'United Kingdom')
      checkoutSelectors.getCheckoutOrderError.mockReturnValue('error')
      checkoutSelectors.isGuestOrder.mockReturnValue(true)

      const store = mockStoreCreator(guestUserState)
      store.dispatch(checkoutActions.resetCheckoutForms(orderSummary))
      expect(store.getActions()).toEqual([
        resetCheckoutFormsThunk,

        formActions.resetForm('yourAddress', defaultAddress),
        formActions.resetForm('yourDetails', defaultNameAndPhone),

        formActions.resetForm('billingAddress', defaultAddress),
        checkoutActions.setFindAddressMode(),
        formActions.resetForm('billingDetails', defaultNameAndPhone),
        formActions.resetFormDirty(
          'yourDetails',
          defaultNameAndPhoneGuestCheckout
        ),
        formActions.resetFormDirty('yourAddress', defaultAddressGuestCheckout),
        formActions.resetFormDirty(
          'billingDetails',
          defaultNameAndPhoneGuestCheckout
        ),
        formActions.resetFormDirty(
          'billingAddress',
          defaultAddressGuestCheckout
        ),
        formActions.validateForm(
          'billingDetails',
          getYourDetailsSchema(country)
        ),
        formActions.validateForm(
          'billingAddress',
          getYourAddressSchema(postcodeRules, 'United Kingdom')
        ),
        formActions.resetFormDirty('guestUser', {
          email: orderSummary.email,
          signUpGuest: '',
        }),
        formActions.validateForm('yourDetails', getYourDetailsSchema(country)),
        formActions.resetForm('billingCardDetails', {
          ...expectedPaymentOptions,
        }),
      ])
    })
  })

  describe('validateForms', () => {
    const getErrorsSpy = jest.spyOn(checkoutSelectors, 'getErrors')
    const getErrortouchedMultipleFormFieldsSpy = jest.spyOn(
      formActions,
      'touchedMultipleFormFields'
    )
    const scrollToFormFieldSpy = jest.spyOn(scrollHelper, 'scrollToFormField')

    const formNames = ['billingCardDetails', 'billingAddress']

    const errors = {
      billingAddress: {
        address1: 'This field is required',
      },
      billingCardDetails: {
        cardNumber: 'A 16 digit card number is required',
      },
    }

    it('should call `onValid` argument if no errors', () => {
      const getState = () => {}
      getErrorsSpy.mockReturnValue({})
      const onValidMock = jest.fn()
      checkoutActions.validateForms(formNames, { onValid: onValidMock })(
        null,
        getState
      )
      expect(onValidMock).toHaveBeenCalled()
    })

    it('should touch the fields on error', () => {
      const dispatchMock = jest.fn()
      const getState = () => {}
      getErrorsSpy.mockReturnValue(errors)
      checkoutActions.validateForms(formNames)(dispatchMock, getState)
      expect(dispatchMock).toHaveBeenCalledTimes(2)
      expect(getErrortouchedMultipleFormFieldsSpy).toHaveBeenCalledWith(
        'billingAddress',
        ['address1']
      )
      expect(getErrortouchedMultipleFormFieldsSpy).toHaveBeenCalledWith(
        'billingCardDetails',
        ['cardNumber']
      )
    })

    it('should scroll to first form in the `formNames` array', () => {
      const dispatchMock = jest.fn()
      const getState = () => {}
      getErrorsSpy.mockReturnValue(errors)
      checkoutActions.validateForms(formNames)(dispatchMock, getState)
      expect(scrollToFormFieldSpy).toHaveBeenCalledWith('cardNumber')
    })

    it('should call `onInvlid` arguments if errors', () => {
      const dispatchMock = jest.fn()
      const getState = () => {}
      getErrorsSpy.mockReturnValue(errors)
      const onInvalidMock = jest.fn()
      checkoutActions.validateForms(formNames, { onInvalid: onInvalidMock })(
        dispatchMock,
        getState
      )
      expect(onInvalidMock).toHaveBeenCalled()
    })
  })

  describe('selectDeliveryLocation', () => {
    const initialState = {
      config: {
        language: 'XXX',
        brandName: 'CCC',
      },
      routing: {
        location: {
          pathname: '/login',
        },
      },
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
      storeLocator: {
        selectedStore: {},
      },
      checkout: {
        orderSummary: {
          deliveryLocations: [
            { selected: true, deliveryLocationType: 'HOME' },
            { selected: false, deliveryLocationType: 'STORE' },
            { selected: false, deliveryLocationType: 'PARCELSHOP' },
          ],
          basket: {
            orderId: 1,
          },
        },
      },
      account: {
        user: {},
      },
      siteOptions: {
        billingCountries: [],
      },
    }

    const getState = jest.fn(() => initialState)
    const dispatch = jest.fn(
      (action) =>
        typeof action === 'function'
          ? action(dispatch, getState)
          : Promise.resolve()
    )

    const executeThunk = (reduxAction) => {
      const thunk = reduxAction
      return thunk(dispatch, getState)
    }

    beforeEach(() => {
      checkoutSelectors.getCheckoutOrderSummary.mockReturnValueOnce(
        initialState.checkout.orderSummary
      )
    })

    describe('default execution with Home Delivery selected', () => {
      it('updates UI', async () => {
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'HOME',
          })
        )
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_STORE_UPDATING',
          updating: true,
        })
      })
      it('sets orderSummary with selected option', async () => {
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'HOME',
          })
        )
        expect(dispatch.mock.calls[2][0].name).toEqual('setOrderSummaryThunk')
      })
      it('resets delivery store details if any', async () => {
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'HOME',
          })
        )
        expect(dispatch).toHaveBeenCalledWith({
          type: 'RESET_STORE_DETAILS',
        })
      })
      it('updates the orderSummary with selected delivery option', async () => {
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'HOME',
          })
        )
        expect(dispatch.mock.calls[8][0].name).toEqual(
          'updateDeliveryOptionsThunk'
        )
      })
      it('dispatches an analytics event with the selected delivery option', async () => {
        put.mockReturnValueOnce(() =>
          Promise.resolve({
            body: {},
          })
        )
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'HOME',
          })
        )

        expect(dispatch).toHaveBeenCalledWith(
          analyticsActions.sendAnalyticsDeliveryOptionChangeEvent('HOME')
        )
      })
    })
    describe('with Collect From Store selected', () => {
      it('sets a delivery store if CFSI is ON and a brand store was previously defined ', async () => {
        getState.mockReturnValue({
          ...initialState,
          selectedBrandFulfilmentStore: {
            name: 'Oxford Street',
          },
        })
        await executeThunk(
          checkoutActions.selectDeliveryLocation({
            deliveryLocationType: 'STORE',
          })
        )

        expect(dispatch.mock.calls[8][0].name).toEqual(
          'selectDeliveryStoreThunk'
        )
      })
    })
  })

  describe('selectDeliveryStore', () => {
    beforeEach(() => {
      const basket = {}
      const body = { basket }
      const putOrderSummaryRequestMock = () => {
        const p = new Promise((resolve) => resolve({ body }))
        p.type = 'MOCK_REQUEST_SUCCESS'
        return p
      }
      put.mockImplementationOnce(putOrderSummaryRequestMock)
    })

    const initialState = {
      config: {
        language: 'XXX',
        brandName: 'CCC',
      },
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
      storeLocator: {
        selectedStore: {},
      },
      checkout: {
        orderSummary: {
          deliveryLocations: [
            {
              deliveryLocationType: 'HOME',
              selected: true,
            },
            {
              deliveryLocationType: 'STORE',
            },
          ],
          basket: {
            orderId: 1,
          },
        },
      },
    }

    const getState = jest.fn(() => initialState)
    const dispatch = jest.fn(
      (action) =>
        typeof action === 'function'
          ? action(dispatch, getState)
          : Promise.resolve()
    )

    const executeThunk = (reduxAction) => {
      const thunk = reduxAction
      return thunk(dispatch, getState)
    }

    describe('browserHistory is not called unnecessarilly', () => {
      it('new user current path is delivery', () => {
        getState.mockReturnValue({
          ...initialState,
          routing: {
            location: {
              pathname: '/checkout/delivery',
            },
          },
        })
        checkoutSelectors.isReturningCustomer.mockReturnValue(false)
        checkoutSelectors.isGuestOrder.mockReturnValue(false)
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        return executeThunk(checkoutActions.selectDeliveryStore()).then(() => {
          expect(browserHistory.push).toHaveBeenCalledTimes(0)
        })
      })
      it('returning user current path is delivery-payment', () => {
        getState.mockReturnValue({
          ...initialState,
          routing: {
            location: {
              pathname: '/checkout/delivery-payment',
            },
          },
        })
        checkoutSelectors.isReturningCustomer.mockReturnValue(true)
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        return executeThunk(checkoutActions.selectDeliveryStore()).then(() => {
          expect(browserHistory.push).toHaveBeenCalledTimes(0)
        })
      })
      it('new user current path is not delivery', () => {
        getState.mockReturnValue({
          ...initialState,
          routing: {
            location: {
              pathname: '/login',
            },
          },
        })
        checkoutSelectors.isReturningCustomer.mockReturnValue(false)
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        return executeThunk(checkoutActions.selectDeliveryStore()).then(() => {
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
        })
      })
      it('returning user current path is not delivery-payment', () => {
        getState.mockReturnValue({
          ...initialState,
          routing: {
            location: {
              pathname: '/login',
            },
          },
        })
        checkoutSelectors.isReturningCustomer.mockReturnValue(true)
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        return executeThunk(checkoutActions.selectDeliveryStore()).then(() => {
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
        })
      })
      it('should redirect a guest user to this path "/guest/checkout/delivery"', () => {
        getState.mockReturnValue({
          ...initialState,
          checkout: {
            orderSummary: {
              ...initialState.checkout.orderSummary,
              isGuestOrder: true,
            },
          },
          routing: {
            location: {
              pathname: '',
              query: {
                isAnonymous: '',
              },
            },
          },
        })
        checkoutSelectors.isReturningCustomer.mockReturnValue(false)
        checkoutSelectors.isGuestOrder.mockReturnValue(true)
        return executeThunk(checkoutActions.selectDeliveryStore()).then(() => {
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
          expect(browserHistory.push).toHaveBeenCalledWith({
            pathname: '/guest/checkout/delivery',
            query: {
              isAnonymous: '',
            },
          })
        })
      })
    })
  })

  describe('setShowCollectFromStoreModal', () => {
    it('returns the correct action', () => {
      expect(checkoutActions.setShowCollectFromStoreModal(true)).toEqual({
        type: 'SHOW_COLLECT_FROM_STORE_MODAL',
        show: true,
      })
    })
  })

  describe('updateDeliveryOptions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const initialState = {
      account: { user: {} },
      checkout: {
        orderSummary: {
          basket: {
            orderId: '12345',
          },
          deliveryLocations: [
            {
              deliveryLocationType: 'HOME',
              selected: true,
            },
          ],
        },
      },
      config: {
        language: 'en',
        brandName: 'ts',
      },
      features: {
        status: {
          FEATURE_CFSI: true,
        },
      },
      siteOptions: { billingCountries: {} },
    }

    const brandStore = {
      deliveryStoreCode: 'TM8137',
      storeAddress1: 'c/o Top Shop, 60/64 The Strand',
      storeAddress2: '',
      storeCity: 'Strand',
      storeCountry: 'United Kingdom',
      storePostcode: 'WC2N 5LR',
    }

    const notHomeCheckoutWithDeliveryStore = {
      orderSummary: {
        basket: {
          orderId: '12345',
        },
        deliveryLocations: [
          {
            deliveryLocationType: 'STORE',
            selected: true,
          },
        ],
      },
      deliveryStore: brandStore,
    }
    const body = {}
    const createPutOrderSummaryRequestMock = () => {
      const p = new Promise((resolve) => resolve({ body }))
      p.type = 'MOCK_REQUEST_SUCCESS'
      return p
    }
    const putOrderSummaryRequestMock = createPutOrderSummaryRequestMock()
    put.mockImplementation(() => putOrderSummaryRequestMock)

    it('calls putOrderSummary with the correct deliveryStore Details if Home', async () => {
      const store = mockStore(initialState)
      await store.dispatch(checkoutActions.updateDeliveryOptions(true))
      const expectedActions = [putOrderSummaryRequestMock]
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    describe('NOT home delivery', () => {
      beforeEach(() => {
        checkoutSelectors.isStoreOrParcelDelivery.mockReturnValue(true)
      })
      it('checkout has deliveryStore that matches deliveryLocation type selected', async () => {
        const store = mockStore({
          ...initialState,
          checkout: notHomeCheckoutWithDeliveryStore,
        })
        checkoutSelectors.getDeliveryStoreForOrderUpdate.mockReturnValueOnce(
          brandStore
        )
        checkoutSelectors.getSelectedDeliveryType.mockReturnValueOnce(
          'STORE_STANDARD'
        )
        checkoutSelectors.getShipModeId.mockReturnValueOnce(45019)

        await store.dispatch(checkoutActions.updateDeliveryOptions(true))
        expect(put).toHaveBeenCalledWith('/checkout/order_summary', {
          orderId: '12345',
          deliveryType: 'STORE_STANDARD',
          shippingCountry: 'United Kingdom',
          shipModeId: 45019,
          ...brandStore,
        })
      })

      it('show Modal on desktop view and the deliveryStore does not match deliveryLocation type selected', async () => {
        const store = mockStore({
          ...initialState,
          checkout: {
            ...notHomeCheckoutWithDeliveryStore,
            deliveryStore: {
              deliveryStoreCode: 'S08137',
              storeAddress1: 'ParcelShop Hermes',
            },
          },
        })
        isMobile.mockReturnValue(false)
        checkoutSelectors.getDeliveryStoreForOrderUpdate.mockReturnValueOnce(
          null
        )

        await store.dispatch(checkoutActions.updateDeliveryOptions(true))
        const expectedActions = [
          {
            type: 'SHOW_COLLECT_FROM_STORE_MODAL',
            show: true,
          },
        ]
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
        expect(put).not.toHaveBeenCalled()
      })

      it('Do nothing if no deliveryStore and mobile', async () => {
        const store = mockStore({
          ...initialState,
          checkout: {
            ...notHomeCheckoutWithDeliveryStore,
            deliveryStore: null,
          },
        })
        isMobile.mockReturnValue(true)
        checkoutSelectors.getDeliveryStoreForOrderUpdate.mockReturnValueOnce(
          null
        )

        await store.dispatch(checkoutActions.updateDeliveryOptions(true))
        expect(store.getActions()).toEqual([])
        expect(put).not.toHaveBeenCalled()
      })
    })
  })

  describe('saveSelectedPaymentMethod', () => {
    it('returns the correct action', () => {
      const selectedPaymentMethod = 'CARD'

      expect(
        checkoutActions.saveSelectedPaymentMethod(selectedPaymentMethod)
      ).toEqual({
        type: 'SAVE_SELECTED_PAYMENT_METHOD',
        selectedPaymentMethod,
      })
    })
  })

  describe('openPaymentMethods', () => {
    expect(checkoutActions.openPaymentMethods()).toEqual({
      type: 'OPEN_PAYMENT_METHODS',
    })
  })

  describe('closePaymentMethods', () => {
    expect(checkoutActions.closePaymentMethods()).toEqual({
      type: 'CLOSE_PAYMENT_METHODS',
    })
  })

  describe('setRecaptchaToken', () => {
    it('returns the correct action', () => {
      const recaptchaToken = '7bc78545b1a3923cc1e1e19523fd5c3f20b40950'

      expect(checkoutActions.setRecaptchaToken(recaptchaToken)).toEqual({
        type: 'SET_RECAPTCHA_TOKEN',
        recaptchaToken,
      })
    })
  })

  // EXP-313
  describe('setStoreWithParcel', () => {
    const val = 'testvalue'
    let action

    beforeEach(() => {
      action = checkoutActions.setStoreWithParcel(val)
    })

    it('should set storeWithParcel with provided value', () => {
      expect(action.storeWithParcel).toBe(val)
    })
    it('should set type with SET_STORE_WITH_PARCEL', () => {
      expect(action.type).toBe('SET_STORE_WITH_PARCEL')
    })
  })
})
