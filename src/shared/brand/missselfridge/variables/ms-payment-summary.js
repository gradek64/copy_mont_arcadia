const colors = require('./ms-colors')
const typography = require('./ms-typography')

module.exports = {
  'payment-summary-header-font-size': '18px',
  'payment-summary-header-font-weight': typography['font-weight-h1'],
  'payment-summary-header-line-height': '1.09',
  'payment-summary-header-border-bottom': 'transparent',

  'payment-summary-body-background-color': '#FCE9ED',
  'payment-summary-body-padding-top': '0',
  'payment-summary-body-padding-right': '20px',
  'payment-summary-body-padding-bottom': '0',
  'payment-summary-body-padding-left': '20px',

  'payment-summary-table-row-font-size': '18px',
  'payment-summary-table-row-line-height': '1.25',
  'payment-summary-table-row-letter-spacing': 'normal',
  'payment-summary-table-row-font-weight': typography['font-weight-500'],

  'payment-summary-table-col-right-font-size': '16px',
  'payment-summary-table-col-right-font-weight': typography['font-weight-500'],
  'payment-summary-table-col-right-line-height': '1.25',
  'payment-summary-table-col-padding': '20px 0',

  'payment-summary-total-border-bottom': `1px solid ${colors['ex-lt-gray']}`,
}
