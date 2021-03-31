// TEST DATA
export const newUserPayload = {
  username: 'newuser@iamnew2.com',
  password: 'gt66vU1nQEwz',
  rememberMe: false,
}

export const newUserMobileAppPayload = Object.assign(
  { appId: '1234-1234-1234-1234' },
  newUserPayload
)

export const userCredentialsFullProfileNoSubscription = {
  username: 'samedeliverybilling@address.com',
  password: 'test123',
}
export const userCredentialsPartialProfileWithSubscription = {
  username: 'nosubscription@sample.com',
  password: 'monty1',
}

export const reauthenticationMobileAppPayload = {
  userToken: 'UmljayBTY2h1YmVydCB3YXMgaGVyZQ0K',
  appId: '1234-1234-1234-1234',
  userId: 654321,
}
