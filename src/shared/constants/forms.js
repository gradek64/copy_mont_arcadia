export const formNames = {
  deliveryCheckout: {
    address: 'yourAddress',
    details: 'yourDetails',
    findAddress: 'findAddress',
  },
  deliveryMCD: {
    address: 'deliveryAddressMCD',
    details: 'deliveryDetailsAddressMCD',
    findAddress: 'deliveryFindAddressMCD',
  },
  billingCheckout: {
    address: 'billingAddress',
    details: 'billingDetails',
    findAddress: 'billingFindAddress',
  },
  billingMCD: {
    address: 'billingAddressMCD',
    details: 'billingDetailsAddressMCD',
    findAddress: 'billingFindAddressMCD',
  },
  payment: {
    paymentCardDetailsMCD: 'paymentCardDetailsMCD',
    paymentCardDetails: 'billingCardDetails',
  },
  addressBook: {
    address: 'newAddress',
    details: 'newDetails',
    findAddress: 'newFindAddress',
    deliverToAddress: 'newDeliverToAddress',
  },
}

export const maxLengthName = 60

// Regex below checks that a string does not match any of those special characters
export const specialChars =
  '^((?![\u00A0\u1680â€�‹\u180e\u2000-\u2009\u200aâ€‹\u200bâ€‹\u202f\u205fâ€‹\u3000\u00b0°\u2013–\u2014—\u2022•\u005c\\\u00a2¢\u20a9₩\u00a5¥\u00a7§\u00ab«\u00bb»\u201e„\u201c“\u201d”\u2026…\u00bf¿\u00a1¡\u2018‘\u2019’]).)*$'
