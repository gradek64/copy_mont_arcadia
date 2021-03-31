import Mapper from '../../Mapper'
import Boom from 'boom'
import { path } from 'ramda'
import transform from '../../transforms/basket'
import { basketConstants } from '../../constants/basketConstants'
import { basketCookies } from '../../mappers/shopping_bag/cookies'

export default class AddToBasketFromWishlist extends Mapper {
  mapEndpoint() {
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = `${wcs}NewProductDetailsActionControl`
    this.basketEndpoint = `${wcs}OrderCalculate`
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { catEntryId, quantity } = this.payload

    this.payload = {
      langId,
      storeId,
      catalogId,
      catEntryId,
      quantity,
      add2cartErrorViewName: 'Add2ShopCartResponseView',
      errorViewName: 'ProductDisplayErrorView',
      isMiniBagEnabled: true,
      Add2ShopCart: true,
      result: 'ADDED_TO_BAG',
    }
  }

  mapBasketParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    return {
      catalogId,
      langId,
      storeId,
      ...basketConstants,
    }
  }

  async addToBasket() {
    const result = await this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      {},
      this.payload,
      'post',
      this.headers
    )

    return result
  }

  mapResponse(res = {}) {
    if (!res.body || (res.body && res.body.success === false)) throw res
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: basketCookies(
        path(['Basket', 'products', 'Product'], res.body)
      ),
    }
  }

  mapResponseBody(body = {}) {
    return transform(body.Basket, this.storeConfig.currencySymbol)
  }

  mapResponseError(body = {}) {
    throw body.message ? Boom.badData(body.message) : body
  }

  async execute() {
    this.mapEndpoint()
    this.mapRequestParameters()

    try {
      const addToBasketResponse = await this.addToBasket()
      if (
        addToBasketResponse.body &&
        addToBasketResponse.body.success !== true
      ) {
        return this.mapResponseError(addToBasketResponse.body)
      }
      const jsessionidFromAddToBasket = addToBasketResponse.jsessionid || false

      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.basketEndpoint,
        this.mapBasketParameters(),
        {},
        'get',
        this.headers,
        jsessionidFromAddToBasket
      )
      return this.mapResponse(res)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const addToBasketFromWishlistSpec = {
  summary: 'Add to bag from wishlist',
  parameters: [
    {
      in: 'body',
      name: 'payload',
      required: true,
      schema: {
        type: 'object',
        properties: {
          catEntryId: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
          },
        },
        required: ['catEntryId', 'quantity'],
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
