const colors = require('./ms-colors')
const typography = require('./ms-typography')

const header = {
  'checkout-header-mobile-brand-logo-img-max-width': '145px',
  'checkout-header-tablet-button-container-margin': '0 0 32px 5px',
}

const checkoutBagSide = {
  'checkout-bag-side-border-color': colors['ex-lt-gray'],

  'checkout-bag-side-title-margin-horizontal': '0',
  'checkout-bag-side-title-margin-vertical': '0',
  'checkout-bag-side-title-padding-horizontal': '25px',
  'checkout-bag-side-title-padding-vertical': '15px',

  'checkout-bag-side-background-color': '#e8e7e8',

  'checkout-bag-side-title-font-size': '18px',
  'checkout-bag-side-title-font-weight': typography['font-weight-h1'],
  'checkout-bag-side-simple-total-section-font-size': '12px',

  'checkout-bag-side-total-font-weight': typography['font-weight-500'],

  'checkout-secure-payment-padding': '5px',
}

const checkoutDeliveryOptions = {
  'checkout-delivery-title-font-weight': typography['font-weight-h3'],
  'checkout-delivery-option-font-weight': typography['font-weight-300'],

  'checkout-delivery-title-font-size': typography['font-size-h3'],
  'checkout-address-preview-header-font-weight': typography['font-weight-h3'],
}

const deliveryInstructions = {
  'checkout-delivery-instructions-description': typography['font-weight-300'],
}

const cardDetails = {
  'checkout-card-number-font-weight': typography['font-weight-500'],
}

module.exports = Object.assign(
  header,
  checkoutBagSide,
  checkoutDeliveryOptions,
  deliveryInstructions,
  cardDetails
)
