import Mapper from '../../Mapper'
import { genBagCountCookie } from './cookies'
import { combineCookies } from '../../../requests/utils'
import transform from '../../transforms/basket'
import orderSummaryTransform from '../../transforms/orderSummary'
import Boom from 'boom'
import { path } from 'ramda'
import { cookieOptionsBag } from '../../../../lib/auth'

export default class RemoveFromBasket extends Mapper {
  mapEndpoint() {
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = `${wcs}OrderItemDelete`
    this.method = 'post'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { orderItemId, orderId, responseType, isDDPItem = false } = this.query
    this.payload = {
      orderItemId,
      orderId,
      updatePrices: '1',
      calculationUsageId: ['-1', '-2', '-7'],
      isDDPItem,
      langId,
      storeId,
      catalogId,
      errorViewName: 'ShoppingBagRemoveItemAjaxView',
      URL: `OrderCalculate?URL=${
        responseType === 'orderSummary'
          ? 'DeliveryPageUpdateAjaxView'
          : 'ShoppingBagRemoveItemAjaxView'
      }`,
    }
    this.responseType = responseType
    this.query = {}
  }

  mapResponseBody(body) {
    // In case of sessionTimeout property set to true we need to return an empty bag as scrApi is currently doing.
    // The property sessionTimeout is set in api.js.
    if (this.responseType === 'orderSummary') {
      return orderSummaryTransform(
        body.orderSummary,
        false,
        this.storeConfig.currencySymbol
      )
    }
    if (!body.products && !body.wcsSessionTimeout)
      throw Boom.badData(['Item was not removed'], [body])

    return transform(body, this.storeConfig.currencySymbol)
  }

  mapResponse(res) {
    const products =
      this.responseType === 'orderSummary'
        ? path(
            ['orderSummary', 'MiniBagForm', 'Basket', 'products', 'Product'],
            res.body
          )
        : path(['products', 'Product'], res.body)
    const { value, name } = genBagCountCookie(products)
    const bagCount = `${name}=${value}`
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      // setting this here so it keeps client and redis in sync,
      // setCookies only sets on client, not in redis
      setCookies: [
        {
          name,
          value,
          options: cookieOptionsBag,
        },
      ],
      cookies: combineCookies([bagCount], res.cookies),
    }
  }
}

export const removeFromBasketSpec = {
  summary: 'Remove an item from the basket',
  parameters: [
    {
      name: 'orderId',
      in: 'query',
      type: 'string',
      required: true,
    },
    {
      name: 'orderItemId',
      in: 'query',
      type: 'string',
      required: true,
    },
    {
      name: 'responseType',
      in: 'query',
      type: 'string',
      required: false,
      example: 'orderSummary',
    },
    {
      name: 'isDDPItem',
      in: 'query',
      type: 'boolean',
      required: false,
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
