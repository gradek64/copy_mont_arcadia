import Mapper from '../../Mapper'
import transform from '../../transforms/giftCard'
import Boom from 'boom'
import { giftCardConstants } from '../../constants/giftCard'
import { isAuthenticated } from '../../utils/sessionUtils'

export default class DeleteGiftCard extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/PPTGiftCardsManager'
  }

  async mapRequestParameters() {
    const orderId = await this.getOrderId(this.headers.cookie)
    const { langId, catalogId, siteId: storeId } = this.storeConfig
    this.payload = {
      ...giftCardConstants,
      langId,
      catalogId,
      storeId,
      orderId,
      identifier: this.query.giftCardId,
      action: 'remove',
      sourcePage: isAuthenticated(this.headers.cookie)
        ? 'OrderSubmitForm'
        : 'PaymentDetails',
    }
    this.method = 'post'
    this.query = {}
  }

  mapResponseBody(body) {
    const isGuest = !isAuthenticated(this.headers.cookie)
    return transform(body, isGuest, this.storeConfig.currencySymbol)
  }

  mapResponseError(body = {}) {
    throw body.message ? Boom.badData(body.message) : body
  }

  mapResponse(res) {
    if (!res.body.success || res.body.success === 'false')
      return this.mapResponseError(res.body)
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
    }
  }

  async execute() {
    await this.mapRequestParameters()
    this.mapEndpoint()
    try {
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        {},
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

export const deleteGiftCardSpec = {
  summary: 'Remove a gift card from an order it was added to',
  parameters: [
    {
      name: 'giftCardId',
      in: 'query',
      description:
        'An internal gift card identifier that is returned from the server when the gift card is added',
      required: true,
      example: '123456',
    },
  ],
  responses: {
    200: {
      description: 'Order Summary including any other added gift cards',
      properties: {
        basket: {
          $ref: '#/definitions/basket',
        },
        deliveryLocations: {
          $ref: '#/definitions/deliveryLocations',
        },
        discounts: {
          $ref: '#/definitions/discounts',
        },
        giftCards: {
          $ref: '#/definitions/giftCards',
        },
        deliveryInstructions: {
          type: 'string',
          example: 'Leave on my front door please',
        },
        smsMobileNumber: {
          type: 'string',
        },
        shippingCountry: {
          type: 'string',
          example: 'United Kingdom',
        },
        savedAddresses: {
          $ref: '#/definitions/savedAddresses',
        },
        ageVerificationDeliveryConfirmationRequired: {
          type: 'boolean',
        },
        estimatedDelivery: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        isGuestOrder: {
          type: 'boolean',
        },
      },
    },
    422: {
      description: 'Error if the gift card identifier is incorrect',
      properties: {
        statusCode: {
          description: 'Error status code',
          type: 'number',
        },
        error: {
          description: 'Error type',
          type: 'string',
        },
        message: {
          description: 'Error message that is displayed to the user',
          type: 'string',
        },
      },
      example: {
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'The identifier was invalid',
      },
    },
  },
}
