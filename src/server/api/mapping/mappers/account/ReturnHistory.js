import Mapper from '../../Mapper'
import transform from '../../transforms/returnHistory'

export default class ReturnHistory extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = `/webapp/wcs/stores/servlet/TrackRMAStatus`
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      langId,
      catalogId,
      storeId,
      orderId: '',
    }
  }
  mapResponseBody(body) {
    return transform(body)
  }
}

export const returnHistorySpec = {
  summary:
    "Get a list of returns that the session's registered user has on their account",
  parameters: [],
  responses: {
    200: {
      description: 'Array of returns',
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
                  example: 1646640,
                },
                date: {
                  type: 'string',
                  example: '02 August 2017',
                },
                status: {
                  type: 'string',
                  example: 'Awaiting Refund',
                },
                statusCode: {
                  type: 'string',
                  example: 'D',
                },
                total: {
                  type: 'string',
                  example: '£31.00',
                },
                rmaId: {
                  type: 'number',
                  example: 96507,
                },
              },
            },
          },
        },
      },
    },
  },
}
