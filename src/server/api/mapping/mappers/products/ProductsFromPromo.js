import Mapper from '../../Mapper'

export default class ProductsFromPromo extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/DisplayPromoLanding'
    this.method = 'get'
    this.timeout = 10000
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { promoId } = this.query
    this.query = {
      promoId,
      langId,
      storeId,
      catalogId,
    }
    this.payload = {}
  }
}

export const productsFromPromoSpec = {
  summary: 'Gets a list of products for a promotion',
  parameters: [
    {
      name: 'promoId',
      in: 'query',
      type: 'string',
      required: true,
    },
  ],
}
