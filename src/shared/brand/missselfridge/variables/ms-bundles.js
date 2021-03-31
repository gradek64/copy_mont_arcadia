const colors = require('./ms-colors')
const typography = require('./ms-typography')

const bundlesHeading = {
  'bundles-heading-price-font-weight': typography['font-weight-h2'],
  'bundles-heading-price-font-color': colors.black,
  'bundles-heading-price-discounted-color': colors['now-price-color'],

  'bundles-heading-font-size-tablet': '16px',
  'bundles-heading-line-height-tablet': '1.1',
  'bundles-heading-font-size-laptop': '18px',
  'bundles-heading-line-height-laptop': '1.2',
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['lt-gray'],
  'bundles-products-outfit-heading-padding': '0 0 5px',
  'bundles-products-dividing-line-margin-bottom': '0',
  'bundles-products-outfit-heading-display': 'none',
  'bundles-products-dividing-line-between-items-display': 'none',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-text-transform': 'uppercase',
  'bundles-miniproduct-heading-padding': '0 0 5px',
  'bundles-miniproduct-heading-font-color': colors.black,

  'bundles-miniproduct-border-color': colors['lt-gray'],
  'bundles-miniproduct-border-width': '1px',
  'bundles-miniproduct-padding': '20px 0',

  'bundles-miniproduct-title-font-weight': typography['font-weight-h1'],
  'bundles-miniproduct-title-font-color': colors.black,

  'bundles-miniproduct-link-font-size': '0.75em',
  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-border-color': colors['md-gray'],
  'bundles-carousel-border-width': '2px',
  'bundles-carousel-font-size': '0.75em',
}

const bundlesSummary = {
  'bundles-summary-box-shadow': null,
  'bundles-summary-border-top': colors['md-gray'],
  'bundles-summary-font-size': '0.875em',
  'bundles-summary-price-font-weight': typography['font-weight-500'],
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
