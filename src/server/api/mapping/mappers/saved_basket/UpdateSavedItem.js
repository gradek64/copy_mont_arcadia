import Boom from 'boom'
import Mapper from '../../Mapper'

export default class UpdateSavedItem extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/InterestItemDelete'
  }

  mapRequestParameters() {
    const { catalogId, siteId: storeId, langId } = this.storeConfig
    const {
      quantity,
      productId,
      catEntryIdToAdd,
      catEntryIdToDelete,
    } = this.payload

    if (!catEntryIdToAdd || !catEntryIdToDelete || !productId) {
      throw Boom.badData('Invalid parameters')
    }

    const isSizeChange = catEntryIdToAdd !== catEntryIdToDelete

    this.payload = {
      catalogId,
      storeId,
      langId,
      orderId: '',
      updatePrices: '1',
      calculationUsageId: '-1',
      calculateOrder: '1',
      sourcePage: '',
      quantity,
      productId,
      catEntryId: catEntryIdToDelete,
      URL: isSizeChange
        ? `AjaxInterestItemAdd?catEntryId=${catEntryIdToAdd}&sourcePage=&URL=InterestItemUpdateItemAjaxView`
        : 'AjaxInterestItemAdd?URL=InterestItemUpdateItemAjaxView',
    }
    this.method = 'post'
  }

  mapResponseBody(body = {}) {
    if (!body.success || body.success === 'false') {
      return this.mapResponseError(body)
    }
    return body
  }

  mapResponseError(body = {}) {
    throw body.message ? Boom.badData(body.message) : body
  }
}

export const updateSavedItemSpec = {
  summary: 'Update the size and/or quantity of a saved item.',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      description:
        'The productId of the item, catEntryId of the previous size and the size that is to be selected, and the new quantity. If only the quantity is to be changed, the two catEntryId values should be the same.',
      schema: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            example: '12345678',
          },
          catEntryIdToAdd: {
            type: 'string',
            example: '98765432',
          },
          catEntryIdToDelete: {
            type: 'string',
            example: '34534534',
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
