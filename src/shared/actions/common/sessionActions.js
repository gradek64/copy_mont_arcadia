import React from 'react'
import { pathOr, isEmpty } from 'ramda'
import { logoutRequest } from './authActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { closeMiniBag } from './shoppingBagActions'
import { closeModal, showModal } from './modalActions'
import { parseCookieString } from '../../lib/cookie'
import SignIn from '../../components/containers/SignIn/SignIn'
import { getRedirectUrl, routeMatchesLocation } from '../../lib/session-utils'
import { getLocation } from '../../selectors/routingSelectors'
import * as SESSION_TYPES from '../types/sessionActionTypes'

export const excludedRoutes = ['/checkout/login', '/login']

export function sessionReset() {
  return {
    type: SESSION_TYPES.RESET_SESSION_EXPIRED,
  }
}

export function setSessionExpired() {
  return { type: SESSION_TYPES.SESSION_EXPIRED }
}

export function showSessionExpiredMessage() {
  return { type: SESSION_TYPES.SHOW_SESSION_EXPIRED_MESSAGE }
}

export function hideSessionExpiredMessage() {
  return { type: SESSION_TYPES.HIDE_SESSION_EXPIRED_MESSAGE }
}

export function openSessionTimeoutModal(callback) {
  return (dispatch, getState) => {
    const location = getLocation(getState())
    const ui = (
      <SignIn location={location} successCallback={callback} hideRegister />
    )

    dispatch(
      showModal(ui, {
        mode: 'sessionTimeout',
      })
    )
  }
}

// The side-effects on session timeout error are centralised on `sessionExpired` now
// All the references to <ErrorSession /> component have removed since it is not required for dual-run
// I would recommend to display a Session Timeout Error modal which on close will perform the redirect
// as opposed as just redirecting without any feedback
// This can be achieved by overriding the loginRequest redirect and dispatching a showModal action below
export function sessionExpired() {
  return (dispatch, getState, context) => {
    /*
     * There is an issue with session timeout does not logout the user before redirecting
     * the user to checkout/login. Because of this, when the user enters checkout/login
     * the user is instantly redirect back to checkout/delivery. Creating and infinite
     * redirect loop between checkout login and delivery.
     *
     * This has been patched by blocking logoutRequest() from being called again.
     * By checking the user has been redirected to checkout/login already.
     *
     * This was implemented for DES-5440
     *  */
    const state = getState()
    const shouldNotShowModal = excludedRoutes.some((route) =>
      routeMatchesLocation(route, state)
    )

    if (shouldNotShowModal) return null

    dispatch(ajaxCounter('increment'))
    dispatch(setSessionExpired())
    dispatch(showSessionExpiredMessage())
    dispatch(closeMiniBag())
    dispatch(closeModal())

    const redirectUrl = getRedirectUrl(getState())

    return dispatch(logoutRequest(redirectUrl)).then((resp) => {
      dispatch(ajaxCounter('decrement'))
      dispatch(sessionReset())

      if (isEmpty(redirectUrl)) {
        dispatch(openSessionTimeoutModal())
      }

      if (!process.browser) {
        const cookies = pathOr([], ['headers', 'set-cookie'], resp)
        if (cookies) {
          const parsedCookies = cookies.map(parseCookieString)
          context.setCookies(parsedCookies)
        }
      }
    })
  }
}
