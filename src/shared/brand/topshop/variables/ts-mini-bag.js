const base = require('./ts-base')
const colors = require('./ts-colors')
const typography = require('./ts-typography')

const miniBagGeneral = {
  'mini-bag-border-color': colors['dk-gray'],
  'mini-bag-shadow-color': 'transparent',
  'mini-bag-shadow-strength': '0',
  'mini-bag-padding': '10px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['dk-gray'],
  'mini-bag-header-text-weight': typography['font-weight-400'],
  'mini-bag-header-background-color': colors['lt-gray'],
  'mini-bag-header-border-color': colors['lt-gray'],
  'mini-bag-header-font-family': base['font-family-primary'],
  'mini-bag-header-letter-spacing': '0.085em',
}

const miniBagContent = {
  'mini-bag-content-font-family': base['font-family-primary'],
  'mini-bag-content-font-size': '16px',
  'mini-bag-content-font-weight': typography['font-weight-400'],
  'mini-bag-content-subtotal-margin-top': '10px',
  'mini-bag-content-letter-spacing': '0.085em',
  'mini-bag-content-border-color': colors['lt-gray'],
  'mini-bag-content-low-stock-font-color': colors['md-gray'],
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
  'mini-bag-content-edit-padding-top': '2px',
  'mini-bag-content-edit-position': 'absolute',
  'mini-bag-content-edit-right': '1px',
  'mini-bag-content-delete-size': '20px',
  'mini-bag-content-delete-icon-shown': 'block',
  'mini-bag-content-delete-label-shown': 'block',
  'mini-bag-content-name-font-family': base['font-family-primary'],
  'mini-bag-content-name-letter-spacing': '0.085em',
  'mini-bag-content-name-font-weight': typography['font-weight-700'],

  'mini-bag-empty-font-family': null,
  'mini-bag-empty-font-size': null,
  'mini-bag-empty-font-weight': null,
}

const miniBagSummary = {
  'mini-bag-summary-shadow-color': null,
  'mini-bag-summary-shadow-strength': null,
  'mini-bag-summary-border-top': `1px solid ${colors['lt-gray']}`,
  'mini-bag-summary-font-weight': typography['font-weight-300'],
  'mini-bag-delivery-text-weight': typography['font-weight-300'],
}

const miniBagPromoCode = {
  'mini-bag-promocode-added-background-color': colors.white,
  'mini-bag-promocode-added-border': `1px solid ${colors['promocode-color']}`,
  'mini-bag-promocode-added-text-color': colors['promocode-color'],
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagSummary,
  miniBagPromoCode
)
