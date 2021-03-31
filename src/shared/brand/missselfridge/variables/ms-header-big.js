const typography = require('./ms-typography')

const headerBig = {
  'header-big-brand-logo-height': '50%',
  'header-big-search-position': 'static',

  'header-big-max-width': '100%',
  'header-big-search-icon-order': '1',
  'header-big-search-icon-order-focused': '1',
  'header-big-search-query-width': '115px',
  'header-big-search-open-width': '115px',
  'header-big-search-field-border-width': '0',
  'header-big-search-query-transition': 'none',
  'header-big-search-query-text-align': 'right',
  'header-big-search-font-color': '#707070',
  'header-big-search-query-font-weight': typography['font-weight-input'],
  'header-big-search-query-padding': '0',
  'header-big-search-icon-width': '30px',
  'header-big-search-border-width': '0',
  'header-big-search-icon-padding-top': '4px',
  'header-big-search-icon-padding-horizontal': '4px',
  'header-big-search-icon-padding-bottom': '2px',
  'header-big-search-bar-form-background-focused': '#fff',

  'header-big-sticky-margin-top': '88px',
}

module.exports = Object.assign(headerBig)
