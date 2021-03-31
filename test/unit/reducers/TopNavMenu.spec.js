import { createStore } from 'redux'
import topNavMenuReducer from '../../../src/shared/reducers/components/TopNavMenuReducer'
import * as actions from '../../../src/shared/actions/components/TopNavMenuActions'

test('TOGGLE_TOP_NAV_MENU', () => {
  const store = createStore(topNavMenuReducer)
  store.dispatch(actions.toggleTopNav(true))
  expect(store.getState().open).toBeTruthy()
  store.dispatch(actions.toggleTopNav(false))
  expect(store.getState().open).toBeFalsy()
})

test('TOGGLE_SCROLL_TO_TOP sets to true/false the topNavMenu.scrollToTop store property if this is initially false/true', () => {
  const store = createStore(topNavMenuReducer)
  expect(store.getState().scrollToTop).toBe(false)
  store.dispatch(actions.toggleScrollToTop())
  expect(store.getState().scrollToTop).toBe(true)
  store.dispatch(actions.toggleScrollToTop())
  expect(store.getState().scrollToTop).toBe(false)
})

test('CLOSE_TOP_NAV_MENU sets to false the topNavMenu.open store property whatever is its initial value', () => {
  const store = createStore(topNavMenuReducer)
  expect(store.getState().open).toBe(false)
  store.dispatch(actions.closeTopNavMenu())
  expect(store.getState().open).toBe(false)
  store.dispatch(actions.toggleTopNav())
  expect(store.getState().open).toBe(true)
  store.dispatch(actions.closeTopNavMenu())
  expect(store.getState().open).toBe(false)
})
