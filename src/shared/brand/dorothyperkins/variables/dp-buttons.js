const base = require('./dp-base')
const colors = require('./dp-colors')

module.exports = {
  'cta-border-radius': '0',
  'cta-font-family': base['font-family-primary'],
  'cta-letter-spacing': '1px',

  'cta-primary-background': colors.black,
  'cta-primary-border-color': null,
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,

  'cta-primary-hover-background': colors['highlight-color'],
  'cta-primary-hover-border-color': null,
  'cta-primary-hover-font-color': colors.white,

  'cta-primary-active-background': colors['highlight-color'],
  'cta-primary-active-border-color': null,
  'cta-primary-active-font-color': colors.white,

  'cta-primary-inactive-background': colors['ex-lt-gray'],
  'cta-primary-inactive-border-color': null,
  'cta-primary-inactive-font-color': colors.white,

  'cta-secondary-background': colors['lt-gray'],
  'cta-secondary-border-color': null,
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors.white,

  'cta-secondary-hover-background': colors['lt-md-gray'],
  'cta-secondary-hover-border-color': null,
  'cta-secondary-hover-font-color': colors.white,

  'cta-secondary-active-background': colors['lt-md-gray'],
  'cta-secondary-active-border-color': null,
  'cta-secondary-active-font-color': colors.white,

  'cta-secondary-inactive-background': colors['ex-lt-gray'],
  'cta-secondary-inactive-border-color': null,
  'cta-secondary-inactive-font-color': colors.white,

  'cta-tertiary-background': 'transparent',
  'cta-tertiary-border-color': colors['dk-gray'],
  'cta-tertiary-text-transform': 'uppercase',
  'cta-tertiary-font-color': colors['dk-gray'],

  'cta-tertiary-hover-background': 'transparent',
  'cta-tertiary-hover-border-color': colors['lt-md-gray'],
  'cta-tertiary-hover-font-color': colors['lt-md-gray'],

  'cta-tertiary-active-background': 'transparent',
  'cta-tertiary-active-border-color': colors['lt-md-gray'],
  'cta-tertiary-active-font-color': colors['lt-md-gray'],

  'cta-tertiary-inactive-background': 'transparent',
  'cta-tertiary-inactive-border-color': colors['ex-lt-gray'],
  'cta-tertiary-inactive-font-color': colors['ex-lt-gray'],
}
