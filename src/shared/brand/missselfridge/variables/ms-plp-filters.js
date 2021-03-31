const colors = require('./ms-colors')
const typography = require('./ms-typography')

module.exports = {
  'plp-filters-background-color': colors.white,
  'plp-filters-spacing-horizontal': '10px',

  'plp-filters-product-view-word-spacing': '1000px',
  'plp-filters-product-view-color': colors['md-gray'],

  'plp-filters-product-view-font-weight-active': typography['font-weight-500'],
  'plp-filters-product-view-color-active': colors['dk-gray'],
  'plp-filters-product-view-font-weight': typography['font-weight-300'],
  'plp-filters-product-view-font-size': '1.286em',
  'plp-filters-product-view-text-decoration-active': 'underline',

  'plp-filters-grid-selector-flex-direction': 'row-reverse',
  'plp-filters-grid-selector-item-color': colors['lt-gray'],
  'plp-filters-grid-selector-item-color-active': colors['dk-gray'],

  'plp-filters-sort-selector-font-size': '14px',
}
