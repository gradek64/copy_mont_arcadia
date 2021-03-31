// TODO : bring back toast error message for logout
import { path } from 'ramda'
import { browserHistory } from 'react-router'
import { post, del } from '../../lib/api-service'
import { setFormMessage } from './formActions'
import { setApiError } from './errorMessageActions'
import { errorReport } from '../../../client/lib/reporter'
import { clearCacheData, isStorageSupported } from '../../../client/lib/storage'
import { userAccount } from './accountActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import {
  sendAnalyticsErrorMessage,
  ANALYTICS_ERROR,
  GTM_TRIGGER,
  GTM_EVENT,
  sendAnalyticsDisplayEvent,
} from '../../analytics'
import {
  updateShoppingBagBadgeCount,
  checkForMergedItemsInBag,
  getBag,
  synchroniseBagPostLogin,
  clearMiniBagMessages,
  resetShoppingBag,
} from './shoppingBagActions'
import { emptyOrderSummary } from './checkoutActions'
import {
  updateMenuForAuthenticatedUser,
  updateMenuForUnauthenticatedUser,
} from './navigationActions'
import { localise } from '../../lib/localisation'
import { resetKlarna } from './klarnaActions'
import { getAllPaymentMethods } from './paymentMethodsActions'
import { getDefaultWishlist, clearWishlist } from './wishlistActions'
import { redirect } from './redirectActions'
import { isUserPartiallyAuthenticated } from '../../selectors/userAuthSelectors'
import { isFeatureWishlistEnabled } from '../../selectors/featureSelectors'
import { getUserEmail } from '../../selectors/common/accountSelectors'
import { getShoppingBagTotalItems } from '../../selectors/shoppingBagSelectors'

/* Global Auth pending State */
export function authPending(loading) {
  return {
    type: 'AUTH_PENDING',
    loading,
  }
}

export function authLogin(bvToken) {
  return (dispatch, getState) => {
    dispatch({
      type: 'LOGIN',
      bvToken,
      loginLocation: getState().routing.location,
    })
  }
}

export function setAuthentication(authentication) {
  return {
    type: 'SET_AUTHENTICATION',
    authentication,
  }
}

export function setInitialWishlist(successCallback) {
  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(getDefaultWishlist()).then(() => {
      if (successCallback) {
        const callbackResult = successCallback()

        if (callbackResult instanceof Promise) {
          return callbackResult.then(dispatch(ajaxCounter('decrement')))
        }
      }

      dispatch(ajaxCounter('decrement'))
    })
  }
}

export function loginRequest({
  credentials,
  getNextRoute = () => '',
  formName = 'login',
  successCallback,
  errorCallback,
}) {
  return (dispatch, getState) => {
    dispatch(authPending(true))
    dispatch(ajaxCounter('increment'))
    dispatch(setFormMessage(formName, {}))
    const preLoginState = getState()
    dispatch(post('/account/login', credentials)).then(
      (res) => {
        const currentEmail = getUserEmail(getState())
        const nextEmail = path(['body', 'email'], res)
        /* Due to the introduction of the 'Remember me' feature
        * a user is not necessarily logged out when loggin in as another user.
        * Therefore we need to clear order state to avoid merging different users
        * and other clashes.
        */
        if (currentEmail && currentEmail !== nextEmail) {
          dispatch(emptyOrderSummary())
          dispatch(resetShoppingBag())
        }

        /* Do not "getBag()" when a user logs in from /checkout/login
         *
         * Do "getBag()" if a user logs in from:
         *  - /login
         *  - Session timeout login modal
         *  - Wishlist login modal
         *  */
        if (getNextRoute() !== '/checkout') {
          dispatch(getBag(true))
          dispatch(
            sendAnalyticsDisplayEvent(
              {
                bagDrawerTrigger: GTM_TRIGGER.LOGIN,
                openFrom: preLoginState.pageType,
              },
              GTM_EVENT.BAG_DRAWER_DISPLAYED
            )
          )
        }

        dispatch(updateShoppingBagBadgeCount(res.body.basketItemCount))
        if (res.body.isPwdReset) {
          dispatch(authPending(false))
          dispatch(ajaxCounter('decrement'))
          dispatch(userAccount(res.body))
          dispatch(setAuthentication('full'))
          dispatch(updateMenuForAuthenticatedUser())
          dispatch(synchroniseBagPostLogin(preLoginState))

          browserHistory.push('/reset-password')

          // successCallback is used on checkout to fetch the ordersummary after a successful login
          if (successCallback) successCallback()
          return
        }
        dispatch(authLogin(res.headers.bvtoken))

        dispatch(authPending(false))
        dispatch(ajaxCounter('decrement'))
        dispatch(userAccount(res.body))
        dispatch(setAuthentication('full'))
        dispatch(updateMenuForAuthenticatedUser())

        // ADP-3321: Replacing getPaymentMethods with getAllPaymentMethods.
        // This is a provisional change as the ultimate goal is populate paymentMethods in the SSR.
        // @TODO To be removed in ADP-3653
        dispatch(getAllPaymentMethods())

        /* /checkout/login requires res.body to get the next route
         *  */
        const nextRoute = getNextRoute && getNextRoute(res.body)
        if (nextRoute !== '') browserHistory.replace(nextRoute)

        dispatch(checkForMergedItemsInBag(preLoginState))
        dispatch(synchroniseBagPostLogin(preLoginState))

        if (isFeatureWishlistEnabled(getState()))
          return dispatch(setInitialWishlist(successCallback))

        if (successCallback) successCallback()
      },
      (err) => {
        if (err.response && err.response.body && err.response.body.message) {
          dispatch(
            setFormMessage(formName, {
              type: 'error',
              message: err.response.body.message,
            })
          )
        }
        dispatch(authPending(false))
        dispatch(ajaxCounter('decrement'))
        dispatch(sendAnalyticsErrorMessage(ANALYTICS_ERROR.LOGIN_FAILED))

        if (errorCallback) errorCallback(err)
      }
    )
  }
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: 'LOGOUT',
    })
    dispatch(updateMenuForUnauthenticatedUser())
  }
}

export function logoutRequest(redirectLocation = '/') {
  return (dispatch, getState) => {
    dispatch(authPending(true))
    dispatch(ajaxCounter('increment'))
    return dispatch(del('/account/logout'))
      .then((resp) => {
        clearCacheData()
        dispatch(logout())
        dispatch(authPending(false))
        dispatch(ajaxCounter('decrement'))
        if (isFeatureWishlistEnabled(getState())) dispatch(clearWishlist())
        dispatch(resetKlarna())
        dispatch(updateShoppingBagBadgeCount(0))
        dispatch(clearMiniBagMessages())
        if (redirectLocation) dispatch(redirect(redirectLocation))
        return resp
      })
      .catch((err) => {
        if (err.statusCode && err.statusCode >= 500) {
          dispatch(setApiError(err))
          dispatch(ajaxCounter('decrement'))
        } else {
          dispatch(logout())
          dispatch(ajaxCounter('decrement'))
          dispatch(redirect(redirectLocation))
          const { language, brandName } = getState().config
          const l = localise.bind(null, language, brandName)
          const resp = err.response
          const error = {
            message:
              (resp && resp.body && l(resp.body.message)) ||
              l`logout worked but the api sent back errors`,
          }
          errorReport('authActions', error)
        }
        return err.response
      })
  }
}

/* User Registration Actions */
export function registerSuccess(user) {
  return {
    type: 'REGISTER_SUCCESS',
    user,
  }
}

export function registerError(error) {
  return {
    type: 'REGISTER_ERROR',
    error,
  }
}

export function registerRequest({
  formData,
  getNextRoute,
  formName = 'register',
  successCallback,
  errorCallback,
}) {
  return (dispatch, getState) => {
    dispatch(authPending(true))
    dispatch(ajaxCounter('increment'))
    dispatch(setFormMessage('register', {}))
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    dispatch(post('/account/register', formData)).then(
      (res) => {
        // This statement is to handle scenarios where wcs is unable to create an account e.g. system is down.
        // In this case we still receive a successful response 200 but the account is not created.
        // In this scenario wcs returns the property 'success: false' therefore we are performing a check on this property
        // and if false we stop the execution of this action and populate the registration form error message
        if (!res.body.success) {
          dispatch(authPending(false))
          dispatch(ajaxCounter('decrement'))
          return dispatch(
            setFormMessage(formName, {
              type: 'error',
              message: l`There was an error submitting the form. Please try again.`,
            })
          )
        }
        // Hook for the Qubit tag "iProspect Registration Confirmation"
        document.dispatchEvent(new Event('registrationSuccessful'))
        const events = ['event9']
        if (formData.subscribe) events.push('event4')

        if (formName === 'wishlistLoginModal') dispatch(getBag())

        dispatch(authLogin(res.headers.bvtoken))
        dispatch(userAccount(res.body))
        dispatch(setAuthentication('full'))
        dispatch(authPending(false))
        dispatch(ajaxCounter('decrement'))
        dispatch(updateMenuForAuthenticatedUser())
        const nextRoute = getNextRoute && getNextRoute()
        browserHistory.push(nextRoute || '/my-account')

        if (isFeatureWishlistEnabled(getState()))
          return dispatch(setInitialWishlist(successCallback))

        if (successCallback) successCallback()
      },
      (err) => {
        const handleFail = () => {
          dispatch(
            setFormMessage(formName, {
              type: 'error',
              message: path(['response', 'body', 'message'], err),
            })
          )
          dispatch(authPending(false))
          dispatch(ajaxCounter('decrement'))
          if (errorCallback) errorCallback(err)
        }
        dispatch(sendAnalyticsErrorMessage(ANALYTICS_ERROR.REGISTRATION_FAILED))
        if (
          path(['response', 'body', 'originalMessage'], err) ===
          'Unable to create account while user logged in, please logout'
        ) {
          return dispatch(del('/account/logout'))
            .catch(() => handleFail())
            .then(() =>
              dispatch(registerRequest({ formData, getNextRoute, formName }))
            )
        }
        handleFail()
      }
    )
  }
}

const shouldLogout = (state) => {
  const cached_auth =
    isStorageSupported('localStorage') &&
    JSON.parse(localStorage.getItem('cached_auth'))
  const cachePartialAuth = path(['authentication'], cached_auth) === 'partial'

  return isUserPartiallyAuthenticated(state) || cachePartialAuth
}

export const registerUser = (props) => async (dispatch, getState) => {
  const state = getState()
  const { formData, getNextRoute, formName } = props

  if (shouldLogout(state)) {
    await dispatch(logoutRequest(null))
    return dispatch(registerRequest({ formData, getNextRoute, formName }))
  }

  dispatch(registerRequest(props))
}

export const continueAsGuest = () => async (dispatch, getState) => {
  const state = getState()

  if (shouldLogout(state)) {
    await dispatch(logoutRequest())
    return clearCacheData('auth')
  }

  const totalItems = getShoppingBagTotalItems(state)
  const destination = totalItems > 0 ? '/guest/checkout/delivery' : '/'
  browserHistory.push(destination)
}
