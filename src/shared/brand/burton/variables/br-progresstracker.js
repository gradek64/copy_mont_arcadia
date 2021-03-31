const colors = require('./br-colors')

const general = {
  'progresstracker-display': null,
  'progresstracker-justify-content': null,
  'progresstracker-overflow': 'hidden',
  'progresstracker-margin': '0',

  'progresstracker-item-width': '30%',
  'progresstracker-item-height': '45px',
  'progresstracker-item-margin-horizontal': null,

  'progresstracker-number-display': 'none',
  'progresstracker-item-border-radius': null,
  'progresstracker-item-border': null,
  'progresstracker-item-text-align': 'center',
  'progresstracker-item-sibling-width': '35%',
  'progresstracker-item-sibling-padding-left': '25px',
  'progresstracker-item-background-color': colors['lt-md-gray'],
  'progresstracker-item-active-background-color': colors['md-dk-gray'],

  'progresstracker-label-position': 'relative',
  'progresstracker-label-position-left': '0',
  'progresstracker-label-position-top': '7px',
  'progresstracker-label-text-transform': null,
  'progresstracker-label-font-weight': '300',
  'progresstracker-label-color': colors['dk-gray'],
  'progresstracker-label-active-color': colors.white,

  'progresstracker-arrow-display': 'block',
  'progresstracker-arrow-size': '2.5em',
  'progresstracker-arrow-border-width': '4px',
  'progresstracker-arrow-border-color': colors['ex-lt-gray'],

  'progresstracker-item1-text-indent': '10%',
  'progresstracker-item2-text-indent': '6%',
}

general['progresstracker-arrow-calc'] = `calc(${
  general['progresstracker-arrow-size']
} / 2)`

module.exports = general
