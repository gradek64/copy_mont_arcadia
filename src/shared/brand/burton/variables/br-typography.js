const base = require('./br-base')
const colors = require('./br-colors')

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

  'font-size-h1': '17px',
  'font-size-h2': '16px',
  'font-size-input': '16px',

  'line-height-h1': '28px',
  'line-height-h2': base['line-height-base'],
  'line-height-p': base['line-height-base'],
  'line-height-input': base['line-height-base'],
  'line-height-label': base['line-height-base'],

  'font-color-base': colors.black,
  'font-color-h1': colors.black,
  'font-color-h2': colors.black,
  'font-color-h3': colors.black,
  'font-color-h4': colors.black,
  'font-color-p': colors.black,
  'font-color-label': colors.black,
  'font-color-input': colors.black,

  'font-weight-h1': '600',
  'font-weight-h2': '500',
  'font-weight-h3': 'normal',
  'font-weight-p': 'normal',
  'font-weight-button': 'bold',

  'text-transform-h1': 'capitalize',
  'text-transform-h2': 'capitalize',
  'text-transform-h3': 'capitalize',
  'text-transform-h4': 'capitalize',

  'letter-spacing-h1': '0.1em',
  'letter-spacing-h2': base['letter-spacing-base'],
  'letter-spacing-p': base['letter-spacing-base'],
  'letter-spacing-input': base['letter-spacing-base'],
  'letter-spacing-label': base['letter-spacing-base'],

  'word-spacing-h1': '0.1em',
}
