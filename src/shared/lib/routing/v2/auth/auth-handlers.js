import { isReturningCustomer } from '../../../../selectors/checkoutSelectors'
import { isAuth } from './auth-helpers'

export const requiresAuth = ({ getState }, nextState, replace) => {
  if (!isAuth(getState())) {
    replace('/checkout/login')
  }
}

export const requiresNotAuth = ({ getState }, nextState, replace, callback) => {
  if (isAuth(getState()) && process.browser) {
    const state = getState()

    if (isReturningCustomer(state)) {
      replace('/checkout/delivery-payment')
    } else {
      replace('/checkout/delivery')
    }
  }
  callback()
}

export const checkAuthentication = ({ getState }, nextState, replace) => {
  const authenticated = isAuth(getState())
  let path
  switch (true) {
    case nextState.location.pathname === '/login' && authenticated:
      path = '/my-account'
      break
    case nextState.location.pathname.indexOf('/my-account') !== -1 &&
      !authenticated:
      path = '/login'
      break
    default:
      return
  }

  replace(`${path}${nextState.location.search || ''}`)
}
