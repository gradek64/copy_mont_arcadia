import Mapper from '../../Mapper'
import { path } from 'ramda'
import basketTransform from '../../transforms/basket'
import orderSummaryTransform from '../../transforms/orderSummary'

export default class DeletePromotionCode extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/PromotionCodeManage'
  }

  mapRequestParameters() {
    this.method = 'post'
    this.responseType = this.payload.responseType
    this.payload = {
      orderId: this.orderId,
      actionType: 'verify_promo',
      updatePrices: 1,
      calculationUsageId: [-1, -2, -7],
      langId: this.storeConfig.langId,
      storeId: this.storeConfig.siteId,
      catalogId: this.storeConfig.catalogId,
      promoCode: this.payload.promotionCode,
      calculateOrder: 1,
      sourcePage: 'OrderItemDisplay',
      URL: `OrderCalculate?URL=OrderPrepare?URL=${
        this.responseType === 'orderSummary'
          ? 'DeliveryPageUpdateAjaxView'
          : 'PromotionCodeAjaxView'
      }`,
      errorViewName: 'PromotionCodeAjaxView',
      taskType: 'R',
    }
  }

  mapResponseBody(body) {
    return this.responseType === 'orderSummary'
      ? orderSummaryTransform(
          body.orderSummary,
          false,
          this.storeConfig.currencySymbol
        )
      : basketTransform(body, path(['currencySymbol'], this.storeConfig))
  }

  async execute() {
    // For the time being we need to get the order id from redis
    // because atm we cannot update monty client to send it
    this.orderId = await this.getOrderId(this.headers.cookie)
    return super.execute()
  }
}

export const deletePromoSpec = {
  summary: 'Delete a promotion code',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        required: ['promotionCode'],
        properties: {
          promotionCode: {
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
