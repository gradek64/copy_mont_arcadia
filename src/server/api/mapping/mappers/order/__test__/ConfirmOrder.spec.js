import * as utils from '../../../__test__/utils'

import ConfirmOrder from '../ConfirmOrder'
import * as serverSideAnalytics from '../server_side_analytics'

// Home Standard
import wcsHomeStandard from 'test/apiResponses/orders/putOrder/homeStandard/wcs.json'
import hapiHomeStandard from 'test/apiResponses/orders/putOrder/homeStandard/hapi.json'

// Home Express
import wcsHomeExpress from 'test/apiResponses/orders/putOrder/homeExpress/wcs.json'
import hapiHomeExpress from 'test/apiResponses/orders/putOrder/homeExpress/hapi.json'

// Store Standard
import wcsStoreStandard from 'test/apiResponses/orders/putOrder/storeStandard/wcs.json'
import hapiStoreStandard from 'test/apiResponses/orders/putOrder/storeStandard/hapi.json'

// Store Express
import wcsStoreExpress from 'test/apiResponses/orders/putOrder/storeExpress/wcs.json'
import hapiStoreExpress from 'test/apiResponses/orders/putOrder/storeExpress/hapi.json'

// Parcelshop
import wcsParcelshop from 'test/apiResponses/orders/putOrder/parcelshop/wcs.json'
import hapiParcelShop from 'test/apiResponses/orders/putOrder/parcelshop/hapi.json'

// International

// ALIPAY/SOFRT/CUPAY/IDEAL
import wcsAlipay from 'test/apiResponses/orders/putOrder/putOrder.alipay/wcs.json'
import hapiAlipay from 'test/apiResponses/orders/putOrder/putOrder.alipay/hapiMonty.json'

jest.mock('../server_side_analytics', () => ({
  logPurchase: jest.fn(),
}))

describe('ConfirmOrder Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const headers = {
    cookie: 'jsessionid=12345',
  }

  const defaults = {
    endpoint: 'putOrder',
    query: {},
    payload: { paRes: 'PaRes', md: 'MD' },
    method: 'put',
    headers,
    params: {},
  }

  const execute = utils.buildExecutor(ConfirmOrder, defaults)

  describe('Requests to WCS', () => {
    describe('PayPal', () => {
      it('Sends the expected request to WCS', () => {
        const executePayPalPutOrder = utils.buildExecutor(ConfirmOrder, {
          payload: {
            authProvider: 'PYPAL',
            policyId: 'policyId',
            payerId: 'PayerId',
            userApproved: 'userApproved',
            orderId: 'orderId',
            token: 'token',
            tranId: 'tran_id',
          },
        })

        expect.assertions(3)
        return executePayPalPutOrder().then(() => {
          expect(utils.getRequestArgs(0).endpoint).toEqual(
            '/webapp/wcs/stores/servlet/PunchoutPaymentCallBack'
          )
          expect(utils.getRequestArgs(0).method).toEqual('post')
          expect(utils.getRequestArgs(0).payload).toEqual({
            authProvider: 'PYPAL',
            policyId: 'policyId',
            PayerId: 'PayerId',
            userApproved: 'userApproved',
            orderId: 'orderId',
            token: 'token',
            tran_id: 'tran_id',
            notifyShopper: 0,
            notifyOrderSubmitted: 0,
            langId: '-1',
            catalogId: '33057',
            storeId: 12556,
          })
        })
      })

      it('handles errorMessage if passed to it', async () => {
        const execute = utils.buildExecutor(ConfirmOrder, {
          payload: {
            authProvider: 'PYPAL',
            policyId: 'policyId',
            payerId: 'PayerId',
            userApproved: 'userApproved',
            orderId: 'orderId',
            token: 'token',
            tranId: 'tran_id',
          },
        })
        utils.setWCSResponse({
          body: {
            success: false,
            errorMessage: 'hello',
          },
        })
        await expect(execute()).rejects.toMatchObject({
          output: {
            payload: {
              statusCode: 502,
              message: 'hello',
            },
          },
        })
      })

      it('handles default message if no errorMesssage if passed to it', async () => {
        const execute = utils.buildExecutor(ConfirmOrder, {
          payload: {
            authProvider: 'PYPAL',
            policyId: 'policyId',
            payerId: 'PayerId',
            userApproved: 'userApproved',
            orderId: 'orderId',
            token: 'token',
            tranId: 'tran_id',
          },
        })
        utils.setWCSResponse({
          body: {
            success: false,
          },
        })
        await expect(execute()).rejects.toMatchObject({
          output: {
            payload: {
              statusCode: 502,
              message: 'Error while trying to complete order',
            },
          },
        })
      })
    })

    describe('CLRPY', () => {
      const payload = {
        orderId: 'orderId',
        token: 'token',
        authProvider: 'CLRPY',
        userAgent: '',
        tran_id: 'tranId',
        policyId: 'policyId',
      }

      it('Sends the expected request to WCS', () => {
        const executeClrPyPutOrder = utils.buildExecutor(ConfirmOrder, {
          payload,
        })

        expect.assertions(3)
        return executeClrPyPutOrder().then(() => {
          expect(utils.getRequestArgs(0).endpoint).toEqual(
            '/webapp/wcs/stores/servlet/PunchoutPaymentCallBack'
          )
          expect(utils.getRequestArgs(0).method).toEqual('post')
          expect(utils.getRequestArgs(0).payload).toEqual({
            orderId: 'orderId',
            token: 'token', // paymentToken or orderToken?
            authProvider: 'CLRPY',
            userAgent: '',
            tran_id: 'tranId',
            policyId: 'policyId',
            langId: '-1',
            catalogId: '33057',
            storeId: 12556,
          })
        })
      })

      it('handles errorMessage if passed to it', async () => {
        const execute = utils.buildExecutor(ConfirmOrder, {
          payload,
        })
        utils.setWCSResponse({
          body: {
            success: false,
            errorMessage: 'hello',
          },
        })
        await expect(execute()).rejects.toMatchObject({
          output: {
            payload: {
              statusCode: 502,
              message: 'hello',
            },
          },
        })
      })

      it('handles default message if no errorMesssage if passed to it', async () => {
        const execute = utils.buildExecutor(ConfirmOrder, {
          payload,
        })
        utils.setWCSResponse({
          body: {
            success: false,
          },
        })
        await expect(execute()).rejects.toMatchObject({
          output: {
            payload: {
              statusCode: 502,
              message: 'Error while trying to complete order',
            },
          },
        })
      })
    })

    describe('ALIPY/SOFRT/CUPAY/IDEAL', () => {
      const montyPayload = {
        paymentMethod: 'ALIPY/https://foo.bar',
        catalogId: 33057,
        storeId: 12556,
        langId: -1,
        tran_id: 784789,
        userApproved: 1,
        dummy: '',
        orderKey: 'ORDER_KEY',
        paymentStatus: 'AUTHORISED',
        paymentAmount: '23760',
        paymentCurrency: 'GBP',
        mac: 'MAC',
        orderId: 'orderId',
        authProvider: 'ALIPY',
      }
      const execute = utils.buildExecutor(ConfirmOrder, {
        payload: montyPayload,
      })
      describe('Requests', () => {
        it('should pass through the payload from Monty', async () => {
          await execute()
          expect(utils.getRequestArgs(0).payload).toEqual(montyPayload)
        })

        it('should fail if the payment is not authorised', () => {
          // try-catch block used as execute() is not a Promise
          try {
            execute({ payload: { ...montyPayload, paymentStatus: 'DECLINED' } })
          } catch (err) {
            expect(err).toHaveProperty('output.payload', {
              error: 'Bad Gateway',
              statusCode: 502,
              message: 'Payment was not authorised',
            })
          }
        })

        it('should fail if the WCS request fails', async () => {
          utils.setWCSResponse(Promise.reject('WCS error'))
          await expect(execute()).rejects.toHaveProperty('output.payload', {
            error: 'Unprocessable Entity',
            message: 'WCS error',
            statusCode: 422,
          })
        })
      })

      describe('Responses', () => {
        it('should be mapped correctly', async () => {
          utils.setWCSResponse({ body: wcsAlipay })
          await expect(execute()).resolves.toEqual({ body: hapiAlipay })
        })
      })
    })

    it('are done passing the expected arguments', async () => {
      utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
      utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
      utils.setWCSResponse(
        { body: { OrderConfirmation: 'orderConfirmation', orderId: 123 } },
        { n: 1 }
      )
      await execute()
        .then(() => {
          const scenarios = [
            { n: 0, argumentName: 'hostname', argumentValue: 'abc' },
            { n: 0, argumentName: 'endpoint', argumentValue: '' },
            { n: 0, argumentName: 'query', argumentValue: {} },
            {
              n: 0,
              argumentName: 'payload',
              argumentValue: { PaRes: 'PaRes', MD: 'MD' },
            },
            { n: 0, argumentName: 'method', argumentValue: 'post' },
            { n: 0, argumentName: 'headers', argumentValue: headers },
            { n: 0, argumentName: 'jsessionid', argumentValue: undefined },
            { n: 0, argumentName: 'nopath', argumentValue: true },

            { n: 1, argumentName: 'hostname', argumentValue: 'redirectUrl' },
            { n: 1, argumentName: 'endpoint', argumentValue: '' },
            { n: 1, argumentName: 'query', argumentValue: {} },
            { n: 1, argumentName: 'payload', argumentValue: {} },
            { n: 1, argumentName: 'method', argumentValue: 'get' },
            { n: 1, argumentName: 'headers', argumentValue: headers },
            { n: 1, argumentName: 'jsessionid', argumentValue: undefined },
            { n: 1, argumentName: 'nopath', argumentValue: true },
          ]

          scenarios.map((scenario) =>
            expect(
              utils.getRequestArgs(scenario.n)[scenario.argumentName]
            ).toEqual(scenario.argumentValue)
          )
        })
        .catch((err) => {
          throw err
        })
    })
  })

  describe('Mapping the response', () => {
    describe('Server side analyics', () => {
      beforeEach(() => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsHomeStandard }, { n: 1 })
      })

      it('should use server side analytics to log a purchase', async () => {
        await execute()
        expect(serverSideAnalytics.logPurchase).toHaveBeenCalled()
      })

      it('should not use server side analytics to log a purchase from an app', async () => {
        const mapperInputs = { ...defaults }
        mapperInputs.headers['monty-client-device-type'] = 'apps'
        const execute = utils.buildExecutor(ConfirmOrder, mapperInputs)

        await execute()
        expect(serverSideAnalytics.logPurchase).not.toHaveBeenCalled()
      })
    })

    describe('Home Standard delivery', () => {
      it('maps WCS responses for all the different scenarios associated with delivery', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsHomeStandard }, { n: 1 })

        expect.assertions(1)
        return execute().then((res) =>
          expect(res).toEqual({ body: hapiHomeStandard })
        )
      })

      it('should throw error if WCS returns error message', async () => {
        const errorMessage = 'custom error message'
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ errorMessage }, { n: 1 })

        await expect(execute()).rejects.toThrow(errorMessage)
      })

      it('should get the default error response if error but no message from WCS', async () => {
        const errorMessage = 'order confirmation: malformed response from WCS'
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ errorMessage: null }, { n: 1 })

        await expect(execute()).rejects.toThrow(errorMessage)
      })
    })

    describe('Home Express delivery', () => {
      it('maps WCS responses for all the different scenarios associated with delivery', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsHomeExpress }, { n: 1 })

        expect.assertions(1)
        return execute().then((res) =>
          expect(res).toEqual({ body: hapiHomeExpress })
        )
      })
    })

    describe('Store Standard delivery', () => {
      it('maps WCS responses for all the different scenarios associated with delivery', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsStoreStandard }, { n: 1 })

        expect.assertions(1)
        return execute().then((res) =>
          expect(res).toEqual({ body: hapiStoreStandard })
        )
      })
    })

    describe('Store Express delivery', () => {
      it('maps WCS responses for all the different scenarios associated with delivery', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsStoreExpress }, { n: 1 })

        expect.assertions(1)
        return execute().then((res) =>
          expect(res).toEqual({ body: hapiStoreExpress })
        )
      })
    })

    describe('Parcelshop delivery', () => {
      it('maps WCS responses for all the different scenarios associated with delivery', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({ body: wcsParcelshop }, { n: 1 })

        expect.assertions(1)
        return execute().then((res) =>
          expect(res).toEqual({ body: hapiParcelShop })
        )
      })
    })

    describe('Error Handling', () => {
      it('handles no paymentCallBackUrl', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=;`] })
        return execute().catch((err) => {
          expect(err.output.payload.message).toEqual(
            'Missing paymentCallBackUrl in ConfirmOrder'
          )
        })
      })

      it('throws correct error if error message passed in on redirect', () => {
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({
          body: {
            success: false,
            errorMessage: 'hello',
          },
        })

        return execute().catch((err) => {
          expect(err.output.payload.message).toEqual('hello')
        })
      })

      it('returns errorMessage on redirect', async () => {
        const errorMessage = 'hello'
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ errorMessage })

        await expect(execute()).rejects.toThrow(errorMessage)
      })

      it('returns errorMessage on paypal/mpass with the payload error message', async () => {
        const errorMessage = 'payload error message'
        const payload = {
          authProvider: 'PYPAL',
          policyId: 'policyId',
          payerId: 'PayerId',
          userApproved: 'userApproved',
          orderId: 'orderId',
          token: 'token',
          tranId: 'tran_id',
          errorMessage,
        }
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ body: { redirectURL: 'redirectUrl' } })
        utils.setWCSResponse({
          body: {
            success: false,
            errorMessage,
          },
        })

        await expect(execute({ payload })).rejects.toThrow(errorMessage)
      })

      it('returns errorMessage on paypal/mpass with the defayult error message', async () => {
        const errorMessage = 'default error message'
        const payload = {
          authProvider: 'PYPAL',
          policyId: 'policyId',
          payerId: 'PayerId',
          userApproved: 'userApproved',
          orderId: 'orderId',
          token: 'token',
          tranId: 'tran_id',
        }
        utils.setUserSession({ cookies: [`paymentCallBackUrl=abc;`] })
        utils.setWCSResponse({ success: false, errorMessage })

        await expect(execute({ payload })).rejects.toThrow(errorMessage)
      })
    })
  })
})
