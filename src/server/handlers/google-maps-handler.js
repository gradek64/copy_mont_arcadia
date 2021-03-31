import crypto from 'crypto'
import url from 'url'
import Boom from 'boom'
import * as logger from '../lib/logger'
import { getBrandedEnvironmentVariable } from '../lib/env-utils'
import { getSiteConfig } from '../config'
import { createStaticMapUrl } from '../../shared/lib/google-static-map'

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString) {
  return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/')
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString) {
  return encodedString.replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string}
 */
function decodeBase64Hash(code) {
  return Buffer.from(code, 'base64')
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {string} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
function encodeBase64Hash(key, data) {
  return crypto
    .createHmac('sha1', key)
    .update(data)
    .digest('base64')
}

/**
 * Sign a URL using a secret key.
 *
 * @param  {string} path   The url you want to sign.
 * @param  {string} secret Your unique secret key.
 * @return {string}
 */
function sign(path, secret) {
  const uri = url.parse(path)
  const unsafeSecret = decodeBase64Hash(removeWebSafe(secret))
  const hashedSignature = makeWebSafe(encodeBase64Hash(unsafeSecret, uri.path))
  return `${url.format(uri)}&signature=${hashedSignature}`
}

/**
 * validate request has a url on it's body
 * @param {Object} request                    Hapi request object
 * @param {GoogleMapsPayload} request.payload expected payload on this request
 * @returns {GoogleMapsPayload}
 */
function validateRequest(request) {
  if (
    !request.payload ||
    !request.payload.currentLat ||
    !request.payload.currentLng ||
    !request.payload.markers ||
    !request.payload.dimensions ||
    !request.payload.iconDomain ||
    !request.payload.zoom
  ) {
    const requiredProps = [
      'currentLat',
      'currentLng',
      'markers',
      'dimensions',
      'iconDomain',
      'zoom',
    ]
    const message = `a request body with the following properties are required: ${requiredProps.join(
      ', '
    )}`
    throw new Error(message)
  }
  return request.payload
}

/**
 * @typedef GoogleMapsPayload
 * @property {number} currentLat
 * @property {number} currentLng
 * @property {}
 */

/**
 *
 * @param {Object} request                    Hapi request object
 * @param {} request.payload expected payload on this request
 * @param {*} reply                           Hapi reply function
 * @returns {*}
 */
export default function googleMapsHandler(request, reply) {
  const hostname = request.info.hostname
  try {
    const {
      currentLat,
      currentLng,
      markers,
      dimensions,
      iconDomain,
      zoom,
    } = validateRequest(request)
    const siteConfig = getSiteConfig(hostname)
    const brandName = siteConfig.brandName || ''
    const googleApiKey = getBrandedEnvironmentVariable({
      variable: 'GOOGLE_API_KEY',
      brandName,
    })
    const googleSigningSecret = getBrandedEnvironmentVariable({
      variable: 'GOOGLE_URL_SIGNING_SECRET',
      brandName,
    })
    const url = createStaticMapUrl({
      currentLat,
      currentLng,
      markers,
      dimensions,
      iconDomain,
      zoom,
      apiKey: googleApiKey,
    })

    // fallback to unsigned url if no secret present
    if (!googleSigningSecret) {
      const response = reply({
        url,
        signature: url,
      })
      return response.code(200)
    }

    const signature = sign(url, googleSigningSecret)
    const response = reply({
      url,
      signature,
    })
    return response.code(200)
  } catch (e) {
    logger.error(e, request)
    return reply(Boom.badRequest(e.message))
  }
}

export const googleMapsHandlerSpec = {
  summary: 'builds and signs the url that is requested from googlemaps',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      description: 'the paramters required to build the google static map url',
      required: true,
      schema: {
        type: 'object',
        required: [
          'currentLat',
          'currentLng',
          'markers',
          'dimensions',
          'iconDomain',
          'zoom',
        ],
        properties: {
          currentLat: {
            type: 'number',
          },
          currentLng: {
            type: 'number',
          },
          markers: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'integer',
              },
              minItems: 2,
              maxItems: 2,
            },
          },
          dimensions: {
            type: 'object',
            properties: {
              height: {
                type: 'integer',
              },
              width: {
                type: 'integer',
              },
            },
          },
          iconDomain: {
            type: 'string',
          },
          zoom: {
            type: 'integer',
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description: 'Successfully signed signature and unsigned url',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            example:
              'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ',
          },
          signature: {
            type: 'string',
            example:
              'https://maps.googleapis.com/maps/api/staticmap?center=51.515615%2C-0.1432734&zoom=14&size=394x650&maptype=roadmap&style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon&key=AIzaSyBadoEbcsHE0WvdLeRiBXz0mnGpwS7ZlnQ&signature=ffy74XUFWrPYsjDsQ8EfgQ2V_vw=',
          },
        },
      },
    },
    400: {
      description: 'Error',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          message: {
            type: 'string',
            example:
              'a request body with the following properties are required: currentLat, currentLng, markers, dimensions, iconDomain, zoom',
          },
        },
      },
    },
  },
}
