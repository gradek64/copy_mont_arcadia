const assetType = (type, property, replacement) => ({
  type,
  property,
  transform: replacement ? (prop = '') => prop.replace(...replacement) : '',
})

const wishlistAssetTypes = [
  assetType('IMAGE_THUMB', 'productImageUrl', ['3col', 'Thumb']),
  assetType('IMAGE_SMALL', 'productImageUrl', ['3col', 'Small']),
  assetType('IMAGE_NORMAL', 'productImageUrl', ['3col', '2col']),
  assetType('IMAGE_LARGE', 'productImageUrl', ['3col', 'Zoom']),
  assetType('IMAGE_OUTFIT_THUMB', 'outfitImageUrl', ['3col', 'Thumb']),
  assetType('IMAGE_OUTFIT_SMALL', 'outfitImageUrl', ['3col', 'Small']),
  assetType('IMAGE_OUTFIT_NORMAL', 'outfitImageUrl', ['3col', '2col']),
  assetType('IMAGE_OUTFIT_LARGE', 'outfitImageUrl', ['3col', 'Large']),
]

export { wishlistAssetTypes }
