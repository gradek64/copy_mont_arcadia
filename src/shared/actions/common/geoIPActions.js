/**
 * GeoIP seeks to encourage a user to use a site most appropriate to their preferred country.
 * The URL we offer the user to be redirected to is determined by either:
 *
 * - the country of origin for their network request, as determined by IP blocks for that country, or
 * - the ISO country code stored as a preference by the user
 *
 * Detailed documentation: https://arcadiagroup.atlassian.net/wiki/spaces/MON/pages/1015087292/Monty+GeoIP
 */

import { get } from '../../lib/api-service'
import { error } from '../../../server/lib/logger'
import { getGeoIPUserISOPreference } from '../../selectors/geoIPSelectors'
import { getPDPURLPath, getRedirectURL } from '../../lib/geo-ip-utils'

/**
 * Used on SSR only to capture the Akamai x-user-geo header and other data
 * needed to decide on the GeoIP modal behaviour.
 */
export const setGeoIPRequestData = ({
  hostname,
  geoISO,
  storedGeoPreference,
  userISOPreference,
  userRegionPreference,
  userLanguagePreference,
}) => ({
  type: 'SET_GEOIP_REQUEST_DATA',
  hostname,
  geoISO,
  storedGeoPreference,
  userISOPreference,
  userRegionPreference,
  userLanguagePreference,
})

/**
 * Used for PDP SSR to store the redirect URL if the product exists in the
 * preferred catalog or not
 * We also store the redirect url if the product doesn't exist e.g. m.us.topshop.com/404
 * Therefore the SET_GEOIP_REDIRECT_URL action is only called on PDPs
 */
export const setGeoIPRedirectInfo = (redirectURL) => {
  return { type: 'SET_GEOIP_REDIRECT_URL', redirectURL }
}

/**
 * A product has different URLs in different catalogs
 * e.g.
 * UK - /en/tsuk/product/new-in-this-week-2169932/new-in-fashion-6367514/corduroy-midi-pinafore-dress-8277638
 * FR - /fr/tsfr/produit/nouveautés-415224/nouveautés-mode-6367645/robe-tablier-midi-en-velours-côtelé-8275901
 *
 * Therefore if a French user requests a UK product, we need to check if the
 * product exists in the French catalog and if so we are able to redirect them
 * to that product on the French site.
 * If the product doesn't exist in the French catalog we provide the 404 Not Found page URL.
 */
export const setRedirectURLForPDP = (partNumber) => {
  return (dispatch, getState) => {
    if (process.browser || !partNumber) return
    const state = getState()
    const userGeoPreference = getGeoIPUserISOPreference(state)
    let redirectURL = getRedirectURL(state)
    let queryString = ''

    if (!redirectURL) return Promise.resolve()

    if (redirectURL.includes('?')) {
      ;[redirectURL, queryString] = redirectURL.split('?')
      queryString = `?${queryString}`
    }

    const { config: requestedSiteConfig } = state
    const dontShowGeoIP = requestedSiteConfig.preferredISOs.includes(
      userGeoPreference
    )
    if (dontShowGeoIP) return Promise.resolve()

    return dispatch(get(`/${userGeoPreference}/products/${partNumber}`))
      .then(({ body: { sourceUrl } }) => {
        const path = getPDPURLPath(sourceUrl)
        if (path)
          return dispatch(
            setGeoIPRedirectInfo(`${redirectURL}${path}${queryString}`)
          )

        const error = new Error(
          'Invalid `sourceUrl` returned in foreign PDP response'
        )
        error.sourceUrl = sourceUrl
        throw error
      })
      .catch((err) => {
        error('GeoIP', {
          message: err.message,
          apiUrl: `/${userGeoPreference}/products/${partNumber}`,
          redirectURL,
          queryString,
          sourceUrl: err.sourceUrl,
          request: {
            partNumber,
            iso: userGeoPreference,
          },
          state: {
            geoIPRedirectURL: `${redirectURL}${queryString}`,
          },
        })
        return dispatch(setGeoIPRedirectInfo(`${redirectURL}/404`))
      })
  }
}
