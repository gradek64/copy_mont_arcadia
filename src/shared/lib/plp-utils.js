import { merge, pathOr, isEmpty, omit, uniq, pick } from 'ramda'
import qs from 'qs'
import { productListPageSize } from '../../server/api/mapping/constants/plp'
import {
  getCanonicalHostname,
  prefixWithHttpsProtocol,
} from './canonicalisation'
import { isSeoUrlFilterOnScroll } from './products-utils'

export const reviseCanonicalUrl = ({
  canonicalUrl,
  location,
  isFeatureHttpsCanonicalEnabled,
}) => {
  const { protocol, hostname, pathname, query: { currentPage } = {} } = location

  let revisedCanonicalUrl = prefixWithHttpsProtocol(
    canonicalUrl,
    isFeatureHttpsCanonicalEnabled
  )

  if (!revisedCanonicalUrl) {
    const canonicalHostname = getCanonicalHostname(
      hostname,
      isFeatureHttpsCanonicalEnabled
    )

    // `getCanonicalHostname` probably needs updating
    const hasMatchingCanonicalUrl = canonicalHostname !== hostname
    revisedCanonicalUrl = hasMatchingCanonicalUrl
      ? `${canonicalHostname}${pathname}`
      : // If the above doesn't match we need to build our own canonical url.
        `${protocol}//${hostname}${pathname}`
  }

  if (currentPage && currentPage > 1) {
    const joiner = revisedCanonicalUrl.includes('?') ? '&' : '?'
    return revisedCanonicalUrl.concat(
      joiner,
      `currentPage=${currentPage}`,
      `&No=${(currentPage - 1) * productListPageSize}`
    )
  }

  return revisedCanonicalUrl
}

export const reviseUrl = (pathname, query, currentPage) => {
  const pageParam =
    currentPage > 1
      ? {
          currentPage,
          No: (currentPage - 1) * productListPageSize,
        }
      : {}

  /*
   * These query parameters are the only ones permitted in the URL in order to
   * prevent arbitrary, additional parameters passed by the browser from being
   * cached in server side rendered documents on Akamai and consequently
   * indexed by search engines.
   *
   * For example, 'userSpecificValue' should not be cached in documents shown
   * to other users:
   *   www.topshop.com/en/tsuk/category/jeans-6877054?currentPage=4&userSpecificValue=123
   *
   * In the example above, no matter what other query parameters are supplied,
   * Akamai would consider only 'currentPage' to be significant, treating all
   * additional parameters as identical requests for page 4.
   */

  // Keys considered significant by Akamai for grouping cached documents
  const akamaiKeys = ['currentPage', 'Ns']

  // The superset of possible pageParam keys
  const pageParamKeys = ['currentPage', 'Nrpp', 'No']

  const whitelistedKeys = uniq([...akamaiKeys, ...pageParamKeys])
  const sanitisedQuery = pick(whitelistedKeys, query)
  const overriddenQuery = merge(sanitisedQuery, pageParam)
  const queryString = qs.stringify(overriddenQuery, { encode: false })
  return isEmpty(pathname) ? undefined : pathname.concat('?', queryString)
}

export const getPrevPageUrl = ({ pathname, query }) => {
  const currentPage = Number(pathOr(1, ['currentPage'], query))
  switch (currentPage) {
    case 1:
      return undefined
    case 2: {
      const queryString = qs.stringify(
        omit(['currentPage', 'No', 'Nrpp'], query),
        {
          encode: false,
        }
      )
      return isSeoUrlFilterOnScroll(pathname)
        ? isEmpty(queryString)
          ? pathname
          : pathname.concat('?', queryString)
        : pathname
    }
    default:
      return reviseUrl(pathname, query, currentPage - 1)
  }
}

export const getNextPageUrl = ({ pathname, query }, totalProducts) => {
  const currentPage = Number(pathOr(1, ['currentPage'], query))
  const maxPages = Math.ceil(totalProducts / productListPageSize)

  return currentPage < maxPages
    ? reviseUrl(pathname, query, currentPage + 1)
    : undefined
}

export const getPaginationSeoUrls = ({ totalProducts, location }) => {
  const seoUrls = {
    prevPageUrl: undefined,
    nextPageUrl: undefined,
  }

  if (
    !location.pathname.includes('/search/') &&
    !location.pathname.includes('/filter/')
  ) {
    seoUrls.prevPageUrl = getPrevPageUrl(location)
    seoUrls.nextPageUrl = getNextPageUrl(location, totalProducts)
  }

  return seoUrls
}
