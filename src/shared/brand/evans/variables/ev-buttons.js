const base = require('./ev-base')
const colors = require('./ev-colors')
const typography = require('./ev-typography')

module.exports = {
  'cta-border-radius': '0',
  'cta-font-family': base['font-family-secondary'],

  'cta-primary-background': colors.black,
  'cta-primary-border-color': colors['lt-gray'],
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,
  'cta-letter-spacing': typography['letter-spacing-cta'],

  'cta-primary-active-background': colors['dk-gray'],
  'cta-primary-active-border-color': colors['lt-gray'],
  'cta-primary-active-font-color': colors.white,

  'cta-primary-hover-background': colors['dk-gray'],
  'cta-primary-hover-border-color': colors['lt-gray'],
  'cta-primary-hover-font-color': colors.white,

  'cta-primary-inactive-background': colors['md-gray'],
  'cta-primary-inactive-border-color': colors['lt-gray'],
  'cta-primary-inactive-font-color': colors.white,

  'cta-secondary-background': colors.white,
  'cta-secondary-border-color': colors.black,
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors.black,

  'cta-secondary-active-background': colors.black,
  'cta-secondary-active-border-color': colors.black,
  'cta-secondary-active-font-color': colors.white,

  'cta-secondary-hover-background': colors.black,
  'cta-secondary-hover-border-color': colors.black,
  'cta-secondary-hover-font-color': colors.white,

  'cta-secondary-inactive-background': colors.white,
  'cta-secondary-inactive-border-color': colors['lt-md-gray'],
  'cta-secondary-inactive-font-color': colors['lt-md-gray'],

  'cta-tertiary-background': 'transparent',
  'cta-tertiary-border-color': 'transparent',
  'cta-tertiary-text-transform': 'capitalize',
  'cta-tertiary-font-color': colors['md-gray'],
  'cta-tertiary-text-decoration': 'underline',
  'cta-tertiary-text-align': 'left',
  'cta-tertiary-width': 'auto',

  'cta-tertiary-hover-background': 'transparent',
  'cta-tertiary-hover-border-color': 'transparent',
  'cta-tertiary-hover-font-color': colors['md-gray'],

  'cta-tertiary-active-background': 'transparent',
  'cta-tertiary-active-border-color': 'transparent',
  'cta-tertiary-active-font-color': colors['md-gray'],

  'cta-tertiary-inactive-background': 'transparent',
  'cta-tertiary-inactive-border-color': 'transparent',
  'cta-tertiary-inactive-font-color': colors['md-gray'],
}
