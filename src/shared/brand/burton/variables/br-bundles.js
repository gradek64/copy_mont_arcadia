const colors = require('./br-colors')
const base = require('./br-base')

const bundlesHeading = {
  'bundles-heading-title-font-size-tablet': '15px',
  'bundles-heading-title-line-height-tablet': '26px',
  'bundles-heading-title-font-size-laptop': '17px',
  'bundles-heading-title-line-height-laptop': '28px',
  'bundles-heading-price-width': '100%',
  'bundles-heading-price-margin': '5px 0',
  'bundles-heading-price-display': null,
  'bundles-heading-price-discounted-color': colors['now-price-red'],
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['lt-md-gray'],
  'bundles-products-outfit-heading-display': 'none',
  'bundles-products-dividing-line-between-items-display': 'none',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-padding': '10px 0 50px',
  'bundles-miniproduct-border-color': colors['lt-md-gray'],
  'bundles-miniproduct-link-font-size': '0.75em',
  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-image-padding': '1em 0',
  'bundles-carousel-border-color': colors['lt-md-gray'],
  'bundles-carousel-font-size': '0.875em',
  'bundles-carousel-font-family': base['font-family-secondary'],
}

const bundlesSummary = {
  'bundles-summary-label-font-weight': 'bold',
  'bundles-summary-label-margin-top': '5px',
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
