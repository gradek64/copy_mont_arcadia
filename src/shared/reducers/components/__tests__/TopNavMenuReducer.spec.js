import { createStore } from 'redux'
import TopNavMenuReducer, {
  initialState,
} from '../../components/TopNavMenuReducer'
import { tablet, laptop } from '../../../constants/viewportConstants'

describe('TopNavMenuReducer', () => {
  const store = createStore(TopNavMenuReducer)

  it('Load initialState', () => {
    expect(store.getState()).toMatchSnapshot()
  })

  it('TOGGLE_TOP_NAV_MENU', () => {
    store.dispatch({ type: 'TOGGLE_TOP_NAV_MENU' })
    expect(store.getState()).toEqual({ open: true, scrollToTop: false })
  })

  it('CLOSE_TOP_NAV_MENU', () => {
    store.dispatch({ type: 'TOGGLE_TOP_NAV_MENU' })
    expect(store.getState()).toEqual(initialState)
  })

  it('TOGGLE_SCROLL_TO_TOP', () => {
    store.dispatch({ type: 'TOGGLE_TOP_NAV_MENU' })
    expect(store.getState()).toEqual({ open: true, scrollToTop: false })
  })

  it('UPDATE_MEDIA_TYPE', () => {
    store.dispatch({ type: 'CLOSE_TOP_NAV_MENU' })
    store.dispatch({ type: 'UPDATE_MEDIA_TYPE', payload: { media: laptop } })
    expect(store.getState()).toEqual(initialState)
    store.dispatch({ type: 'UPDATE_MEDIA_TYPE', payload: { media: tablet } })
    expect(store.getState()).toEqual(initialState)

    store.dispatch({ type: 'UPDATE_MEDIA_TYPE' })
    expect(store.getState()).toEqual(initialState)
  })
})
