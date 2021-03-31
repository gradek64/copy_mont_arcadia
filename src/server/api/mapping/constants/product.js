const sortOptionMap = {
  Relevance: {
    label: 'Best Match',
    value: 'Relevance',
  },
  Newness: {
    label: 'Newest',
    value: 'Newness',
  },
  PriceAscending: {
    label: 'Price - Low To High',
    value: 'Price Ascending',
  },
  PriceDescending: {
    label: 'Price - High To Low',
    value: 'Price Descending',
  },
  RatingDescending: {
    label: 'Rating - Descending',
    value: 'Rating Descending',
  },
}

const refinementsWithValueOf2 = ['price', 'rating']

const assetType = (type, property, replacement, index, urlOptions) => ({
  type,
  property,
  transform: replacement ? (prop) => prop.replace(...replacement) : '',
  index,
  urlOptions,
})

const assetTypes = [
  assetType('IMAGE_SMALL', 'productImage', ['3col', 'Thumb'], 1),
  assetType('IMAGE_THUMB', 'productImage', ['3col', 'Small'], 1),
  assetType('IMAGE_NORMAL', 'productImage', ['3col', '2col'], 1),
  assetType('IMAGE_LARGE', 'productImage', ['3col', 'Zoom'], 1),
  assetType('IMAGE_PRODUCT_ICON', 'badgesMediumImg', ['Medium', 'Mobile'], 1, {
    notMedia: true,
  }),

  // @NOTE IMAGE_PROMO_GRAPHIC is mapping an attribute-based banner here and NOT the promo banner
  // To be safely removed from assetTypes since promo banners can be generated in additionalAssetsTypes
  // with the rest of banners/badges images.
  // assetType('IMAGE_PROMO_GRAPHIC', 'bannersMediumImg', ['Medium', 'Mobile'], 1, { notMedia: true })
]

const promoReplacer = (size) => (match, group) =>
  ['images/category_icons/promo_code', group, `${size}.png`].join('_')
const promoBannerTransformer = (size) => [/([\d]*)/, promoReplacer(size)]

const additionalAssetsTypes = [
  assetType('IMAGE_ZOOM', 'productImage', ['3col', 'Zoom'], 1),
  assetType('IMAGE_2COL', 'productImage', ['3col', '2col'], 1),
  assetType('IMAGE_3COL', 'productImage', '', 1),
  assetType('IMAGE_4COL', 'productImage', ['3col', '4col'], 1),
  assetType('IMAGE_OUTFIT_SMALL', 'outfitImage', ['3col', 'Thumb'], 2),
  assetType('IMAGE_OUTFIT_THUMB', 'outfitImage', ['3col', 'Small'], 2),
  assetType('IMAGE_OUTFIT_NORMAL', 'outfitImage', ['3col', '2col'], 2),
  assetType('IMAGE_OUTFIT_LARGE', 'outfitImage', ['3col', 'Large'], 2),
  assetType('IMAGE_OUTFIT_ZOOM', 'outfitImage', ['3col', 'Zoom'], 2),
  assetType('IMAGE_OUTFIT_2COL', 'outfitImage', ['3col', '2col'], 2),
  assetType('IMAGE_OUTFIT_3COL', 'outfitImage', '', 2),
  assetType('IMAGE_OUTFIT_4COL', 'outfitImage', ['3col', '4col'], 2),
  assetType('IMAGE_BADGE_SMALL', 'badgesSmallImg', '', 1, { isBanner: true }),
  assetType('IMAGE_BADGE_MEDIUM', 'badgesMediumImg', '', 1, { isBanner: true }),
  assetType('IMAGE_BADGE_LARGE', 'badgesLargeImg', '', 1, { isBanner: true }),
  assetType('IMAGE_BADGE_MOBILE', 'badgesLargeImg', ['Large', 'Mobile'], 1, {
    isBanner: true,
  }),
  assetType('IMAGE_BANNER_SMALL', 'bannersSmallImg', '', 1, { isBanner: true }),
  assetType('IMAGE_BANNER_MEDIUM', 'bannersMediumImg', '', 1, {
    isBanner: true,
  }),
  assetType('IMAGE_BANNER_LARGE', 'bannersLargeImg', '', 1, { isBanner: true }),
  assetType('IMAGE_BANNER_MOBILE', 'bannersLargeImg', ['Large', 'Mobile'], 1, {
    isBanner: true,
  }),
  assetType(
    'IMAGE_PROMO_GRAPHIC_SMALL',
    'promoCalcode',
    promoBannerTransformer('small'),
    1
  ),
  assetType(
    'IMAGE_PROMO_GRAPHIC_MEDIUM',
    'promoCalcode',
    promoBannerTransformer('medium'),
    1
  ),
  assetType(
    'IMAGE_PROMO_GRAPHIC_LARGE',
    'promoCalcode',
    promoBannerTransformer('large'),
    1
  ),
  assetType(
    'IMAGE_PROMO_GRAPHIC_MOBILE',
    'promoCalcode',
    promoBannerTransformer('mobile'),
    1
  ),
]

const brandImagePath = {
  topshop: 'TopShop',
  topman: 'TopMan',
  evans: 'Evans',
  missselfridge: 'MissSelfridge',
  dorothyperkins: 'DorothyPerkins',
  burton: 'Burton',
  wallis: 'Wallis',
}

const brandCode = {
  br: 'burton',
  dp: 'dorothyperkins',
  ev: 'evans',
  ms: 'missselfridge',
  tm: 'topman',
  ts: 'topshop',
  wl: 'wallis',
}

export {
  sortOptionMap,
  refinementsWithValueOf2,
  assetTypes,
  additionalAssetsTypes,
  brandImagePath,
  brandCode,
}
