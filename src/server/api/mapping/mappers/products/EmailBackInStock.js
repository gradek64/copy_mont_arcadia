import Mapper from '../../Mapper'

export default class EmailBackInStock extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/EmailWhenInStockCmd'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { email, firstName, productId, size, sku, surname } = this.payload
    this.payload = {
      catalogId,
      catentry_id: productId,
      foreName: firstName,
      Email_address: email,
      langId,
      partnumber: sku,
      size,
      storeId,
      surName: surname,
    }
  }
}

export const emailMeInStockSpec = {
  summary:
    'Instruct WCS to send an email to a user if a particular item is back in stock',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'foo@bar.com',
          },
          firstName: {
            type: 'string',
            example: 'Bob',
          },
          surname: {
            type: 'string',
            example: 'Barker',
          },
          size: {
            type: 'string',
            example: 'W2434',
          },
          sku: {
            type: 'string',
            example: '602015000888524',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Success response. This is not transformed from WCS.',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          action: {
            type: 'string',
            example: 'NotifyMe',
          },
          message: {
            type: 'string',
            example:
              'Your request has been received, and you will receive an email when the item is in stock.',
          },
        },
      },
    },
  },
}
