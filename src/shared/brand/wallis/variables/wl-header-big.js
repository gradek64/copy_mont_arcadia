const colors = require('./wl-colors')

const headerBig = {
  'header-big-margin': null,
  'header-big-padding': '0 20px',
  'header-big-search-icon-order': '1',
  'header-big-search-icon-order-focused': '1',
  'header-big-search-icon-width': '25px',
  'header-big-search-query-width': '100px',
  'header-big-search-open-width': '100px',
  'header-big-max-width': '100%',
  'header-big-search-font-color': colors.black,
  'header-big-search-query-text-align': 'right',
  'header-big-search-border-width': '0',
  'header-big-search-query-font-size': '14px',
  'header-big-search-query-font-weight': '300',
  'header-big-search-query-transition': 'none',
  'header-big-search-background': 'transparent',
  'header-big-search-icon-padding-horizontal': '0',
  'header-big-search-icon-padding-top': '3px',
  'header-big-search-icon-padding-bottom': '0',
  'header-big-search-query-padding': '0 5px',

  'header-big-search-position': 'static',

  'header-big-sticky-margin-top': '150px',
}

const headerBigShippingDestination = {
  'header-big-shipping-destination-font-weight': 'normal',
  'header-big-shipping-destination-color': colors['dk-gray'],
}

module.exports = Object.assign(headerBig, headerBigShippingDestination)
