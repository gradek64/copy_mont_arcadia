import React from 'react'
import PropTypes from 'prop-types'
import Image from '../../../../../../shared/components/common/Image/Image'

const ActiveDDPBanner = ({ ddpProductName, brandName }) => {
  // The brands in the array below use a different version of the DDP logo
  // when displaying the isActive message in the Delivery Type
  const brandWithWhiteLogo = ['burton', 'dorothyperkins', 'missselfridge']
  const iconName = brandWithWhiteLogo.includes(brandName)
    ? 'ddp-icon-white.svg'
    : 'ddp-icon.svg'
  const ddpLogoSrc = `/assets/${brandName}/images/${iconName}`

  return (
    <div className="ActiveDDPBanner">
      <div className="ActiveDDPBanner-titleContainer">
        <Image
          alt={`DDP Logo`}
          className="ActiveDDPBanner-img"
          src={ddpLogoSrc}
        />

        <h3 className="ActiveDDPBanner-title">{`${ddpProductName} is active`}</h3>
      </div>
    </div>
  )
}

ActiveDDPBanner.propTypes = {
  ddpProductName: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
}

ActiveDDPBanner.contextTypes = {
  l: PropTypes.func,
}

export default ActiveDDPBanner
