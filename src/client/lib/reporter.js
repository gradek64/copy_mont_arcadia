import { pathOr } from 'ramda'
import { postToServer } from './reporter-utils'
import { getTraceIdFromCookie } from '../../../src/shared/lib/cookie'
import {
  isFeatureSendClientInfoToServer,
  isFeatureSendClientErrorToServer,
} from '../../shared/selectors/featureSelectors'
import { getStateFromStoreRef } from '../../shared/lib/get-value-from-store'

export const isDebugLogEnabled = () =>
  process.browser &&
  pathOr('', ['document', 'location', 'search'], window).indexOf(
    'debuglog=true'
  ) > -1

export const infoReport = (namespace = 'client-info', infoObject = {}) => {
  const state = getStateFromStoreRef()
  const sendClientInfoToServer = state && isFeatureSendClientInfoToServer(state)

  if (process.browser && sendClientInfoToServer) {
    postToServer('client-info', namespace, infoObject)
  }
}

export const debugReport = (namespace = 'client-debug', debugObject = {}) => {
  if (isDebugLogEnabled()) {
    postToServer('client-debug', namespace, debugObject)
  }
}

const errorReportCreator = (namespace = 'client-error', errorObject = {}) => {
  const state = getStateFromStoreRef()
  const sendClientErrorToServer =
    state && isFeatureSendClientErrorToServer(state)

  if (process.browser) {
    if (process.env.ENABLE_CLIENT_ERROR_LOGGING) {
      window.console.error('client-error', namespace, errorObject)
    }

    if (sendClientErrorToServer) {
      return postToServer('client-error', namespace, errorObject)
    }
  }
}

const throttleByMessage = (func, timeout) => {
  const messages = {}
  return (namespace, errorObject = {}) => {
    const { message } = errorObject
    if (message && Object.keys(messages).includes(message)) {
      return
    }

    if (message) messages[message] = true
    func(namespace, errorObject)

    setTimeout(() => {
      if (message) delete messages[message]
    }, timeout)
  }
}

export const errorReport = throttleByMessage(
  errorReportCreator,
  process.env.ERROR_REPORT_THROTTLE_TIMEOUT || 2000
)

export const errorReportEvent = (errorEvent) => {
  const { message = '', filename, lineno, error, nativeError } = errorEvent
  const stack = (error && error.stack) || (nativeError && nativeError.stack)

  errorReport(`errorEvent${message ? `:${message}` : ''}`, {
    message,
    filename,
    lineno,
    stack,
    error,
    nativeError,
  })
}

export function start() {
  window.addEventListener('error', errorReportEvent)
}

if (isDebugLogEnabled()) {
  const traceId = getTraceIdFromCookie(window.document.cookie)
  if (traceId) {
    prompt('Your Trace Id is...', traceId) // eslint-disable-line no-alert
  } else {
    alert('Please refresh your browser') // eslint-disable-line no-alert
  }
}
