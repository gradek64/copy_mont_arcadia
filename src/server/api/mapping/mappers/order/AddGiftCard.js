import Boom from 'boom'
import { pathOr } from 'ramda'

import Mapper from '../../Mapper'
import transform from '../../transforms/giftCard'
import { isAuthenticated } from '../../utils/sessionUtils'
import { giftCardConstants } from '../../constants/giftCard'
import { canGiftCardBeRedeemed } from '../../utils/giftCardUtils'

export default class AddGiftCard extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/PPTGiftCardsManager'
  }

  async mapRequestParameters() {
    const orderId = await this.getOrderId(this.headers.cookie)
    const { catalogId, langId, siteId: storeId, brandCode } = this.storeConfig
    const { giftCardNumber, pin } = this.payload

    if (
      !['ts', 'tm', 'ms'].includes(brandCode) &&
      !canGiftCardBeRedeemed(giftCardNumber, brandCode)
    ) {
      throw Boom.badData('This card is no longer valid.')
    }

    this.payload = {
      ...giftCardConstants,
      orderId,
      catalogId,
      langId,
      storeId,
      giftCardNo: giftCardNumber,
      giftCardPinNo: pin,
      action: 'add',
      sourcePage: isAuthenticated(this.headers.cookie)
        ? 'OrderSubmitForm'
        : 'PaymentDetails',
    }
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)
    const isGuest = !isAuthenticated(this.headers.cookie)
    return transform(body, isGuest, this.storeConfig.currencySymbol)
  }

  mapWCSErrorCodes = {
    PPTGC_ERR_RES_DECLINED: 406,
    INVALID_CARD_NUMBER: 406,
    INVALID_CARD_PAN_NUMBER: 406,
    INVALID_ACCOUNT_NUMBER: 406,
    INVALID_CARD_SERIAL_NUMBER: 406,
    RETAILER_NOT_AUTHORISED: 406,
    CARD_BLOCKED: 406,
    CARD_HAS_NOT_BEEN_ACTIVATED: 406,
    CARD_EXPIRED: 406,
    INVALID_CURRENCY: 406,
    INVALID_VOUCHER_CODE: 406,
    INCORRECT_PIN: 406,
    FX_ON_PARTIAL_AUTH_NOT_SUPPORTED: 406,
    PPTGC_ERR_REQ_INVALID_ACTION: 502,
    PPTGC_ERR_REQ_DUPLICATE_CARD: 409,
    PPTGC_ERR_RES_ZERO_BALANCE: 409,
    PPTGC_ERR_RES_COMMUNICATION_ERROR: 502,
    PPTGC_ERR_RES_CHECKSUM: 406,
    PPTGC_ERR_INVALID_NUMBER: 406,
    PPTGC_ERR_INVALID_PIN: 406,
    PPTGC_ERR_RES_BALANCE_CURRENCY_NOT_ACCEPTED: 422,
  }

  mapResponseError(body = {}) {
    const { wcsErrorCode } = pathOr({}, ['data'], body)
    throw body.message && !wcsErrorCode ? Boom.badData(body.message) : body
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

export const addGiftCardSpec = {
  summary: 'Add a gift card to an order',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: '16 digit card number and 4 digit pin',
      schema: {
        type: 'object',
        properties: {
          giftCardnumber: {
            type: 'string',
            example: '1234123412341234',
          },
          pin: {
            type: 'string',
            example: '5678',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Order Summary including added gift card',
      schema: {
        type: 'object',
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
            example: '1234123412',
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
            example: false,
          },
          estimatedDelivery: {
            type: 'array',
            items: {
              type: 'string',
              example: 'Thursday Oct 4th 2019',
            },
          },
          isGuestOrder: {
            type: 'boolean',
          },
        },
      },
    },
    422: {
      description:
        'Error with gift card number/pin, or there if there was insufficient credit on the gift card.',
      schema: {
        type: 'object',
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
      },
    },
  },
}
