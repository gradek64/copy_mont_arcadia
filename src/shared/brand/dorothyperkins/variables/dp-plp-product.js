const base = require('./dp-base')
const colors = require('./dp-colors')

const plpProduct = {
  'plp-product-borders': 'none',
  'plp-product-border-top': null,
  'plp-product-alignment': 'left',
  'plp-product-info-padding-horizontal': '.6em',
  'plp-product-info-padding-top': '.7em',
  'plp-product-info-padding-bottom': '10px',
  'plp-product-info-padding-bottom-desktop': '10px',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-name-margin-bottom': '12px',
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-link-padding-top': '1.2em',
  'plp-product-bottom-padding': '0.5em',
  'plp-product-rating-image-margin-top': '15px',
  'plp-product-rating-image-star-size': '10px',
  'plp-product-name-font-weight': '300',
  'plp-product-image-aspect-ratio': '135.9509202454%',
  'plp-product-line-height': '18px',
  'plp-product-swatch-list-margin-top': '15px',
  'plp-product-swatch-list-margin-left': '3px',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '13px',
  'plp-product-title-font-size-desktop': '13px',
  'plp-product-title-font-color': colors['dk-gray'],
  'plp-product-title-font-weight': '600',
  'plp-product-title-font-weight-desktop': '600',
  'plp-product-title-text-transform': 'capitalize',
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-primary'],
  'plp-product-price-spacing': '0',

  'plp-product-unit-price-font-size': '13px',
  'plp-product-unit-price-font-size-desktop': '13px',
  'plp-product-unit-price-font-color': colors['dk-gray'],
  'plp-product-unit-price-font-weight': '300',
  'plp-product-unit-price-font-weight-desktop': '300',

  'plp-product-old-price-font-size': '13px',
  'plp-product-old-price-font-color': colors['lt-md-gray'],
  'plp-product-old-price-font-style': 'line-through',
  'plp-product-old-price-font-weight': 'normal',

  'plp-product-now-price-font-size': '13px',
  'plp-product-now-price-font-color': colors['now-price-red'],
  'plp-product-now-price-font-weight': '300',
  'plp-product-old-price-display': 'inline-block',
  'plp-product-now-price-display': 'inline-block',
  'plp-product-old-price-margin-right-mobile': '5px',
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'flex-start',
  'plp-product-swatch-list-padding': '0',

  'plp-product-swatch-selected-border-color': colors['md-gray'],

  'plp-product-swatch-button-image':
    'url("public/dorothyperkins/images/carousel-arrow-right.svg") ',
  'plp-product-swatch-button-font-color': 'transparent',
  'plp-product-swatch-button-font-size': '0.8125em',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-selected-after-transform': 'scale3d(1.2, 1.2, 1)',
}

const plpQuickview = {
  'quickview-description-display': 'block',
}

module.exports = Object.assign(
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpQuickview
)
