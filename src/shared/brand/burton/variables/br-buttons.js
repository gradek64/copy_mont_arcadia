const base = require('./br-base')
const colors = require('./br-colors')

module.exports = {
  'cta-border-radius': '0',
  'cta-font-family': base['font-family-primary'],
  'cta-letter-spacing': '0.15em',

  'cta-primary-background': colors.black,
  'cta-primary-border-color': colors['dk-gray'],
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,

  'cta-primary-hover-background': colors['dk-gray'],
  'cta-primary-hover-border-color': colors['dk-gray'],
  'cta-primary-hover-font-color': colors.white,

  'cta-primary-active-background': colors['dk-gray'],
  'cta-primary-active-border-color': colors['dk-gray'],
  'cta-primary-active-font-color': colors.white,

  'cta-primary-inactive-background': colors['lt-md-gray'],
  'cta-primary-inactive-border-color': colors['lt-md-gray'],
  'cta-primary-inactive-font-color': colors.white,

  'cta-secondary-background': colors['lt-md-gray'],
  'cta-secondary-border-color': colors['lt-md-gray'],
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors.black,

  'cta-secondary-hover-background': colors['md-gray'],
  'cta-secondary-hover-border-color': colors['md-gray'],
  'cta-secondary-hover-font-color': colors.black,

  'cta-secondary-active-background': colors['md-gray'],
  'cta-secondary-active-border-color': colors['md-gray'],
  'cta-secondary-active-font-color': colors.black,

  'cta-secondary-inactive-background': colors.white,
  'cta-secondary-inactive-border-color': colors['lt-md-gray'],
  'cta-secondary-inactive-font-color': colors['md-gray'],

  'cta-tertiary-background': colors.white,
  'cta-tertiary-border-color': colors['dk-gray'],
  'cta-tertiary-text-transform': 'uppercase',
  'cta-tertiary-font-color': colors.black,

  'cta-tertiary-hover-background': colors.white,
  'cta-tertiary-hover-border-color': colors['lt-md-gray'],
  'cta-tertiary-hover-font-color': colors.black,

  'cta-tertiary-active-background': colors.white,
  'cta-tertiary-active-border-color': colors['lt-md-gray'],
  'cta-tertiary-active-font-color': colors.black,

  'cta-tertiary-inactive-background': colors.white,
  'cta-tertiary-inactive-border-color': colors['lt-md-gray'],
  'cta-tertiary-inactive-font-color': colors['md-gray'],
}
