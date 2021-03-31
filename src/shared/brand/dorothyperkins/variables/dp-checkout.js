const colors = require('./dp-colors')

const header = {
  'checkout-header-mobile-brand-logo-img-max-width': '80px',
}

const delivery = {
  'checkout-delivery-icon-display': 'none',
  'checkout-delivery-change-font-weight': 'normal',
}

const totals = {
  'checkout-totals-delivery-font-weight': 'normal',
  'checkout-totals-parenthesis-font-weight': 'normal',
  'checkout-totals-total-font-weight': 'normal',
  'checkout-totals-total-font-size': '1.2em',
}

const error = {
  'checkout-error-session-image-size': '24px',
}

const checkoutBagSide = {
  'checkout-bag-side-border-color': colors['lt-gray'],

  'checkout-bag-side-title-font-size': '20px',
  'checkout-bag-side-title-font-weight': 'normal',

  'checkout-bag-side-simple-total-section-font-size': '13px',

  'checkout-bag-side-total-font-weight': 'normal',
}

const payments = {
  'checkout-payments-change-link-font-weight': 'normal',
}

module.exports = Object.assign(
  header,
  delivery,
  totals,
  error,
  checkoutBagSide,
  payments
)
