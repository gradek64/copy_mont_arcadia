import * as logger from './logger'

export default function apply(server) {
  // See https://github.com/hapijs/hapi/blob/master/API.md#server-logs
  server.on('log', (event, tags) => {
    if (tags.client) return

    if (tags.load) {
      return logger.error('Request was rejected due to high load', event)
    }
    if (tags.error) {
      let info

      if (tags.internal) info = 'Internal implementation error'
      logger.error('Log event emitted with error tag', {
        lifecycle: 'log',
        info,
        ...event,
      })
    }
  })
}
