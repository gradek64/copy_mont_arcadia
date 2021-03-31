import Mapper from '../../Mapper'
import Boom from 'boom'
import { isEmpty } from 'ramda'

export default class GetWishlistItemIds extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ArcadiaSortAndPageItemsInList'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { wishlistId: giftListId } = this.query

    this.query = {
      catalogId,
      langId,
      storeId,
      giftListId,
      onlyProductIds: true,
      sortOption: 'Recent', // Assuming all wishlists will be arranged this way
    }
  }

  mapResponseBody(body = {}) {
    if (!body.giftListId) return this.mapResponseError(body)
    return body
  }

  mapResponseError(body) {
    // Current WCS response is an empty object if the wishlist isn't found
    // TODO Created MJI-1018 to return a meaningful response when this happens
    if (isEmpty(body)) {
      throw Boom.badData('Wishlist not found')
    }
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const getWishlistItemIdsSpec = {
  summary: 'Gets a list of product ids from a wishlist',
  parameters: [
    {
      in: 'query',
      name: 'wishlistId',
      type: 'string',
      required: true,
    },
  ],
  responses: {
    200: {
      schema: {
        type: 'object',
        properties: {
          pageSize: {
            type: 'integer',
          },
          pageNo: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
          giftListId: {
            type: 'integer',
          },
          type: {
            type: 'string',
          },
          noOfItemsInList: {
            type: 'integer',
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
        },
        required: [
          'pageSize',
          'pageNo',
          'name',
          'giftListId',
          'type',
          'noOfItemsInList',
          'productList',
        ],
      },
    },
  },
}
