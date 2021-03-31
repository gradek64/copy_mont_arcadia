import { htmlEntityToCurrencySymbol } from '../constants/currency'

const paymentDetailsFragment = (
  { refundType = '', payInfo = '', refundAmount = 0 } = {},
  currencySymbol = '£'
) => {
  const cardNumberIndex = payInfo.indexOf('cardNumberStar=')
  const cardNumberEnd = payInfo.indexOf(',', cardNumberIndex)
  return [
    {
      paymentMethod: refundType,
      cardNumberStar:
        cardNumberIndex !== -1
          ? payInfo.slice(
              cardNumberIndex + 15, // 'cardNumberStar='.length
              cardNumberEnd
            )
          : '',
      totalCost: `${currencySymbol}${refundAmount.toFixed(2)}`,
    },
  ]
}

const orderLineFragment = ({
  lineNumber = '',
  OrderDescriptionName = '',
  productColour = '',
  imageURL = '',
  rmaItemQuantity = 0,
  reasonReturn = '',
  unitPrice = 0,
  rmaItemTotalCredit = 0,
  definingAttributes1 = {},
} = {}) => {
  return {
    lineNo: lineNumber,
    name: OrderDescriptionName,
    size: definingAttributes1.size || '',
    colour: productColour,
    imageUrl: imageURL,
    returnQuantity: rmaItemQuantity,
    returnReason: reasonReturn,
    unitPrice: unitPrice.toFixed(2),
    discount: '',
    total: rmaItemTotalCredit.toFixed(2),
    nonRefundable: false,
  }
}

const returnDetails = ({
  rmaId = '',
  orderId = '',
  returnItemsCheckout: {
    Subtotal = 0,
    deliveryAmount = 0,
    total = 0,
    Discount = 0,
    symbol = '&pound;',
    orderItem = [],
  } = {},
  refundType = '',
  payInfo = '',
  refundAmount = 0,
} = {}) => {
  const currencySymbol = htmlEntityToCurrencySymbol[symbol]
  return {
    rmaId,
    orderId,
    subTotal: Subtotal.toFixed(2),
    deliveryPrice: deliveryAmount.toFixed(2),
    totalOrderPrice: total.toFixed(2),
    totalOrdersDiscountLabel: '',
    totalOrdersDiscount: Discount ? `${Discount.toFixed(2)}` : '',
    orderLines: orderItem.map(orderLineFragment),
    paymentDetails: paymentDetailsFragment(
      { refundType, payInfo, refundAmount },
      currencySymbol
    ),
  }
}

export { paymentDetailsFragment, orderLineFragment, returnDetails }

export default returnDetails
