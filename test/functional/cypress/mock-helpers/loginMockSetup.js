import {
  authStateCookieUpdate,
  setBagCountCookie,
  setUpMocksForRouteList,
} from '../lib/helpers'
import routes from '../constants/routes'
import paymentsResponse from '../fixtures/login/payments--ukBillingUkDelivery.json'
import passwordResetLinkValidResponse from '../fixtures/my-account/password-reset-link-valid.json'
import passwordResetLinkInvalidResponse from '../fixtures/my-account/password-reset-link-invalid.json'

export default class loginMocks {
  mocksForAccountAndLogin = (selectedEndpoints = {}) => {
    const {
      setAuthStateCookie,
      bagCountCookie,
      getAccount,
      postAccount,
      putAccountShort,
      getAccount401,
      register,
      register422,
      login,
      login422,
      getOrderHistory,
      getOrderHistory401,
      getReturnHistory,
      resetPassword,
      resetPasswordLink,
      getItems,
    } = selectedEndpoints

    authStateCookieUpdate(setAuthStateCookie)
    setBagCountCookie(bagCountCookie)

    const loginAccountRoutes = [
      getAccount && {
        method: 'GET',
        url: routes.account.account,
        response: getAccount,
        alias: 'get-account',
      },
      postAccount && {
        method: 'POST',
        url: routes.account.login,
        response: postAccount,
        alias: 'post-account',
      },
      putAccountShort && {
        method: 'PUT',
        url: routes.account.shortDetails,
        response: putAccountShort,
        alias: 'put-account-short',
      },
      getAccount401 && {
        method: 'GET',
        url: routes.account.account,
        response: getAccount401,
        status: 401,
        alias: 'account-401',
      },
      register && {
        method: 'POST',
        url: routes.account.registerNewUser,
        response: register,
        alias: 'register',
      },
      register422 && {
        method: 'POST',
        url: routes.account.registerNewUser,
        response: register422,
        status: 422,
        alias: 'register-422',
      },
      login && {
        method: 'POST',
        url: routes.account.login,
        response: login,
        alias: 'login',
      },
      login422 && {
        method: 'POST',
        url: routes.account.login,
        response: login422,
        status: 422,
        alias: 'login-422',
      },
      getOrderHistory && {
        method: 'GET',
        url: routes.account.orderHistory,
        response: getOrderHistory,
        alias: 'order-history',
      },
      getOrderHistory401 && {
        method: 'GET',
        url: routes.account.orderHistory,
        response: getOrderHistory401,
        status: 401,
        alias: 'order-history-401',
      },
      getReturnHistory && {
        method: 'GET',
        url: routes.account.returnHistory,
        response: getReturnHistory,
        alias: 'return-history',
      },
      resetPassword && {
        method: 'PUT',
        url: routes.account.resetPassword,
        response: resetPassword,
        alias: 'reset-password',
      },
      resetPasswordLink && {
        method: 'POST',
        url: routes.account.resetPasswordLink,
        response: resetPasswordLink,
        alias: 'reset-password-link',
      },
      getItems && {
        method: 'GET',
        url: routes.shoppingBag.getItems,
        response: getItems,
        alias: 'get-items',
      },
      {
        method: 'DELETE',
        url: routes.account.logout,
        response: '{}',
        alias: 'logout',
      },
      {
        method: 'GET',
        url: /^\/api\/payments/,
        response: paymentsResponse,
        alias: 'payments',
      },
      passwordResetLinkValidResponse && {
        method: 'POST',
        url: routes.account.validateResetPassword,
        response: passwordResetLinkValidResponse,
        alias: 'valid-reset-password',
      },
    ]
    setUpMocksForRouteList(loginAccountRoutes)
    return this
  }

  mockForInvalidResetPasswordLink = () => {
    const loginAccountRoutes = [
      passwordResetLinkInvalidResponse && {
        method: 'POST',
        url: routes.account.validateResetPassword,
        response: passwordResetLinkInvalidResponse,
        alias: 'invalid-reset-password',
      },
    ]
    setUpMocksForRouteList(loginAccountRoutes)
    return this
  }
}
