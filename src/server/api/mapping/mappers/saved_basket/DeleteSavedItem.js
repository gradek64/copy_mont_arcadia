import Boom from 'boom'
import Mapper from '../../Mapper'

export default class DeleteSavedItem extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/InterestItemDelete'
  }

  mapRequestParameters() {
    const { langId, catalogId, siteId: storeId } = this.storeConfig
    const { catEntryId, productId } = this.payload
    if (!productId) {
      throw Boom.badData('Invalid productId')
    }
    if (!catEntryId) {
      throw Boom.badData('Invalid catEntryId')
    }

    this.payload = {
      updatePrices: 1,
      calculationUsageId: -1,
      URL: 'InterestItemsRemoveItemAjaxView',
      calculateOrder: 1,
      langId,
      catalogId,
      storeId,
      orderId: this.orderId,
      productId,
      catEntryId,
    }
    this.method = 'post'
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false') {
      return this.mapResponseError(body)
    }
    return body
  }

  mapResponseError(body = {}) {
    throw body.message ? Boom.badData(body.message) : body
  }

  async execute() {
    this.orderId = await this.getOrderId(this.headers.cookie)

    return super.execute()
  }
}

export const deleteSavedItemSpec = {
  summary: 'Remove a single item from saved items',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description:
        'ProductId and CatEntryId of the item to be removed from saved items.',
      schema: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            example: '12345678',
          },
          catEntryId: {
            type: 'string',
            example: '98765432',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description:
        'Success response from WCS. This response is not transformed. Irrelevant properties omitted.',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Your Save for Later bag has been updated',
          },
          total: {
            type: 'string',
            example: '47.790000',
          },
        },
      },
    },
    422: {
      description: 'Failure',
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
            example: 'Could not delete saved item.',
          },
        },
      },
    },
  },
}
