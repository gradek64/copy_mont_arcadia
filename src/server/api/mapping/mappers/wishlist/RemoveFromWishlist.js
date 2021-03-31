import Mapper from '../../Mapper'
import Boom from 'boom'

export default class RemoveFromWishlist extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/AjaxGiftListServiceDeleteItem'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const {
      wishlistId: giftListId,
      wishlistItemId: giftListItemId,
    } = this.payload

    this.payload = {
      catalogId,
      langId,
      storeId,
      giftListId,
      giftListItemId,
    }

    this.method = 'post'
  }

  mapResponseBody(body) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)
    return body
  }

  mapResponseError(body) {
    throw body.message ? Boom.badData(body.message) : body // TODO: see if Cogz can add a message to this response
  }
}

export const removeFromWishlistSpec = {
  summary: 'Removes an item from a wishlist',
  parameters: [
    {
      in: 'body',
      name: 'payload',
      required: true,
      schema: {
        type: 'object',
        required: ['wishlistId', 'wishlistItemId'],
        properties: {
          wishlistId: {
            type: 'string',
          },
          wishlistItemId: {
            type: 'number',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      summary: 'Success response',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          externalId: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          giftListId: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          giftListItemId: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          storeId: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: [
          'success',
          'externalId',
          'giftListId',
          'giftListItemId',
          'storeId',
        ],
      },
    },
  },
}
