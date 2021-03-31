import basketTransform from './basket'
import { detailsFragment } from './logon'
import { path, isEmpty } from 'ramda'
import {
  deliveryMethods,
  deliveryLocationDescriptions,
  deliveryMethodsMonty,
} from '../constants/orderSummary'
import { extractEncodedHTMLText } from '../../utils'
import espotsDesktopConstants from '../../../../shared/constants/espotsDesktop'
import { error } from '../../../lib/logger'

const checkIfBasketObjectWithError = (basket = {}) => {
  const products = path(['products', 'Product'], basket)
  if (
    (Array.isArray(products) &&
      products.find(
        (product) =>
          (product && product.outOfStock) ||
          (product && product.exceedsAllowedQty)
      )) ||
    basket.messageForBuyer
  ) {
    return basket
  }
}

const getDeliveryType = (deliveryLocations = []) => {
  if (Array.isArray(deliveryLocations)) {
    const location = deliveryLocations.find((obj = {}) => obj.selected === true)
    return location ? location.deliveryLocationType : false
  }
  return false
}

const deliveryPriceFragment = (price = '') => {
  if (price !== 0 && (!price || !Number(price))) return false
  return typeof price === 'string' ? Number(price).toFixed(2) : price.toFixed(2)
}

const expressDeliveryOptionFragment = ({
  shipModeId = '',
  dayText = '',
  dateText = '',
  nominatedDate = '',
  price = 'N/A',
  selected = '',
  enabled = false,
}) => ({
  dayText,
  dateText,
  nominatedDate,
  selected: selected === 'true' || selected === true,
  shipModeId: Number(shipModeId) || 0,
  price: deliveryPriceFragment(price) || 'N/A',
  enabled,
})

const expressDeliveryFragment = ({
  label = '',
  additionalDescription = '',
  deliveryDates = {},
  selected = '',
  enabled = false,
  price,
  shipCode,
}) => ({
  label,
  additionalDescription,
  selected: selected || false,
  deliveryType: deliveryMethodsMonty.homeExpress,
  deliveryOptions: Array.isArray(deliveryDates.deliveryOptions)
    ? deliveryDates.deliveryOptions
        .map(expressDeliveryOptionFragment)
        .filter((option) => !isNaN(option && option.price))
    : [],
  enabled,
  cost: typeof price === 'number' && price.toFixed(2),
  shipCode: typeof shipCode === 'string' && shipCode,
})

const deliveryMethodFragment = ({
  shipModeId = '',
  shipCode = '',
  label = '',
  selected = false,
  additionalDescription = '',
  deliveryOptions = [],
  enabled = false,
  price = null,
  nominatedDate,
  estimatedDeliveryDate = '',
}) => {
  const deliveryMethod = {
    shipModeId: Number(shipModeId) || 0,
    deliveryType: deliveryMethods[shipCode] || '',
    label,
    additionalDescription,
    selected,
    deliveryOptions,
    enabled,
    cost: deliveryPriceFragment(price) || 0,
    estimatedDeliveryDate,
  }

  // Match current scrApi response. ShipCodes are only present for these delivery methods
  if (
    shipCode === 'S' ||
    shipCode === 'Retail Store Standard' ||
    shipCode === 'Retail Store Collection'
  ) {
    deliveryMethod.shipCode = shipCode
  }

  if (typeof enabled !== 'undefined') {
    deliveryMethod.enabled = enabled
  }

  if (nominatedDate) {
    deliveryMethod.additionalDescription = `Collection date ${nominatedDate}`
  } else {
    deliveryMethod.additionalDescription = additionalDescription
  }

  return deliveryMethod
}

/**
 * The following logic is required to investigate ADP-195
 */
const checkForInvalidDeliveryMethodData = ({
  deliveryMethods,
  expressDelivery,
  transformedArray,
}) => {
  const hasDeliveryMethods =
    (Array.isArray(deliveryMethods) && deliveryMethods.length) ||
    expressDelivery

  const hasSelectedMethod = (methods) =>
    methods.find((method) => path(['selected'], method) === true)

  const hasSelectedDeliveryMethods = hasSelectedMethod(
    deliveryMethods.concat(expressDelivery)
  )

  if (hasDeliveryMethods && !hasSelectedDeliveryMethods) {
    error(
      'ADP-195 checkForInvalidDeliveryMethodData() Invalid deliveryMethods data: neither deliveryMethods nor expressDelivery are selected',
      {
        deliveryMethods,
        expressDelivery,
      }
    )
  }

  if (
    hasDeliveryMethods &&
    hasSelectedDeliveryMethods &&
    !hasSelectedMethod(transformedArray)
  ) {
    error(
      'ADP-195 checkForInvalidDeliveryMethodData() Invalid deliveryMethods data: neither deliveryMethods nor expressDelivery are selected after transformation',
      {
        deliveryMethods,
        expressDelivery,
        transformedArray,
      }
    )
  }
}
/**
 * end of ADP-195 logic
 */

const deliveryMethodsFragment = ({ deliveryMethods = [], expressDelivery }) => {
  if (!Array.isArray(deliveryMethods)) {
    error(
      `ADP-195 deliveryMethodsFragment() deliveryMethods is not an array, is actually of type ${typeof deliveryMethods}`,
      deliveryMethods
    )
  }

  if (Array.isArray(deliveryMethods)) {
    let shouldDumpArray = false

    deliveryMethods.forEach((deliveryMethod, index) => {
      if (deliveryMethod === undefined) {
        shouldDumpArray = true
        error(
          `ADP-195 deliveryMethodsFragment() deliveryMethod[${index}] is undefined, expected an object`
        )
      } else if (deliveryMethod === null) {
        shouldDumpArray = true
        error(
          `ADP-195 deliveryMethodsFragment() deliveryMethod[${index}] is null, expected an object`
        )
      } else if (Array.isArray(deliveryMethod)) {
        shouldDumpArray = true
        error(
          `ADP-195 deliveryMethodsFragment() deliveryMethod[${index}] is an array, expected an object`
        )
      } else if (Object.keys(deliveryMethod).length === 0) {
        shouldDumpArray = true
        error(
          `ADP-195 deliveryMethodsFragment() deliveryMethod[${index}] is an object with no keys`
        )
      }
    })

    if (shouldDumpArray) {
      error(
        'ADP-195 deliveryMethodsFragment() deliveryMethods failed array member type validation',
        deliveryMethods
      )
    }
  }

  const deliveryMethodsArray = deliveryMethods.map(deliveryMethodFragment)

  if (expressDelivery) {
    if (Array.isArray(expressDelivery)) {
      error(
        `ADP-195 deliveryMethodsFragment() expressDelivery is an array, expected an object`
      )
    } else if (Object.keys(expressDelivery).length === 0) {
      error(
        `ADP-195 deliveryMethodsFragment() expressDelivery is an object with no keys`
      )
    }

    deliveryMethodsArray.push(expressDeliveryFragment(expressDelivery))
  }

  checkForInvalidDeliveryMethodData({
    deliveryMethods,
    expressDelivery,
    transformedArray: deliveryMethodsArray,
  })

  return deliveryMethodsArray
}

const deliveryLocationLabelFragment = (
  location = '',
  deliveryLocationTypeForm = {}
) => {
  const textKey = path([location, 0], deliveryLocationDescriptions)
  const contentKey = path([location, 1], deliveryLocationDescriptions)
  if (!textKey || !contentKey) return ''
  return (
    `${deliveryLocationTypeForm[textKey]} ${extractEncodedHTMLText(
      deliveryLocationTypeForm[contentKey]
    )}` || ''
  )
}

const deliveryLocationMethodsFragment = (selected, deliveryoptionsform) => {
  if (selected) {
    if (typeof selected !== 'boolean') {
      error(
        `ADP-195 deliveryLocationMethodsFragment() 'selected' is truthy but not true, is actually of type ${typeof selected}`,
        selected
      )
    }

    return deliveryMethodsFragment(deliveryoptionsform)
  }
  return []
}

const deliveryLocationFragment = (
  { deliveryLocationType = '', selected = false, enabled = false },
  deliveryLocationTypeForm,
  deliveryoptionsform
) => ({
  deliveryLocationType,
  selected,
  enabled,
  // Label is simply the deliveryLocationType when there are no other delivery locations available
  label: deliveryLocationTypeForm
    ? deliveryLocationLabelFragment(
        deliveryLocationType,
        deliveryLocationTypeForm
      )
    : deliveryLocationType,
  deliveryMethods: deliveryLocationMethodsFragment(
    selected,
    deliveryoptionsform
  ),
})

const deliveryLocationsFragment = (
  deliveryLocationTypeForm,
  deliveryoptionsform
) => {
  const { deliveryLocations } = deliveryLocationTypeForm
  if (Array.isArray(deliveryLocations)) {
    return deliveryLocations.map((deliveryLocation) =>
      deliveryLocationFragment(
        deliveryLocation,
        deliveryLocationTypeForm,
        deliveryoptionsform
      )
    )
  }
  // The deliveryLocations array won't exist for international stores.
  // When that's the case, a default 'HOME' location must be generated instead.
  // This is done to match current scrAPI behaviour.
  return [
    deliveryLocationFragment(
      { deliveryLocationType: 'HOME', selected: true, enabled: true },
      null,
      deliveryoptionsform
    ),
  ]
}

const deliveryDetailsFragment = (deliveryoptionsform) => {
  const details = path(['deliveryDetails'], deliveryoptionsform)
  const addressDetailsId = Number(
    path(['selectedAddressID'], deliveryoptionsform)
  )
  return details && addressDetailsId
    ? { ...detailsFragment(details), addressDetailsId }
    : details
      ? detailsFragment(details)
      : null
}

const creditCardFragment = ({ type = '', cardNumberStar = '' } = {}) => ({
  type,
  cardNumberStar,
})

const addressNameFragment = (address = []) => {
  if (!Array.isArray(address)) return ''
  const filteredAddress = address.filter(
    (line) => line && typeof line === 'string'
  )
  if (filteredAddress.length) {
    const mappedAddress = filteredAddress
      .map((line) => line)
      .toString()
      .replace(/,/g, ', ') // foo,bar -> foo, bar
    return mappedAddress.length > 37
      ? mappedAddress.slice(0, 37).concat('...')
      : mappedAddress
  }
  return ''
}

const savedAddressFragment = ({
  addressId = 0,
  address1 = '',
  address2 = '',
  city = '',
  state = '',
  postcode = '',
  title = '',
  firstName = '',
  lastName = '',
  country = '',
  telephone = '',
  selected = false,
}) => ({
  id: addressId,
  addressName: addressNameFragment([address2, city, state, postcode, country]),
  selected,
  address1,
  address2,
  city,
  state,
  country,
  telephone,
  postcode,
  title,
  firstName,
  lastName,
})

const estimatedDeliveryFragment = ({ estimatedDelivery = '' } = {}) =>
  estimatedDelivery ? [estimatedDelivery.replace(/&.+?;/, ' ')] : [] // ['foo&nbsp;bar'] -> ['foo bar']

// This object should only appear if the user has selected a store.
const storeDetailsFragment = ({
  storeAddress1 = '',
  storeAddress2 = '',
  storeCity = '',
  storeState = '',
  shippingCountry = '',
  storePostCode = '',
  storeName = '',
}) => {
  if (
    !storeAddress1 &&
    !storeAddress2 &&
    !storeCity &&
    !storeState &&
    !shippingCountry &&
    !storePostCode &&
    !storeName
  ) {
    return false
  }
  return {
    address1: storeAddress1,
    address2: storeAddress2,
    city: storeCity,
    state: storeState,
    country: shippingCountry,
    postcode: storePostCode,
    storeName,
  }
}

const giftCardsFragment = (giftCardsWcs) => {
  if (!giftCardsWcs || !Array.isArray(giftCardsWcs)) return []

  return giftCardsWcs.map((giftCard) => {
    const {
      giftCardId,
      giftCardNumber,
      balance,
      amountUsed,
      remainingBalance,
    } = giftCard
    return {
      giftCardId,
      giftCardNumber,
      balance,
      amountUsed,
      remainingBalance,
    }
  })
}

const orderSummaryTransform = (
  {
    MiniBagForm,
    Basket,
    deliveryLocationTypeForm = {},
    deliveryoptionsform = false,
    OrderCalculateForm = {},
    OrderDeliveryOption = {},
    storedeliveryaddressform = {},
    deliveryaddressform = {},
    GiftCardsManagerForm = {},
    checkoutDiscountIntroEspot,
    isGuestOrder,
  } = {},
  isGuest = false,
  currencySymbol = ''
) => {
  const basket = MiniBagForm ? MiniBagForm.Basket : Basket

  const basketError = checkIfBasketObjectWithError(basket)
  if (basketError) return basketTransform(basketError, currencySymbol)

  const orderSummary = {
    isGuestOrder,
    basket: basketTransform(basket, currencySymbol),
    deliveryLocations: deliveryLocationsFragment(
      deliveryLocationTypeForm,
      deliveryoptionsform
    ),
    giftCards: giftCardsFragment(GiftCardsManagerForm.giftCards),
    deliveryInstructions: '',
    smsMobileNumber: '',
    // The following property (deliveryLocationTypeForm > deliveryCountry) has been added to handle correctly the selection of another country (e.g.: Sri Lanka).
    // The previous position (deliveryaddressform > shippingCountry) where we were grabbing the value was unchanged even in case of selection of another country.
    shippingCountry:
      path(['deliveryCountry'], deliveryLocationTypeForm) ||
      path(['shippingCountry'], deliveryaddressform) ||
      path(['deliveryDetails', 'address', 'country'], deliveryoptionsform) ||
      '', // non UK sites
    savedAddresses: Array.isArray(deliveryoptionsform.savedAddresses)
      ? deliveryoptionsform.savedAddresses.map(savedAddressFragment)
      : [],
    ageVerificationDeliveryConfirmationRequired: false,
    estimatedDelivery: estimatedDeliveryFragment(basket),
  }

  if (checkoutDiscountIntroEspot && !isEmpty(checkoutDiscountIntroEspot)) {
    orderSummary[
      espotsDesktopConstants.orderSummary.discountIntro
    ] = checkoutDiscountIntroEspot
  }

  const cardNumberHash = path(['CreditCard', 'cardNumber'], OrderCalculateForm)
  if (cardNumberHash) {
    orderSummary.cardNumberHash = cardNumberHash
  }

  const creditCard = path(['CreditCard'], OrderCalculateForm)
  if (creditCard) {
    orderSummary.creditCard = creditCardFragment(creditCard)
  }

  if (
    deliveryLocationTypeForm &&
    ['STORE', 'PARCELSHOP'].includes(
      getDeliveryType(deliveryLocationTypeForm.deliveryLocations)
    )
  ) {
    // If a registered user has not made a purchase before, these values from WCS are blank and they are not returned at all by scrAPI.
    const storeDetails = storeDetailsFragment(OrderDeliveryOption)
    if (storeDetails) {
      orderSummary.storeDetails = storeDetails
    }
    if (storedeliveryaddressform.field1) {
      orderSummary.deliveryStoreCode = storedeliveryaddressform.field1
    }
  }

  if (!isGuest) {
    const billingDetails = path(['billingDetails'], OrderCalculateForm)
    // 1st time checkout: WCS does not provide OrderCalculateForm.billingDetails and in that case the current contract
    // does not provide "billingDetails" property.
    if (billingDetails) {
      orderSummary.billingDetails = detailsFragment(billingDetails)
    }

    const deliveryDetails = deliveryDetailsFragment(deliveryoptionsform)
    if (deliveryDetails) {
      orderSummary.deliveryDetails = deliveryDetails
    }
  }

  if (isGuestOrder) {
    const guestUserEmailBillingDetails = path(
      ['billingDetails', 'email'],
      OrderCalculateForm
    )

    if (guestUserEmailBillingDetails) {
      orderSummary.email = guestUserEmailBillingDetails
    }
  }

  return orderSummary
}

export {
  deliveryPriceFragment,
  getDeliveryType,
  expressDeliveryOptionFragment,
  expressDeliveryFragment,
  deliveryMethodFragment,
  deliveryMethodsFragment,
  deliveryLocationLabelFragment,
  deliveryLocationMethodsFragment,
  deliveryLocationFragment,
  deliveryLocationsFragment,
  deliveryDetailsFragment,
  creditCardFragment,
  addressNameFragment,
  savedAddressFragment,
  estimatedDeliveryFragment,
  storeDetailsFragment,
  checkIfBasketObjectWithError,
  checkForInvalidDeliveryMethodData,
}

export default orderSummaryTransform
