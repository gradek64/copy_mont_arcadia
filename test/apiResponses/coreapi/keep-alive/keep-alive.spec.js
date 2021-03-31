import { createAccount } from '../utilis/userAccount'
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'
import { authenticateMySession } from '../utilis/authenticate'

describe('Keep alive', () => {
  describe('Non-authenticated user', () => {
    let response
    beforeAll(async () => {
      try {
        response = await superagent.get(eps.session.keepAlive.path).set(headers)
      } catch (e) {
        response = e
      }
    }, 60000)

    it('should return success for non-authenticated user', () => {
      expect(typeof response).toBe('object')
      expect(response.status).toBe(200)
    })
  })
  describe('Authenticated remember-me user', () => {
    let response
    beforeAll(async () => {
      const newAccount = await createAccount({
        rememberMe: true,
      })

      try {
        response = await superagent
          .get(eps.session.keepAlive.path)
          .set(headers)
          .set({ Cookie: authenticateMySession(newAccount.jsessionid) })
      } catch (e) {
        response = e
      }
    }, 60000)

    it('should return success for authenitcated user', () => {
      expect(typeof response).toBe('object')
      expect(response.status).toBe(200)
    })
  })
})
