const colors = require('./tm-colors')

module.exports = {
  'navigation-group-header-visibility': 'none',

  'navigation-item-padding-vertical': '20px',
  'navigation-item-padding-horizontal': '20px',
  'navigation-item-font-color': colors.black,
  'navigation-item-active-font-color': colors.black,
  'navigation-item-border-color': colors['nav-line-color'],

  'navigation-item-arrow-height': '18px',
  'navigation-item-arrow-width': '8px',

  'navigation-category-section-background': colors.white,
  'navigation-details-section-background': colors['ex-lt-gray'],
  'navigation-help-section-background': colors['lt-gray'],

  'navigation-list-border-top': `1px solid ${colors['ex-lt-gray']}`,

  'topnavmenu-big-background-color': '#fff',
  'topnavmenu-big-font-color': colors.white,
}
