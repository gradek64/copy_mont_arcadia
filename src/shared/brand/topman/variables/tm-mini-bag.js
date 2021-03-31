const colors = require('./tm-colors')
const typography = require('./tm-typography')

const miniBagGeneral = {
  'mini-bag-border-width': '0',
  'mini-bag-shadow-color': colors.black,
  'mini-bag-shadow-strength': '10px',
  'mini-bag-padding': '10px',
  'mini-bag-row-margin': '10px 0 0',
}

const miniBagHeader = {
  'mini-bag-header-color': colors.black,
  'mini-bag-header-background-color': colors.white,
  'mini-bag-header-border-color': colors.white,
  'mini-bag-header-border-width': '0',
  'mini-bag-content-name-margin-bottom': '15px',
}

const miniBagContent = {
  'mini-bag-content-edit-color': colors['md-gray'],
  'mini-bag-content-delete-label-shown': 'block',
  'mini-bag-content-delete-icon-shown': 'block',
  'mini-bag-content-edit-padding-top': '6px',
  'mini-bag-content-border-color': colors['lt-md-gray'],
  'mini-bag-content-low-stock-font-color': colors['lowstock-color'],
  'mini-bag-content-out-of-stock-font-color': colors['error-color'],
  'mini-bag-content-name-font-weight': typography['font-weight-700'],

  'mini-bag-empty-font-size': '0.75em',
  'mini-bag-empty-font-weight': '200',
}

const miniBagSummary = {
  'mini-bag-summary-shadow-strength': null,
  'mini-bag-summary-border-top': `1px solid ${colors['lt-gray']}`,
  'mini-bag-summary-button-background': colors['highlight-color'],
  'mini-bag-summary-button-border-color': colors['highlight-color'],
  'mini-bag-summary-button-hover-background': colors.white,
  'mini-bag-summary-button-hover-font-color': colors['highlight-color'],
  'mini-bag-summary-row-margin-bottom': '10px',
  'mini-bag-summary-total-margin-top': '15px',
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
