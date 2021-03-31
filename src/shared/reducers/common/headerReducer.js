import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    sticky: false,
  },
  {
    UPDATE_STICKY_HEADER: (state, { sticky }) => ({
      ...state,
      sticky,
    }),
  }
)
