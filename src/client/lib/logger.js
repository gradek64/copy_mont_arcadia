import { errorReport, infoReport, debugReport } from './reporter'
import { getTraceIdFromCookie } from '../../../src/shared/lib/cookie'
/**
 * Make sure that namespace isn't something generic such as "error" or "client-error" so that
 * we can filter the errors properly in New Relic.
 */
export const error = (namespace, error) => errorReport(namespace, error)

export const info = (namespace, data) => infoReport(namespace, data)

export const debug = (namespace, data) => debugReport(namespace, data)

export const generateTransactionId = () =>
  `STRANS${Date.now()}R${Math.floor(Math.random() * 1000000, 0)}`

export const nrBrowserLogError = (message, error) => {
  if (
    process.browser &&
    window.NREUM &&
    typeof window.NREUM.noticeError === 'function'
  ) {
    window.NREUM.noticeError(error, {
      extraDetail: message,
      traceId: getTraceIdFromCookie(window.document.cookie) || '',
    })
  }
}
