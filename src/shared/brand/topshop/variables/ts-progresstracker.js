const colors = require('./ts-colors')
const typography = require('./ts-typography')

const general = {
  'progresstracker-display': null,
  'progresstracker-justify-content': null,
  'progresstracker-overflow': 'hidden',
  'progresstracker-margin': '0 0 15px',
  'progresstracker-post-style': '',

  'progresstracker-item-width': '30%',
  'progresstracker-item-height': '42px',
  'progresstracker-item-margin-horizontal': null,

  'progresstracker-number-display': 'none',
  'progresstracker-item-border-radius': null,
  'progresstracker-item-border': null,
  'progresstracker-item-text-align': 'center',
  'progresstracker-item-sibling-width': '35%',
  'progresstracker-item-sibling-padding-left': '25px',
  'progresstracker-item-background-color': colors['md-gray'],
  'progresstracker-item-active-background-color': colors.black,

  'progresstracker-label-position': 'relative',
  'progresstracker-label-position-left': '0',
  'progresstracker-label-position-top': '5px',
  'progresstracker-label-text-transform': null,
  'progresstracker-label-font-weight': typography['font-weight-700'],
  'progresstracker-label-color': colors['lt-gray'],
  'progresstracker-label-active-color': colors.white,

  'progresstracker-arrow-display': 'block',
  'progresstracker-arrow-size': '2.5em',
  'progresstracker-arrow-border-width': '4px',
  'progresstracker-arrow-border-color': colors.white,
}

general['progresstracker-arrow-calc'] = `calc(${
  general['progresstracker-arrow-size']
} / 2)`

module.exports = general
