import reducer from '../errorMessageReducer'

describe('errorMessageReducer', () => {
  const initialState = null

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle SET_ERROR', () => {
    const error = 'an error'
    const expectedState = error
    const action = {
      type: 'SET_ERROR',
      error,
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
