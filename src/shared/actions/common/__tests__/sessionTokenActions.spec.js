import { setJsessionid, setSessionJwt } from '../sessionTokenActions'

describe('Session Token Actions', () => {
  describe('#setJsessionid', () => {
    it('returns the expected object', () => {
      expect(setJsessionid('jsessionid')).toEqual({
        type: 'SET_JSESSION_ID',
        jsessionid: 'jsessionid',
      })
    })
  })
  describe('#setSessionJwt', () => {
    it('returns the expected object', () => {
      expect(setSessionJwt('sessionjwt')).toEqual({
        type: 'SET_SESSION_JWT',
        sessionJwt: 'sessionjwt',
      })
    })
  })
})
