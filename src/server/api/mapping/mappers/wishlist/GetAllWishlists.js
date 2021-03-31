import Mapper from '../../Mapper'

export default class GetAllWishlists extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/AjaxGetWishListResponse'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    this.query = {
      catalogId,
      langId,
      storeId,
    }
  }
}

export const getAllWishlistsSpec = {
  summary: "Returns the signed in user's wishlists",
  responses: {
    200: {
      summary: 'Success response',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            default: {
              type: 'string',
            },
            giftListId: {
              type: 'string',
            },
            giftListname: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
          },
          required: ['default', 'giftListId', 'giftListname', 'type'],
        },
      },
    },
  },
}
