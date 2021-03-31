import { createSelector } from 'reselect'

import { isTablet, isPortrait } from './viewportSelectors'
import { getBrandCode, getLang } from './configSelectors'
import isForceMobileHeader from './isForceMobileHeader'

export const shouldDisplayMobileHeaderIfSticky = createSelector(
  isTablet,
  isPortrait,
  getLang,
  getBrandCode,
  (tablet, portrait, language, brandCode) =>
    isForceMobileHeader({
      isTablet: tablet,
      isPortrait: portrait,
      language,
      brandCode,
    })
)

const rootSelector = (state) => state.pageHeader || {}

export const isHeaderSticky = (state) => {
  const { sticky } = rootSelector(state)

  return Boolean(sticky)
}
