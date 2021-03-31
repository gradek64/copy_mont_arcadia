import { clone } from 'ramda'
import { isAuth } from '../auth-helpers'

const state = {
  auth: {
    authentication: 'full',
  },
  routing: {
    location: {
      query: {
        isAnonymous: 'true',
      },
    },
  },
}

const falseAuthState = (state) => {
  const falseAuthState = clone(state)
  falseAuthState.auth.authentication = null
  return falseAuthState
}

describe('Auth Routing Helpers', () => {
  describe('isAuth', () => {
    it('should return true if authentication is truthy', () => {
      expect(isAuth(state)).toBe(true)
    })

    it('should return false if authentication is falsy', () => {
      const falseState = falseAuthState(state)
      expect(isAuth(falseState)).toBe(false)
    })
  })
})
