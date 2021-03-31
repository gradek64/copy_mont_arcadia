const colors = require('./default-colors')

module.exports = {
  'max-tablet': 'screen and (max-width: 992px)', // Need to refactor in default-responsive.js

  'body-background-color': colors.white,
  'scrollbar-thumb-background-color': colors['dk-scroll-background'],
  'scrollbar-width': '5px',
  'scrollbar-background-color': colors['lt-scroll-background'],
  'scrollbar-border-radius': '0',
  'font-family-primary': 'Overpass, sans-serif',
  'font-family-secondary': 'Overpass, sans-serif',
  'line-height-base': 1.2,
  'font-weight-base': 'normal',
  'font-size-base': '16px',
  'overlay-opacity': '0.8',
  'page-padding': '10px',
  'font-style-base': 'normal',

  'espot-padding': '10px',

  'font-family-quiz': 'Overpass, sans-serif',
  'font-family-header-responsive': null,

  'left-col-margin': '10px',
  'right-col-margin': '10px',
}
