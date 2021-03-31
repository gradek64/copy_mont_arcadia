/**
 * Given a hostname string it returns true if the hostname starts with "m." or "local.m."
 * false otherwise.
 *
 * @param {String} hostname
 * @return {Boolean}
 */
export function isMobileHostname(hostname) {
  return (
    typeof hostname === 'string' &&
    (hostname.startsWith('m.') || hostname.startsWith('local.m.'))
  )
}

const desktopMainDevDomain = 'arcadiagroup.ltd.uk'
const mobileMainDevDomain = 'digital.arcadiagroup.co.uk'

export const isDesktopMainDevHostname = (hostname) =>
  hostname.includes(`.${desktopMainDevDomain}`)

export const isMobileMainDevHostname = (hostname) =>
  hostname.includes(`.${mobileMainDevDomain}`)
