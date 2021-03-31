import Mapper from '../../Mapper'
import transform from '../../transforms/basket'
import { basketCookies } from './cookies'
import Boom from 'boom'
import {
  basketConstants,
  addToBasketConstants,
} from '../../constants/basketConstants'
import orderSummaryTransform from '../../transforms/orderSummary'
import { orderSummaryConstants } from '../../constants/orderSummary'
import {
  extractParametersFromProduct,
  extractParametersFromBundle,
} from './utils'
import { path } from 'ramda'

export default class AddToBasket extends Mapper {
  mapEndpoint() {
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = `${wcs}NewProductDetailsActionControl`
    this.basketEndpoint = `${wcs}OrderCalculate`
    this.orderSummaryEndpoint = `${wcs}PreCheckout`
    this.productEndpoint = `${wcs}ProductDisplay`
  }
  mapRequestParameters(product) {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { productId, sku, quantity, bundleItems, responseType } = this.payload
    this.responseType = responseType
    const { isDDPProduct } = product
    this.payload = {
      catalogId,
      langId,
      storeId,
      ...addToBasketConstants,
    }
    if (!bundleItems) {
      this.payload = {
        ...this.payload,
        quantity,
        catEntryId: productId,
        ...(isDDPProduct ? {} : extractParametersFromProduct(product, sku)),
      }
    } else {
      this.payload = {
        ...this.payload,
        productId,
        quantity: 1,
        isBundle: 'true',
        ...extractParametersFromBundle(product, bundleItems),
      }
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

  async mapOrderSummaryParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const orderId = await this.getOrderId(this.headers.cookie)

    this.method = 'post'
    return {
      catalogId,
      langId,
      orderId,
      storeId,
      ...orderSummaryConstants({ storeId, catalogId }),
    }
  }
  mapProductParameters(productId) {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    return {
      catalogId,
      langId,
      storeId,
      productId,
    }
  }
  getProduct() {
    const { productId } = this.payload
    if (productId) {
      return this.sendRequestToApi(
        this.destinationHostname,
        this.productEndpoint,
        this.mapProductParameters(productId),
        {},
        'get',
        this.headers
      )
    }
    return {}
  }
  mapResponseBody(body = {}) {
    return transform(body.Basket, this.storeConfig.currencySymbol)
  }
  mapResponse(res) {
    if (res.body && res.body.success === false) throw res
    return {
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
      setCookies: basketCookies(
        path(['Basket', 'products', 'Product'], res.body)
      ),
    }
  }
  mapOrderSummaryResponse(res) {
    const orderSummary = path(['body', 'orderSummary'], res)
    return {
      jsessionid: res.jsessionid,
      body: orderSummaryTransform(
        orderSummary,
        false,
        this.storeConfig.currencySymbol
      ),
      setCookies: basketCookies(
        path(['MiniBagForm', 'Basket', 'products', 'Product'], orderSummary)
      ),
    }
  }
  mapResponseError(res = {}) {
    throw res.body && res.body.success === false
      ? Boom.badData(
          res.body.message || res.body.errorMessage || res.body.errorMessage2,
          res
        )
      : res
  }
  async addToBasket(jsesssionid = false) {
    const result = await this.sendRequestToApi(
      this.destinationHostname,
      this.destinationEndpoint,
      {},
      this.payload,
      'post',
      this.headers,
      jsesssionid
    )

    return result
  }

  async execute() {
    this.mapEndpoint()
    const product = await this.getProduct()

    // This could be the same or different than the one provided by the Client in the scenario where the User Session is
    // expired and WCS provides a new one.
    const jsessionidFromGetProduct = product.jsessionid || false

    if (!product.body || product.body.success === false) {
      return this.mapResponseError(product)
    }

    this.mapRequestParameters(product.body)

    const result = await this.addToBasket(jsessionidFromGetProduct)

    if (result.body && result.body.success !== true) {
      return this.mapResponseError(result)
    }

    // In order to handle session expiry scenario where WCS provides a new jsessionid in the response, for the next request in the chain of requests to WCS
    // we will use the jsessionid provided in the response and not the one coming from the Client request.
    const jsessionidFromAddToBasket = result.jsessionid || false
    if (this.responseType === 'orderSummary') {
      const requests = await this.mapOrderSummaryParameters()
      return this.sendRequestToApi(
        this.destinationHostname,
        this.orderSummaryEndpoint,
        requests,
        {},
        'post',
        this.headers,
        jsessionidFromAddToBasket
      )
        .then((res) => {
          return this.mapOrderSummaryResponse(res)
        })
        .catch((apiResponseError) => {
          return this.mapResponseError(apiResponseError)
        })
    }

    return this.sendRequestToApi(
      this.destinationHostname,
      this.basketEndpoint,
      this.mapBasketParameters(),
      {},
      'get',
      this.headers,
      jsessionidFromAddToBasket
    )
      .then((res) => {
        return this.mapResponse(res)
      })
      .catch((apiResponseError) => {
        return this.mapResponseError(apiResponseError)
      })
  }
}

export const addToBasketSpec = {
  summary: 'Add a product (SKU) to the basket',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          productId: {
            type: 'number',
          },
          quantity: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
          },
          sku: {
            type: 'string',
          },
          responseType: {
            type: 'string',
            required: false,
            example: 'orderSummary',
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
