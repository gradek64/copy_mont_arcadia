import createReducer from '../../lib/create-reducer'
import { omit } from 'ramda'

const initialState = { pages: {}, showTacticalMessage: false }

export default createReducer(initialState, {
  SET_SANDBOX_CONTENT: (state, { key, content }) => ({
    ...state,
    pages: {
      ...state.pages,
      [key]: content,
    },
  }),
  RESET_SANDBOX_CONTENT: (state) => ({ ...state, pages: {} }),
  REMOVE_SANDBOX_CONTENT: (state, { key }) => ({
    ...state,
    pages: omit([key], state.pages),
  }),
  SHOW_TACTICAL_MESSAGE: (state) => ({ ...state, showTacticalMessage: true }),
  HIDE_TACTICAL_MESSAGE: (state) => ({ ...state, showTacticalMessage: false }),
})
