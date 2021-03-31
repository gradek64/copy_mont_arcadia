import Mapper from '../../Mapper'
import transform from '../../transforms/basket'
import { path } from 'ramda'

import { basketConstants } from '../../constants/basketConstants'

import { basketCookies } from './cookies'

export default class Basket extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/OrderCalculate'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      catalogId,
      langId,
      storeId,
      ...basketConstants,
    }
  }

  mapResponseBody(body = {}) {
    return transform(body.Basket, this.storeConfig.currencySymbol)
  }

  mapResponse(res) {
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: basketCookies(
        path(['Basket', 'products', 'Product'], res.body)
      ),
    }
  }
}

export const getBasketSpec = {
  summary: 'Get the basket',
  responses: {
    200: {
      description: 'Shopping Basket Object',
      schema: {
        $ref: '#/definitions/basket',
      },
    },
  },
}
