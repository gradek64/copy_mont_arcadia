const colors = require('./ev-colors')
const base = require('./ev-base')
const typography = require('./ev-typography')

module.exports = {
  'plp-filters-background-color': colors.white,
  'plp-filters-spacing-outer-horizontal': 0,
  'plp-filters-spacing-vertical': '10px',

  'plp-filters-product-view-color': colors['lt-md-gray'],
  'plp-filters-product-view-color-active': colors.black,
  'plp-filters-product-view-border-width': 0,
  'plp-filters-product-view-font-size': '0.929em',
  'plp-filters-product-view-font-weight-active':
    typography['font-weight-normal'],
  'plp-filters-product-view-font-family': base['font-family-primary'],
  'plp-filters-product-view-pipe-display': 'block',
  'plp-filters-product-view-pipe-color': colors['lt-md-gray'],

  'plp-filters-product-view-letter-spacing': '0.06em',

  'plp-filters-grid-selector-flex-direction': 'row-reverse',
  'plp-filters-grid-selector-item-color': colors['md-lt-gray'],
  'plp-filters-grid-selector-item-color-active': colors.black,

  'plp-filters-sort-selector-font-size': '1em',
}
