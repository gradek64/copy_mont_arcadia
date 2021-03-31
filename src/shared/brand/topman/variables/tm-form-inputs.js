const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../topman/variables/tm-colors')
const typography = require('./tm-typography')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'input-border-radius': 0,
  'input-padding': '5px 12px',
  'input-label-margin-left': 0,

  'input-margin-vertical': '20px',
  'input-placeholder-font-weight': typography['font-weight-300'],

  'input-pre-border-color': colors['lt-md-gray'],
  'input-post-border-color': colors['highlight-color'],
  'input-active-border-color': colors.black,
  'input-inactive-border-color': colors['lt-md-gray'],
  'input-error-border-color': colors['error-color'],

  'input-pre-label-font-weight': typography['font-weight-300'],
  'input-post-label-font-weight': typography['font-weight-300'],
  'input-active-label-font-weight': typography['font-weight-300'],
  'input-inactive-label-font-weight': typography['font-weight-300'],

  'input-pre-label-font-color': colors.black,
  'input-post-label-font-color': colors.black,
  'input-active-label-font-color': colors.black,
  'input-inactive-label-font-color': colors['lt-md-gray'],
  'input-error-label-font-color': colors.black,

  'input-placeholder-font-color': colors['lt-md-gray'],
  'input-active-font-color': colors.black,
  'input-inactive-font-color': colors['lt-md-gray'],

  'input-inactive-background': colors.white,

  'select-pre-border-color': colors['lt-md-gray'],
  'select-post-border-color': colors['lt-md-gray'],
  'select-active-border-color': colors['lt-md-gray'],
  'select-inactive-border-color': colors['lt-md-gray'],
  'select-error-border-color': colors['lt-md-gray'],

  'select-pre-font-color': colors.black,
  'select-post-font-color': colors.black,
  'select-active-font-color': colors.black,
  'select-inactive-font-color': colors['lt-md-gray'],
  'select-pre-font-size': null,

  'select-inactive-background': colors.white,
  'select-arrow-border-width': null,

  'radio-input-border-width': '1px',
  'radio-label-font-color': colors.black,
  'radio-input-inactive-check-color': colors['lt-md-gray'],
  'radio-input-inactive-label-font-color': colors['lt-md-gray'],
  'radio-label-font-weight': typography['font-weight-300'],
  'radio-input-checked-font-weight': typography['font-weight-300'],
  'radio-input-checked-padding': '5px',

  'checkbox-border-color': colors.black,
  'checkbox-inactive-border-color': colors['cb-lt-md-gray'],
  'checkbox-inactive-background-color': colors['md-lt-gray'],
  'checkbox-inactive-label-font-color': colors['cb-lt-md-gray'],
  'checkbox-label-font-color': colors.black,
  'checkbox-label-font-weight': typography['font-weight-300'],
  'checkbox-label-line-height': '23px',

  'arrow-validation-arrow-size': 0,
  'arrow-validation-background': colors.white,
  'arrow-validation-border': `3px solid ${colors['error-color']}`,
  'arrow-validation-font-color': colors['error-color'],
  'arrow-validation-padding': '10px',
  'arrow-validation-offset': '75px',

  'select-arrow-size': '20px 20px',
}
