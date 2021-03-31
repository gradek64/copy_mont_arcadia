import R, { chain, groupBy, map, pipe, prop, sortBy, uniq } from 'ramda'
import countryList from 'country-list'

import paymentSchema from '../../shared/constants/paymentSchema'
import customerDetailsSchema from '../../shared/constants/customerDetailsSchema'
import checkoutAddressFormRules from '../../shared/constants/checkoutAddressFormRules'
import qasCountries from '../../shared/constants/qasCountries'
import fetchWCSSiteConfigs from '../lib/site-config-service'

// hard coded config data
import burtonConfigs from './brands/burton'
import dorothyPerkinsConfigs from './brands/dorothy-perkins'
import evansConfigs from './brands/evans'
import missSelfridgeConfigs from './brands/miss-selfridge'
import topmanConfigs from './brands/topman'
import topshopConfigs, {
  thirdPartySiteConfigs as topshopThirdPartyConfigs,
} from './brands/topshop'
import wallisConfigs from './brands/wallis'

/**
 * siteConfigs is an array of config objects specific to a brand-region,
 * eg language / region / currency / domains
 *
 * NOTE we do not export the configs directly. Please use getters / setters
 * @type {SiteConfig[]}
 */
let siteConfigs = [
  ...topshopConfigs,
  ...topmanConfigs,
  ...wallisConfigs,
  ...burtonConfigs,
  ...dorothyPerkinsConfigs,
  ...evansConfigs,
  ...missSelfridgeConfigs,
]

let thirdPartySiteConfigs = [...topshopThirdPartyConfigs]

/**
 * @typedef SiteDomains
 * @property {string[]} prod
 */

/**
 * @typedef SmartServeViewport
 * @property {number} staging
 * @property {number} prod
 */

/**
 * @typedef SmartServeConfig
 * @property {SmartServeViewport} mobile
 * @property {SmartServeViewport} desktop
 */

/**
 * @typedef SocialProofSettings
 * @property {string} counter
 * @property {string} k
 * @property {number} minimumThreshold
 * @property {number} timePeriod
 * @property {boolean} [shouldShowProductAttributeBannerWhenTrending]
 */

/**
 * @typedef SiteConfig
 * @property {string} analyticsId
 * @property {string} googleTagManagerId
 * @property {string} stagingReportSuiteId
 * @property {string} prodReportSuiteId
 * @property {string} brandName
 * @property {string} brandDisplayName
 * @property {number} siteId
 * @property {string} storeCode
 * @property {string} brandCode
 * @property {string} region
 * @property {number} brandId
 * @property {string} name
 * @property {string} lang
 * @property {string} locale
 * @property {string} currencyCode
 * @property {string} currencySymbol
 * @property {string} country
 * @property {string} defaultLanguage
 * @property {string} bazaarVoiceId
 * @property {string} company_id
 * @property {string} current_url
 * @property {SiteDomains} domains
 * @property {string} mediaHostname
 * @property {string} staticAmplienceHost
 * @property {SmartServeConfig} smartServe
 * @property {string} language
 * @property {string} googleSiteVerification
 * @property {string} catalogId
 * @property {string} langId
 * @property {string[]} preferredISOs
 * @property {string[]} siteDeliveryISOs
 * @property {string} orderReturnUrl
 * @property {{ [key: string]: SocialProofSettings }} socialProof
 */

/**
 * @return {SiteConfig[]}
 */
export const getSiteConfigs = () => siteConfigs

export const getBrandThirdPartySiteConfigs = (brandName) =>
  thirdPartySiteConfigs.filter((domain) => domain.brandName === brandName)

export const getBrandThirdPartySiteUrls = (brandName) =>
  getBrandThirdPartySiteConfigs(brandName).reduce((urls, domain) => {
    urls[domain.country] = domain.url
    return urls
  }, {})

/**
 * brandConfigs is an object with a property for each brand which contains
 * brand wide data
 * eg deliveryCountries is the list of all countries that the brand
 * delivers to
 *
 * NOTE we do not export the configs directly. Please use getters / setters
 */
const brandConfigs = {
  br: {},
  dp: {},
  ev: {},
  ms: {},
  tm: {},
  ts: {},
  wl: {},
}

export const getBrandConfig = (brandCode) => brandConfigs[brandCode]

const createISOMapping = map((iso) => ({
  iso,
  name: countryList.getName(iso),
}))

export const buildConfigs = async () => {
  /**
   * When a server starts up we fetch the available delivery countries from WCS
   * and add them to the configs
   */
  const body = await fetchWCSSiteConfigs()
  const { siteConfigs: wcsSiteConfigs = {} } = body

  // first we create a list of delivery counties for each site config
  siteConfigs = siteConfigs.map((config) => {
    const wcsConfig = wcsSiteConfigs[config.siteId]
    if (!wcsConfig) return config
    const { deliveryISOs: siteDeliveryISOs = [], trustArcDomain } = wcsConfig
    return {
      ...config,
      siteDeliveryISOs,
      trustArcDomain,
    }
  })

  thirdPartySiteConfigs = thirdPartySiteConfigs.map((config) => {
    const wcsConfig = wcsSiteConfigs[config.siteId]
    if (!wcsConfig) return config
    const { deliveryISOs: siteDeliveryISOs = [] } = wcsConfig
    return {
      ...config,
      siteDeliveryISOs,
    }
  })

  // then we create a list of delivery countries for each brand config
  // (which is sorted alphabetically by name)
  const configsByBrand = groupBy((siteConfig) => siteConfig.brandCode, [
    ...siteConfigs,
    ...thirdPartySiteConfigs,
  ])
  Object.entries(configsByBrand).forEach(([brandCode, brandSiteConfigs]) => {
    const brandDeliveryISOs = brandSiteConfigs.reduce(
      (deliveryISOs, siteConfig) => {
        if (siteConfig.siteDeliveryISOs) {
          return deliveryISOs.concat(siteConfig.siteDeliveryISOs)
        }
        return deliveryISOs
      },
      []
    )
    const deliveryCountries = pipe(
      uniq,
      createISOMapping,
      sortBy(prop('name'))
    )(brandDeliveryISOs)
    brandConfigs[brandCode] = { deliveryCountries }
  })
}

// this function should only be used for unit testing:
export function resetConfigsForTesting() {
  Object.keys(brandConfigs).forEach((brandCode) => {
    brandConfigs[brandCode] = {}
  })
  siteConfigs.forEach((siteConfig, i) => {
    siteConfigs[i] = { ...siteConfig, siteDeliveryISOs: [] }
  })
}

const DEFAULT = {
  paymentSchema,
  customerDetailsSchema,
  checkoutAddressFormRules,
  qasCountries,
  logoVersion: '19102018',
}
const replaceDotsWithDashes = R.replace(/\./g, '-')
const sanitizeConfig = (siteConfig) => {
  // TODO defaulting to dorothyperkins is dangerous, Monty does not exists without a brand
  // Consider removing the following fallback
  if (siteConfig === undefined) {
    siteConfig = { ...dorothyPerkinsConfigs[0] }
  }
  const { brandCode } = siteConfig
  const brandConfig = brandConfigs[brandCode]
  return { ...DEFAULT, ...brandConfig, ...siteConfig }
}

export function getConfigByStoreCode(code) {
  return sanitizeConfig(siteConfigs.find(({ storeCode }) => storeCode === code))
}

const matchConfigByDomain = (config, match) => {
  return Object.values(config.domains).some((envDomains) =>
    envDomains.some((domain) => match(domain))
  )
}

export function getSiteConfig(hostname) {
  let siteConfig
  let host
  const isAkamaiDevEnv = hostname.match(/^[^.]+\.m\./i)
  if (isAkamaiDevEnv) {
    host = hostname.split('.')
    host.shift()
    host = replaceDotsWithDashes(host.join('.'))
    siteConfig = siteConfigs.find((config) =>
      matchConfigByDomain(
        config,
        (domain) => replaceDotsWithDashes(domain) === host
      )
    )
  } else if (hostname.includes('.arcadiagroup.co.uk')) {
    siteConfig = siteConfigs.find((config) =>
      matchConfigByDomain(config, (domain) =>
        replaceDotsWithDashes(hostname).includes(replaceDotsWithDashes(domain))
      )
    )
  } else {
    siteConfig = siteConfigs.find((config) =>
      matchConfigByDomain(
        config,
        (domain) =>
          replaceDotsWithDashes(hostname) === replaceDotsWithDashes(domain)
      )
    )
  }
  return sanitizeConfig(siteConfig)
}

export const isMDotDomain = (domain) => /^m\.|\.m\.|^m-|-m-/.test(domain)

/**
 * Given an array of configs, returns pairs of environments to related domains
 * @param  {Array<Config>} configs
 * @return {Array<Array>}
 * [
 *   ['prod', ['m.topshop.com', 'www.topshop.com']],
 *   ['EBT', ['www.topshop.com.arcadiagroup.co.uk']],
 *   ['prod', ['m.us.topshop.com', 'us.topshop.com']],
 *   ['EBT', ['us.topshop.com.arcadiagroup.co.uk']],
 * ]
 */
const getAllSitesEnvDomainsPairs = (configs) =>
  chain((config) => R.toPairs(config.domains), configs)

/**
 * Given the `envDomainsPairs` array and `domain`, finds the environment that the domain belongs to
 * @param  {Array<Array>} envDomainsPairs
 * @param  {String} domain
 * @return {String|undefined}
 */
const getEnvFromDomain = (envDomainsPairs, domain) =>
  (envDomainsPairs.find(([, envDomains]) => envDomains.includes(domain)) ||
    [])[0]

export function getBrandHostnames(brandName, domain) {
  const isMDot = isMDotDomain(domain)
  const brandSiteConfigs = siteConfigs.filter(
    (config) => config.brandName === brandName
  )

  const envDomainsPairs = getAllSitesEnvDomainsPairs(brandSiteConfigs)
  const givenEnv = getEnvFromDomain(envDomainsPairs, domain)

  if (!givenEnv) {
    const { prod } = brandSiteConfigs[0].domains

    /**
     * A safety has been added here because there are some cases where this
     * function could infinitely recurse when some urls are missing in brand configs (PTM-759).
     */
    if (!prod || !prod.length) {
      throw new Error('Unable to get brand hostnames')
    }

    // domain is likely a dev environment domain that isn't in the brand configs  ¯\_(ツ)_/¯
    return getBrandHostnames(
      brandName,
      prod.find((hostname) => {
        return isMDot ? isMDotDomain(hostname) : !isMDotDomain(hostname)
      })
    )
  }

  return R.zipWith(
    ([env], config) => ({
      hostname: config.domains[env].find(
        (hostname) => isMDotDomain(hostname) === isMDot
      ),
      defaultLanguage: config.defaultLanguage,
      country: config.country,
    }),
    envDomainsPairs.filter(([env]) => env === givenEnv),
    brandSiteConfigs
  ).reduce((acc, { hostname, defaultLanguage, country }) => {
    acc[country] = { hostname, defaultLanguage }
    return acc
  }, {})
}

export function getSiteConfigByPreferredISO(ISO, brandCode) {
  const brandSiteConfigs = siteConfigs.filter(
    (config) => config.brandCode === brandCode
  )
  if (brandSiteConfigs.length === 0) return null

  return (
    brandSiteConfigs.find(({ preferredISOs }) => preferredISOs.includes(ISO)) ||
    brandSiteConfigs.find(({ preferredISOs }) => preferredISOs.includes('GB'))
  )
}

export function getWCSDomainFromConfig(config) {
  if (R.type(config) !== 'Object')
    throw new Error('Expected a brand config object')

  // At the moment this will provide a production WCS domain
  // in an ideal world we'd provide a WCS domain of the same environment as being requested
  // however that requires changing the CoreAPI base Mapper class and handler.
  // I've raised PTM-255 to address this.
  return config.domains.prod[1]
}

/**
 * Returns an array of all the sites' hostnames for a given brand
 *
 * @param  {String} brandName The brand name of the brand to get hostnames for
 * @param  {String} domain The domain being visited
 * @param  {Object} featureEnableGeoIPDesktopPixelRequest [Optional] filter results for GeoIP pixel support
 * @return {Array<String>} Array of domains
 */
export function getAllBrandHostnames(
  brandName,
  domain,
  featureEnableGeoIPDesktopPixelRequest = null
) {
  if (!brandName) throw new Error('Missing `brandName` parameter')

  const brandSiteConfigs = siteConfigs.filter(
    (conf) => conf.brandName === brandName
  )
  if (!brandSiteConfigs.length)
    throw new Error(`Invalid \`brandName\` given of ${brandName}`)

  const envDomainsPairs = getAllSitesEnvDomainsPairs(brandSiteConfigs)
  const env = getEnvFromDomain(envDomainsPairs, domain)
  if (!env)
    return getAllBrandHostnames(brandName, brandSiteConfigs[0].domains.prod[0])

  const standardReducer = (acc, conf) => acc.concat(conf.domains[env])

  const geoIPPixelRequestReducer = (acc, conf) => {
    const envDomains = conf.domains[env]

    // Default to the mobile domain, which is the first domain in the domain[env] array.
    // ** This is a Monty convention that exists only in brand config JSON **
    let domains = [envDomains[0]]

    const brandRegionFlags = R.pathOr(
      [],
      [conf.brandCode],
      featureEnableGeoIPDesktopPixelRequest
    )

    if (brandRegionFlags.includes(conf.region)) {
      domains = envDomains
    }

    return acc.concat(domains)
  }

  return R.uniq(
    brandSiteConfigs.reduce(
      featureEnableGeoIPDesktopPixelRequest
        ? geoIPPixelRequestReducer
        : standardReducer,
      []
    )
  )
}

/**
 * Returns the list of domains that match the environment of the given domain
 * @param  {Config} config
 * @param  {String} domain
 * @return {Array<String>} Array of domains
 */
export const getEnvDomainsFromConfig = (config, domain) => {
  if (Object.prototype.toString.call(config) !== '[object Object]')
    throw new Error(`Invalid config: ${config}`)
  if (Object.prototype.toString.call(domain) !== '[object String]')
    throw new Error(`Invalid domain: ${domain}`)

  return (
    Object.values(config.domains).find((domains) => domains.includes(domain)) ||
    config.domains.prod.slice()
  )
}

export const getFirstPreferredISO = (config) => config.preferredISOs[0]

export function extractHostName(host = '') {
  const nameAndPort = /^((?:[a-z-]+\.)+[a-z]+)(?::\d{1,5})?$/
  const matches = nameAndPort.exec(host.toLowerCase())
  return matches ? matches[1] : undefined
}

export function extractBrandCodeFromHeader(header = '') {
  const brandOptions = /^(ts|tm|ev|br|wl|dp|ms)$/
  const firstTwoChars = header.toLowerCase().substring(0, 2)
  const matches = brandOptions.exec(firstTwoChars)
  return matches ? matches[1] : undefined
}

export function getTrustArcDomain(code) {
  const siteConfig =
    siteConfigs.find(({ storeCode }) => storeCode === code) || {}
  return siteConfig.trustArcDomain
}

/**
 * Filters passed siteConfigs by the passed brandName
 * @param {string} brandName
 * @param {SiteConfig[]} siteConfigs
 * @returns {SiteConfig[]}
 */
export function filterConfigsByBrandName(brandName, siteConfigs) {
  return siteConfigs.filter((config) => config.brandName === brandName)
}

/**
 * returns first domain which isn't a mobile domain
 * returns empty string if no valid domains are found or provided
 * @param {string[]} domains
 * @return {string}
 */
export function getFirstNonMobileDomain(domains) {
  if (!domains) return ''
  const filteredDomains = domains.filter((domain) => !/^m\./.test(domain))
  return filteredDomains.length > 0 ? `https://${filteredDomains[0]}` : ''
}

/**
 * merges language from config with list of preferredISOs
 * @param {string} lang - the lang property in the config, defaults to 'en'
 * @param {string[]} preferredISOs
 * @return {string[]}
 */
export function createHrefLangs(lang, preferredISOs) {
  if (!lang) lang = 'en'
  return (preferredISOs || []).map((iso) => `${lang}-${iso.toLowerCase()}`)
}

/**
 * @typedef {Object} HrefLangOptions
 * @property {string} hreflang - identifies a language (in ISO-639-1 format) and a region (ISO-3166-1 Alpha 2)
 *   e.g. 'nl-be' equals dutch language for people in Belgium
 * @property {string} href - identifies the resource that should be served for the defined language region combination
 *   defined by the hreflang
 */

/**
 * filters any duplicated HrefLangOptions to ensure they don't appear in the DOM twice
 * @param {HrefLangOptions[]} options
 * @return {HrefLangOptions[]}
 */
export function filterHrefLangOptions(options) {
  if (!options || !Array.isArray(options)) options = []
  const combos = []
  const hreflangsToReturn = []
  for (let i = 0; i < options.length; i++) {
    const activeOption = options[i]
    const { hreflang, href } = activeOption
    if (hreflang && href) {
      const combo = `${hreflang}-${href}`
      if (!combos.includes(combo)) {
        combos.push(combo)
        hreflangsToReturn.push(activeOption)
      }
    }
  }
  return hreflangsToReturn
}

/**
 * constructs array of HrefLangOptions as defined in brand specific configurations
 * @param {SiteConfig[]} siteConfigs
 * @return {HrefLangOptions[]}
 */
export function constructHrefLangOptions(siteConfigs) {
  const hreflangOptions = siteConfigs.reduce((acc, config) => {
    const domains = (config.domains && config.domains.prod) || []
    const href = getFirstNonMobileDomain(domains)
    if (href) {
      const hrefLangs = createHrefLangs(config.lang, config.preferredISOs)
      const hrefLangOptions = hrefLangs.map((hreflang) => ({
        href,
        hreflang,
      }))
      return acc.concat(hrefLangOptions)
    }
    return acc
  }, [])
  return filterHrefLangOptions(hreflangOptions)
}

/**
 * returns list of alternate pages that should be served for defined languages and
 * regions as specified across each brands site configurations
 * @param {string} brandName
 * @return {HrefLangOptions[]}
 */
export function getLangAndDomainsByBrandName(brandName) {
  const siteConfigs = getSiteConfigs()
  const configsForBrand = filterConfigsByBrandName(brandName, siteConfigs)
  return constructHrefLangOptions(configsForBrand)
}
