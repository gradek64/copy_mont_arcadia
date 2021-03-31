require('@babel/register')

import { createAccountResponse } from './../utilis/userAccount'
import { getResponseAndSessionCookies } from '../utilis/redis'

describe('It should return the Account Registration Json Schema', () => {
  describe('Register account with subscription', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccountResponse = await createAccountResponse({
          subscribe: true,
        })
        const { responseCookies, session } = await getResponseAndSessionCookies(
          newAccountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })
  describe('Register Account with no Subscription', () => {
    it(
      'should keep client cookies and redis in sync',
      async () => {
        const newAccountResponse = await createAccountResponse({
          subscribe: false,
        })
        const { responseCookies, session } = await getResponseAndSessionCookies(
          newAccountResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      60000
    )
  })

  describe('Register acount for native Apps', () => {
    describe('When I register an account by additonally providing the appId', () => {
      it(
        'should keep client cookies and redis in sync',
        async () => {
          const newAccountResponse = await createAccountResponse({
            subscribe: true,
            appId: '1234-1234-1234-1234',
            deviceType: 'apps',
          })
          const {
            responseCookies,
            session,
          } = await getResponseAndSessionCookies(newAccountResponse)
          expect(responseCookies).toMatchSession(session)
        },
        60000
      )
    })
  })
})
