import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSocialProofBannersCMSPageID } from '../../../selectors/configSelectors'
import { getImageBannersSocialProof } from '../../../selectors/socialProofSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

const renderResponsiveImage = (images, isMobile) => {
  const imageUrl = isMobile && images.mobile ? images.mobile : images.desktop

  return (
    imageUrl && (
      <img
        className="SocialProofOrderProductBadge--sellingFastImage"
        src={imageUrl}
        alt="Trending product"
      />
    )
  )
}

const SocialProofOrderProductBadge = ({
  hasBannerCMSPageID,
  imageBanners,
  isMobile,
}) => {
  if (hasBannerCMSPageID) {
    return (
      <div className="SocialProofOrderProductBadge">
        {imageBanners &&
          imageBanners.orderProductBanners &&
          renderResponsiveImage(imageBanners.orderProductBanners, isMobile)}
      </div>
    )
  }

  return (
    <div className="SocialProofOrderProductBadge">
      <div className="SocialProofOrderProductBadge--sellingFast" />
    </div>
  )
}

SocialProofOrderProductBadge.propTypes = {
  isMobile: PropTypes.bool.isRequired,
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
  hasBannerCMSPageID: !!getSocialProofBannersCMSPageID(state),
  imageBanners: getImageBannersSocialProof(state),
}))(SocialProofOrderProductBadge)
