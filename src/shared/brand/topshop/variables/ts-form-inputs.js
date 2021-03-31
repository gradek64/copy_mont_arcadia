const colors = require('./ts-colors')
const typography = require('./ts-typography')

module.exports = {
  'input-border-radius': '0',
  'input-padding': '0 10px',
  'input-margin-vertical': '20px',
  'input-label-margin-left': '0',
  'form-element-height': '42px',
  'input-field-font-size': '16px',

  'input-pre-label-font-weight': typography['font-weight-300'],
  'input-pre-label-font-color': null,

  'input-post-label-font-weight': typography['font-weight-300'],
  'input-post-label-font-color': null,

  'input-active-label-font-weight': typography['font-weight-300'],
  'input-active-label-font-color': null,

  'input-inactive-label-font-weight': typography['font-weight-300'],
  'input-inactive-label-font-color': null,

  'input-error-label-font-weight': typography['font-weight-300'],
  'input-error-label-font-color': null,

  'input-placeholder-font-style': typography['font-weight-300'],
  'input-placeholder-font-color': colors['md-gray'],
  'input-placeholder-font-weight': '100',

  'input-pre-border-color': colors['md-dk-gray'],

  'input-post-border-color': colors['md-dk-gray'],
  'input-post-font-weight': typography['font-weight-300'],
  'input-post-font-color': colors['dk-gray'],

  'input-active-border-color': colors['md-dk-gray'],
  'input-active-font-weight': typography['font-weight-300'],
  'input-active-font-color': colors['dk-gray'],

  'input-inactive-border-color': colors['lt-md-gray'],
  'input-inactive-background': colors['lt-gray'],
  'input-inactive-font-weight': typography['font-weight-300'],
  'input-inactive-font-color': colors['md-gray'],

  'input-border-width': '1px',
  'input-error-border-color': colors['error-color'],
  'input-field-letter-spacing': '0.05em',

  'select-arrow-border-width': '0',
  'select-arrow-size': '50%',

  'select-letter-spacing': '0.05em',
  'select-pre-letter-spacing': '0.05em',
  'select-pre-font-color': colors['md-gray'],
  'select-pre-border-color': colors['md-dk-gray'],

  'select-post-font-color': colors['md-dk-gray'],
  'select-post-border-color': colors['md-dk-gray'],

  'select-active-font-color': colors['md-dk-gray'],
  'select-active-border-color': colors['md-dk-gray'],

  'select-inactive-arrow-opacity': '0.2',
  'select-inactive-background': colors.white,
  'select-inactive-font-color': colors['md-gray'],
  'select-inactive-border-color': colors['md-gray'],

  'select-error-border-color': null,

  'radio-input-check-color': colors['dk-gray'],
  'radio-input-font-weight': typography['font-weight-300'],
  'radio-input-checked-font-weight': typography['font-weight-300'],
  'radio-input-checked-padding': '2px',
  'radio-input-inactive-check-color': colors['md-gray'],
  'radio-input-inactive-label-font-color': colors['md-gray'],

  'radio-label-font-weight': typography['font-weight-300'],
  'radio-label-font-color': colors['dk-gray'],

  'checkbox-border-color': colors['md-gray'],
  'checkbox-checked-font-weight': typography['font-weight-300'],
  'checkbox-inactive-background-color': colors['ex-lt-gray'],
  'checkbox-inactive-border-color': colors['cb-lt-md-gray'],
  'checkbox-inactive-label-font-color': colors['cb-lt-md-gray'],
  'checkbox-label-font-weight': typography['font-weight-300'],
  'checkbox-label-font-color': colors['md-dk-gray'],
  'checkbox-label-line-height': '23px',

  'message-text-align': 'left',
  'message-padding-vertical': '5px',
  'message-padding-horizontal': '0',
  'message-margin-vertical': '3px',
  'message-margin-horizontal': '0',
  '$message-message-line-height': '16px',

  'message-confirm-line-height': '18px',
  'message-error-letter-spacing': '0.2px',
  'message-error-line-height': '16px',

  'message-error-color': colors['error-color'],
  'message-error-background-color': 'none',
  'message-confirm-color': colors['success-color'],
  'message-confirm-background-color': 'none',
  'message-error-font-size': '14px',
  'message-confirm-letter-spacing': '0.2px',

  'message-message-line-height': '16px',
  'input-error-message-font-size': '14px',
}
