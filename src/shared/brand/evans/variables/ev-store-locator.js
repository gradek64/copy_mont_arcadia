const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'store-locator-store-name-color': colors.black,
  'store-locator-store-name-font-size': '0.9em',
  'store-locator-store-name-text-transform': 'none',
  'store-locator-store-name-font-weight': typography['font-weight-h2'],
  'store-locator-opening-hours-title-font-weight':
    typography['font-weight-thick'],
  'store-locator-store-address-font-weight': typography['font-weight-detail'],
  'store-locator-details-border-top': 'none',
  'store-locator-accordion-wrapper-border-top': 'none',
  'store-locator-view-in-maps-button-background-color': colors.white,
  'store-locator-view-in-maps-text-color': colors['md-gray'],
  'store-locator-opening-hours-details-font-weight':
    typography['font-weight-detail'],
}
