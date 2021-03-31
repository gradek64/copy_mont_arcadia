import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SocialProofCarouselOverlay from '../SocialProofMessaging/SocialProofCarouselOverlay'
import { connect } from 'react-redux'
import { exceedsMaxSocialProofViewCount } from '../../../lib/social-proof-utils'

import { getTrendingProducts } from '../../../actions/common/socialProofActions'
import { isMobile } from './../../../selectors/viewportSelectors'
import { getSocialProofMaximumPDPMessageViewsPerSession } from '../../../selectors/configSelectors'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isProductTrending } from '../../../selectors/socialProofSelectors'

@connect(
  (state, { productId }) => ({
    maximumPDPMessageViewsPerSession: getSocialProofMaximumPDPMessageViewsPerSession(
      state
    ),
    isFeatureSocialProofCarouselOverlayEnabled: isFeatureEnabled(
      state,
      'FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY'
    ),
    isTrending: isProductTrending(state, productId, 'PDP'),
    isMobile: isMobile(state),
  }),
  { getTrendingProducts }
)
class CarouselImagesOverlay extends PureComponent {
  static contextTypes = {
    l: PropTypes.func,
  }

  static propTypes = {
    isFeatureSocialProofCarouselOverlayEnabled: PropTypes.bool.isRequired,
    isTrending: PropTypes.bool,
    getTrendingProducts: PropTypes.func,
    isMobile: PropTypes.bool,
    maximumPDPMessageViewsPerSession: PropTypes.number,
  }

  componentDidMount() {
    this.props.getTrendingProducts('PDP')
  }

  render() {
    const {
      isFeatureSocialProofCarouselOverlayEnabled,
      isTrending,
      productId,
      isMobile,
      maximumPDPMessageViewsPerSession,
    } = this.props
    const { l } = this.context

    const isNotOverMaxSocialProofViewCount = !exceedsMaxSocialProofViewCount(
      'PDP',
      maximumPDPMessageViewsPerSession
    )

    const showSocialProof =
      isFeatureSocialProofCarouselOverlayEnabled &&
      isTrending &&
      isNotOverMaxSocialProofViewCount

    const showDoubleTapMessage = !showSocialProof && isMobile

    return (
      <div className="CarouselImagesOverlay">
        {showSocialProof && (
          <SocialProofCarouselOverlay
            carouselName={name}
            productId={productId}
          />
        )}
        {showDoubleTapMessage && (
          <div className="Carousel-tapMessage" aria-hidden="true">
            {l`Double tap for large view`}
          </div>
        )}
      </div>
    )
  }
}

export default CarouselImagesOverlay
