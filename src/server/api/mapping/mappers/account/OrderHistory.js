import Mapper from '../../Mapper'
import transform from '../../transforms/orderHistory'

export default class OrderHistory extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/TrackOrderStatus'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    this.query = { catalogId, langId, storeId }
  }

  mapResponseBody(body) {
    return transform(body, this.storeConfig.currencySymbol)
  }
}

export const orderHistorySpec = {
  summary: 'Get a summary of previous orders made by a customer',
  responses: {
    200: {
      description: 'Details of previous orders',
      schema: {
        type: 'object',
        properties: {
          orders: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                orderId: {
                  type: 'number',
                  example: 700286041,
                },
                date: {
                  type: 'string',
                  example: '',
                },
                total: {
                  type: 'string',
                  example: '£38.00',
                },
                statusCode: {
                  type: 'string',
                  example: 'X',
                },
                status: {
                  type: 'string',
                  example: 'Your order has been cancelled.',
                },
                returnPossible: {
                  type: 'boolean',
                  example: false,
                },
                returnRequested: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
          },
        },
      },
    },
  },
}
