import { path, pathOr, omit, assoc, assocPath, isEmpty } from 'ramda'
import constants from '../../../../shared/constants/espotsDesktop'

const espotList = [
  constants.product.col1pos1,
  constants.product.col1pos2,
  constants.product.col2pos1,
  constants.product.col2pos2,
  constants.product.col2pos4,
  constants.product.klarna1,
  constants.product.klarna2,
  constants.product.content1,
]

const bundleEspotList = [
  constants.product.col1pos1,
  constants.product.content1,
  constants.product.klarna1,
  constants.product.klarna2,
]

function hasAdditionalAssets(wcsAssetsThumbnails) {
  return !(
    wcsAssetsThumbnails &&
    wcsAssetsThumbnails.length === 1 &&
    wcsAssetsThumbnails[0] === '_'
  )
}

const formatPrice = (price) =>
  (price && !isNaN(price) && parseFloat(price).toFixed(2)) || ''

const createBNPLObject = (unitPrice) => ({
  klarna: {
    instalments: 3,
    amount: formatPrice(unitPrice / 3),
  },
  clearpay: {
    instalments: 4,
    amount: formatPrice(unitPrice / 4),
  },
})

/**
 * [additionalAssets maps wcs response thumbnails to the expected assitional assets expected from the client]
 * @param  {[Array]} wcsAssetsThumbnails         [ e.g.: ["F_1.jpg", "M_1.jpg", "M_2.jpg", "M_3.jpg", "M_4.jpg"] ]
 * @param  {[Array]} wcsAssetsThumbnailimageurls [ e.g.: [{ "360": null, "small": "http://ts.sandpit.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26J09KKHA_Thumb_F_1.jpg", ...}, ...] ]
 * @param  {[String]} grouping                   [ e.g.: 'TS26J09KKHA' ]
 * @return {[Array]}                             [description]
 */
function additionalAssets(
  wcsAssetsThumbnails,
  wcsAssetsThumbnailimageurls,
  grouping
) {
  if (
    !Array.isArray(wcsAssetsThumbnails) ||
    !Array.isArray(wcsAssetsThumbnailimageurls) ||
    typeof grouping !== 'string'
  )
    return []

  const assetGroups = ['Zoom', '2col', '3col', '4col']

  // "http://ts.sandpit.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26J09KKHA_Thumb_F_1.jpg"
  const assetUrl =
    (wcsAssetsThumbnailimageurls[0] && wcsAssetsThumbnailimageurls[0].small) ||
    ''
  // "http://ts.sandpit.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/"
  const productImageBaseUrl = assetUrl.substring(0, assetUrl.indexOf(grouping))

  return assetGroups
    .map((group) =>
      wcsAssetsThumbnails.map((thumb, index) => ({
        assetType: `IMAGE_${group.toUpperCase()}`,
        index: index + 1,
        url: `${productImageBaseUrl + grouping}_${group}_${thumb}`,
      }))
    )
    .flat()
}

/**
 * [mapAssets maps wcs response assets to the expected assets from the client]
 * @param  {[Array]} wcsAssets [wcs assets]
 * @return {[Array]}           [assets that monty hapi Server will provide in the response]
 */
function mapAssets(wcsAssets) {
  if (!Array.isArray(wcsAssets)) return []

  return wcsAssets
    .filter(({ bundleCatentryId }) => bundleCatentryId === null)
    .map((cur, index) => {
      const base = { index: index + 1 }
      return cur.video
        ? { ...base, assetType: 'VIDEO', url: cur.video }
        : [
            { ...base, assetType: 'IMAGE_SMALL', url: cur.small },
            { ...base, assetType: 'IMAGE_THUMB', url: cur.shopTheOutfit },
            {
              ...base,
              assetType: 'IMAGE_NORMAL',
              url: cur.normal.replace('Large', '2col'),
            },
            { ...base, assetType: 'IMAGE_LARGE', url: cur.large },
          ]
    })
    .flat()
}

function hasAmplienceAssets(assets) {
  return (
    Array.isArray(assets) &&
    assets.some((asset) => asset.baseImageUrl || asset.baseVideoUrl)
  )
}

function mapAmplienceImages(assets) {
  return assets
    .filter(
      ({ baseImageUrl, bundleCatentryId }) =>
        Boolean(baseImageUrl) && bundleCatentryId === null
    )
    .map(({ baseImageUrl }) => baseImageUrl)
}

function mapAmplienceVideo(assets) {
  if (!Array.isArray(assets)) return []

  const video = assets
    .filter(({ baseVideoUrl }) => Boolean(baseVideoUrl))
    .find(({ baseVideoUrl }) => baseVideoUrl)
  return video && video.baseVideoUrl
}

function mapAmplienceAssets(assets = []) {
  if (!hasAmplienceAssets(assets)) {
    return
  }
  return {
    amplienceAssets: {
      images: mapAmplienceImages(assets),
      video: mapAmplienceVideo(assets),
    },
  }
}

/**
 * [mapSwatches description]
 * @param  {[Array]} wcsSwatches [wcs colour swatches]
 * @return {[Array]} [collection of objects where every object represents a colour swatch]
 */
function mapSwatches(wcsSwatches) {
  if (!Array.isArray(wcsSwatches)) return []

  return wcsSwatches.reduce((pre, cur) => {
    const swatch = {
      colourName: cur.swatchProductColour,
      imageUrl: cur.swatchProductImage,
      productId: cur.swatchProductId,
      productUrl: cur.swatchProductUrl,
    }
    pre.push(swatch)
    return pre
  }, [])
}

/**
 * [mapBundleItems maps items for single product in Bundle]
 * @param  {[Array]} wcsItems  [bundle items from WCS response e.g.: "items": [{ "skuId": 26934194, "availableInventory": 10,...}, { "skuId": 26934200, "availableInventory": 10,...}, ...]
 * @param  {[Integer]} bundleNum [position of the product in the Bundle]
 * @return {[Array]}           [mapped items as per monty hapi endpoints contract with the client]
 */
function mapBundleItems(wcsItems, bundleNum) {
  if (!Array.isArray(wcsItems) || isNaN(bundleNum)) return []

  const mappedItems = wcsItems.map((wcsItem) => {
    return {
      sku: wcsItem.partNumber && wcsItem.partNumber.toString(),
      size: wcsItem[`attrValue_${bundleNum}`],
      quantity: wcsItem.availableInventory,
      catEntryId: wcsItem.skuId,
      selected: false,
    }
  })
  return mappedItems
}

/**
 * [mapFlexibleBundleItems maps items for single product in Flexible Bundle]
 * @param  {[Array]} wcsItems  [product items if Flexible Bundle from WCS response]
 * @param  {[Integer]} bundleNum [position of the product in the Flexible Bundle]
 * @return {[Array]}           [mapped items as per monty hapi endpoints contract with the client]
 */
function mapFlexibleBundleItems(wcsItems, bundleNum) {
  if (!Array.isArray(wcsItems) || isNaN(bundleNum)) return []

  const mappedItems = wcsItems.map((wcsItem) => {
    return {
      sku: wcsItem.partNumber && wcsItem.partNumber.toString(),
      size: wcsItem.attrValue,
      quantity: wcsItem.availableInventory,
      catEntryId: wcsItem.skuId,
      selected: false,
    }
  })
  return mappedItems
}

/**
 * [mergeAnsMapBundleItems maps the items of every product of the bundle and merges them back together]
 * @param  {[type]} bundleSlots [Bundle data as provided by WCS]
 * @return {[Array]}             [collection of the mapped items of the products of the Bundle]
 */
function mergeAndMapBundleItems(bundleSlots) {
  if (!Array.isArray(bundleSlots)) return []

  return bundleSlots.reduce((pre, cur, index) => {
    return pre.concat(
      mapBundleItems(path(['product', '0', 'items'], cur), index + 1)
    )
  }, [])
}

/**
 * [mergeAndMapFlexibleBundleItems takes the items from every product belonging to the Flexible Bundle, maps them and finally merges them together]
 * @param  {[Array]} bundleSlots [slots composing the Flexible Bundle]
 * @return {[Array]}             [mapped and merged array of items from every product belonging to the Flexible Bundle]
 */
function mergeAndMapFlexibleBundleItems(bundleSlots) {
  if (!Array.isArray(bundleSlots)) return []

  const mergedItems = bundleSlots.reduce((pre, slot, i) => {
    const items = path(
      [`bundleDetailsForm${i + 1}`, 'products', '0', 'items'],
      slot
    )
    const mappedItems =
      Array.isArray(items) &&
      items.map((item) => {
        return {
          sku: (item.partNumber && item.partNumber.toString()) || '',
          size: item.attrValue,
          quantity: item.availableInventory,
          selected: false, // !!! WCS does not provide this parameter
        }
      })
    return mappedItems ? pre.concat(mappedItems) : pre
  }, [])

  return mergedItems
}

/**
 * [generateBundleProductAssets generates assets collection for single Product in Bundle as per monty hapi response]
 * @param  {[String]} wcsBundleProductImg     [e.g.: http://ts.sandpit.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS03L01LKHA_Small_F_1.jpg || wcsBundleProductImg = http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_small.jpg]
 * @param  {[Integer]} productPositionInBundle [index representing the Product position in the Bundle]
 * @return {[Array]} [e.g.: [{"assetType": "IMAGE_SMALL", "index": 1, "url": "http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_Thumb_F_1.jpg"}, ...] ]
 */
function generateBundleProductAssets(
  wcsBundleProductImg,
  productPositionInBundle
) {
  if (
    typeof wcsBundleProductImg !== 'string' ||
    isNaN(productPositionInBundle)
  ) {
    return []
  }

  const sizeParam = /(_|\$)(small)(_|\$|\.)/i.exec(wcsBundleProductImg)
  if (!sizeParam) {
    return []
  }

  const createParam = (newSize) => {
    const [
      ,
      /* whole match */ firstSeperator,
      ,
      /** size */ lastSeperator,
    ] = sizeParam

    return `${firstSeperator}${newSize}${lastSeperator}`
  }

  const [, , size] = sizeParam
  const isCapitalised = /^[A-Z]/.test(size)

  const imageDimensions = [
    {
      type: 'IMAGE_SMALL',
      size: createParam(isCapitalised ? 'Thumb' : 'thumb'),
    },
    {
      type: 'IMAGE_THUMB',
      size: createParam(isCapitalised ? 'Small' : 'small'),
    },
    {
      type: 'IMAGE_NORMAL',
      size: createParam('2col'),
    },
    {
      type: 'IMAGE_LARGE',
      size: createParam(isCapitalised ? 'Zoom' : 'zoom'),
    },
  ]

  return imageDimensions.map((imageDimension) => ({
    assetType: imageDimension.type,
    index: productPositionInBundle,
    url: wcsBundleProductImg.replace(createParam(size), imageDimension.size),
  }))
}

function mapBundleProductAttributes(sizeGuide, bundleType) {
  return {
    // https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP
    ECMC_PROD_SIZE_GUIDE_1: sizeGuide,
    b_hasImage: 'N',
    CEThumbnailSuffixes: '',
    b_has360: 'N',
    EmailBackInStock: 'N',
    BundleType: bundleType, // we cannot find this in WCS response but we can hardcode it since we are in a function which is specific to Flexible Bundles
    b_hasVideo: 'N',
    STORE_DELIVERY: 'true',
    hasVideo: 'N',
    Department: '',
    CE3BThumbnailSuffixes: '',
    has360: 'N',
    SearchKeywords: '',
    ThresholdMessage: '',
    IFSeason: 'SS16',
    thumbnailImageSuffixes: '_',
    ECMC_PROD_COLOUR_1: '', // not provided by WCS, not clear how scrAPI produces it and not used by monty Client: hardcoding it.
    StyleCode: '0',
    COLOUR_CODE: '',
    STYLE_CODE: '',
    NotifyMe: 'N',
    countryExclusion: '',
    SizeFit: '',
    ProductDefaultCopy: '',
    shopTheOutfitBundleCode: '',
  }
}

function mapGenericBundleProduct(product, productPositionInBundle, bundleType) {
  if (!product) return {}

  const wasPrice = product.was1Price
  const wasWasPrice = product.was2Price
  const historicalPrice = {}

  // see https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/156926095/wasPrice+wasWasPrice+unitPrice
  if (wasPrice && wasWasPrice) {
    historicalPrice.wasWasPrice =
      wasPrice && !isNaN(wasPrice) && parseFloat(wasPrice).toFixed(2)
    historicalPrice.wasPrice =
      wasWasPrice && !isNaN(wasWasPrice) && parseFloat(wasWasPrice).toFixed(2)
  } else if (wasPrice) {
    historicalPrice.wasPrice =
      wasPrice && !isNaN(wasPrice) && parseFloat(wasPrice).toFixed(2)
  } else if (wasWasPrice) {
    historicalPrice.wasPrice =
      wasWasPrice && !isNaN(wasWasPrice) && parseFloat(wasWasPrice).toFixed(2)
  }
  const hasAmplienceAssets = product.baseImageUrl || product.baseVideoUrl

  return {
    grouping: product.partNumber,
    lineNumber: product.lineNumber,
    name: product.productName,
    description:
      typeof product.longDescription === 'string' &&
      decodeURIComponent(product.longDescription.replace(/\+/g, ' ')),
    ...historicalPrice,
    unitPrice:
      !isNaN(product.nowPrice) && parseFloat(product.nowPrice).toFixed(2), // [Karthi] it will be "nowPrice"
    stockEmail: product.stockEmail === 'true',
    storeDelivery: false, // Hardcoded as is done in scrAPI (https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP#PDP-stockEmail,storeDelivery,stockThresholdatBundlelevel)
    stockThreshold: 10, // Hardcoded as is done in scrAPI (https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP#PDP-stockEmail,storeDelivery,stockThresholdatBundlelevel)
    assets: generateBundleProductAssets(product.imgFullImg, 1), // For products belonging to Flexible Bundle the "index" of all the assets is 1.
    ...(hasAmplienceAssets && {
      amplienceAssets: {
        images: [product.baseImageUrl],
        video: product.baseVideoUrl,
      },
    }),
    items:
      bundleType === 'Flexible'
        ? mapFlexibleBundleItems(product.items, productPositionInBundle)
        : mapBundleItems(product.items, productPositionInBundle),
    bundleProducts: [],
    attributes: mapBundleProductAttributes(product.sizeGuide, bundleType),
    colourSwatches: [], // [Cogz] "Colour swatches were not given for products part of bundle in desktop responses. I believe it should be an empty array."
    tpmLinks: [], // [Cogz] "TPM links are given for individual products and not for product part of bundle."
    bundleSlots: [], // [Cogz] "this applies for bundle and not for product part of bundle"
    ageVerificationRequired: false, // [Cogz] "this was used for BHS site, and this applies only in cart page. Not in PDP"
    isBundleOrOutfit: true, // we can hardcode it because we are in a function dedicated to Flexible Bundles
  }
}

/**
 * [mapBundleProdut maps a product belonging to a Bundle from WCS format to monty hapi contract format]
 * @param  {[Object]} bundleProductSlot [product slot belonging to Bundle as returned by WCS]
 * @return {[Object]}               [mapped version of the product received as argument]
 */
function mapFlexibleBundleProduct(bundleProductSlot, productPositionInBundle) {
  if (!bundleProductSlot || isNaN(productPositionInBundle)) return {}

  const bundleDetailsForm =
    bundleProductSlot[`bundleDetailsForm${productPositionInBundle}`]
  const product =
    bundleDetailsForm &&
    Array.isArray(bundleDetailsForm.products) &&
    bundleDetailsForm.products[0]

  if (!product) return {}

  const mappedGenericBundleProduct = mapGenericBundleProduct(
    product,
    productPositionInBundle,
    'Flexible'
  )

  return {
    ...mappedGenericBundleProduct,
    productId: parseInt(product.catEntryId, 10),
    wcsColourKey: path(['attributes', '0', 'attrName'], product),
    wcsSizeKey: product.attrName,
  }
}

/**
 * [mapBundleProdut maps a product belonging to a Fixed Bundle from WCS format to monty hapi contract format]
 * @param  {[Object]} bundleProduct [product belonging to Bundle as returned by WCS e.g.: { "slot_1": "1", "catEntryId_1": 26934187, "imgFullImg": ...} ]
 * @return {[Object]}               [mapped version of the product received as argument]
 */
function mapFixedBundleProduct(bundleProduct, productPositionInBundle) {
  if (!bundleProduct || isNaN(productPositionInBundle)) return {}

  const productAttributes = path(['attributes', '0'], bundleProduct)

  const mappedGenericBundleProduct = mapGenericBundleProduct(
    bundleProduct,
    productPositionInBundle,
    'Fixed'
  )

  return {
    ...mappedGenericBundleProduct,
    productId: bundleProduct[`catEntryId_${productPositionInBundle}`],
    wcsColourKey:
      productAttributes &&
      productAttributes[`attrName_${productPositionInBundle}`],
    wcsSizeKey: bundleProduct[`attrName_${productPositionInBundle}`],
    colour:
      productAttributes &&
      productAttributes[`attrValue_${productPositionInBundle}`],
  }
}

function productDataQuantity(body) {
  const pdq = path(['addToBagForm', 'productDataQuantity', '0'], body)

  if (!pdq) return {}

  return Object.assign({}, pdq, {
    SKUs: pdq.SKUs.map((sku) =>
      assoc('attrName', sku.attrName.toString(), sku)
    ),

    inventoryPositions: pdq.inventoryPositions.map((pos) => {
      const tmpPos = {
        catentryId: pos.catentryId.toString(),
      }

      if (pos.partNumber) tmpPos.partNumber = pos.partNumber
      if (pos.invavls) tmpPos.invavls = pos.invavls
      if (pos.inventorys) tmpPos.inventorys = pos.inventorys

      return tmpPos
    }),
  })
}

function mapBreadcrumbs(body, productName) {
  const {
    firstLevelCategoryName,
    firstLevelCategoryDisplayURL,
    secondLevelCategoryName,
    secondLevelCategoryDisplayURL,
  } = body

  const firstCategoryBreadcrumb = firstLevelCategoryName && {
    label: firstLevelCategoryName,
    url: firstLevelCategoryDisplayURL,
  }

  const secondCategoryBreadcrumb = secondLevelCategoryName && {
    label: secondLevelCategoryName,
    url: secondLevelCategoryDisplayURL,
  }

  const productBreadcrumb = productName && {
    label: productName,
  }

  return [
    { label: 'Home', url: '/' },
    firstCategoryBreadcrumb,
    secondCategoryBreadcrumb,
    productBreadcrumb,
  ].filter(Boolean)
}

/**
 * [mapNoBundle performs the mapping of the WCS body respone for a Product which is not a Bundle]
 * @param  {[Object]} body [WCS response body]
 * @return {[Object]}      [mapped response]
 */
function mapNoBundle(body = {}) {
  const grouping = path(['productData', 'grouping'], body) // e.g.: TS26J09KKHA
  const productData = path(['productData'], body)
  const assetThumbnails = path(['thumbnails'], productData)
  const addToBagForm = path(['addToBagForm'], body)
  const productDescription = pathOr('', ['description'], productData)
  const wasWasPrice = path(['prices', 'was2Price'], productData)
  const wasPrice = path(['prices', 'was1Price'], productData)
  const unitPrice = path(['prices', 'nowPrice'], productData)

  // the difference between original price and current price
  const totalMarkdownValue = path(['prices', 'was1PriceDiff'], productData)
  const items = path(['addToBagForm', 'productItemValue'], body)
  const promotionDisplayURL = path(
    ['addToBagForm', 'promotionDisplayURL'],
    body
  )
  const promoTitle = path(['addToBagForm', 'promoTitle'], body)
  const thumbnailAssets = path(['assets', 'Thumbnailimageurls'], productData)
  const name = path(['name'], productData)

  const res = {
    pageTitle: path(['pageTitle'], body),
    iscmCategory: path(['iscmCategory'], productData),
    breadcrumbs: mapBreadcrumbs(body, name),
    contentSlotContentHTML: path(['contentHTML'], body),
    productId: path(['productId'], productData),
    grouping: path(['grouping'], productData),
    lineNumber: path(['lineNumber'], productData),
    colour: path(['colour'], productData),
    name,
    description: decodeURIComponent(productDescription.replace(/\+/g, ' ')),
    metaDescription:
      path(['metaDescription'], body) || path(['metaDescription'], productData),
    notifyMe: Boolean(path(['notifyMe'], productData) === 'Y'),
    unitPrice: formatPrice(unitPrice),
    stockEmail: path(['stockEmail'], productData) === 'Y',
    storeDelivery: path(['storeDelivery'], productData),
    stockThreshold: path(['stockThreshold'], productData),
    wcsColourKey: path(['attrName'], addToBagForm),
    wcsColourADValueId: path(['attrValue'], addToBagForm),
    wcsSizeKey: path(['productItemValue', '0', 'attrName'], addToBagForm),
    assets: mapAssets(thumbnailAssets),
    items:
      (Array.isArray(items) &&
        items.map((item) => {
          return omit(['skuid'], item)
        })) ||
      [],
    bundleProducts: [], // The current mapping is specific to No Bundle product
    attributes: path(['attributes'], productData),
    colourSwatches: mapSwatches(pathOr([], ['colourSwatches'], body)),
    tpmLinks: pathOr([], ['tpmLinks'], productData),
    bundleSlots: [], // The current mapping is specific to No Bundle product
    sourceUrl: pathOr('', ['sourceUrl'], body),
    canonicalUrl: pathOr('', ['canonicalUrl'], body),
    canonicalUrlSet: pathOr(false, ['canonicalUrlSet'], body),
    ageVerificationRequired: path(['ageVerificationRequired'], addToBagForm),
    isBundleOrOutfit: false, // The current mapping is specific to No Bundle product
    productDataQuantity: productDataQuantity(body),
    version: '1.7',
    espots: {
      CEProductEspotCol1Pos1: 'mobilePDPESpotPos2',
    },
    deliveryMessage: path(['deliveryMessage'], addToBagForm),
    shopTheLookProducts: pathOr(false, ['shopTheLookProducts'], body),
    bundleDisplayURL: pathOr('', ['BundleDisplayURL'], body),
    seeMoreText: path(['seeMoreText'], body),
    seeMoreValue: path(['seeMoreValue'], body),
    ...(hasAdditionalAssets(thumbnailAssets) && {
      additionalAssets: additionalAssets(
        assetThumbnails,
        path(['assets', 'Thumbnailimageurls'], productData),
        grouping
      ),
    }),
    ...mapAmplienceAssets(thumbnailAssets),
    isDDPProduct: path(['isDDPProduct'], body),
    // buy now pay later
    bnplPaymentOptions: unitPrice && createBNPLObject(unitPrice),
  }

  espotList.forEach((espot) => {
    const espotData = path(['espots', espot], body)
    if (espotData && !isEmpty(espotData)) {
      res.espots[espot] = espotData
    } else if (
      path(['addToBagForm', espot], body) &&
      !isEmpty(body.addToBagForm[espot])
    ) {
      res.espots[espot] = body.addToBagForm[espot]
    }
  })

  if (promotionDisplayURL && promoTitle) {
    res.promotionDisplayURL = promotionDisplayURL
    res.promoTitle = promoTitle
  }

  // see https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/156926095/wasPrice+wasWasPrice+unitPrice
  if (wasPrice && wasWasPrice) {
    res.wasWasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
    res.wasPrice = wasWasPrice && !isNaN(wasWasPrice) && wasWasPrice.toFixed(2)
  } else if (wasPrice) {
    res.wasPrice = wasPrice && !isNaN(wasPrice) && wasPrice.toFixed(2)
  }

  if (totalMarkdownValue) {
    res.totalMarkdownValue =
      totalMarkdownValue &&
      !isNaN(totalMarkdownValue) &&
      totalMarkdownValue.toFixed(2)
  }

  return res
}

/**
 * mapBundle mapping of the common response section of Fixed and Flexible Bundles
 * @param  {Object} body                 WCS response body
 * @param  {Array} mappedBundleProducts  mapped bundleProducts section
 * @return {Object}                      mapped Bundle section of the WCS response body
 */
function mapBundle(body = {}, mappedBundleProducts) {
  const { BundleDetails = {} } = body
  const thumbnailAssets = path(['assets', 'Thumbnailimageurls'], body)
  const name = path(['productDescription'], body)

  let bundle = {
    pageTitle: path(['pageTitle'], body),
    iscmCategory: path(['iscmCategory'], body),
    breadcrumbs: mapBreadcrumbs(body, name),
    contentSlotContentHTML: BundleDetails.contentHtml,
    grouping: BundleDetails.lineNumber,
    lineNumber: BundleDetails.lineNumber,
    name,
    metaDescription: path(['metaDescription'], BundleDetails),
    unitPrice: BundleDetails.nowPrice.toFixed(2),
    stockEmail: false, // Hardcoded as is done in scrAPI (https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP#PDP-stockEmail,storeDelivery,stockThresholdatBundlelevel)
    storeDelivery: false, // Hardcoded as is done in scrAPI (https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP#PDP-stockEmail,storeDelivery,stockThresholdatBundlelevel)
    stockThreshold: 10, // Hardcoded as is done in scrAPI (https://arcadiagroup.atlassian.net/wiki/spaces/SE/pages/91653501/PDP#PDP-stockEmail,storeDelivery,stockThresholdatBundlelevel)
    assets: mapAssets(thumbnailAssets),
    bundleProducts: mappedBundleProducts,
    attributes: {}, // Not provided by WCS and scrAPI provides it as empty object for both Fixed and Flexible
    colourSwatches: [], // [Cogz] "Colour swatches were not given for products part of bundle in desktop responses. I believe it should be an empty array."
    tpmLinks: [], // [Cogz] "TPM links are given for individual products and not for product part of bundle."
    bundleSlots:
      (Array.isArray(mappedBundleProducts) &&
        mappedBundleProducts.map((bundleProduct, i) => {
          return {
            slotNumber: i + 1,
            products: [bundleProduct],
          }
        })) ||
      [],
    sourceUrl: path(['sourceUrl'], body),
    canonicalUrl: pathOr('', ['canonicalUrl'], BundleDetails),
    canonicalUrlSet: pathOr(false, ['canonicalUrlSet'], BundleDetails),
    ageVerificationRequired: false, // [Cogz] BHS related. Out of scope now.
    isBundleOrOutfit: path(['isBundle'], body),
    version: '',
    deliveryMessage: path(['BundleDetails', 'deliveryMessage'], body),
    seeMoreText: path(['seeMoreText'], body),
    seeMoreValue: path(['seeMoreValue'], body),
    ...mapAmplienceAssets(thumbnailAssets),
    bnplPaymentOptions:
      BundleDetails.nowPrice && createBNPLObject(BundleDetails.nowPrice),
  }

  bundleEspotList.forEach((espot) => {
    const espotData = path(['espots', espot], body)
    if (espotData && !isEmpty(espotData)) {
      bundle = assocPath(['espots', espot], espotData, bundle)
    }
  })

  return bundle
}

/**
 * [mapFixedBundle performs the mapping of the WCS body respone for a Product which is a Fixed Bundle]
 * @param  {[Object]} body [WCS response body]
 * @return {[Object]}      [mapped response]
 */
function mapFixedBundle(body = {}) {
  const productsInBundle = path(
    ['BundleDetails', 'bundleDetailsForm', 'bundleSlots'],
    body
  )
  const mappedBundleProducts =
    Array.isArray(productsInBundle) &&
    productsInBundle.map(({ product }, i) => {
      // !!! to be modified once you have the mapFixedBundleProduct function
      return mapFixedBundleProduct(path([0], product), i + 1)
    })
  const mappedCommonParameters = mapBundle(body, mappedBundleProducts) // Common parameters to Fixed and Flexible Bundles
  const description = path(['BundleDetails', 'description'], body) || ''

  return {
    ...mappedCommonParameters,
    productId: path(['BundleDetails', 'bundleDetailsForm', 'productId'], body),
    description: decodeURIComponent(description.replace(/\+/g, ' ')),
    items: mergeAndMapBundleItems(
      path(['BundleDetails', 'bundleDetailsForm', 'bundleSlots'], body)
    ),
    bundleType: 'Fixed', // The current block of code is specifig to Fixed Bundles and hence we can hardcode the value.
  }
}

/**
 * [mapFlexibleBundle performs the mapping of the WCS body respone for a Product which is a Flexible Bundle]
 * @param  {[Object]} body [WCS response body]
 * @return {[Object]}      [mapped response]
 */
function mapFlexibleBundle(body) {
  const bundleSlots = path(['BundleDetails', 'bundleSlots'], body)
  const mappedBundleProducts =
    (Array.isArray(bundleSlots) &&
      bundleSlots.map((bundleSlot, i) => {
        return mapFlexibleBundleProduct(bundleSlot, i + 1)
      })) ||
    []
  const mappedCommonParameters = mapBundle(body, mappedBundleProducts) // Common parameters to Fixed and Flexible Bundles
  const longDescription = path(['longDescription'], body) || ''

  return {
    ...mappedCommonParameters,
    productId: parseInt(path(['BundleDetails', 'productId'], body), 10),
    description: decodeURIComponent(longDescription.replace(/\+/g, ' ')),
    items: mergeAndMapFlexibleBundleItems(
      path(['BundleDetails', 'bundleSlots'], body)
    ),
    bundleType: 'Flexible', // The current block of code is specifig to Flexible Bundles and hence we can hardcode the value.
  }
}

export {
  mapNoBundle,
  mapFixedBundle,
  mapFlexibleBundle,
  mapBundle,
  mapAssets,
  mapAmplienceAssets,
  additionalAssets,
  mapSwatches,
  mergeAndMapBundleItems,
  mapFlexibleBundleProduct,
  mergeAndMapFlexibleBundleItems,
  mapFixedBundleProduct,
  mapBreadcrumbs,
}
