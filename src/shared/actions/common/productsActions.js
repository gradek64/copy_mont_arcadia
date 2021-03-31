import { get } from '../../lib/api-service'
import { splitQuery, joinQuery } from '../../lib/query-helper'
import url from 'url'
import {
  setInfinityPage,
  setInfinityActive,
  clearInfinityPage,
} from './infinityScrollActions'
import {
  setGenericError,
  setApiError,
  setApiErrorState,
} from './errorMessageActions'
import { urlRedirectServer, setPageStatusCode } from './routingActions'
import { browserHistory } from 'react-router'
import { getRouteFromUrl } from '../../lib/get-product-route'
import {
  setSeoRefinements,
  toggleRefinements,
  loadingRefinements,
} from '../components/refinementsActions'
import { setPDPEspots, setProductListEspots } from './espotActions'
import { setDefaultView } from './productViewsActions'
import { updateQuickViewActiveItem } from './quickviewActions'
import { range, isEmpty, omit, path, pathOr } from 'ramda'
import { heDecode } from '../../lib/html-entities'
import * as logger from '../../../server/lib/logger'
import { isModalOpen, modalMode } from '../../selectors/modalSelectors'

import {
  processRedirectUrl,
  isSeoUrlSearchFilter,
  isSeoUrlFilterOnScroll,
  addSearchParam,
  prepareSeoUrl,
  cleanSeoUrl,
  isSeoUrlCategoryFilter,
  seoUrlIncludesProductsIndex,
  parseSearchUrl,
  isFiltered,
  hasSortOption,
  isPriceFilter,
  reviseNrppParam,
  removeParamClearAll,
  getCategoryFromBreadcrumbs,
  replaceSpacesWithPlus,
  isValidEcmcCategory,
} from '../../lib/products-utils'
import { getPreSelectedSize } from '../../selectors/refinementsSelectors'
import { getCategoryId } from '../../selectors/navigationSelectors'
import {
  isPersonalisedEspotsEnabled,
  isFeatureRealTimeStockEnabled,
  isFeatureEnabled,
} from '../../selectors/featureSelectors'
import {
  getLocation,
  getLocationQuery,
  getRoutePath,
} from '../../selectors/routingSelectors'
import { getCurrentPageFromInfinityScroll } from '../../selectors/infinityScrollSelectors'
import { analyticsPdpClickEvent } from '../../analytics/tracking/site-interactions'
import { getItem } from '../../../client/lib/cookie/utils'
import { productListPageSize } from '../../../server/api/mapping/constants/plp'
import { getContent } from './sandBoxActions'

import { isProductId } from '../../lib/product-utilities'
import { fixCmsUrl } from '../../lib/cms-utilities'

export function updateSwatch(product) {
  return {
    type: 'UPDATE_SWATCH',
    product,
  }
}

export function setProductDetail(product) {
  return {
    type: 'SET_PRODUCT',
    product,
  }
}

export function updateActiveItem(activeItem) {
  return {
    type: 'UPDATE_ACTIVE_ITEM',
    activeItem,
  }
}

export function updateActiveItemQuantity(selectedQuantity) {
  analyticsPdpClickEvent(`productquantity-${selectedQuantity}`)
  return {
    type: 'UPDATE_ACTIVE_ITEM_QUANTITY',
    selectedQuantity,
  }
}

export function updateSelectedOosItem(selectedOosItem) {
  return {
    type: 'UPDATE_SELECTED_OOS_ITEM',
    selectedOosItem,
  }
}

export function updateShowItemsError(showError) {
  return {
    type: 'UPDATE_SHOW_ITEMS_ERROR',
    showError,
  }
}

export function setSizeGuide(sizeGuideType) {
  return {
    type: 'SET_SIZE_GUIDE',
    sizeGuideType,
  }
}

export function showSizeGuide() {
  return {
    type: 'SHOW_SIZE_GUIDE',
  }
}

export function hideSizeGuide() {
  return {
    type: 'HIDE_SIZE_GUIDE',
  }
}

export function updateSeeMoreUrl(seeMoreLink, seeMoreUrl) {
  return {
    type: 'UPDATE_SEE_MORE_URL',
    seeMoreLink,
    seeMoreUrl,
  }
}

export const updateProductSizesAndQuantities = (productId, items) => ({
  type: 'UPDATE_PRODUCT_ITEMS',
  productId,
  items,
})

export const resetProductState = () => ({
  type: 'RESET_PRODUCTS_STATE',
})

// This function exists to save the previous page for the purpose of using it in the `list` property in dataLayer 'impressions' and 'detail' events. It and everything related to lists can be removed if analytics requirements change
export const setPredecessorPage = (list) => (dispatch) => {
  dispatch({
    type: 'SET_PREDECESSOR_PAGE',
    list,
  })
}

export const getSeeMoreUrls = (seeMoreValue = []) => (dispatch) => {
  const extractEndecaId = (seeMoreLink) => {
    return seeMoreLink.split('/').pop()
  }
  const getSeeMoreUrl = (seeMoreValueItem) => {
    const seeMoreLink = seeMoreValueItem && seeMoreValueItem.seeMoreLink
    if (seeMoreLink) {
      return dispatch(
        get(`/products?endecaSeoValue=${extractEndecaId(seeMoreLink)}`)
      )
        .then(({ body }) => {
          return dispatch(updateSeeMoreUrl(seeMoreLink, body.canonicalUrl))
        })
        .catch(() => {})
    }
  }
  const promises = seeMoreValue
    .filter(Boolean)
    .filter(
      (i) =>
        !isEmpty(i) &&
        Object.prototype.hasOwnProperty.call(i, 'seeMoreLink') &&
        !isEmpty(i.seeMoreLink)
    )
    .map(getSeeMoreUrl)
  return Promise.all(promises)
}

export function getProductStock(productId) {
  return (dispatch) => {
    return dispatch(get(`/products/stock?productId=${productId}`, false))
      .then(({ body }) => {
        return dispatch(updateProductSizesAndQuantities(productId, body))
      })
      .catch(() => {
        // If stock request fails, we fallback to using the stock provided in the original product request
      })
  }
}

/**
 * @typedef ProductItem
 * @property {string} attrName - for example "226334388"
 * @property {string} attrValue - for example "XS"
 * @property {number} attrValueId - for example 300783716
 * @property {number} catEntryId - for example 35567608
 * @property {number} quantity - for example 10
 * @property {boolean} selected - for example false
 * @property {string} size - for example "XS"
 * @property {string} sku - for example "602019001338810"
 * @property {number} skuid - for example 35567608
 * @property {string} stockText - for example "In stock"
 */

/**
 *
 * @param {*} [args]
 * @param {number} [sanity]
 */
export function getProductRequest(args = {}, sanity = 0) {
  return async (dispatch, getState) => {
    // [MJI-1077] We need to be able to handle both:
    // /en/tsuk/product/{identifier}
    // /wcs/stores/servlet/ProductDisplay?langId=-1&catalogId=33057&storeId=12556&productId=32409407
    const query = getLocationQuery(getState())
    const identifier =
      args.identifier ||
      path(['productId'], query) ||
      path(['partNumber'], query)
    // If its not a productId send full pathname
    const param = isProductId(identifier)
      ? identifier
      : getRoutePath(getState())

    try {
      const { body: product } = await dispatch(
        get(`/products/${encodeURIComponent(param)}`)
      )

      const isRealTimeStockEnabled = isFeatureRealTimeStockEnabled(getState())
      if (isRealTimeStockEnabled && getItem('authenticated') === 'yes') {
        dispatch(getProductStock(product.productId))
      }

      return product
    } catch (error) {
      if (error.status === 440 && sanity <= 10) {
        return dispatch(getProductRequest(args, sanity + 1))
      }
      dispatch(setApiErrorState(error))

      throw error
    }
  }
}

export const findSingleSizeItem = (item) => (item.quantity <= 0 ? {} : item)

export const findPreSelectedSizeItem = (product, preSelectedSize) => {
  return (
    product.items.find((item) => {
      let itemSize = item.sizeMapping || item.size

      // String sizing (i.e 'm', 'XS/S') are inconsistent when it comes to casing
      // so changing both to lowercase before comparing
      itemSize =
        typeof itemSize === 'string' ? itemSize.toLowerCase() : itemSize
      preSelectedSize =
        typeof preSelectedSize === 'string'
          ? preSelectedSize.toLowerCase()
          : preSelectedSize

      if (itemSize === preSelectedSize && item.quantity > 0) return true
      return false
    }) || {}
  )
}

export function preSelectActiveItem(product) {
  return (dispatch, getState) => {
    if (!(product && product.items && Array.isArray(product.items))) return

    const state = getState()
    const isQuickview =
      isModalOpen(state) && modalMode(state) === 'plpQuickview'
    const isFeaturePreSelectSizeEnabled = isFeatureEnabled(
      state,
      'FEATURE_PRE_SELECT_SIZE'
    )
    const isSingleSize = product.items.length === 1
    let activeItem = {}

    if (isSingleSize) {
      activeItem = findSingleSizeItem(product.items[0])
    } else if (isFeaturePreSelectSizeEnabled && getPreSelectedSize(state)) {
      activeItem = findPreSelectedSizeItem(product, getPreSelectedSize(state))
    }

    if (isQuickview) {
      dispatch(updateQuickViewActiveItem(activeItem))
    } else {
      dispatch(updateActiveItem(activeItem))
    }
  }
}

export function getProductDetail(args) {
  return async (dispatch, getState) => {
    const query = getLocationQuery(getState())
    const productPath = getRoutePath(getState())
    const identifier =
      args.identifier ||
      path(['productId'], query) ||
      path(['partNumber'], query)

    try {
      const product = await dispatch(getProductRequest(args))
      const permanentRedirectUrl = path(['permanentRedirectUrl'], product)
      const canonicalUrl = path(['canonicalUrl'], product)
      const canonicalRoute = canonicalUrl && getRouteFromUrl(canonicalUrl)
      const canonicalUrlSet = path(['canonicalUrlSet'], product)

      if (permanentRedirectUrl) {
        const encodePermanentRedirectUrl = `${encodeURI(
          permanentRedirectUrl
        )}${joinQuery(query)}`

        if (!process.browser) {
          return dispatch(
            urlRedirectServer({
              url: encodePermanentRedirectUrl,
              permanent: true,
            })
          )
        }

        return processRedirectUrl(encodePermanentRedirectUrl)
      }

      if (
        !process.browser &&
        canonicalUrlSet &&
        canonicalRoute &&
        decodeURIComponent(productPath) !== canonicalRoute
      ) {
        const encodedCanonicalRoute = encodeURI(canonicalRoute)
        return dispatch(
          urlRedirectServer({
            url: `${encodedCanonicalRoute}${joinQuery(query)}`,
            permanent: true,
          })
        )
      }

      dispatch(setProductDetail(product))

      // Pre-select sizes if applicable
      // TODO: Make pre-selection work for bundles. For now, if it is a bundle
      // we just clear the activeItem part fo the state and only run pre-selection
      // on normal products
      if (product.isBundleOrOutfit) {
        dispatch(updateActiveItem({}))
      } else {
        preSelectActiveItem(product)(dispatch, getState)
      }

      // if URL is based on a product code, update to use the full product name
      if (browserHistory && isProductId(identifier)) {
        const pathname = getRouteFromUrl(product.sourceUrl)
        browserHistory.replace({ pathname, query })
      }

      const { seeMoreValue = [] } = product
      dispatch(getSeeMoreUrls(seeMoreValue))
      // TODO: remove espot info from product in state. Same goes for all set espots dispatch
      if (!isPersonalisedEspotsEnabled(getState())) {
        return dispatch(setPDPEspots(product.espots))
      }
    } catch (error) {
      dispatch(setProductDetail({ success: false }))
      dispatch(setPageStatusCode(404))
    }
  }
}

export function preloadProductDetail(product, props, intialisedByWishlistBtn) {
  return async (dispatch) => {
    // We don't want to set the currentProduct if the user clicks on the wishlist icon
    if (intialisedByWishlistBtn) return null

    const brandsShowingProductViewFirst = ['wl', 'ev', 'dp', 'br']
    const { categoryTitle, location, brandCode } = props
    const {
      name,
      productId,
      lineNumber,
      attributes,
      seoUrl,
      productUrl,
      unitPrice,
      wasPrice,
      items,
      assets,
      additionalAssets,
      outfitBaseImageUrl,
      productBaseImageUrl,
    } = product

    return dispatch(
      setProductDetail({
        isPreloaded: true,
        name,
        productId,
        lineNumber,
        attributes,
        items,
        assets,
        additionalAssets,
        seoUrl,
        productUrl,
        unitPrice,
        wasPrice,
        amplienceAssets: {
          images: [
            brandsShowingProductViewFirst.includes(brandCode)
              ? productBaseImageUrl
              : outfitBaseImageUrl,
          ],
        },
        breadcrumbs: [
          { label: 'Home', url: '/' },
          { label: categoryTitle, url: location ? location.pathname : '' },
          { label: name },
        ],
      })
    )
  }
}

export function emailMeStock(formData) {
  const query = joinQuery(formData)
  return (dispatch) => {
    return dispatch(get(`/email-me-in-stock${query}`))
      .then(({ body }) => {
        dispatch({
          type: 'EMAIL_ME_STOCK_SUCCESS',
          body,
        })
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
      })
  }
}

export function clearProduct() {
  return {
    type: 'CLEAR_PRODUCT',
  }
}

function getCategoryFromState({ products: { breadcrumbs } }) {
  return getCategoryFromBreadcrumbs(breadcrumbs)
}

function fetchProductsBySeo(pathname) {
  return get(`/products/seo?seoUrl=${pathname}&pageSize=${productListPageSize}`)
}

export function fetchProductsByFilters(pathname, state) {
  const catId = getCategoryId(state, () => pathname)
  const amendedPathName = replaceSpacesWithPlus(pathname) // Temporary solution to replace empty spaces with the plus sign.
  return get(
    `/products/filter?seoUrl=${encodeURIComponent(
      `${reviseNrppParam(
        amendedPathName
      )}&pageSize=${productListPageSize}&categoryId=${catId}`
    )}`
  )
}

const ENDECA_DELIMETER = '|||'
const QUBIT_ENDECA_AB_COOKIE_KEY = 'qubitSearchABTestKey'

const endecaPOC = (query, isFeatureEndecaABTestEnabled) => {
  if (!process.browser || !('q' in query) || !isFeatureEndecaABTestEnabled)
    return query

  const searchKey = getItem(QUBIT_ENDECA_AB_COOKIE_KEY)
  if (typeof searchKey !== 'string') return query

  return {
    ...query,
    q: `${query.q}${ENDECA_DELIMETER}${searchKey}`,
  }
}

function fetchProductsByQuery(query, isFeatureEndecaABTestEnabled) {
  query = endecaPOC(query, isFeatureEndecaABTestEnabled)

  // CANT ENCODE CATEGORY BECAUSE SERVER
  let search = joinQuery(omit(['category'], query))
  search = query.category ? `${search}&category=${query.category}` : search
  return get(`/products${search}`)
}

export const isRefinementOptionSelected = (
  refinements = [],
  pathname,
  viewport,
  navSort = []
) => {
  const isFilterOptionsSelection = () =>
    refinements.filter(
      ({ refinementOptions = [] }) =>
        refinementOptions.filter(({ seoUrl, selectedFlag }) => {
          return seoUrlIncludesProductsIndex(pathname)
            ? seoUrl === selectedFlag
            : seoUrl === cleanSeoUrl(pathname)
        }).length > 0
    ).length > 0

  const isSortFilter = () =>
    navSort.filter((sortOption) => {
      return pathname.includes(sortOption.navigationState)
    }).length > 0

  const desktop = isEmpty(refinements)
    ? isSeoUrlSearchFilter(pathname) ||
      isSeoUrlCategoryFilter(pathname) ||
      isSortFilter() ||
      isPriceFilter(pathname)
    : isSeoUrlSearchFilter(pathname) ||
      isFilterOptionsSelection() ||
      isSeoUrlFilterOnScroll(pathname) ||
      isSortFilter() ||
      isPriceFilter(pathname)

  const mobile =
    isSeoUrlSearchFilter(pathname) ||
    isSeoUrlCategoryFilter(pathname) ||
    isSeoUrlFilterOnScroll(pathname) ||
    isSortFilter() ||
    isPriceFilter(pathname)

  return viewport && viewport.media === 'mobile' ? mobile : desktop
}

/* fetchProductsBy method checks if products.refinements contains a matching
 * pathname. This identifies if a user clicked on a refinement option or not.
 * */
export const fetchProductsBy = (
  refinements,
  pathname,
  viewport,
  navSort,
  siteId,
  state
) => {
  // ADP-2599: There are old Endeca URLs in Google’s index that don’t contain an ECMC category.
  // For these URLs we will need to return 410.

  if (
    pathname &&
    !pathname.startsWith('/filter') &&
    !pathname.startsWith('/N-') &&
    !isValidEcmcCategory(pathname)
  ) {
    return () =>
      Promise.reject({
        error: 'URL Validation Error',
        message: 'The ECMC category is not valid',
        status: 410,
      })
  }

  /**
   *  we have to call Product/seo API on server side to be able to get the redirect from WCS
   *  when calling product/filter API WCS will only proxy to Endeca and return the response
   *  directly to us without any change
   */

  return process.browser &&
    isRefinementOptionSelected(refinements, pathname, viewport, navSort)
    ? fetchProductsByFilters(prepareSeoUrl(pathname, siteId), state)
    : fetchProductsBySeo(pathname)
}
/**
 * Some responses may not be exactly what we were expecting but there's usable data
 * that we don't want to throw an error. Instead we can sanitise the data into
 * something acceptable.
 *
 * @param  {Object} res  PLP response
 * @return {Object} The clean PLP responsed
 */
const sanitisePlpResponse = (res) => {
  return {
    ...res,
    body: {
      ...res.body,
      refinements: (res.body.refinements || []).filter(
        (r) => typeof r === 'object' && typeof r.label === 'string'
      ),
    },
  }
}

export function fetchProducts(pathname, query, search = '') {
  const {
    category,
    categoryId,
    q,
    refinements: nonSeoRefinements = '',
    currentPage,
    pageSize,
    sort: nonDefaultSort,
  } = query
  const isLegacyPath =
    pathname === '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
  return (dispatch, getState) => {
    const state = getState()
    const {
      products: { refinements, sortOptions },
      sorting: { currentSortOption },
      features: {
        status: { FEATURE_ENDECA_AB_TEST: isFeatureEndecaABTestEnabled },
      },
      viewport,
      config: { siteId },
    } = state
    if (category || q || isLegacyPath) {
      // We already have the category or the query - so we can just use the non seo endpoint
      const sort = currentSortOption
      let searchQuery = {}
      if (isLegacyPath) {
        searchQuery = {
          ...omit(['sort_field', 'categoryId'], query),
          sort: decodeURIComponent(query.sort_field),
        }
      }
      if (currentPage) searchQuery.currentPage = currentPage
      if (categoryId) searchQuery.category = categoryId
      if (category) searchQuery.category = category
      if (q) searchQuery.q = q
      if (pageSize) searchQuery.pageSize = pageSize
      if (sort) searchQuery.sort = decodeURIComponent(sort)
      return dispatch(
        fetchProductsByQuery(searchQuery, isFeatureEndecaABTestEnabled)
      )
    }

    return dispatch(
      fetchProductsBy(
        refinements,
        pathname + search,
        viewport,
        sortOptions,
        siteId,
        state
      )
    ).then((res) => {
      res = sanitisePlpResponse(res)
      const { body } = res

      // Update the seo refinements with what we got from the response
      dispatch(setSeoRefinements(body.refinements, body.activeRefinements))

      const isPaginationForSEO = pathOr(false, ['pagination'], query)
      /* NOTE:
       * This was blocked for new filters but there is one scenario with "new filters" that requires this
       * logic "Pagination for SEO".
       *
       * The pagination links (prev, next) are incorrect because it calls the wrong endpoint which does
       * not support pagination. The first call is used to get the breadcrumbs which holds the category id,
       * required for the second call that supports pagination.
       *  */

      // TODO: Update pagination links to call correct endpoint to remove this logic to make a second call
      if (isPaginationForSEO) {
        // If we haven't got all the refines we need, or we wanted a page greater than 1
        // And we've managed to get a catgeory - do it again.
        const seoResultCategory = getCategoryFromBreadcrumbs(body.breadcrumbs)
        if (
          seoResultCategory &&
          (nonSeoRefinements || currentPage > 1 || nonDefaultSort)
        ) {
          return dispatch(
            fetchProducts(pathname, {
              category: seoResultCategory,
              currentPage,
              pageSize,
              refinements: nonSeoRefinements,
            })
          )
        }
      }
      // Or just return the products we've got, they're the right ones
      return res
    })
  }
}

export function loadingProducts(loading) {
  return {
    type: 'LOADING_PRODUCTS',
    loading: heDecode(loading),
  }
}

export function loadingMoreProducts(isLoadingMore = true) {
  return {
    type: 'LOADING_MORE_PRODUCTS',
    isLoadingMore,
  }
}

export function setProductsLocation(location) {
  return {
    type: 'SET_PRODUCTS_LOCATION',
    location,
  }
}

export function addToProducts() {
  return (dispatch, getState) => {
    const {
      products: { refinements },
      routing: {
        location: { pathname, query, search },
      },
      config: { siteId },
    } = getState()
    const currentPage = parseInt(
      getCurrentPageFromInfinityScroll(getState()),
      10
    )
    const nextPage = currentPage + 1
    let newQuery = {}
    let newSearch = search

    /* If products has been filtered or sorted then
     * add a param to get the next 24 products
     *  */
    if (isFiltered(`${pathname}${search}`)) {
      newSearch = removeParamClearAll(
        addSearchParam(pathname, search, nextPage, siteId)
      )
    } else {
      const category = getCategoryFromState(getState())
      newQuery = {
        ...query,
        category,
        currentPage: nextPage,
        pageSize: productListPageSize,
      }

      if (category) {
        delete newQuery.q
      }
    }

    dispatch(loadingMoreProducts())

    // set the current active refinements in the redux store if not already set
    // so they are available when building the request query to fetch more products
    dispatch(setSeoRefinements(refinements))

    return dispatch(fetchProducts(pathname, newQuery, newSearch))
      .then(({ body: { products } }) => {
        dispatch(loadingMoreProducts(false))
        // No products were available, don't change the state
        if (!products.length) {
          return null
        }

        const location = getLocation(getState())
        const nextQuery = {
          ...location.query,
          currentPage: `${nextPage}`,
        }
        const newLocation = {
          ...location,
          query: nextQuery,
          search: joinQuery(nextQuery),
        }

        dispatch({
          type: 'ADD_TO_PRODUCTS',
          products,
        })

        browserHistory.replace(newLocation)
        dispatch(setProductsLocation(newLocation))
        dispatch(setInfinityPage(nextPage))
        dispatch(setInfinityActive())
      })
      .catch((err) => {
        dispatch(loadingMoreProducts(false))
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
      })
  }
}

function isSameList({ pathname, query }, newLocation) {
  return (
    pathname === newLocation.pathname &&
    query.q === newLocation.query.q &&
    query.category === newLocation.query.category &&
    query.refinements === newLocation.query.refinements &&
    // on new filters: Ns = new sort
    query.Ns === newLocation.query.Ns &&
    query.Nf === newLocation.query.Nf
  )
}

// Burton is incapable of filtering by promotion
// This is a simple HACK to remove the option before setting products
function fixRefinements(code, refinements = []) {
  if (code === 'br') {
    return refinements.filter(
      ({ label }) => label.toLowerCase() !== 'promotion'
    )
  }
  return refinements
}

function setProducts(body) {
  return (dispatch, getState) => {
    const { brandCode } = getState().config
    dispatch({
      type: 'SET_PRODUCTS',
      body: {
        ...body,
        refinements: fixRefinements(brandCode, body.refinements),
      },
    })

    dispatch(setDefaultView(body.defaultImgType))
  }
}

export function updateProductsLocation(
  { refinements, canonicalUrl, searchTerm },
  location
) {
  return (dispatch) => {
    const pathname = getRouteFromUrl(canonicalUrl)

    // If we have a valid route to navigate to, then use it
    if (!searchTerm && !refinements && pathname) {
      const query = omit(['category', 'q'], location.query)
      // Set the product location, to stop it fetching again when the url updates.
      dispatch(setProductsLocation({ pathname, query }))
      const newLocation = { pathname, query }
      if (!isEmpty(query)) newLocation.search = joinQuery(query)
      browserHistory.replace(newLocation)
    } else {
      dispatch(setProductsLocation(location))
    }
  }
}

export function removeProducts() {
  return {
    type: 'REMOVE_PRODUCTS',
  }
}

export function removeProductsLocation() {
  return {
    type: 'REMOVE_PRODUCTS_LOCATION',
  }
}

export function updateProducts(body) {
  return (dispatch, getState) => {
    const isRefinementsShown =
      path(['refinements', 'isShown'], getState()) || false
    if (isRefinementsShown) dispatch(toggleRefinements(false))
    if (body.cmsPage && body.cmsPage.seoUrl) {
      dispatch(removeProductsLocation())
      return browserHistory.replace(body.cmsPage.seoUrl)
    } else if (body.redirectUrl) {
      return processRedirectUrl(body.redirectUrl)
    } else if (body.permanentRedirectUrl) {
      dispatch(removeProductsLocation())
      return processRedirectUrl(body.permanentRedirectUrl)
    }
    dispatch(setProducts(body))

    // If we fetched using a search term, but we got back a real category - nav to it so refinements works
    if (path(['query', 'q'], location) && body.canonicalUrl) {
      dispatch(updateProductsLocation(omit(['searchTerm'], body), location))
    }
    return dispatch(setProductListEspots(body.plpContentSlot))
  }
}

const productsNotFound = (params = {}) => (dispatch) => {
  const { statusCode = 404 } = params
  dispatch(setPageStatusCode(statusCode))
  dispatch({ type: 'PRODUCTS_NOT_FOUND' })
  return dispatch(getContent({}, 'error404'))
}

export function getProducts(location) {
  return (dispatch, getState) => {
    const { location: currentLocation, redirectUrl } = getState().products

    // if is first server render and is filter we need force to load the products
    // also if the currentLocation and location are the same
    // We do that because the filters are NOT loaded server-side
    const visited = path(['routing', 'visited'], getState()) || [] // server or client side ??
    const isFilterRequest =
      !!location && location.pathname.startsWith('/filter')

    if (redirectUrl) processRedirectUrl(redirectUrl)

    if (currentLocation && isSameList(currentLocation, location)) {
      // If is NOT a filter on the first client request then we can block the execution
      if (!(isFilterRequest && visited.length === 1)) {
        return null
      }
    }

    dispatch(clearInfinityPage())
    dispatch(setProductsLocation(location))
    dispatch(removeProducts())
    dispatch(loadingProducts(splitQuery(location.search).q))

    return dispatch(
      fetchProducts(location.pathname, location.query, location.search)
    )
      .then(({ body }) => {
        dispatch(updateProducts(body))
      })
      .catch((error) => {
        switch (error.status) {
          case 440: // Session timeout error
            // If a session has timed out the last request will be canceled.
            // Displaying no products and refinements. Call fetchProducts again
            // to fix this issue.
            dispatch(
              fetchProducts(location.pathname, location.query, location.search)
            ).then(({ body }) => {
              dispatch(updateProducts(body))
            })
            break

          case 410:
            dispatch(productsNotFound({ statusCode: 410 }))
            break

          default:
            return dispatch(productsNotFound())
        }
      })
  }
}

// Get products using refinmenets too
export function updateCurrentProducts() {
  return (dispatch, getState) => {
    const {
      products: { categoryTitle },
      routing: { location = {} },
    } = getState()
    const category = getCategoryFromState(getState())

    const { q, searchTerm } = location.query

    let query = { category }

    if (searchTerm) query = location.query
    else if (q) query = { q }

    dispatch(clearInfinityPage())
    dispatch(loadingProducts(categoryTitle))
    return dispatch(fetchProducts(location.pathname, query))
      .then(({ body }) => {
        dispatch(updateProductsLocation(body, location))
        dispatch(setProducts(body))
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          dispatch(setGenericError(err))
        } else {
          dispatch(setApiError(err))
        }
      })
  }
}

export function fetchCombinedProducts(pathname, query) {
  return (dispatch) => {
    // Calculate the page size and amount of pages needed
    const currentPage = parseInt(query.currentPage, 10)
    const totalItems = currentPage * productListPageSize
    const pageSize = productListPageSize
    let fullPages = Math.ceil(totalItems / pageSize)

    if (!process.browser && fullPages > 3) fullPages = 3 // Defensive SS request
    const promises = range(1, fullPages + 1).map((val) => {
      const pageQuery = {
        ...query,
        currentPage: val,
        pageSize,
      }
      dispatch(setInfinityPage(fullPages))
      return dispatch(fetchProducts(pathname, pageQuery))
    })

    // Combine all the responses into one MEGA RESPONSE
    return Promise.all(promises).then((array) => {
      return array.reduce(
        (prev, { body }) => {
          return Object.assign(body, {
            products: prev.products.concat(body.products),
          })
        },
        { products: [] }
      )
    })
  }
}

export function getServerProducts({ search, pathname }, replace = false) {
  return (dispatch) => {
    if (
      pathname.startsWith('/filter') ||
      (pathname.startsWith('/search') && !replace)
    )
      return false

    const sanitisedQuery = splitQuery(search)

    // Want to send the full query to the server, same as if the user had typed it into the search box
    const query = {
      ...sanitisedQuery,
      q: heDecode(sanitisedQuery.q),
    }
    const pagination = !!query.pagination
    const currentPage = query.currentPage ? parseInt(query.currentPage, 10) : 0

    // Set the location so we don't double fetch when landing client side JS
    dispatch(setProductsLocation({ pathname, query: sanitisedQuery }))
    // Set the products loading
    dispatch(loadingProducts(query.q))

    return Promise.resolve()
      .then(() => {
        if (pagination || currentPage < 2) {
          // We only need one page, just fetchProducts and go.
          return dispatch(fetchProducts(pathname, query, search)).then(
            ({ body }) => body
          )
        } else if (query.category || query.q) {
          // At this point we know we need to get multiple pages
          // If we have a query we can do that immediately
          return dispatch(fetchCombinedProducts(pathname, query, search))
        } else if (hasSortOption(`${pathname}${search}`)) {
          return dispatch(fetchProducts(pathname, query, search)).then(
            ({ body }) => body
          )
        }
        // TODO: To be removed when removing old refinements
        return dispatch(
          fetchProducts(
            pathname,
            omit(['currentPage', 'refinements'], query, search)
          )
        ).then(({ body: { breadcrumbs } }) => {
          const category = getCategoryFromBreadcrumbs(breadcrumbs)
          // Now get them all from the category
          return dispatch(
            fetchCombinedProducts(pathname, {
              ...query,
              category,
            })
          )
        })
      })
      .then((body) => {
        const { permanentRedirectUrl } = body
        if (permanentRedirectUrl) {
          const { pathname } = url.parse(permanentRedirectUrl)
          return dispatch(urlRedirectServer({ url: pathname, permanent: true }))
        }

        // Found a CMS page - go to it
        // replace exist when you come here via search (where replace comes from the react router)
        // but if we come here via a plp link then replace does not exist and we need to return so that SSR can to the redirect
        if (body.cmsPage && body.cmsPage.seoUrl) {
          dispatch(urlRedirectServer({ url: body.cmsPage.seoUrl }))
          return replace ? replace() : false
        }

        dispatch(setProducts(body))

        if (body.products && body.products.length === 1 && replace) {
          const newLocation = getRouteFromUrl(body.products[0].sourceUrl)
          return replace(newLocation)
        }

        if (body.products && body.products.length === 0) {
          dispatch(productsNotFound())
        }

        return (
          dispatch(setProductListEspots(body.plpContentSlot))
            // this stop SSR error on react-router
            .then(() => body)
        )
      })
      .then((body) => {
        const categoryBannerUrl = path(
          ['categoryBanner', 'cmsMobileContent', 'responsiveCMSUrl'],
          body
        )
        if (categoryBannerUrl) {
          return dispatch(
            getContent({ pathname: fixCmsUrl(categoryBannerUrl) }, 'catHeader')
          )
        }
      })
      .catch((error) => {
        if (error && !error.response) {
          logger.error(
            error.message || 'getServerProducts error occurred',
            error
          )
        }

        if (error.status === 410) {
          return dispatch(productsNotFound({ statusCode: 410 }))
        }

        return dispatch(productsNotFound())
      })
  }
}

export function updateProductsRefinements(seoUrl) {
  return (dispatch, getState) => {
    const { products } = getState()
    const query = parseSearchUrl(seoUrl)

    dispatch(loadingRefinements(true))
    return dispatch(fetchProducts(seoUrl, query))
      .then(({ body }) => {
        dispatch(loadingRefinements(false))
        if (body.refinements) {
          dispatch(
            setProducts({
              ...products,
              totalProducts: body.totalProducts,
              refinements: body.refinements,
              sortOptions: body.sortOptions,
            })
          )
        }
      })
      .catch((err) => {
        dispatch(loadingRefinements(false))
        dispatch(setApiError(err))
      })
  }
}
