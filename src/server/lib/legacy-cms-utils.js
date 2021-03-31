import * as logger from '../../server/lib/logger'
import Boom from 'boom'

export function logLegacyCmsResponse(request, response, err) {
  if (err) {
    logger.error('legacyCMS', { loggerMessage: 'error', ...err })
    return
  }

  logger.debug('legacyCMS', {
    loggerMessage: 'response',
    statusCode: response.statusCode,
    method: request.method.toUpperCase(),
    url: request.url.path,
  })
}

export function logLegacyCmsRequest(request) {
  logger.debug('legacyCMS', {
    loggerMessage: 'request',
    method: request.method.toUpperCase(),
    url: request.url.path,
  })
}

export function sanitizeResponseAndReply() {
  return (err, res, request, reply) => {
    logLegacyCmsResponse(request, res, err)

    console.log('node sanitizeResponseAndReply: res:', res, 'err', err)

    if (err) {
      return reply(Boom.badImplementation('Error response from legacyCMS'))
    }

    if (res.on) {
      let response = ''
      res.on('data', (chunk) => {
        response += chunk
      })
      res.on('end', () => reply(null, response).code(410))
    } else {
      return reply(null, res).code(410)
    }
  }
}
