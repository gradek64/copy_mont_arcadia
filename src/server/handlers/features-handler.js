import Boom from 'boom'
import * as logger from '../lib/logger'
import { getFeatures } from '../lib/features-service'

export default function featuresHandler(request, reply) {
  const config = request.headers['brand-code']
  if (!config || config.length !== 4) {
    logger.error('features-handler', {
      loggerMessage:
        'Invalid or missing brand config header on features request',
    })
    return reply(
      Boom.badRequest(
        'Invalid or missing brand config header on features request'
      )
    )
  }

  const features = getFeatures({
    brandCode: config.substring(0, 2),
    region: config.substring(2, 4),
  })

  reply({ features })
}

export const getAppFeatureFlags = () =>
  Promise.resolve(
    JSON.stringify({
      FEATURE_PERSISTENT_AUTH:
        process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG === 'true',
    })
  )

export const consumerFeatureHandler = (req, reply) => {
  if (req.params.consumer === 'monty') return featuresHandler(req, reply)

  if (req.params.consumer === 'app') {
    return getAppFeatureFlags()
      .then((data) => {
        reply(`{ "success": true, "flags": ${data} }`)
      })
      .catch((err) => {
        reply({ success: false, message: err.message })
      })
  }

  return reply(
    `{ "success": false, "message": "Invalid consumer provided. Should be one of: 'app', 'monty'" }`
  ).code(404)
}

export const consumerFeatureHandlerSpec = {
  summary: 'Get the feature flags for a consumer',
  parameters: [
    {
      name: 'consumer',
      in: 'path',
      description: 'Either "app" or "monty"',
      type: 'string',
      example: 'app',
    },
  ],
  responses: {
    200: {
      description: 'The app consumer response',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          flags: {
            type: 'object',
          },
        },
      },
    },
  },
  404: {
    description: 'Consumer not found',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
}
