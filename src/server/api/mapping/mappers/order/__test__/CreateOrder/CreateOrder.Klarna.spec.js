import * as utils from '../../../../__test__/utils'

import CreateOrder from '../../CreateOrder'

import wcsRegisteredReturningResponse from 'test/apiResponses/create-order/wcs-klarnaReturningCustomer.json'
import montyRegisteredReturningResponse from 'test/apiResponses/create-order/hapi-klarnaReturningCustomer.json'

import wcsRegisteredFirstTimeResponse from 'test/apiResponses/create-order/wcs-klarnaRegisteredFirstTime.json'
import montyRegisteredFirstTimeResponse from 'test/apiResponses/create-order/hapi-klarnaRegisteredFirstTime.json'

describe('CreateOrder Mapper: Klarna', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const getCookieFromStore = jest.fn()
  const defaults = {
    method: 'post',
    payload: {},
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
      cookie: 'jessionid=a',
    },
    query: {},
    endpoint: '',
    getCookieFromStore,
  }

  const montyRegisteredReturningPayload = {
    smsMobileNumber: '',
    remoteIpAddress: '127.0.0.1',
    cardCvv: '0',
    orderDeliveryOption: {
      orderId: 700381244,
      shippingCountry: 'United Kingdom',
      shipCode: 'S',
      deliveryType: 'HOME_STANDARD',
      shipModeId: 26504,
    },
    deliveryInstructions: '',
    returnUrl:
      'http://local.m.topshop.com:8080/order-complete?paymentMethod=KLRNA',
    cardNumberHash: '',
    authToken: 'daa29f98-6503-5bb3-b24d-bf3d524924da',
  }

  const wcsRegisteredReturningPayload = {
    TERMSANDCONDITIONS_OPTIN: 'true',
    URL: 'OrderPrepare?URL=ConfirmAndPay',
    acceptHeader: '*/*',
    apiMethod: 'payments',
    auth_token: 'daa29f98-6503-5bb3-b24d-bf3d524924da',
    cardBrand: undefined,
    cardExpiryMonth: undefined,
    cardExpiryYear: undefined,
    cardNumber: '',
    cardNumberStar: undefined,
    // cardSecurityNumber: '0',
    addressId: undefined,
    billing_address_id: undefined,
    catalogId: '33057',
    contentType: '*/*',
    deliveryInstructions: '',
    errorViewName: 'DoPaymentErrorView',
    ipAddress: '127.0.0.1',
    langId: '-1',
    nominatedDate: '',
    notifyOrderSubmitted: '0',
    notifyShopper: '0',
    orderId: 700381244,
    shipCode: 'S',
    smsAlerts: '',
    storeId: 12556,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    save_details: 'on',
  }

  const montyRegisteredFirstTimePayload = {
    smsMobileNumber: '',
    remoteIpAddress: '127.0.0.1',
    cardCvv: '0',
    orderDeliveryOption: {
      orderId: 700395071,
      shippingCountry: 'United Kingdom',
      shipCode: 'S',
      deliveryType: 'HOME_STANDARD',
      shipModeId: 26504,
    },
    deliveryInstructions: '',
    returnUrl:
      'http://local.m.topshop.com:8080/order-complete?paymentMethod=KLRNA',
    billingDetails: {
      address: {
        address1: 'Flat 53, Queen Alexandra Mansions, Hastings Street',
        address2: '',
        city: 'LONDON',
        state: '',
        country: 'United Kingdom',
        postcode: 'WC1H 9DR',
      },
      nameAndPhone: {
        firstName: 'test',
        lastName: 'test3',
        telephone: '07776260690',
        title: 'Mr',
      },
    },
    creditCard: {
      expiryYear: '2019',
      expiryMonth: '1',
      cardNumber: '0',
      type: 'KLRNA',
    },
    authToken: '550f0e02-9e75-5ee7-98e1-818857fbe8e8',
  }

  const wcsRegisteredFirstTimePayload = {
    TERMSANDCONDITIONS_OPTIN: 'true',
    URL: 'OrderPrepare?URL=ConfirmAndPay',
    acceptHeader: '*/*',
    apiMethod: 'payments',
    auth_token: '550f0e02-9e75-5ee7-98e1-818857fbe8e8',
    cardBrand: 'KLRNA',
    cardExpiryMonth: '1',
    cardExpiryYear: '2019',
    cardNumber: undefined,
    cardNumberStar: '0',
    // cardSecurityNumber: '0',
    addressId: undefined,
    billing_address_id: '234567',
    catalogId: '33057',
    contentType: '*/*',
    deliveryInstructions: '',
    errorViewName: 'DoPaymentErrorView',
    ipAddress: '127.0.0.1',
    langId: '-1',
    nominatedDate: '',
    notifyOrderSubmitted: '0',
    notifyShopper: '0',
    orderId: 700395071,
    shipCode: 'S',
    smsAlerts: '',
    storeId: 12556,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    save_details: 'on',
  }

  const unsetKlarnaCookies = [
    {
      name: 'klarnaClientToken',
      options: {
        clearInvalid: true,
        encoding: 'none',
        isHttpOnly: true,
        isSecure: false,
        path: '/',
        strictHeader: false,
        ttl: 0,
      },
      value: null,
    },
    {
      name: 'klarnaSessionId',
      options: {
        clearInvalid: true,
        encoding: 'none',
        isHttpOnly: true,
        isSecure: false,
        path: '/',
        strictHeader: false,
        ttl: 0,
      },
      value: null,
    },
  ]

  const execute = utils.buildExecutor(CreateOrder, defaults)

  describe('Registered user', () => {
    describe('when the last order used Klarna', () => {
      beforeEach(() => {
        utils.setWCSResponse({ body: wcsRegisteredReturningResponse })
        getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
      })
      describe('requests', () => {
        it('should have the correct payload', async () => {
          await execute({ payload: montyRegisteredReturningPayload })
          expect(utils.getRequestArgs(0).payload).toEqual(
            wcsRegisteredReturningPayload
          )
        })
      })
      describe('responses', () => {
        it('should be mapped correctly', async () => {
          await expect(
            execute({ payload: montyRegisteredReturningPayload })
          ).resolves.toEqual({
            body: montyRegisteredReturningResponse,
            setCookies: unsetKlarnaCookies,
          })
        })
      })
    })

    describe('when the last order used a different payment method', () => {
      beforeEach(() => {
        utils.setWCSResponse({
          body: {
            orderSummary: {
              OrderCalculateForm: { billing_address_id: '234567' },
            },
          },
        })
        utils.setWCSResponse({ body: wcsRegisteredFirstTimeResponse }, { n: 1 })
        getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
      })
      describe('requests', () => {
        it('should have the correct payload', async () => {
          await execute({ payload: montyRegisteredFirstTimePayload })
          expect(utils.getRequestArgs(1).payload).toEqual(
            wcsRegisteredFirstTimePayload
          )
        })
      })
      describe('responses', () => {
        it('should be mapped correctly', async () => {
          await expect(
            execute({ payload: montyRegisteredFirstTimePayload })
          ).resolves.toEqual({
            body: montyRegisteredFirstTimeResponse,
            setCookies: unsetKlarnaCookies,
          })
        })
      })
    })
  })
})
