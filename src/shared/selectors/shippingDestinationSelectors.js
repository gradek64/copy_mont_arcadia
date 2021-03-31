import { path } from 'ramda'

export function getShippingDestination(state) {
  return path(['shippingDestination', 'destination'], state)
}
