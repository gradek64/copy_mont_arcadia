const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'order-complete-padding': '15px 10px',
  'order-complete-error-header-display': 'none',
  'order-complete-error-icon-width': '50px',
  'order-complete-error-icon-margin-bottom': '5px',
  'order-complete-error-details-margin-bottom': '15px',

  'order-complete-header-item-margin-top': '10px',
  'order-complete-header-item-text-color': colors['lt-black'],
  'order-complete-header-item-line-height': 1.09,
  'order-complete-header-border-bottom-width': '1px',
  'order-complete-header-border-bottom-color': '#e2e2e2',

  'order-complete-field-text-color': colors['lt-black'],
  'order-complete-field-font-size': typography['font-size-h1'],
  'order-complete-field-font-weight': typography['font-weight-thick'],
  'order-complete-field-line-height': 1.09,

  'order-complete-order-number-text-color': colors['lt-black'],
  'order-complete-order-number-font-size': typography['font-size-h1'],
  'order-complete-order-number-font-weight': typography['font-weight-thick'],
  'order-complete-order-number-line-height': 1.09,

  'order-complete-address-header-font-size': typography['font-size-info'],
  'order-complete-address-header-font-weight': typography['font-weight-thick'],

  'order-complete-delivery-icon-display': 'none',

  'order-complete-address-line-height': 1.23,
  'order-complete-address-letter-spacing': '0.1px',
  'order-complete-address-color': colors.black,
  'order-complete-address-font-size': typography['font-size-detail'],

  'order-complete-confirmation-mail-text-color': colors.black,
  'order-complete-confirmation-mail-font-size': typography['font-size-info'],
  'order-complete-confirmation-mail-font-weight':
    typography['font-weight-thick'],
  'order-complete-confirmation-mail-margin-top': '20px',

  'order-complete-collect-from-font-size': typography['font-size-detail'],
  'order-complete-collect-from-font-weight': typography['font-weight-normal'],

  'order-complete-estimated-delivery-font-size': typography['font-size-detail'],
  'order-complete-estimated-delivery-font-weight':
    typography['font-weight-normal'],
  'order-complete-estimated-delivery-text-color': colors.black,

  'order-complete-button-font-family': typography['font-family-button'],
  'order-complete-button-font-weight': typography['font-weight-detail'],

  'order-complete-totals-border-left': `1px solid ${colors['lt-gray']}`,
  'order-complete-totals-border-right': `1px solid ${colors['lt-gray']}`,
  'order-complete-totals-border-bottom': `1px solid ${colors['lt-gray']}`,
}
