import { path } from 'ramda'
import {
  sortOptionMap,
  assetTypes,
  additionalAssetsTypes,
  brandImagePath,
} from '../constants/product'

import { getConfigByStoreCode } from '../../../config'
import { isAbsoluteUrl } from '../../../../shared/lib/url-utils'
import { getProductUnitPrice } from '../utils/productUtils'

const sortOptionFragment = (option) => {
  const transformLabel = (value) => value.substring(0, value.indexOf('_'))
  const sortOption = sortOptionMap[transformLabel(option.label)]
  if (!sortOption) return sortOption // should never undefined, just more defensive code
  sortOption.navigationState = option.navigationState || ''
  if (option.translatedLabel) sortOption.label = option.translatedLabel // override label string if wcs provide translation
  return sortOption
}

const sortOptionsFragment = (results) => {
  const sortOptions = path(['contents', 0, 'sortOptions'], results)
  return sortOptions && Array.isArray(sortOptions)
    ? sortOptions.map((item) => sortOptionFragment(item))
    : []
}

const categoryTitleFragment = (plpJson) => {
  const refinementCrumbs = path(['Breadcrumbs', 0, 'refinementCrumbs'], plpJson)
  if (!Array.isArray(refinementCrumbs)) return ''
  const result = refinementCrumbs.find(
    ({ dimensionName = '' }) =>
      typeof dimensionName === 'string' && dimensionName.includes('category')
  )
  return path(['label'], result) || ''
}

const categoryDescriptionFragment = (plpJson) =>
  path(['metaDescription'], plpJson) || ''

const reduceRefinementCrumbs = (breadcrumbs, refinementCrumb) => {
  if (refinementCrumb && breadcrumbs && Array.isArray(breadcrumbs)) {
    if (refinementCrumb.dimensionName === 'siteId') {
      return breadcrumbs.concat({ label: 'Home', url: '/' })
    }

    if (
      typeof refinementCrumb.dimensionName === 'string' &&
      refinementCrumb.dimensionName.includes('category') // eg. Topshop_uk_category, Burton_de_category, etc.
    ) {
      let category = []
      if (refinementCrumb.ancestors) {
        refinementCrumb.ancestors.forEach((ancestor) => {
          category = category.concat(
            path(['properties', 'SourceId'], ancestor) || []
          )
          const url = path(['navigationState'], ancestor)
          breadcrumbs.push({
            label: ancestor.label,
            category: category.join(','),
            url,
          })
        })
      }

      category = category.concat(
        path(['properties', 'SourceId'], refinementCrumb) || []
      )
      return breadcrumbs.concat({
        label: refinementCrumb.label,
        category: category.join(','),
      })
    }
  }
  return breadcrumbs
}

const breadcrumbsFragment = (breadcrumbs) => {
  const refinementCrumbs = path([0, 'refinementCrumbs'], breadcrumbs)
  return refinementCrumbs && Array.isArray(refinementCrumbs)
    ? refinementCrumbs.reduceRight(
        (breadcrumbs, item) => reduceRefinementCrumbs(breadcrumbs, item),
        []
      )
    : []
}

const refinementOptionFragment = ({
  label,
  count,
  navigationState,
  properties,
}) => {
  const selected =
    path(['Selected'], properties) === 'true' ? { selectedFlag: true } : {}
  return {
    ...selected,
    type: 'VALUE',
    label,
    value: label,
    count,
    seoUrl: Array.isArray(navigationState)
      ? path([0], navigationState)
      : navigationState || '',
  }
}

const refinementFragment = (navigationItem) => {
  if (navigationItem) {
    if (navigationItem.dimensionName) {
      return {
        label:
          navigationItem.name ||
          path(
            ['refinements', 0, 'properties', 'refinement_name'],
            navigationItem
          ) ||
          '',
        refinementOptions:
          navigationItem.refinements &&
          Array.isArray(navigationItem.refinements)
            ? navigationItem.refinements.map((item) =>
                refinementOptionFragment(item)
              )
            : [],
      }
    }
    if (navigationItem.minPrice && navigationItem.maxPrice) {
      return {
        label: navigationItem.name,
        refinementOptions: [
          {
            type: 'RANGE',
            minValue: parseInt(navigationItem.minPrice, 10).toFixed(0),
            maxValue: parseInt(navigationItem.maxPrice, 10).toFixed(0),
          },
        ],
      }
    }
  }
  return {}
}

const refinementsFragment = (navigation) => {
  const refinements = path(['0'], navigation)
  return refinements && Array.isArray(refinements)
    ? refinements.map((item) => refinementFragment(item))
    : []
}

const activeRefinementsFragment = ({
  refinementCrumbs = [],
  rangeFilterCrumbs = [],
} = {}) => {
  if (!Array.isArray(refinementCrumbs) || !Array.isArray(rangeFilterCrumbs))
    return []
  return [
    ...refinementCrumbs.filter(
      ({ dimensionName = '' }) => dimensionName && dimensionName !== 'siteId'
    ),
    ...rangeFilterCrumbs,
  ]
}

const createImageUrl = (
  hostname,
  location,
  brandName,
  storeCode,
  urlOptions = {}
) => {
  if (isAbsoluteUrl(location)) {
    return location
  }

  const { mediaHostname } = getConfigByStoreCode(storeCode)
  if (urlOptions) {
    if (urlOptions.notMedia) {
      return `${hostname}${location}`
    } else if (urlOptions.isBanner) {
      return `http://${mediaHostname}${location}`
    }
  }
  return `http://${mediaHostname}/wcsstore/${brandImagePath[brandName]}/${location}`
}

const assetFragment = (
  hostname,
  type,
  index,
  location,
  brandName,
  storeCode,
  urlOptions = {}
) => ({
  assetType: type,
  index,
  url: createImageUrl(hostname, location, brandName, storeCode, urlOptions),
})

const assetsFragment = (
  hostname,
  product,
  brandName,
  storeCode,
  assetTypes = []
) =>
  assetTypes
    .filter(
      (assetType) =>
        product[assetType.property] &&
        (assetType.property !== 'outfitImage' ||
          product.outfitImage !== product.productImage)
    )
    .map(({ type, index, property, transform, urlOptions }) =>
      assetFragment(
        hostname,
        type,
        index,
        transform ? transform(product[property]) : product[property],
        brandName,
        storeCode,
        urlOptions
      )
    )

const wasPrices = ({ was1Price, was2Price }) =>
  was2Price && !!parseInt(was2Price, 10)
    ? {
        wasWasPrice: parseFloat(was1Price).toFixed(2),
        wasPrice: parseFloat(was2Price).toFixed(2),
      }
    : was1Price
    ? { wasPrice: parseFloat(was1Price).toFixed(2) }
    : {}

const colourSwatchFragment = (swatch, brandName, storeCode, hostname) => ({
  colourName: '',
  imageUrl: createImageUrl(hostname, swatch.swatchImage, brandName, storeCode),
  swatchProduct: {
    productId: parseInt(swatch.id || '0', 10) || '',
    grouping: swatch.partNumber || '',
    lineNumber: swatch.keyword || '',
    name: swatch.name || '',
    shortDescription: swatch.shortDescription || '',
    unitPrice: swatch.nowPrice || '',
    ...wasPrices(swatch),
    productUrl: swatch.productUrl || '',
    rating: swatch.rating || '',
    assets: assetsFragment(hostname, swatch, brandName, storeCode, assetTypes),
    additionalAssets: assetsFragment(
      hostname,
      swatch,
      brandName,
      storeCode,
      additionalAssetsTypes
    ),
    ...(swatch.productBaseImageUrl && {
      productBaseImageUrl: swatch.productBaseImageUrl,
    }),
    ...(swatch.outfitBaseImageUrl && {
      outfitBaseImageUrl: swatch.outfitBaseImageUrl,
    }),
  },
})

const productFragment = (product, brandName, storeCode, hostname) => {
  const bundleType = product.isBundleOrOutfit
    ? { bundleType: product.bundleType }
    : {}
  return {
    ...wasPrices(product),
    productId: parseInt(product.id, 10) || '',
    lineNumber: product.partNumber || '',
    name: product.name || '',
    unitPrice: getProductUnitPrice(product),
    productUrl: product.productUrl || '',
    seoUrl: `${hostname}/${product.seoCommonToken}/${product.seoProductToken}`,
    assets: assetsFragment(hostname, product, brandName, storeCode, assetTypes),
    additionalAssets: assetsFragment(
      hostname,
      product,
      brandName,
      storeCode,
      additionalAssetsTypes
    ),
    items: [], // NOTUSED
    bundleProducts: [], // NOTUSED
    attributes: {}, // NOTUSED
    colourSwatches: (product.swatches || []).map((swatch) =>
      colourSwatchFragment(swatch, brandName, storeCode, hostname)
    ),
    tpmLinks: [], // NOTUSED
    bundleSlots: [], // NOTUSED
    ageVerificationRequired: false, // NOTUSED
    isBundleOrOutfit: !!product.isBundleOrOutfit,
    bazaarVoiceData: product.rating && {
      average: product.rating,
      range: '5',
      ratingImage: '',
      bazaarVoiceReviews: [],
    },
    ...(product.productBaseImageUrl && {
      productBaseImageUrl: product.productBaseImageUrl,
    }),
    ...(product.outfitBaseImageUrl && {
      outfitBaseImageUrl: product.outfitBaseImageUrl,
    }),
    ...bundleType,
  }
}

const plp = (
  {
    plpJSON,
    globalEspot = {},
    defaultImgType = 'Product',
    canonicalUrl = '',
    cmsContent,
    redirectUrl,
    permanentRedirectUrl,
  },
  brandName,
  storeCode,
  hostname
) => {
  const searchTerm = path(
    ['Breadcrumbs', 0, 'searchCrumbs', 0, 'terms'],
    plpJSON
  )
  const searchTermObj = searchTerm ? { searchTerm } : {}
  return {
    pageTitle: path(['pageTitle'], plpJSON),
    breadcrumbs: breadcrumbsFragment(path(['Breadcrumbs'], plpJSON)),
    categoryRefinement: {
      refinementOptions: [], // NOTUSED
    },
    refinements: refinementsFragment(path(['Navigation'], plpJSON)),
    canonicalUrl,
    categoryBanner: path(['CategoryBanner'], plpJSON) || {},
    cmsPage: cmsContent || {},
    redirectUrl: redirectUrl || undefined,
    permanentRedirectUrl,
    products: (
      path(['results', 'contents', 0, 'records'], plpJSON) || []
    ).map((record) => productFragment(record, brandName, storeCode, hostname)),
    categoryTitle:
      path(['categoryTitle'], plpJSON) ||
      searchTerm ||
      categoryTitleFragment(plpJSON),
    categoryDescription: categoryDescriptionFragment(plpJSON),
    totalProducts:
      path(['results', 'contents', 0, 'totalNumRecs'], plpJSON) || 0,
    sortOptions: sortOptionsFragment(path(['results'], plpJSON)),
    ...searchTermObj,
    plpContentSlot: path(['PLPContentSlot'], plpJSON) || {},
    recordSpotlight: path(['RecordSpotlight'], plpJSON) || {},
    activeRefinements: activeRefinementsFragment(
      path(['Breadcrumbs', 0], plpJSON)
    ),
    removeAllRefinement:
      path(['Breadcrumbs', 0, 'removeAllAction'], plpJSON) || {},
    globalEspot,
    defaultImgType,
    title: path(['title'], plpJSON) || searchTerm,
    shouldIndex: path(['noIndex'], plpJSON) !== 'Yes',
  }
}

export {
  sortOptionFragment,
  sortOptionsFragment,
  categoryTitleFragment,
  categoryDescriptionFragment,
  reduceRefinementCrumbs,
  breadcrumbsFragment,
  refinementOptionFragment,
  refinementFragment,
  refinementsFragment,
  assetsFragment,
  colourSwatchFragment,
  productFragment,
  plp,
  activeRefinementsFragment,
}

export default plp
