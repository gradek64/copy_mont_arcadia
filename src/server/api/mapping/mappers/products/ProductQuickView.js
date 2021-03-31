import Mapper from '../../Mapper'

export default class ProductQuickView extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/ArcadiaQuickView'
    this.method = 'get'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { productId } = this.query
    this.query = {
      productId,
      langId,
      storeId,
      catalogId,
    }
    this.payload = {}
  }
}

export const productQuickViewSpec = {
  summary: 'Get the quickview of a product',
  parameters: [
    {
      name: 'productId',
      in: 'query',
      type: 'string',
      required: true,
    },
  ],
}
