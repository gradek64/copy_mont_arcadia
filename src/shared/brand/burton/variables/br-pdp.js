const colors = require('./br-colors')
const typography = require('./br-typography')

const pdpTitle = {
  'pdp-product-title-font-size-tablet': '15px',
  'pdp-product-title-line-height-tablet': '26px',
  'pdp-product-title-font-size-laptop': '17px',
  'pdp-product-title-line-height-laptop': '28px',
}

const pdpProductSizes = {
  'pdp-product-size-title-align': 'left',
  'pdp-product-size-title-color': colors['dk-gray'],
  'pdp-product-size-title-font-weight': 'normal',
  'pdp-product-size-title-text-transform': null,
  'pdp-product-size-title-content-after': '":"',
  'pdp-product-size-title-margin-top': '10px',
  'pdp-product-size-title-margin-bottom': '10px',
  'pdp-product-size-sizes-margin-bottom': '25px',
  'pdp-product-size-list-margin-bottom': '20px',
  'pdp-product-size-item-width': '1/8',
  'pdp-product-size-item-cycle': '8n',
  'pdp-product-size-gutter': '2%',
  'pdp-product-size-resize4': '',
  'pdp-product-size-resize5': '',
  'pdp-product-size-resize6': '',
  'pdp-product-size-resize7': '',
  'pdp-product-size-height': '40px',
  'pdp-product-size-max-height': '50px',
  'pdp-product-size-vertical-margin': '0',
  'pdp-product-size-active-border-width': '3px',
  'pdp-product-size-border-color': colors['dk-gray'],
  'pdp-product-size-square-display': 'block',

  'pdp-product-size-active-border-color': colors['ex-lt-gray'],
  'pdp-product-size-active-background-color': colors['dk-gray'],
  'pdp-product-size-active-color': colors.white,
  'pdp-product-size-active-outline-width': '1px',
  'pdp-product-size-active-outline-color': colors['dk-gray'],

  'pdp-product-size-oos-margin-offset': '36%',
  'pdp-product-size-oos-rotation': '-36deg',
  'pdp-product-size-oos-opacity': '0.5',
}

const pdpSwatches = {
  'pdp-product-swatch-size': '42px',
  'pdp-product-swatch-border-width': '1px',
  'pdp-product-swatch-selected-border-color': colors['dk-gray'],
  'pdp-product-swatch-border-radius': '0',
  'pdp-product-swatch-link-border-color': 'transparent',
  'pdp-product-swatch-link-border-width': '3px',
}

const pdpPrices = {
  'pdp-product-price-label': 'none',
}

const pdpDetail = {
  'pdp-product-detail-font-family': typography['font-family-p'],
}

const bundlesDetail = {}

const pdpDescription = {}

const pdpDescriptionDetails = {
  'pdp-product-description-details-text-align': 'center',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '15px',
  'pdp-size-guide-offset-bottom': '15px',
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-color': colors['dk-gray'],
  'pdp-size-guide-icon-display': 'none',
  'pdp-size-guide-font-size': '0.9em',
  'pdp-size-guide-text-transform': 'uppercase',
  'pdp-size-guide-border-color': colors['dk-gray'],
  'pdp-size-guide-border-width': '1px',
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': null,
  'pdp-recommendations-title-padding': '5px',
  'pdp-recommendations-name-margin': '10px 0 5px',
  'pdp-recommendations-title-text-transform': 'uppercase',
  'pdp-recommendations-padding': '20px 0 10px',
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#ffffff',
  'pdp-product-low-stock-banner-font-size': '12px',
  'pdp-product-low-stock-banner-padding': '6px',
  'pdp-product-low-stock-banner-bg-color': '#00529b',
  'pdp-product-low-stock-banner-font-weight': '500',
  'pdp-product-low-stock-banner-margin-top': '5px',
}

module.exports = Object.assign(
  pdpPrices,
  pdpTitle,
  pdpProductSizes,
  pdpSwatches,
  pdpDetail,
  bundlesDetail,
  pdpDescription,
  pdpDescriptionDetails,
  pdpSizeGuide,
  pdpRecommendations,
  pdpLowStockBanner
)
