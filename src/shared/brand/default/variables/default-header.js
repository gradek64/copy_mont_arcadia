const colors = require('./default-colors')

const header = {
  'header-height': '44px',
  'header-height-min-tablet': null,
  'header-height-min-laptop': null,
  'header-background': colors.white,
  'header-padding-horizontal': '10px',
  'header-border-bottom': `1px solid ${colors['md-gray']}`,
  'header-height-tablet': '140px',

  'header-link-font-size': null,
  'header-link-font-weight': null,
}

const burgerButton = {
  'header-burger-color': colors.black,
  'header-burger-icon-bar-height': '4px',
  'header-burger-button-width': '26px',
  'header-burger-button-height': '46%',
  'header-burger-button-padding-left': header['header-padding-horizontal'],
}

const searchIcon = {
  'header-search-icon-height': '52%',
  'header-search-icon-margin-top': '24%',
}

const logo = {
  'header-logo-height': '48%',
  'header-logo-height-min-tablet': null,
  'header-logo-height-min-laptop': null,
}

const cartIcon = {
  'header-cart-icon-height': '52%',
  'header-cart-icon-margin-top': '10%',
  'header-cart-button-margin-right': null,
  'header-cart-icon-width': '25px',
}

const cartBadge = {
  'header-badge-icon-background': 'transparent',
  'header-badge-icon-right': 0,
  'header-badge-icon-top': '44%',
  'header-badge-icon-min-width': null,
  'header-badge-icon-width': '100%',
  'header-badge-icon-height': 'auto',
  'header-badge-icon-font-color': colors.white,
  'header-badge-icon-border-radius': '0',
  'header-badge-icon-empty-display': 'none',
  'header-badge-icon-font-size': '0.8em',
  'header-badge-icon-line-height': '1',
  'header-badge-icon-font-family': 'inherit',
}

module.exports = Object.assign(
  header,
  burgerButton,
  searchIcon,
  logo,
  cartIcon,
  cartBadge
)
