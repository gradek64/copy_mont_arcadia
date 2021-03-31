const colors = require('./dp-colors.js')

module.exports = {
  'breadcrumb-margin': '15px 0 50px',
  'breadcrumb-margin-desktop': '0 0 30px',

  'breadcrumb-label-font-size': '0.8em',
  'breadcrumb-label-position-top': '32px',
  'breadcrumb-label-color': colors['lt-md-gray'],
  'breadcrumb-label-active-color': colors['dk-gray'],

  'breadcrumb-item-border': `2px solid ${colors['lt-md-gray']}`,
  'breadcrumb-item-active-border': `2px solid ${colors['dk-gray']}`,
  'breadcrumb-item-background-color': colors.white,
  'breadcrumb-item-active-background-color': colors['dk-gray'],
  'breadcrumb-item-width': '33px',
  'breadcrumb-item-height': '33px',

  'breadcrumb-line-type': 'solid',
  'breadcrumb-line-width': '2px',
  'breadcrumb-line-color': colors['lt-md-gray'],

  'breadcrumb-number-font-size': '1em',
  'breadcrumb-number-active-color': colors.white,
  'breadcrumb-number-color': colors['lt-md-gray'],
  'breadcrumb-number-margin-top': '-1px',
  'breadcrumb-number-display': 'inline-block',
}
