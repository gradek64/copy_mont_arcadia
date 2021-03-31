import createReducer from '../../lib/create-reducer'

const initialState = { success: false }

export default createReducer(initialState, {
  CHANGE_PASSWORD_SUCCESS: (state, { hasSucceeded }) => ({
    ...state,
    success: hasSucceeded,
  }),
  SET_POST_RESET_URL: (state, { postResetURL }) => ({ ...state, postResetURL }),
  LOGOUT: () => initialState,
})
