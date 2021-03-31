import createReducer from '../../lib/create-reducer'

const initialState = { success: false }

export default createReducer(initialState, {
  RESET_PASSWORD_FORM_LEAVE: () => initialState,
  RESET_PASSWORD_FORM_API_SUCCESS: (state, { payload = {} }) => {
    return {
      ...state,
      success: true,
      basketCount: parseInt(payload.basketItemCount, 10),
    }
  },
  LOGOUT: () => initialState,
})
