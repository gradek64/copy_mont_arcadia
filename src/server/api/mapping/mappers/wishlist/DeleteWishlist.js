import Mapper from '../../Mapper'
import Boom from 'boom'

export default class DeleteWishlist extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/AjaxGiftListServiceDeleteGiftList'
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { wishlistId: giftListId } = this.payload

    this.payload = {
      catalogId,
      langId,
      storeId,
      giftListId,
    }

    this.method = 'post'
  }

  mapResponseBody(body) {
    if (!body.success || body.success === 'false')
      return this.mapResponseError(body)
    return body
  }

  mapResponseError(body) {
    throw body.message ? Boom.badData(body.message) : body // TODO: see if Cogz can add a message to this response
  }
}
