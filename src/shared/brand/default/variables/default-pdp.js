const colors = require('./default-colors')

const pdpGeneral = {
  'pdp-vertical-padding': '10px',
}

const pdpTitle = {
  'pdp-product-title-font-color': null,
  'pdp-product-title-font-size': '1.35em',
  'pdp-product-title-font-weight': null,
  'pdp-product-title-text-decoration': null,
  'pdp-product-title-margin-bottom': null,
  'pdp-product-title-font-size-tablet': null,
  'pdp-product-title-line-height-tablet': '1',
  'pdp-product-title-font-size-laptop': null,
  'pdp-product-title-line-height-laptop': '1',
  'pdp-letter-spacing': null,
  'pdp-font-style': null,
}

const pdpPrices = {
  'pdp-product-price-label': 'inline',
  'pdp-product-price-spacing': '0 0 0.5em',
  'pdp-product-unit-price-font-size': '1.1em',
  'pdp-product-unit-price-font-weight': 'normal',
  'pdp-product-old-price-display': null,
  'pdp-product-old-price-font-size': '0.9em',
  'pdp-product-old-price-font-weight': 'normal',
  'pdp-product-old-margin-right': '0.1em',
  'pdp-product-now-price-display': null,
  'pdp-product-now-price-font-size': null,
  'pdp-product-now-price-font-weight': null,
  'pdp-product-price-label-size': null,
}

const pdpProductSizes = {
  'pdp-product-size-title-align': 'center',
  'pdp-product-size-title-margin-bottom': '20px',
  'pdp-product-size-title-margin-top': 0,
  'pdp-product-size-title-font-weight': 'normal',
  'pdp-product-size-title-font-size': 'inherit',
  'pdp-product-size-title-text-transform': 'uppercase',
  'pdp-product-size-title-content-after': '',
  'pdp-product-size-title-color': null,
  'pdp-product-size-title-onesize-display': null,
  'pdp-product-size-title-display': null,
  'pdp-product-size-item-font-size': '0.8em',
  'pdp-product-size-margin-offset': '0',
  'pdp-product-size-vertical-margin': '22px',
  'pdp-product-size-horizontal-padding': '0',
  'pdp-product-size-gutter': '10%',
  'pdp-product-size-height': '50px',
  'pdp-product-size-max-height': null,
  'pdp-product-size-border-color': colors['md-dk-gray'],
  'pdp-product-size-border-width': '1px',
  'pdp-product-size-hover-border-color': null,
  'pdp-product-size-hover-border-width': '0',
  'pdp-product-size-background-color': null,
  'pdp-product-size-color': null,
  'pdp-product-size-font-family': null,
  'pdp-product-size-font-weight': null,
  'pdp-product-size-letter-spacing': null,
  'pdp-product-size-list-margin-bottom': '1em',
  'pdp-product-size-list-margin-bottom-tablet': null,
  'pdp-product-size-square-display': 'none', // set to 'block' for squares
  'pdp-product-size-sizes-margin-bottom': '20px',

  // Set this to '' if blocks should resize when N is less than cycle length
  'pdp-product-size-resize2': '',
  'pdp-product-size-resize3': '',
  'pdp-product-size-resize4': null,
  'pdp-product-size-resize5': null,
  'pdp-product-size-resize6': null,
  'pdp-product-size-resize7': null,

  // special sizes for one column
  'pdp-product-size1-width': '100%',
  'pdp-product-size1-align': null,

  'pdp-product-size-active-border-color': colors.black,
  'pdp-product-size-active-border-width': '2px',
  'pdp-product-size-active-font-weight': 'normal',
  'pdp-product-size-active-background-color': null,
  'pdp-product-size-active-color': null,
  'pdp-product-size-active-outline-width': null,
  'pdp-product-size-active-outline-color': null,

  'pdp-product-size-item-width': '1/4',
  'pdp-product-size-item-cycle': '4n',
  'pdp-product-size-oos-opacity': '0.3',
  'pdp-product-size-oos-background': null,
  'pdp-product-size-oos-slash': 'none',
  'pdp-product-size-oos-margin-offset': '-50%',
  'pdp-product-size-oos-rotation': '45deg',
  'pdp-product-size-oos-text-size-colour': null,
}

const pdpQuantity = {
  'pdp-product-quantity-margin-bottom-desktop': 0,
  'pdp-product-quantity-margin-bottom': 0,
  'pdp-product-quantity-label-text-transform': null,
  'pdp-product-quantity-label-after-content': null,
  'pdp-product-quantity-select-dropdown-ie-font-weight': null,
}

const pdpLowStockBanner = {
  'pdp-product-low-stock-banner-animation':
    'opacity 0.5s cubic-bezier(.25,.1,.25,1) 0.1s',
  'pdp-product-low-stock-banner-animation-out':
    'opacity 0.2s cubic-bezier(.25,.1,.25,1)',
  'pdp-product-low-stock-banner-container-animation':
    'height 0.5s cubic-bezier(.25,.1,.25,1)',
  'pdp-product-low-stock-banner-container-animation-out':
    'height 0.3s cubic-bezier(.25,.1,.25,1)',
  'pdp-product-low-stock-banner-text-color': '#f35f51',
  'pdp-product-low-stock-banner-padding': '0',
  'pdp-product-low-stock-banner-font-weight': 'normal',
  'pdp-product-low-stock-banner-border': '0',
  'pdp-product-low-stock-banner-bg-color': 'transparent',
  'pdp-product-low-stock-banner-font-size': '14px',
  'pdp-product-low-stock-banner-line-height': 'inherit',
  'pdp-product-low-stock-banner-flex': '1',
  'pdp-product-low-stock-banner-margin-bottom': '0',
  'pdp-product-low-stock-banner-min-height': '0',
  'pdp-product-low-stock-banner-container-order': '0',
  'pdp-product-low-stock-banner-margin-top': '20px',
  'pdp-product-low-stock-banner-margin-top-mobile': '20px',
  'pdp-product-low-stock-banner-container-width': '100%',
  'pdp-product-low-stock-banner-container-width-mobile': '100%',
}

const pdpSwatches = {
  'pdp-product-swatch-size': null,
  'pdp-product-swatch-link-border-radius': null,
  'pdp-product-swatch-link-border-color': null,
  'pdp-product-swatch-link-border-width': null,
  'pdp-product-swatch-link-selected-border-color': null,
  'pdp-product-swatch-selected-border-color': null,
  'pdp-product-swatch-border-radius': null,
  'pdp-product-swatch-border-width': null,
  'pdp-swatch-underline-mode': 'none',
  'pdp-product-swatch-list-padding': null,
  'pdp-product-swatch-margin-bottom': '20px',
  'pdp-product-swatch-row-margin-bottom': '15px',
}

const pdpSizeGuide = {
  'pdp-size-guide-block-bottom': '20px',
  'pdp-size-guide-position': null,
  'pdp-size-guide-offset-top': '0',
  'pdp-size-guide-offset-bottom': null,
  'pdp-size-guide-offset-left': null,
  'pdp-size-guide-offset-right': '0',
  'pdp-size-guide-color': null,
  'pdp-size-guide-font-size': '1em',
  'pdp-size-guide-font-weight': 'normal',
  'pdp-size-guide-font-family': null,
  'pdp-size-guide-letter-spacing': null,
  'pdp-size-guide-text-transform': 'capitalize',

  'pdp-size-guide-icon-display': 'inline-block',
  'pdp-size-guide-icon-height': '1em',
  'pdp-size-guide-icon-margin-right': '0.5em',

  'pdp-size-guide-border-color': null,
  'pdp-size-guide-border-width': null,
  'pdp-size-guide-margin-top-pdp': '20px',
  'pdp-size-guide-margin-top-pdp-mobile': '20px',
}

const pdpRating = {
  'pdp-product-rating-align': null,
  'pdp-product-rating-display': 'none',
  'pdp-product-rating-vertical-margin': null,
}

const pdpDetail = {
  'pdp-product-detail-font-family': null,
  'pdp-product-swatch-margin': '3px',
  'pdp-product-detail-line-height': '1.8em',
  'pdp-product-detail-content-line-height': null,
  'pdp-product-detail-title-font-size': null,
  'pdp-product-detail-title-font-weight': null,
  'pdp-product-detail-title-letter-spacing': null,
  'pdp-product-detail-font-size': null,
  'pdp-product-detail-font-weight': null,
  'pdp-product-detail-secondary-button-group-margin-top': '20px',
  'pdp-product-detail-max-width': '700px',
}

const bundlesDetail = {}

const pdpDescription = {
  'pdp-product-detail-sub-title': null,
}

const pdpProductDescriptionDetails = {
  'pdp-product-description-details-text-align': 'left',
}

const pdpRecommendations = {
  'pdp-recommendations-title-border': `1px solid ${colors['md-gray']}`,
  'pdp-recommendations-title-font-size': null,
  'pdp-recommendations-title-padding': '10px',
  'pdp-recommendations-title-text-align': 'center',
  'pdp-recommendations-name-margin': null,
  'pdp-recommendations-rating-margin-top': '10px',
  'pdp-recommendations-rating-display': 'block',
  'pdp-recommendations-title-text-decoration': null,
  'pdp-recommendations-title-font-weight': null,
  'pdp-recommendations-title-text-transform': null,
  'pdp-recommendations-padding': '30px 0 10px',
  'pdp-recommendations-product-text-align': 'center',
  'pdp-recommendations-name-font-size': '0.9em',
}

const pdpRecentlyViewed = {
  'pdp-recently-viewed-title-border': 'none',
  'pdp-recently-viewed-title-font-size': null,
  'pdp-recently-viewed-title-padding': '10px',
  'pdp-recently-viewed-title-text-align': 'center',
  'pdp-recently-viewed-title-text-decoration': null,
  'pdp-recently-viewed-title-font-weight': null,
  'pdp-recently-viewed-title-text-transform': null,
  'pdp-recently-viewed-padding': '30px 0 10px',
}

const pdpPriceWrapper = {
  'pdp-price-font-size': null,
  'pdp-price-font-weight': null,
}

const pdpAccordion = {
  'accordion-delivery-info-margin-top': '20px',
  'accordion-header-padding-top': '10px',
  'accordion-header-padding-bottom': '10px',
  'accordion-header-is-padded-padding-top': '15px',
  'accordion-header-is-padded-padding-bottom': '15px',
}

module.exports = Object.assign(
  pdpGeneral,
  pdpTitle,
  pdpPrices,
  pdpProductSizes,
  pdpQuantity,
  pdpSwatches,
  pdpSizeGuide,
  pdpLowStockBanner,
  pdpRating,
  pdpDetail,
  bundlesDetail,
  pdpDescription,
  pdpProductDescriptionDetails,
  pdpRecommendations,
  pdpRecentlyViewed,
  pdpPriceWrapper,
  pdpAccordion
)
