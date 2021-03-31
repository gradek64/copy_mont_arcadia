const colors = require('./ev-colors')
const typography = require('./ev-typography')

const miniBagGeneral = {
  'mini-bag-border-color': colors['lt-gray'],
  'mini-bag-shadow-color': colors.black,
  'mini-bag-shadow-strength': '25px',
  'mini-bag-padding': '10px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors.black,
  'mini-bag-header-text-size': typography['font-size-h3'],
  'mini-bag-header-text-weight': typography['font-weight-thick'],
  'mini-bag-header-background-color': colors['ex-lt-gray'],
  'mini-bag-header-border-color': colors['ex-lt-gray'],
  'mini-bag-header-border-width': '0',
}

const miniBagContent = {
  'mini-bag-content-price-font-weight': 'normal',
  'mini-bag-content-price-font-size': '0.7em',
  'mini-bag-content-price-text-color': colors.black,
  'mini-bag-content-name-color': colors.black,
  'mini-bag-content-subtotal-font-weight': typography['font-weight-thick'],
  'mini-bag-content-border-color': colors['lt-gray'],
  'mini-bag-content-low-stock-font-color': colors['error-color'],
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
  'mini-bag-content-name-font-size': typography['font-size-info'],
  'mini-bag-content-name-font-weight': typography['font-weight-thick'],
  'mini-bag-product-label-font-size': typography['font-size-detail'],
  'mini-bag-product-total-font-size': typography['font-size-info'],
  'mini-bag-content-delete-size': '20px',
  'mini-bag-content-delete-label-shown': 'block',
  'mini-bag-content-delete-icon-shown': 'block',
  'mini-bag-info-line-height': '1.5',
}

const miniBagSummary = {
  'mini-bag-summary-shadow-color': colors['dk-gray'],
  'mini-bag-summary-shadow-strength': '15px',
  'mini-bag-delivery-text-weight': typography['font-weight-normal'],
}

const miniBagPromoCode = {
  'mini-bag-promocode-added-background-color': colors['promocode-color'],
  'mini-bag-promocode-confirmed-font-weight': typography['font-weight-normal'],
  'mini-bag-promocode-confirmed-text-color': colors['promocode-color'],
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagSummary,
  miniBagPromoCode
)
