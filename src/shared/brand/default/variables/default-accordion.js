const colors = require('./default-colors')

module.exports = {
  'accordion-header-font-color': null,
  'accordion-header-background-color': 'transparent',
  'accordion-header-padding': '10px',
  'accordion-header-align-items': null,

  'accordion-expanded-header-font-color': null,
  'accordion-expanded-header-background-color': 'transparent',

  'accordion-border-width': '1px 0',
  'accordion-border-color': colors['lt-md-gray'],

  'accordion-content-border-top': `1px solid ${colors['lt-md-gray']}`,

  'accordion-anim-time': '0.3s',

  'accordion-title-text-transform': 'none',

  'accordion-icon-size': '28px',
  // primary
  'accordion-icon-primary-size': '28px',
  'accordion-icon-primary-is-plus': false,
  'accordion-icon-primary-plus-background-color': null,
  'accordion-icon-primary-plus-color': colors.black,
  'accordion-icon-primary-plus-thickness': '2px',
  'accordion-icon-primary-rotation-collapsed': '0',
  'accordion-icon-primary-rotation-expanded': '-180deg',
  // secondary
  'accordion-icon-secondary-size': '28px',
  'accordion-icon-secondary-is-plus': false,
  'accordion-icon-secondary-plus-background-color': null,
  'accordion-icon-secondary-plus-color': colors.black,
  'accordion-icon-secondary-plus-thickness': '2px',
  'accordion-icon-secondary-rotation-collapsed': '0',
  'accordion-icon-secondary-rotation-expanded': '-180deg',
}
