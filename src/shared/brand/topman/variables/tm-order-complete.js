const colors = require('./tm-colors.js')
const typography = require('./tm-typography')

module.exports = {
  'order-complete-padding': '20px 10px',
  'order-complete-error-text-align': 'left',
  'order-complete-error-header-display': 'none',
  'order-complete-error-details-color': colors.red,
  'order-complete-error-icon-display': 'none',

  'order-complete-header-border-bottom-width': '1px',
  'order-complete-header-border-bottom-color': colors['lt-md-gray'],

  'order-complete-header-item-font-size': '18px',
  'order-complete-header-item-font-weight': typography['font-weight-700'],

  'order-complete-order-number-font-size': '18px',
  'order-complete-order-number-font-weight': 'normal',

  'order-complete-confirmation-mail-font-weight': typography['font-weight-400'],
  'order-complete-confirmation-mail-line-height': 1.43,

  'order-complete-estimated-delivery-font-size': '18px',
  'order-complete-estimated-delivery-font-weight': '500',
  'order-complete-estimated-delivery-text-color': colors.black,

  'order-complete-button-color': colors['highlight-color'],
}
