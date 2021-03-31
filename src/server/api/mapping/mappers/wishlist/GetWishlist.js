import Mapper from '../../Mapper'
import Boom from 'boom'
import { isEmpty } from 'ramda'

import { MAX_WISHLIST_ITEMS } from '../../../../../shared/constants/wishlistConstants'

import transform from '../../transforms/getWishlist'

export default class GetWishlist extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ArcadiaSortAndPageItemsInList'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { maxItemsPerPage, pageNo, wishlistId: giftListId } = this.query

    this.query = {
      catalogId,
      giftListId,
      langId,
      maxItemsInPage: maxItemsPerPage || MAX_WISHLIST_ITEMS,
      onlyProductIds: false,
      pageNo: pageNo || 1,
      sortOption: 'Recent', // Assuming all wishlists will be arranged this way
      storeId,
    }
  }

  mapResponseBody(body = {}) {
    if (!body.giftListId) return this.mapResponseError(body)
    return transform(body)
  }

  mapResponseError(body) {
    // Current WCS response is an empty object if the wishlist isn't found
    // TODO: see if Cogz can add a message to this response
    if (isEmpty(body)) {
      throw Boom.badData('Wishlist not found')
    }
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const getWishlistSpec = {
  summary: 'Gets the products in a wishlist',
  parameters: [
    {
      in: 'query',
      name: 'wishlistId',
      required: true,
      type: 'string',
    },
    {
      in: 'query',
      name: 'pageNo',
      default: 1,
      type: 'integer',
      description: 'The page number starting from 1',
    },
    {
      in: 'query',
      name: 'maxItemsPerPage',
      type: 'integer',
      default: 100,
    },
  ],
  responses: {
    200: {
      summary: 'Success response',
      schema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
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
          itemDetails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                parentProductId: {
                  type: 'string',
                },
                sizeAndQuantity: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      size: {
                        type: 'string',
                      },
                      catentryId: {
                        type: 'integer',
                      },
                      quantity: {
                        type: 'integer',
                      },
                    },
                    required: ['size', 'catentryId', 'quantity'],
                  },
                },
                size: {
                  type: 'string',
                },
                avlQuantity: {
                  type: 'integer',
                },
                productImageUrl: {
                  type: 'string',
                },
                outfitBaseImageUrl: {
                  type: 'string',
                },
                lineNumber: {
                  type: 'string',
                },
                price: {
                  type: 'object',
                  properties: {
                    was2Price: {
                      type: 'null',
                    },
                    was1Price: {
                      type: 'string',
                    },
                    nowPrice: {
                      type: 'string',
                    },
                  },
                  required: ['was2Price', 'was1Price', 'nowPrice'],
                },
                quantity: {
                  type: 'string',
                },
                listItemId: {
                  type: 'string',
                },
                productImage: {
                  type: 'string',
                },
                colour: {
                  type: 'string',
                },
                colourKey: {
                  type: 'string',
                },
                productBaseImageUrl: {
                  type: 'string',
                },
                catEntryId: {
                  type: 'string',
                },
                outfitImageUrl: {
                  type: 'string',
                },
                outfitImage: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                rating: {
                  type: 'null',
                },
                sizeKey: {
                  type: 'string',
                },
                assets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      assetType: {
                        type: 'string',
                      },
                      url: {
                        type: 'string',
                      },
                    },
                    required: ['assetType', 'url'],
                  },
                  required: [
                    'parentProductId',
                    'sizeAndQuantity',
                    'size',
                    'avlQuantity',
                    'productImageUrl',
                    'outfitBaseImageUrl',
                    'price',
                    'quantity',
                    'listItemId',
                    'productImage',
                    'colour',
                    'colourKey',
                    'productBaseImageUrl',
                    'catEntryId',
                    'outfitImageUrl',
                    'outfitImage',
                    'title',
                    'rating',
                    'sizeKey',
                    'assets',
                  ],
                },
              },
              noOfItemsInList: {
                type: 'integer',
              },
            },
            required: [
              'pageSize',
              'pageNo',
              'name',
              'giftListId',
              'type',
              'itemDetails',
              'noOfItemsInList',
            ],
          },
        },
      },
    },
  },
}
