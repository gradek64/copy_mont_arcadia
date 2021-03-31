import configureStore from 'src/shared/lib/configure-store'
import { getConfigByStoreCode, getBrandHostnames } from 'src/server/config'
import {
  setConfig,
  setBrandHostnames,
} from 'src/shared/actions/common/configActions'

/**
 * Returns a redux store with minimium required state
 *
 * @return {Object} Redux stores
 */
export default function buildStore(initialState) {
  const store = configureStore(initialState)

  store.dispatch(setConfig(getConfigByStoreCode('tsuk')))
  store.dispatch(
    setBrandHostnames(getBrandHostnames('topshop', window.location.host))
  )

  return store
}
