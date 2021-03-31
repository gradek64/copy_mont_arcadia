const colors = require('./default-colors')

const myAccountMain = {
  'myaccount-border-color': null,
  'myaccount-divider-color': colors['lt-md-gray'],
  'myaccount-arrow-width': '12px',
  'myaccount-arrow-height': '16px',
  'myaccount-item-font-color': null,
  'myaccount-item-title-font-weight': null,
  'myaccount-item-title-text-transform': 'capitalize',
  'myaccount-item-title-spacing': '0.25em',
  'myaccount-item-order-number-font-weight': null,
  'myaccount-padding': '16px',
}

const myOrderDetails = {
  'myorder-details-products-list-margin-horizontal': '10px',
  'myorder-details-products-cell-padding-desktop': '10px',
  'myorder-details-address-icon-width': '40px',
  'myorder-details-order-id-font-weight': null,
  'myorder-history-details-product-name-font-weight': 'bold',
  'my-account-order-detail-summary-font-weight': 'bold',
}

module.exports = Object.assign(myAccountMain, myOrderDetails)
