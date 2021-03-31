const colors = require('./ts-colors')
const base = require('./ts-base')
const typography = require('./ts-typography')

const pdpTitle = {
  'pdp-product-title-margin-bottom': '10px',
  'pdp-product-title-font-size-tablet': '20px',
  'pdp-product-title-line-height-tablet': '24px',
  'pdp-product-title-font-size-laptop': '22px',
  'pdp-product-title-line-height-laptop': '26px',
  'pdp-product-title-font-weight': typography['font-weight-h1'],
  'pdp-font-style': base['font-style-base'],
  'pdp-letter-spacing': '1px',
}

const pdpProductSizes = {
  'pdp-product-size-height': '40px',
  'pdp-product-size-title-color': colors['dk-gray'],
  'pdp-product-size-title-align': 'center',
  'pdp-product-size-title-font-size': '0.875em',
  'pdp-product-size-title-content-after': '":"',
  'pdp-product-size-title-text-transform': null,
  'pdp-product-size-title-margin-bottom': '0',
  'pdp-product-size-item-font-size': '1em',
  'pdp-product-size-item-width': '1/8',
  'pdp-product-size-item-cycle': '8n',
  'pdp-product-size-gutter': '2%',
  'pdp-product-size-vertical-margin': '0',
  'pdp-product-size-border-color': colors['lt-md-gray'],
  'pdp-product-size-active-border-color': colors['dk-gray'],
  'pdp-product-size-active-border-width': '1px',
  'pdp-product-size-font-family': base['font-family-primary'],
  'pdp-product-size-letter-spacing': '0.085em',
  'pdp-product-size-active-background-color': colors['lt-gray'],
  'pdp-product-size-oos-background-color': colors['md-gray'],
  'pdp-product-size-oos-slash': 'block',
  'pdp-product-size1-align': 'center',
  'pdp-product-size-resize4': '',
  'pdp-product-size-resize5': '',
  'pdp-product-size-resize6': '',
  'pdp-product-size-resize7': '',
  'pdp-product-size-oos-margin-offset': '50%',
  'pdp-product-size-sizes-margin-bottom': '20px',
}

const pdpPriceWrapper = {
  'pdp-price-font-size': '1.143em',
  'pdp-price-font-weight': typography['font-weight-700'],
}

const pdpSwatches = {
  'pdp-product-swatch-size': '36px',
  'pdp-product-swatch-link-selected-border-color': colors.white,
  'pdp-product-swatch-button-font-color': colors['dk-gray'],
  'pdp-swatch-underline-mode': 'block',
  'pdp-product-swatch-margin': '6px',
  'pdp-product-swatch-margin-bottom': '18px',
  'pdp-product-swatch-row-margin-bottom': '0',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '15px',
  'pdp-size-guide-position': null,
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-color': colors['md-dk-gray'],
  'pdp-size-guide-font-family': base['font-family-primary'],
  'pdp-size-guide-letter-spacing': '0.085em',

  'pdp-size-guide-icon-display': 'inline-block',
  'pdp-size-guide-icon-height': '1.2em',
  'pdp-size-guide-icon-margin-right': '0.5em',

  'pdp-size-guide-border-color': colors['lt-md-gray'],
  'pdp-size-guide-border-width': '1px',
}

const pdpDetail = {
  'pdp-product-detail-font-family': null,
  'pdp-product-swatch-margin': '9px',
  'pdp-product-detail-line-height': '1.5',
  'pdp-product-detail-title-font-weight': typography['font-weight-700'],
}

const pdpQuantity = {
  'pdp-product-quantity-label-text-transform': 'uppercase',
  'pdp-product-quantity-label-after-content': ':',
  'pdp-product-quantity-select-dropdown-ie-font-weight': 300,
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': null,
  'pdp-recommendations-title-font-size': null,
  'pdp-recommendations-title-padding': '10px',
  'pdp-recommendations-name-margin': null,
  'pdp-recommendations-rating-display': 'none',
  'pdp-recommendations-product-text-align': 'left',
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#898989',
}

module.exports = Object.assign(
  pdpTitle,
  pdpProductSizes,
  pdpSwatches,
  pdpSizeGuide,
  pdpDetail,
  pdpRecommendations,
  pdpQuantity,
  pdpPriceWrapper,
  pdpLowStockBanner
)
