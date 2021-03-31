export function changePasswordSuccess(hasSucceeded) {
  return {
    type: 'CHANGE_PASSWORD_SUCCESS',
    hasSucceeded,
  }
}

export function setPostResetUrl(postResetURL) {
  return {
    type: 'SET_POST_RESET_URL',
    postResetURL,
  }
}
