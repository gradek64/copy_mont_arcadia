const colors = require('./dp-colors')

const pdpTitle = {
  'pdp-product-title-font-size-tablet': '20px',
  'pdp-product-title-line-height-tablet': '26px',
  'pdp-product-title-font-size-laptop': '22px',
  'pdp-product-title-line-height-laptop': '28px',
}

const pdpProductSizes = {
  'pdp-product-size-title-onesize-display': 'none',

  'pdp-product-size-gutter': '6%',
  'pdp-product-size-height': '46px',
  'pdp-product-size-vertical-margin': '28px',
  'pdp-product-size-active-border-width': '0',
  'pdp-product-size-hover-border-color': colors['dk-gray'],
  'pdp-product-size-hover-border-width': '2px',
  'pdp-product-size-active-border-color': colors['lt-md-gray'],
  'pdp-product-size-active-background-color': colors['lt-md-gray'],
  'pdp-product-size-active-color': colors['dk-gray'],
  'pdp-product-size-sizes-margin-bottom': '0',
  'pdp-product-size-list-margin-bottom': null,
  'pdp-product-size-list-margin-bottom-tablet': '15px',

  'pdp-product-size-oos-margin-offset': '36%',
  'pdp-product-size-oos-rotation': '-36deg',
  'pdp-product-size-oos-slash': 'block',
  'pdp-product-size-oos-opacity': '0.5',

  'pdp-product-size1-width': '100px',
}

const pdpPrices = {
  'pdp-product-price-label': 'none',
  'pdp-product-unit-price-font-size': '1em',
  'pdp-product-old-price-font-size': '1em',
  'pdp-product-old-margin-right': null,
  'pdp-product-now-price-font-size': '1em',
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': null,
  'pdp-recommendations-padding': '40px 0 10px',
}

const pdpSwatches = {
  'pdp-product-swatch-size': '30px',
  'pdp-product-swatch-border-width': '1px',
  'pdp-product-swatch-border-color': 'transparent',
  'pdp-product-swatch-selected-border-color': colors['dk-gray'],
  'pdp-product-swatch-border-radius': '50%',
  'pdp-product-swatch-link-border-color': colors['ex-lt-gray'],
  'pdp-product-swatch-link-border-width': '2px',
}

const pdpSizeGuide = {
  'pdp-size-guide-position': null,
  'pdp-size-guide-block-bottom': '15px',
  'pdp-size-guide-offset-bottom': '13px',
  'pdp-size-guide-offset-top': null,
  'pdp-size-guide-offset-right': null,
  'pdp-size-guide-color': colors['dk-gray'],
  'pdp-size-guide-font-size': '0.8125em',
  'pdp-size-guide-border-color': colors['dk-gray'],
  'pdp-size-guide-border-width': '1px',
}

const pdpDetail = {
  'pdp-product-detail-line-height': '1.5',
}

const pdpQuantity = {
  'pdp-product-quantity-label-text-transform': 'uppercase',
}

const pdpPriceWrapper = {
  'pdp-price-font-size': '1.3em',
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#ffffff',
  'pdp-product-low-stock-banner-bg-color': '#f65757',
  'pdp-product-low-stock-banner-line-height': '18px',
  'pdp-product-low-stock-banner-font-size': '13px',
  'pdp-product-low-stock-banner-padding': '6px 0 6px 0',
  'pdp-product-low-stock-banner-margin-bottom': '20px',
  'pdp-product-low-stock-banner-min-height': '30px',
}

module.exports = Object.assign(
  pdpTitle,
  pdpProductSizes,
  pdpPrices,
  pdpSwatches,
  pdpSizeGuide,
  pdpRecommendations,
  pdpDetail,
  pdpQuantity,
  pdpPriceWrapper,
  pdpLowStockBanner
)
