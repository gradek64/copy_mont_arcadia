import { htmlEntityToCurrencySymbol } from '../constants/currency'

const orderFragment = ({
  rmaId = '',
  storeStartDate = '',
  orderId = '',
  returnStatus = '',
  totalCredit = '',
  orderStatus = '',
  symbol = '',
} = {}) => ({
  orderId,
  date: storeStartDate,
  status: returnStatus,
  statusCode: orderStatus,
  total:
    totalCredit &&
    `${htmlEntityToCurrencySymbol[symbol] || symbol}${totalCredit.toFixed(2)}`,
  rmaId,
})

const returns = ({ returns = [] } = {}) => ({
  orders: returns.map(orderFragment),
  version: '1.7',
})

export { orderFragment, returns }

export default returns
