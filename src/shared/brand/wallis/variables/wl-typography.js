const base = require('./wl-base')
const colors = require('./wl-colors')

module.exports = {
  'font-family-body': base['font-family-primary'],
  'font-family-h1': base['font-family-primary'],
  'font-family-h2': base['font-family-primary'],
  'font-family-h3': base['font-family-primary'],
  'font-family-h4': base['font-family-primary'],
  'font-family-p': base['font-family-primary'],
  'font-family-label': base['font-family-primary'],
  'font-family-input': base['font-family-primary'],
  'font-family-select': base['font-family-primary'],
  'font-family-button': base['font-family-primary'],

  'font-size-navigation': '1em',

  'font-color-base': colors.black,
  'font-color-h1': colors.black,
  'font-color-h2': colors.black,
  'font-color-h3': colors.black,
  'font-color-h4': colors.black,
  'font-color-p': colors.black,
  'font-color-label': colors.black,
  'font-color-input': colors.black,

  'font-size-h1': '30px',
  'font-size-h2': '22px',
  'font-size-h3': '18px',
  'font-size-h4': '15px',

  'font-weight-h1': 300,
  'font-weight-h2': 300,
  'font-weight-h3': 300,
  'font-weight-h4': 'normal',
  'font-weight-p': 300,
  'font-weight-input': 300,
  'font-weight-label': 300,

  'line-height-h3': '20px',
  'line-height-h4': '18px',

  'text-transform-h1': 'capitalize',
  'text-transform-h2': 'capitalize',
  'text-transform-h3': 'capitalize',
  'text-transform-h4': 'capitalize',
}
