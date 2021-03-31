import { setDefaultView, selectView } from '../productViewsActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { analyticsPlpClickEvent } from '../../../analytics/tracking/site-interactions'

jest.mock('../../../../client/lib/cookie', () => ({
  setProductIsActive: jest.fn(),
}))

jest.mock('../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe(setDefaultView.name, () => {
  it('returns the correct action', () => {
    const store = mockStore({})
    store.dispatch(setDefaultView('VALID_VIEW_TYPE'))
    expect(store.getActions()).toEqual([
      { type: 'SET_DEFAULT_VIEW', viewType: 'VALID_VIEW_TYPE' },
    ])
  })
})

describe(selectView.name, () => {
  it('returns the correct action', () => {
    const store = mockStore({})
    const viewType = 'VALID_VIEW_TYPE'
    store.dispatch(selectView(viewType))
    expect(store.getActions()).toEqual([
      { type: 'SELECT_VIEW', viewType: 'VALID_VIEW_TYPE' },
    ])
    expect(analyticsPlpClickEvent).toHaveBeenCalledWith(
      `productview-${viewType.toLowerCase()}`
    )
  })
})
