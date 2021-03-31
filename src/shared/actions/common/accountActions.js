import { updateMenuForAuthenticatedUser } from './navigationActions'
import { setFindAddressMode } from './checkoutActions'
import {
  updateOrderId,
  updateShoppingBagBadgeCount,
} from './shoppingBagActions'
import { get, post, put } from '../../lib/api-service'
import {
  getDefaultAddress,
  getDefaultPaymentOptions,
  isUserCreditCard,
} from '../../lib/checkout-utilities/actions-helpers'
import { getUnconfirmedDDPUser } from '../../lib/checkout-utilities/utils'
import { passwordMatchesPrevious } from '../../lib/account-utils'

import { path, pathOr, pluck } from 'ramda'
import { browserHistory } from 'react-router'
import {
  getUser,
  getExponeaMemberId,
  getExponeaLink,
} from '../../selectors/common/accountSelectors'
import { getFormNames, getAddressForm } from '../../selectors/formsSelectors'
import { getPaymentMethodTypeByValue } from '../../selectors/paymentMethodSelectors'
import { getRoutePath, isMyAccount } from '../../selectors/routingSelectors'
import { isUserAtLeastPartiallyAuthenticated } from '../../selectors/userAuthSelectors'
import { isFeatureMyPreferencesEnabled } from '../../selectors/featureSelectors'
import {
  setFormMeta,
  setFormMessage,
  resetForm,
  setFormSuccess,
  handleFormResponseErrorMessage,
  resetFormPartial,
  clearFormErrors,
} from './formActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import {
  setPostResetUrl,
  changePasswordSuccess,
} from '../components/ChangePasswordActions'
import { setGenericError } from './errorMessageActions'
import { getAllPaymentMethods } from './paymentMethodsActions'
import { formNames } from '../../constants/forms'
import * as logger from '../../../server/lib/logger'
import * as clientLogger from '../../../client/lib/logger'
import { orderLinesSortedWithTracking } from '../../lib/order-details'
import { removeDiacriticsDeep } from '../../lib/checkout-utilities/klarna-utils'

export function userAccount(user) {
  return {
    type: 'USER_ACCOUNT',
    user,
  }
}

export const fetchExponeaLink = (link) => {
  return {
    type: 'FETCH_EXPONENA_LINK',
    link,
  }
}

export function closeCustomerDetailsModal() {
  return setFormMeta('customerDetails', 'modalOpen', false)
}

// Exponea action
export const getPreferenceLink = () => async (dispatch, getState) => {
  const { locale } = getState().config
  const memberId = getExponeaMemberId(getState())
  if (memberId) {
    try {
      const res = await dispatch(post('/exponea', { memberId }))
      const link = path(['body', 'link'], res)
      dispatch(fetchExponeaLink(`${link}?lang=${locale}`))
    } catch (error) {
      clientLogger.nrBrowserLogError('exponea api error', error)
    }
  }
}

export function getAccount() {
  return async (dispatch, getState) => {
    const state = getState()
    if (!isUserAtLeastPartiallyAuthenticated(state)) return
    dispatch(ajaxCounter('increment'))
    try {
      const response = await dispatch(get('/account'))

      // if user has bought ddp, review the end date of the subscription
      // because if the fraud check isn't complete the end date will be accurate
      // but isDDPUser status won't reflect the successful purchase
      const updatedUser = getUnconfirmedDDPUser(response.body)

      dispatch(userAccount(updatedUser))
      if (
        isFeatureMyPreferencesEnabled(state) &&
        !getExponeaLink(state) &&
        isMyAccount(state)
      ) {
        await dispatch(getPreferenceLink())
      }
    } catch (error) {
      dispatch(setGenericError(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function updateAccount(data) {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(put('/account/customerdetails', data))
      const formName = 'customerDetails'

      dispatch(setFormMeta(formName, 'modalOpen', true))
      dispatch(setFormSuccess(formName, true))
      dispatch(userAccount(response.body))
    } catch (error) {
      dispatch(setGenericError(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function changeShortProfileRequest(data) {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))
    const formName = 'customerShortProfile'

    try {
      const response = await dispatch(
        put('/account/shortdetails', removeDiacriticsDeep(data))
      )
      dispatch(
        setFormMessage(formName, {
          type: 'confirm',
          message: 'Your profile details have been successfully updated.',
        })
      )
      dispatch(setFormSuccess(formName, true))
      dispatch(userAccount(response.body))
    } catch (error) {
      dispatch(handleFormResponseErrorMessage(formName, error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function changePwdRequest(data, resetPassword) {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))
    const formName = 'changePassword'

    try {
      const response = await dispatch(put('/account/changepassword', data))

      dispatch(userAccount(response.body))

      dispatch(
        setFormMessage(formName, {
          type: 'confirm',
          message: 'Your password has been successfully changed.',
        })
      )
      dispatch(setFormSuccess(formName, true))
      dispatch(changePasswordSuccess(true))

      if (resetPassword) {
        dispatch(getAccount())
      }
    } catch (error) {
      dispatch(handleFormResponseErrorMessage(formName, error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function setForgetPassword(value) {
  return {
    type: 'TOGGLE_FORGET_PASSWORD',
    value,
  }
}

export function toggleForgetPassword() {
  return {
    type: 'TOGGLE_FORGET_PASSWORD',
  }
}

function setResetUrl(state) {
  const pathname = getRoutePath(state)

  return setPostResetUrl(
    pathname.startsWith('/checkout') ? '/checkout' : '/my-account'
  )
}

export function forgetPwdRequest(data) {
  return async (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const formName = 'forgetPassword'

    try {
      const response = await dispatch(post('/account/forgetpassword', data))
      const message = path(['body', 'message'], response)
      dispatch(
        setFormMessage(formName, {
          type: 'confirm',
          message,
        })
      )
      dispatch(setFormSuccess(formName, true))
      dispatch(setResetUrl(getState()))
    } catch (error) {
      dispatch(handleFormResponseErrorMessage(formName, error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function resetPasswordLinkIsValid() {
  return {
    type: 'RESET_PASSWORD_LINK_VALID',
  }
}

export function resetPasswordLinkIsInvalid() {
  return {
    type: 'RESET_PASSWORD_LINK_INVALID',
  }
}
export function validateResetPasswordLinkExpiry(location) {
  return async (dispatch) => {
    const body = {
      storeId: location.query.storeId,
      email: location.query.token,
      hash: location.query.hash,
      catalogId: location.query.catalogId,
      langId: location.query.langId,
    }
    try {
      const response = await dispatch(
        post('/account/validate_reset_password', body)
      )
      if (response.body.isValidEmailLink) {
        dispatch(resetPasswordLinkIsValid())
      } else {
        dispatch(resetPasswordLinkIsInvalid())
      }
    } catch (e) {
      dispatch(resetPasswordLinkIsInvalid())
    }
  }
}

export function resetPasswordLinkRequest(data) {
  return async (dispatch, getState) => {
    dispatch(ajaxCounter('increment'))
    const formName = 'forgetPassword'

    try {
      const response = await dispatch(
        post('/account/reset_password_link', data)
      )
      const message = path(['body', 'message'], response)
      dispatch(
        setFormMessage(formName, {
          type: 'confirm',
          message,
        })
      )

      dispatch(setFormSuccess(formName, true))
      dispatch(setResetUrl(getState()))
    } catch (error) {
      dispatch(handleFormResponseErrorMessage(formName, error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function resetPasswordSuccess(authResponse) {
  return {
    type: 'RESET_PASSWORD_FORM_API_SUCCESS',
    payload: authResponse,
  }
}

export function resetPasswordRequest(data) {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))
    const formName = 'resetPassword'

    try {
      const authResponse = await dispatch(put('/account/reset_password', data))
      dispatch(
        setFormMessage(formName, {
          type: 'confirm',
          message: 'Your password has been successfully changed.',
        })
      )
      dispatch(setFormSuccess(formName, true))
      if (data.orderId) {
        dispatch(updateOrderId(data.orderId))
        dispatch(updateShoppingBagBadgeCount(authResponse.body.basketItemCount))
      }
      dispatch(userAccount(authResponse.body))
      dispatch(resetPasswordSuccess(authResponse.body))
      dispatch(updateMenuForAuthenticatedUser())
    } catch (error) {
      const errorMessage = pathOr('', ['response', 'body', 'message'], error)
      const errorCode = path(['response', 'body', 'errorCode'], error)

      if (passwordMatchesPrevious(errorCode)) {
        dispatch(handleFormResponseErrorMessage(formName, error, errorMessage))
      } else {
        dispatch(resetPasswordLinkIsInvalid())
      }
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

const ORDER_HISTORY = '/account/order-history'

export function setOrderHistoryDetails(orderDetails) {
  const { orderLines } = orderDetails
  const orderLinesSortedByTracking = orderLinesSortedWithTracking(orderLines)
  return {
    type: 'SET_ORDER_HISTORY_DETAILS',
    orderDetails: { ...orderDetails, orderLinesSortedByTracking },
  }
}

export function setOrderHistoryOrders(orders) {
  return {
    type: 'SET_ORDER_HISTORY_ORDERS',
    orders,
  }
}

export function orderHistoryRequest() {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(get(ORDER_HISTORY))

      dispatch(setOrderHistoryOrders(path(['body', 'orders'], response)))
    } catch (error) {
      dispatch(setOrderHistoryOrders({}))
      dispatch(setGenericError(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function orderHistoryDetailsRequest(orderId) {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(get(`${ORDER_HISTORY}/${orderId}`))

      dispatch(setOrderHistoryDetails(response.body))
    } catch (error) {
      dispatch(setGenericError(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

const RETURN_HISTORY = '/account/return-history'

export function setReturnHistoryReturns(returns) {
  return {
    type: 'SET_RETURN_HISTORY_RETURNS',
    returns,
  }
}

export function returnHistoryRequest() {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(get(RETURN_HISTORY))

      dispatch(setReturnHistoryReturns(path(['body', 'orders'], response)))
    } catch (error) {
      dispatch(setGenericError(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function setReturnHistoryDetails(returnDetails) {
  return {
    type: 'SET_RETURN_HISTORY_DETAILS',
    returnDetails,
  }
}

export const returnHistoryDetailsRequest = (orderId, rmaId) => async (
  dispatch
) => {
  try {
    dispatch(ajaxCounter('increment'))
    const { body: returnHistoryDetails } = await dispatch(
      get(`${RETURN_HISTORY}/${orderId}/${rmaId}`)
    )
    dispatch(setReturnHistoryDetails(returnHistoryDetails))
    dispatch(ajaxCounter('decrement'))
  } catch (e) {
    logger.info('server-side-render', 'returnHistoryDetailsRequest', e)
    dispatch(setReturnHistoryDetails({}))
    dispatch(ajaxCounter('decrement'))
  }
}

/**
 * My Checkout Details actions
 */
export function setMyCheckoutDetailsInitialFocus(initialFocus) {
  return {
    type: 'SET_MCD_INITIAL_FOCUS',
    initialFocus,
  }
}

// fill the forms with account.user (Redux) data
export function resetMyCheckoutDetailsForms() {
  return (dispatch, getState) => {
    const state = getState()
    const user = getUser(state)
    const { siteOptions } = state
    const deliveryCountry = pathOr(
      null,
      ['deliveryDetails', 'address', 'country'],
      user
    )
    const defaultState =
      deliveryCountry === 'United States' ? siteOptions.USStates[0] : null

    const defaultAddress = {
      ...getDefaultAddress(),
      country: deliveryCountry,
      state: defaultState,
    }

    const deliveryAddress = pathOr(
      defaultAddress,
      ['deliveryDetails', 'address'],
      user
    )

    dispatch(
      resetForm(formNames.deliveryMCD.address, {
        ...deliveryAddress,
        county: null,
        isManual: true,
      })
    )

    const deliveryTelephone = pathOr(
      null,
      ['deliveryDetails', 'nameAndPhone', 'telephone'],
      user
    )
    const deliveryNameAndPhone = path(['deliveryDetails', 'nameAndPhone'], user)
    dispatch(
      resetForm(formNames.deliveryMCD.details, {
        ...deliveryNameAndPhone,
        telephone: deliveryTelephone,
      })
    )

    const billingAddress = pathOr(
      defaultAddress,
      ['billingDetails', 'address'],
      user
    )
    dispatch(
      resetForm(formNames.billingMCD.address, {
        ...billingAddress,
        county: null,
        isManual: true,
      })
    )

    const billingTelephone = pathOr(
      null,
      ['billingDetails', 'nameAndPhone', 'telephone'],
      user
    )
    const billingNameAndPhone = path(['billingDetails', 'nameAndPhone'], user)
    dispatch(
      resetForm(formNames.billingMCD.details, {
        ...billingNameAndPhone,
        telephone: billingTelephone,
      })
    )

    dispatch(setFindAddressMode())
    // Payment details
    const defaultPaymentOptions = getDefaultPaymentOptions()
    const { type: value, expiryMonth, expiryYear } = pathOr(
      {},
      ['creditCard'],
      user
    )
    const paymentMethodTypeForUser = getPaymentMethodTypeByValue(state, value)

    const setExpiryFor = (monthOrYear) => {
      switch (monthOrYear) {
        case 'month':
          return paymentMethodTypeForUser === 'OTHER'
            ? defaultPaymentOptions.expiryMonth
            : expiryMonth

        case 'year':
          return paymentMethodTypeForUser === 'OTHER'
            ? defaultPaymentOptions.expiryYear
            : expiryYear

        default:
          return ''
      }
    }

    const convertToExpireDateFormat = () => {
      const expiryMonthStr = setExpiryFor('month')
      const expiryYearStr = setExpiryFor('year')

      return `${expiryMonthStr}${expiryYearStr.length > 0 &&
        expiryYearStr.substr(2)}`
    }

    const userCardDetails = isUserCreditCard(user)
      ? {
          ...defaultPaymentOptions,
          paymentType: value,
          expiryDate: convertToExpireDateFormat(),
          expiryMonth: setExpiryFor('month'),
          expiryYear: setExpiryFor('year'),
        }
      : null

    dispatch(
      resetForm(
        formNames.payment.paymentCardDetailsMCD,
        userCardDetails || defaultPaymentOptions
      )
    )
  }
}

/**
 * Action used on MyChekoutDetails to grab user data and fill MyCheckoutDetails forms
 */
export function getMyCheckoutDetailsData() {
  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(getAccount()) // TODO double fetch of account (this + MyAccountSubcategory needs)
      .then(() => {
        dispatch(ajaxCounter('decrement'))
        dispatch(resetMyCheckoutDetailsForms())
        // ADP-3321: Replacing getPaymentMethods with getAllPaymentMethods.
        // This is a provisional change as the ultimate goal is populate paymentMethods in the SSR.
        // @TODO To be removed in ADP-3653
        return dispatch(getAllPaymentMethods())
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(
          handleFormResponseErrorMessage(
            'myCheckoutDetailsForm',
            err,
            'An error has occurred. Please try again.'
          )
        )
      })
  }
}

/**
 * Action that copies form data from billing forms to delivery forms
 * @param {object} billingFormNames object with one key per each form name
 * @param {object} deliveryFormNames object with one key per each form name
 */
export function setDeliveryFormsFromBillingForms() {
  return (dispatch, getState) => {
    const state = getState()
    const billingFormNames = getFormNames('billingMCD')
    const deliveryFormNames = getFormNames('deliveryMCD')

    // billingFormNames and deliveryFormNames objects should have the same keys
    Object.keys(billingFormNames).forEach((formKey) => {
      const billingFormName = billingFormNames[formKey]
      const deliveryFormName = deliveryFormNames[formKey]
      const form = getAddressForm('deliveryMCD', billingFormName, state)
      const newFields = pluck('value', form.fields)
      dispatch(resetForm(deliveryFormName, newFields))
      // Cleaning up any errors in the delivery form when copied from billing.
      // This is to prevent any existing errors from persisting
      // This isn't an ideal strategy but good enough until we refactor the
      // forms and perhaps this entire page.
      dispatch(clearFormErrors(deliveryFormName))
    })
  }
}

/**
 * Action that update user information using the My Checkout Details form
 * @param {*} data object
 * @param {*} formName form name where to write messages (confirm or error)
 */
export function updateMyCheckoutDetails(data, formName) {
  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(put('/account/customerdetails', data))
      .then((res) => {
        dispatch(userAccount(res.body))
        dispatch(ajaxCounter('decrement'))
        dispatch(
          setFormMessage(formName, {
            type: 'confirm',
            message: 'Your changes have been saved',
          })
        )

        dispatch(resetFormPartial('paymentCardDetailsMCD', { cardNumber: '' }))
        browserHistory.push('/my-account/details')
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(
          handleFormResponseErrorMessage(
            formName,
            err,
            `An error has occurred. Please try again.`
          )
        )
      })
  }
}

export function checkAccountExists({
  email = '',
  successCallback,
  failureCallback,
}) {
  return async (dispatch) => {
    try {
      const res = await dispatch(get(`/account?email=${email}`))
      if (successCallback) successCallback(res)
    } catch (e) {
      logger.error(e)
      if (failureCallback) failureCallback(e)
    }
  }
}
