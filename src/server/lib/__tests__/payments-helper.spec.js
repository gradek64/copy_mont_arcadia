import deepFreeze from 'deep-freeze'
import paymentsHelper from '../payments-helper'

describe('paymentHelper', () => {
  beforeEach(() => jest.resetAllMocks())
  const mockQuery = deepFreeze({
    catalogId: '1234',
  })
  const mockUrl = deepFreeze({
    search: 'foo',
  })

  describe('with payments with no redirection - /order-complete resolved client-side', () => {
    it('should return an orderPayload object that includes the orderId if the query contains orderId and noRedirectionFromPaymentGateway=true parameters', () => {
      const orderId = '123'
      const hostname = 'example.com'
      const ga = '123.456'
      const mockRequest = {
        query: {
          orderId,
          noRedirectionFromPaymentGateway: 'true',
          ga,
        },
        info: {
          hostname,
        },
      }

      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({ orderId, hostname, ga })
    })
  })

  describe('with card payments that need redirection - /order-complete resolved server-side', () => {
    it("should return an orderPayload object when the request object's payload is correct for a visa payment", () => {
      const hostname = 'test.example.com'
      const md = 'testmd'
      const paRes = 'testpares'
      const orderId = '123'
      const mockRequest = {
        url: 'test',
        payload: {
          MD: md,
          PaRes: paRes,
          orderId,
        },
        query: {},
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        authProvider: 'VBV',
        hostname,
        md,
        orderId,
        paRes,
      })
    })

    it("should return an orderPayload object when the request object's query is correct for a visa payment", () => {
      const hostname = 'test.example.com'
      const md = 'testmd'
      const paRes = 'testpares'
      const orderId = '123'
      const mockRequest = {
        url: 'test',
        payload: {},
        query: {
          MD: md,
          PaRes: paRes,
          orderId,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        authProvider: 'VBV',
        hostname,
        md,
        orderId,
        paRes,
      })
    })
  })

  describe('with klarna payment', () => {
    it("should return an orderPayload object when the request object's query is correct for a klarna payment", () => {
      const orderId = '12345'
      const mockRequest = {
        url: {},
        payload: {},
        query: {
          klarnaOrderId: orderId,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        authProvider: 'KLRNA',
        order: orderId,
      })
    })
  })

  describe('with Paypal payment', () => {
    it("should return an orderPayload object when the request object's query is correct for a paypal payment", () => {
      const hostname = 'test.example.com'
      const orderId = '12345'
      const policyId = '56789'
      const token = 'testToken'
      const authProvider = 'PYPAL'
      const mockRequest = {
        url: {
          search: `paymentMethod=${authProvider}/orderId=${orderId}&`,
        },
        payload: {},
        query: {
          policyId,
          payerId: 'testPayer',
          userApproved: true,
          orderId,
          token,
          tranId: 'testTransaction',
          authProvider,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        authProvider,
        hostname,
        orderId,
        policyId,
        token,
        userApproved: true,
      })
    })
  })

  describe('with AliPay - ChinaUnion - iDeal - Sofort payments', () => {
    it("should return an orderPayload object when the request object's query is correct for a AliPay payment", () => {
      const hostname = 'test.example.com'
      const orderId = '9504519'
      const transId = '865615'
      const authProvider = 'ALIPY'
      const mockRequest = {
        url: {
          search: `paymentMethod=${authProvider}/.../webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=${orderId}&`,
        },
        query: {
          catalogId: '33057',
          dummy: '',
          ga: 'GA1.2.2005300592.1561126638',
          langId: '-1',
          mac: '67d8551e502648282f9820734cba2709',
          notifyOrderSubmitted: '0',
          notifyShopper: '0',
          orderId,
          orderKey: 'ARCADIA^TSHOPECOMGBP^9504519_TS_UK_CN_1561134216708',
          paymentAmount: '2595',
          paymentCurrency: 'GBP',
          paymentMethod: `${authProvider}/https://ts-tst1.tst.digital.arcadiagroup.co.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?userApproved=1`,
          paymentStatus: 'AUTHORISED',
          policyId: '25091',
          storeId: '12556',
          tran_id: transId,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        ...mockRequest.query,
        hostname,
        orderId,
        transId,
        authProvider,
      })
    })

    it("should return an orderPayload object when the request object's query is correct for a China Union Payment", () => {
      const hostname = 'test.example.com'
      const orderId = '9507002'
      const transId = '866379'
      const authProvider = 'CUPAY'
      const mockRequest = {
        url: {
          search: `paymentMethod=${authProvider}/.../webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=${orderId}&`,
        },
        query: {
          catalogId: '33057',
          dummy: '',
          ga: 'GA1.2.2005300592.1561126638',
          langId: '-1',
          mac: '46ef8c3e0710fdd88d6a2b47d3d0fc8f',
          notifyOrderSubmitted: '0',
          notifyShopper: '0',
          orderId,
          orderKey: 'ARCADIA^TSHOPECOMGBP^9507002_TS_UK_CN_1561388162604',
          paymentAmount: '2595',
          paymentCurrency: 'GBP',
          paymentMethod: `${authProvider}/https://ts-tst1.tst.digital.arcadiagroup.co.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?userApproved=1`,
          paymentStatus: 'AUTHORISED',
          policyId: '25092',
          storeId: '12556',
          tran_id: transId,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        ...mockRequest.query,
        hostname,
        orderId,
        transId,
        authProvider,
      })
    })

    it("should return an orderPayload object when the request object's query is correct for a Sofort payment", () => {
      const hostname = 'test.example.com'
      const orderId = '9507012'
      const transId = '866385'
      const authProvider = 'SOFRT'
      const mockRequest = {
        url: {
          search: `paymentMethod=${authProvider}/.../webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=${orderId}&`,
        },
        query: {
          catalogId: '34058',
          dummy: '',
          ga: 'GA1.2.2005300592.1561126638',
          langId: '-1',
          mac: '8d9b0ed4e932f5b5a2186533da19d655',
          notifyOrderSubmitted: '0',
          notifyShopper: '0',
          orderId,
          orderKey: 'ARCADIA^TSHOPECOMV1EUR^9507012_TS_EU_BE_1561389689643',
          paymentAmount: '3500',
          paymentCurrency: 'EUR',
          paymentMethod: `${authProvider}/https://tseu-tst1.tst.digital.arcadiagroup.co.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?userApproved=1`,
          paymentStatus: 'AUTHORISED',
          policyId: '26493',
          storeId: '13058',
          tran_id: transId,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        ...mockRequest.query,
        hostname,
        orderId,
        transId,
        authProvider,
      })
    })

    it("should return an orderPayload object when the request object's query is correct for an iDeal payment", () => {
      const hostname = 'test.example.com'
      const orderId = '9507088'
      const transId = '866409'
      const authProvider = 'IDEAL'
      const mockRequest = {
        url: {
          search: `paymentMethod=${authProvider}/.../webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=${orderId}&`,
        },
        query: {
          catalogId: '34058',
          dummy: '',
          ga: 'GA1.2.2005300592.1561126638',
          langId: '-1',
          mac: '9484d392993550fea5b530eabeeba569',
          notifyOrderSubmitted: '0',
          notifyShopper: '0',
          orderId,
          orderKey: 'ARCADIA^TSHOPECOMV3EUR^9507088_TS_EU_NL_1561390125238',
          paymentAmount: '3500',
          paymentCurrency: 'EUR',
          paymentMethod: `${authProvider}/https://tseu-tst1.tst.digital.arcadiagroup.co.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?userApproved=1`,
          paymentStatus: 'AUTHORISED',
          policyId: '26494',
          storeId: '13058',
          tran_id: transId,
        },
        info: {
          hostname,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual({
        ...mockRequest.query,
        hostname,
        orderId,
        transId,
        authProvider,
      })
    })
  })

  // @NOTE needs refactoring
  describe('Error fallbacks', () => {
    it('has a query without orderId, goes to error case without exception', () => {
      const mockRequest = {
        url: mockUrl,
        payload: undefined,
        query: { ...mockQuery, orderId: undefined },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual(false)
    })

    it('has a query without paymentMethod, goes to error case without exception', () => {
      const mockRequest = {
        url: mockUrl,
        payload: undefined,
        query: { ...mockQuery, paymentMethod: undefined },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual(false)
    })

    it('returns false when the query does not contain orderId', () => {
      const mockRequest = {
        url: 'http://whatever',
        query: {
          noRedirectionFromPaymentGateway: 'true',
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual(false)
    })

    it('returns false when the query does not contain noRedirectionFromPaymentGateway', () => {
      const mockRequest = {
        url: 'http://whatever',
        query: {
          orderId: 123,
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual(false)
    })

    it('returns false when the query parameter noRedirectionFromPaymentGateway is not set to "true"', () => {
      const mockRequest = {
        url: 'http://whatever',
        query: {
          orderId: 123,
          noRedirectionFromPaymentGateway: 'whatever',
        },
      }
      const orderPayload = paymentsHelper(mockRequest)
      expect(orderPayload).toEqual(false)
    })
  })
})
