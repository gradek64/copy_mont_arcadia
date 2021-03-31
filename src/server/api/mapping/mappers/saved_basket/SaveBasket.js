import Mapper from '../../Mapper'
import Boom from 'boom'

export default class SaveBasket extends Mapper {
  mapEndpoint() {
    this.method = 'post'
  }

  mapRequestParameters() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/SaveBasket'
    this.payload = {
      langId: this.storeConfig.langId,
      storeId: this.storeConfig.siteId,
      catalogId: this.storeConfig.catalogId,
      isLoggedIn: 'true',
    }
  }

  mapResponseBody(body) {
    if (body.success !== true) throw body

    // At the moment we just pass the response back unchanged,
    // this may change in the future
    return body
  }

  mapResponseError(body) {
    throw Boom.badData(body.message)
  }
}

export const saveBasketSpec = {
  summary: 'Saves the shopping bag to the saved basket',
  responses: {
    200: {
      description:
        'Saved basket response from WCS. This is currently not transformed. Irrelevant properties omitted.',
      schema: {
        type: 'object',
        properties: {
          hasWishList: {
            type: 'boolean',
            example: true,
          },
          itemSaved: {
            type: 'boolean',
            example: true,
          },
          savedProducts: {
            type: 'object',
            properties: {
              Product: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    imageUrl: {
                      type: 'string',
                      example:
                        'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62M65IPLM_small.jpg',
                    },
                    colour: {
                      type: 'string',
                      example: 'PLUM',
                    },
                    catEntryId: {
                      type: 'number',
                      example: 21657409,
                    },
                    lineNumber: {
                      type: 'string',
                      example: '62M65IPLM',
                    },
                    name: {
                      type: 'string',
                      example: '**High Neck Drape Dress by Wal G',
                    },
                    shipModeId: {
                      type: 'number',
                      example: 26504,
                    },
                    size: {
                      type: 'string',
                      example: 'S',
                    },
                    quantity: {
                      type: 'number',
                      example: 1,
                    },
                    instock: {
                      type: 'boolean',
                      example: true,
                    },
                    unitPrice: {
                      type: 'number',
                      example: 29,
                    },
                    Total: {
                      type: 'number',
                      example: 29,
                    },
                  },
                },
              },
            },
          },
          savedBag: {
            type: 'boolean',
            example: true,
          },
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Your shopping bag has been saved for later',
          },
        },
      },
    },
  },
}
