import Mapper from '../../Mapper'

export default class ProductStock extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/GetSizeQuantity'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    const { productId } = this.query || {}
    this.query = { langId, catalogId, storeId, productId }
  }

  mapResponseBody(body) {
    return body.items
  }
}

export const productStockSpec = {
  summary: 'Get items portion of pdp response',
  responses: {
    200: {
      description: 'The items array',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            item: {
              type: 'object',
              properties: {
                attrName: {
                  type: 'string',
                  example: '179008748',
                },
                quantity: {
                  type: 'integer',
                  example: '10',
                },
                catEntryId: {
                  type: 'integer',
                  example: '31076660',
                },
                attrValueId: {
                  type: 'integer',
                  example: '251124643',
                },
                selected: {
                  type: 'boolean',
                  example: 'true',
                },
                stockText: {
                  type: 'string',
                  example: 'In stock',
                },
                size: {
                  type: 'string',
                  example: '41',
                },
                sku: {
                  type: 'string',
                  example: '602018001201770',
                },
              },
            },
          },
        },
      },
    },
  },
}
