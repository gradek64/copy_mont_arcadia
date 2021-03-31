import Mapper from '../../Mapper'
import Boom from 'boom'

export default class RestoreSavedBasketItem extends Mapper {
  mapRequestParameters() {
    if (!this.payload.productId)
      throw Boom.notAcceptable('Missing `productId` in request body')
    if (!this.payload.catEntryId)
      throw Boom.notAcceptable('Missing `catEntryId` in request body')

    this.query = {
      calculationUsageId: [-1, -2, -7],
      catalogId: this.storeConfig.catalogId,
      catEntryId: [this.payload.catEntryId],
      updatePrices: 1,
      langId: this.storeConfig.langId,
      storeId: this.storeConfig.siteId,
      productId: this.payload.productId,
      orderId: this.orderId,
      calculateOrder: 1,
      quantity: this.payload.quantity || 1,
      pageName: 'shoppingBag',
      savedItem: 'true',
      URL:
        'OrderItemAddAjax?URL=OrderCalculate?URL=AddToBagFromIntListAjaxView',
    }
    this.payload = {}
  }

  mapEndpoint() {
    this.method = 'post'
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/InterestItemDelete'
  }

  mapResponseBody(body) {
    if (body.success !== 'true') throw body
    // no transform currently done. This may change in the future
    // depending on the client's needs
    return body
  }

  mapResponseError(body) {
    throw Boom.badData(body.message)
  }

  async execute() {
    this.orderId = await this.getOrderId(this.headers.cookie)
    // When the basket is empty, the orderId is removed from the cartId cookie
    // in this case we need to use '.'
    if (this.orderId === '') this.orderId = '.'
    return super.execute()
  }
}

export const restoreSavedBasketItemSpec = {
  summary: 'Restores an item from the saved basket to the shopping bag',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        required: ['catEntryId', 'productId'],
        properties: {
          catEntryId: {
            type: 'string',
          },
          productId: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description:
        'Basket response from WCS. This is currently not transformed. Irrelevant properties omitted.',
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
          products: {
            type: 'object',
            properties: {
              Product: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'object',
                      properties: {
                        Item: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              selected: {
                                type: 'boolean',
                                example: true,
                              },
                              size: {
                                type: 'string',
                                example: 'XS',
                              },
                              quantity: {
                                type: 'number',
                                example: 0,
                              },
                              sku: {
                                type: 'string',
                                example: '602015000890858',
                              },
                              catEntryId: {
                                type: 'number',
                                example: 21919940,
                              },
                              unitPrice: {
                                type: 'number',
                                example: 36,
                              },
                            },
                          },
                        },
                      },
                    },
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
            example: 'Your shopping bag has been updated',
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
