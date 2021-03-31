import Boom from 'boom'
import Mapper from '../../Mapper'
import transform from '../../transforms/logon'
import { mapAuthenticatedResponse } from './utils'
import { loginQueryConstants } from '../../constants/logon'

export default class Logon extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = `/webapp/wcs/stores/servlet/Logon`
  }

  async mapRequestParameters() {
    // return 400 bad request if no payload is provided
    if (!this.payload || Object.keys(this.payload).length === 0) {
      throw Boom.badRequest('Payload is required')
    }

    // this is requried for users who has proceeded with checkout v1
    const isTemporaryUser = await this.getCookieFromStore(
      'tempUser',
      this.headers.cookie
    )

    const proceedWithMerge = isTemporaryUser === 'Y' ? 'Y' : ''

    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const logonFormUrl = `LogonForm?langId=${langId}&storeId=${storeId}&catalogId=${catalogId}&new=Y&returnPage=&personalizedCatalog=false&reLogonURL=LogonForm`

    this.payload = {
      ...loginQueryConstants,
      langId,
      catalogId,
      storeId,
      URL: 'OrderItemMove?page=account&URL=OrderCalculate?URL=LogonAjaxView',
      redirectURL: logonFormUrl,
      reLogonURL: 'LogonAjaxView',
      logonPassword: this.payload.password,
      logonId: this.payload.username,
      rememberMe: !!this.payload.rememberMe, // assume false if rememberMe is not received
      proceedWithMerge,
      appId: this.payload.appId,
      userToken: this.payload.userToken,
      userId: this.payload.userId,
    }
  }

  mapResponseBody(body, jsessionid = false) {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    // !!! Before to add more error scenarios handling based on the "body" make sure you
    // understand that the Logon response could be of any type (GetCurrentTimeView response where body is a string, OrderSummary response, ...).
    // This is due to the session timeout handling on WCS side. WCS after a request failed for because of
    // session timeout, let's say a plp, will try the same plp after the User attempts to login again and
    // return the plp response for the Logon request.

    if (body.loginSuccess === false) {
      throw Boom.badData(
        body.message || 'Unexpected error response while trying to login'
      )
    }

    if (body.passwordResetForm && body.passwordResetForm.logonId) {
      // In this scenario the User used the Forgotten Password functionality, received the email with the new password and is trying to
      // login with the new password. WCS does not reply normally (no account response) but with a response containing passwordResetForm property.
      // For this kind of response from WCS we return a particular response which will trigger on the Client the redirection to the User to the
      // change password page where the User will update the password with the desired one.
      // We will return the same kind of object as scrApi: {"email":"abco@abc.com","isPwdReset":true,"exists":true}

      return Promise.resolve({
        email: this.payload && this.payload.logonId,
        isPwdReset: true,
        exists: true,
      })
    }

    const redirect = `LogonForm?langId=${langId}&storeId=${storeId}&catalogId=${catalogId}&new=Y&returnPage=&personalizedCatalog=false&reLogonURL=LogonForm`

    return this.sendRequestToApi(
      this.destinationHostname,
      `/webapp/wcs/stores/servlet/${redirect}`,
      {},
      {},
      'get',
      this.headers,
      jsessionid,
      true
    )
      .then((res) => {
        return transform(res && res.body, true)
      })
      .catch((err) => {
        throw Boom.badGateway(err)
      })
  }

  mapWCSErrorCodes = {
    2030: 401,
    2301: 403,
    2110: 423,
  }

  mapResponseError(error) {
    throw error.errorMessage1
      ? Boom.badData([error.errorMessage1], [error])
      : error
  }

  mapResponse(res) {
    // check if optimized response is returned
    if (res.body.isAccountResponse) {
      const body = transform(res.body, true)
      return mapAuthenticatedResponse(res, {
        ...body,
        userToken: res.body.userToken,
        userId: res.body.userId,
      })
    }
    // map old response
    return this.mapResponseBody(res.body, res.jsessionid)
      .then((body) =>
        mapAuthenticatedResponse(res, {
          ...body,
          userToken: res.body.userToken,
          userId: res.body.userId,
        })
      )
      .catch((err) => {
        throw Boom.badGateway(err)
      })
  }

  async execute() {
    await this.mapRequestParameters()
    this.mapEndpoint()
    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method,
        this.headers
      )
      this.mapErrorCode(res)
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const logonSpec = {
  summary: 'Log on an authenticated user',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Logon credentials',
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            example: 'monty@desktop.com',
          },
          password: {
            type: 'string',
            example: 'passw0rd',
          },
          rememberMe: {
            type: 'boolean',
            example: false,
          },
          appId: {
            type: 'string',
            description:
              'Only required for native app consumers to start persistent auth',
          },
          userToken: {
            type: 'string',
            description:
              'Only required for native app consumers to start persistent auth',
          },
          userId: {
            type: 'number',
            description:
              'Only required for native app consumers to start persistent auth',
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
      headers: {
        'set-cookie': {
          type: 'string',
          description:
            '1. `authenticated` cookie set to `yes` when the user has successfully authenticated',
        },
      },
    },
    401: {
      description:
        'Invalid authentication attempt due to wrong username/password combo',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 401,
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          message: {
            type: 'string',
            example:
              'The email address or password you entered has not been found. Please enter them again.',
          },
          wcsErrorCode: {
            type: 'string',
            example: '2030',
          },
        },
      },
    },
    403: {
      description:
        'When a user fails to authenticate a number of times then a 30s waiting period between attempts is introduced',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 403,
          },
          error: {
            type: 'string',
            example: 'Forbidden',
          },
          message: {
            type: 'string',
            example:
              'Please wait 30 seconds before attempting to log in again.',
          },
          wcsErrorCode: {
            type: 'string',
            example: '2301',
          },
        },
      },
    },
    423: {
      description:
        'Too many invalid authentication attempts causing the account to be locked',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 423,
          },
          error: {
            type: 'string',
            example: 'Locked',
          },
          message: {
            type: 'string',
            example:
              'Due to unsuccessful password attempts, you will be unable to logon. Please contact Customer Services to unlock your account.',
          },
          wcsErrorCode: {
            type: 'string',
            example: '2110',
          },
        },
      },
    },
    422: {
      description: 'Authentication failure',
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
              'The email address or password you entered has not been found. Please enter them again.',
          },
        },
      },
    },
  },
}
