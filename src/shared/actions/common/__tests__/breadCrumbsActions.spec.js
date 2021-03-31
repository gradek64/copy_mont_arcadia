import * as actions from '../breadCrumbsActions'

describe('breadCrumbsActions', () => {
  it('should create HIDE_BREADCRUMBS action', () => {
    const isHidden = 'test'
    const expectedAction = {
      type: 'HIDE_BREADCRUMBS',
      payload: isHidden,
    }

    expect(actions.hideBreadCrumbs(isHidden)).toEqual(expectedAction)
  })

  it('should create HIDE_BREADCRUMBS action with defaults', () => {
    const isHidden = true
    const expectedAction = {
      type: 'HIDE_BREADCRUMBS',
      payload: isHidden,
    }

    expect(actions.hideBreadCrumbs()).toEqual(expectedAction)
  })
})
