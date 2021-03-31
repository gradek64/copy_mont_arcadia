import * as utils from '../../../../__test__/utils'
import { createOrderErrorCodes } from '../../../../constants/wcsErrorCodes'

import CreateOrder from '../../CreateOrder'

describe('CreateOrder Mapper: ALIPAY', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    utils.setUserSession({
      cookies: [utils.createCookies()('profileExists=Y;')],
    })
  })

  const defaults = {
    method: 'post',
    payload: {},
    headers: {
      cookie: 'jsessionid=12345',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    },
    query: {},
    endpoint: '',
    getCookieFromStore: jest.fn(() => Promise.resolve('Y')),
  }

  const montyRegisteredReturningPayload = {
    smsMobileNumber: '',
    remoteIpAddress: '127.0.0.1',
    cardCvv: '0',
    orderDeliveryOption: {
      orderId: 700403260,
      shippingCountry: 'United Kingdom',
      shipCode: 'S',
      deliveryType: 'HOME_STANDARD',
      shipModeId: 26504,
    },
    deliveryInstructions: '',
    returnUrl:
      'http://local.m.topshop.com:8080/order-complete?paymentMethod=ALIPY',
    billingDetails: {
      address: {
        address1: '3 Foobar Lane',
        address2: '',
        city: 'BEIJING',
        state: 'Bejing',
        country: 'China',
        postcode: '101',
      },
      nameAndPhone: {
        firstName: 'Bob',
        lastName: 'Barker',
        telephone: '12341332',
        title: 'Mr',
      },
    },
    creditCard: {
      expiryYear: '2019',
      expiryMonth: '1',
      cardNumber: '0',
      type: 'ALIPY',
    },
  }

  const piId = 12345
  const orderId = 67890
  const paymentRedirectURL = 'http://worldpay.com/?foobar=12341'

  const wcsRegisteredReturningPayload = {
    TERMSANDCONDITIONS_OPTIN: 'true',
    URL: 'OrderPrepare?URL=ConfirmAndPay',
    acceptHeader: '*/*',
    addressId: undefined,
    auth_token: undefined,
    billing_address_id: '234567',
    cardBrand: 'ALIPY',
    cardExpiryMonth: '1',
    cardExpiryYear: '2019',
    cardNumber: undefined,
    cardNumberStar: '0',
    // cardSecurityNumber: '0',
    catalogId: '33057',
    contentType: '*/*',
    deliveryInstructions: '',
    errorViewName: 'DoPaymentErrorView',
    ipAddress: '127.0.0.1',
    langId: '-1',
    mobile:
      'http://local.m.topshop.com:8080/order-complete?paymentMethod=ALIPY',
    nominatedDate: '',
    notifyOrderSubmitted: '0',
    notifyShopper: '0',
    orderId: 700403260,
    shipCode: 'S',
    smsAlerts: '',
    storeId: 12556,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    save_details: 'on',
  }

  const wcsRegisteredReturningResponse = {
    paymentRedirectURL,
    cardBrand: 'ALIPY',
    piId,
    orderId,
  }

  const montyRegisteredReturningResponse = {
    paymentUrl: paymentRedirectURL,
  }

  const wcsRegisteredReturningPunchoutResponse = { orderId: [orderId] }

  const execute = utils.buildExecutor(CreateOrder, defaults)

  describe('Registered user', () => {
    describe('when the last order used ALIPAY', () => {
      beforeEach(() => {
        utils.setWCSResponse({
          body: {
            orderSummary: {
              OrderCalculateForm: { billing_address_id: '234567' },
            },
          },
        })
        utils.setWCSResponse({ body: wcsRegisteredReturningResponse }, { n: 1 })
        utils.setWCSResponse(
          { body: wcsRegisteredReturningPunchoutResponse },
          { n: 2 }
        )
      })

      describe('initial requests', () => {
        it('should have the correct payload', async () => {
          await execute({ payload: montyRegisteredReturningPayload })
          expect(utils.getRequestArgs(1).payload).toEqual(
            wcsRegisteredReturningPayload
          )
        })
      })

      describe('second requests', () => {
        it('should have values from the first request in their query', async () => {
          await execute({ payload: montyRegisteredReturningPayload })
          expect(utils.getRequestArgs(2).endpoint).toBe(
            `/webapp/wcs/stores/servlet/PunchoutPaymentRepay?orderId=${orderId}&piId=${piId}&requesttype=ajax`
          )
        })
      })

      describe('responses', () => {
        it('should be mapped correctly', async () => {
          await execute({ payload: montyRegisteredReturningPayload })
            .then((res) => res.body)
            .then((res) => {
              expect(res).toEqual(montyRegisteredReturningResponse)
            })
        })
      })

      describe('unsuccessful requests', () => {
        describe('if WCS returns an error message on the first request', () => {
          it('should return the error', async () => {
            utils.setWCSResponse({
              body: {
                orderSummary: {
                  OrderCalculateForm: { billing_address_id: '234567' },
                },
              },
            })
            utils.setWCSResponse(
              {
                body: {
                  errorMessage: 'Could not process payment type',
                },
              },
              { n: 1 }
            )
            await expect(
              execute({ payload: montyRegisteredReturningPayload })
            ).rejects.toHaveProperty('output.payload', {
              error: 'Unprocessable Entity',
              statusCode: 422,
              message: 'Could not process payment type',
            })
          })
        })

        describe('if WCS does not send the proper response on the first request', () => {
          it('should return an error', async () => {
            utils.setWCSResponse(
              {
                cardBrand: 'WRONG',
                paymentRedirectURL: '',
              },
              { n: 0 }
            )
            await expect(execute({})).rejects.toMatchObject({
              cardBrand: 'WRONG',
              paymentRedirectURL: '',
            })
          })
        })

        describe('if WCS returns an error message on the second request', () => {
          it('should return the error', async () => {
            const errorCode = Object.keys(createOrderErrorCodes)[0]
            const statusCode = createOrderErrorCodes[errorCode]
            const errorMessage = 'Error handling punchout'
            utils.setWCSResponse(
              { body: wcsRegisteredReturningResponse },
              { n: 0 }
            )
            utils.setWCSResponse(
              { body: { errorCode, errorMessage } },
              { n: 1 }
            )
            await execute()
              .then((res) => res.body)
              .then((res) => res.body)
              .catch((err) => {
                expect(err.output.payload.statusCode).toBe(statusCode)
                expect(err.output.payload.message).toBe(errorMessage)
                expect(err.data.wcsErrorCode).toBe(errorCode)
              })
          })
        })

        describe('if WCS does not return a valid response on the second request', () => {
          it('should return an error', async () => {
            utils.setWCSResponse(
              { body: wcsRegisteredReturningResponse },
              { n: 0 }
            )
            utils.setWCSResponse({ body: { foo: 'bar' } }, { n: 1 })
            await execute()
              .then((res) => res.body)
              .then((res) => res.body)
              .catch((err) => {
                expect(err).toHaveProperty('output.payload', {
                  error: 'Bad Gateway',
                  statusCode: 502,
                  message: `create order ${
                    wcsRegisteredReturningResponse.cardBrand
                  } : unexpected response for punchOutRepayURL request`,
                })
              })
          })
        })
      })
    })
  })
})
