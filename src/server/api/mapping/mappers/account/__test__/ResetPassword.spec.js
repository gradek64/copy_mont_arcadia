import * as utils from '../../../__test__/utils'
import ResetPassword from '../ResetPassword'
import { mapAuthenticatedResponse } from '../utils'

import wcsResetPasswordLinkResponse from 'test/apiResponses/my-account/resetPassword/wcs-ResetPasswordLink.json'
import wcsResetPasswordFormResponse from 'test/apiResponses/my-account/resetPassword/wcs-ResetPassword.json'
import montyResetFormResponse from 'test/apiResponses/my-account/resetPassword/hapiMonty.json'

jest.mock('../utils', () => ({
  mapAuthenticatedResponse: jest.fn(),
}))

describe('ResetPassword Mapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    utils.setWCSResponse({ body: wcsResetPasswordLinkResponse }, { n: 0 })
    utils.setWCSResponse({ body: wcsResetPasswordFormResponse }, { n: 1 })
    utils.setUserSession([
      utils.createCookies()(utils.createJSessionIdCookie(12345)),
    ])
  })

  const email = 'foo@bar.com'
  const password = 'foobar1234'
  const passwordConfirm = 'foobar1234'
  const hash = '1234abcde'
  const CMPID = 'SERVER_4'

  const payloadFromMonty = {
    email,
    password,
    passwordConfirm,
    hash,
    CMPID,
    orderId: '12345',
  }

  const config = utils.getConfigByStoreCode('tsuk')

  const payloadToWCS = {
    storeId: config.siteId,
    catalogId: config.catalogId,
    langId: config.langId,
    pageFrom: 'ShoppingBag',
    logonId: email,
    reLogonURL: 'ChangePassword',
    Relogon: 'Update',
    resetPassword: hash,
    logonPasswordOld: hash,
    nextPage: 'MyAccount',
    logonPassword: password,
    logonPasswordVerify: passwordConfirm,
    'login.x': '108',
    'login.y': '16',
    fromOrderId: '*',
    toOrderId: '.',
    deleteIfEmpty: '*',
    continue: 1,
    createIfEmpty: 1,
    calculationUsageId: -1,
    updatePrices: 1,
    URL:
      'OrderItemMove?page=account&URL=OrderCalculate?URL=LogonForm?page=account',
  }

  const defaults = {
    method: 'post',
    endpoint: '',
    query: {},
    payload: payloadFromMonty,
    headers: '',
    params: {},
  }

  const execute = utils.buildExecutor(ResetPassword, defaults)

  describe('valid requests to ResetPasswordForm', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(0).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ResetPasswordLink'
      )
    })

    it('should have a correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(0).method).toBe('post')
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
      })
    })
  })

  describe('valid requests to ResetPassword', () => {
    it('should use the correct endpoint', async () => {
      await execute()
      expect(utils.getRequestArgs(1).endpoint).toBe(
        '/webapp/wcs/stores/servlet/ResetPassword'
      )
    })

    it('should have a correct payload', async () => {
      await execute()
      expect(utils.getRequestArgs(1).payload).toEqual(payloadToWCS)
    })

    it('should have the correct method', async () => {
      await execute()
      expect(utils.getRequestArgs(1).method).toBe('post')
    })

    it('should map the response with authentication', async () => {
      const expectedAuthMappedResp = {}
      mapAuthenticatedResponse.mockReturnValue(expectedAuthMappedResp)
      expect.assertions(3)
      await expect(execute()).resolves.toBe(expectedAuthMappedResp)
      expect(mapAuthenticatedResponse.mock.calls[0][0].body).toBe(
        wcsResetPasswordFormResponse
      )
      expect(mapAuthenticatedResponse.mock.calls[0][1]).toEqual(
        montyResetFormResponse
      )
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

    it('should contain `errorCode` only if WCS has it on the response', async () => {
      const res = {
        success: false,
        body: {
          errorCode: '.2260',
          message: 'You have already used that password, try another',
        },
      }
      const { message, errorCode } = res.body

      utils.setWCSResponse(res)

      try {
        await execute()
        throw new Error(message)
      } catch (e) {
        expect(e.data).toHaveProperty('errorCode')
        expect(e.data.errorCode).toEqual(errorCode)
        expect(e.message).toBe(message)
      }
    })

    it('should not contain `errorCode` if WCS does not have it on the response', async () => {
      const res = {
        success: false,
        body: {
          message: 'Passwords do not match',
        },
      }
      const { message } = res.body

      utils.setWCSResponse(res)

      try {
        await execute()
        throw new Error(message)
      } catch (e) {
        expect(e.data).not.toHaveProperty('errorCode')
        expect(e.message).toBe(message)
      }
    })
  })

  describe('Unsuccessful second responses from WCS', () => {
    it('should throw a 422 response', async () => {
      utils.setWCSResponse(
        { success: false, message: 'Passwords do not match' },
        { n: 1 }
      )
      await utils.expectFailedWith(execute(), {
        status: 422,
        message: 'Passwords do not match',
      })
    })
  })
})
