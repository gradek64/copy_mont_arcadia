const base = require('./default-base')
const colors = require('./default-colors')

module.exports = {
  'cta-gutter': '10px',
  'cta-gutter-top': '5px',
  'cta-border-radius': '5px',
  'cta-border-width': '1px',
  'cta-box-shadow': 'none',
  'cta-font-family': base['font-family-primary'],
  'cta-letter-spacing': null,

  'cta-primary-background': colors.black,
  'cta-primary-border-color': colors.black,
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,
  'cta-primary-width-desktop': '170px',

  'cta-primary-hover-background': colors.black,
  'cta-primary-hover-border-color': colors.black,
  'cta-primary-hover-font-color': colors.white,
  'cta-primary-hover-font-weight': null,

  'cta-primary-active-background': colors.black,
  'cta-primary-active-border-color': colors.black,
  'cta-primary-active-font-color': colors.white,
  'cta-primary-active-font-weight': null,

  'cta-primary-inactive-background': colors['md-dk-gray'],
  'cta-primary-inactive-border-color': colors['md-dk-gray'],
  'cta-primary-inactive-font-color': colors.white,

  'cta-primary-is-active-background': null,
  'cta-primary-is-active-border-color': null,
  'cta-primary-is-active-font-color': null,

  'cta-primary-is-active-hover-background': null,
  'cta-primary-is-active-hover-border-color': null,
  'cta-primary-is-active-hover-font-color': null,

  'cta-secondary-background': colors.white,
  'cta-secondary-border-color': colors.black,
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors.black,
  'cta-secondary-font-size': null,

  'cta-secondary-hover-background': colors.white,
  'cta-secondary-hover-border-color': colors.black,
  'cta-secondary-hover-font-color': colors.black,
  'cta-secondary-hover-font-weight': null,

  'cta-secondary-active-background': colors.white,
  'cta-secondary-active-border-color': colors.black,
  'cta-secondary-active-font-color': colors.black,
  'cta-secondary-active-font-weight': null,

  'cta-secondary-inactive-background': colors['ex-lt-gray'],
  'cta-secondary-inactive-border-color': colors.black,
  'cta-secondary-inactive-font-color': colors.black,

  'cta-tertiary-background': colors['md-gray'],
  'cta-tertiary-border-color': colors['md-gray'],
  'cta-tertiary-border-width': '1px solid',
  'cta-tertiary-font-color': colors.black,
  'cta-tertiary-text-transform': 'uppercase',
  'cta-tertiary-text-decoration': null,
  'cta-tertiary-text-align': null,
  'cta-tertiary-width': null,
  'cta-tertiary-font-size': null,

  'cta-tertiary-hover-background': colors['md-gray'],
  'cta-tertiary-hover-border-color': colors['md-gray'],
  'cta-tertiary-hover-font-color': colors.black,
  'cta-tertiary-hover-font-weight': null,

  'cta-tertiary-active-background': colors['md-gray'],
  'cta-tertiary-active-border-color': colors['md-gray'],
  'cta-tertiary-active-font-color': colors.black,
  'cta-tertiary-active-font-weight': null,

  'cta-tertiary-inactive-background': colors['lt-gray'],
  'cta-tertiary-inactive-border-color': colors['lt-gray'],
  'cta-tertiary-inactive-font-color': colors.black,
}
