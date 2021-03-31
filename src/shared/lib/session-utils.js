import { isEmpty, path, equals } from 'ramda'

export const getRedirectUrl = (state) => {
  if (isEmpty(state)) {
    return '/login'
  }
  const {
    routing: {
      location: { pathname, search },
    },
  } = state

  const url = `${pathname}${search}`

  let redirectUrl = ''

  // My Account
  if (url.includes('/my-account')) {
    redirectUrl = '/login'

    // Checkout
  } else if (url.includes('/checkout/')) {
    redirectUrl = '/checkout/login'
  }

  return redirectUrl
}

export const routeMatchesLocation = (route, state) => {
  return equals(path(['routing', 'location', 'pathname'], state), route)
}
