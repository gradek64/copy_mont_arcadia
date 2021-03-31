import createReducer from '../../lib/create-reducer'

export default createReducer(
  { points: 0, page: 0 },
  {
    UPDATE_POINTS: (state, { points }) => ({
      ...state,
      points: state.points + points,
    }),
    CLEAR_POINTS: (state) => ({
      ...state,
      points: 0,
    }),
    NEXT_QUIZ_PAGE: (state) => ({
      ...state,
      page: state.page + 1,
    }),
    SET_QUIZ_PAGE: (state, { page }) => ({
      ...state,
      page,
    }),
  }
)
