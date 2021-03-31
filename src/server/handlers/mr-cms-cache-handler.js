import superagent from 'superagent'
import CsRedis from 'cache-service-redis'

const cache = process.env.REDIS_URL
  ? new CsRedis({ redisUrl: process.env.REDIS_URL })
  : null

function fetchResource(apiUrl) {
  const timeoutRequest = 20000

  return new Promise((resolve) => {
    superagent
      .get(apiUrl)
      .timeout(timeoutRequest)
      .then((res) => {
        // return back normal request back
        return resolve(res)
      })
      .catch((errResponse) => {
        resolve(errResponse.response)
      })
  })
}

function getFromCache(apiUrl) {
  return new Promise((resolve, reject) => {
    cache.get(`${apiUrl}-404`, (error, redisResponse) => {
      if (error) return reject(error)

      resolve(redisResponse)
    })
  })
}

function setInCache(apiUrl, res) {
  const cacheExpiryTTL = 300 // in seconds - set to 5 mins

  if (res.status === 404) {
    // cache the response and return back the body
    cache.set(`${apiUrl}-404`, res.body, cacheExpiryTTL)
  }
}

/**
 * Cache 404 response for monty cms handler
 * ADP-467 This was implemented as there are 404 pages requested to mr-monty, which increases massive payload to monty due to 404 not being cached.
 * Solution will stop requests and hit the redis layer.
 * @param req
 * @returns {Promise}
 */
export async function cache404MrCmsResponseHandler(req) {
  const apiUrl = `${process.env.MR_CMS_PROTOCOL}://${process.env.MR_CMS_URL}${
    req.url.href
  }`

  try {
    let response = await getFromCache(apiUrl)
    const fromCache = !!response

    let statusCode = `404 (from cache)`
    if (!fromCache) {
      const res = await fetchResource(apiUrl)
      setInCache(apiUrl, res)
      response = res.body
      statusCode = res.statusCode
    }

    return {
      fromCache,
      statusCode,
      response,
    }
  } catch (error) {
    return { statusCode: 500, message: 'Redis error', error }
  }
}
