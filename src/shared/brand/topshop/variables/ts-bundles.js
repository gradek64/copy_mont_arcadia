const colors = require('./ts-colors')
const typography = require('./ts-typography')

const bundlesTitle = {
  'bundles-heading-title-margin-bottom': '10px',
  'bundles-heading-title-font-size-tablet': '20px',
  'bundles-heading-title-line-height-tablet': '24px',
  'bundles-heading-title-font-size-laptop': '22px',
  'bundles-heading-title-line-height-laptop': '26px',
  'bundles-heading-price-font-weight': typography['font-weight-700'],
}

const bundlesProducts = {
  'bundles-products-dividing-line-border-color': colors['md-gray'],
  'bundles-products-dividing-line-margin-bottom': '10px',
}

const bundlesMiniProduct = {
  'bundles-miniproduct-heading-text-transform': 'none',
  'bundles-miniproduct-heading-font-color': colors['dk-gray'],
  'bundles-miniproduct-heading-font-weight': null,
  'bundles-miniproduct-border-color': colors['lt-md-gray'],
  'bundles-miniproduct-border-width': '1px',
  'bundles-miniproduct-padding': '20px 0 30px',
  'bundles-miniproduct-title-font-weight': 'bold',
  'bundles-miniproduct-link-color': colors['dk-gray'],
  'bundles-products-dividing-line-between-items-display': 'none',
}

const bundlesCarousel = {
  'bundles-carousel-font-size': '0.875em',
}

const bundlesSummary = {
  'bundles-summary-box-shadow': null,
  'bundles-summary-border-top': colors['lt-gray'],
  'bundles-summary-message-font-weight': typography['font-weight-300'],
  'bundles-summary-label-font-weight': typography['font-weight-300'],
  'bundles-summary-label-margin-top': '0',
  'bundles-summary-price-font-weight': typography['font-weight-900'],
}

module.exports = Object.assign(
  bundlesTitle,
  bundlesProducts,
  bundlesMiniProduct,
  bundlesCarousel,
  bundlesSummary
)
