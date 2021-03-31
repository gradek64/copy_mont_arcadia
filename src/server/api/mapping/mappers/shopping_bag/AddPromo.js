import Boom from 'boom'
import { pathOr } from 'ramda'

import Mapper from '../../Mapper'
import { addPromoConstants } from '../../constants/addPromo'
import { basketConstants } from '../../constants/basketConstants'
import transform from '../../transforms/basket'
import orderSummaryTransform from '../../transforms/orderSummary'
import { addPromoCookies } from './cookies'

export default class AddPromo extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/PromotionCodeManage'
    this.basketEndpoint = '/webapp/wcs/stores/servlet/OrderCalculate'
  }

  async mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.basketQuery = {
      ...basketConstants,
      catalogId,
      langId,
      storeId,
    }
    const orderId = await this.getOrderId(this.headers.cookie)
    this.responseType = this.payload.responseType
    this.payload = {
      ...addPromoConstants,
      URL: `OrderCalculate?URL=OrderPrepare?URL=${
        this.payload.responseType === 'orderSummary'
          ? 'DeliveryPageUpdateAjaxView'
          : 'PromotionCodeAjaxView'
      }`,
      catalogId,
      langId,
      storeId,
      promoCode: this.payload.promotionId || '',
      orderId,
    }
  }

  mapWCSErrorCodes = {
    'ERR_PROMOTION_CODE_INVALID.-1200': 406,
    _ERR_GENERIC: 409,
    _ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED: 409,
    'ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED.-1800': 409,
  }

  mapResponseError(body = {}) {
    if (body.isBoom) {
      throw body
    }

    const { wcsErrorCode } = pathOr({}, ['data'], body)
    throw body.message && !wcsErrorCode ? Boom.badData(body.message) : body
  }

  mapResponseBody(body = {}) {
    return transform(body.Basket, this.storeConfig.currencySymbol)
  }

  mapResponse(res) {
    return {
      setCookies: addPromoCookies(),
      jsessionid: res.jsessionid,
      body: this.mapResponseBody(res.body),
    }
  }

  async execute() {
    this.mapEndpoint()
    try {
      await this.mapRequestParameters()
      const res = await this.sendRequestToApi(
        this.destinationHostname,
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method,
        this.headers
      )
      if (
        this.responseType === 'orderSummary' &&
        res.body &&
        res.body.orderSummary
      ) {
        const orderRes = orderSummaryTransform(
          res.body.orderSummary,
          false,
          this.storeConfig.currencySymbol
        )
        return {
          setCookies: addPromoCookies(),
          jsessionid: res.jsessionid,
          body: orderRes,
        }
      }

      this.mapErrorCode(res)
      if (
        (!res.body.success || res.body.success === 'false') &&
        res.body.errorCode !== '_API_CANT_RESOLVE_FFMCENTER.2'
      ) {
        return this.mapResponseError(res.body)
      }

      const basketRes = await this.sendRequestToApi(
        this.destinationHostname,
        this.basketEndpoint,
        this.basketQuery,
        {},
        'get',
        this.headers
      )
      return this.mapResponse(basketRes)
    } catch (err) {
      return this.mapResponseError(err)
    }
  }
}

export const addPromoSpec = {
  summary: 'Add a promotional code',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        required: ['promotionId'],
        properties: {
          promotionId: {
            type: 'string',
            example: '12345',
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
    422: {
      description: 'Invalid promo code',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          error: {
            type: 'string',
            example: 'Unprocessable Entity',
          },
          message: {
            type: 'string',
            example:
              'The promotion code you have entered has not been recognised. Please confirm the code and try again.',
          },
          originalMessage: {
            type: 'string',
            example:
              'The promotion code you have entered has not been recognised. Please confirm the code and try again.',
          },
        },
      },
    },
  },
}
