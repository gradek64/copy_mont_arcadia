import {
  getTotal,
  getSubTotal,
  getShippingCost,
} from '../../selectors/checkoutSelectors'
import { getBrandName, getCurrencyCode } from '../../selectors/configSelectors'
import { getMerchantIdentifier } from '../../selectors/applePaySelectors'

import { getBillingCountriesISO } from '../../selectors/siteOptionsSelectors'
import { isFeatureApplePayEnabled } from '../../selectors/featureSelectors'
import { getApplePayCardPaymentMethods } from '../../selectors/paymentMethodSelectors'
import { setFormField } from '../../actions/common/formActions'
import { error, nrBrowserLogError } from '../../../client/lib/logger'

import * as paymentTypes from '../../constants/paymentTypes'

import { get } from '../../lib/api-service'
import { createOrder } from './orderActions'
import { localise } from '../../lib/localisation'

const getApplePaySession = (state) => {
  const isFeatureEnabled = isFeatureApplePayEnabled(state)

  return isFeatureEnabled && window ? window.ApplePaySession : undefined
}

const setCanMakePayments = ({ canMakePayments }) => ({
  type: 'SET_APPLE_PAY_AVAILABILITY',
  canMakePayments,
})

const setCanMakePaymentsWithActiveCard = ({
  canMakePaymentsWithActiveCard,
}) => ({
  type: 'SET_APPLE_PAY_AVAILABILITY_WITH_ACTIVE_CARD',
  canMakePaymentsWithActiveCard,
})

export const setApplePayAvailability = () => {
  return (dispatch, getState) => {
    const state = getState()
    const ApplePaySession = getApplePaySession(state)

    let canMakePayments = false
    try {
      canMakePayments = ApplePaySession
        ? ApplePaySession.canMakePayments()
        : false
    } catch (e) {
      error('ApplePay', e)
      nrBrowserLogError('Error validating if user can use ApplePay', e)
    } finally {
      dispatch(setCanMakePayments({ canMakePayments }))
    }
  }
}

export const setApplePayAsDefaultPayment = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const merchantIdentifier = getMerchantIdentifier(state)
    const ApplePaySession = getApplePaySession(state)

    let canMakePaymentsWithActiveCard = false
    try {
      canMakePaymentsWithActiveCard = ApplePaySession
        ? await ApplePaySession.canMakePaymentsWithActiveCard(
            merchantIdentifier
          )
        : false
    } catch (e) {
      error('ApplePay', e)
      nrBrowserLogError(
        'Error validating if user can be defaulted to ApplePay',
        e
      )
    } finally {
      const paymentType = canMakePaymentsWithActiveCard
        ? paymentTypes.APPLEPAY
        : paymentTypes.VISA

      dispatch(
        setCanMakePaymentsWithActiveCard({ canMakePaymentsWithActiveCard })
      )

      dispatch(
        setFormField('billingCardDetails', 'paymentType', paymentType, null, {
          isDirty: false,
        })
      )
    }
  }
}

export const performApplePayPayment = (order) => {
  return (dispatch, getState) => {
    const state = getState()
    const { language } = state.config
    const brandName = getBrandName(state)
    const total = getTotal(state)
    const subTotal = getSubTotal(state)
    const shippingCost = getShippingCost(state)
    const currencyCode = getCurrencyCode(state)
    const supportedNetworks = getApplePayCardPaymentMethods(state)
    const supportedCountries = getBillingCountriesISO(state)
    const countryCode = 'GB'
    const merchantCapabilities = ['supports3DS']

    const l = localise.bind(null, language, brandName)
    const lineItems = [
      {
        label: l`BAG SUBTOTAL`,
        amount: subTotal,
      },
      {
        label: l`SHIPPING`,
        amount: shippingCost,
      },
    ]

    const request = {
      countryCode,
      currencyCode,
      supportedNetworks,
      supportedCountries,
      merchantCapabilities,
      total: { label: brandName.toUpperCase(), amount: total },
    }

    return new Promise((resolve, reject) => {
      const ApplePaySession = getApplePaySession(state)
      const session = ApplePaySession && new ApplePaySession(6, request)

      if (!session) {
        throw new Error('ApplePay session is not available')
      }

      session.onvalidatemerchant = (event) => {
        dispatch(
          get(`/checkout/applepay_session?validationURL=${event.validationURL}`)
        )
          .then(({ body }) => session.completeMerchantValidation(body))
          .catch(reject)
      }

      session.onpaymentauthorized = (event) => {
        const { paymentData } = event.payment.token

        dispatch(
          createOrder(
            {
              ...order,
              paymentToken: JSON.stringify(paymentData),
            },
            session
          )
        )
          .then(resolve)
          .catch(reject)
      }

      session.onpaymentmethodselected = () => {
        session.completePaymentMethodSelection(request.total, lineItems)
      }

      session.oncancel = resolve

      session.begin()
    }).catch((e) => {
      error('ApplePay', e)
      nrBrowserLogError('Error performing ApplePay payment', e)
    })
  }
}
