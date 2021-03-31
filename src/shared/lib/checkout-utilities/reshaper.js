function getSelectedDeliveryLocation(deliveryLocations) {
  const options = { deliveryType: '', shipModeId: 0, cost: 0, label: '' }

  const location = deliveryLocations.find((item) => item.selected)
  if (!location) return options
  options.deliveryMethod = location.deliveryLocationType
  options.deliveryType = location.deliveryLocationType

  if (location.deliveryMethods && location.deliveryMethods.length === 0) {
    return options
  }

  const method = location.deliveryMethods.find((item) => item.selected)
  // @note: this happening when parcelshop item are not available we need to be full defensive here
  if (!method) return options
  options.deliveryType = method.deliveryType
  options.shipModeId = method.shipModeId
  options.cost = method.cost || 0
  options.label = method.label
  options.additionalDescription = method.additionalDescription

  if (method.deliveryOptions && method.deliveryOptions.length === 0) {
    return options
  }

  const option = method.deliveryOptions.find((item) => item.selected)
  // @note: this should be impossible, but we need to be full defensive here
  // we return back the basic option if no deliveryOptions is selected
  if (!option) return { deliveryType: '', shipModeId: 0, cost: 0, label: '' }
  options.shipModeId = option.shipModeId
  options.nominatedDate = option.nominatedDate
  options.cost = parseFloat(method.cost, 10) === 0 ? 0 : option.price || 0
  options.dayText = option.dayText
  options.dateText = option.dateText
  options.nominatedDate = option.nominatedDate

  return options
}

export const selectedDeliveryLocationSafe = (deliveryLocations) => {
  if (!deliveryLocations) return {}

  return getSelectedDeliveryLocation(deliveryLocations)
}

export const selectedDeliveryLocation = (deliveryLocations) => {
  if (!deliveryLocations) {
    throw new Error(
      `Unexpected value, deliveryLocations:${deliveryLocations}. Consider HTTP GET to '/order-summary'.`
    )
  }

  return getSelectedDeliveryLocation(deliveryLocations)
}
