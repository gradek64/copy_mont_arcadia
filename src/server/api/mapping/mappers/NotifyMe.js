import Mapper from '../Mapper'

export default class NotifyMe extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ArcadiaNotifyMeEnrollment'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { email, firstName, productId, size, sku, surname } = this.query
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
    this.method = 'post'
  }
}

export const notifyMeSpec = {
  summary:
    'Instruct WCS to send an email to a user if a particular item is back in stock',
  parameters: [
    {
      name: 'productId',
      in: 'query',
      example: '21519255',
    },
    {
      name: 'firstName',
      in: 'query',
      example: 'Alex',
    },
    {
      name: 'surname',
      in: 'query',
      example: 'Trebek',
    },
    {
      name: 'email',
      in: 'query',
      example: 'foo@bar.com',
    },
    {
      name: 'size',
      in: 'query',
      example: 'W2434',
    },
    {
      name: 'sku',
      in: 'query',
      example: '602015000888524',
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
