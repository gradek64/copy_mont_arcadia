import { contains, __, isEmpty } from 'ramda'

/*
 WARNING: scrAPI FIX HERE....
 This function takes in the orderSummary and if the data is malformed for the address fields, it will replace them with the fields from the user information
 It compares the countries to the list of billing countries
 */
export const fixOrderSummary = (orderSummary, user, countries, config) => {
  // Only do this for logged in users, which will have deliveryDetails
  if (!orderSummary.deliveryDetails) return orderSummary
  const isValidCountry = contains(__, countries)
  const { deliveryDetails, billingDetails } = orderSummary
  const deliveryDetailsNameAndPhone =
    deliveryDetails && deliveryDetails.nameAndPhone
      ? deliveryDetails.nameAndPhone
      : user.deliveryDetails.nameAndPhone
  const billingDetailsNameAndPhone =
    billingDetails && billingDetails.nameAndPhone
      ? billingDetails.nameAndPhone
      : user.billingDetails.nameAndPhone
  const deliveryAddress =
    deliveryDetails && isValidCountry(deliveryDetails.address.country)
      ? deliveryDetails.address
      : user.deliveryDetails.address
  const billingAddress =
    billingDetails && isValidCountry(billingDetails.address.country)
      ? billingDetails.address
      : user.billingDetails.address
  return {
    ...orderSummary,
    deliveryDetails: {
      ...deliveryDetails,
      nameAndPhone: deliveryDetailsNameAndPhone,
      address: deliveryAddress,
    },
    billingDetails: {
      ...billingDetails,
      nameAndPhone: billingDetailsNameAndPhone,
      address: billingAddress,
    },
    shippingCountry:
      orderSummary.shippingCountry || deliveryAddress.country || config.country,
  }
}

/* WARNING: scrAPI FIX
 * Same issue of OrderSummary updated for OrderCompleted */
export const fixEuropeanOrderCompleted = (OrderCompleted, user, countries) => {
  const isValidCountry = contains(__, countries)
  const { deliveryAddress, billingAddress } = OrderCompleted

  const reMapDetails = ({ nameAndPhone, address }) => {
    return {
      name: `${nameAndPhone.title} ${nameAndPhone.firstName} ${
        nameAndPhone.lastName
      }`,
      address1: address.address1,
      address2: address.address2,
      address3: `${address.postcode} ${address.city}`,
      country: address.country,
    }
  }

  const deliveryAddressUpdated =
    deliveryAddress && isValidCountry(deliveryAddress.country)
      ? deliveryAddress
      : reMapDetails(user.deliveryDetails)
  const billingAddressUpdated =
    billingAddress && isValidCountry(billingAddress.country)
      ? billingAddress
      : reMapDetails(user.billingDetails)

  return {
    ...OrderCompleted,
    deliveryAddress: {
      ...deliveryAddressUpdated,
    },
    billingAddress: {
      ...billingAddressUpdated,
    },
  }
}

/* WARNING: orderSummary transformer
 * Helper function that removes CFSI option from orderSummary */
export const removeCFSIFromOrderSummary = (orderSummary) => {
  if (isEmpty(orderSummary)) return {}
  if (!orderSummary.deliveryLocations) return orderSummary

  const filterNonCFSI = (deliveryMethods) =>
    deliveryMethods.filter(
      (method) => method.deliveryType !== 'STORE_IMMEDIATE'
    )

  const deliveryLocations = orderSummary.deliveryLocations.map(
    (location) =>
      location.deliveryLocationType === 'STORE'
        ? {
            ...location,
            deliveryMethods: filterNonCFSI(location.deliveryMethods),
          }
        : location
  )

  return { ...orderSummary, deliveryLocations }
}

export const normaliseEstimatedDeliveryDate = (estimatedDelivery) => {
  const estimatedDeliveryString =
    typeof estimatedDelivery === 'object'
      ? estimatedDelivery[0]
      : estimatedDelivery
  return estimatedDeliveryString
    ? estimatedDeliveryString
        .replace(/(no later than|pas plus tard que|nicht später als)/i, '')
        .trim()
    : ''
}

/*
  Values are:
  Home Delivery: Parcelnet
  Home Express: Home Delivery Network
  Collect from Store (Standard): Retail Store Standard
  Colect From Store (Express): Retail Store Express
  Collect From Store : Retail Store Collection
*/
export const deliveryTypes = {
  'Home Delivery Network': {
    icon: 'lorry-icon.svg',
    message: 'Your order will be delivered on',
  },
  Parcelnet: {
    icon: 'lorry-icon.svg',
    message: 'Your order will be delivered by',
  },
  'Retail Store Standard': {
    icon: 'arcadia-store-icon.svg',
    message: 'Delivered to store by',
  },
  'Retail Store Express': {
    icon: 'arcadia-store-icon.svg',
    message: 'Delivered to store by',
  },
  'Retail Store Collection': {
    icon: 'hermes-icon.svg',
    message: 'Available in store by',
  },
}

export const normaliseDeliveryType = (deliveryType) => {
  // return it if we have it
  if (deliveryTypes[deliveryType] !== undefined) return deliveryType
  // attempt to normalise it on standard rules
  if (deliveryType.toLowerCase().indexOf('standard') !== -1) return 'Parcelnet'
  if (deliveryType.toLowerCase().indexOf('express') !== -1)
    return 'Home Delivery Network'
}

const badStores = [
  '_ERR_DELIVERY_STORE_INVALID',
  '_ERR_DELIVERY_STORE_ADDRESS_INVALID',
  '_ERR_DELIVERY_STORE_ADDRESS_INACTIVE',
]

export const isErroredStore = (message = '') => badStores.indexOf(message) > -1
