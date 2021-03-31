import {
  booleanTypeAny,
  booleanType,
  arrayType,
  numberType,
  objectType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypePattern,
  stringTypeEmpty,
  stringTypeNumber,
} from '../utilis'
import { errorResponseWithWcsCodeShema } from '../common.schema'

const requiredPropertiesHighLevel = [
  'orderId',
  'subTotal',
  'returnPossible',
  'returnRequested',
  'deliveryMethod',
  'deliveryDate',
  'deliveryCost',
  'deliveryCarrier',
  'deliveryPrice',
  'totalOrderPrice',
  'totalOrdersDiscountLabel',
  'totalOrdersDiscount',
  'billingAddress',
  'deliveryAddress',
  'orderLines',
  'paymentDetails',
  'currencyConversion',
  'returning_buyer',
  'productRevenue',
  'promoCodes',
  'userId',
  'isDDPOrder',
  'ddpPromotion',
  'discounts',
  'isGuestOrder',
]

const completedOrderHighLevelSchema = {
  orderId: numberType,
  subTotal: stringType,
  returnPossible: booleanTypeAny,
  returnRequested: booleanTypeAny,
  deliveryMethod: stringType,
  deliveryDate: stringType,
  deliveryCost: stringType,
  deliveryCarrier: stringType,
  deliveryPrice: stringType,
  totalOrderPrice: stringType,
  totalOrdersDiscountLabel: stringTypeCanBeEmpty,
  totalOrdersDiscount: stringTypeCanBeEmpty,
  billingAddress: objectType,
  deliveryAddress: objectType,
  orderLines: arrayType(1),
  paymentDetails: arrayType(1),
  currencyConversion: objectType,
  returning_buyer: booleanTypeAny,
  productRevenue: stringType,
  promoCodes: arrayType,
  userId: stringType,
  isDDPOrder: booleanTypeAny,
  ddpPromotion: objectType,
  discounts: arrayType,
  guestUserEmail: stringTypeCanBeEmpty,
  userType: stringType,
  isGuestOrder: booleanTypeAny,
}

const requiredPropertiesAddresses = [
  'address1',
  'name',
  'country',
  'address2',
  'address3',
  'address4',
]

const completedOrderBillingAddressSchema = {
  address1: stringType,
  name: stringType,
  country: stringType,
  address2: stringType,
  address3: stringType,
  address4: stringType,
}

const completedOrderDeliveryAddressSchema = {
  address1: stringType,
  name: stringType,
  country: stringType,
  address2: stringType,
  address3: stringType,
  address4: stringType,
}

const completedOrderPromoCodeSchema = {
  promotionCode: stringType,
  label: stringTypeCanBeEmpty,
}

const completedOrderDiscountsSchema = {
  label: stringType,
  value: stringType,
}

const requiredPropertiesOrderLines = [
  'lineNo',
  'productId',
  'name',
  'size',
  'colour',
  'imageUrl',
  'quantity',
  'unitPrice',
  'discount',
  'discountPrice',
  'total',
  'nonRefundable',
  'baseImageUrl',
  'isDDPProduct',
  'skuId',
  'ecmcCategory',
  'department',
  'reviewRating',
  'category',
  'brand',
  'wasPrice',
]
const completedOrderOrderLinesSchema = {
  lineNo: stringType,
  productId: stringType,
  name: stringType,
  size: stringType,
  colour: stringType,
  imageUrl: stringType,
  quantity: numberType,
  unitPrice: stringType,
  discount: stringTypeCanBeEmpty,
  discountPrice: stringType,
  total: stringType,
  nonRefundable: booleanTypeAny,
  baseImageUrl: stringType,
  isDDPProduct: booleanType(false),
  skuId: stringType,
  ecmcCategory: stringType,
  department: stringType,
  reviewRating: stringTypeCanBeEmpty,
  category: stringType,
  brand: stringTypeCanBeEmpty,
  wasPrice: stringTypeCanBeEmpty,
}

const completedOrderPaymentDetailsSchema = (cardType) => {
  return {
    paymentMethod: stringTypePattern(cardType),
    cardNumberStar: stringType,
    totalCost: stringType,
    totalCostAfterDiscount: stringType,
    selectedPaymentMethod: stringType,
  }
}

const completedOrderCurrencyConversionSchema = (currency) => {
  return {
    currencyRate: stringTypePattern(currency),
  }
}

const requiredPropertiesThreeDSecureV1 = ['vbvForm']
const threeDSecureV1Schema = {
  vbvForm: objectType,
}

const requiredPropertiesThreeDSecureV1VbvForm = [
  'termUrl',
  'originalTermUrl',
  'vbvForm', // Only used by the apps.
  'piId', // Opaque contents.
  'action',
  'md', // Opaque contents.
  'paReq', // Opaque contents.
]
const threeDSecureV1VbvFormSchema = {
  termUrl: stringType,
  originalTermUrl: stringType,
  vbvForm: stringTypePattern("^<form method='post'"),
  piId: stringTypePattern('^\\d+$'),
  action: stringType,
  md: stringType,
  paReq: stringType,
}

const requiredPropertiesThreeDSecureV2 = [
  'piId',
  'challengeWindowSize',
  'challengeJwt',
  'threeDSVersion',
  'challengeUrl',
]
const threeDSecureV2Schema = {
  piId: stringTypePattern('^\\d+$'),
  md: stringType,
  challengeWindowSize: stringTypePattern('^\\d+x\\d+$'),
  challengeJwt: stringType,
  threeDSVersion: stringTypePattern('^[12]\\.\\d+\\.\\d+$'),
  challengeUrl: stringType,
}

const requiredPropertiesClearPay = [
  'success',
  'paymentToken',
  'cardBrand',
  'orderId',
  'errorMessage',
  'expires',
  'policyId',
  'tranId',
]

const clearPaySchemaSuccess = {
  success: stringTypePattern('^true'),
  paymentToken: stringType,
  cardBrand: stringTypePattern('^CLRPY'),
  orderId: stringTypeNumber,
  errorMessage: stringTypeEmpty,
  expires: stringType,
  policyId: stringTypeNumber,
  tranId: stringTypeNumber,
}

const requiredPropertiesThreeDSecureV2Jwt = [
  'jti',
  'iat',
  'iss',
  'exp',
  'OrgUnitId',
  'ObjectifyPayload',
  'Payload',
  'ReturnUrl',
]
const threeDSecureV2JwtSchema = {
  jti: stringType,
  iat: numberType,
  iss: stringType,
  exp: numberType,
  OrgUnitId: stringType,
  ObjectifyPayload: booleanType(true),
  Payload: objectType,
  ReturnUrl: stringType,
}

const requiredPropertiesThreeDSecureV2JwtPayload = [
  'ACSUrl',
  'Payload',
  'TransactionId',
]
const threeDSecureV2JwtPayloadSchema = {
  ACSUrl: stringType,
  Payload: stringType,
  TransactionId: stringType,
}

const threeDSecureV2AuthenticationRejectedSchema = errorResponseWithWcsCodeShema(
  'Your transaction has been declined. Please refer to your card issuer for details.',
  'ISOReturnCode.5',
  424,
  'Failed Dependency'
)

export default {
  requiredPropertiesHighLevel,
  completedOrderHighLevelSchema,
  requiredPropertiesAddresses,
  completedOrderBillingAddressSchema,
  completedOrderDeliveryAddressSchema,
  requiredPropertiesOrderLines,
  completedOrderOrderLinesSchema,
  completedOrderPaymentDetailsSchema,
  completedOrderCurrencyConversionSchema,
  completedOrderPromoCodeSchema,
  completedOrderDiscountsSchema,
  requiredPropertiesThreeDSecureV1,
  threeDSecureV1Schema,
  requiredPropertiesThreeDSecureV1VbvForm,
  threeDSecureV1VbvFormSchema,
  requiredPropertiesThreeDSecureV2,
  threeDSecureV2Schema,
  requiredPropertiesThreeDSecureV2Jwt,
  threeDSecureV2JwtSchema,
  requiredPropertiesThreeDSecureV2JwtPayload,
  threeDSecureV2JwtPayloadSchema,
  threeDSecureV2AuthenticationRejectedSchema,
  requiredPropertiesClearPay,
  clearPaySchemaSuccess,
}
