import { discountsFragment } from './basket'
import { paymentDetailsFragment } from './order'

const addressFragment = ({
  name = '',
  address1 = '',
  address2 = '',
  address3 = '',
  address4 = '',
  country = '',
}) => ({
  name,
  address1,
  address2,
  address3,
  address4,
  country,
})

const priceFragment = (price) => (price ? price.toFixed(2) : '')

const deliveryPriceFragment = (deliveryPrice = 0) => deliveryPrice.toFixed(2)

const totalCostFragment = (totalCost = 0, currencySymbol) =>
  `${currencySymbol || ''}${Number(totalCost).toFixed(2)}`

// This function simply returns how much discount was applied to an order line, as WCS does not supply this.
// It returns false if anything is missing or if the price isn't discounted.
// nowPrice: current price of the item
// totalPrice: combined price of all items on the line with discounts subtracted.
const discountFragment = (nowPrice, quantity, totalPrice) => {
  if (
    !nowPrice ||
    !totalPrice ||
    !quantity ||
    nowPrice * quantity === totalPrice
  )
    return false
  return (nowPrice * quantity - totalPrice).toFixed(2)
}

const orderLineFragment = ({
  lineNo = '',
  name = '',
  size = '',
  productColour = '',
  baseImageUrl = '',
  imagePath = '',
  quantity = 0,
  unitPrice = 0,
  totalPrice = 0,
  nowPrice = 0,
  wasPrice,
  wasWasPrice,
  isDDPItem,
  discount_1: discount = '',
  trackNumber,
  retailStoreTrackingUrl,
  trackingAvailable,
}) => {
  const res = {
    lineNo,
    name,
    size,
    isDDPProduct: isDDPItem,
    colour: productColour,
    baseImageUrl,
    imageUrl: imagePath,
    quantity,
    unitPrice: priceFragment(unitPrice),
    total: priceFragment(totalPrice),
    nonRefundable: false,
    discount,
    retailStoreTrackingUrl,
    trackingAvailable,
  }

  const discountPrice = discountFragment(nowPrice, quantity, totalPrice)
  if (discountPrice) {
    res.discountPrice = discountPrice
  }

  // see https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/156926095/wasPrice+wasWasPrice+unitPrice
  if (wasPrice && wasWasPrice) {
    res.wasWasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
    res.wasPrice = wasWasPrice && !isNaN(wasWasPrice) && wasWasPrice.toFixed(2)
  } else if (wasPrice) {
    res.wasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
  }

  if (trackNumber) {
    res.trackingNumber = trackNumber
  }

  if (retailStoreTrackingUrl) {
    res.retailStoreTrackingUrl = retailStoreTrackingUrl
  }

  return res
}

const orderLinesFragment = (orderLines) => {
  if (orderLines && Array.isArray(orderLines)) {
    return orderLines.map((orderLine) => orderLineFragment(orderLine))
  }
  return []
}

const orderByIdTransform = (orderDetail = {}, currencySymbol = '') => {
  const {
    orderId = '',
    subTotal = 0,
    orderStatus = '',
    status = '',
    returnPossible = false,
    returnRequested = false,
    deliveryMethod = '',
    deliveryDate = '',
    deliveryCost = 0,
    deliveryCarrier = '',
    deliveryPrice = 0,
    isDDPOrder,
    totalOrderPrice = 0,
    totalOrdersDiscount = '',
    totalOrdersDiscountLabel = '',
    OrderDiscounts = [],
    billingAddress = {},
    deliveryAddress = {},
    orderLines = [],
    smsAlerts,
    deliveryType = '',
    isOrderFullyRefunded = false,
    giftCards = [],
    creditCard = {},
  } = orderDetail

  return {
    orderId,
    subTotal: priceFragment(subTotal),
    statusCode: orderStatus,
    status,
    returnPossible,
    returnRequested,
    deliveryMethod,
    deliveryDate,
    deliveryType,
    deliveryCost: priceFragment(deliveryCost),
    deliveryCarrier,
    deliveryPrice: deliveryPriceFragment(deliveryPrice),
    isDDPOrder,
    totalOrderPrice: priceFragment(totalOrderPrice),
    totalOrdersDiscount: priceFragment(totalOrdersDiscount),
    totalOrdersDiscountLabel,
    billingAddress: addressFragment(billingAddress),
    deliveryAddress: addressFragment(deliveryAddress),
    orderLines: orderLinesFragment(orderLines),
    paymentDetails: paymentDetailsFragment(
      creditCard,
      currencySymbol,
      giftCards
    ),
    smsNumber: smsAlerts,
    isOrderFullyRefunded,
    discounts: discountsFragment(OrderDiscounts, giftCards),
  }
}

export {
  addressFragment,
  priceFragment,
  deliveryPriceFragment,
  totalCostFragment,
  discountFragment,
  orderLinesFragment,
  orderLineFragment,
}

export default orderByIdTransform
