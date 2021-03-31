const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../burton/variables/br-colors')
const base = require('./br-base.js')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'input-border-radius': 0,
  'input-padding': '5px 12px',
  'input-label-margin-left': 0,
  'input-margin-vertical': '20px',
  'form-element-height': '50px',
  'input-pre-label-text-transform': 'capitalize',
  'input-post-label-text-transform': 'capitalize',
  'input-active-label-text-transform': 'capitalize',
  'input-inactive-label-text-transform': 'capitalize',

  'input-pre-label-font-color': colors.black,
  'input-post-label-font-color': colors.black,
  'input-active-label-font-color': colors.black,
  'input-inactive-label-font-color': colors['md-gray'],

  'input-pre-label-font-weight': 'normal',
  'input-post-label-font-weight': 'normal',
  'input-active-label-font-weight': 'normal',
  'input-inactive-label-font-weight': 'normal',

  'input-error-label-font-color': colors.black,
  'input-placeholder-font-color': colors['md-gray'],

  'input-pre-border-color': colors['md-gray'],
  'input-post-border-color': colors['md-gray'],
  'input-active-border-color': colors['md-gray'],
  'input-inactive-border-color': colors['lt-md-gray'],

  'input-active-font-color': colors.black,
  'input-inactive-font-color': colors['md-gray'],

  'input-inactive-background': colors.white,

  'select-pre-font-color': colors['md-gray'],
  'select-pre-border-color': colors['md-gray'],

  'select-post-font-color': colors.black,
  'select-post-border-color': colors['md-gray'],

  'select-active-font-color': colors.black,
  'select-active-border-color': colors['md-gray'],

  'select-arrow-border-width': null,

  'select-inactive-background': colors.white,
  'select-inactive-font-color': colors['md-gray'],
  'select-inactive-border-color': colors['lt-md-gray'],

  'select-error-border-color': colors['md-gray'],

  'radio-input-size': '20px',
  'radio-label-font-color': colors.black,
  'radio-input-check-color': colors['dk-gray'],
  'radio-input-inactive-check-color': colors['lt-md-gray'],
  'radio-input-inactive-label-font-color': colors['md-gray'],

  'checkbox-show-tick': false,
  'checkbox-border-color': '#909090',
  'checkbox-checked-border-color': null,
  'checkbox-checked-background-color': colors.black,
  'checkbox-checked-padding-color': colors.white,
  'checkbox-error-border-color': colors['md-gray'],
  'checkbox-label-font-color': colors.black,
  'checkbox-inactive-border-color': colors['cb-lt-md-gray'],
  'checkbox-inactive-background-color': colors['cb-ex-lt-gray'],
  'checkbox-inactive-label-font-color': colors['cb-lt-md-gray'],

  'input-validation-icon-right': '10px',

  'arrow-validation-background': colors['error-color'],
  'arrow-validation-offset': '85px',

  'message-text-align': 'left',
  'message-font-size': base['font-size-base'],
  'message-font-family': base['font-family-primary'],
  'message-error-color': colors['error-color'],
  'message-error-background-color': 'transparent',
  'message-confirm-color': colors['success-color'],
  'message-confirm-background-color': 'transparent',
}
