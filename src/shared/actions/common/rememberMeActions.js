import { path, pathOr } from 'ramda'
import { redirect } from './redirectActions'
import { updateBag } from './shoppingBagActions'
import { setAuthentication } from './authActions'
import { userAccount } from './accountActions'
import {
  isInCheckout as isInCheckoutSelector,
  isMyAccount,
} from '../../selectors/routingSelectors'
import { isFeatureRememberMeEnabled } from '../../selectors/featureSelectors'
import { getUser } from '../../selectors/common/accountSelectors'
import { isUserPartiallyAuthenticated } from '../../selectors/userAuthSelectors'
import { parseCookieString } from '../../lib/cookie'

export const rememberMeRedirect = (response) => (
  dispatch,
  getState,
  context
) => {
  const state = getState()
  const isInCheckout = isInCheckoutSelector(state)
  const isInMyAccount = isMyAccount(state)

  if (!isInCheckout && !isInMyAccount) return

  if (!process.browser) {
    const responseCookies = pathOr([], ['headers', 'set-cookie'], response)
    const authCookie = responseCookies.find((cookie) =>
      cookie.includes('authenticated')
    )

    if (authCookie) {
      const [key, value, options] = parseCookieString(authCookie)
      context.setCookies([
        [
          key,
          value,
          {
            path: options.Path,
            ttl: options['Max-Age'] * 1000,
            domain: options.Domain,
          },
        ],
      ])
    }
  }

  // If we are in my account and 401 response redirect user back to login if partially restricted
  if (isInMyAccount) {
    return dispatch(redirect('/login'))
  }
  return dispatch(redirect('/checkout/login'))
}

export const handleRestrictedActionResponse = (response) => (
  dispatch,
  getState
) => {
  const state = getState()

  if (!isFeatureRememberMeEnabled(state)) {
    return
  }
  // Attempting a request that is Unauthorised updates the client state so
  // that the 'Remember Me' feature can restrict user actions accordingly.
  const account = path(['body', 'account'], response)
  const rememberMe = pathOr(false, ['rememberMe'], account)
  const email = pathOr('', ['email'], account)
  const basketItemCount = pathOr(0, ['basketItemCount'], account)
  const basket = pathOr(null, ['body', 'basket'], response)

  // Minimal account information should be received as part of the
  // restricted action response. Ordinarily this information is
  // already present in redux, but if the user refreshes the page
  // this will provide enough detail to pre-fill a login form.
  const user = getUser(state)
  dispatch(
    userAccount({
      ...user,
      email,
      basketItemCount,
    })
  )

  if (rememberMe) {
    dispatch(setAuthentication('partial'))
  }

  if (basket) {
    dispatch(updateBag(basket))
  }

  // Ensure a redirect is only caused once
  // on the server to avoid redirection loops
  if (!isUserPartiallyAuthenticated(state)) {
    dispatch(rememberMeRedirect(response))
  }
}
