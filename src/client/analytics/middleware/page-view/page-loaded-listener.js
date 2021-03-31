import dataLayer from '../../../../shared/analytics/dataLayer'
import { getBrandCode } from '../../../../shared/selectors/configSelectors'
import { getBuildVersion } from '../../../../shared/selectors/debugSelectors'
import { getFeaturesStatus } from '../../../../shared/selectors/featureSelectors'
import { getViewportMedia } from '../../../../shared/selectors/viewportSelectors'
import { getPageData } from './get-page-data'

export const pageLoadedListener = (action, store) => {
  const state = store.getState()
  const pageData = getPageData(action.payload.pageName, state)

  if (pageData === undefined) {
    return
  }

  const { type, category, ...customData } = pageData
  const upperCaseBrand = getBrandCode(state).toUpperCase()

  const pageType = `${upperCaseBrand}:${type}`
  const pageCategory = `${upperCaseBrand}:${category}`

  dataLayer.push(
    {
      pageType,
      pageCategory,
      buildVersion: getBuildVersion(state),
      features: getFeaturesStatus(state),
      viewport: getViewportMedia(state),
      ...customData,
    },
    'pageSchema',
    'pageView'
  )
}
