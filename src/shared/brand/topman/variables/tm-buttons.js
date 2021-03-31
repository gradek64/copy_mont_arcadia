const base = require('./tm-base')
const colors = require('./tm-colors')

module.exports = {
  'cta-gutter': '20px',
  'cta-gutter-top': '20px',
  'cta-border-radius': '0',
  'cta-font-family': base['font-family-primary'],

  'cta-primary-background': colors.black,
  'cta-primary-border-color': colors.black,
  'cta-primary-text-transform': 'capitalize',
  'cta-primary-font-color': colors.white,

  'cta-primary-hover-background': colors.white,
  'cta-primary-hover-border-color': colors.black,
  'cta-primary-hover-font-color': colors.black,

  'cta-primary-active-background': colors.white,
  'cta-primary-active-border-color': colors.black,
  'cta-primary-active-font-color': colors.black,

  'cta-primary-inactive-background': colors.white,
  'cta-primary-inactive-border-color': colors['lt-md-gray'],
  'cta-primary-inactive-font-color': colors['lt-md-gray'],

  'cta-primary-is-active-background': colors['highlight-color'],
  'cta-primary-is-active-border-color': colors['highlight-color'],
  'cta-primary-is-active-font-color': colors.white,

  'cta-primary-is-active-hover-background': colors.white,
  'cta-primary-is-active-hover-border-color': colors['highlight-color'],
  'cta-primary-is-active-hover-font-color': colors['highlight-color'],

  'cta-secondary-background': colors.white,
  'cta-secondary-border-color': colors['lt-md-gray'],
  'cta-secondary-text-transform': 'capitalize',
  'cta-secondary-font-color': colors.black,

  'cta-secondary-hover-background': colors.white,
  'cta-secondary-hover-border-color': colors['lt-md-gray'],
  'cta-secondary-hover-font-color': colors.black,

  'cta-secondary-active-background': colors.white,
  'cta-secondary-active-border-color': colors['lt-md-gray'],
  'cta-secondary-active-font-color': colors.black,

  'cta-secondary-inactive-background': colors.white,
  'cta-secondary-inactive-border-color': colors['lt-md-gray'],
  'cta-secondary-inactive-font-color': colors['lt-md-gray'],

  'cta-tertiary-background': colors['highlight-color'],
  'cta-tertiary-border-color': colors['highlight-color'],
  'cta-tertiary-text-transform': 'capitalize',
  'cta-tertiary-font-color': colors.white,

  'cta-tertiary-hover-background': colors.white,
  'cta-tertiary-hover-border-color': colors['highlight-color'],
  'cta-tertiary-hover-font-color': colors['highlight-color'],

  'cta-tertiary-active-background': colors.white,
  'cta-tertiary-active-border-color': colors['highlight-color'],
  'cta-tertiary-active-font-color': colors['highlight-color'],

  'cta-tertiary-inactive-background': colors.white,
  'cta-tertiary-inactive-border-color': colors['lt-md-gray'],
  'cta-tertiary-inactive-font-color': colors['lt-md-gray'],
}
