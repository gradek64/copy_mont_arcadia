import deepFreeze from 'deep-freeze'

import { getJsessionid, getSessionJwt } from '../sessionTokenSelectors'

describe('Session Token Selectors', () => {
  const jsessionid = 'jsessionid-test'
  const sessionJwt = 'sessionJwt-test'
  const state = deepFreeze({
    sessionTokens: {
      jsessionid,
      sessionJwt,
    },
  })

  describe('getJsessionid', () => {
    it('should return jsessionid', () => {
      expect(getJsessionid(state)).toBe(jsessionid)
    })
  })

  describe('getSessionJwt', () => {
    it('should return sessionJwt', () => {
      expect(getSessionJwt(state)).toBe(sessionJwt)
    })
  })
})
