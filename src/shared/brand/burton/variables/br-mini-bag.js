const base = require('./br-base')
const colors = require('./br-colors')

const miniBagGeneral = {
  'mini-bag-background-color': colors['ex-lt-gray'],
  'mini-bag-border-color': colors['lt-md-gray'],
  'mini-bag-border-width': '1px',
  'mini-bag-shadow-color': 'transparent',
  'mini-bag-shadow-strength': '0',
  'mini-bag-padding': '10px',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['md-dk-gray'],
  'mini-bag-header-background-color': colors['ex-lt-gray'],
  'mini-bag-header-text-weight': '300',
  'mini-bag-header-border-color': colors['lt-md-gray'],
}

const miniBagContent = {
  'mini-bag-content-font-color': colors.black,
  'mini-bag-content-font-weight': '500',
  'mini-bag-content-font-family': base['font-family-primary'],
  'mini-bag-content-price-font-size': '1em',
  'mini-bag-content-price-font-family': base['font-family-primary'],
  'mini-bag-content-edit-color': colors['dk-gray'],
  'mini-bag-content-delete-size': '22px',
  'mini-bag-content-border-color': colors['lt-md-gray'],
  'mini-bag-content-low-stock-font-color': colors['now-price-red'],
  'mini-bag-content-out-of-stock-font-color': colors['now-price-red'],

  'mini-bag-empty-font-family': base['font-family-primary'],
  'mini-bag-discount-color': colors['dk-gray'],
}

const miniBagPromoCode = {
  'mini-bag-accordion-background-color': colors.white,

  'mini-bag-promocode-added-background-color': null,
  'mini-bag-promocode-added-text-color': null,
  'mini-bag-promocode-added-padding': '5px 0',
  'mini-bag-promocode-confirmed-text-color': null,
}

const miniBagSummary = {
  'mini-bag-summary-shadow-color': colors['md-dk-gray'],
  'mini-bag-summary-shadow-strength': '10px',
  'mini-bag-summary-row-margin-bottom': '5px',
  'mini-bag-summary-font-size': '0.875em',
  'mini-bag-delivery-text-weight': 'normal',
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagPromoCode,
  miniBagSummary
)
