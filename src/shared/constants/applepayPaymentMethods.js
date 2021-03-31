import { VISA, MASTERCARD, AMEX, SWITCH } from './paymentTypes'

export default {
  [VISA]: 'visa',
  [MASTERCARD]: 'masterCard',
  [AMEX]: 'amex',
  [SWITCH]: 'maestro',
}
