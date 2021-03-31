import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  updateMediaType,
  updateWindow,
  updatePageHeight,
  updateAgent,
  updateTouch,
  setAndUpdateMediaType,
} from '../viewportActions'

import { setItem } from '../../../../client/lib/cookie/utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

jest.mock('../../../../client/lib/cookie/utils', () => ({
  setItem: jest.fn(),
}))

beforeEach(() => {
  global.process.browser = true
  jest.clearAllMocks()
})

describe('ViewPortActions', () => {
  it('updateMediaType', () => {
    expect(updateMediaType('mobile')).toEqual({
      type: 'UPDATE_MEDIA_TYPE',
      media: 'mobile',
    })
  })
  it('updateMediaType', () => {
    expect(updateWindow({ width: 200, height: 400 })).toEqual({
      type: 'UPDATE_WINDOW',
      data: { width: 200, height: 400 },
    })
  })
  it('updateMediaType', () => {
    expect(updatePageHeight(240)).toEqual({
      type: 'UPDATE_PAGE_HEIGHT',
      pageHeight: 240,
    })
  })
  it('updateMediaType', () => {
    expect(updateAgent('Android')).toEqual({
      type: 'UPDATE_AGENT',
      iosAgent: 'Android',
    })
  })
  it('updateMediaType', () => {
    expect(updateTouch('press')).toEqual({
      type: 'UPDATE_TOUCH',
      touch: 'press',
    })
  })
  it('setAndUpdateMediaType', () => {
    const store = mockStore({
      viewport: {
        media: 'mobile',
      },
    })
    store.dispatch(setAndUpdateMediaType('tablet'))
    expect(setItem).toHaveBeenCalledWith('viewport', 'tablet', 30)
    expect(store.getActions()).toEqual([
      { type: 'UPDATE_MEDIA_TYPE', media: 'tablet' },
    ])
  })
})
