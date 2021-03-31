const colors = require('./wl-colors')

module.exports = {
  'back-to-top-background': colors.black,
  'back-to-top-border-width': 0,
  'back-to-top-box-shadow': `0 0 10px 0 ${colors['lt-md-gray']}`,
  'back-to-top-active-background': 'auto',
  'back-to-top-display': 'flex',
  'back-to-top-direction': 'row-reverse',

  'back-to-top-arrow-margin': '10px',

  'back-to-top-arrow-height': '16px',
  'back-to-top-arrow-width': '26px',

  'back-to-top-label-color': colors.white,
}
