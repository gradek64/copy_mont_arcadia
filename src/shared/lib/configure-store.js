import { createStore, applyMiddleware, compose } from 'redux'
import { syncHistory } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import reducer from './combine-reducers'

let middleware = [thunkMiddleware]

if (process.browser) {
  const {
    default: analyticsMiddleware,
  } = require('../../client/analytics/middleware/analytics-middleware')
  const reduxRouterMiddleware = syncHistory(browserHistory)

  middleware = [analyticsMiddleware, reduxRouterMiddleware, ...middleware]
}

/* ::
type ReduxContext = {
  traceId: string
}
*/

const finalCreateStore = (
  reducer,
  initialState,
  reduxContext = {} /* : ReduxContext */
) => {
  const finalMiddlewares = middleware.map(
    (m) =>
      m === thunkMiddleware
        ? thunkMiddleware.withExtraArgument(reduxContext)
        : m
  )

  const reduxDevToolsLoaded = () =>
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'

  const composeEnhancers = reduxDevToolsLoaded()
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true })
    : compose

  const enhancer = composeEnhancers(applyMiddleware(...finalMiddlewares))

  return createStore(reducer, initialState, enhancer)
}

function createChromeExtBridge(store) {
  if (store && typeof window === 'object' && window.__CKE_REGISTER_REDUX__) {
    window.__CKE_REGISTER_REDUX__({ store })
  }
}

export default function configureStore(initialState = {}, reduxContext) {
  const store = finalCreateStore(reducer, initialState, reduxContext)
  createChromeExtBridge(store)

  return store
}
