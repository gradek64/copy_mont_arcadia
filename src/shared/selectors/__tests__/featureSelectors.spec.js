import {
  getFeaturesStatus,
  isFeatureCFSIEnabled,
  isFeatureShowCFSIEspotEnabled,
  isFeaturePUDOEnabled,
  isFeatureSavePaymentDetailsEnabled,
  isFeatureTransferBasketEnabled,
  isFeatureWishlistEnabled,
  isFeatureFindInStoreEnabled,
  isCookieManagerEnabled,
  isFeatureAddressBookEnabled,
  isFeatureQubitHiddenEnabled,
  isFeatureCarouselThumbnailEnabled,
  isFeatureDesktopResetPasswordEnabled,
  isFeatureStickyHeaderEnabled,
  isAmplienceFeatureEnabled,
  isFeatureDDPEnabled,
  isFeatureDDPPromoEnabled,
  isFeatureDDPActiveBannerEnabled,
  isFeatureHomePageSegmentationEnabled,
  isFeatureRememberMeEnabled,
  isFeatureRealTimeStockEnabled,
  isFeatureEnabled,
  isFeatureSocialProofEnabled,
  isFeatureSocialProofEnabledForView,
  isFeatureHasDiscountTextEnabled,
  isFeaturePSD2PunchoutPopupEnabled,
  isFeaturePSD2ThreeDSecure2Enabled,
  isFeatureOrderReturnsEnabled,
  isFeatureTrackMyOrdersEnabled,
  isFeatureEspotHeaderHomepageEnabled,
  isFeatureDeferCmsContentEnabled,
  isFeatureStoreLocatorGpsEnabled,
  isFeatureBrandlockEnabled,
  isFeatureCategoryHeaderShowMoreEnabled,
  isFeatureCategoryHeaderShowMoreDesktopEnabled,
  isFeatureCategoryHeaderShowMoreMobileEnabled,
  isFeaturePaypalSmartButtonsEnabled,
  isFeaturePriceSavingEnabled,
  isFeatureCrossSellLinksEnabled,
  isFeatureDDPRenewable,
  isFeatureDressipiRecommendationsEnabled,
  isFeatureGuestRecaptchaEnabled,
  isFeaturePLPMobileEspotEnabled,
  isFeatureApplePayEnabled,
  isFeatureClearPayEnabled,
  isFeatureBnplPaymentsBreakdownPdp,
  isFeatureGiftCardsEnabled,
} from '../featureSelectors'

describe('Feature selectors', () => {
  const selectors = {
    FEATURE_CFSI: isFeatureCFSIEnabled,
    FEATURE_SHOW_CFSI_PDP_ESPOT: isFeatureShowCFSIEspotEnabled,
    FEATURE_PUDO: isFeaturePUDOEnabled,
    FEATURE_SAVE_PAYMENT_DETAILS: isFeatureSavePaymentDetailsEnabled,
    FEATURE_TRANSFER_BASKET: isFeatureTransferBasketEnabled,
    FEATURE_WISHLIST: isFeatureWishlistEnabled,
    FEATURE_FIND_IN_STORE: isFeatureFindInStoreEnabled,
    FEATURE_COOKIE_MANAGER: isCookieManagerEnabled,
    FEATURE_ADDRESS_BOOK: isFeatureAddressBookEnabled,
    FEATURE_QUBIT_HIDDEN: isFeatureQubitHiddenEnabled,
    FEATURE_PRODUCT_CAROUSEL_THUMBNAIL: isFeatureCarouselThumbnailEnabled,
    FEATURE_DESKTOP_RESET_PASSWORD: isFeatureDesktopResetPasswordEnabled,
    FEATURE_STICKY_HEADER: isFeatureStickyHeaderEnabled,
    FEATURE_USE_AMPLIENCE: isAmplienceFeatureEnabled,
    FEATURE_DDP: isFeatureDDPEnabled,
    FEATURE_DISPLAY_DDP_PROMOTION: isFeatureDDPPromoEnabled,
    FEATURE_DDP_IS_ACTIVE_BANNER: isFeatureDDPActiveBannerEnabled,
    FEATURE_HOME_PAGE_SEGMENTATION: isFeatureHomePageSegmentationEnabled,
    FEATURE_REMEMBER_ME: isFeatureRememberMeEnabled,
    FEATURE_REAL_TIME_STOCK: isFeatureRealTimeStockEnabled,
    FEATURE_BAG_SHOWS_DISCOUNT_TEXT: isFeatureHasDiscountTextEnabled,
    FEATURE_PSD2_PUNCHOUT_POPUP: isFeaturePSD2PunchoutPopupEnabled,
    FEATURE_PSD2_3DS2: isFeaturePSD2ThreeDSecure2Enabled,
    FEATURE_ORDER_RETURNS: isFeatureOrderReturnsEnabled,
    FEATURE_TRACK_ORDERS: isFeatureTrackMyOrdersEnabled,
    FEATURE_ESPOT_HEADER_HOMEPAGE: isFeatureEspotHeaderHomepageEnabled,
    FEATURE_DEFER_CMS_CONTENT: isFeatureDeferCmsContentEnabled,
    FEATURE_STORE_LOCATOR_GPS: isFeatureStoreLocatorGpsEnabled,
    FEATURE_BRANDLOCK: isFeatureBrandlockEnabled,
    FEATURE_CATEGORY_HEADER_SHOW_MORE: isFeatureCategoryHeaderShowMoreEnabled,
    FEATURE_CATEGORY_HEADER_SHOW_MORE_DESKTOP: isFeatureCategoryHeaderShowMoreDesktopEnabled,
    FEATURE_CATEGORY_HEADER_SHOW_MORE_MOBILE: isFeatureCategoryHeaderShowMoreMobileEnabled,
    FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE: isFeatureSocialProofEnabled,
    FEATURE_SOCIAL_PROOF_MINIBAG_BADGE: isFeatureSocialProofEnabled,
    FEATURE_SOCIAL_PROOF_PLP_IMAGE_OVERLAY: isFeatureSocialProofEnabled,
    FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY: isFeatureSocialProofEnabled,
    FEATURE_SOCIAL_PROOF_PLP_META_LABEL: isFeatureSocialProofEnabled,
    FEATURE_PAYPAL_SMART_BUTTONS: isFeaturePaypalSmartButtonsEnabled,
    FEATURE_PDP_SAVING: isFeaturePriceSavingEnabled,
    FEATURE_CROSS_SELL_LINKS: isFeatureCrossSellLinksEnabled,
    FEATURE_IS_DDP_RENEWABLE: isFeatureDDPRenewable,
    FEATURE_DRESSIPI_RECOMMENDATIONS: isFeatureDressipiRecommendationsEnabled,
    FEATURE_GUEST_RECAPTCHA: isFeatureGuestRecaptchaEnabled,
    FEATURE_PLP_MOBILE_ESPOT: isFeaturePLPMobileEspotEnabled,
    FEATURE_APPLE_PAY: isFeatureApplePayEnabled,
    FEATURE_CLEAR_PAY: isFeatureClearPayEnabled,
    FEAUTRE_BNPL_PAYMENTS_BREAKDOWN_PDP: isFeatureBnplPaymentsBreakdownPdp,
    FEATURE_GIFT_CARDS: isFeatureGiftCardsEnabled,
  }

  const createStoreWithFeatureFlag = (feature, enabled = true) => ({
    features: {
      status: {
        [feature]: enabled,
      },
    },
  })

  describe('getFeaturesStatus()', () => {
    it('should return the full features status object', () => {
      const mockStatus = Object.freeze({ foo: 'bar' })
      expect(getFeaturesStatus({ features: { status: mockStatus } })).toBe(
        mockStatus
      )
    })
  })

  describe('isFeatureEnabled', () => {
    it('should return true if the experience passed is enabled', () => {
      const state = createStoreWithFeatureFlag('TEST_FEAUTURE_FLAG')

      expect(isFeatureEnabled(state, 'TEST_FEAUTURE_FLAG')).toEqual(true)
    })

    it('should return false if the experience passed is not enabled', () => {
      const state = createStoreWithFeatureFlag('TEST_FEAUTURE_FLAG', false)

      expect(isFeatureEnabled(state, 'TEST_FEAUTURE_FLAG')).toEqual(false)
    })

    it('should return undefined if the experience passed is not in the list', () => {
      const state = createStoreWithFeatureFlag('TEST_FEAUTURE_FLAG')

      expect(isFeatureEnabled(state, 'TEST_FEAUTURE_FLAG_2')).toEqual(undefined)
    })
  })

  describe('isFeatureSocialProofEnabledForView', () => {
    it('should return true if one of the PLP feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_PLP_META_LABEL'),
          'PLP'
        )
      ).toBe(true)
    })

    it('should return false if none of the PLP feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'),
          'PLP'
        )
      ).toBe(false)
    })

    it('should return true if one of the PDP feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY'),
          'PDP'
        )
      ).toBe(true)
    })

    it('should return false if none of the PDP feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'),
          'PDP'
        )
      ).toBe(false)
    })

    it('should return true if one of the minibag feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'),
          'minibag'
        )
      ).toBe(true)
    })

    it('should return false if none of the minibag feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY'),
          'minibag'
        )
      ).toBe(false)
    })

    it('should return true if one of the checkout feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE'),
          'checkout'
        )
      ).toBe(true)
    })

    it('should return false if none of the checkout feature flag is enabled', () => {
      expect(
        isFeatureSocialProofEnabledForView(
          createStoreWithFeatureFlag('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'),
          'checkout'
        )
      ).toBe(false)
    })
  })

  Object.entries(selectors).forEach(([feature, selector]) => {
    describe(feature, () => {
      it('should return true', () => {
        expect(selector(createStoreWithFeatureFlag(feature))).toBe(true)
      })
      it('should return false', () => {
        expect(selector(createStoreWithFeatureFlag(feature, false))).toBe(false)
      })
    })
  })
})
