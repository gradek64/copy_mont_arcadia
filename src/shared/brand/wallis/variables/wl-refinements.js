const colors = require('./wl-colors')

module.exports = {
  'refinements-margin': '0',
  'refinements-header-border-bottom': `1px solid ${colors['lt-gray']}`,

  'refinements-close-icon-width': '40px',

  'refinements-header-padding': '16px 0',
  'refinements-title-margin-top': 0,
  'refinements-title-margin-bottom': 0,

  'refinements-clear-button-position': 'absolute',
  'refinements-clear-button-top': 0,
  'refinements-clear-button-left': 0,
  'refinements-clear-button-text-decoration': 'none',
  'refinements-clear-button-color': colors['md-dk-gray'],
  'refinements-clear-button-disabled-text-decoration': 'none',
  'refinements-clear-button-disabled-color': colors['lt-gray'],

  'refinements-clear-button-icon-image':
    'url("public/wallis/images/bin-icon.svg")',
  'refinements-clear-button-icon-width': '16px',
  'refinements-clear-button-icon-height': '18px',
  'refinements-clear-button-icon-margin-right': '4px',
  'refinements-clear-button-disabled-icon-opacity': 0.5,

  'refinements-items-header-font-weight': 400,
  'refinements-title-font-size': '1.8em',
  'refinements-title-font-weight': 100,

  'refinements-apply-button-padding': '0 0 12px',
  'refinements-apply-button-border-top': `1px solid ${colors['lt-gray']}`,
}
