const colors = require('./tm-colors')
const typography = require('./tm-typography')

const general = {
  'checkout-secure-payment-padding': '5px',
}

const header = {
  'checkout-header-mobile-brand-logo-img-max-width': '160px',
}

const checkoutBagSide = {
  'checkout-bag-side-border-color': colors['lt-md-gray'],

  'checkout-bag-side-title-font-size': '18px',
  'checkout-bag-side-title-font-weight': typography['font-weight-700'],

  'checkout-bag-side-simple-total-section-font-size': '14px',
  'checkout-bag-side-simple-total-border-bottom': `0 solid ${
    colors['md-gray']
  }`,
}

module.exports = Object.assign(general, header, checkoutBagSide)
