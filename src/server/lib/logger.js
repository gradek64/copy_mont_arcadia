import bunyan from 'bunyan'
import * as newrelic from './newrelic'
import { printLog, maskObject } from './logger-utils'

const bLog = bunyan.createLogger({
  name: 'monty',
  level: process.env.LOGGING_LEVEL
    ? process.env.LOGGING_LEVEL.toLowerCase()
    : 'info',
})

const checkLevels = (levels) => {
  return (
    process.env.LOGGING_LEVEL &&
    levels.indexOf(process.env.LOGGING_LEVEL.toUpperCase()) > -1
  )
}

export const isTraceLoggingEnabled = () => checkLevels(['TRACE'])

export const isDebugLoggingEnabled = () => checkLevels(['TRACE', 'DEBUG'])

export const isInfoLoggingEnabled = () =>
  checkLevels(['TRACE', 'DEBUG', 'INFO'])

export function trace(message, jsonObject) {
  if (isTraceLoggingEnabled()) {
    bLog.trace({ ...maskObject(jsonObject), namespace: message })
    printLog('trace', message, maskObject(jsonObject))
  }
}

export function debug(message, jsonObject) {
  if (isDebugLoggingEnabled()) {
    bLog.debug({ ...maskObject(jsonObject), namespace: message })
    printLog('debug', message, jsonObject)
  }
}

/**
 * @param {String} message
 * @param {Object} jsonObject
 */
export const info = (message, jsonObject) => {
  if (isInfoLoggingEnabled()) {
    newrelic.recordCustomEvent('info', maskObject({ message, ...jsonObject }))
    bLog.info({ ...maskObject(jsonObject), namespace: message })
    printLog('info', message, jsonObject)
  }
}

export function error(error, jsonObject, _bLog = bLog) {
  const message = typeof error !== 'string' ? error.message : error

  newrelic.noticeError(error, jsonObject)
  if (process.env.DO_NOT_LOG_ERRORS_WITH_BUNYAN !== 'true') {
    _bLog.error({ ...maskObject(jsonObject), namespace: message })
  }
  printLog('error', message, jsonObject)
}

export function setCustomAttribute(key, value) {
  if (key && value) {
    newrelic.addCustomAttribute(key, value)
  }
}

export function generateTransactionId() {
  return `STRANS${Date.now()}R${Math.floor(Math.random() * 1000000, 0)}`
}
