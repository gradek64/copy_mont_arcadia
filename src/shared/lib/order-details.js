import { groupBy } from 'ramda'
import {
  hasDDP,
  hasNoTracking,
  hasTrackingAvailable,
} from '../constants/trackingTypes'

export const groupOrdersByTracking = groupBy((order) => {
  if (order.trackingAvailable) {
    return hasTrackingAvailable
  }
  if (order.isDDPProduct) {
    return hasDDP
  }
  return hasNoTracking
})

export const groupOrdersByTrackingId = groupBy((order) => {
  if (order.trackingNumber) {
    return order.trackingNumber
  }
})

export const sortOrdersByTrackingNumber = (orders) => {
  const sortedOrders = groupOrdersByTracking(orders)
  const availableOrders = Object.keys(sortedOrders)

  if (availableOrders.includes(hasTrackingAvailable)) {
    // group items by tracking number if they have tracking available
    const groupedTrackedItems = groupOrdersByTrackingId(
      sortedOrders[hasTrackingAvailable]
    )
    return {
      ...sortedOrders,
      hasTrackingAvailable: groupedTrackedItems,
    }
  }
  // return sorted items if there are no tracking Items available
  return sortedOrders
}

export const orderLinesSortedWithTracking = (orderLines) =>
  orderLines ? sortOrdersByTrackingNumber(orderLines) : {}
