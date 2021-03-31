import Boom from 'boom'
import * as logger from '../lib/logger'
import { validateSnsRequest, handleSnsMessage } from './lib/sns-service'

export default function snsTopicHandler(req, reply) {
  const payload =
    typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload

  validateSnsRequest(payload, (err, snsMessage) => {
    if (err) {
      logger.error('SNS Validation', {
        loggerMessage: err.message,
      })

      return reply(Boom.wrap(err))
    }

    const { Type, Message } = snsMessage

    if (Type.includes('Notification')) {
      return reply(handleSnsMessage(Message))
    }

    return reply(Boom.badRequest('Invalid sns request'))
  })
}
