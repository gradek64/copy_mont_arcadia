import {
  sanitizeResponseAndReply,
  logMrCmsRequest,
  logMrCmsResponse,
} from '../lib/mrcms-utils'

import { cache404MrCmsResponseHandler } from './mr-cms-cache-handler'
import superagent from 'superagent'
import Boom from 'boom'
import url from 'url'
import qs from 'qs'

export function responseCacheContentHandler(fetchedResult, reply) {
  const redisCacheHeader = 'x-redis-cache'
  return reply(fetchedResult.response).header(
    redisCacheHeader,
    fetchedResult.fromCache
  )
}

function proxyRequest(reply, onResponse) {
  return reply.proxy({
    host: process.env.MR_CMS_URL,
    port: process.env.MR_CMS_PORT,
    protocol: process.env.MR_CMS_PROTOCOL,
    timeout: 20000, // 20s before to abort
    onResponse,
  })
}

const brandNames = [
  'topshop',
  'topman',
  'burton',
  'dorothyperkins',
  'missselfridge',
  'wallis',
  'evans',
]

const checkBoolean = (x) => !['true', 'false'].includes(x)
const checkUrlPath = (x) => url.parse(x).pathname !== x

/**
 * A map of query param names to functions that validates them
 *
 * Each checker function takes the parsed query string object
 * and returns either:
 * - a boolean-like value (truthy for fail or falsy for pass)
 * - an object with :
 *   - `error` property which is either a boolean or a string describing the error
 *   - `query` object property for modifing the query string
 */
const checks = {
  storeCode: ({ storeCode }) => !/^[a-z]{4}$/.test(storeCode),
  brandName: ({ brandName }) => !brandNames.includes(brandName),
  siteId: ({ siteId }) => !/^\d{5}$/.test(siteId),
  cmsPageName: ({ cmsPageName }) => {
    if (cmsPageName) {
      return !/^[a-zA-Z0-9_-]+$/.test(cmsPageName)
    }
  },
  seoUrl: ({ seoUrl }) => seoUrl && checkUrlPath(seoUrl),
  'location[pathname]': ({ 'location[pathname]': locPath }) =>
    locPath && checkUrlPath(locPath),
  'location[search]': ({
    'location[pathname]': locPath,
    'location[search]': locSearch,
  }) => {
    if (!locSearch) return

    if (!locPath) {
      return {
        error: 'Cannot pass location[search] without location[pathname]',
      }
    }

    try {
      locSearch = decodeURIComponent(locSearch)
      locSearch = locSearch[0] === '?' ? locSearch.slice(1) : locSearch
      locSearch = qs.parse(locSearch)

      // If expected params aren't found, remove location[search]
      const query = { 'location[search]': undefined }
      if (locSearch.segment) {
        query['location[search]'] = `?${qs.stringify({
          segment: locSearch.segment,
        })}`
      }

      return {
        error: false,
        query,
      }
    } catch (e) {
      return { error: 'Invalid location[search] query param' }
    }
  },
  viewportMedia: ({ viewportMedia }) => {
    if (viewportMedia) {
      return !['apps', 'mobile', 'tablet', 'desktop', 'console'].includes(
        viewportMedia
      )
    }

    return {
      error: false,
      query: {
        viewportMedia: 'desktop',
      },
    }
  },
  formEmail: ({ formEmail }) => {
    if (formEmail) {
      // Checking real email addresses is very tricky. We also have some annoying babel
      // plugin that transpiles unicode regex incorrectly for \p{L} - otherwise it
      // probably would have been ok.
      return !/^.+@.+$/.test(formEmail)
    }
  },
  forceMobile: ({ forceMobile }) => forceMobile && checkBoolean(forceMobile),
  lazyLoad: ({ lazyLoad }) => lazyLoad && checkBoolean(lazyLoad),
  'catHeaderProps[isMobile]': ({
    'catHeaderProps[isMobile]': catHeaderIsMobile,
  }) => catHeaderIsMobile && checkBoolean(catHeaderIsMobile),
  'catHeaderProps[totalProducts]': ({
    'catHeaderProps[totalProducts]': catHeaderTotalProducts,
  }) => catHeaderTotalProducts && !/^\d+$/.test(catHeaderTotalProducts),
  'catHeaderProps[truncateDescription]': ({
    'catHeaderProps[truncateDescription]': catHeaderTruncateDescription,
  }) =>
    catHeaderTruncateDescription && checkBoolean(catHeaderTruncateDescription),
  'catHeaderProps[categoryHeaderShowMoreDesktopEnabled]': ({
    'catHeaderProps[categoryHeaderShowMoreDesktopEnabled]': catHeaderCHSMDE,
  }) => catHeaderCHSMDE && checkBoolean(catHeaderCHSMDE),
}

/**
 * Runs a check function against the given `param`
 *
 * @param {string} param Query param name
 * @param {object} query The parsed query string
 * @return {object} result
 * @property result.error {boolean}
 * @property result.addToQuery {object|false}
 * @property result.errStr {string}
 */
const checkParam = (param, query) => {
  let error = checks[param](query)

  if (typeof error === 'boolean' || !error) error = { error }

  return {
    error: !!error.error,
    addToQuery: error.query || false,
    errStr:
      typeof error.error === 'string' ? error.error : `Invalid param: ${param}`,
  }
}

/**
 * Validates the request for /cmscontent
 *
 * @param {*} req
 * @return {object} validation
 * @property validation.isValid {boolean}
 * @property validation.query {object} The sanitised query string
 */
const validateCmsContentRequest = (req) => {
  let { query } = req

  const required = ['storeCode', 'brandName', 'siteId']
  /* eslint-disable no-restricted-syntax */
  for (const param of required) {
    if (!query[param])
      return Boom.badRequest(`Missing ${param} query parameter`)
  }
  /* eslint-enable */

  if (!query.cmsPageName && !query.seoUrl && !query['location[pathname]'])
    return Boom.badRequest(
      'One of cmsPageName, seoUrl or location[pathname] is required'
    )

  const toCheck = Object.keys({ ...query, ...checks })
  /* eslint-disable no-restricted-syntax */
  for (const param of toCheck) {
    if (!checks[param]) {
      // In future we can be stricter on unknown query parameters but while
      // there may still be old versions floating around we just sanitise them.
      // return Boom.badRequest(`Unexpected query parameter: ${param}`)

      // Remove unknown query parameter
      query = { ...query, [param]: undefined }
      continue // eslint-disable-line
    }

    const { error, errStr, addToQuery } = checkParam(param, query)
    if (error) return Boom.badRequest(errStr)

    if (addToQuery) {
      // Some checks may sanitise the query string e.g. location[search]
      query = { ...query, ...addToQuery }
    }
  }
  /* eslint-enable */

  return {
    isValid: true,
    query,
  }
}

export function mrCmsContentHandler(req, reply) {
  if (req.url.pathname === '/cmscontent') {
    const validation = validateCmsContentRequest(req)
    if (validation.isBoom) {
      return reply(validation)
    }
    req.query = validation.query
    const query = qs.stringify(validation.query)
    req.url = url.parse(
      url.format({
        ...req.url,
        query,
        search: `?${query}`,
      })
    )
  }

  // return mrCmsHandler(req, reply, false, sanitizeResponseAndReply)
  if (process.env.CMS_TEST_MODE === 'true') {
    // No calls to montyCMS to facilitate testing and local development
    return reply(null, { cmsTestMode: true })
  }

  logMrCmsRequest(req)

  if (!process.env.REDIS_URL) {
    return proxyRequest(reply, sanitizeResponseAndReply)
  }

  // deals with content requests not asset request handling
  // superagent changes the content and we have to set specific headers to make this work
  // superagent of this version requires to ask for content type or return as json which
  // we then need to return this back into the reply headers
  return cache404MrCmsResponseHandler(req).then((response) => {
    const error = response.error || null
    logMrCmsResponse(req, response, error)

    return responseCacheContentHandler(response, reply)
  })
}

function onAssetsResponse(err, res, request, reply) {
  logMrCmsResponse(request, res, err)
  reply(err, res)
}

export function mrCmsAssetsHandler(req, reply) {
  if (process.env.CMS_TEST_MODE === 'true') {
    // No calls to montyCMS to facilitate testing and local development
    return reply(null, { cmsTestMode: true })
  }

  logMrCmsRequest(req)

  return proxyRequest(reply, onAssetsResponse)
}

export function mrCmsHealthHandler(req, reply) {
  const url = `${process.env.MR_CMS_PROTOCOL}://${process.env.MR_CMS_URL}:${
    process.env.MR_CMS_PORT
  }/health`

  return superagent
    .get(url)
    .then((res) => {
      return reply(res.text).code(200)
    })
    .catch((err) => {
      return reply(err)
    })
}
