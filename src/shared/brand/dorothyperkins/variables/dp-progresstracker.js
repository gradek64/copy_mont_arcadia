const colors = require('./dp-colors.js')

module.exports = {
  'progresstracker-margin': '15px 10px 50px',
  'progresstracker-margin-desktop': '0 0 30px',

  'progresstracker-label-font-size': '0.8em',
  'progresstracker-label-position-top': '32px',
  'progresstracker-label-color': colors['lt-md-gray'],
  'progresstracker-label-active-color': colors['dk-gray'],

  'progresstracker-item-border': `2px solid ${colors['lt-md-gray']}`,
  'progresstracker-item-active-border': `2px solid ${colors['dk-gray']}`,
  'progresstracker-item-background-color': colors.white,
  'progresstracker-item-active-background-color': colors['dk-gray'],
  'progresstracker-item-width': '33px',
  'progresstracker-item-height': '33px',
  'progresstracker-item-flex': null,

  'progresstracker-line-type': 'solid',
  'progresstracker-line-width': '2px',
  'progresstracker-line-color': colors['lt-md-gray'],

  'progresstracker-number-font-size': '1em',
  'progresstracker-number-active-color': colors.white,
  'progresstracker-number-color': colors['lt-md-gray'],
  'progresstracker-number-margin-top': '-1px',
  'progresstracker-number-display': 'inline-block',
}
