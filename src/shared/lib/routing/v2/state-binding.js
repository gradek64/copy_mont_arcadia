import bindHandlers from '../bind-handlers'
import * as authHandlers from './auth/auth-handlers'
import * as checkoutHandlers from './checkout/checkout-handlers'

const routeHandlers = {
  ...authHandlers,
  ...checkoutHandlers,
}

export default bindHandlers(routeHandlers)
