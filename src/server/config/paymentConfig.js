import paymentValidationSchema from './paymentValidationSchema'
import * as paymentTypes from '../../shared/constants/paymentTypes'

const VISA = {
  value: paymentTypes.VISA,
  type: 'CARD',
  label: 'Visa',
  description: 'Pay with VISA',
  icon: 'icon-visa.svg',
  validation: paymentValidationSchema.STANDARD,
}
const MASTERCARD = {
  value: paymentTypes.MASTERCARD,
  type: 'CARD',
  label: 'MasterCard',
  description: 'Pay with MasterCard',
  icon: 'icon-mastercard.svg',
  validation: paymentValidationSchema.STANDARD,
}
const AMEX = {
  value: paymentTypes.AMEX,
  type: 'CARD',
  label: 'American Express',
  description: 'Pay with American Express',
  icon: 'icon-amex.svg',
  validation: paymentValidationSchema.AMEX,
}
const SWITCH = {
  value: paymentTypes.SWITCH,
  type: 'CARD',
  label: 'Switch/Maestro',
  description: 'Pay with Switch / Maestro',
  icon: 'icon-switch.svg',
  validation: paymentValidationSchema.STANDARD,
}
const ACCOUNT = {
  value: paymentTypes.ACCOUNT,
  type: 'OTHER_CARD',
  label: 'Account Card',
  description: 'Pay with Account Card',
  icon: 'icon-account-card.svg',
  validation: paymentValidationSchema.STANDARD,
}
const PAYPAL = {
  value: paymentTypes.PAYPAL,
  type: 'OTHER',
  label: 'PayPal',
  description: 'Check out with your PayPal account',
  icon: 'icon-paypal.svg',
}
const ALIPAY = {
  value: paymentTypes.ALIPAY,
  type: 'OTHER',
  label: 'AliPay',
  description: 'Check out with your AliPay account',
  icon: 'icon-alipay.svg',
  billingCountry: ['China'],
}
const CUPAY = {
  value: paymentTypes.CUPAY,
  type: 'OTHER',
  label: 'China Union Pay',
  description: 'Check out with your China Union Pay account',
  icon: 'icon-cupay.svg',
  billingCountry: ['China'],
}
const IDEAL = {
  value: paymentTypes.IDEAL,
  type: 'OTHER',
  label: 'Ideal',
  description: 'Check out with your IDEAL account',
  icon: 'icon-ideal.svg',
  billingCountry: ['Netherlands'],
}
const SOFORT = {
  value: paymentTypes.SOFORT,
  type: 'OTHER',
  label: 'Sofort',
  description: 'Check out with your SOFORT account',
  icon: 'icon-sofort.svg',
  billingCountry: ['Austria', 'Belgium', 'Germany'],
}
// @NOTE Masterpass is not being used atm
// const MASTERPASS = {
//   value: 'MPASS',
//   type: 'OTHER',
//   label: 'Masterpass',
//   description: 'Check out with your Masterpass account',
//   icon: 'icon-masterpass.svg',
// }
const KLARNA_UK = {
  value: paymentTypes.KLARNA,
  type: 'OTHER',
  label: 'Klarna',
  description: 'Pay in 30 days or 3 monthly instalments, interest free',
  icon: 'icon-klarna.svg',
  region: 'uk',
  deliveryCountry: ['United Kingdom'],
  billingCountry: ['United Kingdom'],
}
const KLARNA_DE = {
  value: paymentTypes.KLARNA,
  type: 'OTHER',
  label: 'Klarna',
  description: 'Shop now, Pay later',
  icon: 'icon-klarna.svg',
  region: 'de',
  deliveryCountry: ['Germany'],
  billingCountry: ['Germany'],
}

const KLARNA_EU = {
  value: paymentTypes.KLARNA,
  type: 'OTHER',
  label: 'Klarna',
  description: 'Shop now, Pay later',
  icon: 'icon-klarna.svg',
  region: 'eu',
  deliveryCountry: ['Germany'],
  billingCountry: ['Germany'],
}
const APPLEPAY = {
  value: paymentTypes.APPLEPAY,
  type: 'OTHER',
  label: 'Apple Pay',
  description: 'Pay with Apple Pay',
  icon: 'icon_applepay.svg',
}

const CLEARPAY = {
  value: paymentTypes.CLEARPAY,
  type: 'OTHER',
  label: 'Clearpay',
  description: 'Pay in 4 fortnightly instalments, interest free',
  icon: 'clearpay.svg',
  billingCountry: ['United Kingdom'],
}

/**
 * Supported features and configurations per each payment methods
 */
export const paymentsMethodsConfigDefault = {
  canSavePaymentAsDefault: true,
  saveDetails: true,
  alwaysShowIconInFooter: false,
}

export const paymentsMethodsConfig = {
  [paymentTypes.CLEARPAY]: {
    canSavePaymentAsDefault: false,
    saveDetails: false,
    alwaysShowIconInFooter: true,
  },
}

/**
 * The supported payment methods for each brand in each region
 */
export const paymentsConfigBySite = {
  ts: {
    uk: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      KLARNA_UK,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, AMEX, APPLEPAY, PAYPAL],
    eu: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      IDEAL,
      SOFORT,
      KLARNA_EU,
    ],
    fr: [VISA, MASTERCARD, AMEX, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
    de: [VISA, MASTERCARD, AMEX, APPLEPAY, PAYPAL, KLARNA_DE, IDEAL, SOFORT],
    my: [VISA, MASTERCARD, SWITCH],
    sg: [VISA, MASTERCARD, SWITCH],
    th: [VISA, MASTERCARD, SWITCH],
  },
  tm: {
    uk: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      KLARNA_UK,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, AMEX, APPLEPAY, PAYPAL],
    eu: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      IDEAL,
      SOFORT,
      KLARNA_EU,
    ],
    fr: [VISA, MASTERCARD, AMEX, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
    de: [VISA, MASTERCARD, AMEX, APPLEPAY, PAYPAL, KLARNA_DE, IDEAL, SOFORT],
    my: [VISA, MASTERCARD, SWITCH],
    sg: [VISA, MASTERCARD, SWITCH],
    th: [VISA, MASTERCARD, SWITCH],
  },
  dp: {
    uk: [
      VISA,
      MASTERCARD,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL],
    eu: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
    // @NOTE Currently there are no mobile sites for dpfr or dpde
    // fr: [VISA, MASTERCARD,  SWITCH, PAYPAL, IDEAL],
    de: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, SOFORT],
    my: [VISA, MASTERCARD, SWITCH],
    sg: [VISA, MASTERCARD, SWITCH],
    th: [VISA, MASTERCARD, SWITCH],
  },
  ms: {
    uk: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      KLARNA_UK,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, AMEX, SWITCH, APPLEPAY, PAYPAL],
    eu: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT, KLARNA_EU],
    fr: [VISA, MASTERCARD, AMEX, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
    de: [
      VISA,
      MASTERCARD,
      AMEX,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      KLARNA_DE,
      IDEAL,
      SOFORT,
    ],
  },
  wl: {
    uk: [
      VISA,
      MASTERCARD,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL],
    eu: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
    de: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
  },
  ev: {
    uk: [
      VISA,
      MASTERCARD,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      CLEARPAY,
    ],
    us: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL],
    eu: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT, KLARNA_EU],
    de: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, KLARNA_DE, IDEAL, SOFORT],
  },
  br: {
    uk: [
      VISA,
      MASTERCARD,
      SWITCH,
      APPLEPAY,
      PAYPAL,
      ALIPAY,
      CUPAY,
      ACCOUNT,
      CLEARPAY,
    ],
    eu: [VISA, MASTERCARD, SWITCH, APPLEPAY, PAYPAL, IDEAL, SOFORT],
  },
}
