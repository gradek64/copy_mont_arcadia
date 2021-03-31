const colors = require('./tm-colors')
const typography = require('./tm-typography')

module.exports = {
  'refinements-summary-header-margin-top': '15px',
  'refinements-summary-header-font-weight': typography['font-weight-700'],
  'refinements-summary-header-color': colors.black,
  'refinements-summary-item-title-color': colors.black,
  'refinements-summary-item-title-font-weight': typography['font-weight-700'],
  'refinements-summary-item-background-color': 'transparent',
  'refinements-summary-item-padding': '0',
  'refinements-summary-item-color': colors['dk-gray'],

  // desktop styles
  'refinements-summary-value-padding-right-desktop': '25px',
  'refinements-summary-item-right-desktop': '8px',
}
