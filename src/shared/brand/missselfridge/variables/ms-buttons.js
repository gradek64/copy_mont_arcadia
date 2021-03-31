const base = require('./ms-base')
const colors = require('./ms-colors')
const typography = require('./ms-typography')

module.exports = {
  'cta-border-radius': '0',
  'cta-font-family': base['font-family-primary'],
  'font-size-button': '16px',
  'font-weight-button': typography['font-weight-button'],

  'cta-primary-background': colors.black,
  'cta-primary-border-color': colors.black,
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,

  'cta-primary-hover-background': colors['lt-gray'],
  'cta-primary-hover-border-color': colors['lt-gray'],
  'cta-primary-hover-font-color': colors.white,

  'cta-primary-active-background': colors['md-gray'],
  'cta-primary-active-border-color': colors['md-gray'],
  'cta-primary-active-font-color': colors.white,

  'cta-primary-inactive-background': colors['ex-lt-gray'],
  'cta-primary-inactive-border-color': colors['ex-lt-gray'],
  'cta-primary-inactive-font-color': colors['md-gray'],

  'cta-secondary-background': colors['lt-gray'],
  'cta-secondary-border-color': colors['lt-gray'],
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors['dk-gray'],

  'cta-secondary-hover-background': colors['md-gray'],
  'cta-secondary-hover-border-color': colors['md-gray'],
  'cta-secondary-hover-font-color': colors['dk-gray'],

  'cta-secondary-active-background': colors['md-gray'],
  'cta-secondary-active-border-color': colors['md-gray'],
  'cta-secondary-active-font-color': colors['dk-gray'],

  'cta-secondary-inactive-background': colors['ex-lt-gray'],
  'cta-secondary-inactive-border-color': colors['ex-lt-gray'],
  'cta-secondary-inactive-font-color': colors['md-gray'],

  'cta-tertiary-background': colors.white,
  'cta-tertiary-border-color': colors['md-gray'],
  'cta-tertiary-text-transform': 'uppercase',
  'cta-tertiary-font-color': colors['dk-gray'],
  'cta-tertiary-font-size': '12px',

  'cta-tertiary-hover-background': colors['lt-gray'],
  'cta-tertiary-hover-border-color': colors['lt-gray'],
  'cta-tertiary-hover-font-color': colors['dk-gray'],

  'cta-tertiary-active-background': colors['lt-gray'],
  'cta-tertiary-active-border-color': colors['lt-gray'],
  'cta-tertiary-active-font-color': colors['dk-gray'],

  'cta-tertiary-inactive-background': colors['ex-lt-gray'],
  'cta-tertiary-inactive-border-color': colors['ex-lt-gray'],
  'cta-tertiary-inactive-font-color': colors['dk-gray'],
}
