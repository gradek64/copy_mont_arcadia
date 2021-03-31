import Mapper from '../../Mapper'
import Boom from 'boom'

export default class CMSSeoUrl extends Mapper {
  mapEndpoint() {
    const { pathname } = this.query

    if (!pathname) throw Boom.badData('Missing query parameter "pathname"')

    this.destinationEndpoint = `${pathname}`
  }
}

export const cmsSeoUrlSpec = {
  summary: 'Get CMS JSON by relative url',
  parameters: [
    {
      type: 'string',
      name: 'pathname',
      in: 'query',
      required: true,
      description: 'The relative url of the cms content to be fetched',
    },
  ],
}
