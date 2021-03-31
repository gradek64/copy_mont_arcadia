const colors = require('./ev-colors')

module.exports = {
  'accordion-header-padding': '15px',

  'accordion-expanded-header-background-color': colors['lt-gray'],

  'accordion-border-color': colors['md-gray'],

  'accordion-content-border-top': `1px solid ${colors['md-gray']}`,

  'accordion-title-text-transform': 'capitalize',

  'accordion-icon-primary-size': '18px',
  'accordion-icon-primary-rotation-collapsed': '-90deg',
  'accordion-icon-primary-rotation-expanded': '0',

  'accordion-icon-secondary-size': '18px',
  'accordion-icon-secondary-rotation-collapsed': '-90deg',
  'accordion-icon-secondary-rotation-expanded': '0',
}
