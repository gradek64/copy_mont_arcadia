const colors = require('./ms-colors')
const typography = require('./ms-typography')

const miniBagGeneral = {
  'mini-bag-border-color': colors['lt-gray'],
  'mini-bag-padding': '10px',
  'mini-bag-margin-top': '165px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['dk-gray'],
  'mini-bag-header-background-color': colors['ex-lt-gray'],
  'mini-bag-header-border-color': colors['ex-lt-gray'],
  'mini-bag-header-border-width': '0',
}

const miniBagContent = {
  'mini-bag-content-border-color': colors['lt-gray'],
  'mini-bag-content-low-stock-font-color': colors['error-color'],
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
  'mini-bag-content-name-font-weight': typography['font-weight-400'],
  'mini-bag-content-delete-size': '18px',
  'mini-bag-content-subtotal-font-weight': typography['font-weight-500'],
}

const miniBagCol = {
  'mini-left-col-color': colors.black,
}

const miniBagSummary = {
  'mini-bag-summary-shadow-color': null,
  'mini-bag-summary-shadow-strength': null,
  'mini-bag-summary-border-top': `1px solid ${colors['lt-gray']}`,
  'mini-bag-sub-total-color': colors.black,
  'mini-bag-total-color': colors.black,
  'mini-bag-summary-font-color': null,
}

const miniBagPromoCode = {
  'mini-bag-promocode-added-background-color': '#fef9a5',
  'mini-bag-promocode-added-text-color': colors['dk-gray'],
  'mini-bag-promocode-added-font-weight': typography['font-weight-500'],
  'mini-bag-promocode-confirmed-text-color': colors['dk-gray'],
  'mini-bag-promocode-link-font-style': 'italic',
  'mini-bag-promocode-link-text-color': colors['dk-gray'],
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagCol,
  miniBagSummary,
  miniBagPromoCode
)
