export const getProductUnitPrice = (product = {}) => {
  const {
    isBundleOrOutfit,
    bundleType,
    bundleMinPrice,
    NumberOfSlots,
    nowPrice,
  } = product
  const hasBundleRequirements = isBundleOrOutfit && bundleType && bundleMinPrice
  const isBundleOrOutfitWithMoreThanOneSlot =
    (isBundleOrOutfit === 'Outfit' || isBundleOrOutfit === 'Bundle') &&
    parseInt(NumberOfSlots, 10) > 1

  if (hasBundleRequirements && isBundleOrOutfitWithMoreThanOneSlot)
    return parseFloat(bundleMinPrice).toFixed(2)

  return parseFloat(nowPrice).toFixed(2)
}
