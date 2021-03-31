import createReducer from '../../lib/create-reducer'

export const initialState = {
  jsessionid: '', // jsessionid
  sessionJwt: '', // sessionJwt (BACKEND_JWT constant)
}

export default createReducer(initialState, {
  SET_JSESSION_ID: (state, { jsessionid }) => ({
    ...state,
    jsessionid,
  }),
  SET_SESSION_JWT: (state, { sessionJwt }) => ({
    ...state,
    sessionJwt,
  }),
})
