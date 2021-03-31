import { getDayFromDateString, isTimePast } from './utils'

export const getDeliveryDay = (inventory, quantity) => {
  const {
    expressdates: [expressDate0, expressDate1] = [],
    cutofftime: cutoffTime,
    quantity: stockQuantity,
  } = inventory

  const notPassedCutoff =
    cutoffTime && !isTimePast([cutoffTime.slice(0, -2), cutoffTime.slice(-2)])
  const stockExists = stockQuantity && stockQuantity >= quantity

  if (expressDate0 && stockExists && notPassedCutoff)
    return getDayFromDateString(expressDate0)
  if (expressDate1 && stockExists) return getDayFromDateString(expressDate1)
  return ''
}
