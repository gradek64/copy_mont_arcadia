import {
  isTraceLoggingEnabled,
  isDebugLoggingEnabled,
  isInfoLoggingEnabled,
  trace,
  debug,
  info,
  error,
  setCustomAttribute,
} from '../logger'

import * as newrelic from '../newrelic'

jest.genMockFromModule('bunyan')

jest.mock('../logger-utils', () => ({
  printLog: jest.fn(),
  maskObject: jest.fn(),
}))

jest.mock('../newrelic')

import { printLog, maskObject } from '../logger-utils'

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    global.process.env.LOGGING_LEVEL = undefined
    global.process.env.LOG_ERRORS_WITH_BUNYAN = undefined
  })

  it('log trace when trace', () => {
    global.process.env.LOGGING_LEVEL = 'TRACE'
    maskObject.mockReturnValue({ aaa: 'bbb' })
    trace('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(1)
    expect(printLog).toHaveBeenCalledWith('trace', 'message', { aaa: 'bbb' })
  })

  it('not log trace when debug', () => {
    global.process.env.LOGGING_LEVEL = 'DEBUG'
    trace('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(0)
  })

  it('logs debug when debug', () => {
    global.process.env.LOGGING_LEVEL = 'DEBUG'
    debug('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(1)
    expect(printLog).toHaveBeenCalledWith('debug', 'message', { aaa: 'bbb' })
  })

  it('logs debug when trace', () => {
    global.process.env.LOGGING_LEVEL = 'TRACE'
    debug('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(1)
    expect(printLog).toHaveBeenCalledWith('debug', 'message', { aaa: 'bbb' })
  })

  it('not log debug when info', () => {
    global.process.env.LOGGING_LEVEL = 'INFO'
    debug('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(0)
  })

  it('logs info', () => {
    global.process.env.LOGGING_LEVEL = 'INFO'
    info('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(1)
    expect(printLog).toHaveBeenCalledWith('info', 'message', { aaa: 'bbb' })
  })

  it('loggs error', () => {
    error('message', { aaa: 'bbb' })
    expect(printLog).toHaveBeenCalledTimes(1)
    expect(printLog).toHaveBeenCalledWith('error', 'message', { aaa: 'bbb' })
  })

  describe('logLevels', () => {
    const loggingLevel = global.process.env.LOGGING_LEVEL
    beforeEach(() => {
      global.process.env.LOGGING_LEVEL = loggingLevel
    })

    it('isTraceLoggingEnabled', () => {
      global.process.env.LOGGING_LEVEL = 'TRACE'
      expect(isTraceLoggingEnabled()).toEqual(true)
      global.process.env.LOGGING_LEVEL = 'DEBUG'
      expect(isTraceLoggingEnabled()).toEqual(false)
      global.process.env.LOGGING_LEVEL = 'INFO'
      expect(isTraceLoggingEnabled()).toEqual(false)
    })

    it('isDebugLoggingEnabled', () => {
      global.process.env.LOGGING_LEVEL = 'TRACE'
      expect(isDebugLoggingEnabled()).toEqual(true)
      global.process.env.LOGGING_LEVEL = 'DEBUG'
      expect(isDebugLoggingEnabled()).toEqual(true)
      global.process.env.LOGGING_LEVEL = 'INFO'
      expect(isDebugLoggingEnabled()).toEqual(false)
    })

    it('isInfoLoggingEnabled', () => {
      global.process.env.LOGGING_LEVEL = 'TRACE'
      expect(isInfoLoggingEnabled()).toEqual(true)
      global.process.env.LOGGING_LEVEL = 'DEBUG'
      expect(isInfoLoggingEnabled()).toEqual(true)
      global.process.env.LOGGING_LEVEL = 'INFO'
      expect(isInfoLoggingEnabled()).toEqual(true)
    })
  })

  describe('maskObject', () => {
    it('masks info', () => {
      global.process.env.LOGGING_LEVEL = 'DEBUG'
      debug('message', { aaa: 'bbb' })
      expect(maskObject).toHaveBeenCalledTimes(1)
      expect(maskObject).toHaveBeenCalledWith({ aaa: 'bbb' })
    })

    it('masks error', () => {
      global.process.env.LOG_ERRORS_WITH_BUNYAN = 'true'
      error('message', { aaa: 'bbb' })
      expect(maskObject).toHaveBeenCalledTimes(1)
      expect(maskObject).toHaveBeenCalledWith({ aaa: 'bbb' })
    })

    it('masks debug', () => {
      global.process.env.LOGGING_LEVEL = 'DEBUG'
      info('message', { aaa: 'bbb' })
      expect(maskObject).toHaveBeenCalledTimes(2)
      expect(maskObject).toHaveBeenCalledWith({ aaa: 'bbb' })
    })
  })

  describe('DO_NOT_LOG_ERRORS_WITH_BUNYAN', () => {
    it('if set to "true" then errors are not logged with bunyan', () => {
      global.process.env.DO_NOT_LOG_ERRORS_WITH_BUNYAN = 'true'
      const bLog = {
        error: jest.fn(),
      }
      error('message', { a: 'b' }, bLog)

      expect(bLog.error).toHaveBeenCalledTimes(0)
    })
    it('if not set to "true" then errors are logged with bunyan', () => {
      global.process.env.DO_NOT_LOG_ERRORS_WITH_BUNYAN = 'false'
      const bLog = {
        error: jest.fn(),
      }
      error('message', { a: 'b' }, bLog)

      expect(bLog.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('setCustomAttribute', () => {
    it('calls addCustomAttribute if key and value are provided', () => {
      setCustomAttribute('key', 'value')

      expect(newrelic.addCustomAttribute).toHaveBeenCalledWith('key', 'value')
    })

    it('does not call addCustomAttribute if key and value are not provided', () => {
      setCustomAttribute()

      expect(newrelic.addCustomAttribute).toHaveBeenCalledTimes(0)
    })
  })
})
