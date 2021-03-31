export const orderSummaryConstants = ({ storeId, catalogId }) => ({
  page: '',
  URL:
    'OrderCalculate?updatePrices=1%26orderItemId*=%26quantity*=%26URL=BillingAddressView',
  returnPage: 'ShoppingBag',
  outOrderItemName: '',
  Proceed: '',
  CheckoutURL:
    'OrderCopy?URL=OrderPrepare%3fURL%3dOrderDisplay%26errorViewName=InvalidInputErrorView',
  PromoURL:
    'PromotionCodeManage?URL=OrderCalculate%3fURL%3dOrderPrepare%3fURL%3dOrderItemDisplay%26taskType=A%26errorViewName=OrderItemDisplayViewShiptoAssoc',
  shoppingBasketURL: `OrderCalculate?langId=-1%26storeId=${storeId}%26catalogId=${catalogId}%26updatePrices=1%26calculationUsageId=-1%26URL=OrderItemDisplay`,
  showCheckout: false,
})

export const guestOrderSummaryConstants = {
  new: 'Y',
  returnPage: 'ShoppingBag',
}

export const deliveryMethodsMonty = {
  homeStandard: 'HOME_STANDARD',
  homeExpress: 'HOME_EXPRESS',
  storeExpress: 'STORE_EXPRESS',
  storeStandard: 'STORE_STANDARD',
  storeImmediate: 'STORE_IMMEDIATE',
  parcelshopCollection: 'PARCELSHOP_COLLECTION',
}

export const deliveryMethods = {
  Standard: deliveryMethodsMonty.homeStandard,
  S: deliveryMethodsMonty.homeStandard,
  E: deliveryMethodsMonty.homeExpress,
  'Retail Store Express': deliveryMethodsMonty.storeExpress,
  'Retail Store Standard': deliveryMethodsMonty.storeStandard,
  'Retail Store Immediate': deliveryMethodsMonty.storeImmediate,
  'Retail Store Collection': deliveryMethodsMonty.parcelshopCollection,
}

export const deliveryLocationDescriptions = {
  HOME: ['homeDeliveryText', 'homeDeliveryContent'],
  STORE: ['storeDeliveryText', 'collectFromStoreContent'],
  PARCELSHOP: ['hermesDeliveryText', 'hermesContent'],
}

export const addDeliveryAddressConstants = {
  URL: 'ProcessDeliveryDetails',
  proceed: '',
  registerType: 'R',
  returnPage: 'ShoppingBag',
  isoCode: '',
  page: 'account',
  editRegistration: 'Y',
  editSection: '',
  outOrderItemName: '',
  actionType: 'updateCountryAndOrderItems',
  shipping_errorViewName: 'UserRegistrationForm',
  lookupHouseNumber: '',
  lookupPostcode: '',
  errorViewName: 'AddressUpdateAjaxView',
  preferredLanguage: '',
  preferredCurrency: '',
  sourcePage: '',
  montyUserAction: 'shipping',
  deliveryOptionType: 'H',
  preventAddressOverride: 'Y',
  addressResults: '',
}
