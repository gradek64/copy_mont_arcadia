export const updatePoints = (points) => {
  return {
    type: 'UPDATE_POINTS',
    points,
  }
}

export const clearPoints = () => {
  return {
    type: 'CLEAR_POINTS',
  }
}

export const nextPage = () => {
  return {
    type: 'NEXT_QUIZ_PAGE',
  }
}

export const setPage = (page) => {
  return {
    type: 'SET_QUIZ_PAGE',
    page,
  }
}

export function selectAnswer(
  points,
  skips = false,
  isLast = false,
  nextIndex = -1
) {
  return (dispatch) => {
    dispatch(updatePoints(points))
    if (skips || isLast) dispatch(setPage(nextIndex))
    else dispatch(nextPage())
  }
}

export function clearQuiz() {
  return (dispatch) => {
    dispatch(setPage(0))
    dispatch(clearPoints())
  }
}
