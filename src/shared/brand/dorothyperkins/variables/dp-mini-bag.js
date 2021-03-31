const colors = require('./dp-colors')

const miniBagGeneral = {
  'mini-bag-border-color': colors['ex-lt-gray'],
  'mini-bag-border-width': '1px',
  'mini-bag-shadow-color': 'transparent',
  'mini-bag-shadow-strength': '0',
  'mini-bag-padding': '10px',
  'mini-bag-row-margin': '3px',
  'mini-bag-margin-top': '160px',
  'mini-bag-margin-right': '100px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['md-dk-gray'],
  'mini-bag-header-text-weight': 'bold',
  'mini-bag-header-background-color': colors['ex-lt-gray'],
  'mini-bag-header-border-color': 'transparent',
  'mini-bag-header-border-width': 0,
}

const miniBagContent = {
  'mini-bag-content-font-color': colors['dk-gray'],
  'mini-bag-content-price-font-size': '1em',
  'mini-bag-content-subtotal-font-weight': 'normal',
  'mini-bag-content-delete-size': '18px',
  'mini-bag-content-border-color': colors['lt-gray'],
  'mini-bag-content-low-stock-font-color': null,
  'mini-bag-content-name-font-weight': '500',
  'mini-bag-content-name-text-transform': 'capitalize',
  'mini-bag-content-font-size': '14px',
  'mini-bag-product-label-font-weight': 'normal',
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
}

const miniBagSummary = {
  'mini-bag-summary-font-size': '14px',
  'mini-bag-summary-shadow-color': colors['lt-md-gray'],
  'mini-bag-summary-shadow-strength': '5px',
  'mini-bag-summary-padding': '10px',
  'mini-bag-summary-row-margin-bottom': '5px',
  'mini-bag-total-text-weight': 'normal',
}

const miniBagEmpty = {
  'mini-bag-empty-text-align': 'center',
  'mini-bag-empty-font-size': '0.875em',
  'mini-bag-empty-margin': '30px 0',
}

const miniBagPromoCode = {
  'mini-bag-promocode-added-background-color': colors['success-bg-color'],
  'mini-bag-promocode-added-text-color': colors['success-color'],
  'mini-bag-promocode-confirmed-text-color': colors['dk-gray'],
  'mini-bag-promocode-confirmed-font-weight': 'normal',
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagSummary,
  miniBagEmpty,
  miniBagPromoCode
)
