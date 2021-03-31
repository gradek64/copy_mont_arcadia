import configureMockStore from '../lib/configure-mock-store'
import * as actions from '../../../src/shared/actions/components/GridActions'

test('setGridLayout changes number of columns', () => {
  const store = configureMockStore()

  store.dispatch(actions.setGridLayout(1))
  expect(1).toBe(store.getState().grid.columns)

  store.dispatch(actions.setGridLayout(2))
  expect(2).toBe(store.getState().grid.columns)

  store.dispatch(actions.setGridLayout(3))
  expect(3).toBe(store.getState().grid.columns)
})

test('setGridLayout triggers analytics', () => {
  const store = configureMockStore()
  store.dispatch(actions.setGridLayout(1))
})
