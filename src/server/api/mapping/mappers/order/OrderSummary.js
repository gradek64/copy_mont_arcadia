import { path } from 'ramda'

import Mapper from '../../Mapper'
import transform, {
  checkIfBasketObjectWithError,
} from '../../transforms/orderSummary'

import { orderSummaryConstants } from '../../constants/orderSummary'
import basketTransform from '../../transforms/basket'

export default class OrderSummary extends Mapper {
  constructor(...args) {
    super(...args)
    this.isGuest = false
  }

  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/PreCheckout'
  }

  async returnOrderId(cookie) {
    const { orderId } = this.params
    return orderId || this.getOrderId(cookie)
  }

  async mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const orderId = await this.returnOrderId(this.headers.cookie)
    const { guestUser = '' } = this.query

    this.method = 'post'
    this.payload = {
      catalogId,
      langId,
      storeId,
      orderId,
      isTempUserNotRqrd: true,
      clearGuestDetails: guestUser === 'true',
      ...orderSummaryConstants({ storeId, catalogId }),
    }

    this.query = {}
  }

  mapResponseBody(body = {}) {
    // It is possible that WCS returns a basket shaped response to answer an order summary request:
    // an example is given by the scenario where the User proceeds to checkout (GET order summar) and one of
    // the products went out of stock.
    // We now return this basket transformed so that the monty client can process it differently.
    const basket = checkIfBasketObjectWithError(path(['Basket'], body))
    if (basket) return basketTransform(basket, this.storeConfig.currencySymbol)

    if (!this.isGuest) {
      if (
        !body ||
        !body.orderSummary ||
        typeof body.orderSummary !== 'object' ||
        (body.success === false && !body.orderSummary)
      ) {
        throw new Error('wcsSessionTimeout')
      }
    }

    // If we are here it means that the response from WCS has the shape of a proper order summary
    return transform(
      body.orderSummary,
      this.isGuest,
      this.storeConfig.currencySymbol
    )
  }

  async execute() {
    try {
      await this.mapRequestParameters()
    } catch (err) {
      if (!this.isGuest) {
        // Covering in this way the scenario where the User cleared the cookies and hence we don't have the jsessionid
        // to retrieve the cookies which are needed to create the payload for WCS.
        // Forcing the User to login again and start from scratch.
        throw new Error('wcsSessionTimeout')
      }
      throw err
    }

    this.mapEndpoint()

    return this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      this.query,
      this.payload,
      this.method,
      this.headers
    )
      .then((res) => this.mapResponse(res))
      .catch((err) => {
        if (err.message === 'wcsSessionTimeout') throw err

        if (!this.isGuest && !err.isBoom) {
          // Forcing the User to start from scratch.
          // This is a temporary solution due to the fact that sometimes we observed the User to reach a strange state on WCS.
          // Boom errors that are caught need to be excluded from this block so that they are mapped normally.
          throw new Error('wcsSessionTimeout')
        }
        return this.mapResponseError(err)
      })
  }
}

export const orderSummarySpec = {
  summary: 'Get the summary of an order to be processed.',
  parameters: [
    {
      type: 'string',
      name: 'orderId?',
      in: 'path',
      required: true,
      description:
        'The current orderId. This can be passed to reduce the load on the backend to retrieve it from session',
    },
  ],
  responses: {
    200: {
      description: 'Order Summary object',
      schema: {
        $ref: '#/definitions/orderSummary',
      },
    },
    422: {
      description: 'Items out of stock or are restricted from delivery',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          error: {
            type: 'text',
            example: 'Unprocessable Entity',
          },
          message: {
            type: 'text',
            example:
              'There are items in your basket that are now out of stock, remove these to continue your order',
          },
          data: {
            type: 'object',
            description:
              'Used for failed requests to return data which may still be useable, such as the basket state',
            properties: {
              basket: {
                $ref: '#/definitions/basket',
              },
            },
          },
        },
      },
    },
  },
}
