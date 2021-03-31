import {
  isMobileHostname,
  isMobileMainDevHostname,
  isDesktopMainDevHostname,
} from '../../lib/hostname'

/**
 * TODO rename these parts of state to make it clear that hostnames with
 * `isMobileMainDev` are not a subset of those with `isMobile`
 */

export function setHostnameProperties(hostname) {
  const isMobile = isMobileHostname(hostname)
  const isMobileMainDev = isMobileMainDevHostname(hostname)
  const isDesktopMainDev = isDesktopMainDevHostname(hostname)
  return {
    type: 'SET_HOSTNAME_PROPERTIES',
    isMobile,
    isMobileMainDev,
    isDesktopMainDev,
  }
}
