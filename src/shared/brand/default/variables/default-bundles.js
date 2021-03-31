const colors = require('./default-colors')

const bundlesHeading = {
  'bundles-heading-title-font-color': null,
  'bundles-heading-title-font-size': '1.35em',
  'bundles-heading-title-font-weight': null,
  'bundles-heading-title-text-decoration': null,
  'bundles-heading-title-margin-bottom': null,
  'bundles-heading-title-font-size-tablet': null,
  'bundles-heading-title-line-height-tablet': '1',
  'bundles-heading-title-font-size-laptop': null,
  'bundles-heading-title-line-height-laptop': '1',
  'bundles-heading-price-display': null,
  'bundles-heading-price-width': null,
  'bundles-heading-price-font-weight': null,
  'bundles-heading-price-font-color': null,
  'bundles-heading-price-text-align': 'center',
  'bundles-heading-price-margin': null,
  'bundles-heading-price-from-display': 'none',
  'bundles-heading-price-discounted-color': 'inherit',
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': null,
  'bundles-products-dividing-line-border-bottom-width': null,
  'bundles-products-dividing-line-border-top-width': null,
  'bundles-products-outfit-heading-padding': '0 0 10px',
  'bundles-products-dividing-line-margin-bottom': null,
  'bundles-products-outfit-heading-display': null,
  'bundles-products-dividing-line-above-heading-display': 'none',
  'bundles-products-dividing-line-under-heading-display': 'none',
  'bundles-products-dividing-line-between-items-display': 'block',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-border-top-width': null,
  'bundles-miniproduct-heading-border-bottom-width': '1px',
  'bundles-miniproduct-heading-text-align': 'center',
  'bundles-miniproduct-heading-text-transform': null,
  'bundles-miniproduct-heading-padding': '0 0 10px',
  'bundles-miniproduct-heading-font-color': null,
  'bundles-miniproduct-heading-font-weight': null,

  'bundles-miniproduct-border-color': colors['md-gray'],
  'bundles-miniproduct-border-width': null,
  'bundles-miniproduct-padding': '10px 0',

  'bundles-miniproduct-title-font-weight': 'normal',
  'bundles-miniproduct-title-font-color': null,
  'bundles-miniproduct-title-font-size': null,

  'bundles-miniproduct-link-font-size': '0.875em',
  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-padding': '0',
  'bundles-carousel-image-padding': null,
  'bundles-carousel-border-color': null,
  'bundles-carousel-border-width': '1px',
  'bundles-carousel-font-size': null,
  'bundles-carousel-font-family': null,
  'bundles-carousel-font-weight': null,
}

const bundlesSummary = {
  'bundles-summary-box-shadow': `0 0 10px ${colors['dk-gray']}`,
  'bundles-summary-border-top': null,
  'bundles-summary-font-family': null,
  'bundles-summary-font-size': null,
  'bundles-summary-message-font-weight': null,
  'bundles-summary-label-font-weight': null,
  'bundles-summary-label-margin-top': '10px',
  'bundles-summary-price-font-weight': null,
  'bundles-summary-button-width': null,
}

const quickView = {
  'bundles-quickview-ratings-display': null,
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary,
  quickView
)
