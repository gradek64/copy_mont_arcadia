import { propEq, propOr } from 'ramda'

const isDeliveryLocationSelected = propOr(false, 'selected')

const isDeliveryMethodSelected = propOr(false, 'selected')

const isDeliveryMethodOfType = propEq('deliveryType')

const isDeliveryOptionSelected = propOr(false, 'selected')

export {
  isDeliveryLocationSelected,
  isDeliveryMethodSelected,
  isDeliveryMethodOfType,
  isDeliveryOptionSelected,
}
