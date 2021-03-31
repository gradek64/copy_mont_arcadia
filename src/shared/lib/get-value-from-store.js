import R from 'ramda'
import { isUserAuthenticated } from '../selectors/userAuthSelectors'

let storeRef

export function makeReferenceToStore(store) {
  storeRef = store
}

export function getValueFromStore(path) {
  return R.path(path)(storeRef.getState())
}

export function isLoggedIn() {
  return isUserAuthenticated(storeRef.getState())
}

export function dispatch(action) {
  return storeRef.dispatch(action)
}

export function getStateFromStoreRef() {
  return storeRef && storeRef.getState()
}
