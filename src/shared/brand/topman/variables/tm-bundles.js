const colors = require('./tm-colors')

const bundlesHeading = {
  'bundles-heading-price-display': null,
  'bundles-heading-title-font-size-tablet': '18px',
  'bundles-heading-title-line-height-tablet': '22px',
  'bundles-heading-title-font-size-laptop': '20px',
  'bundles-heading-title-line-height-laptop': '24px',
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['ex-lt-gray'],
  'bundles-products-outfit-heading-padding': '0 0 1em',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-text-transform': 'uppercase',
  'bundles-miniproduct-heading-padding': '0 0 1em',
  'bundles-miniproduct-heading-text-align': 'left',

  'bundles-miniproduct-border-color': colors['ex-lt-gray'],
  'bundles-miniproduct-border-width': '1px',
  'bundles-miniproduct-padding': '20px 0',

  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-border-color': colors['dk-gray'],
  'bundles-carousel-font-size': '0.875em',
}

const bundlesSummary = {
  'bundles-summary-button-width': '90%',
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
