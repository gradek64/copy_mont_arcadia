const rootSelector = (state) => state.features || {}

export const getFeaturesStatus = (state) => {
  const { status } = rootSelector(state)

  return status || {}
}

export const isFeatureEnabled = (state, key) => getFeaturesStatus(state)[key]

const socialProofFeatureFlagsForView = {
  PLP: [
    'FEATURE_SOCIAL_PROOF_PLP_META_LABEL',
    'FEATURE_SOCIAL_PROOF_PLP_IMAGE_OVERLAY',
  ],
  PDP: ['FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY'],
  minibag: ['FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'],
  checkout: ['FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE'],
}

export const isFeatureSocialProofEnabled = (state) =>
  Object.values(socialProofFeatureFlagsForView).some((featureFlags) => {
    return featureFlags.some((featureFlag) =>
      isFeatureEnabled(state, featureFlag)
    )
  })

export const isFeatureSocialProofEnabledForView = (state, view) =>
  socialProofFeatureFlagsForView[view].some((featureFlag) =>
    isFeatureEnabled(state, featureFlag)
  )

export const isFeatureStickyHeaderEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_STICKY_HEADER')

const getCFSIStatus = (state) => isFeatureEnabled(state, 'FEATURE_CFSI')

export const isFeatureCFSIEnabled = (state) => !!getCFSIStatus(state)

export const isFeatureShowCFSIEspotEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_SHOW_CFSI_PDP_ESPOT')

export const isFeatureCFSEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CFS')

export const isFeaturePUDOEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PUDO')

export const isFeatureWishlistEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_WISHLIST')

export const isFeatureFindInStoreEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_FIND_IN_STORE')

export const isCookieManagerEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_COOKIE_MANAGER')

export const isFeatureSavePaymentDetailsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_SAVE_PAYMENT_DETAILS')

export const isFeatureTransferBasketEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_TRANSFER_BASKET')

export const isFeatureAddressBookEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_ADDRESS_BOOK')

export const isFeatureQubitHiddenEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_QUBIT_HIDDEN')

export const isFeatureCarouselThumbnailEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PRODUCT_CAROUSEL_THUMBNAIL')

export const isFeatureDesktopResetPasswordEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DESKTOP_RESET_PASSWORD')

export const isAmplienceFeatureEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_USE_AMPLIENCE')

export const isFeatureDDPEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DDP')

export const isFeatureDDPPromoEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DISPLAY_DDP_PROMOTION')

export const isFeatureDDPActiveBannerEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DDP_IS_ACTIVE_BANNER')

export const getFeaturesKeepAlive = (state) =>
  isFeatureEnabled(state, 'FEATURE_KEEP_ALIVE')

export const isFeatureUnifiedLoginRegisterEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_UNIFIED_LOGIN_REGISTER')

export const isFeatureHomePageSegmentationEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_HOME_PAGE_SEGMENTATION')

export const isFeatureLogBadAttributeBannersEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_LOG_BAD_ATTRIBUTE_BANNERS')

export const isFeatureRememberMeEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_REMEMBER_ME')

export const isFeatureSendClientInfoToServer = (state) =>
  isFeatureEnabled(state, 'FEATURE_SEND_CLIENT_INFO_TO_SERVER')

export const isFeatureRealTimeStockEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_REAL_TIME_STOCK')

export const isFeatureEnableGeoIPDesktopPixelRequest = (state) =>
  isFeatureEnabled(state, 'FEATURE_ENABLE_GEOIP_DESKTOP_PIXEL_REQUEST')

export const isFeatureBazaarVoiceEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_BAZAARVOICE')

export const isFeatureSendClientErrorToServer = (state) =>
  isFeatureEnabled(state, 'FEATURE_SEND_CLIENT_ERROR_TO_SERVER')

export const isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_MEGANAV_TOP_LEVEL_LINKS_NO_REDIRECTIONURL')

export const isFeatureHttpsCanonicalEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_HTTPS_CANONICAL')

export const isPersonalisedEspotsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PERSONALISED_ESPOTS')

export const isFeatureMyPreferencesEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_MY_PREFERENCES')

export const isFeaturePOCWebchatHackEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_POC_WEBCHAT_HACK')

export const isFeatureHasDiscountTextEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_BAG_SHOWS_DISCOUNT_TEXT')

// PSD2 = Payment Services Directive v2, an EU directive
export const isFeaturePSD2PunchoutPopupEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PSD2_PUNCHOUT_POPUP')

// 3DS2 = 3D Secure v2
export const isFeaturePSD2ThreeDSecure2Enabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PSD2_3DS2')

export const isFeatureOrderReturnsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_ORDER_RETURNS')

export const isFeatureTrackMyOrdersEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_TRACK_ORDERS')

export const isFeatureEspotHeaderHomepageEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_ESPOT_HEADER_HOMEPAGE')

export const isFeatureDeferCmsContentEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DEFER_CMS_CONTENT')

export const isFeatureAddItem3 = (state) =>
  isFeatureEnabled(state, 'FEATURE_ADD_ITEM_3')

export const isFeatureStoreLocatorGpsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_STORE_LOCATOR_GPS')

export const isFeatureYextEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_YEXT')

export const isDynamicTitle = (state) =>
  isFeatureEnabled(state, 'FEATURE_PLP_DYNAMIC_TITLE')

export const isFeatureBrandlockEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_BRANDLOCK')

export const isFeatureCategoryHeaderShowMoreEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CATEGORY_HEADER_SHOW_MORE')

export const isFeatureCategoryHeaderShowMoreDesktopEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CATEGORY_HEADER_SHOW_MORE_DESKTOP')

export const isFeatureCategoryHeaderShowMoreMobileEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CATEGORY_HEADER_SHOW_MORE_MOBILE')

export const isFeaturePdpQuantity = (state) =>
  isFeatureEnabled(state, 'FEATURE_PDP_QUANTITY')

export const isFeaturePaypalSmartButtonsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PAYPAL_SMART_BUTTONS')

export const isFeaturePriceSavingEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PDP_SAVING')

export const isFeatureMobileCheckoutEspotEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_MOBILE_CHECKOUT_ESPOT')

export const isFeatureGuestCheckoutEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_GUEST_CHECKOUT')

export const isFeatureCrossSellLinksEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CROSS_SELL_LINKS')

export const isFeatureDDPRenewable = (state) =>
  isFeatureEnabled(state, 'FEATURE_IS_DDP_RENEWABLE')

export const isFeatureDressipiRecommendationsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_DRESSIPI_RECOMMENDATIONS')

export const isFeatureGuestRecaptchaEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_GUEST_RECAPTCHA')

export const isFeaturePLPMobileEspotEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_PLP_MOBILE_ESPOT')

export const isFeatureApplePayEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_APPLE_PAY')

export const isFeatureClearPayEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_CLEAR_PAY')

export const isFeatureBnplPaymentsBreakdownPdp = (state) =>
  isFeatureEnabled(state, 'FEAUTRE_BNPL_PAYMENTS_BREAKDOWN_PDP')

export const isFeatureGiftCardsEnabled = (state) =>
  isFeatureEnabled(state, 'FEATURE_GIFT_CARDS')
