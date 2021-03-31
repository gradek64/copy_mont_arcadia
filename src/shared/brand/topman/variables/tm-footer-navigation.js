const colors = require('./tm-colors')
const typography = require('./tm-typography')

module.exports = {
  // .FooterNavigation-categoryTitle
  'footer-nav-category-title-font-size': '14px',
  'footer-nav-category-title-margin': '0 0 3px 0',
  'footer-nav-category-title-text-transform': 'uppercase',
  'footer-nav-category-title-font-weight': typography['font-weight-700'],
  'footer-nav-category-title-style': 'normal',

  // .FooterNavigation-imageLink
  'footer-nav-image-link-display': 'block',
  'footer-nav-image-link-margin': '9px 0',

  // .FooterNavigation-imagesmall
  'footer-nav-category-item-image-small-margin-top': '10px',

  // .FooterNavigation-textLink
  'footer-nav-text-link-font-size': '14px',
  'footer-nav-text-link-text-line-height': '24px',

  // .FooterNavigation-textLink:hover
  'footer-nav-text-link-color-hover': colors['md-gray'],
}
