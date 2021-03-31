import sessionTokenReducer, { initialState } from '../sessionTokenReducer'

describe('#sessionTokenReducer', () => {
  describe('jsessionid', () => {
    it('sets jsessionid as expected if jsessionid is provided', () => {
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_JSESSION_ID',
          jsessionid: 'jsessionid',
        })
      ).toEqual({
        jsessionid: 'jsessionid',
        sessionJwt: '',
      })
    })
    it('sets jsessionid as expected if jsessionid is not provided or undefined', () => {
      expect(
        sessionTokenReducer(undefined, { type: 'SET_JSESSION_ID' })
      ).toEqual({
        jsessionid: undefined,
        sessionJwt: '',
      })
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_JSESSION_ID',
          jsessionid: undefined,
        })
      ).toEqual({
        jsessionid: undefined,
        sessionJwt: '',
      })
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_JSESSION_ID',
          jsessionid: '',
        })
      ).toEqual({
        jsessionid: '',
        sessionJwt: '',
      })
    })
    it('overwrites the previous jsessionid value if jsessionid is provided', () => {
      expect(
        sessionTokenReducer(
          {
            ...initialState,
            jsessionid: 'jsessionid1',
          },
          { type: 'SET_JSESSION_ID', jsessionid: 'jsessionid2' }
        )
      ).toEqual({
        jsessionid: 'jsessionid2',
        sessionJwt: '',
      })
    })
  })
  describe('sessionJwt', () => {
    it('sets sessionJwt as expected if sessionJwt is provided', () => {
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_SESSION_JWT',
          sessionJwt: 'testsessionjwt',
        })
      ).toEqual({
        jsessionid: '',
        sessionJwt: 'testsessionjwt',
      })
    })
    it('sets sessionJwt as expected if sessionJwt is not provided or undefined', () => {
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_SESSION_JWT',
        })
      ).toEqual({
        jsessionid: '',
        sessionJwt: undefined,
      })
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_SESSION_JWT',
          sessionJwt: undefined,
        })
      ).toEqual({
        jsessionid: '',
        sessionJwt: undefined,
      })
      expect(
        sessionTokenReducer(undefined, {
          type: 'SET_SESSION_JWT',
          sessionJwt: '',
        })
      ).toEqual({
        jsessionid: '',
        sessionJwt: '',
      })
    })
    it('overwrites the previous sessionJwt value if sessionJwt is provided', () => {
      expect(
        sessionTokenReducer(
          {
            ...initialState,
            sessionJwt: 'sessionJwt1',
          },
          {
            type: 'SET_SESSION_JWT',
            sessionJwt: 'sessionJwt2',
          }
        )
      ).toEqual({
        jsessionid: '',
        sessionJwt: 'sessionJwt2',
      })
    })
  })
})
