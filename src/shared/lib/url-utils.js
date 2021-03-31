import qs from 'qs'

import {
  categoryI18n,
  productI18n,
} from '../constants/internationalized-strings'

/**
 * Checks if the passed passed parameter is an absolute url
 *
 * @param {String} url the url to check
 *
 * @returns {Boolean} is the url absolute?
 */
export const isAbsoluteUrl = (url) => {
  return /^(?:(?:https?:)?\/\/)(?:[^\s./]+\.)+/i.test(url)
}

/**
 * Ensures that relative urls are well formed.
 * Returns the passed parameter if it is already well formed.
 *
 * @param {String} url the url to normalise
 *
 * @returns {String} the normalised url
 */
export const normaliseRelativeUrl = (url) => {
  if (!url) {
    return url
  }

  if (isAbsoluteUrl(url)) {
    return url
  }

  if (/^\//.test(url)) {
    return url
  }

  return `/${url}`
}

/**
 * Appends new query parameters to a URL
 *
 * @param {String} baseUrl the url to append to
 * @param {Object} parametersToAdd key value pairs of the parameters to add
 */
export const appendQueryParameter = (baseUrl, parametersToAdd) => {
  const url = typeof baseUrl === 'string' ? baseUrl.split('?') : []
  const search = url.length > 1 ? url[1] : null
  const origin = url[0] || ''

  const existingParams =
    search &&
    qs.parse(search, {
      ignoreQueryPrefix: true,
    })
  const newParams = qs.stringify(parametersToAdd)

  const parameters = existingParams
    ? `${qs.stringify(existingParams)}&${newParams}`
    : newParams

  return origin ? `${origin}?${parameters}` : ''
}

export const isValidECMCPath = (path) => /^[a-zA-Z0-9À-ž-/]+$/.test(path)

/**
 * Validates an SEO URL
 * e.g. /en/tsuk/category/foo-123/bar-456
 * The pathname may have different a language code, brand code and category or product in en/fr/de.
 * The rest of the path may contain alphanumeric characters, hyphens and diacritics
 *
 * @param  {string} pathname
 * @return {boolean}
 */
export const isValidSeoUrl = (pathname) => {
  // URLs starting or ending with / cause empty values in the split Array so we remove them
  const { length } = pathname
  const startingSlash = pathname.startsWith('/') ? 1 : 0
  const endingSlash = pathname.endsWith('/') ? length - 1 : length
  const [lang, site, catProd, ...end] = decodeURIComponent(pathname)
    .slice(startingSlash, endingSlash)
    .split('/')

  if (!/^[a-z]{2}$/.test(lang)) return false
  if (!/^[a-z]{4}$/.test(site)) return false
  if (![...categoryI18n, ...productI18n].includes(catProd)) return false

  return end.every(isValidECMCPath)
}
