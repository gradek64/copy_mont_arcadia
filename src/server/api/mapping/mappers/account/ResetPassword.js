import Boom from 'boom'
import { path } from 'ramda'
import Mapper from '../../Mapper'
import { resetPasswordPayloadConstants } from '../../constants/resetPassword'
import { mapAuthenticatedResponse } from './utils'
import logonTransform from '../../transforms/logon'

export default class ResetPassword extends Mapper {
  mapRequestFormParameters() {
    this.method = 'post'
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.orderId = this.payload.orderId
    this.query = {
      storeId,
      catalogId,
      langId,
      token: this.payload.email,
      hash: decodeURIComponent(this.payload.hash), // From original WCS link
      stop_mobi: 'yes',
      CMPID: this.payload.CMPID,
    }
  }

  mapRequestFormEndpoint() {
    this.requestFormEndpoint = '/webapp/wcs/stores/servlet/ResetPasswordLink'
  }

  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ResetPassword'
  }

  mapRequestParameters() {
    this.query = {}
    const { langId, catalogId, siteId: storeId } = this.storeConfig
    this.payload = {
      ...resetPasswordPayloadConstants,
      storeId,
      catalogId,
      langId,
      pageFrom: this.orderId ? 'ShoppingBag' : '',
      logonId: path(
        ['body', 'passwordResetForm', 'logonId'],
        this.resetFormResponse
      ),
      reLogonURL: path(
        ['body', 'passwordResetForm', 'reLogonURL'],
        this.resetFormResponse
      ),
      Relogon: path(
        ['body', 'passwordResetForm', 'Relogon'],
        this.resetFormResponse
      ),
      resetPassword: path(
        ['body', 'passwordResetForm', 'resetPassword'],
        this.resetFormResponse
      ),
      logonPasswordOld: path(
        ['body', 'passwordResetForm', 'logonPasswordOld'],
        this.resetFormResponse
      ),
      nextPage: path(
        ['body', 'passwordResetForm', 'nextPage'],
        this.resetFormResponse
      ),
      logonPassword: this.payload.password,
      logonPasswordVerify: this.payload.passwordConfirm,
      URL: `OrderItemMove?page=account&URL=OrderCalculate?URL=${path(
        ['body', 'passwordResetForm', 'URL'],
        this.resetFormResponse
      )}`,
    }
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false') {
      this.mapResponseError(body)
    }

    return {
      ...logonTransform(body),
      message: body.myAccountUpdateSuccessMessage,
    }
  }

  mapResponseError(error = {}) {
    if (error.isBoom) throw error

    const errorCode = error.errorCode
    const errorMessage =
      error.message ||
      error.errorMessage1 ||
      error.errorMessage2 ||
      error.serverErrorMessage

    throw errorMessage
      ? Boom.badData(errorMessage, errorCode ? { errorCode } : {})
      : error
  }

  mapResponse(res) {
    const mappedBody = this.mapResponseBody(res.body)
    try {
      return mapAuthenticatedResponse(res, mappedBody)
    } catch (err) {
      throw Boom.badGateway(err)
    }
  }

  async execute() {
    this.mapRequestFormEndpoint()
    this.mapRequestFormParameters()

    try {
      this.resetFormResponse = await this.sendRequestToApi(
        this.destinationHostname,
        this.requestFormEndpoint,
        this.query,
        this.payload,
        'post',
        this.headers
      )
      if (
        !this.resetFormResponse.body.passwordResetForm ||
        this.resetFormResponse.body.success === 'false'
      ) {
        return this.mapResponseError(this.resetFormResponse.body)
      }

      this.mapRequestParameters()
      this.mapEndpoint()

      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method.toLowerCase(),
        this.headers,
        this.resetFormResponse.jsessionid
      )
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const resetPasswordSpec = {
  summary:
    'Reset the user password from a reset password page linked to from an email',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      type: 'string',
      schema: {
        type: 'object',
        required: ['email', 'password', 'passwordConfirm', 'hash'],
        properties: {
          email: {
            type: 'string',
            example: 'monty@desktop.com',
          },
          password: {
            type: 'string',
            example: 'test123',
          },
          passwordConfirm: {
            type: 'string',
            example: 'test123',
          },
          hash: {
            type: 'string',
            example: 'hgGRUeUADRx22d30hObimDteMy4%3D%0A',
          },
          orderId: {
            type: 'number',
            example: '7282281',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Acccount summary',
      schema: {
        type: 'object',
        properties: {
          basketItemCount: {
            type: 'number',
            example: 0,
          },
          billingDetails: {
            $ref: '#/definitions/userDetails',
          },
          creditCard: {
            type: 'object',
            example: {
              type: 'VISA',
              cardNumberHash: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
              cardNumberStar: '************1111',
              expiryMonth: '02',
              expiryYear: '2018',
            },
          },
          deliveryDetails: {
            $ref: '#/definitions/userDetails',
          },
          email: {
            type: 'string',
            example: 'monty@desktop.com',
          },
          exists: {
            type: 'boolean',
            example: true,
          },
          userTrackingId: {
            type: 'number',
            example: 2470078,
          },
        },
      },
    },
  },
}
