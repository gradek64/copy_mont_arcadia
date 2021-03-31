import reducer from '../errorSessionReducer'

describe('errorSessionReducer', () => {
  const initialState = {
    sessionExpired: false,
    showSessionExpiredMessage: false,
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle SESSION_EXPIRED', () => {
    const expectedState = {
      sessionExpired: true,
      showSessionExpiredMessage: false,
    }
    const action = {
      type: 'SESSION_EXPIRED',
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle RESET_SESSION_EXPIRED', () => {
    const expectedState = initialState
    const currentState = {
      sessionExpired: true,
      showSessionExpiredMessage: false,
    }
    const action = {
      type: 'RESET_SESSION_EXPIRED',
    }

    expect(reducer(currentState, action)).toEqual(expectedState)
  })
})
