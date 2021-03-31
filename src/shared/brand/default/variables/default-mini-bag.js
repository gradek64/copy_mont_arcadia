const colors = require('./default-colors')

const miniBagGeneral = {
  'mini-bag-background-color': colors.white,
  'mini-bag-border-color': colors['lt-gray'],
  'mini-bag-border-width': '1px',
  'mini-bag-shadow-color': colors.black,
  'mini-bag-shadow-strength': '25px',
  'mini-bag-padding': '5px',
  'mini-bag-row-margin': '0',
  'mini-bag-width-min-tablet': '420px',
  'mini-bag-margin-top': '185px',
  'mini-bag-padding-right': '0',
}

const miniBagHeader = {
  'mini-bag-header-color': colors['dk-gray'],
  'mini-bag-header-text-size': '18px',
  'mini-bag-header-text-weight': 'normal',
  'mini-bag-header-text-style': null,
  'mini-bag-header-font-family': null,
  'mini-bag-header-letter-spacing': null,
  'mini-bag-header-background-color': colors['lt-gray'],
  'mini-bag-header-border-color': colors['md-gray'],
  'mini-bag-header-border-width': '1px',
}

const miniBagContent = {
  'mini-bag-content-font-color': null,
  'mini-bag-content-name-color': null,
  'mini-bag-content-font-family': null,
  'mini-bag-content-font-weight': null,
  'mini-bag-content-letter-spacing': null,
  'mini-bag-content-price-text-align': 'left',
  'mini-bag-content-price-font-size': null,
  'mini-bag-content-price-font-family': null,
  'mini-bag-content-price-font-weight': null,
  'mini-bag-content-price-text-color': null,
  'mini-bag-content-subtotal-font-weight': null,
  'mini-bag-content-subtotal-margin-top': null,
  'mini-bag-content-edit-font-weight': 'normal',
  'mini-bag-content-edit-color': colors['dk-gray'],
  'mini-bag-content-edit-padding-top': '8px',
  'mini-bag-content-edit-position': 'absolute',
  'mini-bag-content-edit-right': '1px',
  'mini-bag-content-edit-top': '67px',
  'mini-bag-content-delete-size': '25px',
  'mini-bag-content-delete-label-shown': 'none',
  'mini-bag-content-delete-icon-shown': null,
  'mini-bag-content-border-color': null,
  'mini-bag-content-low-stock-font-color': null,
  'mini-bag-content-low-stock-margin-top': '22px',
  'mini-bag-content-out-of-stock-font-color': null,
  'mini-bag-content-name-font-size': null,
  'mini-bag-content-name-font-weight': 'bold',
  'mini-bag-content-name-font-family': null,
  'mini-bag-content-name-margin-bottom': '10px',
  'mini-bag-content-name-text-transform': null,
  'mini-bag-content-name-letter-spacing': null,
  'mini-bag-content-font-size': null,
  'mini-bag-label-margin-right': 'auto',
  'mini-bag-info-line-height': null,
  'mini-bag-empty-font-family': null,
  'mini-bag-empty-font-size': null,
  'mini-bag-empty-font-weight': null,
  'mini-bag-empty-text-align': null,
  'mini-bag-empty-margin': null,
  'mini-bag-discount-color': colors.colorDiscount,
  'mini-bag-product-label-font-weight': null,
  'mini-bag-product-label-font-size': null,
  'mini-bag-product-total-font-size': null,
  'mini-bag-content-success-color': colors.colorSuccess,
  'mini-bag-content-error-icon': '20px',
}

const miniBagCol = {
  'mini-left-col-color': null,
}

const miniBagPromoCode = {
  'mini-bag-accordion-background-color': null,

  'mini-bag-promocode-added-background-color': colors['promocode-color'],
  'mini-bag-promocode-added-border': null,
  'mini-bag-promocode-added-text-color': colors.white,
  'mini-bag-promocode-added-font-weight': null,
  'mini-bag-promocode-added-padding': '10px',
  'mini-bag-promocode-confirmed-text-color': colors.black,
  'mini-bag-promocode-confirmed-font-weight': 'bold',
  'mini-bag-promocode-link-font-style': null,
  'mini-bag-promocode-link-text-color': null,
  'mini-bag-promocode-link-text-size': null,
  'mini-bag-promocode-link-text-weight': null,
  'mini-bag-promocode-link-line-height': null,
  'mini-bag-promocode-link-letter-spacing': null,
}

const miniBagSummary = {
  'mini-bag-summary-font-size': null,
  'mini-bag-summary-padding': '10px',
  'mini-bag-summary-row-margin-bottom': null,
  'mini-bag-summary-shadow-color': colors.black,
  'mini-bag-summary-shadow-strength': '25px',
  'mini-bag-summary-border-top': null,
  'mini-bag-summary-font-color': null,
  'mini-bag-summary-font-weight': null,
  'mini-bag-total-text-weight': 'bold',
  'mini-bag-sub-total-color': null,
  'mini-bag-total-color': null,
  'mini-bag-delivery-text-weight': 'normal',
  'mini-bag-summary-button-background': null,
  'mini-bag-summary-button-border-color': null,
  'mini-bag-summary-button-hover-background': null,
  'mini-bag-summary-button-hover-font-color': null,
  'mini-bag-summary-total-margin-top': null,
}

const miniBagLockImage = {
  'mini-bag-lockimage-background': 'url("/assets/common/images/icon-lock.png")',
  'mini-bag-lockimage-size': '18px 22px',
  'mini-bag-lockimage-no-repeat': 'no-repeat',
  'mini-bag-lockimage-position': '100% 40%',
  'mini-bag-lockimage-position-mobile': '95% 40%',
}

module.exports = Object.assign(
  miniBagGeneral,
  miniBagHeader,
  miniBagContent,
  miniBagCol,
  miniBagPromoCode,
  miniBagSummary,
  miniBagLockImage
)
