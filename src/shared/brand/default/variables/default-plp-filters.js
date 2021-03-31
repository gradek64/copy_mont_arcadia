const colors = require('./default-colors')

const plpFilters = {
  'plp-filters-background-color': colors['lt-gray'],
  'plp-filters-spacing-vertical': '5px',
  'plp-filters-spacing-outer-horizontal': '0',
  'plp-filters-spacing-horizontal': '10px',
  'plp-filters-padding-top': null,
  'plp-filters-refinement-flex-direction': 'row',
  'plp-filters-product-view-flex-direction': 'row',
  'plp-filters-border-width': 0,
  'plp-filters-border-color': 'transparent',
  'plp-filters-height': '32px',
  'plp-filters-height-tablet': '30px',
  'plp-filters-total-results-font-size': null,
  'plp-filters-total-results-font-weight': null,
  'plp-filters-total-results-margin': '0 5px 0 0',
  'plp-filters-after-display-tablet': 'none',
  'plp-filters-margin-tablet': null,
}

const plpProductView = {
  'plp-filters-product-view-width': null,
  'plp-filters-product-view-width-responsive': 'auto',
  'plp-filters-product-view-padding': null,
  'plp-filters-product-view-padding-responsive': null,
  'plp-filters-product-view-word-spacing': 'normal',
  'plp-filters-product-view-font-weight': 'normal',
  'plp-filters-product-view-font-size': '0.75em',
  'plp-filters-product-view-color': colors.black,
  'plp-filters-product-view-background-color': 'transparent',
  'plp-filters-product-view-border-width': 0,
  'plp-filters-product-view-border-color': 'transparent',
  'plp-filters-product-view-text-transform': 'capitalize',
  'plp-filters-product-view-text-decoration': 'none',
  'plp-filters-product-view-letter-spacing': null,
  'plp-filters-product-view-font-weight-active': 'bold',
  'plp-filters-product-view-color-active': colors.black,
  'plp-filters-product-view-background-color-active': 'transparent',
  'plp-filters-product-view-border-width-active': 0,
  'plp-filters-product-view-border-color-active': 'transparent',
  'plp-filters-product-view-text-decoration-active': 'none',
  'plp-filters-product-view-pipe-display': 'none',
  'plp-filters-product-view-pipe-color': null,
  'plp-filters-product-view-font-family': null,
  'plp-filters-product-view-space-between-buttons': '10px',
  'plp-filters-product-view-spacing-horizontal':
    plpFilters['plp-filters-spacing-horizontal'],
  'plp-filters-product-view-margin-top': null,

  'plp-filters-product-view-width-320-font-size': null,
}

const plpGridSelector = {
  'plp-filters-grid-selector-flex-direction': 'row',
  'plp-filters-grid-selector-button-height': null,
  'plp-filters-grid-selector-button-padding': null,
  'plp-filters-grid-selector-wrapper-display': 'flex',
  'plp-filters-grid-selector-wrapper-flex-wrap': 'wrap',
  'plp-filters-grid-selector-item-color': colors['dk-gray'],
  'plp-filters-grid-selector-item-color-active': colors.black,
  'plp-filters-grid-selector-item-display': null,
  'plp-filters-grid-selector-item-float': null,
  'plp-filters-grid-selector-item-padding': null,
  'plp-filters-grid-selector-item-n-display': null,
  'plp-filters-grid-selector-item-before-display': 'block',
  'plp-filters-grid-selector-item-before-padding': '100%',
  'plp-filters-grid-selector-item-spacing': '4px',
  'plp-filters-grid-selector-item-spacing-tablet': '2px',
}

const plpSortSelector = {
  'plp-filters-sort-selector-border-color': null,
  'plp-filters-sort-selector-padding': null,
  'plp-filters-sort-selector-font-size': null,
  'plp-filters-sort-selector-font-family': null,
  'plp-filters-sort-selector-letter-spacing': null,
  'plp-filters-sort-selector-arrow-right': null,
  'plp-filters-sort-selector-arrow-width': null,
  'plp-filters-sort-selector-arrow-background-size': null,
  'plp-filters-sort-selector-arrow-position': 'center',

  // desktop
  'plp-filters-sort-selector-padding-desktop': '6px 32px 5px 8px',
  'plp-filters-sort-selector-font-size-desktop': '13px',
  'plp-filters-sort-selector-arrow-width-desktop': '32px',
  'plp-filters-sort-selector-arrow-background-size-desktop': '16px',
}

const plpRefineButton = {
  'plp-filters-refine-button-background': null,
  'plp-filters-refine-button-font-color': null,
  'plp-filters-refine-button-border-color': null,
  'plp-filters-refine-button-text-transform': null,
  'plp-filters-refine-button-font-size': null,
  'plp-filters-refine-button-letter-spacing': null,
}

module.exports = Object.assign(
  plpFilters,
  plpProductView,
  plpGridSelector,
  plpSortSelector,
  plpRefineButton
)
