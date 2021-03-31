const colors = require('./wl-colors')

const pdpTitle = {
  'pdp-product-title-font-size-tablet': '20px',
  'pdp-product-title-line-height-tablet': '1.1',
  'pdp-product-title-font-size-laptop': '22px',
  'pdp-product-title-line-height-laptop': '1.2',
}

const pdpPrices = {
  'pdp-product-unit-price-font-size': '1.35em',
  'pdp-product-now-price-font-size': '1em',
  'pdp-product-old-price-font-size': '1em',
  'pdp-product-now-price-display': 'inline',
  'pdp-product-old-price-display': 'inline',
  'pdp-product-price-label': 'none',
}

const pdpProductSizes = {
  'pdp-product-size-active-font-weight': 'bold',
  'pdp-product-size-title-align': 'left',
  'pdp-product-size-title-content-after': '":"',
  'pdp-product-size-title-text-transform': 'capitalize',
  'pdp-product-size-title-margin-bottom': '0',
  'pdp-product-size-oos-background-color': colors['md-gray'],
  'pdp-product-size-oos-slash': 'block',
  'pdp-product-size-sizes-margin-bottom': '25px',

  'pdp-product-swatch-size': '36px',
}

const pdpRating = {
  'pdp-product-rating-vertical-margin': '10px',
  'pdp-product-rating-display': 'block',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '0',
  'pdp-size-guide-block-bottom-tablet': '0',
  'pdp-size-guide-width': 0,
  'pdp-size-guide-margin-left': 0,
  'pdp-size-guide-color': colors['md-dk-gray'],
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': null,
  'pdp-recommendations-title-text-align': 'left',
  'pdp-recommendations-title-text-transform': 'none',
  'pdp-recommendations-padding': '10px 0',
  'pdp-recommendations-product-text-align': 'center',
  'pdp-recommendations-name-font-size': '1.2em',
}

const pdpQuantity = {
  'pdp-product-quantity-margin-bottom-desktop': null,
  'pdp-product-quantity-label-after-content': ':',
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-text-color': '#db6c56',
  'pdp-product-low-stock-banner-padding': '6px',
  'pdp-product-low-stock-banner-font-size': '12px',
  'pdp-product-low-stock-banner-border': 'solid 1px #db6c56',
  'pdp-product-low-stock-banner-line-height': '20px',
}

module.exports = Object.assign(
  pdpTitle,
  pdpPrices,
  pdpProductSizes,
  pdpRating,
  pdpSizeGuide,
  pdpRecommendations,
  pdpQuantity,
  pdpLowStockBanner
)
