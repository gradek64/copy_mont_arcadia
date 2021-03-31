import Mapper from '../../Mapper'
import Boom from 'boom'

export default class GetSeeMore extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint =
      '/webapp/wcs/stores/servlet/ArcadiaSeeMoreDisplay'
    this.method = 'get'
  }

  mapRequestParameters() {
    if (!this.query.endecaUrl)
      throw Boom.badRequest('Missing endecaUrl query string parameter')

    this.query = {
      storeId: this.storeConfig.siteId,
      langId: this.storeConfig.langId,
      catalogId: this.storeConfig.catalogId,
      endecaUrl: this.query.endecaUrl,
    }
    this.payload = {}
  }

  async execute() {
    return super.execute()
  }
}

export const getSeeMoreSpec = {
  summary: 'Gets a list of products for a promotion',
  parameters: [
    {
      name: 'endecaUrl',
      in: 'query',
      type: 'string',
      required: true,
    },
  ],
}
