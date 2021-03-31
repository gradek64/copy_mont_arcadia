import { path } from 'ramda'

export default function withStorage(storageSyncHandler) {
  if (!storageSyncHandler)
    throw new Error(
      'storageSyncHandler object must be supplied to use the withStorage higher order reducer'
    )

  const isMergeAction = (action) =>
    action.type === storageSyncHandler.mergeActionType

  const isStoredAction = (action) =>
    path(['storedActions'], storageSyncHandler) &&
    Array.isArray(storageSyncHandler.storedActions) &&
    storageSyncHandler.storedActions.includes(action.type) &&
    action.persist !== false

  return (baseReducer) => (state, action) => {
    if (isMergeAction(action)) {
      return storageSyncHandler.merge(state, action.data)
    }

    if (!isStoredAction(action)) {
      return baseReducer(state, action)
    }

    const newState = baseReducer(
      { ...state, lastPersistTime: +new Date() },
      action
    )

    storageSyncHandler.persist(newState)

    return newState
  }
}
