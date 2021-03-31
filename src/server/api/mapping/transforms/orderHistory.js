const priceFragment = (price = 0, currencySymbol) =>
  `${currencySymbol || ''}${price.toFixed(2)}`

const orderFragment = (
  {
    orderId = 0,
    orderPlacedTime = '',
    grandTotal = 0,
    orderStatus = '',
    status = '',
    returnPossible = false,
    returnRequested = false,
    isOrderDDPOnly = false,
  },
  currencySymbol
) => ({
  orderId,
  date: orderPlacedTime,
  total: priceFragment(grandTotal, currencySymbol),
  statusCode: orderStatus,
  status,
  returnPossible,
  returnRequested,
  isOrderDDPOnly,
})

const orderHistoryFragment = (orderHistory, currencySymbol) => {
  if (orderHistory && Array.isArray(orderHistory)) {
    return orderHistory.map((order) => orderFragment(order, currencySymbol))
  }
  return []
}

const orderHistoryTransform = (orderHistoryBody = {}, currencySymbol = '') => {
  const { orderHistory = [] } = orderHistoryBody
  return {
    orders: orderHistoryFragment(orderHistory, currencySymbol),
    version: '1.6',
  }
}

export { orderFragment, orderHistoryFragment, priceFragment }

export default orderHistoryTransform
