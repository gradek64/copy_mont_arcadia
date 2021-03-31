const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../missselfridge/variables/ms-colors')
const typography = require('./ms-typography')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'input-border-radius': 0,
  'input-padding': '6px 12px',
  'input-margin-vertical': '20px',
  'input-label-margin-left': '0',

  'input-pre-label-font-weight': typography['font-weight-label'],
  'input-post-label-font-weight': typography['font-weight-label'],
  'input-active-label-font-weight': typography['font-weight-label'],
  'input-inactive-label-font-weight': typography['font-weight-label'],
  'input-placeholder-font-weight': typography['font-weight-300'],
  'input-post-font-weight': typography['font-weight-300'],
  'input-active-font-weight': typography['font-weight-300'],
  'input-inactive-font-weight': typography['font-weight-300'],

  'input-pre-label-font-color': colors['dk-gray'],
  'input-post-label-font-color': colors['dk-gray'],
  'input-active-label-font-color': colors['dk-gray'],
  'input-inactive-label-font-color': colors['lt-gray'],
  'input-error-label-font-color': colors['dk-gray'],

  'input-placeholder-font-color': colors['md-gray'],

  'input-active-font-color': colors['dk-gray'],
  'input-inactive-font-color': colors['ex-lt-gray'],

  'input-active-background': colors['input-focus'],
  'input-required-color': colors['dk-gray'],

  'input-inactive-background': colors['very-lt-gray'],

  'input-pre-border-color': colors['md-gray'],
  'input-post-border-color': colors['md-gray'],
  'input-active-border-color': colors['md-gray'],

  'input-inactive-border-color': colors['lt-gray'],

  'select-pre-border-color': colors['md-gray'],
  'select-post-border-color': colors['md-gray'],
  'select-active-border-color': colors['md-gray'],
  'select-inactive-border-color': colors['lt-gray'],

  'select-arrow-border-width': '1px',

  'select-pre-font-color': colors['dk-gray'],
  'select-post-font-color': colors['dk-gray'],
  'select-active-font-color': colors['dk-gray'],
  'select-inactive-font-color': colors['ex-lt-gray'],
  'select-pre-letter-spacing': 'normal',

  'select-inactive-background': colors['very-lt-gray'],
  'select-error-border-color': colors['md-gray'],

  'radio-input-check-color': colors['dk-gray'],
  'radio-label-font-color': colors['dk-gray'],
  'radio-label-font-weight': typography['font-weight-label'],
  'radio-input-inactive-check-color': colors['lt-gray'],
  'radio-input-inactive-background': colors.white,
  'radio-input-inactive-label-font-color': colors['ex-lt-gray'],

  'checkbox-border-color': colors['md-gray'],
  'checkbox-checked-border-color': null,
  'checkbox-checked-background-color': colors['md-gray'],
  'checkbox-inactive-label-font-weight': typography['font-weight-link'],
  'checkbox-error-border-color': null,
  'checkbox-label-font-weight': typography['font-weight-label'],
  'checkbox-label-font-color': colors['dk-gray'],
  'checkbox-inactive-border-color': colors['lt-md-gray'],
  'checkbox-inactive-background-color': colors['ex-lt-gray'],
  'checkbox-inactive-label-font-color': colors['lt-md-gray'],

  'arrow-validation-offset': '80px',
  'arrow-validation-background': 'transparent',
  'arrow-validation-font-weight': typography['font-weight-link'],
  'arrow-validation-font-color': colors['error-color'],

  'message-text-align': 'left',
  'message-error-background-color': 'transparent',
  'message-error-color': colors['error-color'],
  'message-confirm-background-color': 'transparent',
  'message-confirm-color': colors.colorSuccess,
  'message-error-font-size': '12px',
  'message-confirm-font-size': '14px',
}
