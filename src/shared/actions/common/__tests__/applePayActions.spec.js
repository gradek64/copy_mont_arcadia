import { browserHistory } from 'react-router'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as logger from '../../../../client/lib/logger'

// Mocks
import { orderMock } from '../../../../../test/mocks/orderCreate'
import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'

// Actions
import * as api from '../../../lib/api-service'

import {
  setApplePayAvailability,
  setApplePayAsDefaultPayment,
  performApplePayPayment,
} from '../applePayActions'
import { getAccount } from '../accountActions'
import { setFormMessage } from '../formActions'
import { updateMenuForAuthenticatedUser } from '../navigationActions'

import * as orderAuxiliaryActions from '../orderAuxiliaryActions'
import * as espotActions from '../espotActions'

import {
  getCheckoutBag,
  syncClientForEmailExists,
  getOrderSummary,
} from '../checkoutActions'
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
  setFormField: jest.fn((...args) => ({
    type: 'SET_FORM_FIELD',
    paymentType: args[2],
  })),
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
  localise: jest.fn((language, brand, textsArr) => textsArr[0]),
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

jest.mock('../../../../client/lib/logger')

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

const applePaySessionMock = ({
  triggerFn,
  completeMerchantValidation = () => {},
  completePaymentMethodSelection = () => {},
  completePayment = () => {},
} = {}) => () => {
  const applePaySession = {
    begin: () => {
      if (triggerFn === 'onvalidatemerchant') {
        applePaySession.onvalidatemerchant({
          validationURL: 'validationURLMock',
        })
      } else if (triggerFn === 'onpaymentmethodselected') {
        applePaySession.onpaymentmethodselected()
      }

      applePaySession.onpaymentauthorized({
        payment: { token: 'tokenMock' },
      })
    },
    completeMerchantValidation,
    completePaymentMethodSelection,
    completePayment,
    STATUS_SUCCESS: 'STATUS_SUCCESS',
    STATUS_FAILURE: 'STATUS_FAILURE',
  }

  return applePaySession
}

const initialState = {
  config: {
    brandCode: 'ts',
    brandName: 'topman',
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
}

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('applePayActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    window.ApplePaySession = undefined
  })

  describe('setApplePayAvailability', () => {
    let store
    const applePaySessionMock = ({ canMakePayments = true }) => ({
      canMakePayments: () => canMakePayments,
    })

    describe('FEATURE_APPLE_PAY is not enabled', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: false,
            },
          },
        }

        store = getMockStoreWithInitialReduxState(state)
      })

      describe('window.ApplePaySession is available', () => {
        beforeEach(() => {
          window.ApplePaySession = applePaySessionMock({
            canMakePayments: true,
          })
        })
        afterEach(() => {
          window.ApplePaySession = undefined
        })

        it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePayments equal to false', () => {
          store.dispatch(setApplePayAvailability())

          expect(store.getActions()).toEqual([
            {
              canMakePayments: false,
              type: 'SET_APPLE_PAY_AVAILABILITY',
            },
          ])
        })
      })

      describe('window.ApplePaySession is not available', () => {
        it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePayments equal to false', () => {
          store.dispatch(setApplePayAvailability())

          expect(store.getActions()).toEqual([
            {
              canMakePayments: false,
              type: 'SET_APPLE_PAY_AVAILABILITY',
            },
          ])
        })
      })
    })

    describe('FEATURE_APPLE_PAY is enabled', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: true,
            },
          },
          applePay: {},
        }

        store = getMockStoreWithInitialReduxState(state)
      })

      describe('window.ApplePaySession is available', () => {
        beforeEach(() => {
          window.ApplePaySession = applePaySessionMock({
            canMakePayments: true,
          })
        })
        afterEach(() => {
          window.ApplePaySession = undefined
        })

        describe('canMakePayments is true', () => {
          it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePayments equal to true', () => {
            store.dispatch(setApplePayAvailability())

            expect(store.getActions()).toEqual([
              {
                canMakePayments: true,
                type: 'SET_APPLE_PAY_AVAILABILITY',
              },
            ])
          })
        })
        describe('canMakePayments is false', () => {
          it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePayments equal to false', () => {
            window.ApplePaySession = applePaySessionMock({
              canMakePayments: false,
            })

            store.dispatch(setApplePayAvailability())

            expect(store.getActions()).toEqual([
              {
                canMakePayments: false,
                type: 'SET_APPLE_PAY_AVAILABILITY',
              },
            ])
          })
        })
      })
      describe('window.ApplePaySession is not available', () => {
        it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePayments equal to false', () => {
          store.dispatch(setApplePayAvailability())

          expect(store.getActions()).toEqual([
            {
              canMakePayments: false,
              type: 'SET_APPLE_PAY_AVAILABILITY',
            },
          ])
        })
      })
    })

    describe('canMakePayment throw an error', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: true,
            },
          },
          applePay: {},
        }

        store = getMockStoreWithInitialReduxState(state)
        window.ApplePaySession = {
          canMakePayments: () => {
            throw new Error('Something went wrong')
          },
        }
      })
      afterEach(() => {
        window.ApplePaySession = undefined
      })

      it('logs errors to New Relic', () => {
        store.dispatch(setApplePayAvailability())

        expect(store.getActions()).toEqual([
          {
            canMakePayments: false,
            type: 'SET_APPLE_PAY_AVAILABILITY',
          },
        ])

        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'Something went wrong',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error validating if user can use ApplePay',
          expect.objectContaining({
            message: 'Something went wrong',
          })
        )
      })
    })
  })

  describe('setApplePayAsDefaultPayment', () => {
    let store
    const applePaySessionMock = ({ canMakePaymentsWithActiveCard = true }) => ({
      canMakePaymentsWithActiveCard: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve(canMakePaymentsWithActiveCard)
          })
      ),
    })

    describe('FEATURE_APPLE_PAY is not enabled', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: false,
            },
          },
        }

        store = getMockStoreWithInitialReduxState(state)
      })

      describe('window.ApplePaySession is available', () => {
        beforeEach(() => {
          window.ApplePaySession = applePaySessionMock({
            canMakePaymentsWithActiveCard: true,
          })
        })
        afterEach(() => {
          window.ApplePaySession = undefined
        })

        it('dispatch SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD with canMakePaymentsWithActiveCard equal to false', async () => {
          await store.dispatch(setApplePayAsDefaultPayment())

          expect(store.getActions()).toEqual([
            {
              canMakePaymentsWithActiveCard: false,
              type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
            },
            {
              paymentType: 'VISA',
              type: 'SET_FORM_FIELD',
            },
          ])

          expect(
            window.ApplePaySession.canMakePaymentsWithActiveCard
          ).toHaveBeenCalledTimes(0)
        })
      })

      describe('window.ApplePaySession is not available', () => {
        it('dispatch SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD with canMakePaymentsWithActiveCard equal to false', async () => {
          await store.dispatch(setApplePayAsDefaultPayment())

          expect(store.getActions()).toEqual([
            {
              canMakePaymentsWithActiveCard: false,
              type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
            },
            {
              paymentType: 'VISA',
              type: 'SET_FORM_FIELD',
            },
          ])
        })
      })
    })

    describe('FEATURE_APPLE_PAY is enabled', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: true,
            },
          },
          debug: {
            environment: 'dev2',
          },
          applePay: {},
        }

        store = getMockStoreWithInitialReduxState(state)
      })

      describe('window.ApplePaySession is available', () => {
        beforeEach(() => {
          window.ApplePaySession = applePaySessionMock({
            canMakePaymentsWithActiveCard: true,
          })
        })
        afterEach(() => {
          window.ApplePaySession = undefined
        })

        describe('canMakePaymentsWithActiveCard is true', () => {
          it('dispatch SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD with canMakePaymentsWithActiveCard equal to true', async () => {
            await store.dispatch(setApplePayAsDefaultPayment())

            expect(store.getActions()).toEqual([
              {
                canMakePaymentsWithActiveCard: true,
                type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
              },
              {
                paymentType: 'APPLE',
                type: 'SET_FORM_FIELD',
              },
            ])

            expect(
              window.ApplePaySession.canMakePaymentsWithActiveCard
            ).toHaveBeenCalledWith('merchant.com.topman.test')
          })
        })
        describe('canMakePaymentsWithActiveCard is false', () => {
          it('dispatch SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD with canMakePaymentsWithActiveCard equal to false', async () => {
            window.ApplePaySession = applePaySessionMock({
              canMakePaymentsWithActiveCard: false,
            })

            await store.dispatch(setApplePayAsDefaultPayment())

            expect(store.getActions()).toEqual([
              {
                canMakePaymentsWithActiveCard: false,
                type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
              },
              {
                paymentType: 'VISA',
                type: 'SET_FORM_FIELD',
              },
            ])

            expect(
              window.ApplePaySession.canMakePaymentsWithActiveCard
            ).toHaveBeenCalledWith('merchant.com.topman.test')
          })
        })

        describe('WCS environment is prod', () => {
          beforeEach(() => {
            const state = {
              ...initialState,
              features: {
                status: {
                  FEATURE_APPLE_PAY: true,
                },
              },
              applePay: {},
              debug: {
                environment: 'prod',
              },
            }

            store = getMockStoreWithInitialReduxState(state)
          })
          it('calls canMakePaymentsWithActiveCard with the prod identifier', async () => {
            window.ApplePaySession = applePaySessionMock({
              canMakePaymentsWithActiveCard: false,
            })

            await store.dispatch(setApplePayAsDefaultPayment())

            expect(store.getActions()).toEqual([
              {
                canMakePaymentsWithActiveCard: false,
                type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
              },
              {
                paymentType: 'VISA',
                type: 'SET_FORM_FIELD',
              },
            ])

            expect(
              window.ApplePaySession.canMakePaymentsWithActiveCard
            ).toHaveBeenCalledWith('merchant.com.topman.applepay')
          })
        })
      })

      describe('window.ApplePaySession is not available', () => {
        it('dispatch SET_APPLE_PAY_AVAILABILITY with canMakePaymentsWithActiveCard equal to false', async () => {
          await store.dispatch(setApplePayAsDefaultPayment())

          expect(store.getActions()).toEqual([
            {
              canMakePaymentsWithActiveCard: false,
              type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
            },
            {
              paymentType: 'VISA',
              type: 'SET_FORM_FIELD',
            },
          ])
        })
      })
    })

    describe('canMakePaymentsWithActiveCard throw an error', () => {
      beforeEach(() => {
        const state = {
          ...initialState,
          features: {
            status: {
              FEATURE_APPLE_PAY: true,
            },
          },
          applePay: {},
        }

        store = getMockStoreWithInitialReduxState(state)
        window.ApplePaySession = {
          canMakePaymentsWithActiveCard: () => {
            throw new Error('Something went wrong')
          },
        }
      })
      afterEach(() => {
        window.ApplePaySession = undefined
      })

      it('logs errors to New Relic', () => {
        store.dispatch(setApplePayAsDefaultPayment())

        expect(store.getActions()).toEqual([
          {
            canMakePaymentsWithActiveCard: false,
            type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
          },
          {
            paymentType: 'VISA',
            type: 'SET_FORM_FIELD',
          },
        ])

        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'Something went wrong',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error validating if user can be defaulted to ApplePay',
          expect.objectContaining({
            message: 'Something went wrong',
          })
        )
      })
    })
  })

  describe('performApplePayPayment', () => {
    const getSpy = jest.spyOn(api, 'get')
    const postSpy = jest.spyOn(api, 'post')

    beforeEach(() => {
      jest.clearAllMocks()
      getSpy.mockReset()
      postSpy.mockReset()
    })

    const state = {
      ...initialState,
      features: {
        status: {
          FEATURE_APPLE_PAY: true,
        },
      },
      forms: {
        ...initialState.forms,
        checkout: {
          ...initialState.forms.checkout,
          billingCardDetails: {
            fields: {
              paymentType: {
                value: 'APPLE',
              },
            },
          },
        },
      },
      paymentMethods: [
        {
          value: 'VISA',
          type: 'CARD',
          label: 'Visa',
          description: 'Pay with VISA',
          icon: 'icon-visa.svg',
          applePayPaymentNetwork: 'visa',
        },
        {
          value: 'SWTCH',
          type: 'CARD',
          label: 'Switch/Maestro',
          description: 'Pay with Switch / Maestro',
          icon: 'icon-switch.svg',
          applePayPaymentNetwork: 'maestro',
        },
      ],
      checkout: {
        ...initialState.checkout,
        finalisedOrder: orderMock,
        orderSummary: {
          ...initialState.checkout.orderSummary,
          deliveryLocations: [
            {
              deliveryLocationType: 'HOME',
              label:
                'Home Delivery Standard (UK up to 4 days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
              selected: true,
              deliveryMethods: [
                {
                  shipModeId: 26504,
                  shipCode: 'S',
                  deliveryType: 'HOME_STANDARD',
                  label: 'UK Standard up to 4 days',
                  additionalDescription: 'Up to 4 days',
                  cost: '3.95',
                  selected: true,
                  deliveryOptions: [],
                },
                {
                  shipModeId: 26507,
                  shipCode: 'S',
                  deliveryType: 'HOME_EXPRESS',
                  label: 'UK Express up to 2 days',
                  additionalDescription: 'Up to 2 days',
                  cost: '8.00',
                  selected: false,
                  deliveryOptions: [],
                },
              ],
            },
          ],
          basket: {
            subTotal: '32.00',
            total: '35.95',
            deliveryOptions: [
              {
                enabled: true,
                label: 'Next or Named Day Delivery £6.00',
                selected: true,
                shippingCost: 3.95,
              },
            ],
          },
        },
      },
      config: {
        brandName: 'topshop',
        language: 'en-gb',
        currencyCode: 'GBP',
      },
      siteOptions: {
        billingCountryIso: {
          Albania: 'AL',
          Italia: 'IT',
          Spagna: 'SP',
        },
      },
    }

    describe('ApplePay JS is not available', () => {
      it('does not dispatch any actions', async () => {
        const store = mockStore(state)

        await store.dispatch(performApplePayPayment(orderMock))

        expect(store.getActions()).toEqual([])
      })
    })

    describe('ApplePay JS is available', () => {
      afterEach(() => {
        window.ApplePaySession = undefined
      })

      it('creates a new ApplePay session if the feature flag is on', () => {
        const sessionBegin = jest.fn()
        window.ApplePaySession = jest.fn().mockImplementation(() => ({
          begin: sessionBegin,
        }))

        const store = mockStore(state)

        store.dispatch(performApplePayPayment(orderMock))

        expect(window.ApplePaySession).toHaveBeenCalledWith(6, {
          countryCode: 'GB',
          currencyCode: 'GBP',
          merchantCapabilities: ['supports3DS'],
          supportedNetworks: ['visa', 'maestro'],
          supportedCountries: ['AL', 'IT', 'SP'],
          total: {
            amount: '35.95',
            label: 'TOPSHOP',
          },
        })

        expect(window.ApplePaySession).toHaveBeenCalledTimes(1)
        expect(sessionBegin).toHaveBeenCalledTimes(1)
      })

      it('does not dispatch any actions if the feature flag is off', async () => {
        const store = mockStore({
          ...state,
          features: {
            status: {
              FEATURE_APPLE_PAY: false,
            },
          },
        })

        await store.dispatch(performApplePayPayment(orderMock))

        expect(store.getActions()).toEqual([])
        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'ApplePay session is not available',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error performing ApplePay payment',
          expect.objectContaining({
            message: 'ApplePay session is not available',
          })
        )
      })

      describe('onvalidatemerchant', () => {
        it('calls /checkout/applepay_session?validationURL', async () => {
          const completeMerchantValidation = jest.fn(() => {})
          const getResponse = {
            body: { data: { paymentTokenObj: 'paymentTokenObj' } },
          }
          window.ApplePaySession = applePaySessionMock({
            triggerFn: 'onvalidatemerchant',
            completeMerchantValidation,
          })
          getSpy.mockImplementation(() => getMockResponse(getResponse))

          const store = mockStore(state)

          await store.dispatch(performApplePayPayment(orderMock))

          expect(getSpy).toHaveBeenCalledTimes(1)
          expect(getSpy).toHaveBeenCalledWith(
            `/checkout/applepay_session?validationURL=validationURLMock`
          )
          expect(completeMerchantValidation).toHaveBeenCalledTimes(1)
          expect(completeMerchantValidation).toHaveBeenCalledWith(
            getResponse.body
          )
        })
      })

      describe('onpaymentmethodselected', () => {
        it('calls session.completePaymentMethodSelection', async () => {
          const completePaymentMethodSelection = jest.fn()
          window.ApplePaySession = applePaySessionMock({
            triggerFn: 'onpaymentmethodselected',
            completePaymentMethodSelection,
          })

          const store = mockStore(state)

          await store.dispatch(performApplePayPayment(orderMock))

          expect(completePaymentMethodSelection).toHaveBeenCalledWith(
            { amount: '35.95', label: 'TOPSHOP' },
            [
              { amount: '32.00', label: 'BAG SUBTOTAL' },
              { amount: '3.95', label: 'SHIPPING' },
            ]
          )
        })
      })

      describe('onpaymentauthorized', () => {
        it('should call completePayment', async () => {
          const successfulGetAccount = getAccountMock()
          const successfulPostOrder = postOrderMockSuccess()
          getAccount.mockImplementation(() => successfulGetAccount)
          postSpy.mockImplementation(() => successfulPostOrder)

          const completePayment = jest.fn(() => {})

          window.ApplePaySession = applePaySessionMock({
            triggerFn: 'onpaymentauthorized',
            completePayment,
          })

          const store = mockStore(state)

          await store.dispatch(performApplePayPayment(orderMock))

          expect(completePayment).toHaveBeenCalledWith('STATUS_SUCCESS')
        })
      })
    })

    describe('ApplePay API throw an error', () => {
      afterEach(() => {
        window.ApplePaySession = undefined
      })

      it('logs errors to New Relic if ApplePaySession throw an Error', async () => {
        window.ApplePaySession = jest.fn().mockImplementation(() => {
          throw new Error('countryCode is missing')
        })

        const store = mockStore(state)

        await store.dispatch(performApplePayPayment(orderMock))

        expect(window.ApplePaySession).toHaveBeenCalledWith(6, {
          countryCode: 'GB',
          currencyCode: 'GBP',
          merchantCapabilities: ['supports3DS'],
          supportedNetworks: ['visa', 'maestro'],
          supportedCountries: ['AL', 'IT', 'SP'],
          total: {
            amount: '35.95',
            label: 'TOPSHOP',
          },
        })

        expect(window.ApplePaySession).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'countryCode is missing',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error performing ApplePay payment',
          expect.objectContaining({
            message: 'countryCode is missing',
          })
        )
      })

      it('logs error to New Relic if completeMerchantValidation throw an error', async () => {
        const completeMerchantValidation = jest.fn().mockImplementation(() => {
          throw new Error('Merchent validation failed')
        })
        const getResponse = {
          body: { data: { paymentTokenObj: 'paymentTokenObj' } },
        }
        window.ApplePaySession = applePaySessionMock({
          triggerFn: 'onvalidatemerchant',
          completeMerchantValidation,
        })
        getSpy.mockImplementation(() => getMockResponse(getResponse))

        const store = mockStore(state)

        await store.dispatch(performApplePayPayment(orderMock))

        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'Merchent validation failed',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error performing ApplePay payment',
          expect.objectContaining({
            message: 'Merchent validation failed',
          })
        )
      })

      it('logs error to New Relic if begin throw an error', async () => {
        const sessionBegin = jest.fn(() => {
          throw new Error('ApplePay is not available')
        })
        window.ApplePaySession = jest.fn().mockImplementation(() => ({
          begin: sessionBegin,
        }))

        const store = mockStore(state)

        await store.dispatch(performApplePayPayment(orderMock))

        expect(logger.error).toHaveBeenCalledWith(
          'ApplePay',
          expect.objectContaining({
            message: 'ApplePay is not available',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error performing ApplePay payment',
          expect.objectContaining({
            message: 'ApplePay is not available',
          })
        )
      })
    })
  })
})
