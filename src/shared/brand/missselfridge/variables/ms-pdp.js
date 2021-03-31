const colors = require('./ms-colors')
const typography = require('./ms-typography')

const pdpTitle = {
  'pdp-product-title-font-size-tablet': '16px',
  'pdp-product-title-line-height-tablet': '1.1',
  'pdp-product-title-font-size-laptop': '18px',
  'pdp-product-title-line-height-laptop': '1.2',
}

const pdpPrices = {
  'pdp-product-price-label': 'none',
}

const pdpProductSizes = {
  'pdp-product-size-title-align': 'left',
  'pdp-product-size-title-color': colors['dk-gray'],
  'pdp-product-size-title-font-weight': typography['font-weight-h1'],
  'pdp-product-size-title-text-transform': null,
  'pdp-product-size-title-content-after': '":"',
  'pdp-product-size-list-margin-bottom': null,
  'pdp-product-size-list-margin-bottom-tablet': '15px',
  'pdp-product-size-sizes-margin-bottom': '25px',
  'pdp-product-size-item-width': '1/8',
  'pdp-product-size-item-cycle': '8n',
  'pdp-product-size-gutter': '3%',
  'pdp-product-size-height': '50px',
  'pdp-product-size-vertical-margin': '28px',
  'pdp-product-size-active-border-width': '1px',
  'pdp-product-size-hover-border-color': colors['dk-gray'],
  'pdp-product-size-hover-border-width': '1px',
  'pdp-product-size-border-color': colors['lt-gray-2'],
  'pdp-product-size-active-background-color': colors['dk-gray'],
  'pdp-product-size-active-color': colors.white,
  'pdp-product-size-resize4': '',
  'pdp-product-size-resize5': '',
  'pdp-product-size-resize6': '',
  'pdp-product-size-resize7': '',
  'pdp-product-size-oos-slash': 'block',

  'pdp-product-size-oos-margin-offset': '36%',
  'pdp-product-size-oos-rotation': '-36deg',
  'pdp-product-size-oos-opacity': '0.4',
}
const pdpSwatches = {
  'pdp-product-swatch-size': '40px',
  'pdp-product-swatch-border-width': '1px',
  'pdp-product-swatch-selected-border-color': colors.black,
  'pdp-product-swatch-border-radius': '50%',
  'pdp-product-swatch-link-border-width': '0',
  'pdp-product-swatch-link-border-color': 'currentColor',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '15px',
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-letter-spacing': '0.085em',

  'pdp-size-guide-icon-display': 'inline-block',
  'pdp-size-guide-icon-height': '1em',
  'pdp-size-guide-icon-margin-right': '0.5em',

  'pdp-size-guide-border-width': '1px',

  'pdp-size-guide-margin-top-pdp': '25px',
}

const pdpDescription = {
  'pdp-product-detail-sub-title': typography['font-weight-500'],
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#4a4a4a',
  'pdp-product-low-stock-banner-bg-color': '#ffee71',
  'pdp-product-low-stock-banner-font-size': '16px',
  'pdp-product-low-stock-banner-line-height': '35px',
  'pdp-product-low-stock-banner-container-order': '1',
  'pdp-product-low-stock-banner-container-width': '78%',
}

module.exports = Object.assign(
  pdpTitle,
  pdpPrices,
  pdpProductSizes,
  pdpSwatches,
  pdpSizeGuide,
  pdpDescription,
  pdpLowStockBanner
)
