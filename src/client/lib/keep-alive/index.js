import { get } from '../../../shared/lib/api-service'
import { initialise, onUserActiveFromIdle, userIsIdle } from './user-idle'
import { isUserAuthenticated } from '../../../shared/selectors/userAuthSelectors'

let reduxStore
let initialized = false
let KEEP_ALIVE_INTERVAL = 1000 * 60 * 5
const errorMargin = 1000

const notifyOtherBrowserTabs = (t) => {
  window.localStorage.setItem('monty-keep-alive', t)
}

const getLastBrowserTabPollTime = () =>
  window.localStorage.getItem('monty-keep-alive') ||
  Date.now() - KEEP_ALIVE_INTERVAL

const pollKeepAlive = () => {
  if (!isUserAuthenticated(reduxStore.getState())) return
  const lastPollTime = getLastBrowserTabPollTime()

  // setInterval isn't 100% accurate, it may trigger a little early
  // so we check if timeout - errorMargin has elasped to account for it
  const toSoonToPoll =
    Date.now() - lastPollTime < KEEP_ALIVE_INTERVAL - errorMargin
  if (toSoonToPoll) return

  reduxStore.dispatch(get('/keep-alive')).catch(() => {
    // All possible errors are expected so no need to do anything in here.
    // However, we should still catch the error here to reduce logging noise.
  })
  notifyOtherBrowserTabs(Date.now())
}

let pollIntervalId
let pollingStarted = false
export const stopKeepAlivePolling = () => {
  pollingStarted = false
  window.clearInterval(pollIntervalId)
}
const startKeepAlivePolling = () => {
  if (pollingStarted) return

  pollingStarted = true
  pollKeepAlive()
  pollIntervalId = window.setInterval(() => {
    pollKeepAlive()
    if (userIsIdle()) stopKeepAlivePolling()
  }, KEEP_ALIVE_INTERVAL)
}
const isPolling = () => pollingStarted

const initKeepAlivePolling = (store, keepAliveInterval) => {
  if (typeof keepAliveInterval !== 'number')
    throw new Error('Must initialize keep alive with an interval')

  reduxStore = store
  KEEP_ALIVE_INTERVAL = keepAliveInterval
  onUserActiveFromIdle(() => {
    if (initialized && !isPolling()) startKeepAlivePolling()
  })
  initialise()

  initialized = true
  startKeepAlivePolling()
}
export default initKeepAlivePolling
