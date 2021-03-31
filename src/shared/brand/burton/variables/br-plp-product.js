const base = require('./br-base')
const colors = require('./br-colors')

const plpProduct = {
  'plp-product-borders': 'none',
  'plp-product-alignment': 'left',
  'plp-product-info-padding-horizontal': '10px',
  'plp-product-info-padding-top': '10px',
  'plp-product-info-padding-bottom': '10px',
  'plp-product-info-padding-bottom-desktop': '5px',
  'plp-product-info-margin-bottom': '30px',
  'plp-product-name-margin-bottom': '6px',
  'plp-product-line-height': '18px',
  'plp-product-name-margin-bottom-desktop': '5px',
  'plp-product-font-size': '0.875em',
  'plp-product-font-size-col-1': '1em',
  'plp-product-image-aspect-ratio': '133.3018867925%',
  'plp-product-rating-image-star-size': '10px',
  'plp-product-rating-image-margin-top': '15px',
  'plp-product-swatch-list-margin-top': '15px',
  'plp-product-swatch-list-margin-left': '3px',
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': null,
  'plp-product-title-font-color': colors['dk-gray'],
  'plp-product-title-font-weight': 'normal',
  'plp-product-title-letter-spacing': '0.5px',
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-primary'],

  'plp-product-unit-price-font-size': null,
  'plp-product-unit-price-font-color': colors['dk-gray'],

  'plp-product-old-price-font-size': '0.75em',
  'plp-product-unit-price-font-size-desktop': '13px',
  'plp-product-old-price-font-color': colors['lt-md-gray'],
  'plp-product-unit-price-font-weight': '300',
  'plp-product-unit-price-font-weight-desktop': '300',
  'plp-product-old-price-font-style': 'line-through',

  'plp-product-now-price-font-size': '13px',
  'plp-product-now-price-font-color': colors['now-price-red'],
  'plp-product-old-price-display': 'inline-block',
  'plp-product-now-price-display': 'inline-block',
  'plp-product-old-price-margin-right-mobile': '5px',
  'plp-product-price-spacing': '0',
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'flex-start',
  'plp-product-swatch-list-padding': '0',
  'plp-product-swatch-button-font-color': colors['dk-gray'],
  'plp-product-swatch-button-font-size': 0,
  'plp-product-swatch-button-text-transform': 'uppercase',
  'plp-product-swatch-button-text-decoration': 'underline',
  'plp-product-swatch-button-image':
    'url("public/burton/images/nav-arrow.svg") ',
  'plp-product-swatch-button-prev-transform': 'rotate(180deg)',
  'plp-product-swatch-button-image-size': '50%',
  'plp-product-swatch-button-image-size-tablet': '38%',
  'plp-product-swatch-button-selected-after-transform': 'scale3d(1.2, 1.2, 1)',
}

module.exports = Object.assign(
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches
)
