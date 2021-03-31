const colors = require('./ts-colors')
const typography = require('./ts-typography')

const general = {
  'checkout-secure-payment-margin-top': '0',
  'checkout-delivery-option-font-weight': typography['font-weight-300'],
  'checkout-secure-payment-padding': '10px',
}

const header = {
  'checkout-header-mobile-brand-logo-img-max-width': '155px',
}

const checkoutBagSide = {
  'checkout-bag-side-title-font-weight': typography['font-weight-700'],
  'checkout-bag-side-border-color': colors['md-gray'],
  'checkout-bag-side-title-font-size': '21px',
}

module.exports = Object.assign(general, header, checkoutBagSide)
