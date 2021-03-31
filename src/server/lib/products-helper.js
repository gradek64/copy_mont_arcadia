import url from 'url'
import qs from 'querystring'
import { productListPageSize } from '../api/mapping/constants/plp'

/**
 * It appends pagination parameters 'Nrpp and No' understood by wcs, only if query params contains currentPage.
 * Nrpp stands for number of results per page and No is the number of products already fetched.
 * Eg: url/en/tsuk/category/clothing-427/dresses-442?Nrpp=24&No=48
 * @param seoUrl
 * @returns {string}
 */
export const wcsPaginate = (seoUrl) => {
  const seoUrlQueryParams = url.parse(seoUrl).query
  const currentPage = qs.parse(seoUrlQueryParams).currentPage
  const pagination = currentPage
    ? `&Nrpp=${productListPageSize}&No=${(currentPage - 1) *
        productListPageSize}`
    : ''
  return seoUrl + pagination
}
