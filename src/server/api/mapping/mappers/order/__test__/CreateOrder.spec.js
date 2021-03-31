import * as utils from '../../../__test__/utils'
import CreateOrder from '../CreateOrder'
import wcs from '../../../../../../../test/apiResponses/create-order/wcs.json'
import wcsFail from '../../../../../../../test/apiResponses/create-order/wcs-failure.json'
import wcsKlarnaFail from '../../../../../../../test/apiResponses/create-order/wcs-klarna-failure.json'
import monty from '../../../../../../../test/apiResponses/create-order/hapi.json'
import Boom from 'boom'
import wcsKlarnaReturningCustomer from 'test/apiResponses/create-order/wcs-klarnaReturningCustomer.json'
import montyKlarnaReturningCustomer from 'test/apiResponses/create-order/hapi-klarnaReturningCustomer.json'
import { createOrderErrorCodes } from '../../../constants/wcsErrorCodes'
import * as serverSideAnalytics from '../server_side_analytics'
import * as googleUtils from '../../../../../lib/google-utils'
import * as logger from '../../../../../lib/logger'

jest.spyOn(logger, 'setCustomAttribute')
jest.mock('../server_side_analytics', () => ({
  logPurchase: jest.fn(),
}))

jest.mock('../../../../../lib/google-utils', () => ({
  validateGoogleRecaptchaToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      success: true,
      challenge_ts: '2020-06-26T09:13:34.488Z',
      hostname: 'www.topshop.com',
    })
  ),
}))

const jsessionid = '12345'
const getCookieFromStore = jest.fn()
const montyRequest = (payload = {}) => ({
  originEndpoint: '/api/shopping_bag/mini_bag',
  query: {},
  payload,
  method: 'post',
  headers: {
    host: 'host',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    cookie: 'jessionid=a',
  },
  params: {},
  getCookieFromStore,
})

const montyReturningAccountCard = {
  smsMobileNumber: '',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '123',
  orderDeliveryOption: {
    orderId: 700366413,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: '',
  returnUrl:
    'https://pplive-m-topshop-com.digital.arcadiagroup.co.uk/order-complete?paymentMethod=ACCNT',
  cardNumberHash: 'poJy1ZvvwAb6SPEjhgVdZIbGAZLeyMmQ',
}

const creditCard = {
  expiryYear: '2019',
  expiryMonth: '03',
  cardNumber: '6000082000000088',
  type: 'ACCNT',
}

const montyReturningNewAccountCard = {
  ...montyReturningAccountCard,
  creditCard,
}

const montyPayPalRequest = {
  smsMobileNumber: '',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '0',
  orderDeliveryOption: {
    orderId: 700402896,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: '',
  returnUrl:
    'http://local.m.topshop.com:8080/order-complete?paymentMethod=PYPAL',
  cardNumberHash: '3J8Vw1B5YPIr0fgHS8y/p8aDoXgbbq/u',
}

const montyApplePayRequest = {
  smsMobileNumber: '',
  remoteIpAddress: '127.0.0.1',
  orderDeliveryOption: {
    orderId: 700366413,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: '',
  returnUrl:
    'http://local.m.topshop.com:8080/order-complete?paymentMethod=APPLE',
  paymentToken: 'testString',
}

const montyClearPayRequest = {
  smsMobileNumber: '',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '0',
  orderDeliveryOption: {
    orderId: 700366413,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: '',
  returnUrl:
    'http://local.m.topshop.com:8080/order-complete?ga=GA1.2.1490505770.1600865258&orderId=10439030&paymentMethod=CLRPY',
  punchoutReturnUrl:
    'http://local.m.topshop.com:8080/psd2-order-punchout?ga=GA1.2.1490505770.1600865258&orderId=10439030&paymentMethod=CLRPY',
  isGuestOrder: false,
  email: '',
  creditCard: {
    type: 'CLRPY',
  },
  save_details: true,
}

const wcsPayPalPayload = {
  ipAddress: '127.0.0.1',
  orderId: 700402896,
  errorViewName: 'DoPaymentErrorView',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
  contentType: '*/*',
  acceptHeader: '*/*',
  auth_token: undefined,
  cardBrand: 'PYPAL',
  cardSecurityNumber: undefined,
  addressId: undefined,
  billing_address_id: undefined,
  notifyShopper: '0',
  notifyOrderSubmitted: '0',
  deliveryInstructions: '',
  smsAlerts: '',
  shipCode: 'S',
  nominatedDate: '',
  URL: 'OrderPrepare?URL=ConfirmAndPay',
  TERMSANDCONDITIONS_OPTIN: 'true',
  langId: '-1',
  mobile: 'http://local.m.topshop.com:8080/order-complete?paymentMethod=PYPAL',
  storeId: 12556,
  catalogId: '33057',
  save_details: 'on',
}

const wcsPayPalPayloadUS = {
  ...wcsPayPalPayload,
  mobile:
    'http://local.m.us.topshop.com:8080/order-complete?paymentMethod=PYPAL',
}

const wcsPayload = {
  ipAddress: '127.0.0.1',
  orderId: 700366413,
  errorViewName: 'DoPaymentErrorView',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
  contentType: '*/*',
  acceptHeader: '*/*',
  auth_token: undefined,
  cardBrand: undefined,
  cardExpiryMonth: undefined,
  cardExpiryYear: undefined,
  cardNumber: 'poJy1ZvvwAb6SPEjhgVdZIbGAZLeyMmQ',
  cardNumberStar: undefined,
  notifyShopper: '0',
  notifyOrderSubmitted: '0',
  deliveryInstructions: '',
  smsAlerts: '',
  shipCode: 'S',
  nominatedDate: '',
  URL: 'OrderPrepare?URL=ConfirmAndPay',
  cardSecurityNumber: '123',
  TERMSANDCONDITIONS_OPTIN: 'true',
  langId: '-1',
  storeId: 12556,
  catalogId: '33057',
  save_details: 'on',
}

const montyGuestCheckoutPayload = (
  paymentMethod,
  {
    isGuestRecaptchaEnabled = false,
    isGuestRecaptchaTokenMissing = false,
    signUpGuest = false,
  } = {}
) => ({
  returnUrl: `http://local.m.topshop.com:8080/order-complete-v2?paymentMethod=${paymentMethod}`,
  email: 'email@mail.com',
  isGuestOrder: true,
  orderDeliveryOption: {
    deliveryStoreCode: 'H',
    shipModeId: 26504,
    orderId: 7681507,
    deliveryType: 'HOME_STANDARD',
    shipCode: 'S',
  },
  deliveryAddress: {
    address1: '17 Blenheim Crescent',
    address2: null,
    city: 'LONDON',
    state: '',
    country: 'United Kingdom',
    postcode: 'W11 2EF',
  },
  deliveryNameAndPhone: {
    firstName: 'UserDe',
    lastName: 'UserDe',
    telephone: '09876543212',
    title: 'Mr',
  },
  deliveryType: 'HOME_STANDARD',
  shipping_field1: 'shipping_field1',
  available_date: 26504,
  deliveryInstructions: 'deliveryInstructions',
  smsMobileNumber: 'smsMobileNumber',
  billingDetails: {
    address: {
      address1: '17 Blenheim Crescent first',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'W11 2EF',
    },
    nameAndPhone: {
      firstName: '09876543212',
      lastName: '09876543212',
      telephone: '09876543212',
      title: 'Mr',
    },
  },
  creditCard: {
    expiryYear: '2027',
    expiryMonth: '05',
    type: 'VISA',
    cardNumberHash: 'poJy1ZvvwAb6SPEjhgVdZIbGAZLeyMmQ',
    cardNumberStar: '************4444',
    cardNumber: '************4444',
  },
  ...(isGuestRecaptchaEnabled && {
    brandName: 'topshop',
    recaptchaToken: isGuestRecaptchaTokenMissing ? null : 'token',
    isGuestRecaptchaEnabled,
  }),
  signUpGuest,
})

const wcsPayloadWithCreditCard = {
  ...wcsPayload,
  cardBrand: creditCard.type,
  cardNumberStar: creditCard.cardNumber,
  cardExpiryMonth: creditCard.expiryMonth,
  cardExpiryYear: creditCard.expiryYear,
}

const wcsPayloadWithApplePay = {
  ...wcsPayload,
  cardBrand: 'APPLE',
  cardNumber: undefined,
  cardSecurityNumber: undefined,
  addressId: undefined,
  billing_address_id: undefined,
  paymentToken: 'testString',
}

const wcsPayloadWithClearPay = {
  ...wcsPayload,
  cardBrand: 'CLRPY',
  cardNumber: undefined,
  addressId: undefined,
  cardSecurityNumber: undefined,
  billing_address_id: undefined,
  mobile:
    'http://local.m.topshop.com:8080/order-complete?ga=GA1.2.1490505770.1600865258&orderId=10439030&paymentMethod=CLRPY',
}

const addressDetails = {
  address1: '1 Baker St',
  address2: '',
  city: 'London',
  state: '',
  country: 'England',
  postcode: 'WC123A',
}

const execute = utils.buildExecutor(
  CreateOrder,
  montyRequest(montyReturningAccountCard)
)

const executePayPalOrderUS = utils.buildExecutor(
  CreateOrder,
  montyRequest({
    originEndpoint: '/api/order',
    query: {},
    payload: wcsPayPalPayloadUS,
    method: 'post',
    headers: {
      host: 'host',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
      cookie: 'jessionid=a',
    },
    params: {},
  })
)

const happyApi = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

const executeGuestCheckout = utils.buildExecutor(
  CreateOrder,
  montyRequest(montyGuestCheckoutPayload('VISA'))
)

const executeGuestCheckoutWithRecaptcha = utils.buildExecutor(
  CreateOrder,
  montyRequest(
    montyGuestCheckoutPayload('VISA', { isGuestRecaptchaEnabled: true })
  )
)

const executeGuestCheckoutWithMissingRecaptchaToken = utils.buildExecutor(
  CreateOrder,
  montyRequest(
    montyGuestCheckoutPayload('VISA', {
      isGuestRecaptchaEnabled: true,
      isGuestRecaptchaTokenMissing: true,
    })
  )
)

const executeGuestCheckoutPaypal = utils.buildExecutor(
  CreateOrder,
  montyRequest(montyGuestCheckoutPayload('PYPAL'))
)

const executeGuestCheckoutWithSignUpGuest = utils.buildExecutor(
  CreateOrder,
  montyRequest(montyGuestCheckoutPayload('VISA', { signUpGuest: true }))
)
const executeGuestCheckoutWithSignUpGuestTSUS = utils.buildExecutor(
  CreateOrder,
  {
    ...montyRequest({
      ...montyGuestCheckoutPayload('VISA', { signUpGuest: true }),
    }),
    headers: {
      'brand-code': 'tsus',
    },
  }
)

const executeApiGuestCheckout = () => {
  utils.setWCSResponse({ body: wcs, jsessionid })
  getCookieFromStore.mockReturnValue(Promise.resolve('N'))
}

const expectError = async (
  { statusCode, errorMessage, errorCode },
  payload
) => {
  try {
    const res = await execute(payload)
    await res.body
    throw new Error('Expected promise to reject')
  } catch (error) {
    expect(error.output.payload.statusCode).toBe(statusCode)
    expect(error.output.payload.message).toBe(errorMessage)
    expect(error.data.wcsErrorCode).toBe(errorCode)
  }
}

const getExampleErrorMapping = () => {
  const errorCode = Object.keys(createOrderErrorCodes)[0]
  const statusCode = createOrderErrorCodes[errorCode]
  return { errorCode, statusCode }
}

const happyApiNoFullCheckoutProfile = () => {
  utils.setWCSResponse(
    {
      body: {
        success: true,
        orderSummary: {},
        ConfirmAndPayCardDetailsForm: { addressId: '123' },
      },
      jsessionid,
    },
    { n: 0 }
  )
  utils.setWCSResponse(
    {
      body: {
        success: true,
        orderSummary: {},
        errorMessage: '',
        ConfirmAndPayCardDetailsForm: {
          billing_address_id: '123',
        },
      },
      jsessionid,
    },
    { n: 1 }
  )
  utils.setWCSResponse({ body: wcs, jsessionid }, { n: 2 })
  getCookieFromStore.mockReturnValue(Promise.resolve('N'))
}

const unhappyApi = (paymentType) => {
  const resp = {
    body: paymentType === 'klarna' ? wcsKlarnaFail : wcsFail,
    jsessionid,
  }

  utils.setWCSResponse(resp)
  getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
}

describe('CreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('"ipAddress" payload parameter to WCS', () => {
    it('is set by default to "127.0.0.1"', () => {
      happyApi()
      expect.assertions(1)
      return execute().then(() =>
        expect(utils.getRequestArgs().payload.ipAddress).toEqual('127.0.0.1')
      )
    })
    it('is set with the value of the first IP address received in the "x-forwarded-for" header', () => {
      happyApi()
      const execute = utils.buildExecutor(CreateOrder, {
        originEndpoint: '/api/shopping_bag/mini_bag',
        query: {},
        payload: {},
        method: 'post',
        headers: {
          'x-forwarded-for': '1.1.1.1, 2.2.2.2, 3.3.3.3',
        },
        params: {},
      })
      expect.assertions(1)
      return execute().then(() =>
        expect(utils.getRequestArgs().payload.ipAddress).toEqual('1.1.1.1')
      )
    })
  })

  describe('"nominatedDate" payload parameter to WCS', () => {
    // This test has been introduced to intercept regression for the scenario described in MJI-861

    describe('User with checkout profile', () => {
      it('is set as expected', () => {
        happyApi()
        const execute = utils.buildExecutor(CreateOrder, {
          originEndpoint: '',
          query: {},
          payload: {
            orderDeliveryOption: {
              nominatedDate: 'nominatedDate',
            },
          },
          method: 'post',
          headers: {},
          params: {},
        })
        expect.assertions(1)
        return execute().then(() =>
          expect(utils.getRequestArgs().payload.nominatedDate).toEqual(
            'nominatedDate'
          )
        )
      })
    })
    describe('User with NO checkout profile', () => {
      it('is set as expected', async () => {
        happyApiNoFullCheckoutProfile()
        const execute = utils.buildExecutor(CreateOrder, {
          originEndpoint: '',
          query: {},
          payload: {
            deliveryAddress: addressDetails,
            billingDetails: addressDetails,
            orderDeliveryOption: {
              nominatedDate: 'nominatedDate',
            },
          },
          method: 'post',
          headers: {},
          params: {},
        })
        await execute()
        expect(utils.getRequestArgs().payload.nominatedDate).toEqual(
          'nominatedDate'
        )
      })
    })
  })

  describe('An order that fails', () => {
    describe('response', () => {
      beforeEach(() => {
        unhappyApi()
      })
      it('should reject with a 422 and the wcs error message', async () => {
        await expect(execute()).rejects.toHaveProperty('output.payload', {
          error: 'Unprocessable Entity',
          statusCode: 422,
          message: wcsFail.errorMessage,
        })
      })
    })

    describe('Klarna response', () => {
      beforeEach(() => {
        unhappyApi('klarna')
      })
      it('should reject with a 422 and return an additional error property for Klarna errors', async () => {
        await expect(execute()).rejects.toHaveProperty('data.error', [
          'Not matching fields: [billing_address.family_name]',
        ])
      })
    })
  })

  describe('All requests to create an order', () => {
    it('should call the endpoint /webapp/wcs/stores/servlet/OrderCalculate', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderCalculate'
      )
    })
    it('should call with the post method', async () => {
      happyApi()
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })
  })

  describe('User with checkout profile', () => {
    it('will not send a request to UserRegistrationUpdate endpoint', async () => {
      happyApi()
      await execute()
      expect(utils.getRequests().length).toBe(1)
      expect(utils.getRequestArgs(0).endpoint).not.toBe(
        '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
      )
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderCalculate'
      )
    })
  })

  describe('A user with no checkout profile', () => {
    it('should update delivery and billing details on users profile and submit order', async () => {
      happyApiNoFullCheckoutProfile()
      const execute = utils.buildExecutor(CreateOrder, {
        originEndpoint: '',
        query: {},
        payload: {
          deliveryAddress: addressDetails,
          billingDetails: addressDetails,
        },
        method: 'post',
        headers: {},
        params: {},
      })

      await execute()
      expect(utils.getRequests().length).toBe(3)
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
      )
      expect(utils.getRequestArgs(0).payload.montyUserAction).toBe('shipping')
      expect(utils.getRequestArgs(1).endpoint).toBe(
        '/webapp/wcs/stores/servlet/UserRegistrationUpdate'
      )
      expect(utils.getRequestArgs(1).payload.montyUserAction).toBe('billing')
      expect(utils.getRequestArgs(2).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ConfirmAndPay'
      )
    })
  })

  describe('A returning customer', () => {
    describe('Paying with an Account card already used', () => {
      describe('calling the wcs endpoint for creating an Order', () => {
        it('should call with the correct payload', async () => {
          happyApi()
          await execute()
          expect(utils.getRequestArgs(0).payload).toEqual(wcsPayload)
        })
      })
      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })

        it('should transform the wcs response into a monty response', async () => {
          const result = await execute()
          expect(result.body).toEqual(monty)
        })

        it('should contain the jsessionid', async () => {
          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })

        it('should use server side analytics to log a purchase', async () => {
          await execute()
          expect(serverSideAnalytics.logPurchase).toHaveBeenCalled()
        })

        it('should not use server side analytics to log a purchase from an app', async () => {
          const mapperInputs = montyRequest(montyReturningAccountCard)
          mapperInputs.headers['monty-client-device-type'] = 'apps'
          const execute = utils.buildExecutor(CreateOrder, mapperInputs)

          await execute()
          expect(serverSideAnalytics.logPurchase).not.toHaveBeenCalled()
        })
      })
    })

    describe('Paying with a new Account card, with an old billing address', () => {
      describe('calling the wcs endpoint for creating an Order', () => {
        it('should call with the correct payload', async () => {
          happyApi()
          await execute({
            payload: montyReturningNewAccountCard,
          })
          expect(utils.getRequestArgs(0).payload).toEqual(
            wcsPayloadWithCreditCard
          )
        })
      })
      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })
        it('should transform the wcs response into a monty response', async () => {
          const result = await execute()
          expect(result.body).toEqual(monty)
        })
        it('should contain the jsessionid', async () => {
          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })
      })
    })

    describe('3D payments: VISA, MASTERCARD, AMEX', () => {
      describe('3D Secure v1 requests to WCS', () => {
        it('should make the expected requests to WCS', () => {
          const punchOutRepayURL =
            'PunchoutPaymentRepay?orderId=123456&piId=654321&requesttype=ajax'
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'test-term-url',
              piId: 'test-piid',
              action: 'test-action',
              MD: 'test-md',
              PaReq: 'test-pareq',
              punchOutRepayURL,
            },
          })
          utils.setWCSResponse(
            { body: { OrderConfirmation: 'orderConfirmation', orderId: 123 } },
            { n: 1 }
          )

          expect.assertions(4)
          return execute().then(() => {
            expect(utils.getRequestArgs(1).endpoint).toEqual(
              `/webapp/wcs/stores/servlet/${punchOutRepayURL}`
            )
            expect(utils.getRequestArgs(1).query).toEqual({})
            expect(utils.getRequestArgs(1).payload).toEqual({})
            expect(utils.getRequestArgs(1).method).toEqual('post')
          })
        })
      })

      describe('3D Secure v1 response', () => {
        it('should be mapped correctly', () => {
          happyApi()
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'termUrl',
              piId: 'piId',
              action: 'action',
              MD: 'md',
              PaReq: 'paReq',
            },
          })
          utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })

          expect.assertions(1)
          return execute()
            .then((res) => {
              return res.body
            })
            .then((res) => {
              const vbvForm = {
                termUrl: `https://pplive-m-topshop-com.digital.arcadiagroup.co.uk/order-complete?paymentMethod=ACCNT`,
                originalTermUrl: 'termUrl',
                vbvForm: `<form method='post' action='action'><input type='hidden' name='TermUrl' value='https://pplive-m-topshop-com.digital.arcadiagroup.co.uk/order-complete?paymentMethod=ACCNT'/><input type='hidden' name='MD' value='md'/><textarea style='display:none;' name='PaReq'>paReq</textarea></form><script language='text/javascript' type='text/javascript'>document.getElementsByTagName('form')[0].submit();</script>`,
                piId: 'piId',
                action: 'action',
                md: 'md',
                paReq: 'paReq',
              }
              expect(res).toEqual({ vbvForm })
            })
        })

        it('should handle errorCodes', async () => {
          const { errorCode, statusCode } = getExampleErrorMapping()
          const errorMessage = 'Whoops'
          happyApi()
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'termUrl',
              piId: 'piId',
              cardBrand: 'cardBrand',
              action: 'action',
              MD: 'md',
              PaReq: 'paReq',
            },
          })
          utils.setWCSResponse(
            {
              body: {
                errorCode,
                errorMessage,
              },
            },
            { n: 1 }
          )

          await expectError({ errorCode, errorMessage, statusCode })
        })
      })

      describe('3D Secure v2 requests to WCS', () => {
        it('should make the expected requests to WCS', () => {
          const punchOutRepayURL =
            'PunchoutPaymentRepay?orderId=123456&piId=654321&requesttype=ajax'
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'test-term-url',
              piId: 'test-piid',
              challengeUrl: 'test-challenge-url',
              challengeJwt: 'test-challenge-jwt',
              threeDSVersion: 'test-3DS-version',
              '3DSChallengeWindowSize': 'test-window-size',
              MD: 'test-md',
              punchOutRepayURL,
            },
          })
          utils.setWCSResponse(
            { body: { OrderConfirmation: 'orderConfirmation', orderId: 123 } },
            { n: 1 }
          )

          expect.assertions(4)
          return execute().then(() => {
            expect(utils.getRequestArgs(1).endpoint).toEqual(
              `/webapp/wcs/stores/servlet/${punchOutRepayURL}`
            )
            expect(utils.getRequestArgs(1).query).toEqual({})
            expect(utils.getRequestArgs(1).payload).toEqual({})
            expect(utils.getRequestArgs(1).method).toEqual('post')
          })
        })
      })

      describe('3D Secure v2 response', () => {
        it('should be mapped correctly', () => {
          happyApi()
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'test-term-url',
              piId: 'test-piid',
              challengeUrl: 'test-challenge-url',
              challengeJwt: 'test-challenge-jwt',
              threeDSVersion: 'test-3DS-version',
              '3DSChallengeWindowSize': 'test-window-size',
              MD: 'test-md',
            },
          })
          utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })

          expect.assertions(1)
          return execute()
            .then((res) => {
              return res.body
            })
            .then((body) => {
              const threeDS2Response = {
                piId: 'test-piid',
                challengeUrl: 'test-challenge-url',
                challengeJwt: 'test-challenge-jwt',
                threeDSVersion: 'test-3DS-version',
                challengeWindowSize: 'test-window-size',
                md: 'test-md',
              }
              expect(body).toEqual(threeDS2Response)
            })
        })

        it('should handle errorCodes', async () => {
          const { errorCode, statusCode } = getExampleErrorMapping()
          const errorMessage = 'Whoops'
          happyApi()
          utils.setWCSResponse({
            body: {
              formEncoded: true,
              TermUrl: 'test-term-url',
              piId: 'test-piid',
              challengeUrl: 'test-challenge-url',
              challengeJwt: 'test-challenge-jwt',
              threeDSVersion: 'test-3DS-version',
              '3DSChallengeWindowSize': 'test-window-size',
              MD: 'test-md',
            },
          })
          utils.setWCSResponse(
            {
              body: {
                errorCode,
                errorMessage,
              },
            },
            { n: 1 }
          )

          await expectError({ errorCode, errorMessage, statusCode })
        })
      })
    })

    describe('no 3D payments: MASTERO, VISA, MASTERCARD, AMEX', () => {
      describe('requests to WCS', () => {
        it('are done as expected', () => {
          utils.setWCSResponse({
            body: {
              paymentRedirectURL: 'paymentRedirectURL',
              punchOutRepayURL: 'punchOutRepayURL',
            },
          })
          utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })
          utils.setWCSResponse(
            { body: { redirectURL: 'redirectURL' } },
            { n: 2 }
          )
          utils.setWCSResponse({ body: { OrderConfirmation: {} } }, { n: 3 })

          expect.assertions(14)
          return execute().then(() => {
            expect(utils.getRequestArgs(1).endpoint).toEqual(
              '/webapp/wcs/stores/servlet/punchOutRepayURL'
            )
            expect(utils.getRequestArgs(1).query).toEqual({})
            expect(utils.getRequestArgs(1).payload).toEqual({})
            expect(utils.getRequestArgs(1).method).toEqual('post')

            expect(utils.getRequestArgs(2).hostname).toEqual(
              'paymentRedirectURL'
            )
            expect(utils.getRequestArgs(2).endpoint).toEqual('')
            expect(utils.getRequestArgs(2).query).toEqual({})
            expect(utils.getRequestArgs(2).payload).toEqual({})
            expect(utils.getRequestArgs(2).method).toEqual('get')

            expect(utils.getRequestArgs(3).hostname).toEqual('redirectURL')
            expect(utils.getRequestArgs(3).endpoint).toEqual('')
            expect(utils.getRequestArgs(3).query).toEqual({})
            expect(utils.getRequestArgs(3).payload).toEqual({})
            expect(utils.getRequestArgs(3).method).toEqual('get')
          })
        })
      })

      describe('response', () => {
        beforeEach(() => {
          utils.setWCSResponse({
            body: {
              paymentRedirectURL: 'paymentRedirectURL',
              punchOutRepayURL: 'punchOutRepayURL',
            },
          })
          utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })
          utils.setWCSResponse(
            { body: { redirectURL: 'redirectURL' } },
            { n: 2 }
          )
          utils.setWCSResponse({ body: wcsKlarnaReturningCustomer }, { n: 3 })
        })

        it('is mapped correctly', () => {
          expect.assertions(1)
          return execute()
            .then((res) => {
              return res.body
            })
            .then((res) => {
              expect(res).toEqual(montyKlarnaReturningCustomer)
            })
        })

        it('should use server side analytics to log a purchase', async () => {
          await execute()
          expect(serverSideAnalytics.logPurchase).toHaveBeenCalled()
        })

        it('should not use server side analytics to log a purchase from an app', async () => {
          const mapperInputs = montyRequest(montyReturningAccountCard)
          mapperInputs.headers['monty-client-device-type'] = 'apps'
          const execute = utils.buildExecutor(CreateOrder, mapperInputs)

          await execute()
          expect(serverSideAnalytics.logPurchase).not.toHaveBeenCalled()
        })
      })

      it('handles errorCode ', async () => {
        const { errorCode, statusCode } = getExampleErrorMapping()
        const errorMessage = 'Whoops'
        utils.setWCSResponse({
          body: {
            paymentRedirectURL: 'paymentRedirectURL',
            punchOutRepayURL: 'punchOutRepayURL',
          },
        })
        utils.setWCSResponse(
          {
            body: {
              errorCode,
              errorMessage,
            },
          },
          { n: 1 }
        )

        await expectError(
          { errorCode, statusCode, errorMessage },
          { payload: montyPayPalRequest }
        )
      })

      it('handles errorCode after punchout', async () => {
        const { errorCode, statusCode } = getExampleErrorMapping()
        const errorMessage = 'Whoops'
        utils.setWCSResponse({
          body: {
            paymentRedirectURL: 'paymentRedirectURL',
            punchOutRepayURL: 'punchOutRepayURL',
          },
        })
        utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })
        utils.setWCSResponse({ body: { errorCode, errorMessage } }, { n: 2 })

        await expectError(
          { errorCode, statusCode, errorMessage },
          { payload: montyPayPalRequest }
        )
      })

      it('handles errorCode after payment', async () => {
        const { errorCode, statusCode } = getExampleErrorMapping()
        const errorMessage = 'Whoops'
        utils.setWCSResponse({
          body: {
            paymentRedirectURL: 'paymentRedirectURL',
            punchOutRepayURL: 'punchOutRepayURL',
          },
        })
        utils.setWCSResponse({ body: { orderId: 123 } }, { n: 1 })
        utils.setWCSResponse({ body: { redirectURL: 'redirectURL' } }, { n: 2 })
        utils.setWCSResponse({ body: { errorCode, errorMessage } }, { n: 3 })

        await expectError(
          { errorCode, statusCode, errorMessage },
          { payload: montyPayPalRequest }
        )
      })
    })

    describe('ApplePay', () => {
      describe('requests to WCS', () => {
        it('are done as expected', async () => {
          utils.setWCSResponse({ body: wcs, jsessionid })
          getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
          await execute({ payload: montyApplePayRequest })
          expect(utils.getRequestArgs(0).payload).toEqual(
            wcsPayloadWithApplePay
          )
        })

        it('validates paymentToken type', async () => {
          utils.setWCSResponse({ body: wcs, jsessionid })
          getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
          await expect(
            execute({
              payload: { ...montyApplePayRequest, paymentToken: {} },
            })
          ).rejects.toThrow()
        })
      })
      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })
        it('should transform the wcs response into a monty response', async () => {
          const result = await execute()
          expect(result.body).toEqual(monty)
        })
        it('should contain the jsessionid', async () => {
          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })
      })
    })

    describe('ClearPay', () => {
      const wcsReponse = {
        body: {
          success: 'true',
          paymentToken: '003.4hh1a0umctdtl5sjb5tbdjh87jefijlpos7jcst8j3f5co62',
          cardBrand: 'CLRPY',
          orderId: '8361838',
          errorMessage: '',
          expires: '2020-10-19T18:51:54.640Z',
          policyId: '47095',
          tranId: '893012',
        },
        jsessionid,
      }
      describe('requests to WCS', () => {
        it('are done as expected', async () => {
          utils.setWCSResponse(wcsReponse)
          getCookieFromStore.mockReturnValue(Promise.resolve('Y'))
          await execute({ payload: montyClearPayRequest })
          expect(utils.getRequestArgs(0).payload).toEqual(
            wcsPayloadWithClearPay
          )
        })
      })

      describe('response', () => {
        beforeEach(() => {
          happyApi()
        })
        it('should transform the wcs response into a monty response', async () => {
          utils.setWCSResponse(wcsReponse)

          const result = await execute()
          expect(result.body).toEqual({
            cardBrand: 'CLRPY',
            errorMessage: '',
            expires: '2020-10-19T18:51:54.640Z',
            orderId: '8361838',
            paymentToken:
              '003.4hh1a0umctdtl5sjb5tbdjh87jefijlpos7jcst8j3f5co62',
            policyId: '47095',
            success: 'true',
            tranId: '893012',
          })
        })
        it('should contain the jsessionid', async () => {
          utils.setWCSResponse(wcsReponse)

          const result = await execute()
          expect(result.jsessionid).toBe(jsessionid)
        })
      })
    })

    describe('PayPal', () => {
      describe('requests to WCS', () => {
        it('are done as expected', () => {
          utils.setWCSResponse({
            body: {
              ...wcs,
              confirmationTitle: false,
              cardBrand: 'PYPAL',
              punchOutRepayURL: 'punchOutRepayURL',
              paymentRedirectURL: 'paymentRedirectURL',
            },
            jsessionid,
          })
          utils.setWCSResponse({ orderId: 'orderId' }, { n: 1 })

          expect.assertions(3)
          return execute({ payload: montyPayPalRequest }).then(() => {
            expect(utils.getRequestArgs(0).payload).toEqual(wcsPayPalPayload)

            expect(utils.getRequestArgs(1).endpoint).toEqual(
              '/webapp/wcs/stores/servlet/punchOutRepayURL'
            )
            expect(utils.getRequestArgs(1).method).toEqual('post')
          })
        })
      })
      describe('response', () => {
        it('is mapped correctly', () => {
          utils.setWCSResponse({
            body: {
              ...wcs,
              confirmationTitle: false,
              cardBrand: 'PYPAL',
              punchOutRepayURL: 'punchOutRepayURL',
              paymentRedirectURL: 'paymentRedirectURL',
              token: 'EC-7K6973260X275751C',
              tranId: '1178478',
              policyId: '25000',
            },
            jsessionid,
          })
          utils.setWCSResponse({ orderId: 'orderId' }, { n: 1 })

          expect.assertions(1)
          return execute({ payload: montyPayPalRequest })
            .then((res) => {
              return res.body
            })
            .then((res) => {
              expect(res).toEqual({
                paymentUrl: 'paymentRedirectURL',
                paypalUrl: 'paymentRedirectURL',
                token: 'EC-7K6973260X275751C',
                tranId: '1178478',
                policyId: '25000',
              })
            })
        })

        it('handles errorCode', async () => {
          const { errorCode, statusCode } = getExampleErrorMapping()
          const errorMessage = 'Whoops'
          utils.setWCSResponse({
            body: {
              ...wcs,
              confirmationTitle: false,
              cardBrand: 'PYPAL',
              punchOutRepayURL: 'punchOutRepayURL',
              paymentRedirectURL: 'paymentRedirectURL',
            },
            jsessionid,
          })
          utils.setWCSResponse({ body: { errorCode, errorMessage } }, { n: 1 })

          await expectError(
            { errorCode, statusCode, errorMessage },
            { payload: montyPayPalRequest }
          )
        })

        it('should return the correct errorRedirectURL if the US delivery address is incorrect', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction.',
                success: false,
              },
            },
            { n: 1 }
          )

          expect.assertions(4)
          return executePayPalOrderUS().catch(() => {
            expect(utils.getRequestArgs(1).endpoint).toBe(
              '/webapp/wcs/stores/servlet/OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1'
            )
            expect(utils.getRequestArgs(1).query).toEqual({})
            expect(utils.getRequestArgs(1).payload).toEqual({})
            expect(utils.getRequestArgs(1).method).toEqual('post')
          })
        })

        it('should return an error if errorRedirectURL is returned and success is false', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
                success: false,
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toHaveProperty('output.payload', {
              error: 'Unprocessable Entity',
              statusCode: 422,
              message:
                'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
            })
          })
        })

        it('should return an error if redirectURL is returned and success is false', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              redirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',

                error:
                  'There was an error while completing the PayPal transaction.',
                success: false,
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toHaveProperty('output.payload', {
              error: 'Unprocessable Entity',
              statusCode: 422,
              message:
                'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
            })
          })
        })

        it('should return an error if errorMessage or success are not returned after calling wcs with errorRedirectURL', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                error:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toEqual(
              Boom.badGateway(
                `create order (PayPal) unexpected response: OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1`
              )
            )
          })
        })

        it('should return the correct errorRedirectURL if the US delivery address is incorrect', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',

                error:
                  'There was an error while completing the PayPal transaction.',
                success: false,
              },
            },
            { n: 1 }
          )
          expect.assertions(4)
          return executePayPalOrderUS().catch(() => {
            expect(utils.getRequestArgs(1).endpoint).toBe(
              '/webapp/wcs/stores/servlet/OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1'
            )
            expect(utils.getRequestArgs(1).query).toEqual({})
            expect(utils.getRequestArgs(1).payload).toEqual({})
            expect(utils.getRequestArgs(1).method).toEqual('post')
          })
        })

        it('should return an error if errorRedirectURL is returned and success is false', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
                success: false,
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toHaveProperty('output.payload', {
              error: 'Unprocessable Entity',
              statusCode: 422,
              message:
                'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
            })
          })
        })

        it('should return an error if redirectURL is returned and success is false', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              redirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                errorMessage:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
                success: false,
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toHaveProperty('output.payload', {
              error: 'Unprocessable Entity',
              statusCode: 422,
              message:
                'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
            })
          })
        })

        it('should return an error if errorMessage or success are not returned after calling wcs with errorRedirectURL', () => {
          utils.setWCSResponse({
            body: {
              cardBrand: 'PYPAL',
              errorRedirectURL:
                'OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1',
            },
          })

          utils.setWCSResponse(
            {
              body: {
                error:
                  'There was an error while completing the PayPal transaction. Please check the address details you have entered and try again.',
                success: true,
              },
            },
            { n: 1 }
          )

          expect.assertions(1)
          return executePayPalOrderUS().catch((err) => {
            expect(err).toEqual(
              Boom.badGateway(
                `create order (PayPal) unexpected response: OrderDisplay?catalogId=33059&orderId=9147750&storeId=13051&langId=-1`
              )
            )
          })
        })
      })
    })
  })

  describe('A guest user', () => {
    it('should call with the correct payload with VISA card', async () => {
      executeApiGuestCheckout()
      await executeGuestCheckout().then(() => {
        expect(utils.getRequestArgs(0).payload.isGuestOrder).toBe(true)
        expect(utils.getRequestArgs(0).payload.email).toBe('email@mail.com')
        expect(utils.getRequestArgs(0).payload.cardBrand).toBe('VISA')
        expect(utils.getRequestArgs(0).payload.cardExpiryYear).toBeTruthy()
        expect(utils.getRequestArgs(0).payload.cardExpiryMonth).toBeTruthy()
        expect(utils.getRequestArgs(0).payload.cardNumberStar).toBeTruthy()
      })
    })
    it('Guest user paying with paypal', async () => {
      executeApiGuestCheckout()
      await executeGuestCheckoutPaypal().then(() => {
        expect(utils.getRequestArgs(0).payload.isGuestOrder).toBe(true)
        expect(utils.getRequestArgs(0).payload.email).toBe('email@mail.com')
        expect(utils.getRequestArgs(0).payload.cardBrand).toBe('PYPAL')
        expect(utils.getRequestArgs(0).payload.cardExpiryYear).toBeFalsy()
        expect(utils.getRequestArgs(0).payload.cardExpiryMonth).toBeFalsy()
        expect(utils.getRequestArgs(0).payload.cardNumberStar).toBeFalsy()
      })
    })

    describe('when `isGuestRecaptchaEnabled` equal to true', () => {
      it('should call `validateGoogleRecaptchaToken` with correct arguments', async () => {
        executeApiGuestCheckout()
        await executeGuestCheckoutWithRecaptcha().then(() => {
          expect(googleUtils.validateGoogleRecaptchaToken).toHaveBeenCalledWith(
            'topshop',
            'token'
          )
        })
      })

      describe('when `recaptchaToken` is missing', () => {
        it('should not call `validateGoogleRecaptchaToken`', async () => {
          executeApiGuestCheckout()
          await executeGuestCheckoutWithMissingRecaptchaToken().then(() => {
            expect(
              googleUtils.validateGoogleRecaptchaToken
            ).not.toHaveBeenCalled()
          })
        })

        it('should call setCustomAttribute', async () => {
          executeApiGuestCheckout()
          await executeGuestCheckoutWithMissingRecaptchaToken().then(() => {
            expect(logger.setCustomAttribute).toHaveBeenCalledWith(
              'isRecaptchaTokenNull',
              true
            )
          })
        })
      })
    })

    describe('when `isGuestRecaptchaEnabled` equal to false', () => {
      it('should not call `validateGoogleRecaptchaToken`', async () => {
        executeApiGuestCheckout()
        await executeGuestCheckout().then(() => {
          expect(
            googleUtils.validateGoogleRecaptchaToken
          ).not.toHaveBeenCalled()
        })
      })
    })

    describe('signUpGuest', () => {
      describe('signUpGuest is equal to true', () => {
        it('should call with the correct payload ', async () => {
          executeApiGuestCheckout()
          await executeGuestCheckoutWithSignUpGuest().then(() => {
            expect(utils.getRequestArgs(0).payload.isGuestOrder).toBe(true)
            expect(utils.getRequestArgs(0).payload.signUpGuest).toBe(true)
            expect(utils.getRequestArgs(0).payload.source).toBe('CHECKOUT')
            expect(utils.getRequestArgs(0).payload.default_service_id).toBe(8)
          })
        })

        it('should call with the correct default_service_id if storeCode is TSDE', async () => {
          executeApiGuestCheckout()
          await executeGuestCheckoutWithSignUpGuestTSUS().then(() => {
            expect(utils.getRequestArgs(0).payload.isGuestOrder).toBe(true)
            expect(utils.getRequestArgs(0).payload.signUpGuest).toBe(true)
            expect(utils.getRequestArgs(0).payload.source).toBe('CHECKOUT')
            expect(utils.getRequestArgs(0).payload.default_service_id).toBe(12)
          })
        })
      })

      describe('signUpGuest is equal to false', () => {
        it('should call with the correct payload ', async () => {
          executeApiGuestCheckout()
          await executeGuestCheckout().then(() => {
            expect(utils.getRequestArgs(0).payload.isGuestOrder).toBe(true)
            expect(utils.getRequestArgs(0).payload.signUpGuest).toBe(false)
            expect(utils.getRequestArgs(0).payload.source).not.toBeDefined()
            expect(
              utils.getRequestArgs(0).payload.default_service_id
            ).not.toBeDefined()
          })
        })
      })
    })
  })
})
