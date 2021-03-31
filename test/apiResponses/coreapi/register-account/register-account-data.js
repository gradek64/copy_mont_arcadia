// PAYLOADS
export const createSpecificUser = (
  email = '',
  password = '',
  passwordConfirm = '',
  subscribe
) => {
  return {
    email,
    password,
    passwordConfirm,
    subscribe,
  }
}

export const registerErrorEmail = 'testautomation12@a.com'
