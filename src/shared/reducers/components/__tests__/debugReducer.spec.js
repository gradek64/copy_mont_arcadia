import reducer, { initialState } from '../debugReducer'

describe('SET_DEBUG_INFO', () => {
  it('should handle set debug info', () => {
    const environmentMock = 'environmentMock'
    const buildInfoMock = { test: true }
    const expectedState = {
      montyVisualIndicatorVisible: true,
      environment: environmentMock,
      buildInfo: buildInfoMock,
    }

    const action = {
      type: 'SET_DEBUG_INFO',
      environment: environmentMock,
      buildInfo: buildInfoMock,
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})

describe('ALLOW_DEBUG', () => {
  it('should allow debug', () => {
    const expectedState = { ...initialState, isAllowed: true }
    const action = {
      type: 'ALLOW_DEBUG',
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})

describe('SHOW_DEBUG', () => {
  it('show debug if isAllowed true', () => {
    const previousState = {
      ...initialState,
      isAllowed: true,
    }
    expect(reducer(previousState, { type: 'SHOW_DEBUG' }).isShown).toEqual(true)
  })
})

describe('show debug if false', () => {
  it('should show debug', () => {
    const previousState = {
      ...initialState,
      isAllowed: false,
    }
    expect(reducer(previousState, { type: 'SHOW_DEBUG' }).isShown).toEqual(
      false
    )
  })
})

describe('HIDE_DEBUG', () => {
  it('should hide debug', () => {
    const expectedState = { ...initialState, isShown: false }
    const action = {
      type: 'HIDE_DEBUG',
    }
    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
