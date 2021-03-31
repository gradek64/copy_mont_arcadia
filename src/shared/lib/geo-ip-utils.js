/**
 * GeoIP seeks to encourage a user to use a site most appropriate to their preferred country.
 * The URL we offer the user to be redirected to is determined by either:
 *
 * - the country of origin for their network request, as determined by IP blocks for that country, or
 * - the ISO country code stored as a preference by the user
 *
 * Detailed documentation: https://arcadiagroup.atlassian.net/wiki/spaces/MON/pages/1015087292/Monty+GeoIP
 */

import { getCode } from 'country-list'

import { ALL_FEATURES } from '../constants/features'
import {
  getSiteConfigByPreferredISO,
  getAllBrandHostnames,
  getEnvDomainsFromConfig,
} from '../../server/config'
import { getStoreCode } from '../selectors/configSelectors'
import { getRouteSearch } from '../selectors/routingSelectors'
import { isValidSeoUrl } from './url-utils'

const { FEATURE_GEOIP } = ALL_FEATURES

/**
 * Determines the most appropriate ISO to associate with the user
 * @param {String} geoISO | the x-user-geo header value from Akamai
 * @param {String} storedGeoPreference | the cookie value set in GeoIP modal
 * on previous visit
 * @returns {String} | an ISO
 */
export const getUserISOPreference = (geoISO, storedGeoPreference) => {
  return geoISO || storedGeoPreference
}

const isUsingMobileDomain = (hostname) => /^m\.|\.m\.|-m-/.test(hostname)

const handleDesktopMainDevRedirect = (hostname, userISOPreference) => {
  const [domain, queryString = ''] = hostname.split('?')
  const newQS = queryString
    ? queryString.replace(
        /prefShipCtry=[A-Z]{2}/,
        `prefShipCtry=${userISOPreference}`
      )
    : `prefShipCtry=${userISOPreference}`

  return `${domain}?${newQS}`
}

const handleMobileAWSRedirect = (hostname, redirectDomain) => {
  const [, env, restDomain] = hostname.match(/^([^-]+)-[^.]+(.+)/)
  return `${env}-${redirectDomain.replace(/\./g, '-')}${restDomain}`
}

const handleMobileUnconfiguredAkamaiRedirect = (hostname, redirectDomain) => {
  const [, leftSubdomain] = hostname.match(/^([^.]+)\./)
  return `${leftSubdomain}.${redirectDomain}`
}

export const handleDevRedirect = ({
  brandName,
  hostname,
  userISOPreference,
  redirectDomain,
  isMobileMainDev,
  isDesktopMainDev,
}) => {
  if (isDesktopMainDev)
    return handleDesktopMainDevRedirect(hostname, userISOPreference)

  if (isMobileMainDev) return handleMobileAWSRedirect(hostname, redirectDomain)

  const isMobileUnconfiguredAkamai = !getAllBrandHostnames(
    brandName,
    hostname
  ).includes(hostname)
  if (isMobileUnconfiguredAkamai)
    return handleMobileUnconfiguredAkamaiRedirect(hostname, redirectDomain)

  return redirectDomain
}

export const getURLPath = (url) => {
  const matches = url.match(/(https?:\/\/)?[^/]+\.[^/]+(\.[^/]+)*(\/.*)?$/)
  if (!matches) return false
  return matches[3] || '/'
}

export const getPDPURLPath = (url) => {
  // remove hash values or querystring
  const stripped = url.split(/[#?]/).shift()
  if (isValidSeoUrl(stripped)) return url
  return getURLPath(url)
}

export const euSiteAgnosticISOs = [
  'AD',
  'BE',
  'EE',
  'FI',
  'GR',
  'VA',
  'IT',
  'LU',
  'ME',
  'NL',
  'PT',
  'SM',
  'SK',
  'ES',
  'CH',
]
const isPreferredSite = (
  geoISO,
  storedGeoPreference,
  { preferredISOs = [], region } = {}
) => {
  if (geoISO && preferredISOs.includes(geoISO)) return true
  if (storedGeoPreference && preferredISOs.includes(storedGeoPreference))
    return true

  // If the user's ISO is one of the euSiteAgnosticISOs and they try to visit
  // one of our EU sites (FR / DE / EU) then we should not try to redirect them
  const isRequestingOneOfEUSites = ['eu', 'de', 'fr'].includes(region)
  if (euSiteAgnosticISOs.includes(geoISO) && isRequestingOneOfEUSites)
    return true

  return false
}

export const isValidISO2 = (x) => /^[A-Z]{2}$/.test(x)

const appendInternationalRedirectParam = (url, state) => {
  const storeCode = getStoreCode(state)
  return `${url}?internationalRedirect=geoIPModal-${storeCode}`
}

export const appendGTMParams = (url, search = '') => {
  const utmIndex = search.indexOf('utm')
  const gtmParams = utmIndex > 0 ? `&${search.substr(utmIndex)}` : ''
  return `${url}${gtmParams}`
}

/**
 * Returns the redirect url to send the user to in the case they wish to be redirected.
 * There are a lot of cases, so please read carefully.
 */
export const getRedirectURL = (state) => {
  const {
    config: requestedSiteConfig,
    features: {
      status: { [FEATURE_GEOIP]: geoIPEnabled },
    },
    geoIP: {
      redirectURL,
      hostname,
      geoISO,
      userISOPreference,
      storedGeoPreference,
    },
    hostname: { isMobileMainDev, isDesktopMainDev },
  } = state
  const search = getRouteSearch(state)

  const geoIPFeatureDisabled = !geoIPEnabled
  const noGeoIPPreference = !userISOPreference

  if (geoIPFeatureDisabled || noGeoIPPreference) return undefined
  if (!isValidISO2(userISOPreference)) return undefined

  // If the request is for a PDP a redirectURL will be set in the redux state
  if (redirectURL) return redirectURL

  const userRequestedPreferredSite = isPreferredSite(
    geoISO,
    storedGeoPreference,
    requestedSiteConfig
  )

  // There is nowhere to redirect the user. In this case there should be no GeoIP modal as it doesn't make
  // sense to attempt to redirect the user to the site they are visiting.
  if (userRequestedPreferredSite) return undefined

  const userGeoBasedConfig = getSiteConfigByPreferredISO(
    userISOPreference,
    requestedSiteConfig.brandCode
  )

  const [mobileDomain, desktopDomain] = getEnvDomainsFromConfig(
    userGeoBasedConfig,
    hostname
  )

  const isMobileDomain = isUsingMobileDomain(hostname)
  // If, for whatever reason, the requested domain is the same as the user's prefered ISO domain
  // then we don't want them to redirect to the same domain. Vicious circle.
  // For example, someone from Brazil requests m.topshop.com, BR isn't one of the preferredISOs
  // but there is no site for BR so it defaults to the UK.
  const requestedSiteMatchesRedirectSite =
    // when developing locally the hostname will look something like
    // 'local.m.topshop.com' and the mobileDomain will look something like
    // 'm.topshop.com' so we match rather than checking for equality
    (isMobileDomain && hostname.match(mobileDomain)) ||
    (!isMobileDomain && hostname.match(desktopDomain))
  if (requestedSiteMatchesRedirectSite) return undefined

  let redirectDomain = isMobileDomain ? mobileDomain : desktopDomain
  redirectDomain = handleDevRedirect({
    brandName: requestedSiteConfig.brandName,
    hostname,
    userISOPreference,
    redirectDomain,
    isMobileMainDev,
    isDesktopMainDev,
  })

  return appendGTMParams(
    appendInternationalRedirectParam(redirectDomain, state),
    search
  )
}

export const shouldRedirectForDelivery = (country, deliverySiteISOs) => {
  return !deliverySiteISOs.includes(getCode(country))
}
