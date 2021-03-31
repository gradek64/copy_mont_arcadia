import Mapper from '../../Mapper'
import transform from '../../transforms/basket'
import { basketCookies } from './cookies'
import Boom from 'boom'
import { addToBasketConstantsV2 } from '../../constants/basketConstants'
import { path } from 'ramda'
import orderSummaryTransform from '../../transforms/orderSummary'
import { orderSummaryConstants } from '../../constants/orderSummary'

export default class AddToBasketV2 extends Mapper {
  mapEndpoint() {
    const wcs = '/webapp/wcs/stores/servlet/'
    this.destinationEndpoint = `${wcs}NewProductDetailsActionControl`
    this.orderSummaryEndpoint = `${wcs}PreCheckout`
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const {
      productId,
      quantity,
      bundleItems,
      partNumber,
      isDDPProduct,
      responseType,
      catEntryId,
      noRedirect = false,
    } = this.payload
    this.responseType = responseType
    this.payload = {
      catalogId,
      langId,
      storeId,
      productId,
      isBasketResponseReqd: true,
      noRedirect,
      ...addToBasketConstantsV2,
    }

    if (bundleItems) {
      this.payload = {
        ...this.payload,
        isSingleItem: false,
        noOfSlots: bundleItems.length,
        ...this.transformBundleItemParameters(bundleItems),
      }
    } else {
      this.payload = {
        ...this.payload,
        isSingleItem: true,
        partNumber,
        quantity,
        isDDPProduct,
        catEntryId,
      }
    }
  }

  mapOrderSummaryParameters(basket) {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.method = 'post'
    return {
      catalogId,
      langId,
      orderId: basket.orderId,
      storeId,
      ...orderSummaryConstants({ storeId, catalogId }),
    }
  }

  /**
   * Maps client request params to WCS request params.
   *
   * @param  {Array<Object>} bundleItems
   * @property {String} bundleItems[].sku  The partNumber of the item
   * @property {Number} bundleItems[].productId  The catEntryId of the item
   * @return {Object}
   */
  transformBundleItemParameters(bundleItems) {
    return bundleItems.reduce((acc, { sku, productId, catEntryId }, index) => {
      const n = index + 1
      return {
        ...acc,
        [`slot_${n}`]: [n],
        [`quantity_${n}`]: 1,
        [`partNumber_${n}`]: sku,
        [`productId_${n}`]: productId,
        ...(catEntryId && {
          [`catEntryId_${n}`]: catEntryId,
        }),
      }
    }, {})
  }

  mapResponseBody(body = {}) {
    return transform(body.Basket, this.storeConfig.currencySymbol)
  }

  async mapResponse(res) {
    if (res.body && res.body.success === false) throw res
    if (this.responseType === 'orderSummary') {
      const requests = await this.mapOrderSummaryParameters(
        res.body && res.body.Basket
      )
      return this.sendRequestToApi(
        this.destinationHostname,
        this.orderSummaryEndpoint,
        requests,
        {},
        'post',
        this.headers,
        res.jsessionid
      )
        .then((res) => {
          return this.mapOrderSummaryResponse(res)
        })
        .catch((apiResponseError) => {
          return this.mapResponseError(apiResponseError)
        })
    }
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
}

export const addToBasketV2Spec = {
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
            type: 'integer',
          },
          catEntryId: {
            type: 'integer',
          },
          partNumber: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
          },
          isDDPProduct: {
            type: 'boolean',
          },
          required: [
            'productId',
            'partNumber',
            'quantity',
            'sku',
            'isSingleItem',
            'isDDPProduct',
          ],
          bundleItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'integer',
                },
                sku: {
                  type: 'string',
                },
                catEntryId: {
                  type: 'integer',
                },
              },
              required: ['productId', 'sku'],
            },
          },
          responseType: {
            type: 'string',
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
