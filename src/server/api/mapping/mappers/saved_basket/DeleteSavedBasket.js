import Mapper from '../../Mapper'
import Boom from 'boom'

export default class DeleteSavedBasket extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/InterestItemDelete'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    this.query = {
      catalogId,
      langId,
      storeId,
      updatePrices: 1,
      calculationUsageId: -1,
      productId: '*',
      catEntryId: '*',
      orderId: '',
      calculateOrder: 1,
      URL: 'InterestItemsRemoveItemAjaxView',
    }

    this.method = 'post'
  }

  mapResponseBody(body) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)

    return body
  }

  mapResponseError(body) {
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const deleteSavedBasketSpec = {
  summary: 'Remove all saved items',
  responses: {
    200: {
      description:
        'Success response from WCS. This is not transformed. Irrelevant properties omitted.',
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
            example: 'Could not delete saved items.',
          },
        },
      },
    },
  },
}
