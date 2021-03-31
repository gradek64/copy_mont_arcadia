import Mapper from '../../Mapper'
import Boom from 'boom'

export default class CMSPageName extends Mapper {
  mapEndpoint() {
    const { siteId: storeId } = this.storeConfig
    this.destinationEndpoint = `/wcs/resources/store/${storeId}/cmsPage/byName`
  }

  mapRequestParameters() {
    const { langId, siteId: storeId } = this.storeConfig
    const { pageName } = this.params

    if (!pageName) throw Boom.badData('Missing url parameter "pageName"')

    this.query = {
      langId,
      storeId,
      pageName,
    }
  }
}

export const cmsPageNameSpec = {
  summary: 'Get CMS content by page name',
  parameters: [
    {
      type: 'string',
      name: 'pageName',
      in: 'path',
      required: true,
      description: 'The page name of the CMS content to be fetched',
    },
  ],
}
