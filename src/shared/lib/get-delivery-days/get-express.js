import { path, compose, contains, propSatisfies } from 'ramda'
import { isNonEmptyArray } from './utils'
import { getDeliveryDay } from './get-delivery-day'

export const getExpressDeliveryDay = ({ inventoryPositions, quantity }) => {
  const expressAvailability =
    compose(
      isNonEmptyArray,
      path(['invavls'])
    )(inventoryPositions) &&
    inventoryPositions.invavls.find(
      propSatisfies(contains('EXPRESS'), 'stlocIdentifier')
    )

  return expressAvailability
    ? getDeliveryDay(expressAvailability, quantity)
    : ''
}
