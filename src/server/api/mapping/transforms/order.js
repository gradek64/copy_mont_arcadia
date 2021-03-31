import { assocPath, isEmpty, path, pathOr, pipe } from 'ramda'

import { getMatchingAttribute } from '../../../../shared/lib/product-utilities'
import { GCARD } from '../../../../shared/constants/paymentTypes'
import { discountsFragment } from './basket'
import { toTwoDecimalPlaces } from '../utils/genericUtils'

const orderEspotMap = {
  espot1: 'eMarketingEspot1URL',
  espot2EmailSignup: 'eMarketingEspot2URL',
  espot3SocialNetworking: 'eMarketingEspot3URL',
  espot4Peerius: 'eMarketingEspot4URL',
  espot5: 'eMarketingEspot5URL',
  espot6: 'eMarketingEspot6URL',
  espot7: 'eMarketingEspot7URL',
  espot8PaymentMethod: 'eMarketingKlarnaSpotURL',
}

const billingAddressFragment = ({
  title,
  firstName = '',
  lastName = '',
  address1 = '',
  address2 = '',
  city = '',
  zipCode = '',
  country = '',
  // Store Standard/Express
  PhyStoreBrandName = '',
  PhyStlocAddress1 = '',
  postcode = '',
} = {}) => {
  const commonRes = {
    address1,
    name: [title, firstName, lastName].filter((value) => value).join(' '),
    country,
  }
  return PhyStoreBrandName
    ? {
        ...commonRes,
        address1: `${PhyStoreBrandName} - ${PhyStlocAddress1}`,
        address2: address1,
        address3: city,
        address4: postcode,
      }
    : address2
      ? {
          ...commonRes,
          address2,
          address3: city,
          address4: zipCode,
        }
      : {
          ...commonRes,
          address2: city,
          address3: zipCode,
        }
}

const deliveryAddressFragment = ({
  nameAndPhone = {},
  AddressDetails = {}, // Home Standard/Express
  address = {}, // Store Standard/Express
} = {}) => {
  const addressInfo = Object.keys(AddressDetails).length
    ? AddressDetails
    : address

  return billingAddressFragment({ ...nameAndPhone, ...addressInfo })
}

const sumUpAllPromotions = (promotions) => {
  if (!Array.isArray(promotions)) return 0

  return promotions.reduce((pre, cur) => {
    return cur.totalDiscountedAmt && !isNaN(cur.totalDiscountedAmt)
      ? pre + parseFloat(cur.totalDiscountedAmt)
      : pre
  }, 0)
}

const extractReviewRating = (attributes, bazaarVoiceData) =>
  path(['AverageOverallRating'], attributes) ||
  path(['average'], bazaarVoiceData) ||
  ''

const extractDepartment = (attributes) => pathOr('', ['Department'], attributes)

const extractProductCategory = (attributes) =>
  getMatchingAttribute('ECMC_PROD_CE3_PRODUCT_TYPE', attributes) || ''

const extractProductBrand = (attributes) =>
  getMatchingAttribute('ECMC_PROD_CE3_BRAND', attributes) || ''

const orderLineFragment = ({
  lineNumber = '',
  skuId = '',
  productId = '',
  name = '',
  size = '',
  productColor = '',
  productImgURL = '',
  quantity = '0',
  totalPrice,
  promotions = [], // e.g.: "promotions": [{"totalDiscountedAmt": "-0.60000","discount": ""},{"totalDiscountedAmt": "-1.40000","discount": ""}]
  unitPrice,
  baseImageUrl,
  isDDPProduct = false,
  iscmCategory = '',
  attributes = {},
  bazaarVoiceData = {},
  wasPrice,
} = {}) => {
  const integerQuantity = parseInt(quantity, 10)

  return {
    lineNo: lineNumber,
    skuId,
    productId: productId ? productId.toString() : '',
    name,
    size,
    colour: productColor,
    imageUrl: productImgURL.replace('_small', '_thumb'),
    quantity: integerQuantity,
    unitPrice: toTwoDecimalPlaces(unitPrice),
    discount: pathOr('', [0, 'discount'], promotions), // [Cogz] ShowMyOrderForm.Products[].promotions[].discount (scrAPI picks first title and provides back in response)
    discountPrice: toTwoDecimalPlaces(sumUpAllPromotions(promotions) * -1), // [Cogz] ShowMyOrderForm.Products[].promotions[].totalDiscountedAmt  (sum up the totalDiscountedAmt given in promotions array)
    total: toTwoDecimalPlaces(totalPrice, '0.00'),
    nonRefundable: false, // [Cogz] ScrAPI uses different endpoint to get this one. Do we need this?
    ...(baseImageUrl && { baseImageUrl }),
    isDDPProduct,
    ecmcCategory: iscmCategory,
    department: extractDepartment(attributes),
    reviewRating: extractReviewRating(attributes, bazaarVoiceData),
    category: extractProductCategory(attributes),
    brand: extractProductBrand(attributes),
    wasPrice: toTwoDecimalPlaces(wasPrice),
  }
}

const orderLinesFragment = (products = []) => products.map(orderLineFragment)

const paymentDetailsFragment = (
  {
    CARD_BRAND_TEXT = '',
    grandTotalAmount = 0,
    paymentAmount = 0,
    cardNumberStar = '',
    selectedPaymentMethod = '',
  } = {},
  currencySymbol = '',
  giftCards = []
) => {
  const createTotal = (total) => {
    return `${currencySymbol}${toTwoDecimalPlaces(total, '0.00')}`
  }
  const createCardNumberString = (cardNumber) => {
    return cardNumber.replace(/\s+/g, '').replace(/X/g, '*')
  }

  const giftCardPaymentDetails = () => {
    const giftCardMapper = ({
      giftCardLabel,
      giftCardNumber,
      giftCardDeposit,
      remainingBalance,
      balance,
    }) => ({
      paymentMethod: giftCardLabel,
      cardNumberStar: createCardNumberString(giftCardNumber),
      totalCost: createTotal(giftCardDeposit),
      remainingBalance,
      balance,
      selectedPaymentMethod: GCARD,
    })

    return Array.isArray(giftCards) ? giftCards.map(giftCardMapper) : []
  }

  const paymentDetails = () => {
    const giftCardDetails = giftCardPaymentDetails()
    const cardMethodDetails = {
      paymentMethod: CARD_BRAND_TEXT,
      cardNumberStar: createCardNumberString(cardNumberStar),
      totalCost: createTotal(grandTotalAmount),
      totalCostAfterDiscount: createTotal(paymentAmount),
      selectedPaymentMethod,
    }

    return cardMethodDetails.selectedPaymentMethod !== GCARD
      ? [cardMethodDetails, ...giftCardDetails]
      : giftCardDetails
  }

  return paymentDetails()
}

const extractTotalOrderPrice = (OrderConfirmation) => {
  const grandTotalAmount = pathOr(
    null,
    ['creditCard', 'grandTotalAmount'],
    OrderConfirmation
  )

  return toTwoDecimalPlaces(grandTotalAmount)
}

const extractTotalOrderDiscountLabel = (OrderDiscounts) =>
  pathOr('', ['Discount', 0, 'label'], OrderDiscounts)

const extractTotalOrderDiscount = (OrderDiscounts) => {
  const discount = pathOr(null, ['Discount', 0, 'value'], OrderDiscounts)
  return discount === null ? '' : `${discount}`
}

const promotionFragment = ({
  promotionDescription = '',
  voucherCodes = '',
} = {}) => ({
  promotionCode: voucherCodes,
  label: promotionDescription,
})

const promoCodesFragment = (promoCodes = []) =>
  promoCodes.map(promotionFragment)

const isReturningBuyer = (url) => url.includes('returning_buyer%22%3A+true')

const calculateProductRevenue = pipe(
  (orderLines) =>
    orderLines.reduce(
      (total, orderLine) => total + orderLine.quantity * orderLine.unitPrice,
      0
    ),
  (total) => toTwoDecimalPlaces(total)
)

const orderTransform = (
  {
    OrderConfirmation = {},
    ShowMyOrderForm = {},
    totalBeforeDiscount,
    deliveryOptionPrice,
    nominatedDeliveryDate = '',
    qubitConfirmationURL = '',
    OrderDiscounts,
    currencyCode,
    deliveryDetails, // present for Store delivery,
    espots = {},
    promoCodes = [],
    userId = '',
  } = {},
  currencySymbol = '',
  currencyCodeFromStoreConfig = ''
) => {
  const { orderItems = [{}] } = OrderConfirmation || {}
  const orderLines = orderLinesFragment(ShowMyOrderForm.Products)
  const deliveryPrice = toTwoDecimalPlaces(deliveryOptionPrice, '0.00')

  let completedOrder = {
    orderId: OrderConfirmation.orderId || '',
    subTotal: toTwoDecimalPlaces(totalBeforeDiscount, '0.00'),
    returnPossible: false, // scrApi does multiple calls for this one, is this needed by the Client?
    returnRequested: false, // scrApi does multiple calls for this one, is this needed by the Client?
    deliveryMethod: pathOr('', [0, 'selectedDeliveryMethod'], orderItems),
    deliveryDate: nominatedDeliveryDate,
    deliveryCost: deliveryPrice,
    deliveryCarrier: pathOr('', [0, 'deliveryCarrier'], orderItems),
    deliveryPrice,
    totalOrderPrice: extractTotalOrderPrice(OrderConfirmation),
    totalOrdersDiscountLabel: extractTotalOrderDiscountLabel(OrderDiscounts),
    totalOrdersDiscount: extractTotalOrderDiscount(OrderDiscounts),
    discounts: discountsFragment(OrderDiscounts, OrderConfirmation.giftCards),
    billingAddress: billingAddressFragment(OrderConfirmation.billingDetails),
    deliveryAddress: deliveryAddressFragment(
      OrderConfirmation.deliveryDetails || deliveryDetails
    ),
    orderLines,
    productRevenue: calculateProductRevenue(orderLines),
    paymentDetails: paymentDetailsFragment(
      OrderConfirmation.creditCard,
      currencySymbol,
      OrderConfirmation.giftCards
    ),
    currencyConversion: {
      currencyRate: currencyCode || currencyCodeFromStoreConfig,
    },
    returning_buyer: isReturningBuyer(qubitConfirmationURL),
    promoCodes: promoCodesFragment(promoCodes),
    userId,
    isDDPOrder: pathOr(false, ['isDDPOrder'], OrderConfirmation),
    ddpPromotion: pathOr(
      {},
      ['OrderShippingDiscounts', 'Discount', 0],
      OrderConfirmation
    ),
    guestUserEmail: OrderConfirmation.email || '',
    /**
     * @description: The "userType" property returned in the response can have the following values:
     * "G": Guest order
     * "R": Returning customer placed an order
     * "A": Customer placed an order but not registered on same day
     * "S": Customer placed an order registering on same day
     */
    userType: OrderConfirmation.userType || '',
    isGuestOrder: OrderConfirmation.isGuestOrder,
    /**
     * @description: For a guest user the property "isRegisteredEmail" is returned.
     * This tells us if the email used for a guest order belongs to an existing user.
     */
    isRegisteredEmail: pathOr(undefined, ['accountExists'], OrderConfirmation),
  }

  Object.keys(espots).forEach((espot) => {
    if (!isEmpty(espots[espot])) {
      completedOrder = assocPath(
        ['espots', orderEspotMap[espot] || espot],
        espots[espot],
        completedOrder
      )
    }
  })

  return { completedOrder }
}

export {
  billingAddressFragment,
  deliveryAddressFragment,
  orderLineFragment,
  orderLinesFragment,
  paymentDetailsFragment,
  promoCodesFragment,
}

export default orderTransform
