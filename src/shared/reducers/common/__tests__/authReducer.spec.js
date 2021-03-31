import reducer from '../authReducer'
import {
  authPending,
  authLogin,
  setAuthentication,
} from '../../../actions/common/authActions'
import { preCacheReset } from '../../../actions/common/pageCacheActions'

describe('authReducer', () => {
  const initialState = {
    authentication: false,
    loading: false,
    bvToken: undefined,
    loginLocation: undefined,
    traceId: undefined,
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle AUTH_PENDING', () => {
    const expectedState = {
      ...initialState,
      loading: true,
    }

    expect(reducer(undefined, authPending(expectedState.loading))).toEqual(
      expectedState
    )
  })

  it('should handle LOGIN', () => {
    const expectedState = {
      ...initialState,
      bvToken: 'fakeToken',
      loginLocation: {
        someFakeSheet: 'test',
      },
    }
    let action
    const dispatch = (a) => {
      action = a
    }
    const getState = () => ({
      routing: {
        location: expectedState.loginLocation,
      },
    })

    authLogin(expectedState.bvToken)(dispatch, getState)

    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle SET_AUTHENTICATION for fully authenticated users', () => {
    const expectedState = {
      ...initialState,
      authentication: 'full',
    }

    expect(
      reducer(undefined, setAuthentication(expectedState.authentication))
    ).toEqual(expectedState)
  })

  it('should handle SET_AUTHENTICATION for partially authenticated users', () => {
    const expectedState = {
      ...initialState,
      authentication: 'partial',
    }

    expect(
      reducer(undefined, setAuthentication(expectedState.authentication))
    ).toEqual(expectedState)
  })

  it('should handle PRE_CACHE_RESET', () => {
    const expectedState = initialState
    const mockState = {
      ...initialState,
      mockDirtyProp: 'test',
    }

    expect(reducer(mockState, preCacheReset())).toEqual(expectedState)
  })

  it('should replace state when there is auth key in RETRIEVE_CACHED_DATA', () => {
    const expectedState = {
      ...initialState,
      mockDirtyProp: 'test',
    }
    const action = { type: 'RETRIEVE_CACHED_DATA', auth: expectedState }

    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should not replace state when there is no auth key in RETRIEVE_CACHED_DATA', () => {
    const expectedState = {
      ...initialState,
      mockDirtyProp: 'test',
    }
    const action = { type: 'RETRIEVE_CACHED_DATA' }

    expect(reducer(expectedState, action)).toEqual(expectedState)
  })

  it('should handle LOGOUT', () => {
    const expectedState = initialState
    const mockState = {
      ...initialState,
      mockDirtyProp: 'test',
    }

    expect(reducer(mockState, preCacheReset())).toEqual(expectedState)
  })
})
