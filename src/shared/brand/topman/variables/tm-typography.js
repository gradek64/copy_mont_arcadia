const base = require('./tm-base')
const colors = require('./tm-colors')

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

  'font-color-base': colors.black,
  'font-color-h1': colors.black,
  'font-color-h2': colors.black,
  'font-color-h3': colors.black,
  'font-color-h4': colors.black,
  'font-color-p': colors.black,
  'font-color-label': colors.black,

  'font-size-h1': '20px',
  'font-size-h2': '18px',
  'font-size-h3': '18px',
  'font-size-h4': '12px',
  'font-size-p': '14px',
  'font-size-button': '15px',
  'font-size-input': '16px',
  'font-size-label': '14px',

  'line-height-h1': '24px',
  'line-height-h2': '22px',
  'line-height-h3': '22px',
  'line-height-h4': '15px',
  'line-height-p': '17px',
  'line-height-button': '19px',
  'line-height-label': '20px',
  'line-height-input': '20px',

  'font-weight-h1': 900,
  'font-weight-h2': 700,
  'font-weight-h3': 700,
  'font-weight-h4': 700,
  'font-weight-h5': 700,
  'font-weight-button': 700,
  'font-weight-p': 300,
  'font-weight-input': 400,
  'font-weight-label': 400,
  'font-weight-300': 300,
  'font-weight-400': 400,
  'font-weight-700': 700,
  'font-weight-900': 900,

  'text-transform-h1': 'capitalize',
  'text-transform-h2': 'capitalize',
  'text-transform-h4': 'capitalize',
}
