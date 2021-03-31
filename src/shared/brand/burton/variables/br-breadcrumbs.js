const colors = require('./br-colors')

const general = {
  'breadcrumb-display': null,
  'breadcrumb-justify-content': null,
  'breadcrumb-overflow': 'hidden',
  'breadcrumb-margin': '0',

  'breadcrumb-item-width': '30%',
  'breadcrumb-item-height': '45px',
  'breadcrumb-item-margin-horizontal': null,

  'breadcrumb-number-display': 'none',
  'breadcrumb-item-border-radius': null,
  'breadcrumb-item-border': null,
  'breadcrumb-item-text-align': 'center',
  'breadcrumb-item-sibling-width': '35%',
  'breadcrumb-item-sibling-padding-left': '25px',
  'breadcrumb-item-background-color': colors['lt-md-gray'],
  'breadcrumb-item-active-background-color': colors['md-dk-gray'],

  'breadcrumb-label-position': 'relative',
  'breadcrumb-label-position-left': '0',
  'breadcrumb-label-position-top': '7px',
  'breadcrumb-label-text-transform': null,
  'breadcrumb-label-font-weight': '300',
  'breadcrumb-label-color': colors['dk-gray'],
  'breadcrumb-label-active-color': colors.white,

  'breadcrumb-arrow-display': 'block',
  'breadcrumb-arrow-size': '2.5em',
  'breadcrumb-arrow-border-width': '4px',
  'breadcrumb-arrow-border-color': colors['ex-lt-gray'],

  'breadcrumb-item1-text-indent': '10%',
  'breadcrumb-item2-text-indent': '6%',
}

module.exports = Object.assign(general)
