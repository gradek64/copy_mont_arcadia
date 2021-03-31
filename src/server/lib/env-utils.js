export const PRODUCTION = 'production'
export const DEFAULT = 'default'
export const WCS_PRODUCTION = 'prod'
/**
 * checks if the current NODE_ENV is production
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === PRODUCTION
}

/**
 * checks if the current WCS_ENVIRONMENT is production
 */
export function isWCSProduction() {
  return process.env.WCS_ENVIRONMENT === WCS_PRODUCTION
}

/**
 * provides interface to access mapped environment names
 * @returns {Object.<string, string>}
 */
export const getEnvironmentMapper = () => {
  const environmentNameMapper = {
    production_coreapi_g: PRODUCTION,
    production_coreapi: PRODUCTION,
  }
  return environmentNameMapper
}

/**
 * @typedef BrandedEnvironmentVariable
 * @property {string} variable - the unbranded env variable name
 * @property {string} brandName - Which brandname should be appended
 */

/**
 * retrieves an environment variable that is brand specific or falls
 * back to unbranded environment variable if none is defined
 * @param {BrandedEnvironmentVariable} BrandedEnvironmentVariableObject
 * @returns {string | undefined} Environment Variable if defined
 */
export const getBrandedEnvironmentVariable = ({ variable, brandName }) => {
  if (brandName) {
    return (
      process.env[`${variable}_${brandName.toUpperCase()}`] ||
      process.env[variable]
    )
  }
  throw new Error('Brandname is required')
}

/**
 * @property {string} variable - the unbranded env variable name
 * @property {string} brandName - Which brandname should be appended
 * * @property {string} region - Which region should be appended
 */
/**
 * retrieves an environment variable that is brand and region specific or falls
 * back to unbranded environment variable if none is defined
 * @param {BrandedEnvironmentVariable} BrandedEnvironmentVariableObject
 * @returns {string | undefined} Environment Variable if defined
 */
export const getBrandedEnvironmentVariableByRegion = ({
  variable,
  brandName,
  region,
}) => {
  if (brandName && region) {
    return (
      process.env[`${variable}_${brandName}_${region}`.toUpperCase()] ||
      process.env[variable]
    )
  }

  throw new Error('Brandname and Region are required')
}

/**
 * Determines the environment that the application is running in, e.g. showcase,
 * acc1 or production. The production name can be one of two options which reflects
 * whether it is preprod or live, but both should be considered production.
 *
 * if the environment name has a mapped value defined it should return that value,
 * if the environment name isn't set it should fallback to default.
 *
 * @returns {string} environment name
 */
export function getEnvironmentName() {
  const { ENVIRONMENT_NAME } = process.env
  if (ENVIRONMENT_NAME) {
    const envMapper = getEnvironmentMapper()
    if (Object.hasOwnProperty.call(envMapper, ENVIRONMENT_NAME)) {
      return envMapper[ENVIRONMENT_NAME]
    }
    return ENVIRONMENT_NAME
  }
  return DEFAULT
}
