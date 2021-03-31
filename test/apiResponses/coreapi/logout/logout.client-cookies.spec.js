require('@babel/register')

jest.unmock('superagent')

import {
  logInResponse,
  logOut,
  createAccountResponse,
} from '../utilis/userAccount'
import { processClientCookies } from '../utilis/cookies'
import { getResponseAndSessionCookies } from '../utilis/redis'

describe('It should return the Logout Json schema', () => {
  let newAccount

  beforeAll(async () => {
    newAccount = await createAccountResponse()
  }, 60000)

  describe('monty desktop app', () => {
    let logout
    let mergeCookies
    beforeAll(async () => {
      ;({ mergeCookies } = processClientCookies())
      const accountCookies = mergeCookies(newAccount)
      logout = await logOut(undefined, accountCookies)
    }, 30000)

    it('Logout', async () => {
      expect(typeof logout).toBe('object')
    })

    // This will need to be removed once redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        logout
      )
      expect(responseCookies).toMatchSession(session)
    })
  })

  describe('It should return the Logout response for the native app', () => {
    let loginCookies
    let logout

    beforeAll(async () => {
      const { mergeCookies } = processClientCookies()
      const loginResponse = await logInResponse({
        username: newAccount.body.email,
        password: 'monty1',
      })
      loginCookies = mergeCookies(loginResponse)
      try {
        logout = await logOut('app', loginCookies)
      } catch (e) {
        logout = e.response.body
      }
    })

    it(
      'should logout from the native app',
      async () => {
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
