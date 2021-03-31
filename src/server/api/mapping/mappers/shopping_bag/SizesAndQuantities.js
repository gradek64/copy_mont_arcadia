import Mapper from '../../Mapper'
import transform from '../../transforms/sizesAndQuantities'

export default class SizesAndQuantities extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      catalogId,
      langId,
      storeId,
      catEntryId: this.query.catEntryId || '',
    }
  }

  mapResponseBody(body = {}) {
    return transform(body)
  }
}

export const sizesAndQuantitiesSpec = {
  summary: 'Get available sizes and quantities for a particular item.',
  parameters: [
    {
      name: 'catEntryId',
      in: 'query',
      required: true,
      type: 'string',
      description: 'The catEntryId of the product to be queried',
    },
  ],
  responses: {
    200: {
      description: 'List of other variants of the same item',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            size: {
              type: 'string',
              example: '37',
            },
            quantity: {
              type: 'number',
              example: 20,
            },
            catEntryId: {
              type: 'number',
              example: 12345678,
            },
            selected: {
              type: 'boolean',
              example: true,
            },
            wasPrice: {
              type: 'string',
              example: '50.00',
            },
            wasWasPrice: {
              type: 'string',
              example: '100.00',
            },
          },
        },
      },
    },
  },
}
