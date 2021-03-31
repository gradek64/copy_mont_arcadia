const rootHostnameSelector = (state) => state.hostname || {}

export const isHostnameMobileMainDev = (state) => {
  const { isMobileMainDev } = rootHostnameSelector(state)

  return isMobileMainDev
}

export const isHostnameDesktopMainDev = (state) => {
  const { isDesktopMainDev } = rootHostnameSelector(state)

  return isDesktopMainDev
}
