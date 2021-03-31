const colors = require('./ev-colors')
const typography = require('./ev-typography')

const general = {
  'checkout-secure-payment-padding': '12px',
  'checkout-secure-payment-padding-min-tablet': '17px',
  'checkout-secure-payment-padding-min-laptop': '16px',
  'checkout-continue-shopping-margin-right': '20px',
  'checkout-continue-shopping-margin-top-min-tablet': '21px',
  'checkout-continue-shopping-margin-top-min-laptop': '26px',
  'checkout-continue-shopping-button-max-height': '30px',
}

const header = {
  'checkout-header-height': '60px',
  'checkout-header-mobile-brand-logo-width': '93px',
  'checkout-header-mobile-brand-logo-img-max-width': '93px',
  'checkout-header-tablet-button-container-margin': '0 0 32px 5px',
}

const checkoutBagSide = {
  'checkout-bag-side-border-color': colors['lt-gray'],
  'checkout-bag-side-title-font-size': typography['font-size-h1'],
  'checkout-bag-side-title-font-weight': typography['font-weight-thick'],
  'checkout-bag-side-total-font-weight': typography['font-weight-thick'],
  'checkout-bag-side-simple-total-section-font-size':
    typography['font-size-detail'],
  'checkout-bag-side-simple-total-border-top': `1px solid ${colors['lt-gray']}`,
  'checkout-bag-side-simple-total-border-bottom': `1px solid ${
    colors['lt-gray']
  }`,
  'checkout-bag-side-simple-total-background-color': '#f8f8f8',
  'checkout-address-detail-line-height': '1.4',
}

const delivery = {
  'checkout-delivery-title-font-weight': typography['font-weight-thick'],
}

const DeliveryType = {
  'checkout-delivery-type-description-font-size': null,
  'checkout-delivery-type-description-font-weight': 'normal',
  'checkout-delivery-type-title-font-size': '0.95em',
  'checkout-delivery-type-title-font-weight': typography['font-weight-thick'],
  'checkout-address-preview-header-font-weight': typography['font-weight-info'],
}

const deliveryMethod = {
  'checkout-delivery-method-price-font-weight':
    typography['font-weight-normal'],
}

module.exports = Object.assign(
  general,
  header,
  checkoutBagSide,
  delivery,
  DeliveryType,
  deliveryMethod
)
