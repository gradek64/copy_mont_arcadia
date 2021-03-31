import { type, isEmpty, assocPath } from 'ramda'
import { imageSizes } from '../constants/basketConstants'
import { giftCardDiscountFragment } from './giftCard'

const productEspotList = [
  'Delivery1CSFI',
  'Delivery2HOMEEXPRESS',
  'Delivery3PARCELSHOP',
]

const emptyObjectEncoded = '%7B%7D'

/**
 * Temporary function to remove all the null values from each object in the inventorys array, to match scrAPI.
 * @todo This client should be removed after release and the client code to be changed to allow null values in the response
 * @param {Object} inventorys
 * @return {Object}
 */
const removeNullInventorysValues = (inventorys) =>
  inventorys.map((obj) => {
    const result = {}
    let key
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (key in obj) {
      const value = obj[key]
      if (key === 'expressdates' && value === null) {
        result[key] = []
      } else {
        result[key] = value
      }
    }
    return result
  })

/**
 * Temporary function to parse through the inventoryPositions object, and convert the catentntryId of each item to a string.
 * This is done to match the scrAPI response and respect the contract with the client.
 * @todo This function should be removed when the client and server can be coordinated, after release of the JSON/JSP endpoints. Ideally the value for catentryId should be a string (and its key should be 'catEntryId')
 * @param {Object} productDataQuantity
 * @return {Object}
 */
const prepareInventoryPositions = (productDataQuantity) => {
  const inventoryPositions = {}
  Object.keys(productDataQuantity).forEach((item) => {
    const result = {}
    const obj = productDataQuantity[item]
    let key
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (key in obj) {
      const value = obj[key]
      if (key === 'catentryId' && typeof value === 'number') {
        result[key] = value.toString()
      } else if (key === 'inventorys' && Array.isArray(value)) {
        result[key] = removeNullInventorysValues(value)
      } else {
        result[key] = value
      }
    }
    inventoryPositions[item] = result
  })
  return inventoryPositions
}

const restrictedDeliveryItemFragment = (products = {}) => {
  const { Product } = products
  if (Array.isArray(Product)) {
    return Product.some((item) => item.hasExcludedProducts)
  }
}

const ageVerificationRequiredFragment = (ageVerificationRequired = 'N') =>
  ageVerificationRequired === 'Y'

const assetsFragment = (imgUrl) => {
  if (!imgUrl || type(imgUrl) !== 'String') return []
  return imageSizes.map(({ assetType, sizeCode }) => {
    return {
      assetType,
      index: 1,
      url: decodeURIComponent(imgUrl)
        .replace('small', sizeCode.toLowerCase())
        .replace('Small', sizeCode),
    }
  })
}

const deliveryLabelFragment = (
  deliveryLabel,
  deliveryOptionPrice = 0,
  currencySymbol = '£'
) => {
  const output = []
  const price =
    type(deliveryOptionPrice) === 'Number'
      ? deliveryOptionPrice.toFixed(2)
      : deliveryOptionPrice
  if (deliveryLabel) output.push(deliveryLabel.trim())
  if (currencySymbol === '£' || currencySymbol === '$') {
    // £ and $ go before the price, price has a . (e.g. $50.20, £20.30)
    output.push(`${currencySymbol}${price}`)
  } else {
    // € (and others, presumably) go after the price, price has a , (even in Ireland). This matches legacy desktop. (e.g. 30,00 €)
    output.push(`${price.replace('.', ',')} ${currencySymbol}`)
  }
  return output.join(' ')
}

const mapDeliveryType = (deliveryOptionId) => {
  if (deliveryOptionId === 's' || deliveryOptionId === 'standard')
    return 'home_standard'
  if (/^n[1-7]$/.test(deliveryOptionId)) return 'home_express'
  if (deliveryOptionId === 'e') return 'home_express'
  if (deliveryOptionId === 'retail_store_standard') return 'store_standard'
  if (deliveryOptionId === 'retail_store_express') return 'store_express'
  if (deliveryOptionId === 'retail_store_immediate') return 'store_immediate'
  if (deliveryOptionId === 'retail_store_collection') return 'parcelshop'
  return ''
}

const deliveryOptionFragment = (
  {
    deliveryOptionId = 0,
    deliveryOptionPrice = 0,
    label = '',
    selected = false,
    enabled = false,
    deliveryShipCode = '',
  } = {},
  currencySymbol = '£'
) => {
  const formattedDeliveryOptionId = deliveryShipCode
    .toLowerCase()
    .replace(/ /g, '_')
  return {
    selected,
    deliveryOptionId,
    deliveryOptionExternalId: formattedDeliveryOptionId,
    type: mapDeliveryType(formattedDeliveryOptionId),
    label: deliveryLabelFragment(label, deliveryOptionPrice, currencySymbol),
    enabled,
    plainLabel: label ? label.trim() : '',
    shippingCost: deliveryOptionPrice,
  }
}

const deliveryOptionsFragment = (
  deliveryOptions = {},
  currencySymbol = '£'
) => {
  const { BasketDeliveryOption } = deliveryOptions
  if (Array.isArray(BasketDeliveryOption)) {
    return BasketDeliveryOption.map((option) => {
      return deliveryOptionFragment(option, currencySymbol)
    })
  }
  return []
}

const discountFragment = ({ value = 0, label = '' }) => ({
  value: Math.abs(value).toFixed(2),
  label,
})

const discountsFragment = (discounts = {}, giftCards = []) => {
  const basketDiscounts = []
  const Discount = discounts && discounts.Discount

  if (Array.isArray(Discount)) {
    basketDiscounts.push(...Discount.map(discountFragment))
  }
  if (Array.isArray(giftCards)) {
    basketDiscounts.push(...giftCards.map(giftCardDiscountFragment))
  }
  return basketDiscounts
}

const discountTextFragment = (Discounts = []) => {
  if (!Array.isArray(Discounts) || !Discounts[0]) return ''
  return (type(Discounts[0]) === 'Object' && Discounts[0].label) || ''
}

const itemsFragment = () => []

const priceFragment = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00'
}

const totalPriceFragment = (price, quantity) => {
  if (!price || !quantity || price * quantity <= 0) {
    return ''
  }
  return (price * quantity).toFixed(2)
}

const productFragment = (productArgument = {}) => {
  const {
    name = '',
    productId = false,
    catEntryId = false,
    orderItemId = false,
    shipModeId = false,
    lineNumber = '',
    size = '',
    quantity = 0,
    // The "lowstock" property will be available here if the stock for this product goes below the threshold (applies to all the products and is configurable per brand)
    // set on WCS to 3 for tsuk. The value of this property does NOT have any relation with the quantity of this product in the shopping bag.
    lowStock = false,
    inStock = true,
    unitPrice = 0,
    imageUrl = '',
    baseImageUrl,
    items = [],
    attributes = {},
    bundleProducts = [],
    colourSwatches = [],
    tpmLinks = [],
    bundleSlots = [],
    ageVerificationRequired = false,
    isBundleOrOutfit = false,
    wasWasPrice,
    wasPrice,
    discountText = '',
    PromotionDisplayURL = '',
    promoTitle = '',
    unfulfilledPromotionLabel = '',
    countryExcludedLabel: restrictedCountry,
    hasExcludedProducts: restrictedDeliveryItem,
    discounts: { Discount = [] } = {},
    itemTotal,
    iscmCategory,
    freeItem = false,
    isDDPItem,
    exceedsAllowedQty = undefined,
    sourceUrl,
  } = productArgument

  const product = {
    productId: productId && Number(productId),
    catEntryId: catEntryId && Number(catEntryId),
    orderItemId: orderItemId && Number(orderItemId),
    shipModeId: shipModeId && Number(shipModeId),
    lineNumber,
    size,
    name,
    quantity: quantity ? Number(quantity) : 0,
    inStock,
    unitPrice: priceFragment(unitPrice),
    totalPrice: itemTotal || totalPriceFragment(unitPrice, quantity),
    assets: assetsFragment(imageUrl),
    // The lowStock property provided by WCS is a boolean for the Basket section in order summary
    // and a string in the Basket response. We need to handle both until Karthi alignes the 2 to
    // be a boolean.
    lowStock: lowStock === 'true' || lowStock === true,
    items: itemsFragment(items),
    bundleProducts,
    attributes,
    colourSwatches,
    tpmLinks,
    bundleSlots,
    ageVerificationRequired,
    isBundleOrOutfit: !!isBundleOrOutfit,
    discountText,
    restrictedCountry,
    restrictedDeliveryItem,
    baseImageUrl,
    iscmCategory,
    freeItem,
    isDDPProduct: isDDPItem,
    exceedsAllowedQty,
    sourceUrl,
  }

  productEspotList.forEach((espot) => {
    if (productArgument[espot] && !isEmpty(productArgument[espot])) {
      product[espot] = productArgument[espot]
    }
  })

  // see https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/156926095/wasPrice+wasWasPrice+unitPrice
  if (wasPrice && wasWasPrice) {
    product.wasWasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
    product.wasPrice =
      wasWasPrice && !isNaN(wasWasPrice) && wasWasPrice.toFixed(2)
  } else if (wasPrice) {
    product.wasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
  }

  if (
    unfulfilledPromotionLabel &&
    promoTitle &&
    typeof PromotionDisplayURL === 'string'
  ) {
    product.promoTitle = promoTitle
    product.discountText = unfulfilledPromotionLabel

    // TODO: Create a route on the client to take the promoId as a parameter and display the relevant promotion PLP.
    // The client should just display static text in the meantime.
    const promoIdQuery = PromotionDisplayURL.match(/promoId=([0-9]+)($|&)/) // => [ 'promoId=123456&', '123456', '&', ... ]
    if (Array.isArray(promoIdQuery)) {
      product.promoId = promoIdQuery[1] && Number(promoIdQuery[1])
    }
  } else if (!isEmpty(Discount)) {
    product.discountText = discountTextFragment(Discount)
  }

  return product
}

const productsFragment = (products = {}) => {
  const { Product } = products
  if (Array.isArray(Product)) {
    return Product.map(productFragment)
  }
  return []
}

const promotionFragment = ({
  promotionDescription = '',
  promoCode = '',
} = {}) => ({
  promotionCode: promoCode,
  label: promotionDescription,
})

const promotionsFragment = (promotions = {}) => {
  const { promotionDetails } = promotions
  if (Array.isArray(promotionDetails)) {
    return promotionDetails.map(promotionFragment)
  }
  return []
}

const deliveryThresholdsJsonFragment = (espots = {}) => {
  // We don't control the espot name, this is handled by WCS.
  // 'shoppingBagProductRecommendations' is the name of the espot
  // brands use to store these values at the moment.
  const {
    shoppingBagProductRecommendations = { contentText: emptyObjectEncoded },
  } = espots

  const { contentText = emptyObjectEncoded } = shoppingBagProductRecommendations

  return contentText
}

const basketTransform = (
  {
    orderId = 0,
    total = 0,
    totalBeforeDiscount = 0,
    ageVerificationRequired = 'N',
    deliveryOptions = {},
    products = {},
    giftCards,
    productDataQuantity = {},
    discounts,
    PromotionCodeManageForm,
    savedProducts = [],
    espots = {},
    OrderDiscounts,
    isDDPOrder,
    isBasketResponse,
    isOrderCoveredByGiftCards,
    isGiftCardRedemptionEnabled,
    isGiftCardValueThresholdMet,
    giftCardRedemptionPercentage,
    isClearPayAvailable,
  } = {},
  currencySymbol = ''
) => {
  let basket = {
    orderId,
    subTotal: priceFragment(totalBeforeDiscount),
    total: priceFragment(total),
    totalBeforeDiscount: priceFragment(totalBeforeDiscount),
    deliveryOptions: deliveryOptionsFragment(deliveryOptions, currencySymbol),
    promotions: PromotionCodeManageForm
      ? promotionsFragment(PromotionCodeManageForm)
      : discountsFragment(discounts),
    discounts: discountsFragment(discounts || OrderDiscounts, giftCards),
    products: productsFragment(products),
    savedProducts,
    ageVerificationRequired: ageVerificationRequiredFragment(
      ageVerificationRequired
    ),
    restrictedDeliveryItem: restrictedDeliveryItemFragment(products),
    inventoryPositions: prepareInventoryPositions(productDataQuantity),
    isDDPOrder,
    isBasketResponse,
    isOrderCoveredByGiftCards,
    isGiftCardRedemptionEnabled,
    isGiftCardValueThresholdMet,
    giftCardRedemptionPercentage,
    deliveryThresholdsJson: deliveryThresholdsJsonFragment(espots),
    isClearPayAvailable,
  }

  const espotData = espots.shoppingBagTotalEspot
  if (espotData && !isEmpty(espotData)) {
    basket = assocPath(['espots', 'shoppingBagTotalEspot'], espotData, basket)
  }

  return basket
}

export {
  assetsFragment,
  ageVerificationRequiredFragment,
  deliveryLabelFragment,
  deliveryOptionFragment,
  deliveryOptionsFragment,
  discountFragment,
  discountsFragment,
  mapDeliveryType,
  priceFragment,
  productFragment,
  productsFragment,
  promotionFragment,
  promotionsFragment,
  totalPriceFragment,
  prepareInventoryPositions,
  restrictedDeliveryItemFragment,
  discountTextFragment,
  deliveryThresholdsJsonFragment,
}

export default basketTransform
