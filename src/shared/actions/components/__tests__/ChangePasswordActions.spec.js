import * as actions from '../ChangePasswordActions'

describe('Change Password Actions', () => {
  it('changePasswordSuccess(hasSucceeded)', () => {
    const hasSucceeded = true
    expect(actions.changePasswordSuccess(hasSucceeded)).toEqual({
      type: 'CHANGE_PASSWORD_SUCCESS',
      hasSucceeded,
    })
  })
  it('setPostResetUrl(postResetURL)', () => {
    const postResetURL = 'some/url'
    expect(actions.setPostResetUrl(postResetURL)).toEqual({
      type: 'SET_POST_RESET_URL',
      postResetURL,
    })
  })
})
