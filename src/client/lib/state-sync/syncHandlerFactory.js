import { createStorageWrapper } from '../storageWrapperFactory'
import { path } from 'ramda'

export const MERGE_ACTION_SUFFIX = '_MERGE_STATE'

const throwError = (message) => {
  throw new Error(`State sync with storage: ${message}`)
}

export const createSyncHandler = ({
  key, // used as a key in local storage
  storedActions, // an array of actions when should trigger persisting to local storage
  updateAction, // action used to trigger a state update instead of merging data from storage
  storageType = 'localStorage', // localStorage or sessionStorage
}) => {
  if (!key) throwError('Missing key')
  if (!Array.isArray(storedActions) || !storedActions.length)
    throwError('Missing storedActions')

  const mergeActionType = `${key.toUpperCase()}${MERGE_ACTION_SUFFIX}`
  const storage = createStorageWrapper(storageType)
  const prepareData = (data) =>
    updateAction && path(['lastPersistTime'], data)
      ? { lastPersistTime: data.lastPersistTime }
      : data

  return {
    key,
    storage,
    storedActions,
    mergeActionType,
    updateAction,
    retrieve: () => prepareData(storage.getItem(key)),
    persist: (data) => storage.setItem(key, prepareData(data)),
    merge: (state, data) => (updateAction ? { ...state, ...data } : data),
  }
}
