const colors = require('./tm-colors')

module.exports = {
  'slider-bar-height': '4px',
  'slider-background-color': colors['lt-gray'],
  'slider-label-background': colors.white,
  'slider-label-color': colors.black,
  'slider-label-text-align': 'left',
  'slider-icon-width': '20px',

  // desktop
  'slider-margin-desktop': '30px 0 10px',
  'slider-label-font-size-desktop': '14px',
  'slider-icon-width-desktop': '13px',
  'slider-bar-height-desktop': '1.1px', // this had to be changed to 1.1px as there was an issue with the critical css not showing the bar
}
