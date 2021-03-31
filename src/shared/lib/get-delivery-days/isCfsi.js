import { getStockFromStockList } from './get-stock-list'
import { formatDateAsYMD, isTimePast, getCurrentDate } from './utils'
import { path } from 'ramda'

export const isCFSIToday = (product = {}, store = {}) => {
  if (!path(['quantity'], product) || !path(['sku'], product) || !store)
    return false

  const { sku, quantity = 1 } = product
  const dateString = formatDateAsYMD(getCurrentDate())
  const notPassedCutoff =
    !!store.cfsiPickCutOffTime && !isTimePast(store.cfsiPickCutOffTime)
  const availableToday =
    !!store.cfsiAvailableOn && store.cfsiAvailableOn.includes(dateString)
  const stock = store.stock || getStockFromStockList(sku, store) || 0

  return availableToday && notPassedCutoff && parseInt(stock, 10) >= quantity
}
