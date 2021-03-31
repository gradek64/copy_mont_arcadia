import { path, compose } from 'ramda'
import { isNonEmptyArray } from './utils'
import { getDeliveryDay } from './get-delivery-day'

export const getDCDeliveryDay = ({ inventoryPositions, quantity }) => {
  return compose(
    isNonEmptyArray,
    path(['inventorys'])
  )(inventoryPositions)
    ? getDeliveryDay(inventoryPositions.inventorys[0], quantity)
    : ''
}
