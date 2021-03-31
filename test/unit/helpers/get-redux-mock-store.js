import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mergeDeepRight } from 'ramda'
import analyticsListenerMiddleware from '../../../src/client/analytics/middleware/analytics-middleware'
import { createStore as reduxCreateStore } from 'redux'
import reducer from '../../../src/shared/lib/combine-reducers'
import { getConfigByStoreCode } from 'src/server/config'
import { setConfig } from 'src/shared/actions/common/configActions'

const reduxContext = {
  setRedirect: jest.fn(() => {}),
  setCookies: jest.fn(() => {}),
}

// same config we have in configure-store.js
const middlewares = [
  thunk.withExtraArgument(reduxContext),
  analyticsListenerMiddleware,
]

export const getReduxContext = () => reduxContext

/**
 * mockStoreCreator is a function to create a mock store. Use this is you don't need the whole initial state in your tests
 *
 * Usage:
 *  const store = mockStoreCreator(initialState)
 */
export const mockStoreCreator = configureMockStore(middlewares)

/**
 * getMockStoreWithInitialReduxState is a function to create a mock store but with the app initial state already set up
 * @param {*} initialState we can pass optionally initial state and will be merged with the reducer original initial state
 *
 * Usage:
 *    const store = getMockStoreWithInitialReduxState()
 *    const store = getMockStoreWithInitialReduxState({account: { user: { email: 'email@email.com' }}})
 */
export const getMockStoreWithInitialReduxState = (initialState = {}) => {
  const state = reducer(undefined, {})
  const realStore = reduxCreateStore(
    reducer,
    mergeDeepRight(state, initialState)
  )
  return mockStoreCreator(realStore.getState())
}

export const createStore = (initialState = {}) => {
  const state = reducer(undefined, {})
  const store = reduxCreateStore(reducer, mergeDeepRight(state, initialState))

  store.dispatch(setConfig(getConfigByStoreCode('tsuk')))

  return mockStoreCreator(store.getState())
}
