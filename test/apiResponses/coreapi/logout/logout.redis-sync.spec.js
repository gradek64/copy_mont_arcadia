require('@babel/register')

jest.unmock('superagent')

import {
  createAccountResponse,
  logInResponse,
  logOut,
} from '../utilis/userAccount'
import { getResponseAndSessionCookies } from '../utilis/redis'

describe('It should return the Logout Json schema', () => {
  let newAccount

  beforeAll(async () => {
    newAccount = await createAccountResponse()
  }, 60000)

  describe('Monty Web App - logout', () => {
    it(
      'keep session cookies in sync with client',
      async () => {
        const logout = await logOut()
        const { session, responseCookies } = await getResponseAndSessionCookies(
          logout
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe('Should logout from native App', () => {
    it(
      'should keep redis and client in sync',
      async () => {
        await logInResponse({
          username: newAccount.body.email,
          password: 'monty1',
        })

        let logout
        try {
          logout = await logOut('app')
        } catch (e) {
          logout = e.response.body
        }

        const { session, responseCookies } = await getResponseAndSessionCookies(
          logout
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })
})
