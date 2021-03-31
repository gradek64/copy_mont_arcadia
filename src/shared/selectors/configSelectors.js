import { isMobile as isMobileSelector } from './viewportSelectors'
import breakpoints from '../constants/responsive'
import { createSelector } from 'reselect'
import { pathOr, path } from 'ramda'

const MOBILE_MAXIMUM_NUMBER_SIZE_TILE = 8
const DEFAULT_DESKTOP_MAXIMUM_NUMBER_SIZE_TILE = 8

export const selectConfig = (state) => state.config || {}

export const getCurrencySymbol = (state) => {
  const { currencySymbol } = selectConfig(state)
  return currencySymbol
}

export const getSiteDeliveryISOs = (state) =>
  pathOr([], ['config', 'siteDeliveryISOs'], state)

export const getBrandName = createSelector(selectConfig, (config) =>
  path(['brandName'], config)
)

export const getBrandCode = (state) => {
  const { brandCode } = selectConfig(state)

  return brandCode
}

export const getGoogleRecaptchaSiteKey = createSelector(
  selectConfig,
  ({ googleRecaptchaSiteKey }) => googleRecaptchaSiteKey
)

export const getHrefLanguages = (state) => {
  const { hrefLanguages } = selectConfig(state)

  return hrefLanguages
}

export const getLangHostnames = (state) => {
  const { langHostnames } = selectConfig(state)

  return langHostnames
}

export const getThirdPartySiteUrls = (state) => {
  const { thirdPartySiteUrls } = selectConfig(state)

  return thirdPartySiteUrls || {}
}

export const getLogoVersion = (state) => {
  const { logoVersion } = selectConfig(state)

  return logoVersion
}

export const getDefaultLanguage = (state) => {
  const langHostnames = getLangHostnames(state)

  return pathOr(null, ['default', 'defaultLanguage'], langHostnames)
}

export const getBaseUrlPath = (state) => {
  const { storeCode, lang } = selectConfig(state)

  return `/${storeCode}/${lang}`
}

export const getStoreId = (state) => {
  const { siteId } = selectConfig(state)

  return siteId
}

export const getLang = (state) => {
  const { lang } = selectConfig(state)

  return lang || 'en'
}

export const getLanguage = (state) => {
  const { defaultLanguage } = selectConfig(state)

  return defaultLanguage || 'English'
}

export const getLanguageRegion = (state) => {
  const { language } = selectConfig(state)

  return language || 'en-gb'
}

export const getStoreCode = (state) => {
  const { storeCode } = selectConfig(state)

  return storeCode
}

export const getCurrencyCode = (state) => {
  const { currencyCode } = selectConfig(state)

  return currencyCode
}

export const getRegion = (state) => {
  const { region } = selectConfig(state)

  return region || false
}

export const getBrandDisplayName = (state) => {
  const { brandDisplayName } = selectConfig(state)

  return brandDisplayName
}

export const getCountry = (state) => {
  const { country } = selectConfig(state)

  return country
}

export const getDomain = (state) => {
  const { domains } = selectConfig(state)

  return domains
}

const getSocialProofConfig = (state) => selectConfig(state).socialProof || {}

const getSocialProofConfigViews = (state) =>
  getSocialProofConfig(state).views || {}

export const getSocialProofConfigForView = (state, view) => {
  const socialProofConfigViews = getSocialProofConfigViews(state)
  const specifiedConfig = socialProofConfigViews[view]
  const defaultConfig = socialProofConfigViews.default

  return specifiedConfig || defaultConfig || {}
}

export const getDistinctSocialProofConfigs = (state) => {
  const socialProofConfig = getSocialProofConfigViews(state)

  return Object.values(socialProofConfig)
}

export const getSocialProofBannersCMSPageID = (state) => {
  const { bannersCMSPageId } = getSocialProofConfig(state)

  return bannersCMSPageId
}

export const getSiteLocale = path(['config', 'locale'])

export const getSocialProofMaximumPDPMessageViewsPerSession = (state) => {
  const { maximumPDPMessageViewsPerSession } = getSocialProofConfig(state)

  return maximumPDPMessageViewsPerSession
}

export const getStaticAmplienceHost = (state) => {
  const { staticAmplienceHost } = selectConfig(state)

  return staticAmplienceHost
}

export const getShowSingleProductOverlayBannerOnPLP = (state) =>
  getSocialProofConfig(state).showSingleProductOverlayBannerOnPLP || false

export const getMaximumNumberOfSizeTiles = createSelector(
  selectConfig,
  isMobileSelector,
  (config, isMobile) =>
    isMobile
      ? MOBILE_MAXIMUM_NUMBER_SIZE_TILE
      : config.sizeTileMaximumDesktop ||
        DEFAULT_DESKTOP_MAXIMUM_NUMBER_SIZE_TILE
)

export const getStylesheetProps = createSelector(
  [
    (state) => state.config.assets,
    getBrandName,
    (state) => state.features.status.FEATURE_RESPONSIVE,
  ],
  (assets, brandName, featureResponsive) => {
    if (!featureResponsive || !assets.css) return []

    return Object.keys(breakpoints)
      .filter((key) => breakpoints[key].file)
      .map((key) => ({
        rel: 'stylesheet',
        href:
          assets.css[
            key === 'mobile'
              ? `${brandName}/styles.css`
              : `${brandName}/styles-${key}.css`
          ],
        media: `(min-width: ${breakpoints[key].min}px)`,
      }))
  }
)

export const getDressipiBaseUrl = createSelector(selectConfig, (config) =>
  path(['dressipiBaseUrl'], config)
)

export const getPaypalSDKClientId = createSelector(
  selectConfig,
  ({ paypalSDKClientId }) => paypalSDKClientId
)
