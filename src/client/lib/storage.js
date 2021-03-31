import { errorReport } from './reporter'
import { localStoragePaths } from '../../shared/constants/localStorage'

const cachedItems = []
let storageSupported = null

export const isStorageSupported = (type) => {
  if (storageSupported === null) {
    let storage
    try {
      storage = window[type]
      storage.setItem('isStorageSupported', true)
      storage.removeItem('isStorageSupported')
      storageSupported = true
    } catch (e) {
      errorReport('storage', {
        loggerMessage: `Browser storage (${storage}) not supported.`,
      })
      storageSupported = false
    }
  }

  return storageSupported
}

export const getSelectedStore = () => {
  const selectedStore = sessionStorage.getItem('selectedStore')
  if (selectedStore) {
    try {
      return JSON.parse(selectedStore)
    } catch (e) {
      errorReport('storage', e)
    }
  }
  return {}
}

export const setSelectedStore = (selectedStore) => {
  try {
    sessionStorage.setItem('selectedStore', JSON.stringify(selectedStore))
  } catch (e) {
    errorReport('storage', {
      loggerMessage: 'Browser storage (sessionStorage) not supported.',
      ...e,
    })
  }
}

export const getCacheData = (name) => {
  const data = cachedItems.reduce((prev, item) => {
    const storage = JSON.parse(localStorage.getItem(`cached_${item}`))
    return storage ? { ...prev, [item]: storage } : prev
  }, {})
  return name ? data[name] : data
}

export const setCacheData = (name, data) => {
  let error = null

  try {
    localStorage.setItem(`cached_${name}`, JSON.stringify(data))
  } catch (e) {
    error = e
    errorReport('storage', {
      loggerMessage: 'Browser storage (localStorage) not supported',
      ...e,
    })
  }

  if (!error) {
    cachedItems.push(name)
  }
}

export const clearCacheData = (name) => {
  try {
    if (!isStorageSupported('localStorage')) return
    if (name && typeof name === 'string') {
      return localStorage.removeItem(`cached_${name}`)
    }
    cachedItems.forEach((item) => localStorage.removeItem(`cached_${item}`))
  } catch (err) {
    if (window.NREUM && window.NREUM.noticeError) window.NREUM.noticeError(err)
  }
}

export const loadRecentlyViewedState = () => {
  try {
    const serializedState = localStorage.getItem(
      localStoragePaths.recentlyViewed
    )
    return serializedState === null ? [] : JSON.parse(serializedState)
  } catch (err) {
    return []
  }
}

export const saveRecentlyViewedState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(localStoragePaths.recentlyViewed, serializedState)
  } catch (err) {
    // do nothing
  }
}
