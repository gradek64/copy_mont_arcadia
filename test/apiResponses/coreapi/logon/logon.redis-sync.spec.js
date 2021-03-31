require('@babel/register')

import { newUserPayload, newUserMobileAppPayload } from './logon-data'
import {
  loginAsNewUserAndRegisterIfNotExisting,
  createAccountResponse,
  logOut,
  logInResponse,
} from './../utilis/userAccount'
import {
  getResponseAndSessionCookies,
  getJessionIdFromResponse,
} from '../utilis/redis'
import { getProducts } from '../utilis/selectProducts'
import { addItemToShoppingBagResponse } from '../utilis/shoppingBag'
import { payOrder } from '../utilis/payOrder'

describe('Logon Schema New User Mobile Apps', () => {
  describe('When I login for the first time with my email, password and appId', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const response = await loginAsNewUserAndRegisterIfNotExisting(
          newUserMobileAppPayload,
          true
        )
        const { session, responseCookies } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  // Remove "not" once it starts failing: that means WCS feature works
  // describe('Given that I have logged in before', () => {
  //   fit('should keep redis cookies in sync with client', async () => {
  //     const response = await loginAsNewUserAndRegisterIfNotExisting(reauthenticationMobileAppPayload, true)
  //     const { session, responseCookies } = getResponseAndSessionCookies(response)
  //     expect(responseCookies).toMatchSession(session)
  //   }, 60000)
  // })
})

describe('Logon Schema Partial Profile Mobile Apps', () => {
  describe('Given I can login as a returning user with deviceType "apps"', () => {
    it(
      'should keep redis cookies in sync with client',
      async () => {
        const newAccount = await createAccountResponse(
          newUserMobileAppPayload,
          true
        )
        await logOut()
        const login = await logInResponse({
          username: newAccount.body.email,
          password: 'monty1',
          deviceType: 'apps',
        })
        const { session, responseCookies } = await getResponseAndSessionCookies(
          login
        )
        expect(session).toBeDefined()
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
})

describe('Logon Schema New User', () => {
  it(
    'should keep redis cookies in sync with client',
    async () => {
      const response = await loginAsNewUserAndRegisterIfNotExisting(
        newUserPayload,
        true
      )
      const { session, responseCookies } = await getResponseAndSessionCookies(
        response
      )
      expect(session).toBeDefined()
      expect(responseCookies).toMatchSession(session)
    },
    60000
  )
})

describe('Logon Schema Full Profile', () => {
  it(
    'should keep redis cookies in sync with client',
    async () => {
      let newAccount
      let errorSettingUp
      try {
        const products = await getProducts()
        newAccount = await createAccountResponse()
        const jsessionid = await getJessionIdFromResponse(newAccount)
        const shoppingBag = await addItemToShoppingBagResponse(
          jsessionid,
          products.productsSimpleId
        )
        await payOrder(jsessionid, shoppingBag.body.orderId)
        await logOut()
      } catch (e) {
        errorSettingUp = e
      }
      if (errorSettingUp)
        throw new Error(
          'Error generating test prerequisites. This is most likely to be an environment issue and is not fault of the test'
        )
      const login = await logInResponse({
        username: newAccount.body.email,
        password: 'monty1',
      })
      const { session, responseCookies } = await getResponseAndSessionCookies(
        login
      )
      expect(session).toBeDefined()
      expect(responseCookies).toMatchSession(session)
    },
    60000
  )
})

describe('Logon Schema Partial Profile', () => {
  it(
    'should keep redis cookies in sync with client',
    async () => {
      const newAccount = await createAccountResponse()
      await logOut()
      const login = await logInResponse({
        username: newAccount.body.email,
        password: 'monty1',
      })
      const { session, responseCookies } = await getResponseAndSessionCookies(
        login
      )
      expect(session).toBeDefined()
      expect(responseCookies).toMatchSession(session)
    },
    60000
  )
})

// Logon Errors not applicable here
