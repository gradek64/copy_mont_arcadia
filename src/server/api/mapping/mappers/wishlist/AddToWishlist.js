import Mapper from '../../Mapper'
import Boom from 'boom'

export default class AddToWishlist extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ArcadiaAddItemToList'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { productId } = this.payload

    this.payload = {
      langId,
      storeId,
      catalogId,
      pageName: 'addToWishlist',
      productId,
    }
  }

  mapResponseBody(body) {
    if (!body.success || body.success === 'false') {
      return this.mapResponseError(body)
    }
    return body
  }

  mapResponseError(body) {
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const addToWishlistSpec = {
  summary: 'Add a product to a wishlist',
  description:
    'A product is the level above the SKU. For example the product is "Mario\'s Black Shirt " and the SKU is "Mario\'s Black Shirt size 4".',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      description: 'The productId from PDP or PLP responses is acceptable.',
      required: true,
      schema: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: {
            type: 'integer',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Success response',
      schema: {
        type: 'object',
        properties: {
          pageNo: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
          productList: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'integer',
                },
                giftListItemId: {
                  type: 'integer',
                },
              },
              required: ['productId', 'giftListItemId'],
            },
          },
          noOfItemsInList: {
            type: 'integer',
          },
          type: {
            type: 'string',
          },
          pageSize: {
            type: 'integer',
          },
          giftListId: {
            type: 'integer',
          },
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
        },
        required: [
          'pageNo',
          'name',
          'productList',
          'noOfItemsInList',
          'type',
          'pageSize',
          'giftListId',
          'success',
          'message',
        ],
      },
    },
  },
}
