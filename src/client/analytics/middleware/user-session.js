import { path } from 'ramda'
import dataLayer from '../../../shared/analytics/dataLayer'
import { addStateListeners } from '../storeObserver'
import { addPostDispatchListeners } from './analytics-middleware'
import * as Logger from '../../../client/lib/logger'
import { getItem } from '../../../client/lib/cookie/utils'

// selectors
import { getDDPUserAnalyticsProperties } from '../../../shared/selectors/ddpSelectors'
import { getHashedUserEmail } from '../../../shared/selectors/common/accountSelectors'
import { getUserAuthState } from '../../../shared/selectors/userAuthSelectors'

import { boolToString } from '../../../shared/analytics/analytics-utils'

export const triggered = {
  cacheListener: false,
}

const pushUserState = (state) => {
  const loggedIn =
    state && path(['account', 'user', 'userTrackingId'], state) != null
  const dualRun = getItem('dual-run') || 'none'
  const hashedUserEmail = getHashedUserEmail(state)

  const user = {
    ...getDDPUserAnalyticsProperties(state),
    loggedIn: boolToString(loggedIn),
    dualRun,
    authState: getUserAuthState(state),
  }

  if (loggedIn && hashedUserEmail) {
    user.hashedEmailAddress = hashedUserEmail
  }

  const userTrackingId = path(['account', 'user', 'userTrackingId'], state)
  if (loggedIn && userTrackingId) {
    user.id = userTrackingId.toString()
  } else {
    user.id = undefined
  }

  const data = { user }
  dataLayer.push(data, 'userSessionSchema', 'userState')
  Logger.info('gtm.usersession', { dataLayer: data })
}

// On initial load, once the local cache has been checked for, fill the dataLayer with the current
// user state to be used by all subsequent events like 'pageView'
export const cacheActionListener = (action, store) => {
  if (!triggered.cacheListener) {
    pushUserState(store.getState())
    triggered.cacheListener = true
  }
}

// If the user logs in/out, trigger a userStateChange event with the new state
export const userSessionStateListener = (oldState, newState) => {
  const oldLoggedIn =
    oldState && path(['account', 'user', 'userTrackingId'], oldState)
  const newLoggedIn =
    newState && path(['account', 'user', 'userTrackingId'], newState)

  if (triggered.cacheListener && oldLoggedIn !== newLoggedIn) {
    pushUserState(newState)
  }
}

export default () => {
  addStateListeners(userSessionStateListener)

  addPostDispatchListeners('PAGE_LOADED', cacheActionListener)
}
