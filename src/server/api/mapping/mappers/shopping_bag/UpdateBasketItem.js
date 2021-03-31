import Boom from 'boom'
import Mapper from '../../Mapper'
import orderSummaryTransform, {
  checkIfBasketObjectWithError,
} from '../../transforms/orderSummary'
import basketTransform from '../../transforms/basket'

function getOrderItemUpdateQuery(catEntryIdToAdd, responseType) {
  return {
    catEntryId: catEntryIdToAdd,
    URL: `OrderCalculate?URL=${
      responseType === 'orderSummary'
        ? 'DeliveryPageUpdateAjaxView'
        : 'ShoppingBagUpdateItemAjaxView'
    }`,
  }
}

function getOrderItemDeleteQuery(
  catEntryIdToDelete,
  catEntryIdToAdd,
  responseType
) {
  return {
    catEntryId: catEntryIdToDelete,
    pageName: 'shoppingBag',
    URL: `OrderItemAddAjax?catEntryId=${catEntryIdToAdd}&URL=OrderCalculate?URL=${
      responseType === 'orderSummary'
        ? 'DeliveryPageUpdateAjaxView'
        : 'ShoppingBagUpdateItemAjaxView'
    }`,
  }
}

export default class UpdateBasketItem extends Mapper {
  constructor(...args) {
    super(...args)

    // if the user changes the item in the bag (by size etc) we first need to remove
    // the old catEntryId (catEntryIdToDelete) then add the new one (catEntryIdToAdd)
    this.shouldDeleteItemFirst =
      this.payload.catEntryIdToAdd !== this.payload.catEntryIdToDelete
  }

  mapEndpoint() {
    this.destinationEndpoint = this.shouldDeleteItemFirst
      ? '/webapp/wcs/stores/servlet/OrderItemDelete'
      : '/webapp/wcs/stores/servlet/OrderItemUpdateAjax'
    this.method = 'post'
  }

  mapRequestParameters() {
    const queryDefaults = {
      orderId: this.orderId,
      updatePrices: 1,
      calculationUsageId: [-1, -2, -7],
      langId: this.storeConfig.langId,
      storeId: this.storeConfig.siteId,
      catalogId: this.storeConfig.catalogId,
      calculateOrder: 1,
      quantity: this.payload.quantity,
      sourcePage: 'PaymentDetails',
      isSizeUpdate: true,
      errorViewName: 'ShoppingBagUpdateItemAjaxView',
    }
    this.responseType = this.payload.responseType
    if (this.shouldDeleteItemFirst) {
      this.query = {
        ...queryDefaults,
        ...getOrderItemDeleteQuery(
          this.payload.catEntryIdToDelete,
          this.payload.catEntryIdToAdd,
          this.responseType
        ),
      }
    } else {
      this.query = {
        ...queryDefaults,
        ...getOrderItemUpdateQuery(
          this.payload.catEntryIdToAdd,
          this.responseType
        ),
        getOrderItemFromCookie: true,
      }
    }

    this.payload = {}
  }

  mapResponseBody(body = {}) {
    const basket = checkIfBasketObjectWithError(body)
    if (basket) return basketTransform(basket, this.storeConfig.currencySymbol)

    return this.responseType === 'orderSummary'
      ? orderSummaryTransform(
          body.orderSummary,
          false,
          this.storeConfig.currencySymbol
        )
      : basketTransform(body, this.storeConfig.currencySymbol)
  }

  mapResponseError(error) {
    if (error.isBoom || error.message === 'wcsSessionTimeout') {
      throw error
    }

    throw Boom.internal(error)
  }

  async execute() {
    this.orderId = await this.getOrderId(this.headers.cookie)

    return super.execute()
  }
}

export const updateItemSpec = {
  summary: "Update an item's quantity, size or colour",
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          catEntryIdToAdd: {
            type: 'integer',
            format: 'int32',
          },
          catEntryIdToDelete: {
            type: 'integer',
            format: 'int32',
          },
          quantity: {
            type: 'string',
          },
          responseType: {
            type: 'string',
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
