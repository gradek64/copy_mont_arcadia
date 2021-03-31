import Boom from 'boom'
import { path } from 'ramda'
import Mapper from '../../Mapper'
import basketTransform from '../../transforms/basket'
import {
  extractCartId,
  extractNominatedDeliveryDate,
} from '../../utils/cartUtils'
import { getCookies } from '../../utils/sessionUtils'

/**
 * Maps update delerivery type from WCS to monty format
 */
export default class UpdateDeliveryType extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ProcessShoppingBagSummaryDeliverySelection'
    this.method = 'post'
  }

  mapRequestParameters() {
    const { langId, siteId, catalogId } = this.storeConfig
    const { deliveryOptionId } = this.payload

    this.payload = {
      orderId: this.orderId,
      langId,
      storeId: siteId,
      catalogId,
      sourcePage: 'OrderItemDisplay',
      shippingMethod: deliveryOptionId,
      selectedNominatedDate: this.selectedNominatedDate,
    }
    this.query = {}
  }

  mapResponseBody(body) {
    if (path(['success'], body) === 'false') throw body
    return basketTransform(body, this.storeConfig.currencySymbol)
  }

  mapResponseError(err) {
    const { isBoom, message } = err

    if (isBoom) {
      throw err
    }

    throw Boom.notFound(message)
  }

  async execute() {
    // For the time being we need to get the order id from redis
    // because atm we cannot update monty client to send it
    let cookies = await getCookies(await this.getSession(this.headers.cookie))
    if (!cookies) {
      cookies = this.cookieCapture.readForServer()
    }
    this.orderId = await extractCartId(cookies)
    this.selectedNominatedDate = await extractNominatedDeliveryDate(cookies)
    return super.execute()
  }
}

export const updateDeliveryTypeSpec = {
  summary: 'Update the delivery type',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          deliveryOptionId: {
            type: 'string',
            example: '123456',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Shopping Basket Object',
      schema: {
        $ref: '#/definitions/basket',
      },
    },
  },
}
