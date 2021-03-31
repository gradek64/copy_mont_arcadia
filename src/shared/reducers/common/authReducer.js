import createReducer from '../../lib/create-reducer'
import { setCacheData } from '../../../client/lib/storage'

const initialState = {
  authentication: false,
  loading: false,
  bvToken: undefined,
  loginLocation: undefined,
  traceId: undefined,
}

function setAuth(state, { authentication }) {
  const newState = { ...state, authentication }
  if (process.browser) setCacheData('auth', newState)
  return newState
}

export default createReducer(initialState, {
  AUTH_PENDING: (state, { loading }) => ({ ...state, loading }),
  LOGIN: (state, { bvToken, loginLocation }) => ({
    ...state,
    bvToken,
    loginLocation,
  }),
  SET_AUTHENTICATION: setAuth,
  USER_ACCOUNT: (state) => setAuth(state, { authentication: 'full' }),
  PRE_CACHE_RESET: () => initialState,
  RETRIEVE_CACHED_DATA: (state, { auth }) => auth || state,
  LOGOUT: () => initialState,
})
