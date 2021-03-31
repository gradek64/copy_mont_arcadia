import createReducer from '../../lib/create-reducer'

/**
 * TODO rename these parts of state to make it clear that hostnames with
 * `isMobileMainDev` are not a subset of those with `isMobile`
 */

export default createReducer(
  {
    isMobile: false,
    isMobileMainDev: false,
    isDesktopMainDev: false,
  },
  {
    SET_HOSTNAME_PROPERTIES: (
      state,
      { isMobile, isMobileMainDev, isDesktopMainDev }
    ) => ({
      ...state,
      isMobile,
      isMobileMainDev,
      isDesktopMainDev,
    }),
  }
)
