import HealthCheck from './lib/healthcheck'
import superagent from '../../shared/lib/superagent'
import * as logger from '../../server/lib/logger'

let healthCheck = null
if (superagent.cache && superagent.cache.db) {
  healthCheck = new HealthCheck(superagent.cache.db)
}

export function getHealthCheckHandler(_, reply) {
  if (!healthCheck) return reply('No redis cache').code(404)
  const transactionId = logger.generateTransactionId()
  logger.info('health:check', { loggerMessage: 'redisPing', transactionId })
  logger.info('health:check', {
    loggerMessage: 'redis',
    transactionId,
    success: healthCheck.isHealthCheckSuccessful(),
  })
  return reply('Ok').code(200)
}
