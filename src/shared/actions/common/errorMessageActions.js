import { errorReport } from '../../../client/lib/reporter'
import { path } from 'ramda'
import { isRestrictedActionResponse } from '../../lib/restricted-actions'

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

function serialiseError({ message, stack }) {
  return {
    message,
    stack,
  }
}

function setError(error, shouldLog) {
  let decoratedError
  if (isProduction()) {
    if (error.message) {
      decoratedError = {
        ...error,
        nativeError: {
          message: error.message,
        },
      }
    } else {
      decoratedError = {
        ...error,
        message: error.nativeError,
        nativeError: {
          message: '',
        },
      }
    }
  } else if (error.nativeError) {
    decoratedError = {
      ...error,
      nativeError: serialiseError(error.nativeError),
    }
  } else {
    decoratedError = error
  }

  if (process.browser && shouldLog) {
    if (decoratedError.nativeError !== undefined) {
      const { message = '' } = decoratedError.nativeError
      errorReport(`set-error:${message}`, {
        ...decoratedError,
        message,
      })
    } else {
      errorReport(`set-error:${decoratedError.message || ''}`, decoratedError)
    }
  }

  return {
    type: 'SET_ERROR',
    error: decoratedError,
  }
}

export function removeError() {
  return {
    type: 'SET_ERROR',
    error: null,
  }
}

export function setCmsError() {
  // In case of CMS error we have to show to the user always the not found page.
  return setError({ statusCode: 404 }, true)
}

function isSessionExpired(error = {}) {
  return (
    path(['response', 'headers', 'session-expired'], error) !== undefined ||
    error.message === 'Must be logged in to perform this action'
  )
}

function isUnauthorised(error) {
  const response = path(['response'], error)
  return isRestrictedActionResponse(response)
}

export function setUserErrorMessage(error) {
  return (dispatch) => {
    if (!isSessionExpired(error)) {
      if (
        error.response &&
        error.response.body &&
        error.response.body.message
      ) {
        dispatch(
          setError({
            message: error.response.body.message,
            isOverlay: true,
            nativeError: {
              message: '',
            },
            noReload: true,
          })
        )
      }
    }
  }
}

export function setGenericError(error, noReload = true) {
  return (dispatch) => {
    if (!isSessionExpired(error) && !isUnauthorised(error)) {
      dispatch(
        setError(
          {
            message: error.message,
            isOverlay: true,
            nativeError: error,
            noReload,
          },
          true
        )
      )
    }
  }
}

/**
 * Sets the passed error in redux state so it can be handled accordingly.
 *
 * @param {Object} error the error to set
 * @returns {Function} thunk to be executed by redux-thunk
 */
export function setApiErrorState(error) {
  /* See PTM-753 - This function is added to allow us to set
   * errors in state without causing New Relic logging as a side effect.
   * This is because there was duplication of logging when setApiError is
   * called both in api-service and then in catch blocks for the same error.
   */
  return (dispatch) => {
    if (isSessionExpired(error)) return

    const errorData =
      error.response && error.response.body
        ? error.response.body
        : {
            message: 'There was a problem, please try again later.',
            nativeError: error,
          }

    dispatch(
      setError(
        {
          ...errorData,
          isOverlay: true,
        },
        false
      )
    )
  }
}

/**
 * Sets the passed error in redux state so it can be handled accordingly.
 * NOTE: this will also log the error to New Relic - use setApiErrorState
 * if that is not intended.
 *
 * @param {Object} error the error to set in state
 *
 * @returns {Function} thunk to be executed by redux-thunk
 */
export function setApiError(error) {
  return (dispatch) => {
    if (!isSessionExpired(error)) {
      if (error.response && error.response.body) {
        dispatch(
          setError(
            {
              ...error.response.body,
              isOverlay: true,
            },
            true
          )
        )
      } else {
        dispatch(
          setError(
            {
              message: 'There was a problem, please try again later.',
              isOverlay: true,
              nativeError: error,
            },
            true
          )
        )
      }
    }
  }
}
