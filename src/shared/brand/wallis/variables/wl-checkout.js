const colors = require('./wl-colors')

const general = {
  'checkout-delivery-title-font-weight': 300,
}

const header = {
  'checkout-header-mobile-brand-logo-img-max-width': '70px',
  'checkout-header-tablet-button-container-margin': '0 0 32px 5px',
}

const checkoutBagSide = {
  'checkout-bag-side-border-color': colors['md-gray'],
}

const deliveryMethod = {
  'checkout-delivery-method-price-font-weight': 'normal',
}

module.exports = Object.assign(general, header, checkoutBagSide, deliveryMethod)
