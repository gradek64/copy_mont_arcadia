import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { mobileAttBadge, mobileAttBanner } from '../../../lib/products-utils'

// selectors
import {
  getBrandCode,
  getShowSingleProductOverlayBannerOnPLP,
} from '../../../selectors/configSelectors'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isProductTrending } from '../../../selectors/socialProofSelectors'

// components
import SocialProofProductOverlay from '../SocialProofMessaging/SocialProofProductOverlay'
import ProductAttributeBanner from '../ProductAttributeBanner/ProductAttributeBanner'

import {
  ATTRIBUTE_BANNER,
  SOCIAL_PROOF_BANNER,
} from '../../../constants/socialProofConstants'

function getBannersToShow(
  hasAttributeBanner,
  shouldShowSocialProofMessage,
  showSingleProductOverlayBannerOnPLP
) {
  const banners =
    showSingleProductOverlayBannerOnPLP === ATTRIBUTE_BANNER
      ? [ATTRIBUTE_BANNER, SOCIAL_PROOF_BANNER]
      : [SOCIAL_PROOF_BANNER, ATTRIBUTE_BANNER]

  const bannersToShow = banners.filter((el) => {
    if (!hasAttributeBanner && el === ATTRIBUTE_BANNER) {
      return false
    } else if (!shouldShowSocialProofMessage && el === SOCIAL_PROOF_BANNER) {
      return false
    }

    return true
  })

  if (bannersToShow.includes(showSingleProductOverlayBannerOnPLP)) {
    return [showSingleProductOverlayBannerOnPLP]
  }

  return bannersToShow
}

function ProductImagesOverlay({
  isFeatureLogBadAttributeBannersEnabled,
  isFeaturePLPImageOverlayEnabled,
  productUrl,
  isTrending,
  additionalAssets,
  hideTrendingProductLabel,
  brandCode,
  showSingleProductOverlayBannerOnPLP,
}) {
  const shouldShowSocialProofMessage =
    isFeaturePLPImageOverlayEnabled && !hideTrendingProductLabel && isTrending

  // @NOTE using only mobile sizes for banners
  // we treat both image_banners and image_badges as attribute banners
  // however, banners always take precedence
  const attributeBanner =
    additionalAssets.find(mobileAttBanner) ||
    additionalAssets.find(mobileAttBadge)

  const bannersToShow = getBannersToShow(
    !!attributeBanner,
    shouldShowSocialProofMessage,
    showSingleProductOverlayBannerOnPLP
  )

  if (bannersToShow.length) {
    return (
      <div className="AttributeBannersContainer">
        {bannersToShow.includes(SOCIAL_PROOF_BANNER) && (
          <SocialProofProductOverlay brandCode={brandCode} />
        )}
        {bannersToShow.includes(ATTRIBUTE_BANNER) && (
          <ProductAttributeBanner
            src={attributeBanner.url}
            productURL={productUrl}
            isFeatureLogBadAttributeBannersEnabled={
              isFeatureLogBadAttributeBannersEnabled
            }
          />
        )}
      </div>
    )
  }
  return null
}

ProductImagesOverlay.propTypes = {
  isFeatureLogBadAttributeBannersEnabled: PropTypes.bool.isRequired,
  isFeaturePLPImageOverlayEnabled: PropTypes.bool.isRequired,
  productUrl: PropTypes.string.isRequired,
  isTrending: PropTypes.bool.isRequired,
  additionalAssets: PropTypes.array.isRequired,
  hideTrendingProductLabel: PropTypes.bool,
  brandCode: PropTypes.string.isRequired,
  showSingleProductOverlayBannerOnPLP: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
}

ProductImagesOverlay.defaultProps = {
  hideTrendingProductLabel: false,
  showSingleProductOverlayBannerOnPLP: false,
}

export default connect((state, { productId }) => ({
  isTrending: isProductTrending(state, productId, 'PLP'),
  brandCode: getBrandCode(state),
  isFeaturePLPImageOverlayEnabled: isFeatureEnabled(
    state,
    'FEATURE_SOCIAL_PROOF_PLP_IMAGE_OVERLAY'
  ),
  showSingleProductOverlayBannerOnPLP: getShowSingleProductOverlayBannerOnPLP(
    state
  ),
}))(ProductImagesOverlay)
