import { sum } from 'ramda'
import { formatForRadix } from './../price'

/**
 * Calculate the shopping bag total
 * FIX: the 'total' calculated we receive from the backend is not always updated
 */
export const fixTotal = (subTotal, shippingCost = 0, discounts = []) => {
  // handle commas in european money
  const discountsConverted = discounts.map((x) => formatForRadix(x))
  return (
    parseFloat(formatForRadix(subTotal)) +
    parseFloat(formatForRadix(shippingCost)) -
    sum(discountsConverted.map(parseFloat))
  )
}
