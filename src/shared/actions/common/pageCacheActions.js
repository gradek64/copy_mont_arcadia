import {
  isStorageSupported,
  getCacheData,
  clearCacheData,
} from '../../../client/lib/storage'
import { getItem } from '../../../client/lib/cookie'
import { setAuthentication } from './authActions'
import { updateMenuForAuthenticatedUser } from './navigationActions'

export function preCacheReset() {
  return {
    type: 'PRE_CACHE_RESET',
  }
}

export function retrieveCachedData() {
  return (dispatch) => {
    const authenticated = getItem('authenticated')
    const storageSupport = isStorageSupported('localStorage')

    if (storageSupport && authenticated === 'yes') {
      const data = getCacheData()
      if (data.auth) dispatch({ type: 'RETRIEVE_CACHED_DATA', ...data })
      else dispatch(setAuthentication('full'))

      dispatch(updateMenuForAuthenticatedUser())
    } else if (storageSupport) {
      clearCacheData()
    }
  }
}
