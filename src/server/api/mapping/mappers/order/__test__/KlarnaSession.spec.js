import * as utils from '../../../__test__/utils'
import KlarnaSession from '../KlarnaSession'
import wcsCreateKlarnaSession from 'test/apiResponses/orders/wcs-createKlarnaSession.json'
import wcsUpdateKlarnaSession from 'test/apiResponses/orders/wcs-updateKlarnaSession.json'
import montyUpdateKlarnaSession from 'test/apiResponses/orders/hapiMonty-updateKlarnaSession.json'
import { klarnaCookies } from '../cookies/index'

describe('KlarnaSession Mapper', () => {
  const orderId = '345345345'

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  const payloadFromMonty = {
    orderId,
  }

  const updateSessionCookies = 'klarnaSessionId=foo; klarnaClientToken=bar;'

  const defaults = {
    method: 'post',
    query: {},
    payload: payloadFromMonty,
    endpoint: '',
    headers: {},
  }

  const createQueryToWCS = {
    apiMethod: 'payments',
    orderId,
    requestType: 'create_session',
  }

  const updateQueryToWCS = {
    apiMethod: 'payments',
    orderId,
    requestType: 'update_session',
  }

  const execute = utils.buildExecutor(KlarnaSession, defaults)

  describe('All requests', () => {
    it('should use the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/KlarnaAjaxView'
      )
    })

    it('should use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should not have a payload', () => {
      execute()
      expect(utils.getRequestArgs(0).payload).toEqual({})
    })
  })

  describe('Requests to create a session (i.e. no cookies)', () => {
    it('should have the correct query', () => {
      execute()
      expect(utils.getRequestArgs(0).query).toEqual(createQueryToWCS)
    })
  })

  describe('Requests to update a session (i.e. with cookies)', () => {
    it('should have the correct query', () => {
      execute({
        headers: {
          cookie: updateSessionCookies,
        },
      })
      expect(utils.getRequestArgs(0).query).toEqual(updateQueryToWCS)
    })
  })

  describe('Successful responses from creating a session', () => {
    it('should be returned correctly, and set correct cookies', async () => {
      utils.setWCSResponse({ body: wcsCreateKlarnaSession })
      await expect(execute()).resolves.toEqual({
        body: {
          sessionId: wcsCreateKlarnaSession.sessionId,
          clientToken: wcsCreateKlarnaSession.clientToken,
          paymentMethodCategories:
            wcsCreateKlarnaSession.payment_method_categories,
        },
        setCookies: klarnaCookies(wcsCreateKlarnaSession),
      })
    })
  })

  describe('Successful responses from updating a session', () => {
    it('should be returned correctly, without setting cookies ', async () => {
      utils.setWCSResponse({ body: wcsUpdateKlarnaSession })
      await expect(
        execute({
          headers: {
            cookie: updateSessionCookies,
          },
          body: montyUpdateKlarnaSession,
        })
      ).resolves.toEqual({
        body: {
          sessionId: montyUpdateKlarnaSession.sessionId,
          clientToken: montyUpdateKlarnaSession.clientToken,
          paymentMethodCategories:
            montyUpdateKlarnaSession.payment_method_categories,
        },
      })
    })
  })

  describe('Unsuccessful responses', () => {
    it('should throw a 422 error', async () => {
      utils.setWCSResponse({
        error: 'Invalid orderId',
      })
      await expect(execute()).rejects.toMatchObject({
        output: {
          payload: {
            statusCode: 422,
            message: 'Invalid orderId',
          },
        },
      })
    })
  })
})
