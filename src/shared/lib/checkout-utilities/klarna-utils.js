import { pluck, pathOr, isNil, merge, equals, contains } from 'ramda'
import diacritics from 'diacritics'
import { getDeliveryCountryISO } from '../../selectors/common/configSelectors'

export const KLARNA_SDK_SRC = 'https://x.klarnacdn.net/kp/lib/v1/api.js'
export const KLARNA_INSTANCE_ID = 'klarna-payments-instance'

export const splitSelectedDelivery = (deliveryOptions) => {
  const selectedDelivery = deliveryOptions.filter((item) => item.selected)[0]
  return selectedDelivery ? selectedDelivery.label.split(' ') : null
}

export const parseDeliveryDetails = (split) => {
  const deliveryName =
    split && split.filter((item) => !/\d+[.,]\d+|[£$€]/.test(item)).join(' ')
  const priceWithCurrency =
    split && split.find((item) => /\d+[.,]\d+/.test(item))
  const priceString = /(\d+[.,]\d+)/.exec(priceWithCurrency)[1]
  return { deliveryName, priceString }
}

export const getDeliveryDetails = (deliveryOptions) => {
  const split = splitSelectedDelivery(deliveryOptions)
  const { deliveryName, priceString } = parseDeliveryDetails(split)
  const deliveryPrice = priceString
    ? parseFloat(priceString.replace(/,/g, '.'))
    : null
  return { deliveryName, deliveryPrice }
}

export const getDelivery = (basket) => {
  const { deliveryName, deliveryPrice } = getDeliveryDetails(
    basket.deliveryOptions
  )
  if (!deliveryName || !deliveryPrice) return null

  return {
    name: deliveryName,
    quantity: 1,
    unit_price: deliveryPrice * 100,
    total_amount: deliveryPrice * 100,
  }
}

const getRegion = (county, state) => {
  if (county) return county
  if (state) return state
  return ''
}

const getUserEmail = (isGuestOrder, form, user) =>
  isGuestOrder
    ? pathOr('', ['fields', 'email', 'value'], form)
    : pathOr('', ['email'], user)

export const getAddressDetails = (
  addressType,
  details,
  address,
  user,
  config,
  orderSummary,
  guestUser
) => {
  const detailsValues = pluck('value', details.fields)
  const addressValues = pluck('value', address.fields)
  const storeDetails =
    orderSummary && addressType === 'shipping'
      ? orderSummary.storeDetails
      : undefined

  const isGuestOrder = orderSummary ? orderSummary.isGuestOrder : undefined

  return {
    given_name: detailsValues.firstName,
    family_name: detailsValues.lastName,
    title: detailsValues.title,
    email: getUserEmail(isGuestOrder, guestUser, user),
    phone: detailsValues.telephone,
    street_address: storeDetails
      ? storeDetails.address1
      : addressValues.address1,
    street_address2: storeDetails
      ? storeDetails.address2
      : addressValues.address2,
    postal_code: storeDetails ? storeDetails.postcode : addressValues.postcode,
    city: storeDetails ? storeDetails.city : addressValues.city,
    region: storeDetails
      ? ''
      : getRegion(addressValues.county, addressValues.state),
    country: getDeliveryCountryISO({ config }, addressValues.country),
  }
}

export const removeDiacriticsDeep = (object) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key]
      if (typeof value === 'object') {
        object[key] = removeDiacriticsDeep(value)
      } else if (typeof value === 'string') {
        object[key] = diacritics.remove(value)
      }
    }
  }
  return object
}

export function assembleAddressPayload(props) {
  const {
    billingDetails,
    billingAddress,
    yourDetails,
    yourAddress,
    user,
    config,
    orderSummary,
    guestUser,
  } = props
  return removeDiacriticsDeep({
    billing_address: getAddressDetails(
      'billing',
      billingDetails,
      billingAddress,
      user,
      config,
      orderSummary,
      guestUser
    ),
    shipping_address: getAddressDetails(
      'shipping',
      yourDetails,
      yourAddress,
      user,
      config,
      orderSummary,
      guestUser
    ),
  })
}

export function loadScript() {
  if (document) {
    return new Promise((resolve) => {
      const time = new Date().getTime()
      const src = `${KLARNA_SDK_SRC}?${time}`

      window.loadScript({ src, isAsync: true, onload: resolve })
    })
  }
  return Promise.reject()
}

/* KLARNA SDK - init()
 *
 * Initiate klarna with a token id provided by the monty api
 * */
export async function klarnaPaymentsInit(client_token) {
  if (!window.Klarna) await loadScript()

  return new Promise((resolve) => {
    window.Klarna.Payments.init({ client_token })
    setTimeout(resolve, 500)
  })
}

/* KLARNA SDK - load()
 *
 *  This step displays the klarna form to the user
 * */
export async function klarnaPaymentsLoad(
  container = '.KlarnaForm',
  updateDetails,
  paymentMethodCategories
) {
  if (!window.Klarna) await loadScript()

  return new Promise((resolve, reject) => {
    window.Klarna.Payments.load(
      {
        container,
        payment_method_categories: paymentMethodCategories,
        instance_id: KLARNA_INSTANCE_ID,
      },
      updateDetails,
      (res, err) => {
        if (err) return reject(err)
        return res.show_form ? resolve(res) : reject(res)
      }
    )
  })
}

/* KLARNA SDK - authorize()
 *
 * Upon authorizing the credit, Klarna will validate the input in the credit form.
 * If there are any errors, the relevant fields are highlighted and
 * corresponding error messages are shown.
 * */
export async function klarnaPaymentsAuthorize(updateDetails) {
  if (!window.Klarna) await loadScript()
  return new Promise((resolve, reject) => {
    window.Klarna.Payments.authorize(
      { instance_id: KLARNA_INSTANCE_ID },
      updateDetails,
      (res, err) => {
        if (err) return reject(false)
        return res.show_form && res.approved ? resolve(res) : reject(res)
      }
    )
  })
}

const addressTemplate = (address) => ({
  city: address.city,
  country: address.locale,
  email: address.email,
  family_name: address.lastName,
  given_name: address.firstName,
  phone: address.telephone,
  postal_code: address.postcode,
  region: address.region,
  street_address: address.address1,
  street_address2: address.address2,
  title: address.title,
})

/* Prepare KLARNA payload for authorize()
 * */
export const prepareKlarnaPayload = (state) => {
  const {
    config,
    shoppingBag,
    account: { user },
    checkout: { orderSummary },
    forms: {
      checkout: {
        billingAddress,
        billingDetails,
        yourAddress,
        yourDetails,
        guestUser,
      },
    },
  } = state

  const payload = assembleAddressPayload({
    billingDetails,
    billingAddress,
    config,
    orderSummary,
    shoppingBag,
    user,
    yourAddress,
    yourDetails,
    guestUser,
    // TODO - possible (not great imo) solution is to pass the entire state
    //  to the assembleAddressPayload and use a selector
    //  to get the email from the user account and from the guestUser form
  })

  const isGuestOrder = orderSummary ? orderSummary.isGuestOrder : undefined
  /* Home Delivery Address
   *
   * (assembleAddressPayload) gets the Home Delivery Address from the forms
   * checkout state. This state does not update when a user creates or selects
   * a new home delivery address. The code below will fix this issue
   *
   * */
  if (orderSummary.savedAddresses.length > 0) {
    const deliveryCountry = pathOr(
      '',
      ['deliveryDetails', 'address', 'country'],
      orderSummary
    )

    const shipping_address = {
      ...merge(
        orderSummary.deliveryDetails.nameAndPhone,
        orderSummary.deliveryDetails.address
      ),
      email: getUserEmail(isGuestOrder, guestUser, user),
      locale: getDeliveryCountryISO(state, deliveryCountry),
      region: '',
    }

    return {
      billing_address: payload.billing_address,
      shipping_address: addressTemplate(shipping_address),
    }
  }

  return payload
}

export const isKlarnaFormLoaded = (className = '.KlarnaForm') => {
  const klarnaFormElement = document.querySelector(className)
  return (
    !isNil(klarnaFormElement) &&
    !isNil(klarnaFormElement.querySelector('iframe'))
  )
}

/* For some reason the Delivery options array updates the order of its
 * options with no new changes. To check if the array has been updated
 * the method below compares each option.
 * */
export const hasDeliveryOptionsBeenUpdated = (order, prev) => {
  return (
    order.deliveryOptions.filter(
      (option) => !contains(option, prev.deliveryOptions)
    ).length > 0
  )
}

export const hasOrderBeenUpdated = (order, prevOrder) =>
  !equals(order.total, prevOrder.total) ||
  hasDeliveryOptionsBeenUpdated(order, prevOrder)
