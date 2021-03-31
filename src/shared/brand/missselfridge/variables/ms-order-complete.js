const colors = require('./ms-colors')
const typography = require('./ms-typography')

module.exports = {
  'order-complete-error-icon-display': 'none',

  'order-complete-header-border-bottom-width': '1px',
  'order-complete-header-border-bottom-color': colors['md-gray'],

  'order-complete-header-item-text-color': colors['dk-gray'],
  'order-complete-header-item-font-size': '18px',
  'order-complete-header-item-font-weight': typography['font-weight-h1'],
  'order-complete-header-item-line-height': 0.56,

  'order-complete-fields-margin': '25px 0',
  'order-complete-field-font-weight': typography['font-weight-500'],
  'order-complete-field-font-size': '18px',

  'order-complete-order-number-text-color': colors['dk-gray'],
  'order-complete-order-number-font-size': '18px',

  'order-complete-confirmation-mail-text-color': colors['dk-gray'],
  'order-complete-confirmation-mail-font-size': '14px',
  'order-complete-confirmation-mail-font-weight': typography['font-weight-300'],

  'order-complete-collect-from-font-size': '18px',
  'order-complete-collect-from-font-weight': typography['font-weight-300'],

  'order-complete-estimated-delivery-font-size': '18px',
  'order-complete-estimated-delivery-font-weight':
    typography['font-weight-500'],
  'order-complete-estimated-delivery-text-color': colors.colorSuccess,

  'order-complete-address-header-font-size': '18px',
  'order-complete-address-header-font-weight': typography['font-weight-h1'],

  'order-complete-address-color': colors['dk-gray'],
  'order-complete-address-font-size': '14px',

  'order-complete-opening-title-font-size': '14px',
  'order-complete-opening-title-font-weight': typography['font-weight-h1'],
  'order-complete-opening-title-font-family': typography['font-family-h1'],

  'order-complete-opening-times-font-size': '14px',
  'order-complete-opening-times-font-weight': typography['font-weight-300'],
  'order-complete-opening-times-font-family': typography['font-family-p'],
}
