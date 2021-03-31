import { createSelector } from 'reselect'
import {
  compose,
  defaultTo,
  equals,
  filter,
  identity,
  isNil,
  isEmpty,
  map,
  path,
  pathOr,
  pick,
  pluck,
  propOr,
  reject,
  without,
} from 'ramda'
import {
  findSelected,
  isStoreDeliveryLocation,
  isParcelShopDeliveryLocation,
  isStoreOrParcelDeliveryLocation,
  findParcelShopOption,
  deliveryConfig,
} from '../lib/checkout-utilities/delivery-options-utils'
import {
  isCard,
  setActiveStep,
} from '../../shared/lib/checkout-utilities/utils'
import { normaliseEstimatedDeliveryDate } from '../lib/checkout-utilities/order-summary'
import {
  getCheckoutOrderSummaryProductsWithInventory,
  isStandardDeliveryOnlyProduct,
} from './inventorySelectors'
import { getBrandName } from './configSelectors'
import {
  isFeatureCFSEnabled,
  isFeaturePUDOEnabled,
  isFeaturePSD2PunchoutPopupEnabled,
  isFeaturePSD2ThreeDSecure2Enabled,
} from './featureSelectors'
import { selectStoredPaymentDetails } from './common/accountSelectors'
import { getRoutePath } from './routingSelectors'
import { selectedDeliveryLocation } from '../lib/checkout-utilities/reshaper'
import { resolveStoreCodeType } from '../lib/store-utilities'
import { fixTotal } from '../lib/checkout-utilities/helpers'
import { formatForRadix } from '../lib/price'
import { getSelectedBrandFulfilmentStore } from '../reducers/common/selectedBrandFulfilmentStore'

// constants
import { formNames } from '../../shared/constants/forms'
import {
  NEW_CUSTOMER_STEPS,
  RETURNING_CUSTOMER_STEPS,
  GUEST_CUSTOMER_STEPS,
} from '../../shared/constants/progressTracker'
import * as paymentTypes from '../../shared/constants/paymentTypes'

// @TODO DELETE
const getFormNames = (type) => formNames[type]

const rootSelector = (state) => state.checkout || {}

export const getCheckoutOrderSummary = createSelector(
  rootSelector,
  ({ orderSummary }) => orderSummary || {}
)

// EXP-313
export const isStoreWithParcel = createSelector(
  rootSelector,
  ({ storeWithParcel }) => storeWithParcel || false
)

export const getCheckoutFinalisedOrder = createSelector(
  rootSelector,
  ({ finalisedOrder }) => finalisedOrder
)

export const getSavedAddresses = createSelector(
  getCheckoutOrderSummary,
  ({ savedAddresses }) => savedAddresses || {}
)

export const getCheckoutOrderSummaryBasket = createSelector(
  getCheckoutOrderSummary,
  ({ basket }) => basket || {}
)

export const getCheckoutAmount = (state) => {
  const { total } = getCheckoutOrderSummaryBasket(state)

  return total
}

export const getCheckoutOrderSummaryProducts = (state) => {
  const { products } = getCheckoutOrderSummaryBasket(state)

  return products || []
}

export const getCheckoutOrderSummaryPromotions = (state) => {
  const { promotions } = getCheckoutOrderSummaryBasket(state)

  return promotions || []
}

export const getCheckoutOrderSummaryShippingCountry = (state) => {
  const { shippingCountry } = getCheckoutOrderSummary(state)

  return shippingCountry
}

export const getCheckoutOrderSummaryDeliveryDetails = (state) => {
  const { deliveryDetails } = getCheckoutOrderSummary(state)

  return deliveryDetails || {}
}

export const getCheckoutOrderCompleted = createSelector(
  rootSelector,
  ({ orderCompleted }) => orderCompleted || {}
)

export const getCheckoutOrderLines = (state) => {
  const { orderLines } = getCheckoutOrderCompleted(state)

  return orderLines || []
}

export const getCheckoutOrderId = (state) => {
  const { orderId } = getCheckoutOrderCompleted(state)

  return orderId
}

export const getCheckoutUserId = (state) => {
  const { userId } = getCheckoutOrderCompleted(state)

  return userId
}

export const getCheckoutUserType = (state) => {
  const { userType } = getCheckoutOrderCompleted(state)

  return userType
}

export const getIsRegisteredEmail = (state) => {
  const { isRegisteredEmail } = getCheckoutOrderCompleted(state)

  return isRegisteredEmail
}

export const getCheckoutPromoCodes = (state) => {
  const { promoCodes } = getCheckoutOrderCompleted(state)

  return promoCodes || []
}

export const getCheckoutTotalOrderPrice = (state) => {
  const { totalOrderPrice } = getCheckoutOrderCompleted(state)

  return totalOrderPrice
}

export const getCheckoutTotalOrderDiscount = (state) => {
  const { totalOrdersDiscount } = getCheckoutOrderCompleted(state)

  return totalOrdersDiscount
}

export const getCheckoutProductRevenue = (state) => {
  const { productRevenue } = getCheckoutOrderCompleted(state)

  return productRevenue
}

export const getCheckoutPaymentDetails = (state) => {
  const { paymentDetails } = getCheckoutOrderCompleted(state)

  return paymentDetails || []
}

export const getCheckoutDeliveryAddress = (state) => {
  const { deliveryAddress } = getCheckoutOrderCompleted(state)

  return deliveryAddress || {}
}

export const getCheckoutDeliveryMethod = (state) => {
  const { deliveryMethod } = getCheckoutOrderCompleted(state)

  return deliveryMethod
}

export const getCheckoutDeliveryPrice = (state) => {
  const { deliveryPrice } = getCheckoutOrderCompleted(state)

  return deliveryPrice
}

export const getCheckoutOrderError = (state) => {
  const { orderError } = rootSelector(state)

  return orderError
}

export const getCheckoutOrderErrorPaymentDetails = (state) => {
  const { orderErrorPaymentDetails } = rootSelector(state)

  return orderErrorPaymentDetails
}

export const getCheckoutDeliveryStore = (state) => {
  const { deliveryStore } = rootSelector(state)

  return deliveryStore
}

export const getCheckoutOrderCompletedDeliveryStoreCode = (state) => {
  const { deliveryStoreCode } = getCheckoutOrderCompleted(state)

  return deliveryStoreCode
}

export const getDDPPromotion = (state) => {
  const { ddpPromotion } = getCheckoutOrderCompleted(state)
  return ddpPromotion || {}
}

export const getCheckoutPrePaymentConfig = (state) => {
  const { prePaymentConfig } = rootSelector(state)

  return prePaymentConfig
}

export const isGuestOrder = (state) => {
  const { isGuestOrder } = getCheckoutOrderSummary(state)

  return isGuestOrder
}

export const shouldMountDDCIFrame = createSelector(
  (state) => isFeaturePSD2PunchoutPopupEnabled(state),
  (state) => isFeaturePSD2ThreeDSecure2Enabled(state),
  getCheckoutPrePaymentConfig,
  (isPSD2PunchoutPopupEnabled, isPSD2ThreeDSecure2Enabled, prePaymentConfig) =>
    Boolean(
      isPSD2PunchoutPopupEnabled &&
        isPSD2ThreeDSecure2Enabled &&
        prePaymentConfig
    )
)

export const getCheckoutOrderCountry = createSelector(
  getCheckoutOrderSummaryShippingCountry,
  getCheckoutOrderSummaryDeliveryDetails,
  (orderSummaryShippingCountry, checkoutOrderSummaryDeliveryDetails) =>
    path(['address', 'country'], checkoutOrderSummaryDeliveryDetails) ||
    checkoutOrderSummaryDeliveryDetails.country ||
    orderSummaryShippingCountry
)

export const orderContainsOutOfStockProduct = createSelector(
  getCheckoutOrderSummaryProducts,
  (products) =>
    products.filter((product) => product.inStock === false).length > 0
)

export const orderContainsPartiallyOutOfStockProduct = createSelector(
  getCheckoutOrderSummaryProducts,
  (products) =>
    products.filter((product) => product.exceedsAllowedQty).length > 0
)

export const orderContainsStandardDeliveryOnlyProduct = createSelector(
  getCheckoutOrderSummaryProductsWithInventory,
  (products) =>
    Array.isArray(products) &&
    products.filter((product) => isStandardDeliveryOnlyProduct(product))
      .length > 0
)

export const isOutOfStock = (state) =>
  orderContainsOutOfStockProduct(state) ||
  orderContainsPartiallyOutOfStockProduct(state)

// TODO: convert following selector using reselect (live above selectors) when touched

const getDeliveryLocations = (state) => {
  const isCFSEnabled = isFeatureCFSEnabled(state)
  const isPUDOEnabled = isFeaturePUDOEnabled(state)
  const deliveryLocations = pathOr(
    [],
    ['checkout', 'orderSummary', 'deliveryLocations'],
    state
  )
  return deliveryLocations.filter(
    ({ deliveryLocationType }) =>
      deliveryLocationType === 'HOME' ||
      (deliveryLocationType === 'STORE' && isCFSEnabled) ||
      (deliveryLocationType === 'PARCELSHOP' && isPUDOEnabled)
  )
}

const getSelectedDeliveryLocation = compose(
  defaultTo(null),
  findSelected,
  getDeliveryLocations
)

function getSelectedDeliveryLocationType(state) {
  const selectedDeliveryLocation = getSelectedDeliveryLocation(state)
  return propOr(null, 'deliveryLocationType', selectedDeliveryLocation)
}

function selectedDeliveryLocationTypeEquals(state, deliveryLocationType) {
  return equals(getSelectedDeliveryLocationType(state), deliveryLocationType)
}

const getSelectedDeliveryMethod = compose(
  defaultTo(null),
  findSelected,
  pathOr([], ['deliveryMethods']),
  getSelectedDeliveryLocation
)

const getSelectedDeliveryOptionFromBasket = compose(
  defaultTo(null),
  findSelected,
  pathOr([], ['checkout', 'orderSummary', 'basket', 'deliveryOptions'])
)

function hasCheckedOut(state) {
  return Object.keys(state.checkout.orderSummary).length > 0
}

const getAddressForm = (addressType, state) => {
  const addressFormKey = (getFormNames(addressType) || {}).address
  return pathOr({}, ['forms', 'checkout', addressFormKey], state)
}

// @TODO REFACTOR
const getDetailsForm = (detailsType, state) => {
  const detailsFormKey = (getFormNames(detailsType) || {}).details
  return pathOr({}, ['forms', 'checkout', detailsFormKey], state)
}

const getFindAddressForm = (findAddressType, state) => {
  const detailsFormKey = (getFormNames(findAddressType) || {}).findAddress
  return pathOr({}, ['forms', 'checkout', detailsFormKey], state)
}

const isManualAddress = (addressType, state) => {
  return pathOr(false, ['findAddress', 'isManual'], state)
}

// @TODO DELETE
const isQASCountry = (addressType, state) => {
  const addressForm = getAddressForm(addressType, state)
  const country =
    path(['fields', 'country', 'value'], addressForm) ||
    path(['checkout', 'orderSummary', 'shippingCountry'], state)
  return !!path(['config', 'qasCountries', country], state)
}

// @TODO DELETE
const findAddressIsVisible = (addressType, state) =>
  !isManualAddress(addressType, state) && isQASCountry(addressType, state)

function isDeliveryEditingEnabled(state) {
  return pathOr(
    false,
    ['checkout', 'deliveryAndPayment', 'deliveryEditingEnabled'],
    state
  )
}

function isDeliveryStoreChosen(state) {
  const deliveryStore = pathOr('', ['checkout', 'deliveryStore'], state)
  return !isEmpty(deliveryStore)
}

function isStoreDelivery(state) {
  return isStoreDeliveryLocation(getSelectedDeliveryLocation(state))
}

function isParcelDelivery(state) {
  return isParcelShopDeliveryLocation(getSelectedDeliveryLocation(state))
}

function isStoreOrParcelDelivery(state) {
  return isStoreOrParcelDeliveryLocation(getSelectedDeliveryLocation(state))
}

function getUseDeliveryAsBilling(store) {
  return pathOr(false, ['checkout', 'useDeliveryAsBilling'], store)
}

export const getBasketDeliveryOptions = (state) => {
  return pathOr(
    [],
    ['checkout', 'orderSummary', 'basket', 'deliveryOptions'],
    state
  )
}

export const formatDeliveryOptions = (state) => {
  const basketDeliveryOptions = getBasketDeliveryOptions(state)
  return basketDeliveryOptions.reduce((deliveryType, elem) => {
    deliveryType[elem.type] = elem
    return deliveryType
  }, {})
}

const getEnrichedDeliveryLocations = (state) => {
  const deliveryLocations = getDeliveryLocations(state)
  const brandName = getBrandName(state)
  const formattedDeliveryOptions = formatDeliveryOptions(state)

  const deliveryOptions = {
    HOME: {
      title: 'Home Delivery',
      description: pathOr(
        '',
        ['home_standard', 'plainLabel'],
        formattedDeliveryOptions
      ),
      additionalDescription: formattedDeliveryOptions.home_express
        ? 'Next or Named Day Delivery'
        : '',
      iconUrl: `/assets/${brandName}/images/lorry-icon.svg`,
    },
    STORE: {
      title: 'Collect from Store',
      description: pathOr(
        '',
        ['store_standard', 'plainLabel'],
        formattedDeliveryOptions
      ),
      additionalDescription: formattedDeliveryOptions.store_express
        ? 'Express Delivery (next day)'
        : '',
      iconUrl: `/assets/${brandName}/images/cfs.svg`,
    },
    PARCELSHOP: {
      title: 'Collect from ParcelShop',
      description: 'Thousands of local shops open early and late',
      additionalDescription: '',
      iconUrl: `/assets/${brandName}/images/hermes-icon.svg`,
    },
  }

  return deliveryLocations.map((location) => {
    const option = deliveryOptions[location.deliveryLocationType]
    const enrichedDeliveryLocation = { ...location, ...option }
    return enrichedDeliveryLocation
  })
}

function getSelectedDeliveryStoreType(state) {
  const { deliveryStoreCode } = state.checkout.orderSummary
  return deliveryStoreCode && deliveryStoreCode.startsWith('S')
    ? 'shop'
    : 'store'
}

function getSelectedStoreCode(state) {
  return path(['checkout', 'orderSummary', 'deliveryStoreCode'], state)
}

function getSelectedStoreDetails(state) {
  return path(['checkout', 'orderSummary', 'storeDetails'], state)
}

function isDeliveryStoreChoiceAccepted(state) {
  return !isNil(state.checkout.orderSummary.storeDetails)
}

function getPaymentType(state) {
  return path(
    [
      'forms',
      'checkout',
      'billingCardDetails',
      'fields',
      'paymentType',
      'value',
    ],
    state
  )
}

function getCardNumber(state) {
  return path(
    [
      'forms',
      'checkout',
      'billingCardDetails',
      'fields',
      'cardNumber',
      'value',
    ],
    state
  )
}

const getErrors = (formNames, state) => {
  const forms = {
    ...pathOr({}, ['forms', 'checkout'], state),
    giftCard: pathOr({}, ['forms', 'giftCard'], state),
    newAddress: pathOr({}, ['forms', 'addressBook', 'newAddress'], state),
    newDetails: pathOr({}, ['forms', 'addressBook', 'newDetails'], state),
    newDeliverToAddress: pathOr(
      {},
      ['forms', 'addressBook', 'newDeliverToAddress'],
      state
    ),
    newFindAddress: pathOr(
      {},
      ['forms', 'addressBook', 'newFindAddress'],
      state
    ),
  }

  return compose(
    reject(isEmpty),
    map(filter(identity)),
    reject(isNil),
    pluck('errors'),
    pick(formNames)
  )(forms)
}

const getFormErrors = (formName, state) => {
  return getErrors([formName], state)[formName] || {}
}

const isReturningCustomer = (state) => {
  const id = path(
    ['account', 'user', 'billingDetails', 'addressDetailsId'],
    state
  )
  return id !== -1 && Number.isInteger(id)
}

const hasSelectedStore = (state) => {
  return (
    !pathOr(false, ['checkout', 'storeUpdating'], state) &&
    !!pathOr(false, ['checkout', 'orderSummary', 'storeDetails'], state)
  )
}

const getDeliveryCountry = (state) => {
  return (
    path(
      ['fields', 'country', 'value'],
      getAddressForm('deliveryCheckout', state)
    ) ||
    path(
      ['checkout', 'orderSummary', 'deliveryDetails', 'address', 'country'],
      state
    ) ||
    path(['checkout', 'orderSummary', 'deliveryDetails', 'country'], state) ||
    path(['checkout', 'orderSummary', 'shippingCountry'], state) ||
    path(['shippingDestination', 'destination'], state)
  )
}

const getBillingCountry = (state) => {
  return (
    path(
      ['fields', 'country', 'value'],
      getAddressForm('billingCheckout', state)
    ) ||
    path(
      ['checkout', 'orderSummary', 'billingDetails', 'address', 'country'],
      state
    ) ||
    path(['shippingDestination', 'destination'], state)
  )
}

// @TODO DELETE
const getCountryFor = (type, state) => {
  switch (type) {
    case 'deliveryCheckout':
      return getDeliveryCountry(state)
    case 'billingCheckout':
      return getBillingCountry(state)
    default:
      return ''
  }
}

const getOrderCost = (state) => {
  const { deliveryLocations = [], basket } = pathOr(
    {},
    ['checkout', 'orderSummary'],
    state
  )
  if (deliveryLocations.length && basket) {
    const subTotal = basket.subTotal
    const shippingCost = selectedDeliveryLocation(deliveryLocations).cost
    const discounts = basket.discounts || []
    return fixTotal(subTotal, shippingCost, pluck('value', discounts))
  }
}

const shouldDisplayDeliveryInstructions = (state) => {
  const deliveryCountry = getDeliveryCountry(state)
  const deliveryLocation = getSelectedDeliveryLocationType(state)
  return deliveryCountry === 'United Kingdom' && deliveryLocation === 'HOME'
}

const getDeliveryPageFormNames = (state) => {
  const formNames = ['yourDetails', 'yourAddress', 'findAddress']
  if (shouldDisplayDeliveryInstructions(state)) {
    formNames.push('deliveryInstructions')
  }

  return formNames
}

const getDeliveryPaymentPageFormNames = (state) => {
  /*
      **ORDER of the form names listed in formNames MATTERS
      **for validation (which one gets validate first)
      **and also affects
      **scrollToError functionality,
      **so make sure to keep right order
  */
  const formNames = [
    'yourAddress',
    'findAddress',
    'yourDetails',
    'newFindAddress',
    'newAddress',
    'newDetails',
    'newDeliverToAddress',
    'billingDetails',
    'billingAddress',
    'billingFindAddress',
    'billingCardDetails',
    'deliveryInstructions',
    'giftCard',
    'order',
  ]
  if (shouldDisplayDeliveryInstructions(state)) {
    return formNames
  }

  return without(['deliveryInstructions'], formNames)
}

const getDeliveryPaymentPageFormErrors = (state) => {
  const formNames = getDeliveryPaymentPageFormNames(state)

  return getErrors(formNames, state)
}

const isNotEmpty = (obj) => {
  return obj && Object.keys(obj).length > 0
}

const extractDiscountInfoOrderSummary = (orderSummary) =>
  pathOr([], ['basket', 'discounts'], orderSummary)

const extractDiscountInfoOrderCompleted = (orderCompleted) =>
  pathOr([], ['discounts'], orderCompleted)

const extractDiscountInfo = (state) => {
  // Use Order Summary
  const orderSummary = path(['checkout', 'orderSummary'], state)
  if (!isEmpty(orderSummary))
    return extractDiscountInfoOrderSummary(orderSummary)

  // Fallback Order Completed
  const orderCompleted = pathOr({}, ['checkout', 'orderCompleted'], state)
  if (isNotEmpty(orderCompleted)) {
    return extractDiscountInfoOrderCompleted(orderCompleted)
  }

  return []
}

const getSubTotal = (state) => {
  // order Summary Way
  const orderSummarySubTotal = path(
    ['checkout', 'orderSummary', 'basket', 'subTotal'],
    state
  )
  if (orderSummarySubTotal) return orderSummarySubTotal

  // Order Completed
  const orderCompleted = path(['checkout', 'orderCompleted'], state)
  if (isNotEmpty(orderCompleted)) {
    const { deliveryCost, deliveryPrice, subTotal, totalOrderPrice } = pathOr(
      {},
      ['checkout', 'orderCompleted'],
      state
    )
    return (
      subTotal || (totalOrderPrice - (deliveryCost || deliveryPrice)).toFixed(2)
    )
  }
}

const getTotal = (state) =>
  // via Order Summary
  path(['checkout', 'orderSummary', 'basket', 'total'], state) ||
  // or via Order Completed
  path(['checkout', 'orderCompleted', 'totalOrderPrice'], state)

const isCollectFromOrder = (state) => {
  // order Summary Check
  const deliveryStoreCode = path(
    ['checkout', 'orderSummary', 'deliveryStoreCode'],
    state
  )
  if (deliveryStoreCode !== undefined) return true

  // order Completed Check
  const orderCompleted = path(['checkout', 'orderCompleted'], state)
  if (isNotEmpty(orderCompleted)) {
    return pathOr('', ['deliveryCarrier'], orderCompleted).includes(
      'Retail Store'
    )
  }
}

const getDeliveryDate = (state) => {
  // order Summary Check
  const estimatedDelivery = path(
    ['checkout', 'orderSummary', 'estimatedDelivery'],
    state
  )

  // order Completed Check
  const deliveryDate = path(
    ['checkout', 'orderCompleted', 'deliveryDate'],
    state
  )
  return deliveryDate || normaliseEstimatedDeliveryDate(estimatedDelivery)
}

const isSavePaymentDetailsEnabled = function isSavePaymentDetailsEnabled(
  state
) {
  return pathOr(false, ['checkout', 'savePaymentDetails'], state)
}

function shouldUpdateOrderSummaryStore(state) {
  const orderSummaryStore = path(
    ['checkout', 'orderSummary', 'deliveryStoreCode'],
    state
  )

  const selectedStoreForCheckout = path(
    ['checkout', 'deliveryStore', 'deliveryStoreCode'],
    state
  )
  // selectedFulfilmentStore gets updated with selectedStoreForCheckout when a product is added to bag
  const selectedFulfilmentStore = path(
    ['storeId'],
    getSelectedBrandFulfilmentStore(state)
  )

  return (
    !!orderSummaryStore &&
    !!selectedStoreForCheckout &&
    selectedStoreForCheckout !== orderSummaryStore &&
    selectedStoreForCheckout === selectedFulfilmentStore
  )
}

const getDeliveryTypeFromBasket = (state) => {
  const locationType = getSelectedDeliveryLocationType(state)
  const deliveryOption = path(
    ['deliveryOptionExternalId'],
    getSelectedDeliveryOptionFromBasket(state)
  )

  return locationType
    ? deliveryConfig[locationType][deliveryOption] ||
        deliveryConfig[locationType].default
    : undefined
}

// On PUT orderSummary requests, deliveryMethods may not be populated (i.e. selecting STORE after HOME)
// On those cases the deliveryType is defined by the selection in the basket
const getSelectedDeliveryType = (state) => {
  const selectedDeliveryType = path(
    ['deliveryType'],
    getSelectedDeliveryMethod(state)
  )

  return selectedDeliveryType || getDeliveryTypeFromBasket(state)
}

const getSelectedDeliveryMethodLabel = (state) => {
  const deliveryMethod = getSelectedDeliveryMethod(state)
  return pathOr(null, ['label'], deliveryMethod)
}

// The orderSummary PUT request to change delivery method requires shipModeId for Store & ParcelShop
// When deliveryMethods are not populated in orderSummary we need
// to fetch the shipModeId from the basket deliveryOptions
// @NOTE To discuss with Cogz if we could potentially update orderSummary with deliveryType only
const getShipModeIdFromBasket = (state) => {
  const deliveryOptions = pathOr(
    [],
    ['checkout', 'orderSummary', 'basket', 'deliveryOptions'],
    state
  )

  // When not in checkout returns selected deliveryOption shipModeId from MiniBag
  if (isStoreDelivery(state)) {
    const selectedOption = getSelectedDeliveryOptionFromBasket(state) || {}
    const { deliveryOptionId, deliveryOptionExternalId } = selectedOption

    return deliveryConfig.STORE[deliveryOptionExternalId]
      ? deliveryOptionId
      : undefined
  }
  // If in checkout, parcelshop selected but deliveryMethods are not populated
  if (isParcelDelivery(state)) {
    return compose(
      path(['deliveryOptionId']),
      findParcelShopOption
    )(deliveryOptions)
  }

  return undefined
}

const getShipModeId = (state) => {
  const selectedDeliveryMethod = getSelectedDeliveryMethod(state)

  if (selectedDeliveryMethod) {
    const selectedDeliveryOption = compose(
      findSelected,
      pathOr([], ['deliveryOptions'])
    )(selectedDeliveryMethod)

    return selectedDeliveryOption
      ? path(['shipModeId'], selectedDeliveryOption)
      : path(['shipModeId'], selectedDeliveryMethod)
  }
  // If deliveryMethods are not populated we need to get shipModeId from basket's deliveyOptions
  return getShipModeIdFromBasket(state)
}

const getSelectedDeliveryMethods = (state) =>
  pathOr([], ['deliveryMethods'], getSelectedDeliveryLocation(state))

const shouldShowCollectFromStore = (state) => {
  return pathOr(false, ['checkout', 'showCollectFromStore'], state)
}

const getShippingCost = createSelector(
  getSelectedDeliveryMethods,
  (selectedDeliveryMethods) => {
    const selectedMethod = selectedDeliveryMethods.find(
      (deliveryMethod) => deliveryMethod.selected
    )

    return (selectedMethod && selectedMethod.cost) || 0
  }
)

export const getNewlyConfirmedOrder = (state) =>
  pathOr(false, ['checkout', 'newlyConfirmedOrder'], state)

export const getDeliveryStoreForOrderUpdate = createSelector(
  getSelectedDeliveryLocationType,
  getCheckoutDeliveryStore,
  // EXP-313
  isStoreWithParcel,
  (selectedDeliveryType, deliveryStore, isStoreWithParcel) => {
    const storeCode = (deliveryStore && deliveryStore.deliveryStoreCode) || ''
    const resolvedStoreCodeType = resolveStoreCodeType(storeCode)

    // if EXP-313 has been activated and 'collect from store or parcelshop'
    // is selected, resolvedStoreCode could be either of these
    if (isStoreWithParcel) {
      return resolvedStoreCodeType === 'STORE' ||
        resolvedStoreCodeType === 'PARCELSHOP'
        ? deliveryStore
        : null
    }

    return resolvedStoreCodeType === selectedDeliveryType ? deliveryStore : null
  }
)

export const getThreeDSecurePrompt = (state) =>
  pathOr(null, ['checkout', 'threeDSecurePrompt'], state)

const getSelectedPaymentMethod = (state) => {
  const { selectedPaymentMethod } = rootSelector(state)
  return selectedPaymentMethod
}

export const isSelectedPaymentMethodKlarna = (state) => {
  const paymentMethod = getSelectedPaymentMethod(state)
  return paymentMethod === 'KLRNA'
}

const getCheckoutPaymentButtonLabel = createSelector(
  [getSelectedPaymentMethod, getTotal],
  (selectedPaymentMethod, total) => {
    let paymentMethod = selectedPaymentMethod
    if (formatForRadix(total) === 0) {
      paymentMethod = 'default'
    }

    switch (paymentMethod) {
      case paymentTypes.KLARNA:
        return 'Pay with Klarna'
      case paymentTypes.PAYPAL:
        return 'Pay via PayPal'
      case paymentTypes.CLEARPAY:
        return 'Proceed to Clearpay'
      default:
        return 'Order and Pay Now'
    }
  }
)

const paymentMethodsAreOpen = (state) =>
  pathOr(false, ['checkout', 'paymentMethodsAreOpen'], state)

const storedCardHasExpired = (state) => {
  // A card is valid until the last calendar day of the expiry month
  const { type, expiryMonth, expiryYear } = selectStoredPaymentDetails(state)
  const paymentMethods = pathOr([], ['paymentMethods'], state)
  const isCreditOrAccountCard = isCard(type, paymentMethods)

  if (!isCreditOrAccountCard) {
    return false
  }

  const isValidMonth = /^(0[1-9]|1[0-2])$/.test(expiryMonth)
  const isValidYear = /^([0-9]{4})$/.test(expiryYear)

  if (isValidMonth && isValidYear) {
    const today = new Date(
      `${new Date().getFullYear()}/${new Date().getMonth() + 1}/01`
    )
    const expiryDate = new Date(`${expiryYear}/${expiryMonth}/01`)

    return today > expiryDate
  }

  return true
}

const getProgressTrackerSteps = createSelector(
  isReturningCustomer,
  isGuestOrder,
  (state) => getRoutePath(state),
  (isReturningCustomer, isGuestOrder, pathname) => {
    switch (true) {
      case isReturningCustomer:
        return RETURNING_CUSTOMER_STEPS.map((step) =>
          setActiveStep(pathname, step)
        )
      case isGuestOrder:
        return GUEST_CUSTOMER_STEPS.map((step) => setActiveStep(pathname, step))
      default:
        return NEW_CUSTOMER_STEPS.map((step) => setActiveStep(pathname, step))
    }
  }
)

export const isOrderCoveredByGiftCards = (state) =>
  getCheckoutOrderSummaryBasket(state).isOrderCoveredByGiftCards || false

export const isGiftCardRedemptionEnabled = (state) =>
  getCheckoutOrderSummaryBasket(state).isGiftCardRedemptionEnabled || false

export const isGiftCardValueThresholdMet = (state) =>
  getCheckoutOrderSummaryBasket(state).isGiftCardValueThresholdMet || false

export const giftCardRedemptionPercentage = (state) => {
  const percentage = parseInt(
    getCheckoutOrderSummaryBasket(state).giftCardRedemptionPercentage,
    10
  )
  return isFinite(percentage) ? percentage : 100
}

export {
  extractDiscountInfo,
  findAddressIsVisible,
  getAddressForm,
  getBillingCountry,
  getCountryFor,
  getDeliveryCountry,
  getDeliveryDate,
  getDeliveryLocations,
  getDeliveryPageFormNames,
  getDeliveryPaymentPageFormNames,
  getDeliveryPaymentPageFormErrors,
  getDetailsForm,
  getEnrichedDeliveryLocations,
  getErrors,
  getFindAddressForm,
  getFormErrors,
  getOrderCost,
  getPaymentType,
  getProgressTrackerSteps,
  getCardNumber,
  getSelectedDeliveryLocation,
  getSelectedDeliveryLocationType,
  getSelectedDeliveryMethod,
  getSelectedDeliveryMethodLabel,
  getSelectedDeliveryOptionFromBasket,
  getSelectedDeliveryStoreType,
  getSelectedDeliveryType,
  getSelectedStoreDetails,
  getShipModeId,
  getShippingCost,
  getSubTotal,
  getTotal,
  getUseDeliveryAsBilling,
  hasCheckedOut,
  hasSelectedStore,
  isCollectFromOrder,
  isDeliveryEditingEnabled,
  isDeliveryStoreChoiceAccepted,
  isDeliveryStoreChosen,
  isManualAddress,
  isQASCountry,
  isReturningCustomer,
  isSavePaymentDetailsEnabled,
  isStoreDelivery,
  isParcelDelivery,
  isStoreOrParcelDelivery,
  paymentMethodsAreOpen,
  storedCardHasExpired,
  selectedDeliveryLocationTypeEquals,
  shouldDisplayDeliveryInstructions,
  shouldUpdateOrderSummaryStore,
  getSelectedDeliveryMethods,
  shouldShowCollectFromStore,
  getSelectedPaymentMethod,
  getCheckoutPaymentButtonLabel,
  getSelectedStoreCode,
}
