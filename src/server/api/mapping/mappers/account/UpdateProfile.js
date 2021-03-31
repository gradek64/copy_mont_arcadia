import Boom from 'boom'
import Mapper from '../../Mapper'
import {
  updateProfileConstants,
  logonFormConstants,
} from '../../constants/updateProfile'
import logonTransform from '../../transforms/logon'
import { authenticatedCookies } from './cookies'
import parentStoreMap from '../../../hostsConfig/store_parent_map.json'
import emailServiceStoreMap from '../../../hostsConfig/store_email_service_map.json'

export default class UpdateProfile extends Mapper {
  mapEndpoint() {
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = `${wcs}UserRegistrationUpdate`
    this.logonFormEndpoint = `${wcs}LogonForm`
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId, storeCode } = this.storeConfig
    const {
      email = '',
      firstName = '',
      lastName = '',
      title = '',
      marketingSubscription = false,
    } = this.payload

    const parentStoreCode = parentStoreMap[storeCode || 'tsuk']
    const nickName = email && `${parentStoreCode}${email}`
    const serviceID = emailServiceStoreMap[storeCode || 'tsuk']
    const subscribe = marketingSubscription ? 'YES' : 'NO'

    this.method = 'post'
    this.payload = {
      ...updateProfileConstants,
      catalogId,
      langId,
      storeId,
      tempEmail1: nickName,
      nickName,
      personTitle: title,
      firstName,
      lastName,
      logonId: email,
      origLogonId: email,
      serviceID,
      default_service_id: serviceID,
      subscribe,
    }
  }

  mapLogonFormParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    return {
      catalogId,
      langId,
      storeId,
      ...logonFormConstants,
    }
  }

  async getWCSLogonData(jsessionid = false) {
    const result = await this.sendRequestToApi(
      this.destinationHostname,
      this.logonFormEndpoint,
      this.mapLogonFormParameters(),
      {},
      'get',
      this.headers,
      jsessionid
    )
    this.logonData = result && result.body
    return this.logonData
  }

  mapResponseBody(body = {}) {
    if (body && body.pageTitle === 'LogonForm') {
      throw new Error('wcsSessionTimeout')
    }

    return logonTransform(body, false)
  }

  mapResponseError(body = {}) {
    throw body.serverErrorMessage
      ? Boom.badData([body.serverErrorMessage], [body])
      : body
  }

  async mapResponse(res) {
    try {
      if (res.body && res.body.serverErrorMessage)
        return this.mapResponseError(res.body)

      // We pass the jsessionid provided by WCS in the response instead of the one provided by the Client to make sure
      // we use the correct one also in the case of session timeout where WCS provides a new jsessionid.
      await this.getWCSLogonData(res && res.jsessionid)

      const responseBody = this.mapResponseBody(this.logonData)

      return {
        jsessionid: res.jsessionid,
        body: responseBody,
        setCookies: authenticatedCookies(),
        status: (responseBody && responseBody.errorStatusCode) || false,
      }
    } catch (err) {
      throw err
    }
  }
}

export const updateProfileSpec = {
  summary: "Update a user's name and email address",
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            example: 'Bob',
          },
          lastName: {
            type: 'string',
            example: 'Barker',
          },
          title: {
            type: 'string',
            example: 'Mr',
          },
          email: {
            type: 'string',
            example: 'foo@bar.com',
          },
          marketingSubscription: {
            type: 'boolean',
            example: true,
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
      description: 'User attempted to update profile when session expired',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          error: {
            type: 'text',
            example: 'Unprocessable Entity',
          },
          originalMessage: {
            type: 'text',
            example: 'Must be logged in to perform this action',
          },
          message: {
            type: 'text',
            example: 'Must be logged in to perform this action',
          },
        },
      },
    },
  },
}
