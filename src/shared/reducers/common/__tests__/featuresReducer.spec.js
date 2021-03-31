import reducer from '../featuresReducer'
import { setJSON } from '../../../../client/lib/cookie'

jest.mock('../../../../client/lib/cookie', () => ({
  setJSON: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../../../constants/features', () => ({
  ALL_FEATURES: {
    FEATURE_A: 'FEATURE_A',
    FEATURE_B: 'FEATURE_B',
    FEATURE_C: 'FEATURE_C',
  },
}))

describe('featuresReducer', () => {
  const initialState = {
    status: {},
    overrides: null,
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle SET_FEATURES', () => {
    const enabled = ['FEATURE_C']
    const overrides = {
      FEATURE_B: true,
    }
    const expectedState = {
      ...initialState,
      status: {
        FEATURE_A: false,
        FEATURE_B: true,
        FEATURE_C: true,
      },
      overrides,
    }
    const action = {
      type: 'SET_FEATURES',
      enabled,
      overrides,
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle TOGGLE_FEATURE', () => {
    const currentState = {
      status: {
        FEATURE_A: false,
      },
      overrides: {},
    }
    const expectedState = {
      status: {
        FEATURE_A: true,
      },
      overrides: {
        FEATURE_A: true,
      },
    }
    const action = {
      type: 'TOGGLE_FEATURE',
      feature: 'FEATURE_A',
    }

    expect(reducer(currentState, action)).toEqual(expectedState)

    currentState.status.FEATURE_A = true
    expectedState.status.FEATURE_A = false
    expectedState.overrides.FEATURE_A = false

    expect(reducer(currentState, action)).toEqual(expectedState)
  })

  it('should handle REMOVE_OVERRIDES', () => {
    const currentState = {
      overrides: {
        SOME_FEATURE: true,
      },
    }
    const expectedState = {
      overrides: {},
    }
    const action = {
      type: 'REMOVE_OVERRIDES',
    }

    expect(reducer(currentState, action)).toEqual(expectedState)
  })

  describe('SET_FEATURE_STATE', () => {
    beforeEach(() => {
      setJSON.mockReset()
    })

    it('should set feature to false if value is false', () => {
      const currentState = {
        status: {
          FEATURE_A: true,
        },
        overrides: {},
      }

      const expectedState = {
        status: {
          FEATURE_A: false,
        },
        overrides: {
          FEATURE_A: false,
        },
      }

      const action = {
        type: 'SET_FEATURE_STATE',
        feature: 'FEATURE_A',
        value: false,
      }

      expect(reducer(currentState, action)).toEqual(expectedState)
      expect(setJSON).toHaveBeenCalled()
    })

    it('should set feature to true if value is true', () => {
      const currentState = {
        status: {
          FEATURE_A: false,
        },
        overrides: {},
      }

      const expectedState = {
        status: {
          FEATURE_A: true,
        },
        overrides: {
          FEATURE_A: true,
        },
      }

      const action = {
        type: 'SET_FEATURE_STATE',
        feature: 'FEATURE_A',
        value: true,
      }

      expect(reducer(currentState, action)).toEqual(expectedState)
      expect(setJSON).toHaveBeenCalled()
    })

    it('should not call setJSON if setCookie prop is false', () => {
      const currentState = {
        status: {
          FEATURE_A: true,
        },
        overrides: {},
      }

      const expectedState = {
        status: {
          FEATURE_A: false,
        },
        overrides: {
          FEATURE_A: false,
        },
      }

      const action = {
        type: 'SET_FEATURE_STATE',
        feature: 'FEATURE_A',
        value: false,
        setCookie: false,
      }

      expect(reducer(currentState, action)).toEqual(expectedState)
      expect(setJSON).not.toHaveBeenCalled()
    })
  })
})
