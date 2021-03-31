const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'refinements-summary-header-color': colors.black,
  'refinements-summary-header-margin-top': '15px',
  'refinements-summary-header-margin-bottom': '5px',
  'refinements-summary-header-border-bottom': `solid 1px ${colors['dk-gray']}`,
  'refinements-summary-category-item-margin-top': '10px',
  'refinements-summary-item-title-size': typography['font-size-detail'],
  'refinements-summary-item-title-color': colors.black,
  'refinements-summary-item-background-color': 'transparent',
  'refinements-summary-item-border': `solid 1px ${colors['dk-gray']}`,
  'refinements-summary-item-size': typography['font-size-detail'],
  'refinements-summary-item-color': colors['dk-gray'],

  'clearall-text-decoration': 'none',

  // desktop styles
  'refinements-summary-value-padding-right-desktop': '27px',
  'refinements-summary-value-padding-bottom-desktop': '3px',
  'refinements-summary-item-top-desktop': '0',
  'refinements-summary-item-right-desktop': '9px',
}
