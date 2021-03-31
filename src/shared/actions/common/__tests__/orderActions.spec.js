import { browserHistory } from 'react-router'
import thunk from 'redux-thunk'
import deepFreeze from 'deep-freeze'

import * as api from '../../../lib/api-service'
import configureMockStore from 'redux-mock-store'
import { orderMock } from '../../../../../test/mocks/orderCreate'

// mocks
import psd2GetOrderResponse from '../__mocks__/psd2GetOrderResponse'
import psd2GetOrderFailedResponse from '../__mocks__/psd2GetOrderFailedResponse'

// Actions
import { getAccount } from '../accountActions'
import {
  createThreeDSecure1Form,
  createThreeDSecureFlexForm,
} from '../../../lib/checkout-utilities/create-three-d-secure-form'
import { setFormMessage } from '../formActions'
import { updateMenuForAuthenticatedUser } from '../navigationActions'
import * as orderActions from '../orderActions'
import * as orderAuxiliaryActions from '../orderAuxiliaryActions'
import { sendAnalyticsErrorMessage, ANALYTICS_ERROR } from '../../../analytics'
import * as espotActions from '../espotActions'
import * as clearPayActions from '../clearPayActions'

import {
  getCheckoutBag,
  syncClientForEmailExists,
  getOrderSummary,
} from '../checkoutActions'
import { WCS_ERRORS } from '../../../lib/wcsCodes'
import { prepareKlarnaPayload } from '../../../lib/checkout-utilities/klarna-utils'
import { klarnaPayload } from '../../../../../test/unit/lib/klarna-utils-mocks'
import * as userAuthSelectors from '../../../selectors/userAuthSelectors'

jest.mock('../checkoutActions', () => ({
  getCheckoutBag: jest.fn(),
  syncClientForEmailExists: jest.fn(),
  getOrderSummary: jest.fn(),
}))

jest.mock('../espotActions', () => ({
  setThankyouPageEspots: jest.fn(() => ({
    type: 'SET_ESPOT_CONTENT',
  })),
}))

jest.mock('../../../actions/common/formActions', () => ({
  setFormMessage: jest.fn(),
  resetForm: jest.fn((formName) => ({
    type: 'RESET_FORM_MOCK',
    formName,
  })),
}))

jest.mock('../accountActions', () => ({
  getAccount: jest.fn(),
}))

jest.mock('../../../lib/checkout-utilities/create-three-d-secure-form', () => ({
  createThreeDSecure1Form: jest.fn(),
  createThreeDSecureFlexForm: jest.fn(),
}))

jest.mock('../../../lib/checkout-utilities/order-summary', () => ({
  fixEuropeanOrderCompleted: jest.fn(() => ({})),
}))

jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn(() => {
    return "There's been a temporary issue. Please confirm your order again."
  }),
}))

jest.mock('../../../actions/common/navigationActions', () => ({
  updateMenuForAuthenticatedUser: jest.fn(),
}))

jest.mock('../../../lib/checkout-utilities/klarna-utils', () => ({
  prepareKlarnaPayload: jest.fn(),
}))

jest
  .spyOn(userAuthSelectors, 'isUserAuthenticated')
  .mockImplementation(() => false)

jest.spyOn(browserHistory, 'push').mockImplementation(() => null)

jest.spyOn(espotActions, 'setThankyouPageEspots').mockImplementation(() => ({
  type: 'SET_ESPOT_CONTENT',
}))

jest
  .spyOn(orderAuxiliaryActions, 'setFinalisedOrder')
  .mockImplementation(() => ({
    type: 'SET_FINALISED_ORDER',
  }))

getCheckoutBag.mockReturnValue({
  type: 'MOCK_CHECKOUTBAG',
})

getOrderSummary.mockReturnValue({
  type: 'MOCK_GET_ORDER_SUMMARY',
})

syncClientForEmailExists.mockReturnValue({
  type: 'MOCK_SYNC_CLIENT',
})

updateMenuForAuthenticatedUser.mockReturnValue({
  type: 'UPDATE_MENU_MOCK',
})

setFormMessage.mockReturnValue({
  type: 'SET_FORM_MESSAGE_MOCK',
  formName: 'order',
})

jest.mock('../authActions', () => ({
  logoutRequest: jest.fn(() => ({ type: 'LOGOUT_REQUEST_MOCK' })),
}))

jest.mock('../clearPayActions', () => ({
  initialiseClearPay: jest.fn(() => ({ type: 'INIT_CLEAR_PAY' })),
}))

const initialState = deepFreeze({
  config: {
    brandCode: 'ts',
    language: 'en-gb',
  },
  account: {
    user: {},
  },
  auth: {
    authentication: 'full',
  },
  siteOptions: {
    billCountries: {},
  },
  checkout: {
    orderError: false,
    verifyPayment: {},
    savePaymentDetails: false,
  },
  forms: {
    checkout: {
      billingCardDetails: {
        fields: {},
      },
      guestUser: {
        fields: {},
      },
    },
    giftCard: {
      fields: {},
    },
  },
  klarna: {
    orderSummaryHash: '123',
    authorizationToken: 'valid_token',
  },
})

const putMockError = (error) => {
  const p = new Promise((_, reject) => {
    reject(error)
  })
  p.type = 'PUT_ORDER_MOCK_FAILED'
  return p
}

const putMockResponse = (response) => {
  const p = new Promise((resolve) => {
    resolve(response)
  })
  p.type = 'PUT_ORDER_MOCK_RESPONSE'
  return p
}

const getMockError = (error) => {
  const p = new Promise((_, reject) => {
    reject(error)
  })
  p.type = 'GET_MOCK_FAILED'
  return p
}

const getMockResponse = (response) => {
  const p = new Promise((resolve) => {
    resolve(response)
  })
  p.type = 'GET_MOCK_RESPONSE'
  return p
}

const getAccountMock = () => {
  const p = new Promise((resolve) => resolve())
  p.type = 'GET_ACCOUNT_MOCK'
  return p
}

const postOrderMockSuccess = () => {
  const p = new Promise((resolve) =>
    resolve({
      body: {
        completedOrder: {
          deliveryAddress: '',
        },
      },
    })
  )
  p.type = 'POST_ORDER_MOCK_SUCCESS'
  return p
}

const postMockResponse = (response) => {
  const p = new Promise((resolve) => {
    resolve(response)
  })
  p.type = 'POST_ORDER_MOCK_RESPONSE'
  return p
}

describe('Order Actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const postSpy = jest.spyOn(api, 'post')
  const putSpy = jest.spyOn(api, 'put')
  const getSpy = jest.spyOn(api, 'get')

  beforeEach(() => {
    jest.clearAllMocks()
    postSpy.mockReset()
    putSpy.mockReset()
    getSpy.mockReset()
  })

  describe('showThirdPartyPaymentModal', () => {
    it('should show a modal', () => {
      const store = mockStore(initialState)
      store.dispatch(orderActions.showThirdPartyPaymentModal())
      expect(store.getActions()).toEqual([
        {
          cancelled: false,
          type: 'SET_MODAL_CANCELLED',
        },
        {
          mode: 'paymentPunchout',
          type: 'SET_MODAL_MODE',
        },
        {
          children:
            '<iframe class="ThirdPartyPaymentIFrame" name="payment-punchout-iframe" src="about:blank" sandbox="allow-forms allow-same-origin allow-scripts" data-reactroot="">Iframes are not supported by this browser.</iframe>',
          type: 'SET_MODAL_CHILDREN',
        },
        {
          modalType: 'dialog',
          type: 'SET_MODAL_TYPE',
        },
        {
          entryPoint: false,
          type: 'OPEN_MODAL',
        },
      ])
    })
  })

  describe('setNewlyConfirmedOrder', () => {
    const initialState = deepFreeze({
      checkout: {
        newlyConfirmedOrder: false,
      },
    })

    it('should set `newlyConfirmedOrder` to false by default', () => {
      const store = mockStore(initialState)

      store.dispatch(orderActions.setNewlyConfirmedOrder())
      expect(store.getActions()).toEqual([
        {
          type: 'SET_NEWLY_CONFIRMED_ORDER',
          newlyConfirmedOrder: false,
        },
      ])
    })

    it('should update `newlyConfirmedOrder` value', () => {
      const store = mockStore(initialState)

      store.dispatch(orderActions.setNewlyConfirmedOrder(true))
      expect(store.getActions()).toEqual([
        {
          type: 'SET_NEWLY_CONFIRMED_ORDER',
          newlyConfirmedOrder: true,
        },
      ])
    })
  })

  describe('createOrder', () => {
    const postActions = {
      bad: {},
      good: {},
    }

    const createDispatchMock = (body) => {
      return jest.fn((event) => {
        const response = { body }
        if (event === postActions.good) {
          return Promise.resolve(response)
        } else if (event === postActions.bad) {
          return Promise.reject({ response })
        }
        return Promise.resolve()
      })
    }

    const createGetStateMock = () => {
      return jest.fn(() => ({
        config: {},
        account: {
          user: {},
        },
        siteOptions: {},
        checkout: {
          verifyPayment: {},
          finalisedOrder: {},
        },
      }))
    }

    const postOrderMockSuccessVbv = () => {
      const p = new Promise((resolve) =>
        resolve({
          body: {
            vbvForm: {},
          },
        })
      )
      p.type = 'POST_ORDER_MOCK_SUCCESS'
      return p
    }

    const postOrderMockSuccess3dsFlex1 = () => {
      const p = new Promise((resolve) =>
        resolve({
          body: {
            threeDSVersion: '1.0.2',
          },
        })
      )
      p.type = 'POST_ORDER_MOCK_SUCCESS'
      return p
    }

    const postOrderMockSuccess3dsFlex2 = () => {
      const p = new Promise((resolve) =>
        resolve({
          body: {
            threeDSVersion: '2.2.0',
          },
        })
      )
      p.type = 'POST_ORDER_MOCK_SUCCESS'
      return p
    }

    // PayPal/Masterpass/Alipay/...
    const postOrderMockSuccessWithPaymentUrl = () => {
      const url = 'https://www.sandbox.paypal.com/...'
      const p = new Promise((resolve) =>
        resolve({
          body: {
            paypalUrl: url,
            paymentUrl: url,
          },
        })
      )
      p.type = 'POST_ORDER_MOCK_SUCCESS'
      return p
    }

    const postOrderMockFailed = () => {
      const p = new Promise((resolve, reject) => reject({}))
      p.type = 'POST_ORDER_MOCK_FAILED'
      return p
    }

    const postOrderMockFailedOOS = () => {
      const p = new Promise((resolve, reject) => {
        reject({
          response: {
            body: {
              wcsErrorCode: WCS_ERRORS.OUT_OF_STOCK,
            },
          },
        })
      })
      p.type = 'POST_ORDER_MOCK_FAILED'
      return p
    }

    it('Checks the correct actions have been dispatched on a successful order', async () => {
      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)
      const successfulPostOrder = postOrderMockSuccess()
      postSpy.mockImplementation(() => successfulPostOrder)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
      })
      const expectedActions = [
        { type: 'SET_FORM_MESSAGE_MOCK', formName: 'order' },
        { type: 'CLEAR_ORDER_ERROR' },
        { type: 'CLEAR_ORDER_ERROR_PAYMENT_DETAILS' },
        { type: 'CLEAR_ORDER_PENDING' },
        { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
        { type: 'CLEAR_PRE_PAYMENT_CONFIG' },
        { type: 'SET_FINALISED_ORDER' },
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'CLEAR_PRE_PAYMENT_CONFIG' },
        successfulPostOrder,
        successfulGetAccount,
        { type: 'EMPTY_SHOPPING_BAG' },
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'COMPLETE_ORDER' },
        { data: {}, type: 'SET_ORDER_COMPLETED' },
        { type: 'SET_NEWLY_CONFIRMED_ORDER', newlyConfirmedOrder: true },
        { formName: 'billingCardDetails', type: 'RESET_FORM_MOCK' },
        { formName: 'giftCard', type: 'RESET_FORM_MOCK' },
        { type: 'UPDATE_MENU_MOCK' },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 0, persist: true },
        { type: 'SET_ESPOT_CONTENT' },
      ]

      await store.dispatch(orderActions.createOrder(orderMock))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Checks the correct actions have been dispatched on a failed order', async () => {
      const failedPostOrder = postOrderMockFailed()
      postSpy.mockImplementation(() => failedPostOrder)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
      })
      const expectedActions = [
        {
          type: 'SET_FORM_MESSAGE_MOCK',
          formName: 'order',
        },
        {
          type: 'CLEAR_ORDER_ERROR',
        },
        {
          type: 'CLEAR_ORDER_ERROR_PAYMENT_DETAILS',
        },
        {
          type: 'CLEAR_ORDER_PENDING',
        },
        {
          type: 'CLEAR_THREE_D_SECURE_PROMPT',
        },
        {
          type: 'CLEAR_PRE_PAYMENT_CONFIG',
        },
        {
          type: 'SET_FINALISED_ORDER',
        },
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        {
          type: 'CLEAR_PRE_PAYMENT_CONFIG',
        },
        failedPostOrder,
        {
          type: 'MOCK_SYNC_CLIENT',
        },
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
        {
          type: 'SET_FORM_MESSAGE_MOCK',
          formName: 'order',
        },
        {
          errorMessage: 'Error paying order',
          type: 'MONTY/ANALYTICS.SEND_ERROR_MESSAGE',
        },
        {
          type: 'BLOCK_KLARNA_UPDATE',
          isKlarnaUpdateBlocked: false,
        },
      ]
      await store.dispatch(orderActions.createOrder(orderMock))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Checks the correct actions have been dispatched on a failed order for OOS', async () => {
      postSpy.mockImplementation(postOrderMockFailedOOS)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
      })
      expect(getCheckoutBag).toHaveBeenCalledTimes(0)
      await store.dispatch(orderActions.createOrder(orderMock))
      expect(getCheckoutBag).toHaveBeenCalledTimes(1)
    })

    it('should call setThankyouPageEspots action', async () => {
      postSpy.mockImplementation(postOrderMockSuccess)
      getAccount.mockImplementation(getAccountMock)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
      })

      expect(espotActions.setThankyouPageEspots).not.toHaveBeenCalled()
      await store.dispatch(orderActions.createOrder(orderMock))
      expect(espotActions.setThankyouPageEspots).toHaveBeenCalledTimes(1)
      expect(espotActions.setThankyouPageEspots).toHaveBeenCalledWith({
        deliveryAddress: '',
      })
    })

    it('should set correct form message if timeout posting order', async () => {
      postSpy.mockImplementation(() => postActions.bad)
      const dispatchMock = createDispatchMock({
        statusCode: 504,
      })
      const getStateMock = createGetStateMock()
      setFormMessage.mockReturnValue({
        type: 'SET_FORM_MESSAGE_MOCK',
        formName: 'order',
        message: {
          type: 'error',
          message:
            "There's been a temporary issue. Please confirm your order again.",
        },
      })

      await orderActions.concludeOrderCreation({})(dispatchMock, getStateMock)
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SET_FORM_MESSAGE_MOCK',
        formName: 'order',
        message: {
          type: 'error',
          message:
            "There's been a temporary issue. Please confirm your order again.",
        },
      })
    })

    it('should redirect to 3D Secure 1 authentication if vbvForm is returned', async () => {
      postSpy.mockImplementation(postOrderMockSuccessVbv)
      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)

      const threeDSecureForm =
        '<form method="post" action="https://secure-test.worldpay.com/"></form>'
      createThreeDSecure1Form.mockReturnValueOnce(threeDSecureForm)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
      })
      const expectedAction = [
        {
          type: 'SET_THREE_D_SECURE_PROMPT',
          data: threeDSecureForm,
        },
      ]

      await store.dispatch(orderActions.createOrder(orderMock))
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should not dispatch getAccount action if it is a guest checkout order', async () => {
      const state = deepFreeze({
        ...initialState,
        forms: {
          ...initialState.forms,
          checkout: {
            ...initialState.forms.checkout,
            guestUser: {
              ...initialState.forms.checkout.guestUser,
              fields: {
                email: 'email@mail.com',
              },
            },
          },
        },
        checkout: {
          ...initialState.checkout,
          orderSummary: {
            ...initialState.checkout.orderSummary,
            isGuestOrder: true,
          },
        },
      })

      const store = mockStore({
        ...state,
        checkout: {
          ...state.checkout,
          finalisedOrder: orderMock,
        },
      })

      postSpy.mockImplementation(postOrderMockSuccessVbv)

      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)

      const threeDSecureForm =
        '<form method="post" action="https://secure-test.worldpay.com/"></form>'
      createThreeDSecure1Form.mockReturnValueOnce(threeDSecureForm)

      await store.dispatch(orderActions.createOrder(state))
      const getAccountAction = store
        .getActions()
        .map((action) => action.type)
        .includes('GET_ACCOUNT_MOCK')
      expect(getAccountAction).toBe(false)
    })

    it('should dispatch showThirdPartyPaymentModal if vbvForm is returned and FEATURE_PSD2_PUNCHOUT_POPUP is enabled', async () => {
      postSpy.mockImplementation(postOrderMockSuccessVbv)

      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)

      const threeDSecureForm =
        '<form method="post" action="https://secure-test.worldpay.com/"></form>'
      createThreeDSecure1Form.mockReturnValueOnce(threeDSecureForm)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
        features: {
          status: {
            FEATURE_PSD2_PUNCHOUT_POPUP: true,
          },
        },
      })
      const expectedAction = [
        {
          mode: 'paymentPunchout',
          type: 'SET_MODAL_MODE',
        },
      ]
      await store.dispatch(orderActions.createOrder(orderMock))
      expect(createThreeDSecure1Form).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should dispatch retrievePrePaymentConfig for card payments if FEATURE_PSD2_PUNCHOUT_POPUP and FEATURE_PSD2_3DS2 are enabled', async () => {
      const config = {}
      const postPrePaymentConfigMockSuccess = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: config,
          })
        )
        p.type = 'POST_ORDER_MOCK_SUCCESS'
        return p
      }

      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)
      const successfulPostOrder = postOrderMockSuccess()
      const successfulPostPrePaymentConfig = postPrePaymentConfigMockSuccess()
      postSpy.mockImplementation((path) => {
        return path === '/psd2/pre-payment-config'
          ? successfulPostPrePaymentConfig
          : successfulPostOrder
      })

      const store = mockStore({
        ...initialState,
        features: {
          status: {
            FEATURE_PSD2_PUNCHOUT_POPUP: true,
            FEATURE_PSD2_3DS2: true,
          },
        },
        paymentMethods: [
          {
            value: 'VISA',
            type: 'CARD',
          },
        ],
      })

      const expectedAction = [
        {
          config,
          type: 'SET_PRE_PAYMENT_CONFIG',
        },
      ]

      await store.dispatch(
        orderActions.createOrder({
          ...orderMock,
          paymentType: 'VISA',
        })
      )
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should call createThreeDSecureFlexForm and dispatch showThirdPartyPaymentModal for card 3DS v1 payments if FEATURE_PSD2_PUNCHOUT_POPUP and FEATURE_PSD2_3DS2 are enabled', async () => {
      postSpy.mockImplementation(postOrderMockSuccess3dsFlex1)
      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
        features: {
          status: {
            FEATURE_PSD2_PUNCHOUT_POPUP: true,
            FEATURE_PSD2_3DS2: true,
          },
        },
      })

      await store.dispatch(
        orderActions.createOrder({
          ...orderMock,
          paymentType: 'VISA',
        })
      )

      const expectedAction = [
        {
          mode: 'paymentPunchout',
          type: 'SET_MODAL_MODE',
        },
      ]
      expect(createThreeDSecureFlexForm).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should call createThreeDSecureFlexForm and dispatch showThirdPartyPaymentModal for card 3DS v2 payments if FEATURE_PSD2_PUNCHOUT_POPUP and FEATURE_PSD2_3DS2 are enabled', async () => {
      postSpy.mockImplementation(postOrderMockSuccess3dsFlex2)
      const successfulGetAccount = getAccountMock()
      getAccount.mockImplementation(() => successfulGetAccount)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
        features: {
          status: {
            FEATURE_PSD2_PUNCHOUT_POPUP: true,
            FEATURE_PSD2_3DS2: true,
          },
        },
      })

      await store.dispatch(
        orderActions.createOrder({
          ...orderMock,
          paymentType: 'VISA',
        })
      )

      const expectedAction = [
        {
          mode: 'paymentPunchout',
          type: 'SET_MODAL_MODE',
        },
      ]
      expect(createThreeDSecureFlexForm).toHaveBeenCalledTimes(1)
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should return error object if posting order fails', () => {
      postSpy.mockImplementation(() => postActions.bad)
      const dispatchMock = createDispatchMock({
        validationErrors: [
          {
            message: 'Please insert a valid card number',
          },
        ],
      })

      const getStateMock = createGetStateMock()

      return orderActions
        .concludeOrderCreation({})(dispatchMock, getStateMock)
        .then((error) => {
          expect(error.message).toBe('Please insert a valid card number')
        })
    })

    it('should clear checkout details if the payment is declined for guest customers', async () => {
      postSpy.mockImplementation(() => postActions.bad)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          orderSummary: {
            isGuestOrder: true,
          },
          finalisedOrder: orderMock,
        },
      })

      await store.dispatch(orderActions.concludeOrderCreation())
      expect(getOrderSummary).toHaveBeenCalledTimes(1)
      expect(getOrderSummary).toHaveBeenCalledWith({
        clearGuestDetails: true,
        shouldSync: true,
        shouldUpdateBag: false,
        shouldUpdateForms: false,
      })
    })

    it('should push an error to the GTM DataLayer if posting order fails', async () => {
      postSpy.mockImplementation(() => postActions.bad)
      const store = mockStore({})
      const expectedActions = [
        {
          type: 'MONTY/ANALYTICS.SEND_ERROR_MESSAGE',
          errorMessage: 'Error paying order',
        },
      ]
      await store.dispatch(
        sendAnalyticsErrorMessage(ANALYTICS_ERROR.CONFIRM_AND_PAY)
      )
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('should dispatch Klarna reset actions if paid with Klarna', async () => {
      postSpy.mockImplementation(postOrderMockSuccess)
      getAccount.mockImplementation(getAccountMock)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
        },
        forms: {
          ...initialState.forms,
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'KLRNA',
                },
              },
            },
          },
        },
      })
      const expectedActions = [{ type: 'RESET_KLARNA' }]

      await store.dispatch(
        orderActions.createOrder({
          ...orderMock,
          paymentType: 'KLRNA',
        })
      )
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('should not dispatch blockKlarnaPayment actions if paid guest checkout', async () => {
      postSpy.mockImplementation(postOrderMockSuccess)
      getAccount.mockImplementation(getAccountMock)

      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          orderSummary: {
            isGuestOrder: true,
          },
          finalisedOrder: orderMock,
        },
        forms: {
          ...initialState.forms,
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'KLRNA',
                },
              },
            },
          },
        },
      })

      await store.dispatch(
        orderActions.createOrder({
          ...orderMock,
          paymentType: 'KLRNA',
        })
      )

      const getAccountAction = store
        .getActions()
        .map((action) => action.type)
        .includes('BLOCK_KLARNA_PAYMENT')

      expect(getAccountAction).toBe(false)
    })

    describe('Redirection to order-complete', () => {
      it('should not redirect to /order-complete for 3D Secure payments', async () => {
        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockSuccessVbv)

        const store = mockStore({
          ...initialState,
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(orderActions.createOrder(orderMock))
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
      })

      it('should not redirect to /order-complete for PayPal/Masterpass/Alipay/...', async () => {
        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockSuccessWithPaymentUrl)

        const store = mockStore({
          ...initialState,
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(orderActions.createOrder(orderMock))
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
      })

      it('should redirect to /order-complete for non 3D Secure payments', async () => {
        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockSuccess)

        const store = mockStore({
          ...initialState,
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(orderActions.createOrder(orderMock))
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith(
          `/order-complete?orderId=${orderMock.orderDeliveryOption.orderId}&noRedirectionFromPaymentGateway=true`
        )
      })
    })

    describe('ApplePay', () => {
      it('should not show the loader', async () => {
        const applePaySession = {
          STATUS_SUCCESS: 'STATUS_SUCCESS',
          completePayment: jest.fn(),
        }
        postSpy.mockImplementation(() => postActions.good)

        const store = mockStore({
          ...initialState,
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'APPLE',
                  },
                },
              },
            },
          },
          checkout: {
            ...initialState.checkout,
            orderSummary: {
              isGuestOrder: true,
            },
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(
          orderActions.concludeOrderCreation({ applePaySession })
        )
        expect(store.getActions()).not.toBe(
          expect.arrayContaining([{ type: 'AJAXCOUNTER_INCREMENT' }])
        )
      })

      it('should call applePaySession.completePayment if payment is successful', async () => {
        const applePaySession = {
          STATUS_SUCCESS: 'STATUS_SUCCESS',
          completePayment: jest.fn(),
        }

        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockSuccess)

        const store = mockStore({
          ...initialState,
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'APPLE',
                  },
                },
              },
            },
          },
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(
          orderActions.createOrder(orderMock, applePaySession)
        )

        expect(applePaySession.completePayment).toHaveBeenCalledWith(
          'STATUS_SUCCESS'
        )
      })

      it('should call applePaySession.completePayment if payment is denied', async () => {
        const applePaySession = {
          STATUS_FAILURE: 'STATUS_FAILURE',
          completePayment: jest.fn(),
        }

        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockFailed)

        const store = mockStore({
          ...initialState,
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'APPLE',
                  },
                },
              },
            },
          },
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(
          orderActions.createOrder(orderMock, applePaySession)
        )

        expect(applePaySession.completePayment).toHaveBeenCalledWith(
          'STATUS_FAILURE'
        )
      })
    })

    describe('ClearPay', () => {
      const postOrderMockSuccess = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: {
              cardBrand: 'CLRPY',
              expires: 'expires',
              orderId: 'orderId',
              paymentToken: 'paymentToken',
              policyId: 'policyId',
              success: true,
              tranId: 'tranId',
            },
          })
        )
        p.type = 'POST_ORDER_MOCK_SUCCESS'
        return p
      }

      const postOrderMockFailed = () => {
        const p = new Promise((resolve, reject) =>
          reject({
            body: {
              cardBrand: 'CLRPY',
              expires: 'expires',
              orderId: 'orderId',
              paymentToken: 'paymentToken',
              policyId: 'policyId',
              success: false,
              errorMessage: 'Ops something wrong',
              tranId: 'tranId',
            },
          })
        )
        p.type = 'POST_ORDER_MOCK_FAILED'
        return p
      }

      it('should dispatch initialiseClearPay action if post is successful', async () => {
        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockSuccess)

        const store = mockStore({
          ...initialState,
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'CLRPY',
                  },
                },
              },
            },
          },
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(orderActions.createOrder(orderMock))

        expect(clearPayActions.initialiseClearPay).toHaveBeenCalledWith({
          cardBrand: 'CLRPY',
          expires: 'expires',
          orderId: 'orderId',
          paymentToken: 'paymentToken',
          policyId: 'policyId',
          success: true,
          tranId: 'tranId',
        })

        expect(store.getActions()).toEqual(
          expect.arrayContaining([{ type: 'INIT_CLEAR_PAY' }])
        )

        expect(store.getActions()).toEqual(
          expect.arrayContaining([{ type: 'AJAXCOUNTER_DECREMENT' }])
        )
      })

      it('should not dispatch initialiseClearPay action if post is successful', async () => {
        getAccount.mockImplementation(getAccountMock)
        postSpy.mockImplementation(postOrderMockFailed)

        const store = mockStore({
          ...initialState,
          forms: {
            checkout: {
              billingCardDetails: {
                fields: {
                  paymentType: {
                    value: 'CLRPY',
                  },
                },
              },
            },
          },
          checkout: {
            ...initialState.checkout,
            finalisedOrder: orderMock,
          },
        })

        await store.dispatch(orderActions.createOrder(orderMock))

        expect(clearPayActions.initialiseClearPay).not.toHaveBeenCalled()

        expect(store.getActions()).not.toEqual(
          expect.arrayContaining([{ type: 'INIT_CLEAR_PAY' }])
        )
      })
    })
  })

  describe('submitOrder', () => {
    const createGetStateMock = ({
      paymentType = 'CARD',
      giftcardCovered = false,
    } = {}) => {
      return jest.fn(() => ({
        config: {
          brandName: 'topshop',
        },
        account: {},
        checkout: { savePaymentDetails: false },
        shoppingBag: {
          bag: {
            isOrderCoveredByGiftCards: giftcardCovered,
          },
        },
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: paymentType,
                },
              },
            },
            guestUser: {
              fields: {
                email: {
                  value: 'email@mail.com',
                },
              },
            },
          },
        },
        klarna: {
          orderSummaryHash: '123',
          authorizationToken: 'valid_token',
        },
      }))
    }

    it('should dispatch  correct `createOrder` action if not `KLARNA` payment type', () => {
      const dispatchMock = jest.fn()
      const getStateMock = createGetStateMock()
      const createOrderMock = jest.fn()
      const order = deepFreeze({
        orderDeliveryOption: {
          orderId: '12345',
        },
      })
      const deps = {
        generateOrder: () => order,
        createOrder: createOrderMock,
      }
      orderActions.submitOrder(deps)(dispatchMock, getStateMock)
      expect(createOrderMock).toHaveBeenCalledWith(order)
    })

    it('should dispatch  correct `createOrder` action if it is a guest checkout order', () => {
      const dispatchMock = jest.fn()
      const getStateMock = createGetStateMock()
      const createOrderMock = jest.fn()
      const order = deepFreeze({
        orderDeliveryOption: {
          orderId: '12345',
        },
        isGuestOrder: true,
        email: 'email@mail.com',
      })
      const deps = {
        generateOrder: () => order,
        createOrder: createOrderMock,
      }
      orderActions.submitOrder(deps)(dispatchMock, getStateMock)
      expect(createOrderMock).toHaveBeenCalledWith(order)
    })

    it('should be authorized by klarna before creating an order when payment type is `KLARNA`', () => {
      prepareKlarnaPayload.mockReturnValueOnce(klarnaPayload)
      const dispatchMock = jest.fn()
      const getStateMock = createGetStateMock({ paymentType: 'KLRNA' })
      const order = deepFreeze({
        orderDeliveryOption: {
          orderId: '12345',
        },
      })
      const deps = {
        generateOrder: () => order,
      }
      orderActions.submitOrder(deps)(dispatchMock, getStateMock)
      expect(prepareKlarnaPayload).toHaveBeenCalled()
    })

    it('when payment type is `KLARNA` and gift card covers the cost, should create order', () => {
      const dispatchMock = jest.fn()
      const getStateMock = createGetStateMock({
        paymentMethod: 'KLRNA',
        isOrderCoveredByGiftCards: true,
      })
      const createOrderMock = jest.fn()
      const order = deepFreeze({
        orderDeliveryOption: {
          orderId: '12345',
        },
      })
      const deps = {
        generateOrder: () => order,
        createOrder: createOrderMock,
      }
      orderActions.submitOrder(deps)(dispatchMock, getStateMock)
      expect(createOrderMock).toHaveBeenCalledWith(order)
    })

    it('should send a payment method intention event to Google Analytics', async () => {
      const order = deepFreeze({
        orderDeliveryOption: {
          orderId: '12345',
        },
        paymentType: 'VISA',
      })
      const deps = {
        generateOrder: () => order,
        createOrder: () => ({ type: 'MOCK_CREATE_ORDER_ACTION' }),
      }
      const expectedActions = [
        {
          type: 'MONTY/ANALYTICS.SEND_PAYMENT_METHOD_INTENTION_EVENT',
          eventName: 'paymentMethodIntention',
          payload: {
            orderId: order.orderDeliveryOption.orderId,
            selectedPaymentMethod: order.paymentType,
          },
        },
        { type: 'MOCK_CREATE_ORDER_ACTION' },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.submitOrder(deps))
      expect(store.getActions()).toEqual(expectedActions)
    })

    describe('processOrder', () => {
      describe('when no order payload is found', () => {
        it('should dispatch error', async () => {
          const store = mockStore({
            ...initialState,
            checkout: {},
          })

          const expectedActions = [
            { type: 'AJAXCOUNTER_INCREMENT' },
            { type: 'AJAXCOUNTER_DECREMENT' },
            {
              type: 'SET_ORDER_ERROR',
              error: `There's been a temporary issue. Please confirm your order again.`,
            },
          ]

          await store.dispatch(orderActions.processOrder())
          expect(store.getActions()).toEqual(expectedActions)
        })
      })

      describe('with order payload', () => {
        beforeAll(() => {
          getAccount.mockImplementation(getAccountMock)
        })
        afterAll(() => {
          getAccount.mockClear()
        })

        const state = deepFreeze({
          ...initialState,
          checkout: {
            verifyPayment: {
              orderId: '12345',
            },
          },
        })

        describe('with orders that have been confirmed', () => {
          const confirmedOrderState = deepFreeze({
            ...state,
            routing: {
              location: {
                search: '&orderConfirmed=true',
              },
            },
          })

          it('should request GET order', async () => {
            getSpy.mockImplementation(() => getMockResponse({ body: {} }))
            const store = mockStore(confirmedOrderState)

            await store.dispatch(orderActions.processOrder())
            expect(api.get).toHaveBeenCalledTimes(1)
            expect(api.get).toHaveBeenCalledWith(
              `/account/order-history/12345`,
              false
            )
          })

          it('should not request GET order when refreshing the page', async () => {
            const confirmedOrderState = deepFreeze({
              ...state,
              auth: {
                authentication: false,
              },
              routing: {
                location: {
                  search: '&orderConfirmed=true',
                },
              },
            })
            getSpy.mockImplementation(() => getMockResponse({ body: {} }))
            const store = mockStore(confirmedOrderState)
            await store.dispatch(orderActions.processOrder())
            expect(api.get).toHaveBeenCalledTimes(0)
          })

          it('should not request GET order for a guest user on page refresh', async () => {
            const guestUserState = {
              ...initialState,
              auth: {
                authentication: false,
              },
            }
            getSpy.mockImplementation(() => getMockResponse({ body: {} }))
            const store = mockStore(guestUserState)
            await store.dispatch(orderActions.processOrder())
            expect(api.get).toHaveBeenCalledTimes(0)
          })

          describe('when GET order request is successful', () => {
            it('should not dispatch updateOrderDetails action for pending orders', async () => {
              const getOrderPending = () =>
                getMockResponse({ body: { statusCode: 'P' } })
              getSpy.mockImplementation(getOrderPending)

              const store = mockStore(confirmedOrderState)
              const expectedActions = [
                { type: 'AJAXCOUNTER_INCREMENT' },
                getOrderPending(),
                { type: 'AJAXCOUNTER_DECREMENT' },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
                { type: 'CLEAR_FINALISED_ORDER' },
              ]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(expectedActions)
            })

            it('should dispatch updateOrderDetails', async () => {
              getSpy.mockImplementation(() =>
                getMockResponse({ body: { statusCode: '200' } })
              )

              const store = mockStore(confirmedOrderState)
              const expectedActions = [
                { type: 'UPDATE_ORDER_DETAIL' },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'UPDATE_MENU_MOCK' },
                {
                  type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
                  count: 0,
                  persist: false,
                },
                { type: 'AJAXCOUNTER_DECREMENT' },
                { type: 'SET_ORDER_COMPLETED', data: {} },
                getAccount(),
                { type: 'SET_ESPOT_CONTENT' },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
                { type: 'CLEAR_FINALISED_ORDER' },
              ]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(
                expect.arrayContaining(expectedActions)
              )
            })
          })

          describe('when GET order request is unsuccessful', () => {
            it('should handle error', async () => {
              const failedOrder = getMockError({})
              getSpy.mockImplementation(() => failedOrder)

              const store = mockStore(confirmedOrderState)
              const expectedActions = [
                { type: 'AJAXCOUNTER_INCREMENT' },
                failedOrder,
                { type: 'AJAXCOUNTER_DECREMENT' },
                { type: 'SET_ORDER_ERROR', error: 'Error processing order' },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
                { type: 'CLEAR_FINALISED_ORDER' },
              ]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(expectedActions)
            })
          })

          describe('when order is confirmed but query param `orderConfirmed=true` is not set', () => {
            const state = {
              ...initialState,
              checkout: {
                verifyPayment: {
                  orderId: '12345',
                },
              },
            }
            it('fails to confirm the order and therefore tries to fetch confirmed order', async () => {
              const failedOrder = putMockError({ status: 412 })
              const successfulOrder = getMockResponse({ body: {} })

              putSpy.mockImplementation(() => failedOrder)
              getSpy.mockImplementation(() => successfulOrder)

              const store = mockStore(state)

              const expectedActions = [failedOrder, successfulOrder]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(
                expect.arrayContaining(expectedActions)
              )
            })
          })
        })

        describe('with orders that need to be confirmed', () => {
          const state = deepFreeze({
            ...initialState,
            checkout: {
              verifyPayment: {
                orderId: '12345',
              },
            },
          })

          it('should call PUT order', async () => {
            putSpy.mockImplementation(() => putMockResponse({ body: {} }))
            const store = mockStore(state)

            await store.dispatch(orderActions.processOrder())
            expect(api.put).toHaveBeenCalledTimes(1)
            expect(api.put).toHaveBeenCalledWith(
              '/order',
              state.checkout.verifyPayment,
              false
            )
          })

          describe('when PUT order request is successful', () => {
            it('should dispatch updateOrderDetails', async () => {
              const successfulOrder = putMockResponse({
                body: { statusCode: '200' },
              })

              putSpy.mockImplementation(() => successfulOrder)

              const store = mockStore(state)
              const expectedActions = [
                { type: 'AJAXCOUNTER_INCREMENT' },
                successfulOrder,
                { type: 'UPDATE_ORDER_DETAIL' },
                { type: 'UPDATE_MENU_MOCK' },
                {
                  type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
                  count: 0,
                  persist: false,
                },
                { type: 'AJAXCOUNTER_DECREMENT' },
                getAccount(),
                { type: 'SET_ORDER_COMPLETED', data: {} },
                { type: 'SET_ESPOT_CONTENT' },
                {
                  type: 'SET_NEWLY_CONFIRMED_ORDER',
                  newlyConfirmedOrder: true,
                },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
                { type: 'CLEAR_FINALISED_ORDER' },
              ]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(expectedActions)
            })
          })

          describe('when PUT order request is unsuccessful', () => {
            it('should handle error', async () => {
              const failedOrder = putMockError({})
              putSpy.mockImplementation(() => failedOrder)

              const store = mockStore(state)
              const expectedActions = [
                { type: 'AJAXCOUNTER_INCREMENT' },
                failedOrder,
                { type: 'AJAXCOUNTER_DECREMENT' },
                { type: 'SET_ORDER_ERROR', error: 'Error processing order' },
                { type: 'CLEAR_ORDER_PENDING' },
                { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
                { type: 'CLEAR_FINALISED_ORDER' },
              ]

              await store.dispatch(orderActions.processOrder())
              expect(store.getActions()).toEqual(expectedActions)
            })
          })
        })
      })
    })
  })

  describe('psd2GetOrder', () => {
    const requestParams = deepFreeze({
      orderId: 8356706,
    })

    it('fetches the order details on a successful request', async () => {
      const getOrderMockResponse = getMockResponse(psd2GetOrderResponse)
      getSpy.mockImplementation(() => getOrderMockResponse)

      const expectedActions = [
        getOrderMockResponse,
        { type: 'UPDATE_ORDER_DETAIL' },
        { type: 'UPDATE_MENU_MOCK' },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 0, persist: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        getAccountMock(),
        { data: {}, type: 'SET_ORDER_COMPLETED' },
        { type: 'SET_ESPOT_CONTENT' },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.psd2GetOrder(requestParams))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('catches and dispatches the set order error message returned from the server', async () => {
      const getOrderMockFailedResponse = getMockError(
        psd2GetOrderFailedResponse
      )
      getSpy.mockImplementation(() => getOrderMockFailedResponse)

      const expectedActions = [
        getOrderMockFailedResponse,
        {
          error: 'An internal server error occurred',
          type: 'SET_ORDER_ERROR',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.psd2GetOrder(requestParams))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('falls back to get order message if server does not respond with anything', async () => {
      const getOrderMockFailedResponse = getMockError({})
      getSpy.mockImplementation(() => getOrderMockFailedResponse)

      const expectedActions = [
        getOrderMockFailedResponse,
        {
          error: 'Error getting order',
          type: 'SET_ORDER_ERROR',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.psd2GetOrder(requestParams))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('fetchPSD2Order', () => {
    const requestParams = deepFreeze({
      orderId: 8356706,
    })

    it('only fetches user Account details if user is not authenticated', async () => {
      userAuthSelectors.isUserAuthenticated.mockImplementationOnce(() => false)

      const expectedActions = [getAccountMock()]
      const store = mockStore(initialState)
      await store.dispatch(orderActions.fetchPSD2Order())
      expect(store.getActions()).toEqual(expectedActions)
    })
    it('fetches order details if user is authenticated', async () => {
      userAuthSelectors.isUserAuthenticated.mockImplementationOnce(() => true)
      const getOrderMockResponse = getMockResponse(psd2GetOrderResponse)
      getSpy.mockImplementation(() => getOrderMockResponse)

      const expectedActions = [
        getAccountMock(),
        getOrderMockResponse,
        { type: 'UPDATE_ORDER_DETAIL' },
        { type: 'UPDATE_MENU_MOCK' },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 0, persist: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        getAccountMock(),
        { data: {}, type: 'SET_ORDER_COMPLETED' },
        { type: 'SET_ESPOT_CONTENT' },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.fetchPSD2Order(requestParams))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('psd2ConfirmOrder', () => {
    const payload = deepFreeze({
      catalogId: '12345',
      storeId: '56789',
      orderId: '01010',
      ga: 'GA1.2.x.y',
      hostname: 'local.m.topshop.com',
      paymentMethod: 'VISA',
    })

    it('should call PUT order', async () => {
      putSpy.mockImplementation(() => putMockResponse({ body: {} }))
      const store = mockStore(initialState)

      await store.dispatch(orderActions.psd2ConfirmOrder(payload))
      expect(api.put).toHaveBeenCalledTimes(1)
      expect(api.put).toHaveBeenCalledWith('/psd2/order', payload, false)
    })

    it('should dispatch updateOrderDetails', async () => {
      const successfulOrder = putMockResponse({
        body: { statusCode: '200' },
      })
      putSpy.mockImplementation(() => successfulOrder)

      const store = mockStore(initialState)
      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'CLEAR_ORDER_PENDING' },
        { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
        { type: 'CLEAR_FINALISED_ORDER' },
        successfulOrder,
        { type: 'EMPTY_SHOPPING_BAG' },
        { type: 'UPDATE_ORDER_DETAIL' },
        { type: 'UPDATE_MENU_MOCK' },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 0, persist: false },
        { type: 'AJAXCOUNTER_DECREMENT' },
        getAccount(),
        { type: 'SET_ORDER_COMPLETED', data: {} },
        { type: 'SET_ESPOT_CONTENT' },
      ]

      await store.dispatch(orderActions.psd2ConfirmOrder(payload))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle a logic exception', async () => {
      const errorMessage = 'test-error'
      const errorPaymentDetails = deepFreeze({
        paymentMethod: payload.paymentMethod,
        orderId: payload.orderId,
      })
      const failedOrder = putMockError(new Error(errorMessage))
      putSpy.mockImplementation(() => failedOrder)

      const store = mockStore(initialState)
      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'CLEAR_ORDER_PENDING' },
        { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
        { type: 'CLEAR_FINALISED_ORDER' },
        failedOrder,
        { type: 'AJAXCOUNTER_DECREMENT' },
        getAccount(),
        { type: 'SET_ORDER_ERROR_PAYMENT_DETAILS', data: errorPaymentDetails },
        { type: 'SET_ORDER_ERROR', error: errorMessage },
      ]

      await store.dispatch(orderActions.psd2ConfirmOrder(payload))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle a response error', async () => {
      const errorMessage = 'test-error-message'
      const errorPaymentDetails = deepFreeze({
        paymentMethod: payload.paymentMethod,
        orderId: payload.orderId,
      })
      const error = new Error('test-error')
      error.response = { body: { message: errorMessage } }
      const failedOrder = putMockError(error)
      putSpy.mockImplementation(() => failedOrder)

      const store = mockStore(initialState)
      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'CLEAR_ORDER_PENDING' },
        { type: 'CLEAR_THREE_D_SECURE_PROMPT' },
        { type: 'CLEAR_FINALISED_ORDER' },
        failedOrder,
        { type: 'AJAXCOUNTER_DECREMENT' },
        getAccount(),
        { type: 'SET_ORDER_ERROR_PAYMENT_DETAILS', data: errorPaymentDetails },
        { type: 'SET_ORDER_ERROR', error: errorMessage },
      ]

      await store.dispatch(orderActions.psd2ConfirmOrder(payload))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setOrderError', () => {
    it('dispatches the correct action', async () => {
      const error = 'test-error'

      const expectedActions = [
        {
          error,
          type: 'SET_ORDER_ERROR',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.setOrderError(error))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('clearOrderError', () => {
    it('dispatches the correct action', async () => {
      const expectedActions = [
        {
          type: 'CLEAR_ORDER_ERROR',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.clearOrderError())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setOrderPending', () => {
    it('dispatches the correct action', async () => {
      const data = 'test-data'

      const expectedActions = [
        {
          data,
          type: 'SET_ORDER_PENDING',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.setOrderPending(data))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('updateOrderPending', () => {
    it('dispatches the correct action', async () => {
      const data = {
        payerId: 'XBNL7XLVDEW66',
        userApproved: '1',
      }

      const expectedActions = [
        {
          data,
          type: 'UPDATE_ORDER_PENDING',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.updateOrderPending(data))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('clearOrderPending', () => {
    it('dispatches the correct action', async () => {
      const expectedActions = [
        {
          type: 'CLEAR_ORDER_PENDING',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.clearOrderPending())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setThreeDSecurePrompt', () => {
    it('dispatches the correct action', async () => {
      const data = 'test-data'

      const expectedActions = [
        {
          data,
          type: 'SET_THREE_D_SECURE_PROMPT',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.setThreeDSecurePrompt(data))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('clearThreeDSecurePrompt', () => {
    it('dispatches the correct action', async () => {
      const expectedActions = [
        {
          type: 'CLEAR_THREE_D_SECURE_PROMPT',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.clearThreeDSecurePrompt())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setOrderErrorPaymentDetails', () => {
    it('dispatches the correct action', async () => {
      const data = 'test-data'

      const expectedActions = [
        {
          data,
          type: 'SET_ORDER_ERROR_PAYMENT_DETAILS',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.setOrderErrorPaymentDetails(data))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('clearOrderErrorPaymentDetails', () => {
    it('dispatches the correct action', async () => {
      const expectedActions = [
        {
          type: 'CLEAR_ORDER_ERROR_PAYMENT_DETAILS',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.clearOrderErrorPaymentDetails())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('setPrePaymentConfig', () => {
    it('dispatches the correct action', async () => {
      const config = 'test-config'

      const expectedActions = [
        {
          config,
          type: 'SET_PRE_PAYMENT_CONFIG',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.setPrePaymentConfig(config))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('clearPrePaymentConfig', () => {
    it('dispatches the correct action', async () => {
      const expectedActions = [
        {
          type: 'CLEAR_PRE_PAYMENT_CONFIG',
        },
      ]

      const store = mockStore(initialState)
      await store.dispatch(orderActions.clearPrePaymentConfig())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('retrievePrePaymentConfig', () => {
    it('should trigger the correct sequence of actions', async () => {
      const postMockSuccess = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: {},
          })
        )
        p.type = 'POST_MOCK_SUCCESS'
        return p
      }

      const successfulPost = postMockSuccess()
      postSpy.mockImplementation(() => successfulPost)

      const store = mockStore(initialState)
      const expectedActions = [
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        successfulPost,
        {
          type: 'SET_PRE_PAYMENT_CONFIG',
          config: {},
        },
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
      ]

      const orderId = '12345'
      await store.dispatch(orderActions.retrievePrePaymentConfig(orderId))
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should call the pre-payment-config endpoint correctly', async () => {
      const orderId = '12345'
      const config = {}
      const postMockSuccess = () => {
        const p = new Promise((resolve) =>
          resolve({
            body: config,
          })
        )
        p.type = 'POST_MOCK_SUCCESS'
        return p
      }

      const successfulPost = postMockSuccess()
      postSpy.mockImplementation(() => successfulPost)

      const store = mockStore(initialState)
      await store.dispatch(orderActions.retrievePrePaymentConfig(orderId))

      expect(postSpy).toHaveBeenCalledWith('/psd2/pre-payment-config', {
        orderId,
      })
    })

    it('should throw on failure', async () => {
      const orderId = '12345'
      const postMockError = (error) => {
        const p = new Promise((_, reject) => {
          reject(new Error(error))
        })
        p.type = 'POST_MOCK_ERROR'
        return p
      }

      const failingPost = postMockError('test-error')
      postSpy.mockImplementation(() => failingPost)
      const store = mockStore(initialState)

      const expectedActions = [
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        failingPost,
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
      ]

      await expect(
        store.dispatch(orderActions.retrievePrePaymentConfig(orderId))
      ).rejects.toThrow('test-error')

      expect(store.getActions()).toEqual(expectedActions)
    })
  })
  describe('completePaypalOrder', () => {
    it('it should dispatch the correct actions', async () => {
      const store = mockStore({
        ...initialState,
        checkout: {
          ...initialState.checkout,
          finalisedOrder: orderMock,
          verifyPayment: {
            hostname: 'local.m.topshop.com',
            policyId: '25000',
            orderId: '10477489',
            token: 'EC-6RL69752KN730973R',
            tranId: '1180502',
            authProvider: 'PYPAL',
          },
        },
      })
      const successfulOrder = putMockResponse({
        body: { completedOrder: {} },
      })
      const updateOrder = putSpy.mockImplementation(() => successfulOrder)

      await store.dispatch(orderActions.completePaypalOrder())

      expect(store.getActions()).toEqual(
        expect.arrayContaining([updateOrder(), { type: 'COMPLETE_ORDER' }])
      )
    })
  })

  describe('concludeOrderCreation', () => {
    describe('when payment type is PAYPAL', () => {
      describe('when is `FEATURE_PAYPAL_SMART_BUTTONS` is on', () => {
        it('should return the response from the post `/order` request', async () => {
          const store = mockStore({
            ...initialState,
            checkout: {
              ...initialState.checkout,
              finalisedOrder: {
                ...orderMock,
                paymentType: 'PYPAL',
              },
            },
            features: {
              status: {
                FEATURE_PAYPAL_SMART_BUTTONS: true,
              },
            },
          })

          const responseBody = {
            paypalUrl:
              'https://www.sandbox.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout-mobile&token=EC-68G5309066661764P',
            paymentUrl:
              'https://www.sandbox.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout-mobile&token=EC-68G5309066661764P',
            token: 'EC-68G5309066661764P',
            tranId: '1182575',
            policyId: '25000',
          }

          const mockResponse = postMockResponse({
            body: responseBody,
          })

          postSpy.mockImplementation(() => mockResponse)

          await store
            .dispatch(orderActions.concludeOrderCreation())
            .then((res) => {
              expect(res).toEqual(responseBody)
            })
        })
      })

      describe('when is `FEATURE_PAYPAL_SMART_BUTTONS` is not on', () => {
        it('should not return the response from the post `/order` request', async () => {
          const store = mockStore({
            ...initialState,
            checkout: {
              ...initialState.checkout,
              finalisedOrder: {
                ...orderMock,
                paymentType: 'PYPAL',
              },
            },
          })

          const responseBody = {
            paypalUrl:
              'https://www.sandbox.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout-mobile&token=EC-68G5309066661764P',
            paymentUrl:
              'https://www.sandbox.paypal.com/cgi-bin/webscr?useraction=commit&cmd=_express-checkout-mobile&token=EC-68G5309066661764P',
            token: 'EC-68G5309066661764P',
            tranId: '1182575',
            policyId: '25000',
          }

          const mockResponse = postMockResponse({ body: responseBody })

          postSpy.mockImplementation(() => mockResponse)

          expect(
            await store.dispatch(orderActions.concludeOrderCreation())
          ).toEqual(undefined)
        })
      })
    })
  })
})
