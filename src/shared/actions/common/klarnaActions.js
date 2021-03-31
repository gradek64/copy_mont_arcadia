/* eslint-disable camelcase */
import React from 'react' // TODO get rid of JSX from actions
import { pathOr } from 'ramda'
import { post, put } from '../../lib/api-service'
import { browserHistory } from 'react-router'

import Button from '../../components/common/Button/Button'

// ACTIONS
import { createOrder } from '../../actions/common/orderActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { setFormField } from '../common/formActions'
import { showModal, closeModal } from '../common/modalActions'

// SELECTORS
import { getShoppingBagOrderId } from '../../selectors/shoppingBagSelectors'
import { isSelectedPaymentMethodKlarna } from '../../selectors/checkoutSelectors'
import {
  getKlarnaIsKlarnaPaymentBlocked,
  getKlarnaIsKlarnaUpdateBlocked,
  getKlarnaPaymentMethodCategories,
} from '../../selectors/klarnaSelectors'

import { localise } from '../../lib/localisation'
import { scrollElementIntoView } from '../../lib/scroll-helper'
import {
  klarnaPaymentsLoad,
  klarnaPaymentsInit,
  klarnaPaymentsAuthorize,
  isKlarnaFormLoaded,
  removeDiacriticsDeep,
} from '../../lib/checkout-utilities/klarna-utils'
import * as logger from '../../../client/lib/logger'

// Localization helper
const getLocalise = ({ config: { language, brandName } }) => {
  return localise.bind(null, language, brandName)
}

// Klarna Global Error Content
const closeModalOnClick = (dispatch) => {
  dispatch(closeModal())
}

export const errorContent = (errorMsg, l, dispatch) => (
  <div className="CheckoutContainer-errorMessage">
    <p>{errorMsg}</p>
    <Button clickHandler={() => closeModalOnClick(dispatch)}>{l`Ok`}</Button>
  </div>
)

export function setKlarnaClientToken(clientToken) {
  return {
    type: 'SET_KLARNA_CLIENT_TOKEN',
    clientToken,
  }
}

export function setKlarnaPaymentMethodCategories(paymentMethodCategories) {
  return {
    type: 'SET_KLARNA_PAYMENT_METHOD_CATEGORIES',
    paymentMethodCategories,
  }
}

export function resetKlarna() {
  return {
    type: 'RESET_KLARNA',
  }
}

export function blockKlarnaUpdate(isKlarnaUpdateBlocked) {
  return {
    type: 'BLOCK_KLARNA_UPDATE',
    isKlarnaUpdateBlocked,
  }
}

export function blockKlarnaPayment(isKlarnaPaymentBlocked) {
  return {
    type: 'BLOCK_KLARNA_PAYMENT',
    isKlarnaPaymentBlocked,
  }
}

export const displayKlarnaWarning = (err) => {
  return function displayKlarnaWarningThunk(dispatch, getState) {
    const l = getLocalise(getState())
    const defaultErrorMessage = l`An error has occurred. Please try again.`
    const path = ['response', 'body', 'message']
    const errorMsg = pathOr(defaultErrorMessage, path, err)

    dispatch(
      showModal(errorContent(errorMsg, l, dispatch), {
        mode: 'warning',
        type: 'alertdialog',
      })
    )
  }
}

export function handleDisapproval() {
  return function handleDisapprovalThunk(dispatch, getState) {
    const l = getLocalise(getState())
    const {
      location: { pathname, search },
    } = getState().routing
    const close = () => {
      dispatch(setFormField('billingCardDetails', 'paymentType', 'VISA'))
      dispatch(closeModal())
      const el = document.getElementById('CardDetails')
      if (el) scrollElementIntoView(el, 0)
    }
    const modalContent = (
      <div>
        <p
        >{l`The buy now, pay later payment option is not available for this order. Please select an alternative payment option.`}</p>
        <Button clickHandler={() => close()}>{l`Ok`}</Button>
      </div>
    )
    if (
      !pathname.includes('checkout/payment') &&
      !pathname.includes('checkout/delivery-payment')
    ) {
      browserHistory.push(`/checkout/payment${search}#CardDetails`)
    }
    dispatch(showModal(modalContent), { type: 'alertdialog' })
  }
}

export function loadKlarnaForm(container) {
  return function loadKlarnaFormThunk(dispatch, getState) {
    const state = getState()
    const paymentMethodCategories = getKlarnaPaymentMethodCategories(state)
    const isKlarnaUpdateBlocked = getKlarnaIsKlarnaUpdateBlocked(state)
    const isKlarnaPaymentBlocked = getKlarnaIsKlarnaPaymentBlocked(state)
    const paymentMethodIsKlarna = isSelectedPaymentMethodKlarna(state)
    return klarnaPaymentsLoad(container, {}, paymentMethodCategories)
      .then((res) => {
        if (isKlarnaUpdateBlocked) dispatch(blockKlarnaUpdate(false))
        if (isKlarnaPaymentBlocked) dispatch(blockKlarnaPayment(false))

        if (res.error) {
          logger.nrBrowserLogError(
            'error: klarnaActions.js -> loadKlarnaForm -> show-form: true -> solvable errors.',
            res.error
          )
        }
      })
      .catch((e) => {
        // If payment type is klarna then block klarna payment button
        if (paymentMethodIsKlarna) dispatch(blockKlarnaPayment(true))

        logger.nrBrowserLogError(
          'error: klarnaActions.js -> loadKlarnaForm -> show-form: false',
          e
        )
      })
  }
}

export function createKlarnaSession(data) {
  return function createSessionThunk(dispatch) {
    dispatch(ajaxCounter('increment'))
    return dispatch(post('/klarna-session', data))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if (res.body && res.body.clientToken) {
          dispatch(setKlarnaClientToken(res.body.clientToken))
          dispatch(
            setKlarnaPaymentMethodCategories(
              res.body.paymentMethodCategories.split(',')
            )
          )

          klarnaPaymentsInit(res.body.clientToken).then(() => {
            dispatch(loadKlarnaForm())
          })
        }
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        // https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/1192230976/Klarna+CoreAPI+Endpoint
        logger.nrBrowserLogError(
          'error: klarnaActions.js -> createSession',
          err
        )
        dispatch(displayKlarnaWarning(err))
      })
  }
}

export const authorizeByKlarna = (klarnaPayload = {}, order) => {
  return (dispatch) => {
    return klarnaPaymentsAuthorize(klarnaPayload)
      .then((res) => {
        if (res.approved) {
          dispatch(
            createOrder({
              ...removeDiacriticsDeep(order),
              authToken: res.authorization_token,
            })
          )
        }

        if (!res.approved && !res.authorization_token) {
          const error = new Error('Klarna approval failed')
          logger.nrBrowserLogError(
            'error: klarnaActions -> authorize -> No authorization token',
            error.message
          )
        } else if (!res.approved && res.finalize_required) {
          const error = new Error('Klarna approval failed')
          logger.nrBrowserLogError(
            'error: klarnaActions -> authorize -> An authorization that requires finalization',
            error.message
          )
        }
      })
      .catch((err) => {
        let errorMessage = 'error: klarnaActions -> authorize -> '
        if (err && err.show_form) {
          if (!err.approved) {
            errorMessage += 'A rejected authorization with solvable errors'
          }
        } else {
          errorMessage += 'A rejected authorization (non-resolvable)'
          handleDisapproval()
        }
        logger.nrBrowserLogError(errorMessage, err)
      })
  }
}

export const updateKlarnaSession = (forceUpdate = false) => (
  dispatch,
  getState
) => {
  const state = getState()
  const orderId = getShoppingBagOrderId(state)

  if (forceUpdate || isKlarnaFormLoaded()) {
    return dispatch(put('/klarna-session', { orderId }))
      .then(() => {
        dispatch(loadKlarnaForm())
      })
      .catch((err) => {
        // https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/1192230976/Klarna+CoreAPI+Endpoint
        logger.nrBrowserLogError(
          'error: klarnaActions.js -> updateSession',
          err
        )
        dispatch(displayKlarnaWarning(err))
        dispatch(blockKlarnaPayment(true))
        dispatch(blockKlarnaUpdate(false))
      })
  }
}
