import Boom from 'boom'

import Mapper from '../../Mapper'
import logonTransform from '../../transforms/logon'
import {
  changePasswordPayloadConstants,
  logonFormConstants,
} from '../../constants/changePassword'
import parentStoreMap from '../../../hostsConfig/store_parent_map.json'

export default class ChangePassword extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ResetPassword'
  }

  validateParameters() {
    const { appId, userId, userToken } = this.payload
    if (appId && typeof appId !== 'string') {
      throw Boom.badData(
        `Incorrect parameter type provided for 'appId'. Expected string, received ${typeof appId}`
      )
    }
    if (userToken && typeof userToken !== 'string') {
      throw Boom.badData(
        `Incorrect parameter type provided for 'userToken'. Expected string, received ${typeof userToken}`
      )
    }
    if (appId && userToken && !userId) {
      throw Boom.badData(
        `userId is required when userToken and appId are present in request`
      )
    }
  }

  mapRequestParameters() {
    this.method = 'post'
    const { catalogId, siteId: storeId, storeCode, langId } = this.storeConfig
    const {
      emailAddress = '',
      oldPassword = '',
      newPassword = '',
      newPasswordConfirm = '',
      appId,
      userId,
      userToken,
    } = this.payload

    this.validateParameters()
    const parentStoreCode = parentStoreMap[storeCode] || 'tsuk'

    const logonId = emailAddress && `${parentStoreCode}${emailAddress}`

    this.payload = {
      ...changePasswordPayloadConstants,
      storeId,
      catalogId,
      langId,
      logonId,
      logonPasswordOld: oldPassword,
      logonPassword: newPassword,
      logonPasswordVerify: newPasswordConfirm,
      appId,
      userId,
      userToken,
    }
  }

  mapLogonFormParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    const { appId, userId, userToken } = this.payload
    return {
      catalogId,
      langId,
      storeId,
      ...(appId &&
        userId &&
        userToken && {
          appId,
          userId,
          userToken,
        }),
      ...logonFormConstants,
    }
  }

  async getWCSLogonData(jsessionid) {
    const result = await this.sendRequestToApi(
      this.destinationHostname,
      '/webapp/wcs/stores/servlet/LogonForm',
      this.mapLogonFormParameters(),
      {},
      'get',
      this.headers,
      jsessionid
    )
    this.logonData = result && result.body
    return this.logonData
  }

  mapResponseError(body = {}) {
    throw body.serverErrorMessage
      ? Boom.badData([body.serverErrorMessage], [body])
      : body
  }

  mapResponseBody(body = {}) {
    return logonTransform(body, false)
  }

  async mapResponse(res) {
    try {
      if (res.body && res.body.serverErrorMessage)
        return this.mapResponseError(res.body)
      await this.getWCSLogonData(res.jsessionid)
      return {
        jsessionid: res.jsessionid,
        body: this.mapResponseBody(this.logonData),
      }
    } catch (err) {
      this.mapResponseError(err)
    }
  }
}

export const changePasswordSpec = {
  summary: "Change a registered user's password while they are logged in",
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Password change form data',
      schema: {
        type: 'object',
        properties: {
          emailAddress: {
            type: 'string',
            example: 'foo@bar.com',
          },
          oldPassword: {
            type: 'string',
            example: 'passw0rd',
          },
          newPassword: {
            type: 'string',
            example: 'muchStr0ngerPassw0rd',
          },
          newPasswordConfirm: {
            type: 'string',
            example: 'muchStr0ngerPassw0rd',
          },
          appId: {
            type: 'string',
            description: 'App id assigned to a native app',
          },
          userId: {
            type: 'string',
            description: 'User id assigned to a native app session',
          },
          userToken: {
            type: 'string',
            description: 'Token assigned to a native app session',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Account details object',
      schema: {
        $ref: '#/definitions/account',
      },
    },
    422: {
      description: 'Reset password failure',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          error: {
            type: 'string',
            example: 'Unprocessable Entity',
          },
          message: {
            type: 'string',
            example:
              'Please enter your correct password in current password field.',
          },
        },
      },
    },
  },
}
