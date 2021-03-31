import Mapper from '../../Mapper'
import transform from '../../transforms/returnDetails'

export default class ReturnDetails extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = `/webapp/wcs/stores/servlet/ReturnDetail`
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { orderId, rmaId } = this.params
    this.query = {
      langId,
      catalogId,
      storeId,
      orderId,
      rmaId,
    }
  }
  mapResponseBody(body) {
    return transform(body)
  }
}

export const returnDetailsSpec = {
  summary:
    "Get details of a specific return a session's registered user has on their account",
  parameters: [
    {
      name: 'rmaId',
      in: 'query',
      type: 'number',
      required: true,
      description: 'Internal return id assigned to the order',
    },
    {
      name: 'orderId',
      in: 'query',
      type: 'number',
      required: true,
      description: 'Internal identification number assigned to the order',
    },
  ],
  responses: {
    200: {
      descripton: 'Summary of a specific return',
      schema: {
        type: 'object',
        properties: {
          rmaId: {
            type: 'number',
            example: 91506,
          },
          orderId: {
            type: 'number',
            example: 1473808,
          },
          subTotal: {
            type: 'string',
            example: '20.00',
          },
          deliveryPrice: {
            type: 'string',
            example: '0.00',
          },
          totalOrderPrice: {
            type: 'string',
            example: '18.00',
          },
          totalOrdersDiscountLabel: {
            type: 'string',
            example: '',
          },
          totalOrdersDiscount: {
            type: 'string',
            example: '-2.00',
          },
          orderLines: {
            $ref: '#/definitions/orderLines',
          },
          paymentDetails: {
            $ref: '#/definitions/paymentDetails',
          },
        },
      },
    },
  },
}
