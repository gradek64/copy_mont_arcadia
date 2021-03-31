import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { setGridLayout } from '../GridActions'
import { analyticsPlpClickEvent } from '../../../analytics/tracking/site-interactions'

jest.mock('../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

const store = configureMockStore([thunk])({ grid: { columns: 3 } })

describe('GridActions', () => {
  it('dispatches the correct actions', () => {
    const columns = 3
    store.dispatch(setGridLayout(columns))
    expect(store.getActions()).toEqual([
      { type: 'SET_GRID_LAYOUT', columns },
      { type: 'RESET_SWATCHES_PAGE' },
    ])
    expect(analyticsPlpClickEvent).toHaveBeenCalledWith(`setgrid-${columns}`)
  })
})
