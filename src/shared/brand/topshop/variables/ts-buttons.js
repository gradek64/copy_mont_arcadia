const base = require('./ts-base')
const colors = require('./ts-colors')

module.exports = {
  'cta-gutter': '10px',
  'cta-gutter-top': '10px',
  'cta-border-radius': '0',
  'cta-box-shadow': 'none',
  'cta-font-family': base['font-family-primary'],
  'cta-letter-spacing': '2px',

  'cta-primary-background': colors['dk-gray'],
  'cta-primary-border-color': colors['dk-gray'],
  'cta-primary-text-transform': 'uppercase',
  'cta-primary-font-color': colors.white,

  'cta-primary-hover-background': colors['md-dk-gray'],
  'cta-primary-hover-border-color': colors['md-dk-gray'],
  'cta-primary-hover-font-color': colors.white,

  'cta-primary-active-background': colors['md-dk-gray'],
  'cta-primary-active-border-color': colors['md-dk-gray'],
  'cta-primary-active-font-color': colors.white,

  'cta-primary-inactive-background': colors['md-gray'],
  'cta-primary-inactive-border-color': colors['md-gray'],
  'cta-primary-inactive-font-color': colors.white,

  'cta-secondary-background': colors.white,
  'cta-secondary-border-color': colors['dk-gray'],
  'cta-secondary-text-transform': 'uppercase',
  'cta-secondary-font-color': colors['dk-gray'],

  'cta-secondary-hover-background': colors['dk-gray'],
  'cta-secondary-hover-border-color': colors['dk-gray'],
  'cta-secondary-hover-font-color': colors.white,

  'cta-secondary-active-background': colors['dk-gray'],
  'cta-secondary-active-border-color': colors['dk-gray'],
  'cta-secondary-active-font-color': colors.white,

  'cta-secondary-inactive-background': colors.white,
  'cta-secondary-inactive-border-color': colors['md-gray'],
  'cta-secondary-inactive-font-color': colors['md-gray'],

  'cta-tertiary-text-align': 'left',
  'cta-tertiary-width': 'auto',

  'cta-tertiary-background': 'transparent',
  'cta-tertiary-border-color': 'transparent',
  'cta-tertiary-text-transform': 'uppercase',
  'cta-tertiary-font-color': colors['dk-gray'],

  'cta-tertiary-hover-background': 'transparent',
  'cta-tertiary-hover-border-color': 'transparent',
  'cta-tertiary-hover-font-color': colors['md-dk-gray'],

  'cta-tertiary-active-background': 'transparent',
  'cta-tertiary-active-border-color': 'transparent',
  'cta-tertiary-active-font-color': colors['md-dk-gray'],

  'cta-tertiary-inactive-background': 'transparent',
  'cta-tertiary-inactive-border-color': 'transparent',
  'cta-tertiary-inactive-font-color': colors['md-gray'],
}
