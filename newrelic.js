/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
const packageJson = require('./package.json')

exports.config = {
  /**
   * Array of application names.
   */
  app_name: process.env.NEWRELIC_APP_NAME
    ? [process.env.NEWRELIC_APP_NAME]
    : [`Monty-v${packageJson.version}`],

  apdex_t: 0.3,

  capture_params: true,

  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEWRELIC_KEY,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: process.env.NEWRELIC_LEVEL || 'info',
  },
  rules: {
    ignore: ['^/health$'],
  },
  error_collector: {
    /**
     * 440 - session timeouts (expected)
     */
    expected_status_codes: [440],
  },
}
