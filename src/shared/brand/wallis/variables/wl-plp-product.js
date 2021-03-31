const base = require('./wl-base')
const colors = require('./wl-colors')

const plpProductList = {
  'plp-product-list-horizontal-padding': '0',
}

const plpProduct = {
  'plp-product-gutter': '10px',
  'plp-product-horizontal-padding': '0',
  'plp-product-top-padding': '0',
  'plp-product-borders': 'none',
  'plp-product-alignment': 'center',
  'plp-product-info-padding-horizontal': '5px',
  'plp-product-info-padding-top': '.5em',
  'plp-product-info-padding-bottom': '.5em',
  'plp-product-info-padding-bottom-desktop': '0',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-title-font-size-desktop': null,
  'plp-product-line-height': '15px',
  'plp-product-name-margin-bottom-desktop': '5px',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '1.375em',
  'plp-product-title-font-size-desktop': '16px',
  'plp-product-title-font-color': colors.black,
  'plp-product-title-font-weight': '300',
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-secondary'],
  'plp-product-price-display': 'inline-block',
  'plp-product-price-spacing': '0 0.5em',

  'plp-product-unit-price-font-size': '1em',
  'plp-product-unit-price-font-color': colors.black,
  'plp-product-unit-price-font-weight': '300',

  'plp-product-old-price-font-size': '1em',
  'plp-product-old-price-font-color': colors.black,
  'plp-product-old-price-font-style': 'none',
  'plp-product-old-price-font-weight': '300',

  'plp-product-now-price-font-size': '1em',
  'plp-product-now-price-font-color': colors.terracotta,
  'plp-product-now-price-font-weight': '300',
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'center',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-font-color': colors['dk-gray'],
  'plp-product-swatch-button-font-size': 0,
  'plp-product-swatch-button-image':
    'url("/assets/topshop/images/swatch-arrow.svg")',
  'plp-product-swatch-button-after-border': '1px solid rgba(0, 0, 0, 0.2)',
  'plp-product-swatch-button-after-transform': 'none',
  'plp-product-swatch-button-selected-after-border': 0,
  'plp-product-swatch-button-selected-after-border-bottom': '1px solid #000',
  'plp-product-swatch-button-selected-after-transition': 'none',
  'plp-product-swatch-button-selected-after-transform': 'none',
  'plp-product-swatch-button-selected-after-top': '6px;',
}

const plpQuickview = {
  'quickview-link-text-transform': 'capitalize',
}

module.exports = Object.assign(
  plpProductList,
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpQuickview
)
