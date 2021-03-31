import Mapper from '../../Mapper'

export default class KeepAlive extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/GetCurrentTimeView'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig

    this.query = {
      catalogId,
      langId,
      storeId,
    }
  }
}
