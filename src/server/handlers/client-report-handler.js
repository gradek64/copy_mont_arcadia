import * as logger from '../lib/logger'

export const processReport = (req, reply) => {
  const { namespace, customClass, ...attributes } = req.payload || {}
  const log = logger[req.params.ltype] || (() => {})

  log(`client:${namespace}`, attributes)

  reply()
}
