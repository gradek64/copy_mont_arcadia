import * as logger from '../../server/lib/logger'
import Boom from 'boom'

const replyWithData = (response, reply) => {
  try {
    // Removing new line character that would break the application's Store in case of server-side-redering of TermsAndConditions.
    response = response.replace(/\u2028/g, '')

    const r = JSON.parse(response)

    reply(null, r)
  } catch (e) {
    reply(Boom.wrap(e, 500, 'Unexpected response format from mrCMS'))
  }
}

export function logMrCmsResponse(request, response, err) {
  if (err) {
    logger.error('mrCMS', err)
    return
  }

  logger.info('mrCMS', {
    loggerMessage: 'response',
    statusCode: response.statusCode,
    method: request.method.toUpperCase(),
    path: request.url.path,
  })
}

export function logMrCmsRequest(req) {
  logger.info('mrCMS', {
    loggerMessage: 'request',
    method: req.method.toUpperCase(),
    path: req.url.path,
  })
}

export function sanitizeResponseAndReply(err, res, request, reply) {
  logMrCmsResponse(request, res, err)

  if (err) {
    return reply(Boom.badImplementation('Error response from mrCMS'))
  }

  if (res.on) {
    let response = ''
    res.on('data', (chunk) => {
      response += chunk
    })
    res.on('end', () => replyWithData(response, reply))
  } else {
    return replyWithData(res.Payload, reply)
  }
}
