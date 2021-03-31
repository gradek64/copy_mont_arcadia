import Mapper from '../../Mapper'
import Boom from 'boom'

export default class CreateWishlist extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ArcadiaCreateWishList'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    this.payload = {
      langId,
      storeId,
      catalogId,
      accessPreference: 'Public', // Assuming all wishlists will be public but this can change
      default: 'Yes', // Assuming users will only create one wishlist so it's the default
      disabled: false,
      name: this.payload.wishlistName,
    }
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

export const createWishlistSpec = {
  summary: 'Creates a wishlist for the signed in user',
  description:
    'At the moment we only support creating a single default wishlist. This should be done after the registering the user.',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        required: ['wishlistName'],
        properties: {
          wishlistName: {
            type: 'string',
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
          success: { type: 'boolean' },
          externalId: { type: 'integer' },
          giftListName: { type: 'string' },
          giftListId: { type: 'integer' },
          storeId: { type: 'integer' },
        },
      },
    },
  },
}
