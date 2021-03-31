require('@babel/register')

jest.unmock('superagent')

import { createAccount, logIn, logOut } from '../utilis/userAccount'

let logout
let newAccount

describe('It should return the Logout Json schema', () => {
  beforeAll(async () => {
    newAccount = await createAccount()
  }, 60000)

  it(
    'Logout',
    async () => {
      logout = await logOut()
      expect(typeof logout).toBe('object')
    },
    30000
  )

  describe('It should return the Logout response for the native app', () => {
    beforeAll(async () => {
      await logIn({
        username: newAccount.accountProfile.email,
        password: 'monty1',
      })
    }, 60000)

    it(
      'should logout from the native app',
      async () => {
        try {
          logout = await logOut('app')
        } catch (e) {
          logout = e.response.body
        }
        try {
          expect(typeof logout.statusCode).toBe('number')
          expect(logout.statusCode).toBe(500)
          expect(logout.error).toBe('Internal Server Error')
          expect(logout.message).toBe('An internal server error occurred')
        } catch (err) {
          expect(logout.statusCode).toBe(502)
          expect(logout.error).toBe('Bad Gateway')
          expect(logout.message).toBe('User was not logged out')
        }
      },
      30000
    )
  })
})
