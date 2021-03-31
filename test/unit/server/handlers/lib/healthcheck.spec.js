import HealthCheck from '../../../../../src/server/handlers/lib/healthcheck'

test('healthcheck succeeds if cache server is available', () => {
  const redis = {
    ping: () => {
      return true
    },
  }
  const healthCheckHandler = new HealthCheck(redis)
  expect(healthCheckHandler.isHealthCheckSuccessful()).toBeTruthy()
})

test('healthcheck fails if cache server is unavailable', () => {
  const redis = {
    ping: () => {
      return false
    },
  }
  const healthCheckHandler = new HealthCheck(redis)
  expect(healthCheckHandler.isHealthCheckSuccessful()).toBeFalsy()
})

test('healthcheck fails if redis dependency is not an object', () => {
  const redis = 'not an object'
  const healthCheckHandler = new HealthCheck(redis)
  expect(healthCheckHandler.isHealthCheckSuccessful()).toBeFalsy()
})

test('healthcheck fails if ping function does not exist', () => {
  const redis = {}
  const healthCheckHandler = new HealthCheck(redis)
  expect(healthCheckHandler.isHealthCheckSuccessful()).toBeFalsy()
})
