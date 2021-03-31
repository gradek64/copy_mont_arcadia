const newrelic = process.env.NEWRELIC_KEY ? require('newrelic') : null

const levels = process.env.NEWRELIC_INSIGHTS_LOG_LEVELS
  ? process.env.NEWRELIC_INSIGHTS_LOG_LEVELS.split(',')
  : ['error', 'info']

const noop = () => {}

// Environment variables
// NEWRELIC_INSIGHTS_LOG_LEVELS - levels to send to new relic (e.g. trace,info)
export const recordCustomEvent =
  newrelic && process.env.NEW_RELIC_RECORD_CUSTOM_EVENTS === 'true'
    ? (level, attributes, always) => {
        if (always || levels.includes(level))
          newrelic.recordCustomEvent(level, attributes)
      }
    : noop

export const noticeError = newrelic
  ? (error, attributes) => {
      attributes = typeof attributes === 'object' ? attributes : { attributes }
      newrelic.noticeError(error, attributes)
    }
  : noop

export const addCustomAttribute = newrelic
  ? newrelic.addCustomAttribute.bind(newrelic)
  : noop

export const getBrowserScript = () =>
  newrelic ? newrelic.getBrowserTimingHeader() : ''
