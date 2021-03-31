const colors = require('./ev-colors')
const typography = require('./ev-typography')

const bundlesHeading = {
  'bundles-heading-title-font-size-tablet': typography['font-size-h2'],
  'bundles-heading-title-line-height-tablet': typography['line-height-h2'],
  'bundles-heading-title-font-size-laptop': typography['font-size-h1'],
  'bundles-heading-title-line-height-laptop': typography['line-height-h1'],
  'bundles-heading-price-width': null,
  'bundles-heading-price-font-weight': 'bold',
  'bundles-heading-price-margin': null,
  'bundles-heading-price-discounted-color': colors['now-price-red'],
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['lt-gray'],
  'bundles-products-dividing-line-margin-bottom': '0',
  'bundles-products-outfit-heading-display': 'none',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-font-color': colors['md-dk-gray'],

  'bundles-miniproduct-border-color': colors['lt-gray'],
  'bundles-miniproduct-padding': '20px 0 40px',

  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-border-color': colors['dk-gray'],
  'bundles-carousel-font-size': '0.875em',
  'bundles-carousel-font-weight': '400',
}

const bundlesSummary = {
  'bundles-summary-label-margin-top': '0',
  'bundles-summary-price-font-weight': 'bold',
  'bundles-summary-button-width': '80%',
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
