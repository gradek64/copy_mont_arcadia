const colors = require('./dp-colors')

module.exports = {
  'size-option-item-width': '100%',
  'size-option-item-text-align': 'left',
  'size-option-item-font-weight': 'normal',
  'size-option-item-font-size': '0.8em',
  'size-option-item-padding': '16px 0 16px 20px',
  'size-option-item-border-width': '0 0 1px 0',
  'size-option-item-height': null,
  'size-option-item-color': colors['dk-gray'],

  'size-option-is-selected-background': colors.white,
  'size-option-is-selected-font-weight': 'bold',
  'size-option-is-selected-color': colors.black,
  'size-option-is-selected-after-content':
    'url("public/wallis/images/check-tick.svg")',
  'size-option-is-selected-after-display': 'inline-block',
}
