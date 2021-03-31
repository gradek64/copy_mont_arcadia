import HealthCheck from './lib/healthcheck'
import superagent from '../../shared/lib/superagent'
import { mrCmsHealthHandler } from './mr-cms-handler'
import getVersion from './version-handler'
import snsHandler from '../sns-server'
import { getAllFeatures } from '../lib/features-service'
import { getAppFeatureFlags } from './features-handler'
import * as logger from '../lib/logger'
import routeHandler from '../api/handler'

const STATUS_RUNNING = 'good'
const STATUS_NO_RUNNING = 'not running'
const STATUS_UNKNOWN_ERROR = 'could not retrieve the status'
const CODE_SUCCESS = 200
const CODE_ERROR = 500
const DEFAULT_STORE_CODE = 'tsuk'

function customReply(body) {
  if (body.status && body.status !== CODE_SUCCESS) {
    logger.error('platform-healthcheck', {
      loggerMessage: `An error has occurred while retrieving the status: ${
        body.message
      }`,
    })

    return body.status
  }

  return {
    state: () => {},
    header: () => {},
    code: (replyCode) => replyCode,
  }
}

function getRedisStatus() {
  if (!superagent.cache || !superagent.cache.db) return STATUS_NO_RUNNING

  const healthCheck = new HealthCheck(superagent.cache.db)

  return healthCheck.isHealthCheckSuccessful()
    ? STATUS_RUNNING
    : STATUS_NO_RUNNING
}

function getSNSStatus() {
  return snsHandler && snsHandler.info && snsHandler.info.started !== 0
    ? STATUS_RUNNING
    : STATUS_NO_RUNNING
}

function getWCSStatus() {
  const wcsRequest = {
    url: {
      pathname: '/api/site-options',
    },
    query: {},
    payload: {},
    method: 'get',
    headers: {
      'brand-code': DEFAULT_STORE_CODE,
    },
  }

  return routeHandler(wcsRequest, customReply)
}

function getCMSStatus(request) {
  return mrCmsHealthHandler(request, customReply)
}

function getResponseStatus(status) {
  if (isNaN(status)) {
    return STATUS_UNKNOWN_ERROR
  }

  const statusNumber = parseInt(status, 10)

  return statusNumber === CODE_SUCCESS ? STATUS_RUNNING : statusNumber
}

export function getPlatformHealthCheckHandler(request, reply) {
  return Promise.all([
    getWCSStatus(),
    getCMSStatus(),
    getAppFeatureFlags(),
  ]).then(([wcsResponse, cmsResponse, appFeatureFlags]) => {
    const redisReponse = getRedisStatus()
    const snsResponse = getSNSStatus()

    let responseCode = CODE_SUCCESS

    if (
      wcsResponse !== CODE_SUCCESS ||
      cmsResponse !== CODE_SUCCESS ||
      redisReponse !== STATUS_RUNNING ||
      snsResponse !== STATUS_RUNNING
    ) {
      responseCode = CODE_ERROR
    }

    return reply({
      redis: redisReponse,
      sns: snsResponse,
      wcs: getResponseStatus(wcsResponse),
      cms: getResponseStatus(cmsResponse),
      buildInfo: getVersion(),
      featureFlags: getAllFeatures(),
      appFeatureFlags: JSON.parse(appFeatureFlags),
    }).code(responseCode)
  })
}
