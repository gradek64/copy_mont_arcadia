import { isSameSiteNoneCompatible } from 'should-send-same-site-none'
import { jsessionidCookieOptions } from './session'

/**
 * Hapi Cookie Options generator including support for SameSite cookie attribute (ref: ADP-2968)
 *
 * @param  {String} userAgent  (e.g.: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
 * @return {Object}             extended jsessionidCookieOptions with SameSite: 'None' instead default SameSite: 'Lax' if userAgent is compatible or base jsessionidCookieOptions otherwise
 */
export function getJsessionidCookieOptions(userAgent) {
  // ADP-3057 introduces a temporary fix so as long as INSECURE_JSESSIONID_DEV_ONLY = 'true'
  // both SameSite and Secure cookie attributes won't be required. This is intended for local
  // dev environments in order to bypass session logout issues due to jsession cookie not being sent
  // through http
  return userAgent &&
    isSameSiteNoneCompatible(userAgent) &&
    process.env.INSECURE_JSESSIONID_DEV_ONLY !== 'true'
    ? {
        ...jsessionidCookieOptions,
        isSameSite: 'None',
        isSecure: true,
      }
    : jsessionidCookieOptions
}
