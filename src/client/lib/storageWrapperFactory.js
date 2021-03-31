import { errorReport } from './reporter'

const isStorageAvailable = (storage, storageType) => {
  let storageAvailable = false
  try {
    const key = 'isStorageAvailable'
    const value = 'test'
    storage.setItem(key, value)
    if (storage.getItem(key) === value) {
      storageAvailable = true
      storage.removeItem(key)
    }
  } catch (e) {
    errorReport('storage', {
      loggerMessage: `${storageType} is not available. ${e.message}`,
    })
    storageAvailable = false
  }

  return storageAvailable
}

/**
 * This wrapper unifies storage handling and will be used to gradually replace src/client/lib/storage.js
 * @param storageType
 * @returns {*}
 */
export const createStorageWrapper = (storageType = 'localStorage') => {
  const noop = () => {}
  const noopStorageWrapper = {
    setItem: noop,
    getItem: noop,
    removeItem: noop,
  }

  if (!process.browser) {
    return noopStorageWrapper
  }
  let storage

  try {
    switch (storageType) {
      case 'sessionStorage':
        storage = window.sessionStorage
        break
      default:
        storage = window.localStorage
        break
    }
  } catch (err) {
    if (window.NREUM && window.NREUM.noticeError) window.NREUM.noticeError(err)

    return noopStorageWrapper
  }

  if (!isStorageAvailable(storage, storageType)) {
    return noopStorageWrapper
  }

  return {
    setItem: (key, value) => {
      try {
        storage.setItem(key, JSON.stringify(value))
      } catch (err) {
        errorReport('storage', {
          loggerMessage: `Failed to setItem in ${storageType} for key ${key} and value ${value}`,
        })
      }
    },
    getItem: (key) => {
      try {
        const serializedState = storage.getItem(key)
        return serializedState === null ? null : JSON.parse(serializedState)
      } catch (err) {
        errorReport('storage', {
          loggerMessage: `Failed to getItem from ${storageType} with key ${key}`,
        })
        return null
      }
    },

    // Storage API's removeItem is a no-op if the key does not exist.
    // It does not throw or return a failing status.
    removeItem: (key) => {
      storage.removeItem(key)
    },
  }
}
