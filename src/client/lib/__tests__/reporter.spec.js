import {
  infoReport,
  debugReport,
  errorReport,
  errorReportEvent,
  start,
} from '../reporter'

import { times } from 'ramda'
import { postToServer } from '../reporter-utils'

jest.mock('../reporter-utils', () => ({
  postToServer: jest.fn(),
}))

jest.mock('../../../shared/selectors/featureSelectors')
import {
  isFeatureSendClientInfoToServer,
  isFeatureSendClientErrorToServer,
} from '../../../shared/selectors/featureSelectors'

jest.mock('../../../shared/lib/get-value-from-store')
import { getStateFromStoreRef } from '../../../shared/lib/get-value-from-store'

describe('reporter', () => {
  const logginLevel = global.process.env.LOGGING_LEVEL
  const processBrowser = global.process.browser
  const addEvent = global.window.addEventListener

  beforeEach(() => {
    jest.clearAllMocks()
    global.process.env.LOGGING_LEVEL = logginLevel
    global.window.addEventListener = addEvent

    getStateFromStoreRef.mockReturnValue({})
    isFeatureSendClientErrorToServer.mockReturnValue(true)
    global.process.browser = true
  })

  afterEach(() => {
    global.process.browser = processBrowser
  })

  describe('infoReport', () => {
    it('does not call the server endpoint client-info if the state is not available', () => {
      getStateFromStoreRef.mockReturnValueOnce(undefined)

      global.process.browser = true

      infoReport()

      expect(postToServer).not.toHaveBeenCalled()
    })
    it('does not call the server endpoint client-info if not client side', () => {
      getStateFromStoreRef.mockReturnValueOnce({})
      isFeatureSendClientInfoToServer.mockReturnValueOnce(true)
      global.process.browser = false

      infoReport()

      expect(postToServer).not.toHaveBeenCalled()
    })
    it('does not call the server endpoint client-info if associated feature flag is not enabled', () => {
      getStateFromStoreRef.mockReturnValueOnce({})
      isFeatureSendClientInfoToServer.mockReturnValueOnce(false)
      global.process.browser = true

      infoReport()

      expect(postToServer).not.toHaveBeenCalled()
    })
    it('infoReport null', () => {
      getStateFromStoreRef.mockReturnValueOnce({})
      isFeatureSendClientInfoToServer.mockReturnValueOnce(true)
      global.process.browser = true

      infoReport()
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-info',
        'client-info',
        {}
      )
    })
    it('infoReport title', () => {
      getStateFromStoreRef.mockReturnValueOnce({})
      isFeatureSendClientInfoToServer.mockReturnValueOnce(true)
      global.process.browser = true

      infoReport('title', { aaa: 'bbb' })
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith('client-info', 'title', {
        aaa: 'bbb',
      })
    })
  })

  describe('debugReport', () => {
    beforeEach(() => {
      window.history.pushState({}, 'Test Title', '/route?debuglog=true')
    })

    it('debugReport null', () => {
      debugReport()
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-debug',
        'client-debug',
        {}
      )
    })

    it('debugReport title', () => {
      debugReport('title', { aaa: 'bbb' })
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith('client-debug', 'title', {
        aaa: 'bbb',
      })
    })
  })

  describe('errorReport', () => {
    it('does not call the server endpoint client-error if the state is not available', () => {
      getStateFromStoreRef.mockReturnValueOnce(undefined)

      errorReport()

      expect(postToServer).not.toHaveBeenCalled()
    })
    it('does not call the server endpoint client-error if not client side', () => {
      isFeatureSendClientErrorToServer.mockReturnValueOnce(true)
      global.process.browser = false

      errorReport()

      expect(postToServer).not.toHaveBeenCalled()
    })
    it('does not call the server endpoint client-error if associated feature flag is not enabled', () => {
      isFeatureSendClientErrorToServer.mockReturnValueOnce(false)

      errorReport()

      expect(postToServer).not.toHaveBeenCalled()
    })

    it('default values', () => {
      errorReport()
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-error',
        'client-error',
        {}
      )
    })

    it('set values', () => {
      errorReport('tsuk', { aaa: 'bbb' })
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith('client-error', 'tsuk', {
        aaa: 'bbb',
      })
    })

    it('reduces duplicate messages', () => {
      times(() => {
        errorReportEvent({
          message: 'error test',
          filename: 'bbb',
          lineno: 1,
          error: {
            stack: 'cccc',
          },
          nativeError: {
            stack: 'ddddd',
          },
        })
      }, 10)

      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-error',
        'errorEvent:error test',
        {
          message: 'error test',
          filename: 'bbb',
          lineno: 1,
          error: {
            stack: 'cccc',
          },
          nativeError: {
            stack: 'ddddd',
          },
          stack: 'cccc',
        }
      )
    })
  })

  describe('errorReportEvent', () => {
    it('set values from error', () => {
      errorReportEvent({
        message: 'aaa',
        filename: 'bbb',
        lineno: 1,
        error: {
          stack: 'cccc',
        },
        nativeError: {
          stack: 'ddddd',
        },
      })
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-error',
        'errorEvent:aaa',
        {
          filename: 'bbb',
          lineno: 1,
          message: 'aaa',
          stack: 'cccc',
          nativeError: { stack: 'ddddd' },
          error: { stack: 'cccc' },
        }
      )
    })

    it('set values from nativeError', () => {
      errorReportEvent({
        message: 'xxx',
        filename: 'bbb',
        lineno: 1,
        nativeError: {
          stack: 'ddddd',
        },
      })
      expect(postToServer).toHaveBeenCalledTimes(1)
      expect(postToServer).toHaveBeenCalledWith(
        'client-error',
        'errorEvent:xxx',
        {
          filename: 'bbb',
          lineno: 1,
          message: 'xxx',
          stack: 'ddddd',
          nativeError: { stack: 'ddddd' },
        }
      )
    })
  })

  describe('throttle by message', () => {
    const errorEvent = {
      message: 'message',
      filename: 'bbb',
      lineno: 1,
      error: {
        stack: 'cccc',
      },
      nativeError: {
        stack: 'ddddd',
      },
    }
    it('should logged 2 different messages', () => {
      ;['test message 1', 'test message 2'].forEach((message) => {
        times(() => {
          errorReportEvent({
            ...errorEvent,
            message,
          })
        }, 20)
      })
      expect(postToServer).toHaveBeenCalledTimes(2)
      expect(postToServer.mock.calls[0]).toEqual([
        'client-error',
        'errorEvent:test message 1',
        {
          ...errorEvent,
          message: 'test message 1',
          stack: 'cccc',
        },
      ])
      expect(postToServer.mock.calls[1]).toEqual([
        'client-error',
        'errorEvent:test message 2',
        {
          ...errorEvent,
          message: 'test message 2',
          stack: 'cccc',
        },
      ])
    })

    it('should remove message from messages after timeout', () => {
      jest.useFakeTimers()

      errorReportEvent(errorEvent)
      expect(postToServer).toHaveBeenCalledTimes(1)

      jest.runAllTimers() // expire throttling process.env.ERROR_REPORT_THROTTLE_TIMEOUT || 2000

      errorReportEvent(errorEvent)
      expect(postToServer).toHaveBeenCalledTimes(2)
    })
  })

  describe('start', () => {
    it('hooks with error', () => {
      const addEventListenerMock = jest.fn()
      global.window.addEventListener = addEventListenerMock
      start()
      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      expect(addEventListenerMock).toHaveBeenCalledWith(
        'error',
        errorReportEvent
      )
    })
  })
})
