const base = require('./default-base')
const colors = require('./default-colors')

const plpProductList = {
  'plp-product-list-horizontal-padding': '5px',
}

const plpProduct = {
  'plp-product-gutter': '0',
  'plp-product-horizontal-padding': '5px',
  'plp-product-top-padding': '0',
  'plp-product-bottom-padding': '5px',
  'plp-product-borders': `1px solid ${colors['lt-gray']}`,
  'plp-product-alignment': 'center',
  'plp-product-margin-bottom': '0',
  'plp-product-line-height': '14px',
  'plp-product-info-padding-horizontal': '1em',
  'plp-product-info-padding-top': '1em',
  'plp-product-info-padding-bottom': '1em',
  'plp-product-info-padding-bottom-desktop': '1em',
  'plp-product-info-padding-left-desktop': null,
  'plp-product-info-margin-bottom': null,
  'plp-product-info-margin-bottom-desktop': '50px',
  'plp-product-quick-view-opacity': '0.7',
  'plp-product-quick-view-opacity-hover': '1',
  'plp-product-name-margin-bottom': '10px',
  'plp-product-name-margin-bottom-desktop': '10px',
  'plp-product-link-padding-top': '10px',
  'plp-product-rating-image-margin-top': '10px',
  'plp-product-rating-image-star-size': '16px',
  'plp-product-font-size': null,
  'plp-product-font-size-col-1': null,
  'plp-product-quick-view-size': '22px',
  'plp-product-title-margin-right': '26px',
  'plp-product-info-order': '3',
  'plp-product-name-font-weight': null,
  'plp-product-image-aspect-ratio': '150%',
  'plp-product-swatch-list-margin-top': null,
  'plp-product-swatch-list-margin-left': null,
}

const plpProductTitle = {
  'plp-product-title-font': base['font-family-primary'],
  'plp-product-title-font-size': '1em',
  'plp-product-title-font-size-desktop': null,
  'plp-product-title-font-color': colors['dk-gray'],
  'plp-product-title-font-weight': 'bold',
  'plp-product-title-font-weight-desktop': 'bold',
  'plp-product-title-letter-spacing': '0',
  'plp-product-title-text-transform': null,
  'plp-product-title-line-height': null,
}

const plpProductAttributeBanner = {
  'plp-product-attribute-banner-bottom': '3%',
  'plp-product-attribute-banner-width': '60%',
  'plp-product-attribute-banner-mobile-width': '100%',
  'plp-product-attribute-banner-left-property': '20%', // IE compatible centre align, must be modified if width changes - (100% - plp-product-attribute-banner-width) / 2
  'plp-product-attribute-banner-mobile-left-property': '0%', // (100% - plp-product-attribute-banner-mobile-width) / 2
}

const plpProductPromoBanner = {
  'plp-product-promo-banner-align': 'center',
  'plp-product-promo-banner-margin-top': '0.5em',
  'plp-product-promo-banner-width': '60%',
  'plp-product-promo-banner-mobile-width': '100%',
}

const plpProductPrice = {
  'plp-product-price-font': base['font-family-secondary'],
  'plp-product-price-spacing': '0 0 0.5em',
  'plp-product-price-letter-spacing': null,

  'plp-product-unit-price-font-size': '1em',
  'plp-product-unit-price-font-size-desktop': '1em',
  'plp-product-unit-price-font-color': colors['dk-gray'],
  'plp-product-unit-price-font-weight': 'normal',
  'plp-product-unit-price-font-weight-desktop': 'normal',
  'plp-product-unit-price-font-weight-default': 'inherit',

  'plp-product-old-price-font-size':
    '0.85em' /* relative to unit price font size */,
  'plp-product-old-price-font-color': colors['md-gray'],
  'plp-product-old-price-font-style': 'none',
  'plp-product-old-price-font-weight': 'normal',
  'plp-product-old-price-display': 'block',

  'plp-product-now-price-font-size':
    '1em' /* relative to unit price font size */,
  'plp-product-now-price-font-size-desktop':
    '1em' /* relative to unit price font size */,
  'plp-product-now-price-font-color': colors['dk-gray'],
  'plp-product-now-price-font-weight': 'normal',
  'plp-product-now-price-display': 'block',
  'plp-product-old-price-margin-right-mobile': '0',
}

const plpProductSwatches = {
  'plp-product-swatch-list-justify': 'center',
  'plp-product-swatch-list-padding': '10px 0',
  'plp-product-swatch-radius': '0',
  'plp-product-swatch-border-color': colors['md-gray'],
  'plp-product-swatch-selected-border-color': colors['dk-gray'],
  'plp-product-swatch-button-font-color': colors.black,
  'plp-product-swatch-button-font-size': '0.9em',
  'plp-product-swatch-button-text-transform': 'none',
  'plp-product-swatch-button-text-decoration': 'none',
  'plp-product-swatch-button-image-size': 'contain',
  'plp-product-swatch-button-image-size-tablet': null,
  'plp-product-swatch-button-image': 'none',
  'plp-product-swatch-button-next-margin': '0',
  'plp-product-swatch-button-prev-margin': '0',
  'plp-product-swatch-button-prev-transform': null,
  'plp-product-swatch-button-after-border': 'solid 1px rgba(0, 0, 0, 0.2)',
  'plp-product-swatch-button-after-transform': 'scale3d(1.05, 1.05, 1)',
  'plp-product-swatch-button-selected-after-border':
    'solid 1px rgba(0, 0, 0, 1)',
  'plp-product-swatch-button-selected-after-border-bottom': null,
  'plp-product-swatch-button-selected-after-transition': 'all 0.2s ease-out',
  'plp-product-swatch-button-selected-after-transform':
    'scale3d(1.05, 1.05, 1)',
  'plp-product-swatch-button-selected-after-top': '0px',
}

const plpQuickview = {
  'quickview-description-display': 'none',
  'quickview-link-text-transform': 'uppercase',
  'quickview-price-font-size': null,
}

module.exports = Object.assign(
  plpProductList,
  plpProduct,
  plpProductTitle,
  plpProductPrice,
  plpProductSwatches,
  plpProductAttributeBanner,
  plpProductPromoBanner,
  plpQuickview
)
