const base = require('./wl-base')
const colors = require('./wl-colors')

module.exports = {
  'cta-border-radius': '0',
  'cta-border-width': '1px',
  'cta-box-shadow': 'none',
  'cta-font-family': base['font-family-primary'],

  'cta-primary-background': colors.terracotta,
  'cta-primary-border-color': colors.terracotta,
  'cta-primary-text-transform': 'capitalize',
  'cta-primary-font-color': colors.white,
  'cta-primary-font-weight': 'bold',

  'cta-primary-hover-background': colors.white,
  'cta-primary-hover-font-color': colors.terracotta,
  'cta-primary-hover-border-color': colors.terracotta,
  'cta-primary-hover-font-weight': '300',

  'cta-primary-active-background': colors.white,
  'cta-primary-active-border-color': colors.terracotta,
  'cta-primary-active-font-color': colors.terracotta,
  'cta-primary-active-font-weight': '300',

  'cta-primary-inactive-background': colors['terracotta-lt'],
  'cta-primary-inactive-border-color': colors['terracotta-lt'],
  'cta-primary-inactive-font-color': colors.terracotta,

  'cta-secondary-background': colors.black,
  'cta-secondary-border-color': 'transparent',
  'cta-secondary-text-transform': 'capitalize',
  'cta-secondary-font-color': colors.white,
  'cta-secondary-font-weight': 'bold',

  'cta-secondary-hover-background': colors.white,
  'cta-secondary-hover-font-color': colors.black,
  'cta-secondary-hover-border-color': colors.black,
  'cta-secondary-hover-font-weight': '300',

  'cta-secondary-active-background': colors.white,
  'cta-secondary-active-border-color': colors.black,
  'cta-secondary-active-font-color': colors.black,
  'cta-secondary-active-font-weight': '300',

  'cta-secondary-inactive-background': colors['lt-gray'],
  'cta-secondary-inactive-border-color': colors['lt-gray'],
  'cta-secondary-inactive-font-color': colors['md-gray'],

  'cta-tertiary-background': colors.white,
  'cta-tertiary-border-color': colors.black,
  'cta-tertiary-text-transform': 'capitalize',
  'cta-tertiary-font-color': colors.black,
  'cta-tertiary-font-weight': '300',

  'cta-tertiary-hover-background': colors.black,
  'cta-tertiary-hover-border-color': colors.black,
  'cta-tertiary-hover-font-color': colors.white,
  'cta-tertiary-hover-font-weight': 'bold',

  'cta-tertiary-active-background': colors.black,
  'cta-tertiary-active-border-color': colors.black,
  'cta-tertiary-active-font-color': colors.white,
  'cta-tertiary-active-font-weight': 'bold',

  'cta-tertiary-inactive-background': colors.white,
  'cta-tertiary-inactive-border-color': colors['md-gray'],
  'cta-tertiary-inactive-font-color': colors['md-gray'],
}
