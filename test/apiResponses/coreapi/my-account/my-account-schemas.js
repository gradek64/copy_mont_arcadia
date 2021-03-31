import {
  booleanType,
  booleanTypeAny,
  nullType,
  numberType,
  numberTypePattern,
  objectType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeEmpty,
  stringTypeNumber,
  stringTypePattern,
} from '../utilis'

export const ddpRequiredProperties = [
  'isDDPUser',
  'isDDPRenewable',
  'ddpStartDate',
  'ddpEndDate',
  'wasDDPUser',
  'ddpCurrentOrderCount',
  'ddpPreviousOrderCount',
  'ddpCurrentSaving',
  'ddpPreviousSaving',
  'ddpStandardPrice',
  'ddpExpressDeliveryPrice',
]

export const ddpPropertiesSchema = {
  isDDPUser: booleanType(false),
  isDDPRenewable: booleanType(false),
  ddpStartDate: nullType,
  ddpEndDate: nullType,
  wasDDPUser: booleanType(false),
  ddpCurrentOrderCount: numberType,
  ddpPreviousOrderCount: numberType,
  ddpCurrentSaving: numberType,
  ddpPreviousSaving: numberType,
  ddpStandardPrice: numberType,
  ddpExpressDeliveryPrice: numberType,
}

export const fullAccountSchema = {
  title: 'My Account - User Full Profile Schema',
  type: 'object',
  required: [
    'exists',
    'email',
    'title',
    'firstName',
    'lastName',
    'userTrackingId',
    'subscriptionId',
    'basketItemCount',
    'creditCard',
    'deliveryDetails',
    'billingDetails',
    'version',
    'expId1',
    'expId2',
    'userId',
    'userToken',
    'success',
    ...ddpRequiredProperties,
  ],
  properties: {
    exists: booleanType(true),
    email: stringType,
    title: stringType,
    firstName: stringType,
    lastName: stringType,
    userTrackingId: numberType,
    subscriptionId: stringTypeCanBeEmpty,
    basketItemCount: numberType,
    creditCard: objectType,
    deliveryDetails: objectType,
    billingDetails: objectType,
    version: stringTypeNumber,
    expId1: stringType,
    expId2: stringType,
    userId: stringTypeCanBeEmpty,
    userToken: stringTypeCanBeEmpty,
    success: booleanTypeAny,
    ...ddpPropertiesSchema,
  },
}

export const partialAccountSchema = {
  title: 'My Account - User Partial Profile Schema',
  type: 'object',
  required: [
    'exists',
    'email',
    'title',
    'firstName',
    'lastName',
    'basketItemCount',
    'creditCard',
    'deliveryDetails',
    'billingDetails',
    'version',
    'hasCardNumberHash',
    'hasPayPal',
    'hasDeliveryDetails',
    'hasBillingDetails',
    'expId1',
    'expId2',
    'success',
    'userId',
    'userToken',
    ...ddpRequiredProperties,
  ],
  properties: {
    exists: booleanType(true),
    email: stringType,
    title: stringTypeEmpty,
    firstName: stringTypeEmpty,
    lastName: stringTypeEmpty,
    userTrackingId: numberType,
    subscriptionId: stringTypeEmpty,
    basketItemCount: numberType,
    creditCard: objectType,
    deliveryDetails: objectType,
    billingDetails: objectType,
    version: stringTypeNumber,
    hasCardNumberHash: booleanType(false),
    hasPayPal: booleanType(false),
    hasDeliveryDetails: booleanType(false),
    hasBillingDetails: booleanType(false),
    expId1: stringType,
    expId2: stringType,
    success: booleanTypeAny,
    userId: stringTypeCanBeEmpty,
    userToken: stringTypeCanBeEmpty,
    ...ddpPropertiesSchema,
  },
}

export const creditCardSchema = {
  title: 'My Account - User Full Profile Schema Credit Card Object Schema',
  type: 'object',
  required: [
    'type',
    'cardNumberHash',
    'cardNumberStar',
    'expiryMonth',
    'expiryYear',
  ],
  properties: {
    type: stringType,
    cardNumberHash: stringType,
    cardNumberStar: stringType,
    expiryMonth: stringType,
    expiryYear: stringType,
  },
}

export const partialCreditCardSchema = {
  ...creditCardSchema,
  properties: {
    ...creditCardSchema.properties,
    type: stringTypeEmpty,
    cardNumberHash: stringTypeEmpty,
    cardNumberStar: stringTypeEmpty,
    expiryMonth: stringTypeEmpty,
    expiryYear: stringTypeEmpty,
  },
}

export const thirdPartyPaymentSchema = (paymentType) => ({
  partialCreditCardSchema,
  properties: {
    ...partialCreditCardSchema.properties,
    type: stringTypePattern(paymentType),
  },
})

export const customerDetailsSchema = {
  title: 'My Account - User Full Profile Schema Billing Details Object Schema',
  type: 'object',
  required: ['addressDetailsId', 'nameAndPhone', 'address'],
  properties: {
    addressDetailsId: numberType,
    nameAndPhone: objectType,
    address: objectType,
  },
}

export const partialCustomerDetailsSchema = {
  ...customerDetailsSchema,
  properties: {
    ...customerDetailsSchema.properties,
    addressDetailsId: numberTypePattern(-1, -1),
  },
}

export const nameAndPhoneSchema = {
  title:
    'My Account - User Full Profile Schema Billing Details NameAndPhone Schema',
  type: 'object',
  required: ['lastName', 'telephone', 'title', 'firstName'],
  properties: {
    lastName: stringType,
    telephone: stringType,
    title: stringType,
    firstName: stringType,
  },
}

export const partialNameAndPhoneSchema = {
  ...nameAndPhoneSchema,
  properties: {
    ...nameAndPhoneSchema.properties,
    lastName: stringTypeEmpty,
    telephone: stringTypeEmpty,
    title: stringTypeEmpty,
    firstName: stringTypeEmpty,
  },
}

export const addressDetailsSchema = {
  title: 'My Account - User Full Profile Schema Billing Details Address Schema',
  type: 'object',
  required: ['address1', 'address2', 'city', 'state', 'country', 'postcode'],
  properties: {
    address1: stringType,
    address2: stringType,
    city: stringType,
    state: stringTypeEmpty,
    country: stringType,
    postcode: stringType,
  },
}

export const partialAddressDetailsSchema = {
  ...addressDetailsSchema,
  properties: {
    ...addressDetailsSchema.properties,
    address1: stringTypeEmpty,
    address2: stringTypeEmpty,
    city: stringTypeEmpty,
    state: stringTypeEmpty,
    country: stringTypeEmpty,
    postcode: stringTypeEmpty,
  },
}
