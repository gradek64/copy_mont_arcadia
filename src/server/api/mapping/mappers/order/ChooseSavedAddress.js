import Boom from 'boom'
import Mapper from '../../Mapper'
import transform from '../../transforms/orderSummary'

export default class ChooseSavedAddress extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ProcessDeliveryDetails'
  }

  async mapRequestParameters() {
    this.method = 'post'

    if (!this.payload.addressId) throw Boom.badData('Missing addressId')

    const { langId, catalogId, siteId: storeId } = this.storeConfig
    const orderId = await this.getOrderId(this.headers.cookie)

    this.payload = {
      storeId,
      catalogId,
      langId,
      orderId,
      savedAddress: this.payload.addressId,
      sourcePage: 'OrderSubmitForm',
      status: 'P',
      errorViewName: 'UserRegistrationForm',
      actionType: 'updateOrderItemsOnly',
      deliveryOptionType: 'H',
    }
  }

  mapResponseBody(body = {}) {
    if (!body.orderSummary) {
      this.mapResponseError(body)
    }
    return transform(body.orderSummary, false, this.storeConfig.currencySymbol)
  }

  mapResponseError(body) {
    throw body.serverErrorMessage ? Boom.badData(body.serverErrorMessage) : body
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

export const chooseSavedAddressSpec = {
  summary: "Select one of a registered user's saved addresses",
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description: 'Unique address identifier for selected address',
      schema: {
        type: 'object',
        properties: {
          addressId: {
            type: 'integer',
            example: 12345,
          },
          responseType: {
            type: 'string',
            required: false,
            example: 'orderSummary',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'All Saved Addresses',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Address updated',
          },
          savedAddresses: {
            $ref: '#/definitions/savedAddresses',
          },
          deliveryDetails: {
            $ref: '#/definitions/userDetails',
          },
        },
      },
    },
  },
}
