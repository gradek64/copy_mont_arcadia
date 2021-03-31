import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import * as orderAuxiliaryActions from '../orderAuxiliaryActions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('setFinalisedOrder', () => {
  it('dispatches the correct action', async () => {
    const finalisedOrder = 'test-order'

    const expectedActions = [
      {
        finalisedOrder,
        type: 'SET_FINALISED_ORDER',
      },
    ]

    const store = mockStore({})
    await store.dispatch(
      orderAuxiliaryActions.setFinalisedOrder(finalisedOrder)
    )
    expect(store.getActions()).toEqual(expectedActions)
  })
})

describe('clearFinalisedOrder', () => {
  it('dispatches the correct action', async () => {
    const expectedActions = [
      {
        type: 'CLEAR_FINALISED_ORDER',
      },
    ]

    const store = mockStore({})
    await store.dispatch(orderAuxiliaryActions.clearFinalisedOrder())
    expect(store.getActions()).toEqual(expectedActions)
  })
})
