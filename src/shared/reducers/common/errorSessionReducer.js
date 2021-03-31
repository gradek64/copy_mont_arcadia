import createReducer from '../../lib/create-reducer'

const initialState = {
  sessionExpired: false,
  showSessionExpiredMessage: false,
}

export default createReducer(initialState, {
  SESSION_EXPIRED: (state) => ({ ...state, sessionExpired: true }),
  RESET_SESSION_EXPIRED: (state) => ({ ...state, sessionExpired: false }),
  SHOW_SESSION_EXPIRED_MESSAGE: (state) => ({
    ...state,
    showSessionExpiredMessage: true,
  }),
  HIDE_SESSION_EXPIRED_MESSAGE: (state) => ({
    ...state,
    showSessionExpiredMessage: false,
  }),
})
