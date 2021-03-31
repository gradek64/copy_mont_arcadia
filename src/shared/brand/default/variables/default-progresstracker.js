const colors = require('./default-colors')

const general = {
  'progresstracker-display': null,
  'progresstracker-justify-content': 'space-between',
  'progresstracker-margin': '15px 0 45px',
  'progresstracker-margin-desktop': '0',
  'progresstracker-overflow': null,
  'progresstracker-post-style': null, // '' if active and previous has same stull. If active null

  'progresstracker-label-position': 'absolute',
  'progresstracker-label-position-left': '-20px',
  'progresstracker-label-position-top': '32px',
  'progresstracker-label-display': 'block',
  'progresstracker-label-color': colors['lt-md-gray'],
  'progresstracker-label-font-weight': 'bold',
  'progresstracker-label-font-size': '1em',
  'progresstracker-label-active-color': colors.black,
  'progresstracker-label-active-font-weight': null,
  'progresstracker-label-text-transform': 'uppercase',

  'progresstracker-number-display': 'inline',
  'progresstracker-number-color': colors.white,
  'progresstracker-number-font-weight': 'bold',
  'progresstracker-number-font-size': '1.15em',
  'progresstracker-number-active-color': null,
  'progresstracker-number-margin-top': null,

  'progresstracker-item-border-radius': '50%',
  'progresstracker-item-margin-horizontal': '20px',
  'progresstracker-item-width': '44px',
  'progresstracker-item-height': '44px',
  'progresstracker-item-background-color': colors['lt-md-gray'],
  'progresstracker-item-active-background-color': colors.black,
  'progresstracker-item-padding': '0',
  'progresstracker-item-border': `4px solid ${colors.white}`,
  'progresstracker-item-active-border': null,
  'progresstracker-item-text-align': 'center',
  'progresstracker-item-flex': '1',

  'progresstracker-line-width': '2px',
  'progresstracker-line-color': colors['lt-md-gray'],
  'progresstracker-line-type': 'dotted',

  'progresstracker-arrow-display': 'none',
  'progresstracker-arrow-size': '2em',
  'progresstracker-arrow-border-width': null,
  'progresstracker-arrow-border-color': null,

  'progresstracker-item-sibling-width': null,
  'progresstracker-item-sibling-padding-left': null,

  'progresstracker-item1-text-indent': null,
  'progresstracker-item2-text-indent': null,
}

general['progresstracker-arrow-calc'] = `calc(${
  general['progresstracker-arrow-size']
} / 2)`

module.exports = general
