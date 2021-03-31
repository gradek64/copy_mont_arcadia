const base = require('./dp-base')
const colors = require('./dp-colors')

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

  'font-size-h1': '22px',
  'font-size-h2': '20px',
  'font-size-h3': '18px',
  'font-size-h4': '16px',
  'font-size-h5': '15px',
  'font-size-h6': '14px',

  'font-size-button': '15px',
  'font-size-input': '16px',
  // 'font-size-h2': '1em',
  // 'font-size-h3': '0.85em',
  // 'font-size-h4': '1em',
  //
  'line-height-h1': '28px',
  'line-height-h2': '25px',
  'line-height-h3': '23px',
  'line-height-h4': '21px',
  'line-height-h5': '20px',
  'line-height-h6': '19px',

  // 'line-height-p': 1.5,
  'line-height-button': '19px',
  'line-height-input': '18px',
  'line-height-label': base['line-height-base'],
  'line-height-p': base['line-height-base'],

  'font-color-base': colors['dk-gray'],
  'font-color-h1': colors['dk-gray'],
  'font-color-h2': colors['dk-gray'],
  'font-color-h3': colors['dk-gray'],
  'font-color-h4': colors['dk-gray'],
  'font-color-p': colors['dk-gray'],
  'font-color-label': colors['dk-gray'],
  'font-color-input': colors['dk-gray'],

  'font-weight-h1': 'normal',
  'font-weight-h2': 'normal',
  'font-weight-h3': 'normal',
  'font-weight-h4': 'normal',
  'font-weight-h5': 'normal',
  'font-weight-h6': 'normal',
  'font-weight-p': base['font-weight-base'],

  'text-transform-h1': 'capitalize',
  'text-transform-h2': 'capitalize',
  'text-transform-h3': 'capitalize',
  'text-transform-h4': 'capitalize',
}
