const base = require('./ms-base')
const colors = require('./ms-colors')
const typography = require('./ms-typography')

const plpProductList = {
  'plp-product-list-horizontal-padding': '0',
}

const plpProduct = {
  'plp-product-horizontal-padding': '10px',
  'plp-product-borders': 'none',
  'plp-product-alignment': 'left',
  'plp-product-margin-bottom': '10%',
  'plp-product-info-padding-horizontal': '0',
  'plp-product-info-padding-left-desktop': '0',
  'plp-product-info-padding-bottom-desktop': '0',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-quick-view-opacity': '1',
  'plp-product-quick-view-opacity-hover': '0.7',
  'plp-product-line-height': '15px',
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-image-aspect-ratio': '135.9433962264%',
  'plp-product-title-margin-right': '30px',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '1.125em',
  'plp-product-title-font-size-desktop': '14px',
  'plp-product-title-font-color': colors.black,
  'plp-product-title-font-weight': typography['font-weight-h2'],
  'plp-product-title-font-weight-desktop': typography['font-weight-h3'],
  'plp-product-title-letter-spacing': typography['letter-spacing-title'],
  'plp-product-title-line-height': typography['line-height-title'],
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-secondary'],
  'plp-product-price-spacing': '0 0 0.2em',

  'plp-product-unit-price-font-color': colors['dk-gray'],
  'plp-product-unit-price-font-weight': typography['font-weight-500'],
  'plp-product-unit-price-font-weight-desktop': typography['font-weight-500'],
  'plp-product-unit-price-font-weight-default': typography['font-weight-500'],

  'plp-product-old-price-font-size': '1em',
  'plp-product-old-price-font-color': colors['md-gray-desk'],
  'plp-product-old-price-font-style': 'line-through',
  'plp-product-old-price-font-weight': typography['font-weight-400'],

  'plp-product-now-price-font-size': '1.15em',
  'plp-product-now-price-font-color': colors['now-price-color'],
  'plp-product-now-price-font-weight': typography['font-weight-400'],
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'left',
  'plp-product-swatch-selected-border-color': colors.black,
  'plp-product-swatch-button-image-size': '100%',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-image':
    'url("public/missselfridge/images/carousel-arrow-right.svg")',
  'plp-product-swatch-button-font-color': colors['md-gray'],
  'plp-product-swatch-button-font-size': '0',
  'plp-product-swatch-button-text-decoration': 'underline',
}

const plpProductAttributeBanner = {
  'plp-product-attribute-banner-left-property': '0%', // IE compatible left align, must be modified if width changes
}

const plpProductPromoBanner = {
  'plp-product-promo-banner-align': 'left',
}

module.exports = Object.assign(
  plpProductList,
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpProductAttributeBanner,
  plpProductPromoBanner
)
