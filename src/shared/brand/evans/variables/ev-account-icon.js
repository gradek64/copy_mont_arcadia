const typography = require('./ev-typography')

const accountIcon = {
  'account-icon-margin': '0 0 0 10px',
  'account-icon-margin-tablet': '0 0 0 10px',

  'account-icon-label-font-size': typography['font-size-header-link'],
  'account-icon-label-font-size-tablet': typography['font-size-header-link'],
  'account-icon-label-font-weight': typography['font-weight-link'],

  'account-icon-icon-width': '32px',
  'account-icon-icon-height': '27px',
  'account-icon-icon-width-tablet': '26px',
  'account-icon-icon-height-tablet': '22px',
  'account-icon-icon-image': 'url("/assets/evans/images/account.svg")',
  'account-icon-icon-image-active':
    'url("/assets/evans/images/account-active.svg")',
  'account-icon-icon-image-hover': null,
  'account-icon-icon-size': 'contain',

  'account-icon-popover-height': null,
  'account-icon-popover-width': '290px',
  'account-icon-popover-top': 'calc(100% + 10px)',
  'account-icon-popover-shadow': 'none',
  'account-icon-popover-border': '1px solid #000000',
  'account-icon-popover-border-color': '#000000',
  'account-icon-popover-email-display': null,
  'account-icon-popover-text-margin-bottom': null,
  'account-icon-popover-arrow-display': 'block',
  'account-icon-popover-before-top': '100%',
}

module.exports = Object.assign(accountIcon)
