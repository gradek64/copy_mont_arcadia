import superagent from 'superagent'

function setUpCaching() {
  if (!process.env.REDIS_URL) return

  const superAgentCache = require('superagent-cache')
  const CsRedis = require('cache-service-redis')
  const newRelic = require('../../server/lib/newrelic.js')

  const defaults = {
    cacheWhenEmpty: false,
    expiration: 900,
    pruneOptions: ['arcadia-api-key', 'arcadia-session-key', 'authjwt'],
  }

  const cache = new CsRedis({ redisUrl: process.env.REDIS_URL })

  cache.db.on('error', (error) => {
    throw error
  })

  const getFromCache = cache.get
  cache.get = (key, callback) => {
    getFromCache.call(cache, key, (error, response) => {
      if (response) {
        newRelic.addCustomAttribute('elasticacheHit', 'true')

        response.cached = true
      }

      callback(error, response)
    })
  }

  const setInCache = cache.set
  cache.set = (key, response, expiration, refresh, callback) => {
    const { body, text, statusCode, status, ok } = response
    // body.success and body.statusCode are scrAPI specific error flags that are usually absent in successful response
    if (
      expiration < 0 &&
      body.success !== false &&
      (!body.statusCode || body.statusCode === 200)
    ) {
      const headers = Object.assign({}, response.headers)
      delete headers['arcadia-api-key']
      delete headers['arcadia-session-key']
      delete headers.authjwt

      setInCache.call(
        cache,
        key,
        { body, text, headers, statusCode, status, ok },
        -expiration,
        refresh,
        callback
      )
    } else {
      setImmediate(callback)
    }
  }

  superagent.Request.prototype.cache = function cacheFunction(cacheable, secs) {
    if (typeof cacheable === 'number') {
      secs = cacheable
      cacheable = !!secs
    }

    if (cacheable) {
      this.expiration(secs ? -secs : -900)
    }

    return this
  }

  superAgentCache(superagent, cache, defaults)
}

/**
 * A secondary caching system was previously used to cache
 * superagent responses. This system stored the cache data in
 * session storage. This function exists to clear out that
 * session storage entry for all users from now on as a cleanup.
 *
 * See PTM-820 for more details
 */
function removeCacheFromSessionStorage() {
  const logger = require('../../server/lib/logger')

  try {
    const sessionStorageKey = 'cache-module-session-storage'

    if (sessionStorageKey in window.sessionStorage) {
      window.sessionStorage.removeItem(sessionStorageKey)
    }
  } catch (error) {
    logger.error(
      "Unable to remove 'cache-module-session-storage' key from sessionStorage",
      {
        loggerMessage: error.message,
        ...error,
      }
    )
  }
}

if (!process.browser) {
  setUpCaching()
} else {
  removeCacheFromSessionStorage()
}

export default superagent
