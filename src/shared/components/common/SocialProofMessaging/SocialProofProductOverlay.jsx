import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSocialProofProductOverlayText } from './SocialProofProductOverlay.string-helpers'
import {
  getBrandCode,
  getSocialProofBannersCMSPageID,
} from '../../../selectors/configSelectors'
import { getImageBannersSocialProof } from '../../../selectors/socialProofSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

const renderResponsiveImage = (images, isMobile) => {
  const imageUrl = isMobile && images.mobile ? images.mobile : images.desktop

  return (
    imageUrl && (
      <img
        className="SocialProofProductOverlay--badgeImage"
        src={imageUrl}
        alt="Trending product"
      />
    )
  )
}

const SocialProofProductOverlay = (
  { brandCode, hasBannerCMSPageID, imageBanners, isMobile },
  { l }
) => {
  if (hasBannerCMSPageID) {
    return (
      <div className="SocialProofProductOverlay">
        {imageBanners &&
          imageBanners.plpBanners &&
          renderResponsiveImage(imageBanners.plpBanners, isMobile)}
      </div>
    )
  }

  return (
    <div className="SocialProofProductOverlay">
      <div className="SocialProofProductOverlay--badgeContainer">
        <div className="SocialProofProductOverlay--badgeText">
          {l(getSocialProofProductOverlayText(brandCode))}
        </div>
      </div>
    </div>
  )
}

SocialProofProductOverlay.contextTypes = {
  l: PropTypes.func,
}

SocialProofProductOverlay.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  brandCode: PropTypes.string.isRequired,
  hasBannerCMSPageID: PropTypes.bool.isRequired,
  imageBanners: PropTypes.shape({
    orderProductBanner: PropTypes.shape({
      desktop: PropTypes.string,
      mobile: PropTypes.string,
    }),
    PLP: PropTypes.shape({
      desktop: PropTypes.string,
      mobile: PropTypes.string,
    }),
  }),
}

export default connect((state) => ({
  isMobile: isMobile(state),
  brandCode: getBrandCode(state),
  hasBannerCMSPageID: !!getSocialProofBannersCMSPageID(state),
  imageBanners: getImageBannersSocialProof(state),
}))(SocialProofProductOverlay)
