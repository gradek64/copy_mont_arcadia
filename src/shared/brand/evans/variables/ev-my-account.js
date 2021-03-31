const colors = require('./ev-colors')
const typography = require('./ev-typography')

const orderDetails = {
  'myorder-details-order-id-font-weight': typography['font-weight-thick'],
  'myorder-history-details-product-name-font-weight':
    typography['font-weight-thick'],
  'my-account-order-detail-summary-font-weight':
    typography['font-weight-thick'],
}

module.exports = {
  ...orderDetails,
  'myaccount-border-color': colors['lt-gray'],
  'myaccount-item-font-color': colors.black,
  'myaccount-item-order-number-font-weight': typography['font-weight-normal'],
  'myaccount-item-title-font-weight': typography['font-weight-normal'],
}
