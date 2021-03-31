const colors = require('./tm-colors')
const base = require('./tm-base')
const typography = require('./tm-typography')

const pdpGeneral = {
  'pdp-vertical-padding': '20px',
}

const pdpTitle = {
  'pdp-product-title-font-size-tablet': '18px',
  'pdp-product-title-line-height-tablet': '22px',
  'pdp-product-title-font-size-laptop': '22px',
  'pdp-product-title-line-height-laptop': '24px',
  'pdp-product-title-font-weight': typography['font-weight-h1'],
  'pdp-product-size-font-family': base['font-family-primary'],
  'pdp-font-style': base['font-style-base'],
  'pdp-letter-spacing': '1px',
}

const pdpPrices = {
  'pdp-product-unit-price-font-size': '1em',
  'pdp-product-old-price-font-size': '1.15em',
  'pdp-product-now-price-font-size': '1.15em',
  'pdp-product-price-label-size': '1.143em',
  'pdp-price-font-weight': typography['font-weight-700'],
}

const pdpProductSizes = {
  'pdp-product-size-gutter': '4%',
  'pdp-product-size-height': '30px',

  'pdp-product-size-item-font-size': '1em',

  'pdp-product-size-active-border-width': '1px',
  'pdp-product-size-border-color': colors['oos-color'],
  'pdp-product-size-active-border-color': colors['md-gray'],
  'pdp-product-size-active-background-color': colors['lt-gray'],
  'pdp-product-size-color': colors.black,

  'pdp-product-size-sizes-margin-bottom': '25px',

  'pdp-product-size-oos-margin-offset': '50%',
  'pdp-product-size-oos-rotation': '-45deg',
  'pdp-product-size-oos-slash': 'block',
  'pdp-product-size-oos-opacity': '1',

  'pdp-product-size-title-margin-top': '30px',
  'pdp-product-size-title-text-transform': 'initial',
  'pdp-product-size-title-font-size': '0.85em',
  'pdp-product-size-oos-text-size-colour': colors['oos-color'],
}
const pdpSwatches = {
  'pdp-product-swatch-size': '38px',
  'pdp-product-swatch-margin': '4px',
  'pdp-product-swatch-border-width': '1px',
  'pdp-product-swatch-selected-border-color': colors.black,
  'pdp-product-swatch-border-radius': '50%',
  'pdp-product-swatch-link-border-width': '1px',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '20px',
  'pdp-size-guide-offset-bottom': '10px',
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-color': colors['dk-gray'],
  'pdp-size-guide-icon-display': 'none',
  'pdp-size-guide-text-transform': 'initial',
  'pdp-size-guide-border-color': colors.black,
  'pdp-size-guide-border-width': '1px',
}

const pdpRecommendations = {
  'pdp-recommendations-title-text-transform': 'none',
}

const pdpDescription = {}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#ffffff',
  'pdp-product-low-stock-banner-font-size': '14px',
  'pdp-product-low-stock-banner-line-height': '20px',
  'pdp-product-low-stock-banner-bg-color': '#7794ac',
  'pdp-product-low-stock-banner-font-weight': '300',
  'pdp-product-low-stock-banner-padding': '6px',
}

module.exports = Object.assign(
  pdpGeneral,
  pdpTitle,
  pdpPrices,
  pdpProductSizes,
  pdpSizeGuide,
  pdpSwatches,
  pdpRecommendations,
  pdpDescription,
  pdpLowStockBanner
)
