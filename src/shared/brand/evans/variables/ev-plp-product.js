const base = require('./ev-base')
const colors = require('./ev-colors')
const typography = require('./ev-typography')

const plpProduct = {
  'plp-product-borders': 'none',
  'plp-product-alignment': 'left',
  'plp-product-info-padding-left-desktop': '0',
  'plp-product-info-padding-bottom-desktop': '0',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-line-height': typography['line-height-name'],
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-image-aspect-ratio': '135.9433962264%',
  'plp-product-quick-view-opacity': '1',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': typography['font-size-label'],
  'plp-product-title-font-size-desktop': typography['font-size-label'],
  'plp-product-title-font-color': colors.black,
  'plp-product-title-font-color-desktop': colors.black,
  'plp-product-title-font-weight': typography['font-weight-normal'],
  'plp-product-title-font-weight-desktop': typography['font-weight-normal'],
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-primary'],
  'plp-product-price-spacing': '0',

  'plp-product-unit-price-font-size': typography['font-size-label'],
  'plp-product-unit-price-font-size-desktop': typography['font-size-label'],
  'plp-product-unit-price-font-color': colors['md-dk-gray'],
  'plp-product-unit-price-font-color-desktop': colors['desk-black'],
  'plp-product-unit-price-font-weight': typography['font-weight-normal'],
  'plp-product-unit-price-font-weight-desktop':
    typography['font-weight-normal'],

  'plp-product-old-price-font-size': typography['font-size-info'],
  'plp-product-old-price-font-color': colors['md-dk-gray'],

  'plp-product-now-price-font-size': typography['font-size-info'],
  'plp-product-now-price-font-size-desktop': '13px',
  'plp-product-now-price-font-color': colors['now-price-red'],
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'left',
  'plp-product-swatch-selected-border-color': colors['lt-gray'],
  'plp-product-swatch-button-font-color': colors.black,
  'plp-product-swatch-button-font-size': 0,
  'plp-product-swatch-button-image':
    'url("public/evans/images/nav-arrow.svg") ',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-after-border': '1px solid rgba(0, 0, 0, 0.2)',
  'plp-product-swatch-button-after-transform': 'none',
  'plp-product-swatch-button-selected-after-border': '0px',
  'plp-product-swatch-button-selected-after-border-bottom': '1px solid #000',
  'plp-product-swatch-button-selected-after-transition': 'none',
  'plp-product-swatch-button-selected-after-transform': 'none',
  'plp-product-swatch-button-selected-after-top': '6px;',
}

const plpProductAttributeBanner = {
  'plp-product-attribute-banner-left-property': '0%', // IE compatible left align, must be modified if width changes
}

const plpProductPromoBanner = {
  'plp-product-promo-banner-align': 'left',
}

module.exports = Object.assign(
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpProductAttributeBanner,
  plpProductPromoBanner
)
