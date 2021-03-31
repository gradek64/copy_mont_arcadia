export const hasDeliveryAddress = ({
  deliveryDetails = {},
  hasDeliveryDetails,
}) => {
  return deliveryDetails.addressDetailsId !== -1 || hasDeliveryDetails
}

export const hasCreditCard = ({
  creditCard: cc = {},
  hasCardNumberHash,
  hasPayPal,
}) => {
  return !!(
    cc.cardNumberHash ||
    ['PAYPAL', 'KLRNA'].includes(cc.type) ||
    hasCardNumberHash ||
    hasPayPal
  )
}
