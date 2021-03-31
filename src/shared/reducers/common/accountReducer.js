import { UPDATE_LOCATION } from 'react-router-redux'
import createReducer from '../../lib/create-reducer'

const initialState = {
  user: {},
  forgetPwd: false,
  myCheckoutDetails: {
    editingEnabled: false,
    initialFocus: undefined,
  },
  exponeaLink: '',
  resetPasswordLinkIsValid: null,
}

function userAccount(state, user) {
  const newState = { ...state, user }
  return newState
}

export default createReducer(initialState, {
  PRE_CACHE_RESET: () => initialState,
  LOGOUT: () => initialState,
  USER_ACCOUNT: (state, { user }) => userAccount(state, user),
  FETCH_EXPONENA_LINK: (state, { link }) => ({ ...state, exponeaLink: link }),
  SET_FORGET_PASSWORD: (state, { value }) => ({ ...state, forgetPwd: value }),
  RESET_PASSWORD_LINK_VALID: (state) => ({
    ...state,
    resetPasswordLinkIsValid: true,
  }),
  RESET_PASSWORD_LINK_INVALID: (state) => ({
    ...state,
    resetPasswordLinkIsValid: false,
  }),
  TOGGLE_FORGET_PASSWORD: (state) => ({
    ...state,
    forgetPwd: !state.forgetPwd,
  }),

  // MyCheckoutDetails
  SET_MCD_INITIAL_FOCUS: (state, { initialFocus }) => ({
    ...state,
    myCheckoutDetails: {
      ...state.myCheckoutDetails,
      initialFocus,
    },
  }),
  [UPDATE_LOCATION]: (state, { payload: { pathname = '' } }) => {
    switch (pathname) {
      case '/my-account/details':
        return {
          ...state,
          myCheckoutDetails: {
            ...state.myCheckoutDetails,
            editingEnabled: false,
          },
        }
      case '/my-account/details/edit':
        return {
          ...state,
          myCheckoutDetails: {
            ...state.myCheckoutDetails,
            editingEnabled: true,
          },
        }
      default:
        return state
    }
  },
})
