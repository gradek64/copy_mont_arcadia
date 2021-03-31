import { find, path, prop, pathOr } from 'ramda'
import { getLongDate } from '../../lib/get-delivery-days/utils'
// Delivery Locations
// const HOME = 'HOME'
const STORE = 'STORE'
const PARCELSHOP = 'PARCELSHOP'

// HOME Delivery Types
const HOME_STANDARD = 'HOME_STANDARD'
const HOME_EXPRESS = 'HOME_EXPRESS'

// STORE Delivery Types
const STORE_STANDARD = 'STORE_STANDARD'
const STORE_EXPRESS = 'STORE_EXPRESS'
const STORE_IMMEDIATE = 'STORE_IMMEDIATE'

// PARCELSHOP Delivery Types
const PARCELSHOP_COLLECTION = 'PARCELSHOP_COLLECTION'

// ADP-175
// When Collect From Store Express has been selected in the Shopping Bag, this needs
// to be persisted in Checkout. As users land in Checkout, they will be prompted with the
// StoreLocator in order to select the store. At this stage the orderSummary does not return
// the deliveryMethods available for STORE locations, therefore we need to look up for
// the delivery option details selected in the shopping bag in order to update the orderSummary
// with CFS Express
//
// `deliveryConfig` maps `deliveryOptionExternalId` identifiers for shopping bag options
// to deliveryTypes used to update checkout's orderSummary
const deliveryConfig = {
  HOME: {
    s: HOME_STANDARD,
    n1: HOME_EXPRESS,
    n2: HOME_EXPRESS,
    n3: HOME_EXPRESS,
    n4: HOME_EXPRESS,
    n5: HOME_EXPRESS,
    n6: HOME_EXPRESS,
    n7: HOME_EXPRESS,
    e: HOME_EXPRESS,
    default: HOME_STANDARD,
  },
  STORE: {
    retail_store_standard: STORE_STANDARD,
    retail_store_express: STORE_EXPRESS,
    retail_store_immediate: STORE_IMMEDIATE,
    default: STORE_STANDARD,
  },
  PARCELSHOP: {
    retail_store_collection: PARCELSHOP_COLLECTION,
    default: PARCELSHOP_COLLECTION,
  },
}

const findSelected = find(prop('selected'))

const findParcelShopOption = find(
  ({ deliveryOptionExternalId }) =>
    deliveryOptionExternalId === 'retail_store_collection'
)

const isStoreDeliveryLocation = (location) => {
  return path(['deliveryLocationType'], location) === STORE
}

const isParcelShopDeliveryLocation = (location) => {
  return path(['deliveryLocationType'], location) === PARCELSHOP
}

const isStoreOrParcelDeliveryLocation = (location) => {
  return (
    isStoreDeliveryLocation(location) || isParcelShopDeliveryLocation(location)
  )
}

/**
 * Generate the delivery price text
 */
const getDeliveryPriceText = ({ cost }, { p, l }) =>
  cost && parseFloat(cost) ? p(cost) : l('Free')

/**
 * Generate the delivery message for UK
 */
const getDeliveryText = (
  { deliveryCountry, deliveryOptions, deliveryType, estimatedDeliveryDate },
  { l }
) => {
  const initNominatedDate =
    deliveryOptions && pathOr('', ['0', 'nominatedDate'], deliveryOptions)
  const selectedNominatedDate =
    deliveryOptions && deliveryOptions.filter((option) => option.selected)
  const selectedNominatedDateMapped =
    selectedNominatedDate &&
    pathOr(
      false,
      ['0'],
      selectedNominatedDate.map((option) => option.nominatedDate)
    )

  if (deliveryCountry === 'United Kingdom') {
    const nominatedDate = selectedNominatedDateMapped || initNominatedDate
    if (deliveryType === 'HOME_EXPRESS' && getLongDate(nominatedDate)) {
      const deliveryDateText = getLongDate(nominatedDate).substring(
        0,
        getLongDate(nominatedDate).lastIndexOf(' ')
      )
      return l`Get it on ${deliveryDateText}`
    } else if (deliveryType === 'HOME_STANDARD' && estimatedDeliveryDate) {
      const deliveryDateText = estimatedDeliveryDate.substring(
        0,
        estimatedDeliveryDate.lastIndexOf(' ')
      )
      return l`Get it by ${deliveryDateText}`
    }
  }
}

export {
  deliveryConfig,
  findSelected,
  findParcelShopOption,
  isStoreDeliveryLocation,
  isParcelShopDeliveryLocation,
  isStoreOrParcelDeliveryLocation,
  getDeliveryPriceText,
  getDeliveryText,
}
