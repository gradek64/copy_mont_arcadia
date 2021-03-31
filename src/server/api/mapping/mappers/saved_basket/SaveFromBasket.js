import Boom from 'boom'
import Mapper from '../../Mapper'

export default class SaveFromBasket extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/AjaxInterestItemAdd'
  }

  async mapRequestParameters() {
    const { langId, catalogId, siteId: storeId } = this.storeConfig
    const {
      catEntryId,
      productId,
      quantity,
      orderId,
      orderItemId,
    } = this.payload

    this.payload = {
      calculationUsageId: [1, -1, -2, -7],
      updatePrices: 1,
      isLoggedIn: 'true',
      URL:
        'AjaxOrderItemDelete?URL=AjaxOrderCalculate?URL=SaveForLaterAjaxView',
      langId,
      catalogId,
      storeId,
      orderId,
      catEntryId,
      orderItemId,
      productId,
      quantity,
    }
  }

  mapResponseBody(body = {}) {
    if (!body.itemSaved || body.itemSaved === 'false') {
      return this.mapResponseError(body)
    }
    return body
  }

  mapResponseError(body = {}) {
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const saveFromBasketSpec = {
  summary: 'Save an item from the basket',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description:
        'ProductId and CatEntryId, and quantity of the item to be saved. This item should be in the cart.',
      schema: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            example: '12345678',
          },
          catEntryId: {
            type: 'string',
            example: '98765432',
          },
          quantity: {
            type: 'number',
            example: 2,
          },
        },
      },
    },
  ],
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
            example: 'Your item has been saved for later',
          },
          rows: {
            type: 'number',
            example: 4,
          },
        },
      },
    },
  },
}
