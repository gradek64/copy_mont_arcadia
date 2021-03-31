import Boom from 'boom'
import Mapper from '../../Mapper'

/*
 * getPrePaymentConfig is an endpoint for obtaining the BIN and JWT needed
 * for making a DDC form post at the start of the payment process.
 * 
 * It also obtains the DDC URL that corresponds with the WCS environment,
 * for example sandbox or production.
 *
 * BIN = Bank Identification Number, the first six digits of a bank card
 *       helpful in identifying the brand, issuing bank, and other
 *       high level details of the card.
 *
 * JWT = JSON Web Token, signed and/or encrypted data useful for
 *       authorisation and information exchange.
 *
 * DDC = Device Data Collection, a mechanism for determining the client
 *       device, its capabilities and characteristics.
 */
export default class PrePaymentConfig extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/getPrePaymentConfig'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    const { orderId } = this.payload || {}

    this.method = 'post'

    this.query = {
      langId,
      storeId,
      catalogId,
    }

    if (orderId !== undefined) {
      this.payload = {
        orderId,
      }
    }
  }

  mapResponseBody(body) {
    return { body }
  }

  execute() {
    this.mapRequestParameters()
    this.mapEndpoint()
    return this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      this.query,
      this.payload,
      this.method,
      this.headers,
      undefined,
      true
    )
      .then((response) => {
        if (!response || !response.body) {
          throw Boom.create(
            502,
            'PSD2 pre-payment config: malformed response from WCS'
          )
        } else if (response.body.errorMessageKey === '_ERR_USER_AUTHORITY') {
          throw Boom.create(403, response.body.errorMessage)
        } else if (response.body.errorMessageKey) {
          throw Boom.create(
            502,
            response.body.errorMessage || 'PSD2 Pre-Payment Config Error'
          )
        }

        return this.mapResponseBody(response.body)
      })
      .catch((apiResponseError) => {
        return this.mapResponseError(apiResponseError)
      })
  }
}

export const prePaymentConfigSpec = {
  summary:
    'Obtains the BIN, JWT, and URL needed for making a DDC form post at the start of the payment process.',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description:
        'Note: Could become mandatory with further phases of PSD2 implementation',
      schema: {
        type: 'object',
        properties: {
          orderId: {
            required: false,
            type: 'integer',
          },
        },
      },
    },
    {
      name: 'langId',
      type: 'integer',
      in: 'query',
      required: false,
    },
    {
      name: 'storeId',
      type: 'integer',
      in: 'query',
      required: true,
    },
    {
      name: 'catalogId',
      type: 'integer',
      in: 'query',
      required: true,
    },
  ],
  responses: {
    200: {
      description: 'BIN, JWT, and URL needed for DDC form.',
      schema: {
        $ref: '#/definitions/prePaymentConfig',
      },
    },
  },
}
