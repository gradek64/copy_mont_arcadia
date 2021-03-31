import { path } from 'ramda'
import { encodeUserId } from '../../../../../lib/bazaarvoice-utils'
import { logonCookies, logonHeaders } from '../cookies'
import { extractAndParseCookie } from '../../../../requests/utils'
import {
  removeDiacritics,
  removeCanadaDiacritics,
  removeStateDiacritics,
} from '../../../utils/genericUtils'

const mapAddress = (montyPrefix, wcsPrefix, fields, payload) => {
  const address = {}
  fields.forEach((field) => {
    address[`${wcsPrefix}_${field.key || field.name}`] = removeDiacritics(
      path([`${montyPrefix}Details`, field.path, field.name], payload)
    )
  })
  return address
}

const mapIsoCode = (country = '', isoCodes = []) => {
  const countryHash = isoCodes.find((item) => item.countryName === country)
  return countryHash ? countryHash.countryISO : ''
}

const mapPaymentInfo = ({
  expiryYear = '',
  expiryMonth = '',
  type = '',
  cardNumber = '',
} = {}) => ({
  pay_cardNumber: cardNumber,
  pay_cardExpiryMonth: expiryMonth,
  pay_cardExpiryYear: expiryYear,
  pay_cardNumberStar: cardNumber,
  pay_cardBrand: type,
})

const mapAccountValues = (account = {}) => {
  const {
    returnPage = '',
    isoCode = '',
    billingEmail1 = '',
    addressType = '',
    lastCardInput = '',
  } = account

  return {
    returnPage,
    isoCode,
    billing_email1: billingEmail1,
    addressType,
    lastCard: lastCardInput,
    billing_house_number: account.billing_house_number || '',
    billing_state_hidden: account.billing_state_hidden || '',
    billing_state_select: account.billing_state_select || '',
    billing_state_input: account.billing_state_input || '',
    delivery_house_number: account.delivery_house_number || '',
    delivery_postcode: account.delivery_postcode || '',
    delivery_address_results: account.delivery_address_results || '',
    shipping_state_hidden: account.shipping_state_hidden || '',
    shipping_state_select: account.shipping_state_select || '',
    shipping_state_input: account.shippiing_state_input || '',
    pay_payMethodId: account.payPayMethodId || '',
  }
}

const mapAddressState = (payload) => {
  const billingAddressState = path(
    ['billingDetails', 'address', 'state'],
    payload
  )
  const billingCountry = path(['billingDetails', 'address', 'country'], payload)
  const shippingAddressState = path(
    ['deliveryDetails', 'address', 'state'],
    payload
  )
  const shippingCountry = path(
    ['deliveryDetails', 'address', 'country'],
    payload
  )

  return {
    billing_state_input:
      removeStateDiacritics(billingAddressState, billingCountry) || '',
    billing_state_select_canada:
      removeCanadaDiacritics(billingAddressState, billingCountry) || '',
    billing_state_hidden:
      removeStateDiacritics(billingAddressState, billingCountry) || '',
    billing_state_select:
      removeStateDiacritics(billingAddressState, billingCountry) || '',
    shipping_state_input:
      removeStateDiacritics(shippingAddressState, shippingCountry) || '',
    shipping_state_select_canada:
      removeCanadaDiacritics(shippingAddressState, shippingCountry) || '',
    shipping_state_hidden:
      removeStateDiacritics(shippingAddressState, shippingCountry) || '',
    shipping_state_select:
      removeStateDiacritics(shippingAddressState, shippingCountry) || '',
  }
}

const mapAuthenticatedResponse = (res, body) => {
  const bvToken = encodeUserId(body.userTrackingId)
  const { value: userSeg } = extractAndParseCookie(res.cookies, 'userSeg') || {}
  return {
    jsessionid: res.jsessionid,
    body,
    setCookies: logonCookies(body, bvToken, userSeg),
    setHeaders: logonHeaders(bvToken),
  }
}

export {
  mapAccountValues,
  mapAddress,
  mapAuthenticatedResponse,
  mapIsoCode,
  mapPaymentInfo,
  mapAddressState,
}
