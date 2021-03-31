const colors = require('./ev-colors')
const typography = require('./ev-typography')

const pdpGeneral = {
  'pdp-vertical-padding': '15px',
}

const pdpTitle = {
  'pdp-product-title-font-size-tablet': typography['font-size-h3'],
  'pdp-product-title-line-height-tablet': typography['line-height-h2'],
  'pdp-product-title-font-size-laptop': typography['font-size-h2'],
  'pdp-product-title-line-height-laptop': typography['line-height-h1'],
}

const pdpPrices = {
  'pdp-product-old-price-font-size': typography['font-size-info'],
  'pdp-product-unit-price-font-size': typography['font-size-info'],
}

const pdpProductSizes = {
  'pdp-product-size-title-align': 'left',
  'pdp-product-size-title-color': colors.black,
  'pdp-product-size-title-text-transform': 'capitalize',
  'pdp-product-size-title-font-weight': typography['font-weight-normal'],
  'pdp-product-size-title-content-after': '":"',
  'pdp-product-size-title-margin-bottom': '10px',

  'pdp-product-size-gutter': '6%',
  'pdp-product-size-height': '42px',
  'pdp-product-size-vertical-margin': '28px',
  'pdp-product-size-oos-opacity': '0.5',
}

const pdpSwatches = {
  'pdp-product-swatch-size': '40px',
  'pdp-product-swatch-border-width': '2px',
  'pdp-product-swatch-selected-border-color': colors['lt-gray'],
  'pdp-product-swatch-border-radius': '50%',
  'pdp-product-swatch-link-border-color': colors.white,
  'pdp-product-swatch-link-border-width': '2px',
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': null,
  'pdp-recommendations-title-text-align': 'left',
  'pdp-recommendations-title-font-size': '1.2em',
  'pdp-recommendations-padding': '0 0 10px',
}

const pdpSizeGuide = {
  'pdp-size-guide-position': null,
  'pdp-size-guide-block-bottom': '15px',
  'pdp-size-guide-offset-bottom': '20px',
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-color': colors['dk-gray'],
  'pdp-size-guide-icon-display': 'none',
  'pdp-size-guide-text-transform': 'capitalize',
  'pdp-size-guide-font-size': typography['font-size-label'],
  'pdp-size-guide-font-weight': typography['font-weight-thin'],
  'pdp-size-guide-border-color': colors['dk-gray'],
  'pdp-size-guide-border-width': '1px',
  'pdp-size-guide-margin-top-pdp': '25px',
}

const pdpQuantity = {
  'pdp-product-quantity-label-after-content': ':',
}

const pdpPriceWrapper = {
  'pdp-price-font-size': '1.3em',
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#f35f51',
  'pdp-product-low-stock-banner-border': 'solid 1px #f35f51',
  'pdp-product-low-stock-banner-line-height': '30px',
  'pdp-product-low-stock-banner-flex': 'none',
  'pdp-product-low-stock-banner-container-order': '1',
  'pdp-product-low-stock-banner-container-width': '78%',
}

const pdpDetail = {
  'pdp-product-detail-title-font-size': typography['font-size-h3'],
  'pdp-product-detail-title-font-weight': typography['font-weight-thick'],
  'pdp-product-detail-title-letter-spacing':
    typography['letter-spacing-subtitle'],
  'pdp-product-detail-font-size': typography['font-size-detail'],
  'pdp-product-detail-font-weight': typography['font-weight-normal'],
  'pdp-product-detail-content-line-height': typography['line-height-detail'],
  'pdp-product-detail-max-width': '100%',
}

module.exports = Object.assign(
  pdpGeneral,
  pdpTitle,
  pdpPrices,
  pdpProductSizes,
  pdpSwatches,
  pdpSizeGuide,
  pdpRecommendations,
  pdpQuantity,
  pdpPriceWrapper,
  pdpLowStockBanner,
  pdpDetail
)
