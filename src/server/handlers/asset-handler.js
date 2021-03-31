import { join } from 'path'
import { getEtagMethod } from '../../shared/lib/cacheable-urls'
import { mrCmsAssetsHandler } from './mr-cms-handler'

export function assetHandler(req, reply) {
  const {
    url: { pathname },
  } = req
  if (pathname.includes('/assets/content/')) {
    return mrCmsAssetsHandler(req, reply)
  }

  return reply.file(join(__dirname, `../../../public/${req.params.pathName}`), {
    etagMethod: getEtagMethod('hapi', `/assets/${req.params.pathName}`),
  })
}
