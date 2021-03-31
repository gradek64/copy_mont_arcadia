const defaultColors = require('../../default/variables/default-colors')
const extraColors = require('../../dorothyperkins/variables/dp-colors')

const colors = Object.assign({}, defaultColors, extraColors)

module.exports = {
  'form-element-height': '44px',
  'input-border-radius': 0,
  'input-padding': '6px 12px',
  'input-margin-vertical': '15px',
  'input-label-margin-left': '0',

  'input-pre-border-color': colors['md-gray'],
  'input-post-border-color': colors['dk-gray'],
  'input-active-border-color': colors['dk-gray'],
  'input-inactive-border-color': colors['md-gray'],

  'input-pre-label-font-color': colors['dk-gray'],
  'input-post-label-font-color': colors['dk-gray'],
  'input-active-label-font-color': colors['dk-gray'],
  'input-inactive-label-font-color': colors['dk-gray'],
  'input-error-label-font-color': colors['dk-gray'],

  'input-pre-label-font-weight': 300,
  'input-post-label-font-weight': 300,
  'input-active-label-font-weight': 300,
  'input-inactive-label-font-weight': 300,
  'input-error-label-font-weight': 300,

  'input-placeholder-font-color': colors['lt-md-gray'],

  'input-active-font-color': colors['dk-gray'],

  'input-inactive-background': colors['ex-lt-gray'],
  'input-inactive-font-color': colors['md-gray'],

  'select-arrow-border-width': null,

  'select-pre-font-color': colors['lt-md-gray'],
  'select-pre-border-color': colors['md-gray'],

  'select-post-font-color': colors['dk-gray'],
  'select-post-border-color': colors['dk-gray'],

  'select-active-font-color': colors['dk-gray'],
  'select-active-border-color': colors['dk-gray'],

  'select-inactive-background': colors['ex-lt-gray'],
  'select-inactive-font-color': colors['lt-md-gray'],
  'select-inactive-border-color': colors['md-gray'],

  'select-error-border-color': colors['dk-gray'],

  'radio-input-inactive-label-font-color': colors['lt-md-gray'],
  'radio-label-font-color': colors['dk-gray'],
  'radio-input-check-color': colors['dk-gray'],
  'radio-input-font-weight': 300,
  'radio-input-checked-font-weight': null,
  'radio-input-inactive-background-color': colors['ex-lt-gray'],
  'radio-input-inactive-check-color': colors['lt-md-gray'],

  'checkbox-border-color': colors['md-gray'],
  'checkbox-inactive-border-color': colors['lt-md-gray'],
  'checkbox-inactive-background-color': colors['ex-lt-gray'],
  'checkbox-inactive-label-font-color': colors['lt-md-gray'],
  'checkbox-error-border-color': colors['dk-gray'],
  'checkbox-label-font-weight': 300,
  'checkbox-label-font-color': colors['dk-gray'],

  'input-pre-label-text-transform': 'capitalize',
  'input-post-label-text-transform': 'capitalize',
  'input-active-label-text-transform': 'capitalize',
  'input-inactive-label-text-transform': 'capitalize',
  'input-error-label-text-transform': 'capitalize',
  'radio-label-text-transform': 'capitalize',
  'checkbox-label-text-transform': 'capitalize',

  'message-font-size': null,
  'message-message-line-height': null,
  'message-error-background-color': colors['error-bg-color'],
  'message-confirm-background-color': colors['success-bg-color'],
  'message-error-color': colors['error-color'],
  'message-confirm-color': colors['success-color'],
}
