import * as actions from '../LoaderOverlayActions'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('Loader Overlay Actions', () => {
  it('toggleLoaderOverlay', () => {
    snapshot(actions.toggleLoaderOverlay())
  })

  it('zeroAjaxCounter', () => {
    snapshot(actions.zeroAjaxCounter())
  })

  it('ajaxCounter(increment)', () => {
    snapshot(actions.ajaxCounter('increment'))
  })

  it('ajaxCounter(decrement)', () => {
    snapshot(actions.ajaxCounter('decrement'))
  })
})
