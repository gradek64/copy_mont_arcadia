const base = require('./tm-base')
const colors = require('./tm-colors')
const typography = require('./tm-typography')

const plpProductList = {
  'plp-product-list-horizontal-padding': '15px',
}

const plpProduct = {
  'plp-product-gutter': '10px',
  'plp-product-borders': 'none',
  'plp-product-alignment': 'left',
  'plp-product-info-padding-horizontal': '0',
  'plp-product-info-padding-top': '1em',
  'plp-product-info-padding-bottom': '1em',
  'plp-product-info-padding-bottom-desktop': '0',
  'plp-product-name-margin-bottom': null,
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-name-font-weight': typography['font-weight-400'],
  'plp-product-image-aspect-ratio': '135.75471698%',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '1em',
  'plp-product-title-font-color': colors.black,
  'plp-product-title-font-weight': typography['font-weight-700'],
  'plp-product-title-font-weight-desktop': typography['font-weight-700'],
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-primary'],
  'plp-product-price-spacing': '0',

  'plp-product-unit-price-font-size': '1.143em',
  'plp-product-unit-price-font-color': colors.black,

  'plp-product-old-price-font-size': '1em',
  'plp-product-old-price-font-color': colors.black,
  'plp-product-old-price-font-style': 'line-through',

  'plp-product-now-price-font-size': '1em',
  'plp-product-now-price-font-color': colors['now-price-red'],

  'plp-product-unit-price-font-weight': typography['font-weight-400'],
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'left',
  'plp-product-swatch-button-font-size': 0,
  'plp-product-swatch-button-image':
    'url("/assets/topman/images/nav-arrow.svg") ',
  'plp-product-swatch-button-prev-margin': '2px 0 0 0',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-image-size': '50%',
  'plp-product-swatch-button-image-size-tablet': '38%',
}

const plpQuickview = {
  'quickview-price-font-size': '16px',
}

module.exports = Object.assign(
  plpProductList,
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpQuickview
)
