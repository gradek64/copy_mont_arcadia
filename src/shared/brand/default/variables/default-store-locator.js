const colors = require('./default-colors')

const storeLocator = {
  'store-locator-distance-text-margin-left': '0',
  'store-locator-store-name-color': colors.black,
  'store-locator-store-name-font-weight': '700',
  'store-locator-store-name-margin': '0',
  'store-locator-store-name-font-size': '100%',
  'store-locator-store-name-text-transform': 'uppercase',
  'store-locator-store-address-font-size': '16px',
  'store-locator-store-address-font-color': colors.black,
  'store-locator-store-address-font-weight': 'normal',
  'store-locator-store-open-now-font-size': '16px',
  'store-locator-store-open-now-font-weight': 'bold',
  'store-locator-store-open-now-font-color': colors.colorSuccess,
  'store-locator-cfsi-font-color': colors.colorSuccess,
  'store-locator-store-open-now-text-transform': 'none',
  'store-locator-store-closing-soon-font-color': colors.colorWarning,
  'store-locator-store-closed-font-color': colors.colorError,
  'store-locator-accordion-list-border-color': colors['md-dk-gray'],
  'store-locator-accordion-background-color': colors.white,
  'store-locator-accordion-border-width': '1px 0 0',
  'store-locator-opening-hours-title-color': colors.black,
  'store-locator-details-border-top': `1px solid ${colors['md-gray']}`,
  'store-locator-opening-hours-title-font-weight': '400',
  'store-locator-opening-hours-details-font-color': colors.black,
  'store-locator-opening-hours-details-font-weight': 'normal',
  'store-locator-opening-hours-line-height': 'normal',
  'store-locator-opening-hours-title-text-transform': 'none',
  'store-locator-button-secondary-background-color': null,
  'store-locator-view-in-maps-button-background-color': null,
  'store-locator-view-in-maps-text-color': null,
  'store-locator-accordion-wrapper-border-top': `1px solid ${
    colors['lt-gray']
  }`,
  'store-locator-opening-hours-details-font-size': '16px',
  'store-locator-opening-hours-title-font-size': '100%',
  'store-locator-get-directions-text-color': null,
  'store-locator-get-directions-button-background-color': null,
  'store-locator-find-in-store-background-color': colors.white,
  'store-locator-modal-left-width-desktop': '54.99%',
  'store-locator-modal-right-width-desktop': '44.99%',
  'store-locator-footer-background': colors.white,
  'store-locator-footer-color': null,
  'store-locator-user-locator-margin': '10px',
  'store-locator-espot-background-color': colors['ex-lt-gray'],
  'store-locator-footer-height': '40px',
  'store-locator-prediction-active': colors['mega-nav-column-border'],
}

const collectFromStore = {
  'collect-from-store-list-boder-color': colors['lt-md-gray'],
  'collect-from-store-filter-bg-color': colors['lt-gray'],
}

module.exports = Object.assign(storeLocator, collectFromStore)
