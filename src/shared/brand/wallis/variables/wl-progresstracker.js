const colors = require('./wl-colors')

const general = {
  'progresstracker-display': null,
  'progresstracker-justify-content': null,
  'progresstracker-overflow': 'hidden',
  'progresstracker-post-style': '',
  'progresstracker-margin': '-1px 0 25px',

  'progresstracker-number-display': 'none',

  'progresstracker-item-width': '30%',
  'progresstracker-item-height': '40px',
  'progresstracker-item-margin-horizontal': null,
  'progresstracker-item-border-radius': null,
  'progresstracker-item-border': null,
  'progresstracker-item-text-align': 'center',
  'progresstracker-item-sibling-width': '35%',
  'progresstracker-item-sibling-padding-left': '25px',
  'progresstracker-item-background-color': colors['lt-gray'],
  'progresstracker-item-active-background-color': colors['lt-gray'],

  'progresstracker-label-position': 'relative',
  'progresstracker-label-position-left': '0',
  'progresstracker-label-position-top': '2px',
  'progresstracker-label-text-transform': null,
  'progresstracker-label-font-weight': '300',
  'progresstracker-label-font-size': '1.1em',
  'progresstracker-label-color': colors['md-gray'],
  'progresstracker-label-active-color': colors.black,
  'progresstracker-label-active-font-weight': 'bold',

  'progresstracker-arrow-display': 'block',
  'progresstracker-arrow-size': '1em',
  'progresstracker-arrow-border-width': '2px',
  'progresstracker-arrow-border-color': colors['md-gray'],
}

general['progresstracker-arrow-calc'] = `${
  general['progresstracker-arrow-size']
}`

module.exports = general
