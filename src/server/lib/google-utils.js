import superagent from 'superagent'
import {
  getEnvironmentName,
  isProduction,
  PRODUCTION,
  DEFAULT,
  getBrandedEnvironmentVariable,
} from './env-utils'

/**
 * @typedef GtmOptions
 * @property {string} auth
 * @property {string} preview
 * @property {string} cookiesWin
 */

/**
 * @typedef GtmEnvironmentOptions
 * @type {Object}
 * @property {Object.<string, GtmOptions>} environment
 * @property {string} id
 */

/**
 * Takes a collection of GTM environment configurations and returns
 * the defined one, should it be defined, or fallsback to a default config.
 * If one doesn't exist it will throw an error
 * @param {GtmEnvironmentOptions} gtmEnvOptions
 * @param {string} [env] - the environment,
 * @returns {GtmOptions} gtm options object
 */
export function getGoogleTagManagerEnvOptions(gtmEnvOptions, env) {
  if (env) {
    if (Object.hasOwnProperty.call(gtmEnvOptions, env)) {
      return gtmEnvOptions[env]
    }
  }
  if (isProduction()) {
    if (Object.hasOwnProperty.call(gtmEnvOptions, PRODUCTION)) {
      return gtmEnvOptions[PRODUCTION]
    }
  }
  if (Object.hasOwnProperty.call(gtmEnvOptions, DEFAULT)) {
    return gtmEnvOptions[DEFAULT]
  }
  throw new Error('Missing default GTM Environment settings from site config')
}

/**
 * takes an object that provides values required for GTMs query params and constructs
 * the required query params as a string. If anything required arguments are options are
 * missing, an empty string is returned.
 * @param {GtmOptions} gtmOptions
 * @returns {string}
 */
export function constructGoogleTagManagerEnvParams(gtmOptions) {
  if (gtmOptions) {
    const { auth, preview, cookiesWin } = gtmOptions
    if (auth && preview && cookiesWin) {
      return `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=${cookiesWin}`
    }
  }
  return ''
}

/**
 * Takes a selection of provided configurations that define which GTM environment to target
 * and returns a query string which can be appended to the source urls that are
 * inserted into the DOM, and connects the correct GTM environment to our application
 * @param {GtmEnvironmentOptions} googleTagManager
 * @returns {string} query params
 */
export const getGoogleTagManagerQueryParams = (googleTagManager) => {
  const environment = getEnvironmentName()
  const envOptions = getGoogleTagManagerEnvOptions(
    googleTagManager.environment,
    environment
  )
  const queryParamsWithEnvInfo = constructGoogleTagManagerEnvParams(envOptions)
  return queryParamsWithEnvInfo
}

/**
 * This takes the site configuration object and returns the brands GoogleTagManager Id
 * @param {*} siteConfig - Takes a site configuration object
 * @returns {string}
 */
export const getGoogleTagManagerId = (siteConfig) =>
  process.env.GOOGLE_TAG_MANAGER_OVERRIDE || siteConfig.googleTagManager.id

/**
 * Returns the response from the google recaptcha site verify servervice - https://developers.google.com/recaptcha/docs/verify
 * @param {string} brandName
 * @param {string} recaptchaToken
 * @returns {object} Object that represents the response from the verification service
 */
export const validateGoogleRecaptchaToken = async (
  brandName,
  recaptchaToken
) => {
  const url =
    process.env.GOOGLE_RECAPTCHA_API_URL ||
    'https://www.google.com/recaptcha/api/siteverify'
  const secret = getBrandedEnvironmentVariable({
    variable: 'GOOGLE_RECAPTCHA_SECRET',
    brandName,
  })
  const response = await superagent
    .post(url)
    .type('form')
    .send({
      secret,
      response: recaptchaToken,
    })
    .catch((error) => {
      throw error
    })

  if (response.body.success) return response.body

  return {
    ...response.body,
    errorMessage: `Recaptcha Errors: ${response.body[
      'error-codes'
    ].toString()}`,
  }
}
