const colors = require('./ms-colors')
const typography = require('./ms-typography')

module.exports = {
  'store-locator-store-name-color': colors.black,
  'store-locator-store-name-font-size': '0.9em',
  'store-locator-store-name-text-transform': 'none',
  'store-locator-store-address-font-color': colors.black,
  'store-locator-store-address-font-weight': typography['font-weight-300'],
  'store-locator-store-open-now-font-color': colors.black,
  'store-locator-store-open-now-text-transform': 'uppercase',
  'store-locator-store-open-now-font-size': '0.9em',
  'store-locator-opening-hours-line-height': '24px',
  'store-locator-opening-hours-title-text-transform': 'uppercase',
  'store-locator-opening-hours-details-font-weight':
    typography['font-weight-300'],
  'store-locator-view-in-maps-button-background-color': colors.white,
  'store-locator-view-in-maps-text-color': colors['dk-gray'],
  'store-locator-details-border-top': 'none',
  'store-locator-accordion-wrapper-border-top': 'none',
  'store-locator-store-name-font-weight': typography['font-weight-500'],
}
