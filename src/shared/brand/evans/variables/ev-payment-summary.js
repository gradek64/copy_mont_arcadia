const typography = require('./ev-typography')

module.exports = {
  'payment-summary-header-font-size': typography['font-size-h1'],
  'payment-summary-header-font-weight': typography['font-weight-thick'],
  'payment-summary-header-line-height': '1.09',

  'payment-summary-table-head-font-weight': typography['font-weight-thick'],

  'payment-summary-table-row-line-height': '1.25',
  'payment-summary-table-row-letter-spacing': 'normal',
  'payment-summary-table-row-font-weight': typography['font-weight-thick'],
  'payment-summary-total-col-padding': '0 0 20px',

  'payment-summary-table-col-right-font-size': typography['font-size-info'],
  'payment-summary-table-col-right-font-weight':
    typography['font-weight-thick'],
  'payment-summary-table-col-right-line-height': '1.25',
}
