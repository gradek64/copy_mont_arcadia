const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'header-height': '60px',
  'header-height-min-tablet': '68px',
  'header-height-min-laptop': '76px',
  'header-background': colors.white,

  'header-link-font-size': typography['font-size-header-link'],
  'header-link-font-weight': typography['font-weight-link'],

  'header-burger-color': colors.black,
  'header-burger-icon-bar-height': '3px',
  'header-burger-button-width': '22px',
  'header-burger-button-height': '32%',
  'header-burger-button-padding-left': '15px',

  'header-search-icon-height': '34%',
  'header-search-icon-margin-top': '22%',

  'header-logo-height': '81%',
  'header-logo-height-min-tablet': '70%',
  'header-logo-height-min-laptop': '73%',

  'header-cart-icon-height': '30px',
  'header-cart-icon-margin-top': '0',
  'header-badge-icon-top': '49%',
  'header-badge-icon-font-size': '0.9em',
}
