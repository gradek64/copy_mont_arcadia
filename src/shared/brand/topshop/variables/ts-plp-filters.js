const colors = require('./ts-colors')
const base = require('./ts-base')
const typography = require('./ts-typography')

const plpFilters = {
  'plp-filters-background-color': colors.white,
  'plp-filters-spacing-vertical': '10px',
  'plp-filters-padding-top': '0',
  'plp-filters-total-results-font-size': '1em',
  'plp-filters-total-results-font-weight': typography['font-weight-300'],
}

const plpProductView = {
  'plp-filters-product-view-color': colors['md-gray'],
  'plp-filters-product-view-font-size': '1em',
  'plp-filters-product-view-letter-spacing': '0.085em',
  'plp-filters-product-view-color-active': colors['dk-gray'],
  'plp-filters-product-view-font-weight-active': 'normal',
  'plp-filters-product-view-pipe-display': 'block',
  'plp-filters-product-view-pipe-color': colors['lt-md-gray'],
}

const plpGridSelector = {
  'plp-filters-grid-selector-button-height': '0',
  'plp-filters-grid-selector-button-padding': '100%',
  'plp-filters-grid-selector-wrapper-display': 'block',
  'plp-filters-grid-selector-wrapper-flex-wrap': null,
  'plp-filters-grid-selector-item-color': colors['lt-md-gray'],
  'plp-filters-grid-selector-item-color-active': colors['dk-gray'],
  'plp-filters-grid-selector-item-display': 'none',
  'plp-filters-grid-selector-item-float': 'left',
  'plp-filters-grid-selector-item-padding': '100%',
  'plp-filters-grid-selector-item-n-display': 'block',
  'plp-filters-grid-selector-item-before-display': 'none',
  'plp-filters-grid-selector-item-before-padding': null,
}

const plpSortSelector = {
  'plp-filters-sort-selector-border-color': colors['lt-md-gray'],
  'plp-filters-sort-selector-padding': '0 30px 0 10px',
  'plp-filters-sort-selector-font-family': base['font-family-primary'],
  'plp-filters-sort-selector-letter-spacing': '0.085em',
  'plp-filters-sort-selector-arrow-width': '30px',
  'plp-filters-sort-selector-font-size': '1em',
}

const plpRefineButton = {
  'plp-filters-refine-button-background': colors.white,
  'plp-filters-refine-button-font-color': colors['dk-gray'],
  'plp-filters-refine-button-border-color': colors['lt-md-gray'],
  'plp-filters-refine-button-text-transform': 'none',
  'plp-filters-refine-button-font-size': '1em',
  'plp-filters-refine-button-letter-spacing': '0.085em',
}

module.exports = Object.assign(
  plpFilters,
  plpProductView,
  plpGridSelector,
  plpSortSelector,
  plpRefineButton
)
