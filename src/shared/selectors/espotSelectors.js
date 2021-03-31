import { path, pathOr } from 'ramda'
import { shouldInvertHeaderEspotPositions } from './brandConfigSelectors'
import espotsDesktopConstants from '../constants/espotsDesktop'
import {
  isFeatureCFSIEnabled,
  isFeatureShowCFSIEspotEnabled,
} from './featureSelectors'
import { createSelector } from 'reselect'

const getEspotCMSData = (state) => pathOr({}, ['espot', 'cmsData'], state)

export const getResponsiveCMSUrl = (state, identifier) =>
  path([identifier, 'responsiveCMSUrl'], getEspotCMSData(state))

export const getBrandHeaderEspotName = (state) =>
  shouldInvertHeaderEspotPositions(state)
    ? espotsDesktopConstants.navigation.global
    : espotsDesktopConstants.navigation.brandHeader

export const getGlobalEspotName = (state) =>
  shouldInvertHeaderEspotPositions(state)
    ? espotsDesktopConstants.navigation.brandHeader
    : espotsDesktopConstants.navigation.global

/*
* TODO consider replacing this with a more robust solution
* this is currently needed for PLP espots
*/
export const getProductListEspots = createSelector([getEspotCMSData], (data) =>
  Object.entries(data)
    .filter(
      ([key, value]) =>
        key.startsWith('productList') && value.responsiveCMSUrl !== ''
    )
    .map(([key, value]) => ({
      ...value,
      identifier: key,
    }))
)

// CFS = collect from store
export const isCFSIEspotEnabled = (state) =>
  isFeatureCFSIEnabled(state) && isFeatureShowCFSIEspotEnabled(state)

export const abandonmentEspotErrored = (state) =>
  path(['espot', 'errors', 'abandonmentModalError'], state)
