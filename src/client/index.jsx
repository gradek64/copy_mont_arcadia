import React from 'react'
import { hydrate } from 'react-dom'
import configureStore from '../shared/lib/configure-store'
import Root from './Root'
import ContextProvider from '../shared/lib/context-provider'
import analyticsMiddleware from './analytics/middleware'
import { localise, setClientSideDictionaries } from '../shared/lib/localisation'
import { format as formatPrice } from '../shared/lib/price'
import { makeReferenceToStore } from '../shared/lib/get-value-from-store'
import {
  clearCacheData,
  getSelectedStore,
  loadRecentlyViewedState,
} from './lib/storage'
import { start } from './lib/reporter'
import hijack from './lib/hijack-links'
import { getItem } from './lib/cookie'
import { setiPadModelVariableForIPad } from './lib/cookie/device'
import { setupLoaders } from '../shared/lib/image-loader/image-loader'
import initKeepAlivePolling from './lib/keep-alive'
import { getFeaturesKeepAlive } from '../shared/selectors/featureSelectors'
import { setUpMultiTabSyncListeners } from '../shared/actions/common/multiTabSyncActions'
import storeEmailPromoCodeIfAvailable from './lib/storeEmailPromoCodeIfAvailable'
import analyticsStoreObserver from './analytics/storeObserver'
import initNewRelicBrowser from './lib/init-nr-browser'
import { updateLocationPathName } from '../shared/actions/common/indexActions'

initNewRelicBrowser(window)
storeEmailPromoCodeIfAvailable(window.location.search)
setupLoaders(window)
analyticsMiddleware()
start()
setiPadModelVariableForIPad()

if (window.isRedAnt)
  hijack((pathname) => {
    window.location = pathname
  })

const state = Object.assign({}, window.__INITIAL_STATE__, {
  recentlyViewed: loadRecentlyViewedState(),
})

if (state.storeLocator && getItem('WC_pickUpStore')) {
  state.storeLocator.selectedStore = getSelectedStore()
}

const store = configureStore(state)

store.dispatch(updateLocationPathName(window.location.pathname))

analyticsStoreObserver(store)

window.__qubitStore = store
window.__React = React

clearCacheData('account')
const keepAliveInterval = getFeaturesKeepAlive(store.getState())
if (keepAliveInterval) initKeepAlivePolling(store, keepAliveInterval)

setClientSideDictionaries(state.localisation)
setUpMultiTabSyncListeners(store.dispatch, store.getState)

function renderApp(RootComponent) {
  const { language, brandName } = state.config
  hydrate(
    // eslint-disable-next-line react/jsx-no-bind
    <ContextProvider
      localise={localise.bind(null, language, brandName)}
      formatPrice={formatPrice.bind(null, state.config.currencyCode)}
    >
      <RootComponent store={store} />
    </ContextProvider>,
    document.getElementById('root')
  )
}

makeReferenceToStore(store)
renderApp(Root)

/*
 * Timestamps when the application has been evaluated
 * See: https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API
 */
if (window.performance && window.performance.mark) {
  window.performance.mark('application ready')
}

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const newRoot = require('./Root').default
    renderApp(newRoot)
  })
}
