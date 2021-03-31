const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../evans/variables/ev-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'input-border-radius': 0,
  'input-padding': '6px 12px',
  'input-margin-vertical': '20px',
  'input-label-margin-left': '6px',

  'input-pre-label-font-color': colors.black,
  'input-post-label-font-color': colors.black,
  'input-active-label-font-color': colors.black,
  'input-inactive-label-font-color': colors.black,
  'input-error-label-font-color': colors.black,

  'input-pre-label-font-weight': 'normal',
  'input-post-label-font-weight': 'normal',
  'input-active-label-font-weight': 'normal',
  'input-inactive-label-font-weight': 'normal',
  'input-placeholder-font-weight': 'normal',
  'input-post-font-weight': 'normal',
  'input-active-font-weight': 'normal',
  'input-inactive-font-weight': 'normal',

  'input-pre-border-color': colors['dk-gray'],
  'input-post-border-color': colors['dk-gray'],
  'input-active-border-color': colors['dk-gray'],
  'input-inactive-border-color': colors['lt-gray'],

  'input-placeholder-font-color': colors['md-gray'],

  'input-post-font-color': colors.black,
  'input-active-font-color': colors.black,
  'input-inactive-font-color': colors['lt-md-gray'],

  'input-inactive-background': colors['ex-lt-gray'],

  'select-pre-border-color': colors['dk-gray'],
  'select-post-border-color': colors['dk-gray'],
  'select-active-border-color': colors['dk-gray'],
  'select-inactive-border-color': colors['lt-gray'],
  'select-error-border-color': colors['dk-gray'],

  'select-pre-font-color': colors['md-gray'],
  'select-post-font-color': colors.black,
  'select-active-font-color': colors.black,
  'select-inactive-font-color': colors['lt-md-gray'],

  'select-pre-font-size': null,

  'select-inactive-background': colors['ex-lt-gray'],

  'select-arrow-border-width': null,
  'select-arrow-width': '20px',
  'select-arrow-right': '10px',

  'radio-input-border-width': '2px',
  'radio-label-font-color': colors.black,
  'radio-input-check-color': colors['md-gray'],
  'radio-input-checked-check-color': colors.black,
  'radio-input-font-weight': 'normal',
  'radio-input-checked-font-weight': 'normal',
  'radio-input-inactive-label-font-color': colors['md-gray'],
  'radio-input-inactive-check-color': colors['md-gray'],

  'checkbox-show-tick': true,
  'checkbox-border-color': '#909090',
  'checkbox-checked-border-color': '#000000',
  'checkbox-checked-background-color': null,
  'checkbox-inactive-border-color': colors['cb-lt-md-gray'],
  'checkbox-inactive-background-color': colors['md-lt-gray'],
  'checkbox-inactive-label-font-color': colors['cb-lt-md-gray'],
  'checkbox-error-border-color': colors['dk-gray'],
  'checkbox-label-font-color': colors.black,
  'checkbox-label-font-weight': 'normal',

  'message-message-line-height': '16px',
  'message-error-color': colors['error-color'],
  'message-error-background-color': colors.white,
  'message-confirm-color': colors['success-color'],
  'message-confirm-background-color': colors.white,
}
