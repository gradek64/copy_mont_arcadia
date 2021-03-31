const colors = require('./dp-colors')

const bundlesHeading = {
  'bundles-heading-title-font-size-tablet': '20px',
  'bundles-heading-title-line-height-tablet': '26px',
  'bundles-heading-title-font-size-laptop': '22px',
  'bundles-heading-title-line-height-laptop': '28px',
  'bundles-heading-price-width': '100%',
  'bundles-heading-price-margin': '0 0 1em',
  'bundles-heading-price-discounted-color': colors['now-price-red'],
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['lt-gray'],
  'bundles-products-dividing-line-border-bottom-width': null,
  'bundles-products-outfit-heading-padding': '10px 0 0',
  'bundles-products-dividing-line-margin-bottom': '0',
  'bundles-products-dividing-line-between-items-display': 'none',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-border-top-width': '1px',
  'bundles-miniproduct-heading-border-bottom-width': null,
  'bundles-miniproduct-heading-padding': '10px 0 0',
  'bundles-miniproduct-heading-font-color': colors['md-dk-gray'],
  'bundles-miniproduct-heading-font-weight': 'bold',

  'bundles-miniproduct-padding': '30px 0 20px',

  'bundles-miniproduct-link-font-size': '0.9em',
  'bundles-miniproduct-link-color': colors['dk-gray'],
}

const bundlesCarousel = {
  'bundles-carousel-image-padding': '1em 0',
  'bundles-carousel-border-color': colors['dk-gray'],
  'bundles-carousel-font-size': '0.875em',
}

module.exports = Object.assign(
  bundlesHeading,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel
)
