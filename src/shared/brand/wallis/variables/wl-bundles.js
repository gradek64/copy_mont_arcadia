const colors = require('./wl-colors')

const bundlesHeading = {
  'bundles-heading-title-font-size-tablet': '20px',
  'bundles-heading-title-line-height-tablet': '1.1',
  'bundles-heading-title-font-size-laptop': '22px',
  'bundles-heading-title-line-height-laptop': '1.2',
  'bundles-heading-price-width': '100%',
  'bundles-heading-price-font-weight': 'bold',
  'bundles-heading-price-margin': '0 0 20px',
  'bundles-heading-price-discounted-color': colors['highlight-color'],
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['lt-gray'],
  'bundles-products-outfit-heading-padding': '0 0 5px',
  'bundles-products-dividing-line-margin-bottom': '0',
  'bundles-products-outfit-heading-display': 'none',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-text-transform': 'none',
  'bundles-miniproduct-heading-padding': '0 0 5px',

  'bundles-miniproduct-border-color': colors['lt-gray'],
  'bundles-miniproduct-padding': '30px 0 10px',

  'bundles-miniproduct-title-font-size': '1.25em',
}

const bundlesCarousel = {
  'bundles-carousel-padding': '0 10px',
  'bundles-carousel-border-color': colors['lt-gray'],
  'bundles-carousel-font-weight': 'bold',
}

const bundlesSummary = {
  'bundles-summary-box-shadow': `0 0 5px ${colors['dk-gray']}`,
  'bundles-summary-label-margin-top': '5px',
  'bundles-summary-price-font-weight': 'bold',
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
