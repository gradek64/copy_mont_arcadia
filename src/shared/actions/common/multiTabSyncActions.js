import storageHandlers from '../../../client/lib/state-sync/handlers/index'
import { syncState } from './syncState'

const getHiddenDocumentPropertyName = () => {
  if (process.browser && document) {
    if (typeof document.hidden !== 'undefined') {
      return 'hidden'
    } else if (typeof document.msHidden !== 'undefined') {
      return 'msHidden'
    } else if (typeof document.webkitHidden !== 'undefined') {
      return 'webkitHidden'
    }
  }
}

const getVisibilityChangeEventName = () => {
  if (process.browser && document) {
    if (typeof document.hidden !== 'undefined') {
      return 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      return 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      return 'webkitvisibilitychange'
    }
  }
}

const listenToVisibilityEvents = (dispatch, getState) => {
  const hiddenDocumentPropertyName = getHiddenDocumentPropertyName()
  if (hiddenDocumentPropertyName !== undefined) {
    document.addEventListener(getVisibilityChangeEventName(), () => {
      if (!document[hiddenDocumentPropertyName]) {
        syncState()(dispatch, getState)
      }
    })
  }
}

const listenToStorageEvents = (dispatch, getState) => {
  const hiddenDocumentPropertyName = getHiddenDocumentPropertyName()
  if (hiddenDocumentPropertyName !== undefined) {
    window.addEventListener('storage', (e) => {
      if (!document[hiddenDocumentPropertyName]) {
        if (e.key && Object.keys(storageHandlers).includes(e.key)) {
          syncState([e.key])(dispatch, getState)
        }
      }
    })
  }
}

export const setUpMultiTabSyncListeners = (dispatch, getState) => {
  listenToVisibilityEvents(dispatch, getState)
  listenToStorageEvents(dispatch, getState)
}
