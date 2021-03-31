// constants
import paymentRules from '../../constants/paymentValidationRules'

// lib
import { cardExpiry, hasLength } from '../../lib/validator/validators'

// selectors
import { getSelectedPaymentMethodValue } from '../../selectors/common/accountSelectors'
import { getPaymentMethodTypeByValue } from '../../selectors/paymentMethodSelectors'

export const getPaymentMethodFormValidationSchema = (state) => {
  const value = getSelectedPaymentMethodValue(state)
  const type = getPaymentMethodTypeByValue(state, value, 'OTHER')
  const isCardPayment = type === 'CARD' || type === 'OTHER_CARD'

  /*
    *ADP-3849
    *expiryMonth and expiryDate needs formating but 
    *at the time of this ticket expiryMonth is used by qubit 
    *experience
  */
  return isCardPayment
    ? {
        cardNumber: paymentRules[value]
          ? hasLength(
              paymentRules[value].cardNumber.message,
              paymentRules[value].cardNumber.length
            )
          : '',
        expiryMonth: cardExpiry(
          `Please select a valid expiry date`,
          new Date()
        ),
        expiryDate: cardExpiry(`Please select a valid expiry date`, new Date()),
      }
    : {}
}
