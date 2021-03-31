const colors = require('./wl-colors')
const base = require('./wl-base')

module.exports = {
  'plp-filters-background-color': colors.white,
  'plp-filters-spacing-horizontal': '5px',
  'plp-filters-product-view-spacing-horizontal': '5px',
  'plp-filters-refinement-flex-direction': 'row-reverse',

  'plp-filters-product-view-color': colors['md-gray'],

  'plp-filters-product-view-font-size': '1.2em',
  'plp-filters-product-view-font-weight': base['font-weight-base'],
  'plp-filters-product-view-text-decoration': 'underline',
  'plp-filters-product-view-font-weight-active': base['font-weight-base'],
  'plp-filters-product-view-text-decoration-active': 'underline',

  'plp-filters-grid-selector-button-height': '0',
  'plp-filters-grid-selector-button-padding': '100%',
  'plp-filters-grid-selector-wrapper-display': 'block',
  'plp-filters-grid-selector-wrapper-flex-wrap': null,
  'plp-filters-grid-selector-item-color': colors['md-lt-gray'],
  'plp-filters-grid-selector-item-color-active': colors.black,
  'plp-filters-grid-selector-item-display': 'none',
  'plp-filters-grid-selector-item-float': 'left',
  'plp-filters-grid-selector-item-padding': '100%',
  'plp-filters-grid-selector-item-n-display': 'block',
  'plp-filters-grid-selector-item-before-display': 'none',
  'plp-filters-grid-selector-item-before-padding': null,

  'plp-filters-refine-button-background': colors.black,
  'plp-filters-refine-button-border-color': colors.black,
}
