const base = require('./ts-base')
const colors = require('./ts-colors')
const typography = require('./ts-typography')

const plpProductList = {
  'plp-product-list-horizontal-padding': '5px',
}

const plpProduct = {
  'plp-product-borders': 'none',
  'plp-product-alignment': 'left',
  'plp-product-margin-bottom': '0',
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-info-padding-horizontal': '0',
  'plp-product-info-padding-top': '10px',
  'plp-product-info-padding-bottom': '0',
  'plp-product-info-padding-bottom-desktop': '0',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-info-order': '2',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '1em',
  'plp-product-title-font-color': colors['dk-gray'],
  'plp-product-title-font-weight': typography['font-weight-700'],
  'plp-product-title-letter-spacing': '0',
  'plp-product-title-font-weight-desktop': typography['font-weight-700'],
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-primary'],
  'plp-product-price-spacing': '0 0 0.2em',
  'plp-product-price-letter-spacing': '0.085em',
  'plp-product-unit-price-font-weight': typography['font-weight-400'],
  'plp-product-unit-price-font-weight-desktop': typography['font-weight-400'],

  'plp-product-unit-price-font-size': '0.9em',
  'plp-product-unit-price-font-color': colors['dk-gray'],

  'plp-product-old-price-font-size': '0.9em',
  'plp-product-old-price-font-color': colors['was-price-black'],
  'plp-product-old-price-font-style': 'line-through',

  'plp-product-now-price-font-size': '0.9em',
  'plp-product-now-price-font-color': colors['now-price-red'],
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'left',
  'plp-product-swatch-button-font-size': 0,
  'plp-product-swatch-button-font-color': colors['dk-gray'],
  'plp-product-swatch-button-image':
    'url("/assets/topshop/images/swatch-arrow.svg")',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
}

const plpQuickview = {
  'quickview-price-font-size': '19px',
}

module.exports = Object.assign(
  plpProductList,
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpQuickview
)
