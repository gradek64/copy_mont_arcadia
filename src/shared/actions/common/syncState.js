import { path, isEmpty } from 'ramda'
import storageHandlers from '../../../client/lib/state-sync/handlers/index'
import { isGuestOrder } from '../../selectors/checkoutSelectors'
import { isOrderComplete } from '../../selectors/routingSelectors'

// This checks if it is a guest user and if it is in the order-complete
// This scenario is needed when a guest completes the order but it then register in a new tab
// With the code below we force the auth state to sync if the lastPersistTime does not update and if it is a guest user
const syncGuestUserState = (state) =>
  isGuestOrder(state) &&
  isOrderComplete(state) &&
  localStorage.getItem('cached_auth')

export const syncState = (keys = []) => {
  return (dispatch, getState) => {
    const storageKeys = keys.length ? keys : Object.keys(storageHandlers)
    storageKeys.forEach((key) => {
      const storageHandler = storageHandlers[key]
      const data = storageHandler.retrieve()
      const state = getState()
      const guestState = syncGuestUserState(state)
      const lastPersistedTimeData = path(['lastPersistTime'], data)
      const lastPersistedTimeKey = path(['lastPersistTime'], state[key])

      if (
        (path([key], state) && !lastPersistedTimeKey) ||
        (lastPersistedTimeKey &&
          lastPersistedTimeData &&
          state[key].lastPersistTime < data.lastPersistTime) ||
        (lastPersistedTimeKey &&
          (lastPersistedTimeData &&
            (state[key].lastPersistTime === data.lastPersistTime &&
              guestState)))
      ) {
        if (data && !isEmpty(data)) {
          dispatch({
            type: storageHandler.mergeActionType,
            data,
          })
        }
        if (storageHandler.updateAction && storageHandler.updateAction()) {
          dispatch(storageHandler.updateAction())
        }
      }
    })
  }
}
