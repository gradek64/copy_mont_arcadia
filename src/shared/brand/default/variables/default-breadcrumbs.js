const colors = require('./default-colors')

const general = {
  'breadcrumb-display': null,
  'breadcrumb-justify-content': 'space-between',
  'breadcrumb-margin': '15px 0 45px',
  'breadcrumb-margin-desktop': '0',
  'breadcrumb-overflow': null,
  'breadcrumb-post-style': null, // '' if active and previous has same stull. If active null

  'breadcrumb-label-position': 'absolute',
  'breadcrumb-label-position-left': '-20px',
  'breadcrumb-label-position-top': '32px',
  'breadcrumb-label-display': 'block',
  'breadcrumb-label-color': colors['lt-md-gray'],
  'breadcrumb-label-font-weight': 'bold',
  'breadcrumb-label-font-size': '1em',
  'breadcrumb-label-active-color': colors.black,
  'breadcrumb-label-text-transform': 'uppercase',

  'breadcrumb-number-display': 'inline',
  'breadcrumb-number-color': colors.white,
  'breadcrumb-number-font-weight': 'bold',
  'breadcrumb-number-font-size': '1.15em',
  'breadcrumb-number-active-color': null,
  'breadcrumb-number-margin-top': null,

  'breadcrumb-item-border-radius': '50%',
  'breadcrumb-item-margin-horizontal': '20px',
  'breadcrumb-item-width': '44px',
  'breadcrumb-item-height': '44px',
  'breadcrumb-item-background-color': colors['lt-md-gray'],
  'breadcrumb-item-active-background-color': colors.black,
  'breadcrumb-item-padding': '0',
  'breadcrumb-item-border': `4px solid ${colors.white}`,
  'breadcrumb-item-active-border': null,
  'breadcrumb-item-text-align': 'center',

  'breadcrumb-line-width': '2px',
  'breadcrumb-line-color': colors['lt-md-gray'],
  'breadcrumb-line-type': 'dotted',

  'breadcrumb-arrow-display': 'none',
  'breadcrumb-arrow-size': '2em',
  'breadcrumb-arrow-border-width': null,
  'breadcrumb-arrow-border-color': null,

  'breadcrumb-item-sibling-width': null,
  'breadcrumb-item-sibling-padding-left': null,

  'breadcrumb-item1-text-indent': null,
  'breadcrumb-item2-text-indent': null,
}

module.exports = Object.assign(general)
