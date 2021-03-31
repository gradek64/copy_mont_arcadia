import Mapper from '../../Mapper'
import Boom from 'boom'
import { path } from 'ramda'

import transform from '../../transforms/orderDetails'
import { isApps } from '../../utils/headerUtils'

export default class OrderDetails extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/OrderDetail'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      langId,
      catalogId,
      storeId,
      orderId: this.params.orderId,
      CarrierAndTracking: 'OrderDetailDisplay',
    }
  }

  mapResponseBody(body) {
    const orderItemStatus = path(['orderLines', 0, 'orderItemStatus'], body)

    if (isApps(this.headers) && orderItemStatus === 'P') {
      throw Boom.badData('An error has occurred please try again')
    }

    return transform(body, this.storeConfig.currencySymbol)
  }
}

export const orderDetailsSpec = {
  summary: 'Get the details of a specific order a customer has made',
  parameters: [
    {
      name: 'orderId',
      in: 'query',
      required: true,
      example: '12345678',
    },
  ],
  responses: {
    200: {
      description: 'Details of a previous order',
      schema: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            example: '700285030',
          },
          subtotal: {
            type: 'string',
            example: '36.00',
          },
          statusCode: {
            type: 'string',
            enum: ['C', 'W', 'M', 'G', 'S', 'c', 'r', 'i', 'D', 'X'],
            description: `Unique character idenitfier for a status
              * \`C\` - Your order is currently being packed by our warehouse
              * \`W\` - Pending Fraud Check
              * \`M\` - Pending Payment Authorisation
              * \`G\` - Order Shipment delayed
              * \`S\` - Shipped
              * \`c\` - Collected
              * \`r\` - returned to stock
              * \`i\` - Ready to Collect
              * \`D\` - Dispatched
              * \`X\` - Your order has been cancelled
            `,
          },
          isOrderFullyRefunded: {
            type: 'boolean',
            example: false,
            description:
              'Flag to determine if all items in order have been refunded i.e. user cannot start a new return',
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
          deliveryMethod: {
            type: 'string',
            example: 'Standard Delivery',
          },
          deliveryType: {
            type: 'string',
            example: 'H',
            description: `Different delivery types
            * H - Home delivery
            * P - Parcel
            * S - Collect from store
            `,
          },
          deliveryDate: {
            type: 'string',
            example: 'Monday 2 October 2017',
          },
          deliveryCost: {
            type: 'string',
            example: '4.00',
          },
          deliveryCarrier: {
            type: 'string',
            example: 'Parcelnet',
          },
          deliveryPrice: {
            type: 'string',
            example: '4.00',
          },
          totalOrderPrice: {
            type: 'string',
            example: '38.00',
          },
          totalOrdersDiscount: {
            type: 'string',
            example: '-2.00',
          },
          billingAddress: {
            $ref: '#/definitions/orderAddress',
          },
          deliveryAddress: {
            $ref: '#/definitions/orderAddress',
          },
          orderLines: {
            $ref: '#/definitions/orderLines',
          },
          paymentDetails: {
            $ref: '#/definitions/paymentDetails',
          },
          discounts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string',
                  example: 'Monty Test 7p off',
                },
                value: {
                  type: 'string',
                  example: '0.07',
                },
              },
            },
          },
        },
      },
    },
  },
}
