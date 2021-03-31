const typography = require('./ev-typography')

module.exports = {
  'ddp-icon-image': 'url(/assets/evans/images/ddp-icon.svg)',
  'ddp-header-container-colour': 'transparent',
  'ddp-content-border-top': 0,
  'ddp-border-width': '0',

  'ddp-is-active-banner-bg-color': '#dbceae',
  'ddp-is-active-banner-text-color': null,
  'ddp-is-active-banner-content-horizontal-alignment': 'flex-start',

  // ddp added
  'ddp-added-title-padding': '10px 0px 0px 0px',
  'ddp-added-title-font-weight': 'normal',
  'ddp-added-message-font-weight': 'lighter',
  'ddp-added-icon-margin': '0 20px 10px',
  'ddp-added-title-background-colour': '#DBCEAE',
  'ddp-added-content-background-color': 'rgba(219, 206, 174, 0.36)',
  'ddp-added-border': 'none',
  'ddp-added-title-font-color': '#333',

  // ddp expiry
  'ddp-renewal-font-weight-title': typography['font-weight-h1'],
  'ddp-renewal-font-weight-message': typography['font-weight-p'],
}
