import { pathOr, path } from 'ramda'

// User authentiation states
const GUEST_AUTH = 'guest'
const PARTIAL_AUTH = 'partial'
const FULL_AUTH = 'full'

/**
 * @param  {Object} state
 * @return {String} "guest" or "partial" or "full"
 */
export const getUserAuthState = (state) =>
  path(['auth', 'authentication'], state) || GUEST_AUTH

export const isUserAuthenticated = (state) => {
  return pathOr(false, ['auth', 'authentication'], state) === FULL_AUTH
}

export const isUserPartiallyAuthenticated = (state) => {
  return pathOr(false, ['auth', 'authentication'], state) === PARTIAL_AUTH
}

export const isUserAtLeastPartiallyAuthenticated = (state) => {
  return isUserAuthenticated(state) || isUserPartiallyAuthenticated(state)
}
