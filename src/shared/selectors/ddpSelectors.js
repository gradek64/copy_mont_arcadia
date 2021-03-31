import { createSelector } from 'reselect'
import { pathOr, path } from 'ramda'
import { localise } from '../lib/localisation'
import { boolToString } from '../analytics/analytics-utils'
import { bagContainsDDPProduct } from './shoppingBagSelectors'
import {
  isFeatureDDPPromoEnabled,
  isFeatureDDPEnabled,
  isFeatureDDPActiveBannerEnabled,
  isFeatureDDPRenewable,
} from './featureSelectors'
import { getUser, getUserTrackingId } from './common/accountSelectors'

import {
  getCheckoutOrderSummaryProducts,
  getCheckoutOrderLines,
  getCheckoutOrderSummaryBasket,
  getCheckoutOrderCompleted,
} from './checkoutSelectors'
import { getDDPProduct, getDDPDefaultSku } from './siteOptionsSelectors'
import {
  getLanguageRegion,
  getBrandDisplayName,
  getBrandName,
} from './configSelectors'

export const getDDPDefaultName = (state) => {
  const ddpProduct = getDDPProduct(state) || {}
  return path(['name'], ddpProduct) || 'DDP Subscription'
}

export const getDDPProductName = (state) => {
  const ddpSku = getDDPDefaultSku(state)
  return (
    ddpSku.name ||
    localise(
      getLanguageRegion(state),
      getBrandDisplayName(state),
      'DDP Subscription'
    )
  )
}

const getDDPPropsFromUser = (user) => ({
  isDDPUser: user.isDDPUser,
  ddpEndDate: user.ddpEndDate,
  isDDPRenewable: user.isDDPRenewable,
  ddpStartDate: user.ddpStartDate,
  wasDDPUser: user.wasDDPUser,
  ddpCurrentOrderCount: user.ddpCurrentOrderCount,
  ddpPreviousOrderCount: user.ddpPreviousOrderCount,
  ddpCurrentSaving: user.ddpCurrentSaving,
  ddpPreviousSaving: user.ddpPreviousSaving,
  ddpStandardPrice: user.ddpStandardPrice,
  ddpExpressDeliveryPrice: user.ddpExpressDeliveryPrice,
})

export const ddpLogoSrc = createSelector(
  getBrandName,
  (brandName) => `/assets/${brandName}/images/ddp-icon.svg`
)

export const ddpAddedLogoSrc = createSelector(
  getBrandName,
  (brandName) => `/assets/${brandName}/images/ddp-added.gif`
)

const ddpBrandIcons = {
  burton: '/ddp-icon-white.svg',
  dorothyperkins: '/ddp-icon-white.svg',
  missselfridge: '/ddp-icon-white.svg',
}

export const ddpActiveLogoSrc = createSelector(getBrandName, (brandName) => {
  const fileName = ddpBrandIcons[brandName] || '/ddp-icon.svg'
  return `/assets/${brandName}/images${fileName}`
})

export const getDDPProps = createSelector(getUser, getDDPPropsFromUser)

export const isDDPUser = createSelector(
  getDDPProps,
  ({ isDDPUser }) => isDDPUser
)

export const ddpEndDate = createSelector(
  getDDPProps,
  ({ ddpEndDate }) => ddpEndDate
)

export const isDDPRenewable = createSelector(
  getDDPProps,
  ({ isDDPRenewable }) => isDDPRenewable
)

export const ddpStartDate = createSelector(
  getDDPProps,
  ({ ddpStartDate }) => ddpStartDate
)

export const wasDDPUser = createSelector(
  getDDPProps,
  ({ wasDDPUser }) => wasDDPUser
)

export const ddpCurrentOrderCount = createSelector(
  getDDPProps,
  ({ ddpCurrentOrderCount }) => ddpCurrentOrderCount
)

export const ddpPreviousOrderCount = createSelector(
  getDDPProps,
  ({ ddpPreviousOrderCount }) => ddpPreviousOrderCount
)

export const ddpCurrentSaving = createSelector(
  getDDPProps,
  ({ ddpCurrentSaving }) => ddpCurrentSaving
)

export const ddpPreviousSaving = createSelector(
  getDDPProps,
  ({ ddpPreviousSaving }) => ddpPreviousSaving
)

export const ddpStandardPrice = createSelector(
  getDDPProps,
  ({ ddpStandardPrice }) => ddpStandardPrice
)

export const ddpExpressDeliveryPrice = createSelector(
  getDDPProps,
  ({ ddpExpressDeliveryPrice }) => ddpExpressDeliveryPrice
)

/* User is expiring (within next 30 days) */
export const isDDPUserInPreExpiryWindow = createSelector(
  isDDPUser,
  isDDPRenewable,
  (hasDDP, isRenewable) => hasDDP && isRenewable
)

/* User has expired (within last 30 days) */
export const isDDPRenewablePostWindow = createSelector(
  isDDPUser,
  isDDPRenewable,
  (hasDDP, isRenewable) => !hasDDP && isRenewable
)

/* user had DDP but it has expired */
export const hasDDPExpired = createSelector(
  isDDPUser,
  wasDDPUser,
  (hasDDP, hadDDP) => !hasDDP && hadDDP
)

export const hasDDPExpiredAndIsDDPRenewalDisabled = createSelector(
  hasDDPExpired,
  isFeatureDDPRenewable,
  (ddpExpired, ddpIsRenewable) => ddpExpired && !ddpIsRenewable
)

/* User has more than 30 days left before DDP expires */
export const isDDPActiveUserPreRenewWindow = createSelector(
  isDDPUser,
  isDDPRenewable,
  (hasDDP, isRenewable) => hasDDP && !isRenewable
)

/* User has never had DDP */
export const userHasNeverHadDDP = createSelector(
  isDDPUser,
  wasDDPUser,
  (hasDDP, hadDDP) => !hasDDP && !hadDDP
)

export const ddpRenewalEnabled = createSelector(
  isFeatureDDPEnabled,
  isFeatureDDPRenewable,
  (enabled, renewable) => enabled && renewable
)

/**
 * User is eligible to renew DDP, because they had it previously or
 * is now in the renewable window. This will only return true
 * if FETAURE_IS_DDP_RENEWABLE is switched on
 */
export const userCanRenewDDP = createSelector(
  ddpRenewalEnabled, // if the feature flag on
  hasDDPExpired, // true if isDDPUser is false, wasDDPUser is true
  isDDPUserInPreExpiryWindow, // true if isDDPUser is true and isDDPRenewable is true
  (renewalEnabled, isExpired, isExpiring) =>
    renewalEnabled && (isExpired || isExpiring)
)

/**
 * allow expired ddp users to see ddp promo if brand hasn't
 * enabled FEATURE_IS_DDP_RENEWABLE flag yet, but hide it if
 * feature is enabled and user is in renewable window.
 * Users who have never had ddp should also see the ddp promo
 */
export const showDDPPromo = createSelector(
  userCanRenewDDP,
  hasDDPExpiredAndIsDDPRenewalDisabled,
  userHasNeverHadDDP,
  (canRenew, expiredAndNotRenewable, neverHadDDP) =>
    !canRenew && (expiredAndNotRenewable || neverHadDDP)
)

export const isCurrentOrRecentDDPSubscriber = createSelector(
  isDDPUser,
  wasDDPUser,
  (hasDDP, hadDDP) => hasDDP || hadDDP
)

/* Does the order contain a ddp */
export const isDDPOrder = createSelector(
  getCheckoutOrderSummaryBasket,
  (basket) => pathOr(false, ['isDDPOrder'], basket)
)

/**
 * Selector function that checks if the DDPUser is able or not to renew/extend the DDP service.
 * For this to return true the user must not have the ddpProduct in the shopping bag.
 * The default expiring boundaries are set up in WCS and these are, 30 days prior and 30 days post DDP service expires.
 * During this period of time the 'isDDPRenewable' propery on the user object returned by WCS will be true.
 * This function will still return true indefinitely even when 'isDDPRenewable' is equal to false but 'wasDDPUser' is equal to true.
 * For this to return true 'FEATURE_DDP' and 'FEATURE_IS_DDP_RENEWABLE' need to be on too.
 * @returns {boolean}
 */
export const showDDPRenewal = (state) =>
  createSelector(
    bagContainsDDPProduct,
    userCanRenewDDP,
    (withDDPProduct, canRenew) => !withDDPProduct && canRenew
  )(state)

/* user can renew ddp and has added it to the order */
export const isRenewingDDP = (state) =>
  createSelector(
    bagContainsDDPProduct,
    userCanRenewDDP,
    (withDDPProduct, canRenew) => withDDPProduct && canRenew
  )(state)

export const showActiveDDP = createSelector(
  isDDPUser,
  isFeatureDDPRenewable,
  (hasDDP, isFeatureDDPRenewableOn) => hasDDP && isFeatureDDPRenewableOn
)

export const isDDPOrderCompleted = createSelector(
  getCheckoutOrderCompleted,
  (orderComplete) => pathOr(false, ['isDDPOrder'], orderComplete)
)

export const isDDPPromotionEnabled = createSelector(
  isFeatureDDPPromoEnabled,
  isDDPOrder,
  isDDPActiveUserPreRenewWindow,
  (isFeatureDDPPromoEnabled, isDDPOrder, isPreRenew) =>
    isFeatureDDPPromoEnabled && !(isDDPOrder || isPreRenew)
)

export const isDDPStandaloneOrder = createSelector(
  isDDPOrder,
  getCheckoutOrderSummaryProducts,
  (isDDPOrder, orderSummaryProducts) => {
    return isDDPOrder && orderSummaryProducts.length === 1
  }
)

export const isDDPStandaloneOrderCompleted = createSelector(
  isDDPOrderCompleted,
  getCheckoutOrderLines,
  (isDDPOrderCompleted, orderCompletedProducts) => {
    return isDDPOrderCompleted && orderCompletedProducts.length === 1
  }
)

export const isOrderDDPEligible = createSelector(
  isDDPUser,
  isDDPOrder,
  (userHasDDP, orderHasDDP) => userHasDDP || orderHasDDP
)

export const isDDPActiveBannerEnabled = createSelector(
  isFeatureDDPEnabled,
  isFeatureDDPActiveBannerEnabled,
  isDDPActiveUserPreRenewWindow,
  (ddpEnabled, bannerEnabled, userIsPreRenew) =>
    ddpEnabled && bannerEnabled && userIsPreRenew
)

export const ddpSavingsValue = createSelector(
  isDDPUser,
  ddpCurrentSaving,
  ddpPreviousSaving,
  (userHasDDP, currentSaving, previousSaving) =>
    +(userHasDDP ? currentSaving : previousSaving) || 0
)

export const showDDPSavings = createSelector(
  ddpSavingsValue,
  (savingsValue) => savingsValue >= 5
)

export const getDDPUserAnalyticsProperties = createSelector(
  getUserTrackingId,
  getDDPProps,
  (hasTrackingId, ddpUserProperties) => {
    return hasTrackingId
      ? {
          isDDPUser: boolToString(ddpUserProperties.isDDPUser),
          wasDDPUser: boolToString(ddpUserProperties.wasDDPUser),
          isDDPRenewable: boolToString(ddpUserProperties.isDDPRenewable),
          ddpStartDate: ddpUserProperties.ddpStartDate,
          ddpEndDate: ddpUserProperties.ddpEndDate,
          ddpCurrentOrderCount: ddpUserProperties.ddpCurrentOrderCount,
          ddpPreviousOrderCount: ddpUserProperties.ddpPreviousOrderCount,
        }
      : {}
  }
)

/**
 * Selector function that checks if the DDPUser is within the default expiring boundaries.
 * For this to return true 'FEATURE_DDP' and 'FEATURE_IS_DDP_RENEWABLE' need to be on and
 * ddpProduct must not be in the shoping bag.
 * The default expiring boundaries are set up in WCS and these are, 30 days prior and 30 days post DDP service expires.
 * During this period of time the 'isRenewable' propery on the user object returned by WCS will be true.
 * @returns {boolean}
 * @NOTE please refer to this on Jira ticket number ADP-3285.
 */
export const showDDPRenewalWithinDefaultExpiringBoundaries = (state) =>
  createSelector(
    ddpRenewalEnabled,
    isDDPRenewable,
    bagContainsDDPProduct,
    (renewalEnabled, canRenew, withDDPProduct) =>
      renewalEnabled && canRenew && !withDDPProduct
  )(state)
