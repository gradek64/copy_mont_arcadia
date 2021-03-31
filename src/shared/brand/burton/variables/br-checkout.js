const colors = require('./br-colors')

const general = {
  'checkout-delivery-option-icon-width': '30px',
  'checkout-delivery-option-font-weight': 'normal',
  'checkout-delivery-type-title-font-weight': 'normal',
}

const header = {
  'checkout-header-mobile-brand-logo-width': '100px',
  'checkout-header-mobile-brand-logo-img-max-width': '100px',
  'checkout-header-tablet-button-container-margin': '0 0 32px 5px',
}

const checkoutBagSide = {
  'checkout-bag-side-title-font-size': '22px',
  'checkout-bag-side-delivery-icon-width': '25px',
  'checkout-bag-side-simple-total-background-color': '#f8f8f8',
  'checkout-bag-side-border-color': colors['lt-md-gray'],
}

module.exports = Object.assign(general, header, checkoutBagSide)
