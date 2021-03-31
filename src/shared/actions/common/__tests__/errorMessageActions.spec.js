import * as actions from '../errorMessageActions'
import { errorReport } from '../../../../client/lib/reporter'

jest.mock('../../../../client/lib/reporter')

const dispatch = jest.fn()

const getState = (state) => {
  return () => state
}

const errorMessage = 'AAAAAAHHHH'

describe('Error Message Actions', () => {
  describe('removeError', () => {
    it('returns appropriate object', () => {
      expect(actions.removeError()).toEqual({
        type: 'SET_ERROR',
        error: null,
      })
    })
  })

  describe('setCmsError', () => {
    it('default error', () => {
      expect(actions.setCmsError()).toEqual({
        error: {
          statusCode: 404,
        },
        type: 'SET_ERROR',
      })
    })
  })

  describe('setUserErrorMessage', () => {
    const initialState = {
      config: {
        language: 'en-gb',
        brandName: 'topshop',
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterEach(() => {
      dispatch.mockClear()
    })

    it('ignores session expiry error header', () => {
      const error = {
        response: {
          headers: {
            'session-expired': true,
          },
        },
      }
      const action = actions.setUserErrorMessage(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('ignores session expiry error message', () => {
      const error = {
        message: 'Must be logged in to perform this action',
      }
      const action = actions.setUserErrorMessage(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('handles user and dont have native error stack trace', () => {
      const error1 = {
        response: {
          body: {
            message: errorMessage,
          },
        },
      }

      const action = actions.setUserErrorMessage(error1)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(1)
      const { type, error } = dispatch.mock.calls[0][0]
      expect(type).toEqual('SET_ERROR')
      expect(error).toEqual({
        message: errorMessage,
        isOverlay: true,
        nativeError: {
          message: '',
        },
        noReload: true,
      })
    })
  })

  describe('setGenericError', () => {
    const initialState = {
      config: {
        language: 'en-gb',
        brandName: 'topshop',
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterEach(() => {
      dispatch.mockClear()
    })

    it('ignores session expiry error header', () => {
      const error = {
        response: {
          headers: {
            'session-expired': true,
          },
        },
      }
      const action = actions.setGenericError(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('ignores session expiry error message', () => {
      const error = {
        message: 'Must be logged in to perform this action',
      }
      const action = actions.setGenericError(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('handles default error with noReload set to true by default', () => {
      const error1 = {
        message: errorMessage,
      }
      const action = actions.setGenericError(error1)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(1)
      const { type, error } = dispatch.mock.calls[0][0]
      expect(type).toEqual('SET_ERROR')
      expect(error).toEqual({
        isOverlay: true,
        message: errorMessage,
        nativeError: {
          message: errorMessage,
        },
        noReload: true,
      })
    })

    it('should allow noReload to be set to false', () => {
      const error1 = {
        message: errorMessage,
      }
      const action = actions.setGenericError(error1, false)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(1)
      const { type, error } = dispatch.mock.calls[0][0]
      expect(type).toEqual('SET_ERROR')
      expect(error.noReload).toBe(false)
    })
  })

  describe('setApiError', () => {
    const initialState = {
      config: {
        language: 'en-gb',
        brandName: 'topshop',
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterEach(() => {
      dispatch.mockClear()
    })

    it('ignores session expiry error header', () => {
      const error = {
        response: {
          headers: {
            'session-expired': true,
          },
        },
      }
      const action = actions.setApiError(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('ignores session expiry error message', () => {
      const error = {
        message: 'Must be logged in to perform this action',
      }
      const action = actions.setApiError(error)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(0)
    })

    it('handles response.body', () => {
      const error1 = {
        response: {
          body: {
            message: {
              field: 'AAAAAAHHHHAAAAA',
            },
          },
        },
      }
      const action = actions.setApiError(error1)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(1)
      const { type, error } = dispatch.mock.calls[0][0]
      expect(type).toEqual('SET_ERROR')
      expect(error).toEqual({
        isOverlay: true,
        message: {
          field: 'AAAAAAHHHHAAAAA',
        },
      })
    })

    it('handles default error', () => {
      const error1 = {
        message: 'AAAAAAHHHH',
      }
      const action = actions.setApiError(error1)
      action(dispatch, getState(initialState))
      expect(dispatch.mock.calls.length).toBe(1)
      const { type, error } = dispatch.mock.calls[0][0]
      expect(type).toEqual('SET_ERROR')
      expect(error).toEqual({
        isOverlay: true,
        message: 'There was a problem, please try again later.',
        nativeError: {
          message: 'AAAAAAHHHH',
        },
      })
    })
  })

  describe('setApiErrorState', () => {
    const inititalState = {
      config: {
        language: 'en-gb',
        brandName: 'topshop',
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterEach(() => {
      dispatch.mockClear()
    })

    it('handles response body', () => {
      const error = {
        response: {
          body: {
            message: 'Some error happened',
          },
        },
      }
      const thunk = actions.setApiErrorState(error)

      thunk(dispatch, getState(inititalState))

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_ERROR',
        error: {
          isOverlay: true,
          message: 'Some error happened',
        },
      })
    })

    it('ignores session expiry error header', () => {
      const error = {
        response: {
          headers: {
            'session-expired': true,
          },
        },
      }
      const thunk = actions.setApiErrorState(error)

      thunk(dispatch, getState(inititalState))

      expect(dispatch).toHaveBeenCalledTimes(0)
    })

    it('ignores session expiry error message', () => {
      const error = {
        message: 'Must be logged in to perform this action',
      }
      const thunk = actions.setApiErrorState(error)

      thunk(dispatch, getState(inititalState))

      expect(dispatch).toHaveBeenCalledTimes(0)
    })

    it('handles default error', () => {
      const error = {
        message: 'Some error happened',
      }
      const thunk = actions.setApiErrorState(error)

      thunk(dispatch, getState(inititalState))

      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_ERROR',
        error: {
          isOverlay: true,
          message: 'There was a problem, please try again later.',
          nativeError: {
            message: 'Some error happened',
          },
        },
      })
    })

    it('does not cause New Relic logging', () => {
      process.browser = true
      const error = {
        response: {
          body: {
            message: 'Some error happened',
          },
        },
      }
      const thunk = actions.setApiErrorState(error)

      thunk(dispatch, getState(inititalState))

      expect(errorReport).toHaveBeenCalledTimes(0)
      process.browser = false
    })
  })

  describe('Error logging', () => {
    beforeAll(() => {
      process.browser = true
    })

    afterAll(() => {
      process.browser = false
    })

    it('Includes the error message in the error namespace', () => {
      const message = 'Something bad happened.'
      const thunk = actions.setGenericError({
        message,
      })

      thunk(dispatch)

      expect(errorReport).toHaveBeenCalledWith(
        'set-error:Something bad happened.',
        {
          isOverlay: true,
          message,
          nativeError: {
            message,
          },
          noReload: true,
        }
      )
    })
  })
})
