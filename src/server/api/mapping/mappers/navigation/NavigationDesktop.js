import Mapper from '../../Mapper'
import navTransform from '../../transforms/desktopNavigation'

export default class NavigationDesktop extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/CategoryDetails'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig || {}
    this.query = { langId, catalogId, storeId }
  }

  mapResponseBody(body = {}) {
    return navTransform(body)
  }
}
