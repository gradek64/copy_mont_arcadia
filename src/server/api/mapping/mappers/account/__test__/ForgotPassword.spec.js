import * as utils from '../../../__test__/utils'
import ResetPasswordLink from '../ForgotPassword'

describe('ForgotPassword mapper', () => {
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
    utils.setWCSResponse(wcsResponse)
  })

  const email = 'foo@bar.com'
  const config = utils.getConfigByStoreCode('tsuk')

  const payloadFromMonty = {
    email,
  }

  const payloadToWCS = {
    storeId: config.siteId,
    langId: config.langId,
    catalogId: config.catalogId,
    reset_logonId: email,
    challengeAnswer: '-',
    URL: 'ResetPasswordAjaxView',
    state: 'passwdconfirm',
    proceedFlow: false,
  }

  const defaults = {
    payload: payloadFromMonty,
    method: 'post',
    query: {},
    headers: '',
    params: {},
    getCookieFromStore: () => Promise.resolve(null),
  }

  const execute = utils.buildExecutor(ResetPasswordLink, defaults)

  describe('Requests to WCS', () => {
    it('should use the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
    })

    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ResetPassword'
      )
    })

    it('should set the payload correctly', async () => {
      await execute()
      expect(utils.getRequestArgs(0).payload).toEqual(payloadToWCS)
    })
  })

  describe('Successful requests to WCS', () => {
    it('should be mapped correctly', async () => {
      await expect(execute()).resolves.toEqual({
        body: {
          success: true,
          additionalData: [],
          validationErrors: [],
          message:
            'Your password has been reset successfully. A new password has been e-mailed to you and should arrive shortly.',
          originalMessage:
            'Your password has been reset successfully. A new password has been e-mailed to you and should arrive shortly.',
          version: '1.6',
        },
      })
    })
  })

  describe('Unsuccessful requests to WCS', () => {
    it('should throw a 422 error', async () => {
      utils.setWCSResponse(Promise.reject('WCS is down'))
      await expect(execute()).rejects.toBe('WCS is down')
    })
  })

  describe('Unsuccessful responses from WCS', () => {
    it('should throw a 422 error', async () => {
      utils.setWCSResponse({
        success: 'false',
        message: 'There was no account associated with that email address.',
      })
      await expect(execute()).rejects.toMatchObject({
        output: {
          payload: {
            statusCode: 422,
            message: 'There was no account associated with that email address.',
          },
        },
      })
    })
  })
})
