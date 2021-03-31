import Mapper from '../Mapper'

export default class Home extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/TopCategoriesDisplay'
  }

  mapRequestParameters() {
    const { langId, siteId: storeId, catalogId } = this.storeConfig

    this.query = {
      langId,
      storeId,
      catalogId,
    }
  }
}

export const homeSpec = {
  summary: 'Get Home page information and espots.',
}
