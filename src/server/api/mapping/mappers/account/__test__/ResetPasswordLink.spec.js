import Boom from 'boom'

import * as utils from '../../../__test__/utils'
import ResetPasswordLink from '../ResetPasswordLink'

jest.mock('boom')

describe('ResetPasswordLink mapper', () => {
  const wcsResponse = {
    body: {
      success: true,
      action: 'reset',
      message:
        "Thanks! We've sent you an email. It should arrive in a couple of minutes - be sure to check your junk folder just in case.",
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    utils.setUserSession([
      utils.createCookies()(utils.createJSessionIdCookie(12345)),
    ])
    utils.setWCSResponse(wcsResponse)
  })

  const email = 'foo@bar.com'
  const config = utils.getConfigByStoreCode('tsuk')

  const payloadFromMonty = {
    email,
    pageTitle: 'ShoppingBag',
    orderId: 12345,
  }

  const payloadToWCS = {
    URL: 'ResetPasswordAjaxView',
    storeId: config.siteId,
    langId: config.langId,
    catalogId: config.catalogId,
    challengeAnswer: '-',
    reset_logonId: email,
    deviceType: 'deskTop',
    proceedFlow: true,
    pageTitle: 'ShoppingBag',
    orderId: 12345,
  }

  const defaults = {
    payload: payloadFromMonty,
    method: 'post',
    query: {},
    headers: {
      cookie: 'jsession=ABCITSEASYAS123',
    },
    params: {},
  }

  const execute = utils.buildExecutor(ResetPasswordLink, defaults)

  describe('Requests to WCS', () => {
    it('should use the correct method', () => {
      execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('should use the correct endpoint', () => {
      execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ResetPassword'
      )
    })

    it('should set the payload correctly', () => {
      execute()
      expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
    })
  })

  describe('Successful responses to WCS', () => {
    it('should be mapped correctly', async () => {
      await expect(execute()).resolves.toEqual({
        body: {
          success: true,
          action: 'reset',
          message:
            "Thanks! We've sent you an email. It should arrive in a couple of minutes - be sure to check your junk folder just in case.",
        },
      })
    })
  })

  describe('successful responses from WCS with `errorCode` property on body', () => {
    beforeEach(() => {
      Boom.create.mockImplementation((status, message, data) => ({
        status,
        message,
        data,
      }))
    })

    it('should throw a 423 if wcs returns an errorCode of 2110', async () => {
      utils.setWCSResponse({
        errorCode: 2110,
        message: 'oh no not again',
      })
      await expect(execute()).rejects.toEqual({
        status: 423,
        message: 'oh no not again',
        data: {
          wcsErrorCode: 2110,
        },
      })
    })

    it('should map a successful response if the passed email does not exist', async () => {
      const message =
        'If you have entered a valid email address, you should receive a password reset email shortly.'
      const action = 'reset'

      utils.setWCSResponse({
        action,
        errorCode: '2010',
        message,
        success: false,
      })

      await expect(execute()).resolves.toEqual({
        body: {
          success: true,
          message,
          action,
          errorCode: null,
        },
      })
    })
  })

  describe('Unsuccessful responses from WCS', () => {
    it('should throw an error for an invalid email', async () => {
      Boom.badData.mockImplementation((message) => new Error(message))
      utils.setWCSResponse({
        success: 'false',
        message: 'There was no account associated with that email address.',
      })
      expect.assertions(1)
      await expect(execute()).rejects.toMatchObject(
        new Error('There was no account associated with that email address.')
      )
    })

    it('should throw for unexpected errors', async () => {
      Boom.internal.mockImplementation((message) => new Error(message))
      utils.setWCSResponse({
        errorMessage: 'An unexpected error occurred.',
      })
      await expect(execute()).rejects.toMatchObject(
        new Error('Unfortunately an error occurred. Please try again later.')
      )
    })
  })

  describe('Unsuccessful requests to WCS', () => {
    it('should throw a 422 error', async () => {
      utils.setWCSResponse(Promise.reject('WCS is down'))
      await expect(execute()).rejects.toBe('WCS is down')
    })
  })
})
