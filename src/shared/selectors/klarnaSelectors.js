import { isEmpty } from 'ramda'
import { createSelector } from 'reselect'
import { isKlarnaDefaultPaymentType } from './common/accountSelectors'
import { getSelectedPaymentType } from './formsSelectors'
import { getCheckoutOrderSummaryShippingCountry } from './checkoutSelectors'
import { getPaymentOptionKlarna } from './paymentMethodSelectors'

const rootSelector = (state) => state.klarna || {}

export const getKlarnaClientToken = (state) => {
  const { clientToken } = rootSelector(state)
  return clientToken
}

export const getKlarnaPaymentMethodCategories = (state) => {
  const { paymentMethodCategories } = rootSelector(state)
  return paymentMethodCategories
}

export const getKlarnaIsKlarnaUpdateBlocked = (state) => {
  const { isKlarnaUpdateBlocked } = rootSelector(state)
  return isKlarnaUpdateBlocked
}

export const getKlarnaIsKlarnaPaymentBlocked = (state) => {
  const { isKlarnaPaymentBlocked } = rootSelector(state)
  return isKlarnaPaymentBlocked
}

/* Check if a klarnaClientToken exists and if not then create a new session
 * with Klarna.
 *
 * If a user refreshes the page the klarna SDK will loose its connect with
 * klarna. To reconnect the lost connection it will be required to initialise
 * the klarna session again.
 *
 * */
export const shouldInitialiseKlarnaSession = createSelector(
  [getKlarnaClientToken, getKlarnaPaymentMethodCategories],
  (klarnaClientToken, paymentMethodCategories) => {
    return !klarnaClientToken || paymentMethodCategories.length === 0
  }
)

/* Note:
 * When a customer makes a payment with klarna the billingCardDetails form is
 * reset. If the same customers decides to purchase another item with klarna
 * then get the payment type from account.user.creditCard.type
 *
 *  */
export const isPaymentTypeKlarna = createSelector(
  [getSelectedPaymentType, isKlarnaDefaultPaymentType],
  (selectedPaymentType, klarnaDefaultPaymentType) => {
    switch (selectedPaymentType) {
      case 'KLRNA':
        return true
      case '':
        return klarnaDefaultPaymentType
      default:
        return false
    }
  }
)

/* Checks if the delivery or billing address country is support by Klanra
 *  */
export const isCountrySupportedByKlarna = createSelector(
  [getCheckoutOrderSummaryShippingCountry, getPaymentOptionKlarna],
  (shippingCountry, paymentOptionKlarna) => {
    // Checking if the paymentOptionKlarna is returned from the payment endpoint.
    // This is needed in checkout when the user selects a different payment method
    // after having paid with klarna for a previous order.
    return !isEmpty(paymentOptionKlarna)
      ? paymentOptionKlarna.deliveryCountry.includes(shippingCountry) &&
          paymentOptionKlarna.billingCountry.includes(shippingCountry)
      : false
  }
)

export const shouldKlarnaBlockPaymentButton = createSelector(
  [isPaymentTypeKlarna, getKlarnaIsKlarnaPaymentBlocked],
  (paymentTypeIsKlarna, klarnaPaymentIsBlocked) =>
    paymentTypeIsKlarna && klarnaPaymentIsBlocked
)
