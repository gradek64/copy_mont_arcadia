// 10 minute default cache expiration timeout
const defaultTTL = 600

const NO_CACHE = 'no-cache, no-store, must-revalidate'

// Expiration values in seconds
const timeouts = {
  hapi: [
    {
      matcher: /(^\/$|\/\?)/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_HOMEPAGE ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/products\/stock\?productId=.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_PRODUCTS_STOCK ||
        60}, public, must-revalidate`,
    },
    {
      // ADP-49 matcher for /api/products/ when serves PDP results
      matcher: /^\/api\/products\/[^?].+(product|produit|produkt).+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_PDP ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/products?[?/].+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_PRODUCTS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^.+\/product\/.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_PDP ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^.+\/category\/.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_CATEGORY ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/cms\/.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_CMS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/cmscontent.*$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_CMS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      // never cache keep-alive requests!
      matcher: /^\/api\/keep-alive$/,
      cacheControl: NO_CACHE,
    },
    {
      matcher: /^\/api\/navigation\/.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_NAVIGATION ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/site-options$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_SITE_OPTIONS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/footers$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_FOOTERS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/stores-countries\?brand=.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_STORE_COUNTRIES ||
        defaultTTL}, public, must-revalidate`,
    },
    // Waiting on calculations for how much we want to cache / poll features then this can be reduced
    {
      matcher: /^\/api\/features$/,
      cacheControl: `max-age=${process.env.FEATURES_CACHE_EXPIRATION ||
        3600}, public, must-revalidate`,
    },
    {
      matcher: /^\/api\/features\/[^/]+$/,
      cacheControl: `max-age=${600}, public, must-revalidate`,
    },
    {
      matcher: /^\/assets\/.+\/images\/.+$/,
      cacheControl: `max-age=${24 * 60 * 60}, public, must-revalidate`,
      etag: 'hash',
    },
    /**
     TODO: update the public folder, move all images into the image sub-folder and make sure webpack works properly
     Images on main folders (expire in 1 day)
     */
    {
      matcher: /^\/assets\/.+\/*.(gif|jpg|jpeg|svg|png)/,
      cacheControl: `max-age=${24 * 60 * 60}, public, must-revalidate`,
      etag: 'hash',
    },
    {
      matcher: /^\/assets\/.+\/vendors\/.+$/,
      cacheControl: `max-age=${24 * 60 * 60}, public, must-revalidate`,
    },
    {
      matcher: /^\/assets\/.+\/fonts\/.+$/,
      cacheControl: `max-age=${365 * 24 * 60 * 60}, public, must-revalidate`,
      etag: 'hash',
    },
    /**
      TODO: update the public folder, move all fonts into the font sub-folder and make sure webpack works properly
      Fonts on main folders (expire in 1 year)
     */
    {
      matcher: /^\/assets\/.+\/*.(woff|eot|woff2|ttf)/,
      cacheControl: `max-age=${365 * 24 * 60 * 60}, public, must-revalidate`,
      etag: 'hash',
    },
    {
      matcher: /^\/assets\/common\/.*$/,
      cacheControl: `max-age=${365 * 24 * 60 * 60}, public, must-revalidate`,
    },
    {
      matcher: /^\/assets\/.+\/styles.*\.css$/,
      cacheControl: `max-age=${365 * 24 * 60 * 60}, public, must-revalidate`,
    },
    {
      matcher: /^\/assets\/content\/cms\/page-data\/.+$/,
      cacheControl: `max-age=${process.env.CACHE_TTL_MONTY_CMS ||
        defaultTTL}, public, must-revalidate`,
    },
    {
      matcher: /^\/assets\/content\/cms\/.+$/,
      cacheControl: `max-age=${7 * 24 * 60 * 60}, public, must-revalidate`,
    },
    // DES-4937 Ensure browsers do not cache SSRs from checkout pages
    {
      matcher: /^\/checkout/,
      cacheControl: NO_CACHE,
    },
    {
      matcher: /^\/guest\/checkout/,
      cacheControl: NO_CACHE,
    },
    // ADP-3458 Do not cache shopping bag requests
    {
      matcher: /^\/api\/shopping_bag\/get_items$/,
      cacheControl: NO_CACHE,
    },
  ],
}

export function getCacheSettings(api, path) {
  return timeouts[api].find((item) => item.matcher.test(path))
}

export function getEtagMethod(api, path) {
  const config = getCacheSettings(api, path)
  return config && config.etag ? config.etag : false
}

export function getCacheControl(api, path) {
  const config = getCacheSettings(api, path)
  return config && config.cacheControl ? config.cacheControl : ''
}

export function getCacheExpiration(api, path) {
  const cacheControl = getCacheControl(api, path)

  if (cacheControl) {
    const matches = cacheControl.match(/max-age=(\d+)/)
    if (matches) {
      return parseInt(matches[1], 10) || 0
    }
  }

  return 0
}
