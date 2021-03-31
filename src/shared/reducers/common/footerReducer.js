import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    newsletter: {},
  },
  {
    SET_FOOTER_CONFIG: (state, { config }) => ({
      ...state,
      config,
    }),
    SET_FOOTER_NEWSLETTER: (state, { newsletter }) => ({
      ...state,
      newsletter,
    }),
  }
)
