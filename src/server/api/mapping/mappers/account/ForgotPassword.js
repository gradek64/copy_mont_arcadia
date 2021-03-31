import Mapper from '../../Mapper'
import Boom from 'boom'
import {
  forgotPasswordPayloadConstants,
  messageTransforms,
} from '../../constants/forgotPassword'

export default class ForgotPassword extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ResetPassword'
  }

  async mapRequestParameters() {
    // this is requried for users who has proceeded with checkout v1
    const isTemporaryUser = await this.getCookieFromStore(
      'tempUser',
      this.headers.cookie
    )

    const proceedFlow = isTemporaryUser === 'Y'
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    const { email = '' } = this.payload

    this.payload = {
      catalogId,
      storeId,
      langId,
      ...forgotPasswordPayloadConstants,
      proceedFlow,
      reset_logonId: email,
    }
  }

  mapResponseMessage(message) {
    return messageTransforms[message] || message
  }

  mapResponseError(body) {
    const errorMessage = body.message || body.errorMessage
    throw errorMessage ? Boom.badData(errorMessage) : body
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)
    return {
      success: body.success,
      message: this.mapResponseMessage(body.message),
      originalMessage: this.mapResponseMessage(body.message),
      version: '1.6',
      additionalData: [],
      validationErrors: [],
    }
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
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const forgotPasswordSpec = {
  summary:
    'Request an email that sets the password to a temporary one, allowing it to be changed',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Email for account whose password is to be changed',
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'foo@bar.com',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Email successfully requested',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example:
              'Your password has been reset successfully. A new password has been e-mailed to you and should arrive shortly.',
          },
          originalMessage: {
            type: 'string',
            example:
              'Your password has been reset successfully. A new password has been e-mailed to you and should arrive shortly.',
          },
          additionalData: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          validationErrors: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
    },
    422: {
      description: "Account doesn't exist",
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
              'There is no account with that email address in our records. If you would like to use that email address, you can create an account with the New customers section of this page.',
          },
        },
      },
    },
  },
}
