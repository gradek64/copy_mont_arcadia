const colors = require('./wl-colors')

const miniBagGeneral = {
  'mini-bag-border-color': colors['md-gray'],
  'mini-bag-border-width': '1px',
  'mini-bag-shadow-color': colors['dk-gray'],
  'mini-bag-shadow-strength': '10px',
  'mini-bag-padding': '10px',
  'mini-bag-row-margin': '3px',
  'mini-bag-margin-top': '200px',
  'mini-bag-padding-right': '100px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['md-dk-gray'],
  'mini-bag-header-text-weight': 'normal',
  'mini-bag-header-background-color': colors['lt-gray'],
  'mini-bag-header-border-width': '0',
  'mini-bag-header-text-style': 'capitalize',
}

const miniBagContent = {
  'mini-bag-content-font-color': colors.black,
  'mini-bag-content-edit-font-weight': null,
  'mini-bag-content-edit-color': colors.black,
  'mini-bag-content-delete-size': '20px',
  'mini-bag-content-border-color': colors['md-gray'],
  'mini-bag-content-low-stock-font-color': colors.black,
  'mini-bag-content-edit-padding-top': '6px',
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
  'mini-bag-content-name-font-weight': null,
  'mini-bag-product-label-font-weight': null,
  'mini-bag-content-low-stock-font-weight': null,
}

const miniBagPromoCode = {
  'mini-bag-promocode-added-background-color': colors['promocode-color'],
  'mini-bag-promocode-confirmed-font-weight': '300',
  'mini-bag-promocode-confirmed-text-color': colors['promocode-color'],
  'mini-bag-promocode-link-text-color': colors.black,
  'mini-bag-promocode-link-text-size': '14px',
  'mini-bag-promocode-link-line-height': 'normal',
  'mini-bag-promocode-link-letter-spacing': '-0.1px',
}

const miniBagSummary = {
  'mini-bag-summary-shadow-color': colors.black,
  'mini-bag-summary-shadow-strength': '10px',
  'mini-bag-summary-border-top': null,
  'mini-bag-delivery-text-weight': null,
  'mini-bag-total-text-weight': null,
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagPromoCode,
  miniBagSummary
)
