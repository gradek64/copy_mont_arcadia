export const orderSummaryProduct = {
  productId: 21088572,
  sku: '602015000875263',
  quantity: 1,
}
export const orderSummaryAddProductSimpleOneSize = {
  productId: 21919934,
  sku: '602015000890858',
  quantity: 1,
}
export const orderSummaryUser = {
  username: 'orderSummaryUser@noqcprofile.com',
  password: 'test123',
}
export const storeStandardPayload = (orderId) => ({
  orderId,
  deliveryType: 'STORE_STANDARD',
  shippingCountry: 'United Kingdom',
  deliveryStoreCode: 'TS0032',
  storeAddress1: '60/64 The Strand',
  storeAddress2: '',
  storeCity: 'Strand',
  storePostcode: 'WC2N 5LR',
})

export const storeCFSNotSupportedPayload = (orderId) => ({
  orderId,
  deliveryType: 'STORE_STANDARD',
  shippingCountry: 'United Kingdom',
  deliveryStoreCode: 'TS9999',
  storeAddress1: '313/314 Almondvale South',
  storeAddress2: 'Almondvale South',
  storeCity: 'Livingston',
  storePostcode: 'EH54 6GS',
})

export const homeExpressPayload = (orderId) => ({
  orderId,
  deliveryType: 'HOME_EXPRESS',
  shippingCountry: 'United Kingdom',
  shipModeId: 28005,
})
export const storeExpressPayload = (orderId) => ({
  deliveryStoreCode: 'TM8137',
  deliveryType: 'STORE_EXPRESS',
  orderId,
  shipModeId: 45020,
  shippingCountry: 'United Kingdom',
  storeAddress1: '60/64 The Strand',
  storeAddress2: '',
  storeCity: 'Strand',
  storeCountry: 'United Kingdom',
  storePostcode: 'WC2N 5LR',
})

export const parcelshopPayload = (orderId) => ({
  orderId,
  deliveryType: 'PARCELSHOP_COLLECTION',
  shipModeId: 47524,
  shippingCountry: 'United Kingdom',
  deliveryStoreCode: 'S10873',
  storeAddress1: '456-459 Strand',
  storeAddress2: '',
  storeCity: 'Greater London',
  storePostcode: 'WC2R 0RG',
})

export const addNewDeliveryAddressDefault = {
  address: {
    address1: '3 Greenbank Place new Delivery Address Line 30000333',
    address2: null,
    city: 'DUNDEE',
    country: 'United Kingdom',
    postcode: 'DD2 2DD',
    state: '',
  },
  nameAndPhone: {
    title: 'Mr',
    firstName: 'newDeliveryAddressFirstName',
    lastName: 'newDeliveryAddressLastName',
    telephone: '07988888888',
  },
}

export const homeStandardPayload = (orderId) => ({
  orderId,
  deliveryType: 'HOME_STANDARD',
  shippingCountry: 'United Kingdom',
  shipModeId: 26504,
})

export const sriLankaOrderSummaryUser = {
  username: 'srilankauser1@qcprofile.com',
  password: 'test123',
}
export const trackedInternationalPayload = (orderId, shippingCountry) => ({
  orderId,
  deliveryType: 'HOME_STANDARD',
  shippingCountry,
  shipModeId: 33096,
})
export const standardInternationalPayload = (orderId, shippingCountry) => ({
  orderId,
  deliveryType: 'HOME_STANDARD',
  shippingCountry,
  shipModeId: 34054,
})
export const validGiftCard = {
  giftCardNumber: '6337850393340830',
  pin: '8776',
}
export const giftCardToCoverBasketTotal = {
  giftCardNumber: '6337850390837077',
  pin: '8228',
}
export const declinedGiftCard = {
  giftCardNumber: '1234567812345678',
  pin: '1234',
}
export const zeroBalanceGiftCard = {
  giftCardNumber: '6337850394538531',
  pin: '1653',
}
export const invalidGiftCardNumber = {
  giftCardNumber: 'invalidnumber',
  pin: '1234',
}
export const invalidPinNumberGiftCard = {
  giftCardNumber: '6337850393617021',
  pin: '',
}
export const invalidCurrencyGiftCard = {
  giftCardNumber: '6337858650619903',
  pin: '4048',
}
export const emptyGiftCard = {
  giftCardNumber: '',
  pin: '4048',
}
