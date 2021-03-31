const colors = require('./ev-colors')
const typography = require('./ev-typography')

const general = {
  'progresstracker-display': null,
  'progresstracker-justify-content': null,
  'progresstracker-overflow': 'hidden',
  'progresstracker-post-style': '',
  'progresstracker-margin': '-1px 0 25px',

  'progresstracker-number-display': 'none',

  'progresstracker-item-width': '30%',
  'progresstracker-item-height': '45px',
  'progresstracker-item-margin-horizontal': null,
  'progresstracker-item-border-radius': null,
  'progresstracker-item-border': null,
  'progresstracker-item-text-align': 'center',
  'progresstracker-item-sibling-width': '35%',
  'progresstracker-item-sibling-padding-left': '25px',
  'progresstracker-item-background-color': colors['ex-lt-gray'],
  'progresstracker-item-active-background-color': colors['dk-gray'],

  'progresstracker-label-position': 'relative',
  'progresstracker-label-position-left': '0',
  'progresstracker-label-position-top': '7px',
  'progresstracker-label-text-transform': null,
  'progresstracker-label-font-weight': typography['font-weight-detail'],
  'progresstracker-label-color': colors['dk-gray'],
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
