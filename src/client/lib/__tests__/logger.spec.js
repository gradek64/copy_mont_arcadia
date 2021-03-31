import { error, info, debug, nrBrowserLogError } from '../logger'
import { errorReport, infoReport, debugReport } from '../reporter'
import { getTraceIdFromCookie } from '../../../../src/shared/lib/cookie'

jest.mock('../reporter')
jest.mock('../../../../src/shared/lib/cookie')

describe('client logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('error', () => {
    it('passes error through to `errorReport`', () => {
      error('ERROR', { loggerMessage: 'An error occurred' })
      expect(errorReport).toHaveBeenCalledWith('ERROR', {
        loggerMessage: 'An error occurred',
      })
    })

    it('second arg `message` can be an object', () => {
      error('ERROR', { message: 'err', lineno: 100, filename: 'foo.js' })
      expect(errorReport).toHaveBeenCalledWith('ERROR', {
        message: 'err',
        lineno: 100,
        filename: 'foo.js',
      })
    })

    it('second arg `message` can be an instance of Error', () => {
      const errorEvent = new Error('Oh noes!')
      error('ERROR', errorEvent)
      expect(errorReport).toHaveBeenCalledWith('ERROR', errorEvent)
    })
  })

  describe('info', () => {
    it('passes everything to `infoReport` as JSON string', () => {
      info('error', { foo: 'bar' })
      expect(infoReport).toHaveBeenCalledWith('error', { foo: 'bar' })
    })
  })

  describe('debug', () => {
    it('passes everything to `debugReport` as JSON string', () => {
      debug('error', { foo: 'bar' })
      expect(debugReport).toHaveBeenCalledWith('error', { foo: 'bar' })
    })
  })

  describe('nrBrowserLogError', () => {
    it('should log the error to New Relic via the noticeError method', () => {
      const oldProcessBrowser = process.browser
      process.browser = true
      const mockNoticeError = jest.fn()
      window.NREUM = {
        noticeError: mockNoticeError,
      }
      const fakeTraceId = '123456'
      getTraceIdFromCookie.mockReturnValue(fakeTraceId)

      const myMessage = 'some description'
      const myError = new Error('some error')

      nrBrowserLogError(myMessage, myError)
      expect(mockNoticeError).toHaveBeenCalledWith(myError, {
        extraDetail: myMessage,
        traceId: fakeTraceId,
      })

      process.browser = oldProcessBrowser
      window.NREUM = undefined
    })
  })
})
