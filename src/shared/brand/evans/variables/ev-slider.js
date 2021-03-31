const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'slider-label-bottom': '30px',
  'slider-bar-height': '5px',
  'slider-bar-margin': '0',
  'slider-background-color': colors['md-gray'],
  'slider-label-after-border-top': `10px solid ${colors['lt-gray']}`,
  'slider-label-font-size': '1.2em',
  'slider-label-background': colors.white,
  'slider-label-color': colors.black,
  'slider-label-font-weight': typography['font-weight-thick'],
  'slider-icon-width': '35px',

  // desktop
  'slider-label-font-size-desktop': typography['font-size-detail'],
  'slider-label-font-weight-desktop': typography['font-weight-detail'],
  'slider-icon-width-desktop': '13px',
  'slider-bar-height-desktop': '3px',
}
