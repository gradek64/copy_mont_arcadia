import { createSelector } from 'reselect'
import { getSelectedPaymentType } from './formsSelectors'
import { getCheckoutOrderSummaryBasket } from './checkoutSelectors'
import { isFeatureClearPayEnabled } from './featureSelectors'
import { getWcsEnvironment } from './debugSelectors'
import clearPayAfterPayScripts from '../../shared/constants/clearPayAfterPayScripts'
import * as paymentTypes from '../constants/paymentTypes'

export const isPaymentTypeClearPay = createSelector(
  [getSelectedPaymentType],
  (selectedPaymentType) => selectedPaymentType === paymentTypes.CLEARPAY
)

export const isClearPayAvailable = createSelector(
  [getCheckoutOrderSummaryBasket, isFeatureClearPayEnabled],
  ({ isClearPayAvailable = false }, isFeatureClearPayEnabled) =>
    isFeatureClearPayEnabled ? isClearPayAvailable : false
)

export const getAfterPayScriptUrl = (state) => {
  const wcsEnvironment = getWcsEnvironment(state)

  return wcsEnvironment === 'prod'
    ? clearPayAfterPayScripts.prod
    : clearPayAfterPayScripts.dev
}
