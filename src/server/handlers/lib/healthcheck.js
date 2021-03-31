export default class HealthCheck {
  constructor(nodeRedis) {
    this.nodeRedis = nodeRedis
  }

  isHealthCheckSuccessful() {
    return (
      typeof this.nodeRedis === 'object' &&
      typeof this.nodeRedis.ping === 'function' &&
      !!this.nodeRedis.ping()
    )
  }
}
