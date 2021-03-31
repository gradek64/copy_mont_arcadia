import { pathOr } from 'ramda'
import { createSelector } from 'reselect'
import { getSelectedPaymentType } from './formsSelectors'
import { getBrandName } from './configSelectors'
import { getWcsEnvironment } from './debugSelectors'
import * as paymentTypes from '../constants/paymentTypes'

export const isPaymentTypeApplePay = createSelector(
  [getSelectedPaymentType],
  (selectedPaymentType) => selectedPaymentType === paymentTypes.APPLEPAY
)

export const isApplePayAvailable = (state) => {
  return pathOr(false, ['applePay', 'canMakePayments'], state)
}

export const getMerchantIdentifier = (state) => {
  const brandName = getBrandName(state)
  const wcsEnvironment = getWcsEnvironment(state)
  const merchantIdentifierDomain =
    wcsEnvironment === 'prod' ? 'applepay' : 'test'

  return `merchant.com.${brandName}.${merchantIdentifierDomain}`
}
