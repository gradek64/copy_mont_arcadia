const colors = require('./default-colors')
const typography = require('./default-typography')

const general = {
  'checkout-elements-margin-top': '10px',
  'checkout-elements-margin-bottom': '30px',
  'checkout-divider-width': '1px',
  'checkout-divider-color': colors['lt-gray'],
  'checkout-separator-height': '20px',
  'checkout-content-padding': '5px',
  'checkout-separator-border': '1px solid #e1e1e1',
  'checkout-first-child-padding': '30px 0 20px',

  'checkout-continue-shopping-margin-top': '8px',
  'checkout-continue-shopping-margin-right': null,
  'checkout-continue-shopping-margin-top-min-tablet': null,
  'checkout-continue-shopping-margin-top-min-laptop': null,

  'checkout-continue-shopping-button-max-height': '25px',

  'checkout-container-margin-vertical': '10px',
  'checkout-container-margin-horizontal': '20px',
  'checkout-delivery-option-icon-width': '40px',
  'checkout-delivery-title-font-weight': 'normal',
  'checkout-delivery-title-font-size': '0.95em',
  'checkout-delivery-option-font-weight': null,

  'checkout-accordion-status-text-font-size': '12px',
  'checkout-accordion-status-text-letter-spacing': '1.5px',
  'checkout-accordion-status-text-padding': '4px',
  'checkout-accordion-status-text-border-color': '#363636',
}

const header = {
  'checkout-header-': '',
  'checkout-header-position': 'relative',
  'checkout-header-width': '100%',
  'checkout-header-height': '44px',
  'checkout-header-z-index': 2,
  'checkout-header-background-color': colors.white,
  'checkout-header-border-bottom': `1px solid ${colors['md-gray']}`,
  'checkout-header-button-container-padding': '0 14px 0 0',
  'checkout-header-image-container-padding': '0',
  'checkout-header-image-container-border-bottom': 'none',
  'checkout-header-title-copy-font-size': '22px',
  'checkout-header-title-copy-line-height': '33px',
  'checkout-header-title-copy-font-weight': 500,
  'checkout-header-tablet-margin': '34px auto 28px auto',
  'checkout-header-tablet-border': 'none',
  'checkout-header-tablet-title-container-margin': '0 0 0 5px',
  'checkout-header-tablet-button-container-position': 'relative',
  'checkout-header-tablet-button-container-margin': '0 0 12px 5px',
  'checkout-header-mobile-brand-logo-width': null,
  'checkout-header-mobile-brand-logo-max-width': '100%',
  'checkout-header-mobile-brand-logo-margin': '0',
  'checkout-header-mobile-brand-logo-img-height': '100%',
  'checkout-header-mobile-brand-logo-img-width': '100%',
  'checkout-header-mobile-brand-logo-img-max-width': '180px',
}

const delivery = {
  'checkout-delivery-padding-vertical-min-tablet': '10px',
  'checkout-delivery-margin-top': '10px',
  'checkout-delivery-icon-display': null,
  'checkout-delivery-change-font-weight': 'bold',
}

const deliveryInstructions = {
  'checkout-delivery-instructions-divider-color': colors['md-gray'],
  'checkout-delivery-instructions-margin-vertical': '10px',
  'checkout-delivery-instructions-chars-margin-top': '-15px',
  'checkout-delivery-instructions-chars-text-align': 'right',
  'checkout-delivery-instructions-chars-font-size': '0.8em',
  'checkout-delivery-instructions-chars-font-weight': '300',
  'checkout-delivery-instructions-description': null,
  'checkout-address-detail-line-height': typography['line-height-p'],
}

const DeliveryType = {
  'checkout-delivery-type-description-font-size': '0.8em',
  'checkout-delivery-type-description-font-weight': null,
  'checkout-delivery-type-title-font-size': null,
  'checkout-delivery-type-title-font-weight': null,
  'checkout-delivery-type-title-line-height': '24px',
  'checkout-delivery-type-title-margin-bottom': '5px',
  'checkout-delivery-type-accordion-background': colors.white,
  'checkout-delivery-type-accordion-header-margin-left': '-15px',
  'checkout-delivery-type-accordion-margin-bottom': '30px',
  'delivery-type-statusIndicatorText-font-size': '12px',
  'delivery-type-statusIndicatorText-letter-spacing': '1.5px',
  'delivery-type-statusIndicatorText-border-bottom': '1px solid #363636',
  'delivery-type-statusIndicatorText-padding-bottom': '4px',
  'delivery-type-statusIndicatorText-height': '23px',
}

const deliveryMethod = {
  'checkout-delivery-method-description-font-size': '12px',
  'checkout-delivery-method-price-font-weight': 'lighter',
  'checkout-delivery-method-button-selected-color': colors.black,
  'checkout-delivery-method-tile-border': '1px solid #DDDDDD',
  'checkout-delivery-method-tile-min-height': '75px',
  'checkout-delivery-method-tile-margin-bottom': '15px',
  'checkout-delivery-method-tile-text-align': 'left',
  'checkout-delivery-method-tile-price-align': 'right',
  'checkout-delivery-method-tile-width': '100%',
  'checkout-delivery-method-tile-padding': '15px',
  'checkout-delivery-method-selected-tile-border': '2px solid black',
  'checkout-delivery-method-selected-tile-background': 'white',
  'checkout-delivery-method-tile-isExpanded-padding': '20px 0 30px',
  'checkout-delivery-method-tile-label-text-margin': '7px',
  'checkout-delivery-method-tile-title-font-size': '16px',
}

const cardDetails = {
  'checkout-card-margin-top': '10px',
  'checkout-card-title-font-size': '15px',
  'checkout-card-description-font-size': '13px',
  'checkout-card-number-font-weight': null,
}

const payments = {
  'checkout-payments-padding-vertical': '10px',
  'checkout-payments-icon-height': '20px',
  'checkout-payments-change-link-font-size': '0.8em',
  'checkout-payments-change-link-font-weight': null,

  'checkout-payments-title-margin': '10px 0 0',
  'checkout-payments-tile-selected-border': '2px solid black',
  'checkout-payment-subheader-font-size': '16px',

  'checkout-description-padding': '10px',
  'checkout-address-preview-header-font-weight': 100,
}

const summary = {
  'checkout-summary-account-title-margin': '10px 0 -20px',
}

const totals = {
  'checkout-totals-padding-vertical': '10px',
  'checkout-totals-subtotal-display': 'none',
  'checkout-totals-delivery-font-weight': null,
  'checkout-totals-parenthesis-font-weight': null,
  'checkout-totals-total-font-weight': 'bold',
  'checkout-totals-total-font-size': null,
  'checkout-totals-background-color': colors['ex-lt-gray'],
}

const error = {
  'checkout-error-session-image-size': '40px',
}

const checkoutBagSide = {
  'checkout-bag-side-title-margin-horizontal': '30px',
  'checkout-bag-side-title-margin-vertical': '0',
  'checkout-bag-side-title-padding-horizontal': '0',
  'checkout-bag-side-title-padding-vertical': '15px',

  'checkout-bag-side-margin-horizontal': null,
  'checkout-bag-side-margin-vertical': null,
  'checkout-bag-side-padding-horizontal': '30px',
  'checkout-bag-side-padding-vertical': '15px',

  'checkout-bag-side-background-color': null,

  'checkout-bag-side-title-font-size': null,
  'checkout-bag-side-title-font-weight': '500',

  'checkout-bag-side-delivery-icon-width': '35px',

  'checkout-bag-side-total-font-size': '16px',
  'checkout-bag-side-total-font-weight': '500',

  'checkout-bag-side-border-color': colors['md-gray'],

  'checkout-bag-side-simple-total-section-padding': '26px 32px',
  'checkout-bag-side-simple-total-background-color': '#F5F5F5',
  'checkout-bag-side-simple-total-border-top': `1px solid ${colors['md-gray']}`,
  'checkout-bag-side-simple-total-border-bottom': `1px solid ${
    colors['md-gray']
  }`,

  'checkout-bag-side-simple-total-section-font-size': null,
}

const termsAndConditions = {
  'checkout-payment-terms-and-conditions-padding': '20px 0',
  'checkout-payment-terms-and-conditions-font-size': '12px',
  'checkout-payment-terms-and-conditions-text-align': 'left',
}

module.exports = Object.assign(
  general,
  header,
  delivery,
  deliveryInstructions,
  cardDetails,
  payments,
  totals,
  summary,
  error,
  checkoutBagSide,
  DeliveryType,
  deliveryMethod,
  termsAndConditions
)
