import { headers } from '../utilis'
import superagent from 'superagent'

import eps from '../routes_tests'
import generateAddress from '../utilis/address'
import nameAndPhone from '../utilis/nameAndPhone'
import pay from '../utilis/creditCard'

require('@babel/register')

jest.unmock('superagent')

const CARD_CVV = '123'
const REMOTE_IP = '127.0.0.1'
const SHIPPING_COUNTRY = 'United Kingdom'
const SHIPPING_CODE = 'S'
const DELIVERY_TYPE = 'HOME_STANDARD'
const SHIPPING_MODE_ID = 26504

const generateOrderPayload = (orderId, paymentType, payloadDefaults) => {
  const generatedNameAndPhone = nameAndPhone(payloadDefaults.nameAndPhone)

  const payload = {
    smsMobileNumber: '',
    remoteIpAddress: REMOTE_IP,
    orderDeliveryOption: {
      orderId,
      shippingCountry: SHIPPING_COUNTRY,
      shipCode: SHIPPING_CODE,
      deliveryType: DELIVERY_TYPE,
      shipModeId: SHIPPING_MODE_ID,
    },
    deliveryInstructions: '',
    deliveryAddress: generateAddress.address(),
    deliveryNameAndPhone: generatedNameAndPhone,
    billingDetails: {
      address: generateAddress.address(),
      nameAndPhone: generatedNameAndPhone,
    },
    returnUrl: eps.orders.orderCompleteReturnUrl.path(paymentType),
    save_details: true,
  }

  return payloadDefaults.threeDSecure2
    ? {
        ...payload,
        dfReferenceId: payloadDefaults.threeDSecure2.dfReferenceId,
        challengeWindowSize: payloadDefaults.threeDSecure2.challengeWindowSize,
      }
    : payload
}

// Pass the paymentType using the abbreviation all uppercase
export const paymentMethodPayload = (
  orderId,
  paymentType,
  payloadDefaults = {}
) => {
  const { paymentMethod } = pay
  const body = generateOrderPayload(orderId, paymentType, payloadDefaults)

  return {
    ...body,
    creditCard: paymentMethod(paymentType),
    ...(paymentType === 'PYPAL'
      ? null
      : {
          cardCvv: CARD_CVV,
        }),
  }
}

export const payOrder = (
  cookies,
  orderId,
  payment = 'VISA',
  payloadDefaults = {}
) => {
  return superagent
    .post(eps.orders.payOrder.path)
    .set(headers)
    .set({
      Cookie: cookies,
    })
    .send(paymentMethodPayload(orderId, payment, payloadDefaults))
}

export const payOrderError = (cookies = '', orderId, body) => {
  return superagent
    .post(eps.orders.payOrder.path)
    .set(headers)
    .set({
      Cookie: cookies,
    })
    .send(body, orderId)
}
