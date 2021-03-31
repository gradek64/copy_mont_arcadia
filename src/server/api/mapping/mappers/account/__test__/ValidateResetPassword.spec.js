import * as utils from '../../../__test__/utils'
import ValidateResetPassword from '../ValidateResetPassword'
import wcsResetPasswordValidateLinkResponse from 'test/apiResponses/my-account/resetPassword/wcs-ResetPasswordValidateLink.json'

describe('ValidateResetPassword Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    utils.setWCSResponse({ body: wcsResetPasswordValidateLinkResponse })
    utils.setUserSession([
      utils.createCookies()(utils.createJSessionIdCookie(12345)),
    ])
  })

  const email = 'foo@bar.com'
  const hash = '1234abcde'
  const CMPID = 'SERVER_4'
  const payloadFromMonty = {
    email,
    hash,
    CMPID,
    orderId: '12345',
  }

  const config = utils.getConfigByStoreCode('tsuk')

  const defaults = { payload: payloadFromMonty }

  const execute = utils.buildExecutor(ValidateResetPassword, defaults)

  describe('valid requests to ResetPasswordForm', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ResetPasswordLink'
      )
    })

    it('should have a correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('get')
    })

    it('should have a correct query', async () => {
      await execute()
      expect(utils.getRequestArgs(0).query).toEqual({
        storeId: config.siteId,
        catalogId: config.catalogId,
        langId: config.langId,
        token: email,
        hash,
        stop_mobi: 'yes',
        CMPID,
        validateLink: true,
      })
    })
  })

  describe('Unsuccessful requests to WCS', () => {
    it('should throw an error', async () => {
      utils.setWCSResponse(Promise.reject('WCS error'))
      await expect(execute()).rejects.toBe('WCS error')
    })
  })

  describe('Unsuccessful initial responses from WCS', () => {
    it('should throw a 422 response', async () => {
      utils.setWCSResponse({ success: false, message: 'Invalid hash key' })
      await utils.expectFailedWith(execute(), {
        status: 422,
        message: 'Invalid hash key',
      })
    })
  })
})
