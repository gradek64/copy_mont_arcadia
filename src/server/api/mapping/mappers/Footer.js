import Mapper from '../Mapper'

export default class Footer extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/FooterDisplay'
    this.method = 'get'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      langId,
      storeId,
      catalogId,
    }
    this.payload = {}
  }
}
