const defaultColors = require('../../default/variables/default-colors')
const colors = require('./tm-colors')
const typography = require('./tm-typography')

module.exports = {
  'store-locator-store-address-font-color': defaultColors.colorFaded,
  'store-locator-opening-hours-line-height': '32px',
  'store-locator-store-name-font-weight': '400',
  'store-locator-store-address-font-weight': typography['font-weight-400'],
  'store-locator-details-border-top': 'none',
  'store-locator-accordion-wrapper-border-top': 'none',
  'store-locator-footer-background': colors.black,
  'store-locator-footer-color': colors.white,
}
