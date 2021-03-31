import Mapper from '../../Mapper'
import { path } from 'ramda'

export default class GetSavedBasket extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/SaveForLaterAjaxView'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      catalogId,
      langId,
      storeId,
      getBag: 'false',
    }
  }

  mapResponseBody(body) {
    return {
      savedProducts: path(['savedProducts', 'Product'], body),
    }
  }
}

export const getSavedBasketSpec = {
  summary: 'Get all saved products',
  responses: {
    200: {
      description: 'Saved products',
      schema: {
        type: 'object',
        properties: {
          savedProducts: {
            $ref: '#/definitions/savedBasketProduct',
          },
        },
      },
    },
  },
}
