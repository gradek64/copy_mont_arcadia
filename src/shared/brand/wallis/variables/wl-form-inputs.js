const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../wallis/variables/wl-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'input-border-radius': 0,
  'input-active-outline': `1px solid ${colors['dk-gray']}`,
  'input-padding': '10px 10px',
  'input-margin-vertical': '20px',
  'form-element-height': '50px',
  'input-label-margin-left': 0,
  'input-field-font-size': '18px',

  'input-pre-label-text-transform': 'capitalize',
  'input-post-label-text-transform': 'capitalize',
  'input-inactive-label-text-transform': 'capitalize',
  'input-error-label-text-transform': 'capitalize',

  'input-pre-label-font-color': colors.black,
  'input-post-label-font-color': colors.black,
  'input-active-label-font-color': colors.black,
  'input-inactive-label-font-color': colors.black,

  'input-pre-border-color': colors['dk-gray'],
  'input-post-border-color': colors['dk-gray'],
  'input-active-border-color': colors['dk-gray'],
  'input-inactive-border-color': colors['md-gray'],

  'input-post-font-color': colors.black,

  'input-error-label-font-color': colors['md-gray'],
  'input-placeholder-font-color': colors['md-gray'],

  'input-active-font-color': colors.black,

  'input-placeholder-font-weight': 300,

  'input-inactive-background': colors['lt-gray'],
  'input-inactive-font-color': colors['md-gray'],
  'input-inactive-label-font-weight': 300,

  'select-pre-font-color': colors.black,
  'select-pre-border-color': colors['md-gray'],
  'select-font-size': '18px',

  'select-post-font-color': colors.black,
  'select-post-border-color': colors['dk-gray'],

  'select-active-font-color': colors.black,
  'select-active-border-color': colors['md-gray'],

  'select-inactive-background': colors['lt-gray'],
  'select-inactive-font-color': colors['md-gray'],
  'select-inactive-border-color': colors['md-gray'],

  'select-error-border-color': colors['error-color'],

  'radio-input-checked-font-weight': 300,
  'input-post-label-font-weight': 300,
  'input-pre-label-font-weight': 300,
  'input-active-font-weight': 300,
  'input-post-font-weight': 300,

  'radio-input-inactive-background-color': colors['lt-gray'],
  'radio-input-inactive-check-color': colors['md-gray'],
  'radio-input-inactive-label-font-color': colors['md-gray'],
  'radio-label-font-color': colors.black,
  'radio-input-font-weight': 300,

  'checkbox-border-color': colors['dk-gray'],
  'checkbox-checked-border-color': null,
  'checkbox-label-font-color': colors.black,
  'checkbox-label-font-weight': 300,
  'checkbox-inactive-border-color': colors['cb-lt-md-gray'],
  'checkbox-inactive-background-color': colors['cb-ex-lt-gray'],
  'checkbox-inactive-label-font-color': colors['cb-lt-md-gray'],

  'input-validation-icon-right': '20px',

  'message-font-size': '16px',
  'message-text-align': 'left',
  'message-error-color': colors['error-color'],
  'message-confirm-color': colors['success-color'],
  'message-error-background-color': 'transparent',
  'message-confirm-background-color': 'transparent',

  'message-error-font-size': '12px',
  'message-error-letter-spacing': '0.08em',
  'message-error-line-height': '16px',
}
