import React from 'react'
import PropTypes from 'prop-types'
import Image from '../../../../../../shared/components/common/Image/Image'

const DDPAppliedToOrderMsg = ({ ddpProductName, brandName }, { l }) => {
  const msgTitle = l`Great news! ${ddpProductName} has been applied to your order.`
  const msgBody = l`Take advantage of your delivery perks right away!`
  const ddpLogoSrc = `/assets/${brandName}/images/ddp-icon.svg`

  return (
    <div className="DDPAppliedToOrderMsg">
      <div className="DDPAppliedToOrderMsg-titleContainer">
        <Image
          alt={`DDP Logo`}
          className="DDPAppliedToOrderMsg-img"
          src={ddpLogoSrc}
        />
        <h3 className="DDPAppliedToOrderMsg-title">{msgTitle}</h3>
      </div>
      <span className="DDPAppliedToOrderMsg-message">{msgBody}</span>
    </div>
  )
}

DDPAppliedToOrderMsg.propTypes = {
  ddpProductName: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
}

DDPAppliedToOrderMsg.contextTypes = {
  l: PropTypes.func,
}

export default DDPAppliedToOrderMsg
