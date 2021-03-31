jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'
import { reauthenticationMobileAppPayload } from '../logon/logon-data'
import randomstring from 'randomstring'

const PASSWORD = 'monty1'

// PAYLOAD FUNCTIONS
const userShortProfile = () => {
  const email = randomstring.generate({ length: 6, charset: 'alphabetic' })
  const firstName = randomstring.generate({ length: 6, charset: 'alphabetic' })
  const lastName = randomstring.generate({ length: 6, charset: 'alphabetic' })
  const titleList = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']
  const title = titleList[Math.floor(titleList.length * Math.random())]
  const marketingSubscription = false
  return {
    email: `${email.toLowerCase()}@sample.org`,
    firstName: `FirstName_${firstName}`,
    lastName: `LastName_${lastName}`,
    title,
    marketingSubscription,
  }
}

// Address ITEM
const address = () => {
  const postCodeList = [
    'NW1 5QD',
    'IP3 0BL',
    'W1T 3NL',
    'EC3N 1HP',
    'W6 8BT',
    'SW6 7ST',
  ]
  const postCode = postCodeList[Math.floor(postCodeList.length * Math.random())]
  const cityList = [
    'London',
    'Manchester',
    'Norwich',
    'Ipswich',
    'York',
    'Brighton',
  ]
  const city = cityList[Math.floor(postCodeList.length * Math.random())]
  return {
    country: 'United Kingdom',
    postcode: postCode,
    address1: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    address2: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    city,
    state: '',
  }
}
// NAME AND PHONE ITEM
const nameAndPhone = () => ({
  title: 'Mr',
  firstName: randomstring
    .generate({
      length: 6,
      charset: `alphabetic`,
    })
    .toLowerCase(),
  lastName: randomstring
    .generate({
      length: 6,
      charset: `alphabetic`,
    })
    .toLowerCase(),
  telephone: `07${randomstring
    .generate({
      length: 8,
      charset: `numeric`,
    })
    .toLowerCase()}`,
})

const getNextYear = () => {
  const now = new Date()
  return `${now.getFullYear() + 1}`
}

// CHANGE CHECKOUT DETAILS PAYLOAD
const changeFullDetails = (type, cardNumber) => {
  return {
    billingDetails: {
      nameAndPhone: nameAndPhone(),
      address: address(),
    },
    deliveryDetails: {
      nameAndPhone: nameAndPhone(),
      address: address(),
    },
    creditCard: {
      expiryYear: getNextYear(),
      expiryMonth: '07',
      type,
      cardNumber,
    },
  }
}

const createUserCredentials = ({ subscribe = false, appId } = {}) => {
  const randomLetters = randomstring.generate({
    length: 6,
    charset: `alphabetic`,
  })
  const timestamp = new Date().getTime()
  const email = `${randomLetters}${timestamp}`
  return {
    email: `${email.toLowerCase()}@sample.org`,
    password: PASSWORD,
    passwordConfirm: PASSWORD,
    subscribe,
    appId,
  }
}

/* API CALLS */
export const createAccount = async ({
  deviceType = '',
  payload = undefined,
  appId,
  subscribe = false,
  rememberMe = false,
} = {}) => {
  const accountBody = await superagent
    .post(eps.myAccount.register.path)
    .set(headers)
    .set('Cookie', `deviceType=${deviceType}`)
    .send(payload || createUserCredentials({ appId, subscribe, rememberMe }))
  const sessionId = accountBody.headers['set-cookie'].toString().split(';')
  const jsessionid = sessionId[0]
  return {
    accountProfile: accountBody.body,
    jsessionid,
  }
}

export const createAccountResponse = async ({
  deviceType = '',
  payload = undefined,
  appId,
  subscribe = false,
  rememberMe = false,
} = {}) => {
  const deviceTypeCookie = deviceType ? `deviceType=${deviceType}` : ''
  const account = await superagent
    .post(eps.myAccount.register.path)
    .set(headers)
    .set('Cookie', `${deviceTypeCookie}`)
    .send(payload || createUserCredentials({ appId, subscribe, rememberMe }))
  return account
}

export const getUserAccount = async (jsessionid) => {
  const accountBody = await superagent
    .get(eps.myAccount.account.path)
    .set(headers)
    .set({ Cookie: jsessionid })
  return accountBody.body
}

export const getUserAccountResponse = async (cookies) => {
  const accountBody = await superagent
    .get(eps.myAccount.account.path)
    .set(headers)
    .set({ Cookie: cookies })
  return accountBody
}

export const logIn = async ({
  username,
  password,
  deviceType = '',
  payload,
}) => {
  const postBody = payload || { username, password }
  const loginBody = await superagent
    .post(eps.myAccount.login.path)
    .set(headers)
    .set('Cookie', `deviceType=${deviceType}`)
    .send(postBody)

  return loginBody.body
}

export const logInResponse = async ({
  username,
  password,
  deviceType = '',
  payload,
  cookies,
}) => {
  const deviceTypeCookie = deviceType ? `deviceType=${deviceType}` : ''
  const setCookies = cookies
    ? `${cookies}; ${deviceTypeCookie}`
    : deviceTypeCookie
  const postBody = payload || { username, password }
  const loginBody = await superagent
    .post(eps.myAccount.login.path)
    .set(headers)
    .set('Cookie', setCookies)
    .send(postBody)

  return loginBody
}

// Adding logIn for Wishlist with jsessioId
export const logInWithJsessionId = async (
  username,
  password,
  deviceType = ''
) => {
  const payload = { username, password }
  const loginBody = await superagent
    .post(eps.myAccount.login.path)
    .set(headers)
    .set('Cookie', `deviceType=${deviceType}`)
    .send(payload)
  const sessionId = loginBody.headers['set-cookie'].toString().split(';')
  const jsessionid = sessionId[0]
  return {
    body: loginBody.body,
    jsessionid,
  }
}

export const logOut = async (platform = 'web', cookies = '') => {
  const payloadNativeApp = {
    userToken: 'UmljayBTY2h1YmVydCB3YXMgaGVyZQ0K',
    appId: '1234-1234-1234-1234',
    userId: 654321,
  }
  const logOutResponse = await superagent
    .delete(eps.myAccount.logout.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(platform !== 'web' && payloadNativeApp)
  const sessionId = logOutResponse.headers['set-cookie'].toString().split(';')
  const jsessionid = sessionId[0]
  return {
    logOutBody: logOutResponse,
    jsessionid,
  }
}

export const changePassword = async (
  jsessionid,
  emailAddress,
  platform = 'web'
) => {
  const payload = {
    emailAddress,
    newPassword: 'monty123',
    newPasswordConfirm: 'monty123',
    oldPassword: 'monty1',
  }
  const payloadNativeApp = {
    ...payload,
    ...reauthenticationMobileAppPayload,
  }
  const changePasswordBody = await superagent
    .put(eps.myAccount.changePassword.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(platform === 'web' ? payload : payloadNativeApp)
  return {
    newPasswordBody: changePasswordBody.body,
    newPassword: payload.newPassword,
  }
}

export const changePasswordResponse = async (
  cookies,
  emailAddress,
  platform = 'web'
) => {
  const payload = {
    emailAddress,
    newPassword: 'monty123',
    newPasswordConfirm: 'monty123',
    oldPassword: 'monty1',
  }
  const payloadNativeApp = {
    ...payload,
    ...reauthenticationMobileAppPayload,
  }
  const changePasswordResponse = await superagent
    .put(eps.myAccount.changePassword.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(platform === 'web' ? payload : payloadNativeApp)
  return {
    ...changePasswordResponse,
    newPassword: payload.newPassword,
  }
}

export const forgottenPassword = async (email) => {
  const forgottenPasswordBody = await superagent
    .post(eps.myAccount.forgotPassword.path)
    .set(headers)
    .send({ email })
  return forgottenPasswordBody.body
}

export const forgottenPasswordResponse = async (email) => {
  const forgottenPasswordBody = await superagent
    .post(eps.myAccount.forgotPassword.path)
    .set(headers)
    .send({ email })
  return forgottenPasswordBody
}

export const resetPassword = async (email, jsessionid) => {
  const payload = {
    email,
    hash: 'i5A580PxS%2FHdKbcmFqTdEx%2BWCUc%3D%0A',
    password: 'passw0rd',
    passwordConfirm: 'passw0rd',
  }
  const resetPasswordBody = await superagent
    .put(eps.myAccount.resetPassword.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(payload)
  return resetPasswordBody.body
}

export const resetPasswordResponse = async (email, cookies) => {
  const payload = {
    email,
    hash: 'i5A580PxS%2FHdKbcmFqTdEx%2BWCUc%3D%0A',
    password: 'passw0rd',
    passwordConfirm: 'passw0rd',
  }
  const resetPasswordBody = await superagent
    .put(eps.myAccount.resetPassword.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)
  return resetPasswordBody
}

export const resetPasswordLink = async (email) => {
  const resetPasswordBody = await superagent
    .post(eps.myAccount.resetPasswordLink.path)
    .set(headers)
    .send({ email })
  return resetPasswordBody.body
}

export const resetPasswordLinkResponse = async (email) => {
  const resetPasswordBody = await superagent
    .post(eps.myAccount.resetPasswordLink.path)
    .set(headers)
    .send({ email })
  return resetPasswordBody
}

export const updateCheckoutDetails = async (jsessionid, type, cardNumber) => {
  const payload = changeFullDetails(type, cardNumber)
  const checkoutDetailsBody = await superagent
    .put(eps.myAccount.customerDetails.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(payload)
  return checkoutDetailsBody.body
}

export const updateCheckoutDetailsResponse = async (
  cookies,
  type,
  cardNumber
) => {
  const payload = changeFullDetails(type, cardNumber)
  const checkoutDetailsResponse = await superagent
    .put(eps.myAccount.customerDetails.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)
  return checkoutDetailsResponse
}

export const updateAccountShortProfile = async (jsessionid) => {
  const shortProfileUpdate = userShortProfile()
  const shortProfileBody = await superagent
    .put(eps.myAccount.accountShortProfile.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(shortProfileUpdate)
  return shortProfileBody.body
}

export const updateAccountShortProfileResponse = async (cookies) => {
  const shortProfileUpdate = userShortProfile()
  const shortProfileResponse = await superagent
    .put(eps.myAccount.accountShortProfile.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(shortProfileUpdate)
  return shortProfileResponse
}

const registerNewUserIfNotYetExisting = async (payload) => {
  const newUserData = await createAccount({ payload })
  if (newUserData.accountProfile.exists !== true)
    throw new Error(
      'Retried registering a fresh user and it was still unsuccessful.'
    )
}

export const loginAsNewUserAndRegisterIfNotExisting = async (
  payload,
  withResponse = false
) => {
  let response
  try {
    response = withResponse
      ? await logInResponse({ payload })
      : await logIn({ payload })
  } catch (error) {
    const errorResponse = JSON.parse(error.response.text)
    if (errorResponse.error === 'Unauthorized')
      await registerNewUserIfNotYetExisting({
        email: payload.username,
        password: payload.password,
        passwordConfirm: payload.password,
        subscribe: false,
      })

    response = withResponse
      ? await logInResponse({ payload })
      : await logIn({ payload })
  }
  return response
}

export const getPreferencesLink = (memberId) => {
  return superagent
    .post(eps.myAccount.exponea.path)
    .set({ 'Content-Type': 'application/json' })
    .send({ memberId })
}
