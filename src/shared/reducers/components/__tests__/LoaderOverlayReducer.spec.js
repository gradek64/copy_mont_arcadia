import { createStore } from 'redux'
import LoaderOverlayReducer from '../LoaderOverlayReducer'
import * as loaderActions from '../../../actions/components/LoaderOverlayActions'

describe('LoaderOverlayReducer', () => {
  it('TOGGLE_LOADER_OVERLAY', () => {
    const store = createStore(LoaderOverlayReducer)

    expect(store.getState().visible).toBeFalsy()

    store.dispatch(loaderActions.toggleLoaderOverlay())

    expect(store.getState().visible).toBeTruthy()
  })
})
