import Boom from 'boom'
import { pathOr } from 'ramda'

import Mapper from '../../Mapper'

export default class ResetPasswordLink extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ResetPassword'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    const { email = '', pageTitle, orderId } = this.payload

    this.payload = {
      catalogId,
      storeId,
      langId,
      pageTitle,
      orderId,
      URL: 'ResetPasswordAjaxView',
      challengeAnswer: '-',
      reset_logonId: email,
      deviceType: 'deskTop',
      proceedFlow: true,
    }

    // Cookies are no longer removed in order to keep the link to the previous session
    // Please refer to DES-4908 Jira Ticket
  }

  mapWCSErrorCodes = {
    2110: 423,
  }

  mapWCSErrorToSuccessResponse = ['2010']

  mapResponseError(body) {
    if (body.errorMessage) {
      // An unexpected error has occurred within WCS. We have logged this issue
      // with service desk. It appears the request for the password reset link
      // randomly fails for some user accounts. The body response contains an
      // "errorMessage" prop for this case so we will throw an internal error
      // when it occurs to avoid confusing users with inappropriate error
      // messages from WCS.
      throw Boom.internal(
        'Unfortunately an error occurred. Please try again later.',
        body
      )
    } else {
      const { wcsErrorCode } = pathOr({}, ['data'], body)
      throw body.message && !wcsErrorCode ? Boom.badData(body.message) : body
    }
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)
    return body
  }
}

export const resetPasswordLinkSpec = {
  summary:
    'Request a password reset email containing a link to reset the password',
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
      description: 'New account summary',
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
              "Thanks! We've sent you an email. It should arrive in a couple of minutes - be sure to check your junk folder just in case.",
          },
        },
      },
    },
  },
}
